import { expect, test } from "@playwright/test";

test.describe("motion performance budgets", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "Performance budgets run once in desktop Chromium.");
    await page.setViewportSize({ width: 1280, height: 960 });
  });

  test("rapid recipe parameters commit once per frame without remounting the runtime", async ({ page }, testInfo) => {
    await page.goto("/zh/springs/spring/");
    const previewRoot = page.locator(".motion-preview-runtime .motion-demo");
    await expect(previewRoot).toHaveAttribute("data-motion-runtime-active", "true");
    await previewRoot.evaluate((root) => { root.dataset.performanceProbe = "stable"; });

    const metrics = await page.locator(".control-number input").first().evaluate(async (element) => {
      const input = element as HTMLInputElement;
      const prompt = document.querySelector<HTMLElement>("[data-testid='prompt-output']");
      if (!prompt) throw new Error("Prompt output is unavailable for the performance probe");

      let runtimeMounts = 0;
      let promptMutations = 0;
      const longTasks: number[] = [];
      const frameGaps: number[] = [];
      const onRuntimeMount = () => { runtimeMounts += 1; };
      document.addEventListener("motion:runtime-mounted", onRuntimeMount);
      const mutationObserver = new MutationObserver((records) => { promptMutations += records.length; });
      mutationObserver.observe(prompt, { characterData: true, childList: true, subtree: true });
      const longTaskObserver = PerformanceObserver.supportedEntryTypes.includes("longtask")
        ? new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) longTasks.push(entry.duration);
          })
        : null;
      longTaskObserver?.observe({ entryTypes: ["longtask"] });

      const frames = new Promise<void>((resolve) => {
        let count = 0;
        let previous = performance.now();
        const sample = (now: number) => {
          frameGaps.push(now - previous);
          previous = now;
          count += 1;
          if (count >= 24) resolve();
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });

      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      if (!setValue) throw new Error("Native input value setter is unavailable");
      const min = Number(input.min);
      const max = Number(input.max);
      const step = Number(input.step);
      let finalValue = Number(input.value);
      for (let index = 0; index < 40; index += 1) {
        finalValue = Math.min(max, min + step * (index + 1));
        setValue.call(input, String(finalValue));
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }

      await frames;
      await new Promise((resolve) => setTimeout(resolve, 0));
      mutationObserver.disconnect();
      longTaskObserver?.disconnect();
      document.removeEventListener("motion:runtime-mounted", onRuntimeMount);

      const sortedGaps = [...frameGaps].sort((a, b) => a - b);
      const p95Index = Math.min(sortedGaps.length - 1, Math.floor(sortedGaps.length * 0.95));
      return {
        finalValue,
        runtimeMounts,
        promptMutations,
        maxFrameGap: Math.max(...frameGaps),
        p95FrameGap: sortedGaps[p95Index],
        blockingLongTasks: longTasks.filter((duration) => duration >= 100).length,
        totalLongTaskDuration: longTasks.reduce((total, duration) => total + duration, 0)
      };
    });
    testInfo.annotations.push({
      type: "performance",
      description: JSON.stringify(metrics)
    });

    await expect(previewRoot).toHaveAttribute("data-performance-probe", "stable");
    await expect(page.getByTestId("prompt-output")).toContainText(String(metrics.finalValue));
    await expect(page).toHaveURL(new RegExp(`stiffness=${metrics.finalValue}`));
    expect(metrics.runtimeMounts).toBe(0);
    expect(metrics.promptMutations).toBeLessThanOrEqual(2);
    expect(metrics.blockingLongTasks).toBe(0);
    expect(metrics.totalLongTaskDuration).toBeLessThanOrEqual(120);
    expect(metrics.maxFrameGap).toBeLessThanOrEqual(100);
    expect(metrics.p95FrameGap).toBeLessThanOrEqual(50);

    const stiffnessInput = page.locator("#motion-control-spring-stiffness");
    const distanceInput = page.locator("#motion-control-spring-distance");
    await stiffnessInput.fill("60");
    await distanceInput.fill("160");
    await expect(page).toHaveURL(/stiffness=60/);
    await expect(page).toHaveURL(/distance=160/);
    await expect(page.getByTestId("prompt-output")).toContainText("刚度 60");
    await expect(page.getByTestId("prompt-output")).toContainText("位移 160px");
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    await page.locator(".preview-toolbar").getByRole("button", { name: "重播" }).click();
    const travelProbe = await page.locator(".motion-preview-runtime [data-spring-target]").evaluate(
      async (node) => {
        const element = node as HTMLElement;
        let maximum = 0;
        await new Promise<void>((resolve) => {
          let frames = 0;
          const sample = () => {
            const match = element.style.transform.match(/translate3d\(0(?:px)?,\s*(-?[\d.]+)px,/);
            maximum = Math.max(maximum, Math.abs(Number(match?.[1] ?? 0)));
            frames += 1;
            if (frames >= 12) resolve();
            else requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
        });
        return {
          maximum,
          reduced: matchMedia("(prefers-reduced-motion: reduce)").matches
        };
      }
    );
    testInfo.annotations.push({
      type: "runtime-update",
      description: JSON.stringify({ distance: 160, ...travelProbe })
    });
    expect(travelProbe.maximum).toBeGreaterThan(100);
  });

  test("Finder keeps one Shadow DOM runtime while rapid parameters update in place", async ({ page }, testInfo) => {
    const query = encodeURIComponent("卡片弹出来要有重量，最后收得住");
    await page.goto(`/zh/finder/?q=${query}&compare=spring,pop-in,scale-in&selected=spring`);
    const stage = page.locator(".finder-active-preview .finder-candidate-stage");
    await expect(stage).toBeVisible();
    await stage.evaluate((host) => {
      const root = host.shadowRoot?.querySelector<HTMLElement>(".motion-demo");
      if (!root) throw new Error("Finder runtime root is unavailable");
      root.dataset.performanceProbe = "stable";
    });

    const metrics = await page.locator(".finder-tune .control-number input").first().evaluate(async (element) => {
      const input = element as HTMLInputElement;
      let runtimeMounts = 0;
      const onRuntimeMount = () => { runtimeMounts += 1; };
      document.addEventListener("motion:runtime-mounted", onRuntimeMount);
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      if (!setValue) throw new Error("Native input value setter is unavailable");
      const min = Number(input.min);
      const max = Number(input.max);
      const step = Number(input.step);
      let finalValue = Number(input.value);
      for (let index = 0; index < 40; index += 1) {
        finalValue = Math.min(max, min + step * (index + 1));
        setValue.call(input, String(finalValue));
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
      await new Promise<void>((resolve) => {
        let frames = 0;
        const wait = () => {
          frames += 1;
          if (frames >= 4) resolve();
          else requestAnimationFrame(wait);
        };
        requestAnimationFrame(wait);
      });
      document.removeEventListener("motion:runtime-mounted", onRuntimeMount);
      return { finalValue, runtimeMounts };
    });

    const shadowState = await stage.evaluate((host) => {
      const roots = host.shadowRoot?.querySelectorAll<HTMLElement>("[data-motion-runtime-active='true']") ?? [];
      const root = host.shadowRoot?.querySelector<HTMLElement>(".motion-demo");
      return {
        activeRuntimes: roots.length,
        probe: root?.dataset.performanceProbe ?? ""
      };
    });
    testInfo.annotations.push({
      type: "performance",
      description: JSON.stringify({ ...metrics, ...shadowState })
    });
    expect(metrics.runtimeMounts).toBe(0);
    expect(shadowState).toEqual({ activeRuntimes: 1, probe: "stable" });
    await expect(page).toHaveURL(new RegExp(`stiffness=${metrics.finalValue}`));
  });

  test("Finder spring replay restarts an active integration with the latest parameters", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const finderQuery = encodeURIComponent("卡片弹出来要有重量，最后收得住");
    await page.goto(
      `/zh/finder/?q=${finderQuery}&compare=spring,pop-in,scale-in&selected=spring` +
      "&stiffness=70&damping=6&mass=2.9&velocity=-20&distance=48"
    );

    const stage = page.locator(".finder-active-preview .finder-candidate-stage");
    await expect(stage).toBeVisible();
    await expect.poll(() => stage.evaluate((host) =>
      host.shadowRoot?.querySelector<HTMLElement>("[data-spring-target]")?.style.transform ?? ""
    )).toContain("translate3d");

    const latestValues = {
      stiffness: "60",
      damping: "5",
      mass: "3",
      velocity: "20",
      distance: "160"
    } as const;
    for (const [id, value] of Object.entries(latestValues)) {
      await page.locator(`#motion-control-spring-${id}`).fill(value);
    }
    await expect(page).toHaveURL(/stiffness=60/);
    await expect(page).toHaveURL(/damping=5/);
    await expect(page).toHaveURL(/mass=3/);
    await expect(page).toHaveURL(/velocity=20/);
    await expect(page).toHaveURL(/distance=160/);
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));

    const displacementBeforeReplay = await stage.evaluate((host) => {
      const transform = host.shadowRoot
        ?.querySelector<HTMLElement>("[data-spring-target]")
        ?.style.transform ?? "";
      return Number(transform.match(/translate3d\(0(?:px)?,\s*(-?[\d.]+)px,/)?.[1] ?? 0);
    });
    expect(Math.abs(displacementBeforeReplay)).toBeLessThan(100);

    await page.locator(".finder-active-preview").getByRole("button", { name: "重播" }).click();
    const displacementAfterReplay = await stage.evaluate(async (host) => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const transform = host.shadowRoot
        ?.querySelector<HTMLElement>("[data-spring-target]")
        ?.style.transform ?? "";
      return Number(transform.match(/translate3d\(0(?:px)?,\s*(-?[\d.]+)px,/)?.[1] ?? 0);
    });
    expect(displacementAfterReplay).toBeGreaterThan(140);
  });

  test("reduced motion keeps opacity feedback and removes spring travel", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/zh/springs/spring/");
    const target = page.locator(".motion-preview-runtime [data-spring-target]");
    await expect(target).toBeVisible();
    await page.locator(".preview-toolbar").getByRole("button", { name: "重播" }).click();

    const reducedState = await target.evaluate((node) => {
      const element = node as HTMLElement;
      const animations = element.getAnimations();
      const keyframes = animations.flatMap((animation) => {
        const effect = animation.effect;
        return effect instanceof KeyframeEffect ? effect.getKeyframes() : [];
      });
      return {
        computedTransform: getComputedStyle(element).transform,
        inlineTransform: element.style.transform,
        hasOpacityFeedback: keyframes.some((frame) => "opacity" in frame),
        hasTravel: keyframes.some((frame) => {
          const transform = String(frame.transform ?? "none");
          return transform !== "none" && transform !== "";
        })
      };
    });

    expect(reducedState.computedTransform).toBe("none");
    expect(reducedState.inlineTransform).toBe("");
    expect(reducedState.hasOpacityFeedback).toBe(true);
    expect(reducedState.hasTravel).toBe(false);
  });
});
