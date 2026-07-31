import { expect, test } from "@playwright/test";

const query = "卡片弹出来要有重量，最后收得住";

test("Finder restores one active runtime and switches through three static candidates", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The complete selection contract runs once on desktop.");

  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });

  await page.goto(
    `/zh/finder/?q=${encodeURIComponent(query)}&compare=scale-in,pop-in,spring&selected=pop-in`
  );

  await expect(page).toHaveTitle(/动效选择器/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator(".finder-candidate-choice")).toHaveCount(3);
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);
  await expect(page.locator(".motion-demo")).toHaveCount(1);
  await expect(page.locator(".finder-active-preview")).toHaveAttribute("data-variant-id", "pop-in");
  await expect(page.locator(".finder-candidate-choice[data-variant-id='pop-in']")).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  const initialRuntime = await page.locator(".finder-candidate-stage").evaluate((stage) => ({
    hasShadowRoot: Boolean(stage.shadowRoot),
    runtimeCount: stage.shadowRoot?.querySelectorAll(".motion-demo").length ?? 0,
    css: stage.shadowRoot?.querySelector("style")?.textContent ?? "",
    sceneKind: stage.shadowRoot?.querySelector<HTMLElement>("[data-comparison-scene]")?.dataset.comparisonKind
  }));
  expect(initialRuntime.hasShadowRoot).toBe(true);
  expect(initialRuntime.runtimeCount).toBe(1);
  expect(initialRuntime.css).toContain("scale(0.86)");
  expect(initialRuntime.sceneKind).toBe("entrance");

  const staticChoices = await page.locator(".finder-candidate-choice").evaluateAll((choices) =>
    choices.map((choice) => ({
      hasShadowRoot: Boolean(choice.shadowRoot),
      runtimeCount: choice.querySelectorAll(".motion-demo, .finder-candidate-stage").length
    }))
  );
  expect(staticChoices.every((choice) => !choice.hasShadowRoot && choice.runtimeCount === 0)).toBe(true);

  await page.locator(".finder-candidate-choice[data-variant-id='scale-in']").click();
  await expect(page).toHaveURL(/selected=scale-in/);
  await expect(page.locator(".finder-active-preview")).toHaveAttribute("data-variant-id", "scale-in");
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);
  await expect(page.locator(".motion-demo")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 2, name: /调节.*缩放入场/ })).toBeVisible();
  const scaleCss = await page.locator(".finder-candidate-stage").evaluate(
    (stage) => stage.shadowRoot?.querySelector("style")?.textContent ?? ""
  );
  expect(scaleCss).toContain("scale(0.92)");

  await page.locator(".finder-candidate-choice[data-variant-id='spring']").click();
  await expect(page.locator(".finder-active-preview")).toHaveAttribute("data-variant-id", "spring");
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);
  await expect(page.locator(".motion-demo")).toHaveCount(1);
  const springTarget = await page.locator(".finder-candidate-stage").evaluate((stage) => {
    const target = stage.shadowRoot?.querySelector<HTMLElement>("[data-spring-target]");
    return target
      ? {
          cursor: getComputedStyle(target).cursor,
          pointerEvents: getComputedStyle(target).pointerEvents,
          tabIndex: target.tabIndex
        }
      : null;
  });
  expect(springTarget).toEqual({
    cursor: "default",
    pointerEvents: "none",
    tabIndex: -1
  });

  const replay = page.locator(".finder-active-preview").getByRole("button", { name: "重播" });
  await replay.focus();
  await expect(replay).toBeFocused();
  await replay.click();
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);

  await expect(page.getByText("高度匹配", { exact: true })).toHaveCount(0);
  await expect(page.locator(".finder-candidate-choice")).toHaveCount(3);
  await expect(page.locator(".finder-active-preview").getByRole("button", { name: "重播" })).toHaveCount(1);
  expect(runtimeErrors).toEqual([]);
});

test("Finder output tabs preserve the active preview DOM", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The output and preview identity contract runs once on desktop.");

  await page.goto(
    `/zh/finder/?q=${encodeURIComponent(query)}&compare=scale-in,pop-in,spring&selected=pop-in`
  );

  const stage = page.locator(".finder-candidate-stage");
  await expect(stage).toHaveCount(1);
  await expect(page.getByRole("tab", { name: "提示词" })).toHaveAttribute("aria-selected", "true");
  const originalRuntime = await stage.evaluateHandle(
    (element) => element.shadowRoot?.querySelector(".motion-demo") ?? null
  );

  await page.getByRole("tab", { name: "代码" }).click();
  await expect(page).toHaveURL(/tab=code/);
  await expect(page.getByRole("tab", { name: "代码" })).toHaveAttribute("aria-selected", "true");
  expect(await stage.evaluate(
    (element, runtime) => element.shadowRoot?.querySelector(".motion-demo") === runtime,
    originalRuntime
  )).toBe(true);
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);
  await expect(page.locator(".motion-demo")).toHaveCount(1);

  await page.getByRole("tab", { name: "提示词" }).click();
  await expect(page).not.toHaveURL(/(?:\?|&)tab=/);
  await expect(page.getByRole("tab", { name: "提示词" })).toHaveAttribute("aria-selected", "true");
  expect(await stage.evaluate(
    (element, runtime) => element.shadowRoot?.querySelector(".motion-demo") === runtime,
    originalRuntime
  )).toBe(true);

  await originalRuntime.dispose();
});

