import { expect, test } from "@playwright/test";

const query = "卡片弹出来要有重量，最后收得住";

test("Finder restores a shared comparison and keeps variant CSS isolated", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "The complete comparison contract runs once on desktop.");

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
  await expect(page.locator(".finder-candidate")).toHaveCount(3);
  await expect(page.locator(".finder-candidate").nth(0)).toHaveAttribute("data-variant-id", "scale-in");
  await expect(page.locator("[data-variant-id='pop-in']")).toHaveClass(/is-selected/);

  const isolatedStyles = await page.locator(".finder-candidate-stage").evaluateAll((stages) =>
    stages.map((stage) => ({
      hasShadowRoot: Boolean(stage.shadowRoot),
      css: stage.shadowRoot?.querySelector("style")?.textContent ?? ""
    }))
  );
  expect(isolatedStyles.every((stage) => stage.hasShadowRoot)).toBe(true);
  expect(isolatedStyles[0].css).toContain("scale(0.92)");
  expect(isolatedStyles[1].css).toContain("scale(0.86)");
  const comparisonScenes = await page.locator(".finder-candidate-stage").evaluateAll((stages) =>
    stages.map((stage) => {
      const scene = stage.shadowRoot?.querySelector<HTMLElement>("[data-comparison-scene]");
      return {
        content: scene?.innerHTML ?? "",
        kind: scene?.dataset.comparisonKind,
        label: scene?.querySelector("strong")?.textContent ?? ""
      };
    })
  );
  expect(comparisonScenes.map((scene) => scene.kind)).toEqual(["entrance", "entrance", "entrance"]);
  expect(new Set(comparisonScenes.map((scene) => scene.content)).size).toBe(1);
  expect(comparisonScenes.map((scene) => scene.label)).toEqual(["产品更新", "产品更新", "产品更新"]);

  const springComparisonTarget = await page
    .locator("[data-variant-id='spring'] .finder-candidate-stage")
    .evaluate((stage) => {
      const target = stage.shadowRoot?.querySelector<HTMLElement>("[data-spring-target]");
      return target
        ? {
            cursor: getComputedStyle(target).cursor,
            pointerEvents: getComputedStyle(target).pointerEvents,
            tabIndex: target.tabIndex
          }
        : null;
    });
  expect(springComparisonTarget).toEqual({
    cursor: "default",
    pointerEvents: "none",
    tabIndex: -1
  });

  const replayTogether = page.getByRole("button", { name: "同步重播" });
  await replayTogether.focus();
  await expect(replayTogether).toBeFocused();
  await replayTogether.click();
  const comparisonGeometry = await page.locator(".finder-candidate-stage").evaluateAll((stages) =>
    stages.map((stage) => {
      const scene = stage.shadowRoot?.querySelector<HTMLElement>("[data-comparison-scene]");
      return {
        stageWidth: (stage as HTMLElement).offsetWidth,
        stageHeight: (stage as HTMLElement).offsetHeight,
        sceneWidth: scene?.offsetWidth ?? 0,
        sceneHeight: scene?.offsetHeight ?? 0
      };
    })
  );
  expect(new Set(comparisonGeometry.map((item) => `${item.stageWidth}x${item.stageHeight}`)).size).toBe(1);
  expect(new Set(comparisonGeometry.map((item) => `${item.sceneWidth}x${item.sceneHeight}`)).size).toBe(1);
  await expect(page.getByRole("heading", { level: 2, name: /调节.*弹入/ })).toBeVisible();

  await page.goto(
    `/zh/finder/?q=${encodeURIComponent(query)}&compare=scale-in,scale-in,pop-in&selected=scale-in`
  );
  await expect(page.locator(".finder-candidate")).toHaveCount(3);
  const normalizedVariants = await page.locator(".finder-candidate").evaluateAll((candidates) =>
    candidates.map((candidate) => candidate.getAttribute("data-variant-id"))
  );
  expect(normalizedVariants).toEqual(["scale-in", "pop-in", "spring"]);
  expect(new Set(normalizedVariants).size).toBe(3);
  expect(runtimeErrors).toEqual([]);
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

  await page.getByRole("button", { name: /选择.*弹入/ }).click();
  await expect(page).toHaveURL(/selected=pop-in/);
  await expect(page.locator("[data-variant-id='pop-in']")).toHaveClass(/is-selected/);

  const firstSlider = page.locator(".finder-tune").getByRole("slider").first();
  await firstSlider.press("ArrowRight");
  await expect(page).toHaveURL(/duration=/);

  await page.locator(".apple-export-disclosure summary").click();
  await page.getByRole("tab", { name: "Prompt" }).click();
  await expect(page).toHaveURL(/tab=prompt/);
  await firstSlider.press("ArrowRight");
  await expect(page).toHaveURL(/tab=prompt/);
  await page.reload();
  await expect(page.getByRole("tab", { name: "Prompt" })).toHaveAttribute("aria-selected", "true");

  const draft = "列表需要更轻、更连续地出现";
  await page.getByRole("searchbox", { name: "描述你想要的动效" }).fill(draft);
  await page.locator(".finder-tune").getByRole("slider").first().press("ArrowRight");
  await expect(page.getByRole("searchbox", { name: "描述你想要的动效" })).toHaveValue(draft);

  const selectButton = page.locator("[data-variant-id='pop-in'] .finder-select");
  const box = await selectButton.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test("Finder keeps every intent group on one neutral comparison scene", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Shared scene geometry runs once on desktop.");

  const scenarios = [
    { query: "卡片弹出来要有重量，最后收得住", kind: "entrance" },
    { query: "同一个缩略图展开成详情页", kind: "continuity" },
    { query: "列表一个接一个出现", kind: "sequence" }
  ];

  for (const scenario of scenarios) {
    await page.goto(`/zh/finder/?q=${encodeURIComponent(scenario.query)}`);
    await expect(page.locator(".finder-candidate")).toHaveCount(3);
    await page.getByRole("button", { name: "同步重播" }).click();

    const scenes = await page.locator(".finder-candidate-stage").evaluateAll((stages) =>
      stages.map((stage) => {
        const scene = stage.shadowRoot?.querySelector<HTMLElement>("[data-comparison-scene]");
        return {
          content: scene?.innerHTML ?? "",
          kind: scene?.dataset.comparisonKind,
          width: scene?.offsetWidth ?? 0,
          height: scene?.offsetHeight ?? 0,
          layers: scene
            ? Array.from(scene.querySelectorAll<HTMLElement>(".motion-state")).map((layer) => ({
                className: layer.className,
                position: getComputedStyle(layer).position,
                left: layer.offsetLeft,
                top: layer.offsetTop,
                width: layer.offsetWidth,
                height: layer.offsetHeight
              }))
            : []
        };
      })
    );

    expect(scenes.map((scene) => scene.kind)).toEqual([
      scenario.kind,
      scenario.kind,
      scenario.kind
    ]);
    expect(new Set(scenes.map((scene) => scene.content)).size).toBe(1);
    expect(new Set(scenes.map((scene) => `${scene.width}x${scene.height}`)).size).toBe(1);
    if (scenario.kind === "continuity") {
      expect(new Set(scenes.map((scene) => JSON.stringify(scene.layers))).size).toBe(1);
      expect(scenes[0].layers).toHaveLength(2);
      expect(scenes[0].layers.every((layer) => layer.position === "absolute")).toBe(true);
    }
  }
});

test("Finder remains readable on a mobile viewport", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile layout runs once in the mobile project.");

  await page.goto(`/en/finder/?q=${encodeURIComponent("bring in a list one by one")}`);
  await expect(page.locator("h1#finder-title")).toHaveText(/Describe the feel/);
  await expect(page.getByRole("region", { name: /Describe the feel/ })).toBeVisible();
  await expect(page.locator(".finder-candidate")).toHaveCount(3);

  const alternative = page.locator(".apple-motion-alternative").first();
  const alternativeId = await alternative.getAttribute("data-variant-id");
  const selectAlternative = alternative.locator(".finder-select");
  await expect(selectAlternative).toBeVisible();
  const target = await selectAlternative.boundingBox();
  expect(target?.height ?? 0).toBeGreaterThanOrEqual(44);
  await selectAlternative.click();
  await expect(page.locator(`[data-variant-id='${alternativeId}']`)).toHaveClass(/is-selected/);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("Finder header fits a narrow desktop viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Narrow desktop layout runs once in the desktop project.");

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/zh/finder/?q=${encodeURIComponent(query)}`);
  await expect(page.locator(".finder-candidate")).toHaveCount(3);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );
  expect(hasHorizontalOverflow).toBe(false);
});