test("Finder candidate arrows move focus without replaying or changing selection", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Keyboard selection runs once on desktop.");

  await page.goto(
    `/zh/finder/?q=${encodeURIComponent(query)}&compare=scale-in,pop-in,spring&selected=pop-in`
  );
  const selected = page.locator(".finder-candidate-choice[data-variant-id='pop-in']");
  const next = page.locator(".finder-candidate-choice[data-variant-id='spring']");
  const stage = page.locator(".finder-candidate-stage");

  await expect(stage).toHaveAttribute("data-preview-static", "");
  await selected.focus();
  await selected.press("ArrowRight");
  await expect(next).toBeFocused();
  await expect(selected).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".finder-active-preview")).toHaveAttribute("data-variant-id", "pop-in");
  await expect(stage).toHaveAttribute("data-preview-static", "");

  await next.press("Enter");
  await expect(next).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".finder-active-preview")).toHaveAttribute("data-variant-id", "spring");
  await expect(page.locator(".finder-candidate-stage")).toHaveAttribute("data-preview-static", "");

  await page.locator(".finder-active-preview").getByRole("button", { name: "重播" }).click();
  await expect(page.locator(".finder-candidate-stage")).not.toHaveAttribute("data-preview-static", "");
});

test("Finder replay restarts every pure CSS candidate", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The CSS replay contract runs once on desktop.");
  await page.emulateMedia({ reducedMotion: "no-preference" });

  const scenarios = [
    {
      query,
      compare: "scale-in,pop-in,spring",
      selected: "scale-in"
    },
    {
      query,
      compare: "scale-in,pop-in,spring",
      selected: "pop-in"
    },
    {
      query: "一组列表依次出现，节奏清楚一点",
      compare: "stagger,delay,orchestration",
      selected: "stagger"
    },
    {
      query: "一组列表依次出现，节奏清楚一点",
      compare: "stagger,delay,orchestration",
      selected: "delay"
    },
    {
      query: "一组列表依次出现，节奏清楚一点",
      compare: "stagger,delay,orchestration",
      selected: "orchestration"
    }
  ];

  for (const scenario of scenarios) {
    const params = new URLSearchParams({
      q: scenario.query,
      compare: scenario.compare,
      selected: scenario.selected,
      duration: "1200"
    });
    await page.goto(`/zh/finder/?${params.toString()}`);

    const stage = page.locator(".finder-candidate-stage");
    await expect(page.locator(".finder-active-preview")).toHaveAttribute(
      "data-variant-id",
      scenario.selected,
      { timeout: 10_000 }
    );
    await expect.poll(
      () => stage.evaluate((host) =>
        host.shadowRoot
          ?.querySelector<HTMLElement>(".motion-demo")
          ?.getAnimations({ subtree: true }).length ?? 0
      ),
      { message: `${scenario.selected} should expose a CSS animation` }
    ).toBeGreaterThan(0);

    const primed = await stage.evaluate((host) => {
      const root = host.shadowRoot?.querySelector<HTMLElement>(".motion-demo");
      if (!root) throw new Error("Finder runtime root is unavailable");
      const animations = root.getAnimations({ subtree: true });
      for (const animation of animations) {
        const endTime = Number(animation.effect?.getComputedTiming().endTime ?? 1200);
        animation.pause();
        animation.currentTime = Number.isFinite(endTime) ? endTime : 1200;
      }
      return animations.map((animation) => ({
        currentTime: Number(animation.currentTime ?? 0),
        playState: animation.playState
      }));
    });
    expect(primed.length).toBeGreaterThan(0);
    expect(primed.every((animation) => animation.playState === "paused")).toBe(true);

    await page.locator(".finder-active-preview").getByRole("button", { name: "重播" }).click();

    const restarted = await stage.evaluate(async (host) => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const root = host.shadowRoot?.querySelector<HTMLElement>(".motion-demo");
      if (!root) throw new Error("Finder runtime root is unavailable");
      return root.getAnimations({ subtree: true }).map((animation) => {
        const endTime = Number(animation.effect?.getComputedTiming().endTime ?? 1200);
        return {
          currentTime: Number(animation.currentTime ?? 0),
          endTime: Number.isFinite(endTime) ? endTime : 1200,
          playState: animation.playState
        };
      });
    });
    expect(restarted).toHaveLength(primed.length);
    expect(restarted.every((animation) => animation.playState === "running")).toBe(true);
    expect(restarted.every((animation) => animation.currentTime < animation.endTime / 2)).toBe(true);
  }
});

test("Finder creates a shareable selection and parameter state", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Form, selection, and parameters run once on desktop.");

  await page.goto("/zh/finder/");
  const finderInput = page.getByRole("searchbox", { name: "描述你想要的动效" });
  await expect(finderInput).toBeEnabled();
  await finderInput.fill(query);
  await page.getByRole("button", { name: "查找候选" }).click();

  await expect(page).toHaveURL(/q=/);
  await expect(page).toHaveURL(/compare=/);
  await expect(page).toHaveURL(/selected=spring/);
  await expect(page.locator(".finder-candidate-choice")).toHaveCount(3);
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);

  const popInChoice = page.locator(".finder-candidate-choice[data-variant-id='pop-in']");
  await popInChoice.click();
  await expect(page).toHaveURL(/selected=pop-in/);
  await expect(popInChoice).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".finder-active-preview")).toHaveAttribute("data-variant-id", "pop-in");

  const firstSlider = page.locator(".finder-tune").getByRole("slider").first();
  await firstSlider.press("ArrowRight");
  await expect(page).toHaveURL(/duration=/);

  await page.getByRole("tab", { name: "代码" }).click();
  await expect(page).toHaveURL(/tab=code/);
  await firstSlider.press("ArrowRight");
  await expect(page).toHaveURL(/tab=code/);
  await page.reload();
  await expect(page.getByRole("tab", { name: "代码" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);

  const draft = "列表需要更轻、更连续地出现";
  await page.getByRole("searchbox", { name: "描述你想要的动效" }).fill(draft);
  await page.locator(".finder-tune").getByRole("slider").first().press("ArrowRight");
  await expect(page.getByRole("searchbox", { name: "描述你想要的动效" })).toHaveValue(draft);
});

test("Finder keeps every intent group on one neutral active scene", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The active scene contract runs once on desktop.");

  const scenarios = [
    { query: "卡片弹出来要有重量，最后收得住", kind: "entrance" },
    { query: "同一个缩略图展开成详情页", kind: "continuity" },
    { query: "列表一个接一个出现", kind: "sequence" }
  ];

  for (const scenario of scenarios) {
    await page.goto(`/zh/finder/?q=${encodeURIComponent(scenario.query)}`);
    await expect(page.locator(".finder-candidate-choice")).toHaveCount(3);
    await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);
    await expect(page.locator(".motion-demo")).toHaveCount(1);

    const scene = await page.locator(".finder-candidate-stage").evaluate((stage) => {
      const activeScene = stage.shadowRoot?.querySelector<HTMLElement>("[data-comparison-scene]");
      return {
        kind: activeScene?.dataset.comparisonKind,
        layers: activeScene
          ? Array.from(activeScene.querySelectorAll<HTMLElement>(".motion-state")).map((layer) => ({
              position: getComputedStyle(layer).position,
              width: layer.offsetWidth,
              height: layer.offsetHeight
            }))
          : []
      };
    });

    expect(scene.kind).toBe(scenario.kind);
    if (scenario.kind === "continuity") {
      expect(scene.layers).toHaveLength(2);
      expect(scene.layers.every((layer) => layer.position === "absolute")).toBe(true);
    }
  }
});

test("Finder candidate switches remain usable on a mobile viewport", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile layout runs once in the mobile project.");

  await page.goto(`/en/finder/?q=${encodeURIComponent("bring in a list one by one")}`);
  await expect(page.locator("h1#finder-title")).toHaveText(/Describe the feel/);
  await expect(page.getByRole("region", { name: /Describe the feel/ })).toBeVisible();
  await expect(page.locator(".finder-candidate-choice")).toHaveCount(3);
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);
  await expect(page.locator(".motion-demo")).toHaveCount(1);

  const choiceHeights = await page.locator(".finder-candidate-choice").evaluateAll((choices) =>
    choices.map((choice) => (choice as HTMLElement).getBoundingClientRect().height)
  );
  expect(choiceHeights.every((height) => height >= 44)).toBe(true);

  const alternative = page.locator(".finder-candidate-choice[aria-pressed='false']").first();
  const alternativeId = await alternative.getAttribute("data-variant-id");
  expect(alternativeId).toBeTruthy();
  await alternative.click();
  const selectedChoice = page.locator(
    `.finder-candidate-choice[data-variant-id='${alternativeId!}']`
  );
  await expect(selectedChoice).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".finder-active-preview")).toHaveAttribute("data-variant-id", alternativeId!);
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);
  await expect(page.locator(".motion-demo")).toHaveCount(1);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("Finder header fits a narrow desktop viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Narrow desktop layout runs once in the desktop project.");

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/zh/finder/?q=${encodeURIComponent(query)}`);
  await expect(page.locator(".finder-candidate-choice")).toHaveCount(3);
  await expect(page.locator(".finder-candidate-stage")).toHaveCount(1);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasHorizontalOverflow).toBe(false);
});
