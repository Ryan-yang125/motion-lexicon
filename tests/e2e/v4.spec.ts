import { expect, test } from "@playwright/test";
import { registryComponents } from "../../src/data/component-registry";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import { installablePrimitiveEntries } from "../../src/data/primitive-registry";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
}

test("landing page presents live components, primitives, and the Skill entry", async ({ page }, testInfo) => {
  await page.goto("/zh/");
  await expect(page.getByRole("heading", { level: 1, name: "把成熟动效，直接带进产品。" })).toBeVisible();
  await expect(page.locator('[data-component="reorder-list"]')).toBeVisible();
  const firstTab = page.getByRole("tab", { name: "拖拽排序列表" });
  await firstTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "标签页" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "标签页" })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator('[data-component="tabs"]')).toBeVisible();
  await expect(page.getByRole("tabpanel", { name: "标签页" })).toBeVisible();
  await expect(page.locator(".landing-component-card")).toHaveCount(4);
  await expect(page.locator(".landing-primitive-card")).toHaveCount(3);
  for (const [index, id] of [[1, "loading-button"], [3, "value-flash"]] as const) {
    const card = page.locator(".landing-component-card").nth(index);
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator(`[data-component="${id}"]`)).toBeVisible();
    for (const control of await card.locator("button, a, input, select, textarea, [role='button']").all()) {
      const box = await control.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
  const skill = page.locator(".library-shell-header").getByRole("link", { name: "Skill" });
  await expect(skill).toHaveAttribute("href", "/zh/skill/");
  const github = page.locator(".library-shell-header").getByRole("link", { name: "GitHub" });
  await expect(github).toBeVisible();
  for (const link of [skill, github]) {
    expect(await link.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  }
  const brand = page.locator(".shell-landing-start").getByRole("link", { name: "Motion Lexicon" });
  const brandBox = await brand.boundingBox();
  expect(brandBox?.width).toBeGreaterThanOrEqual(44);
  expect(brandBox?.height).toBeGreaterThanOrEqual(44);
  if (!testInfo.project.name.includes("mobile")) {
    for (const link of await page.locator(".shell-landing-nav a").all()) {
      expect(await link.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    }
  }
  for (const control of await page.locator(".library-shell-header a, .library-shell-header button").all()) {
    if (!await control.isVisible()) continue;
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await expectNoHorizontalOverflow(page);
});

test("landing preview switches instantly with reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Reduced-motion landing contract runs once.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/");
  await page.getByRole("tab", { name: "标签页" }).click();
  const runningTransitions = await page.locator(".landing-stage-motion").evaluate((node) =>
    node.getAnimations().filter((animation) => animation.playState === "running").length
  );
  expect(runningTransitions).toBe(0);
});

test("component directory exposes all live registry components", async ({ page }) => {
  await page.goto("/zh/components/");
  await expect(page.getByRole("heading", { level: 1, name: "可直接复制的 React 动效组件" })).toBeVisible();
  await expect(page.locator(".component-card")).toHaveCount(registryComponents.length);
  await expect(page.locator('.shell-nav-link[aria-current="page"]')).toContainText("组件");
  await expect(page.locator('[data-component="copy-button"]')).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("component detail keeps preview, source, install, and related primitives together", async ({ page }) => {
  await page.goto("/zh/components/copy-button/");
  await expect(page.getByRole("heading", { level: 1, name: "复制按钮" })).toBeVisible();
  await expect(page.locator('[data-component="copy-button"]')).toBeVisible();
  await page.getByRole("radio", { name: "代码" }).click();
  await expect(page.locator(".component-source")).toContainText("export function CopyButton");
  await expect(page.locator(".component-install-panel code")).toContainText("/r/copy-button.json");
  await expect(page.getByRole("heading", { level: 2, name: "相关原子动效" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("primitive directory and workbench use the direct V4 routes", async ({ page }) => {
  await page.goto("/zh/primitives/");
  await expect(page.getByRole("heading", { level: 1, name: "可调节、可复制的 React 原子动效" })).toBeVisible();
  await expect(page.locator(".primitive-card")).toHaveCount(canonicalMotionCatalog.length);
  await expect(page.locator('[data-primitive="slide-in"]')).toBeVisible();
  await page.locator('.primitive-card-footer[href="/zh/primitives/slide-in/"]').click();
  await expect(page).toHaveURL(/\/zh\/primitives\/slide-in\//);
  await expect(page.getByRole("heading", { level: 1, name: "滑入" })).toBeVisible();
  await expect(page.getByRole("slider").first()).toBeVisible();
  await page.getByRole("radio", { name: "代码" }).click();
  await expect(page.locator(".primitive-source")).toContainText("export function SlideInPrimitive");
  await expect(page.locator(".component-install-panel code")).toContainText("/r/primitive-slide-in.json");
  await expectNoHorizontalOverflow(page);
});

test("global search opens immediately and navigates by keyboard", async ({ page }) => {
  await page.goto("/zh/components/");
  await page.locator(".shell-search-trigger").click();
  const search = page.getByRole("combobox", { name: "搜索 Motion Lexicon" });
  await expect(search).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(search).toBeFocused();
  await page.locator(".fixed.inset-0.z-50 > .absolute.inset-0").click({ position: { x: 4, y: 4 } });
  await expect(search).toBeHidden();
  await expect(page.locator(".shell-search-trigger")).toBeFocused();
  await page.locator(".shell-search-trigger").click();
  await expect(search).toBeFocused();
  await search.fill("drawer");
  await expect(page.getByRole("option", { name: /抽屉/ })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/zh\/components\/drawer\//);
  await expect(page.getByRole("heading", { level: 1, name: "抽屉" })).toBeVisible();
});

test("component keyboard and reduced-motion contracts remain intact", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Component keyboard contract runs once.");
  await page.goto("/zh/components/command-palette/");
  await page.getByRole("button", { name: "Open commands" }).click();
  await expect(page.getByRole("combobox", { name: "Command palette" })).toBeFocused();

  await page.goto("/zh/components/tabs/");
  const tabs = page.getByRole("tablist", { name: "Workspace sections" });
  const overview = tabs.getByRole("tab", { name: "Overview" });
  const activity = tabs.getByRole("tab", { name: "Activity" });
  await overview.focus();
  await page.keyboard.press("ArrowRight");
  await expect(activity).toBeFocused();
  await expect(activity).toHaveAttribute("aria-selected", "true");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/components/hold-to-confirm/");
  const hold = page.getByRole("button", { name: /Hold to delete workspace/ });
  await hold.focus();
  await page.keyboard.down("Space");
  await page.waitForTimeout(80);
  const initialClip = await hold.locator("[data-hold-fill]").evaluate((node) => (node as HTMLElement).style.clipPath);
  expect(Number(initialClip.match(/inset\(0px ([\d.]+)%/)?.[1])).toBeGreaterThan(0);
  await expect.poll(async () => {
    const clip = await hold.locator("[data-hold-fill]").evaluate((node) => (node as HTMLElement).style.clipPath);
    return Number(clip.match(/inset\(0px ([\d.]+)%/)?.[1]);
  }).toBeLessThan(100);
  await page.keyboard.up("Space");
});

test("mobile navigation, language, theme, and Agent Skill remain reachable", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile shell contract runs once.");
  await page.goto("/zh/components/");
  await page.getByRole("button", { name: "打开导航" }).click();
  const dialog = page.getByRole("dialog", { name: "站点导航" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: "Agent Skill" }).click();
  await expect(page).toHaveURL(/\/zh\/skill\//);
  await expect(page.getByRole("heading", { level: 1, name: "Motion Lexicon" })).toBeVisible();
  await page.goto("/zh/components/copy-button/");
  const copyHeight = await page.getByRole("button", { name: "复制代码" }).first().evaluate((button) => button.getBoundingClientRect().height);
  expect(copyHeight).toBeGreaterThanOrEqual(44);
  await expectNoHorizontalOverflow(page);
});

test("reduced motion stops non-essential task progress rotation", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Reduced-motion runtime contract runs once.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh/components/task-steps/");
  await expect(page.locator('[data-component="task-steps"]')).toBeVisible();
  const rotations = await page.locator('[data-component="task-steps"] svg').evaluateAll((icons) =>
    icons.flatMap((icon) => icon.getAnimations()).filter((animation) => animation.playState === "running").length
  );
  expect(rotations).toBe(0);
});

test("English routes and the shadcn registry are publishable", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Registry contract runs once.");
  await page.goto("/en/components/");
  await expect(page.getByRole("heading", { level: 1, name: "Copy-ready React motion components" })).toBeVisible();
  const registry = await request.get("/r/registry.json");
  expect(registry.ok()).toBe(true);
  const index = await registry.json() as { items: Array<{ name: string }> };
  expect(index.items).toHaveLength(registryComponents.length + installablePrimitiveEntries.length);
  const copyButton = await request.get("/r/copy-button.json");
  expect(copyButton.ok()).toBe(true);
  expect(await copyButton.json()).toMatchObject({ name: "copy-button", type: "registry:ui" });
  const slideIn = await request.get("/r/primitive-slide-in.json");
  expect(slideIn.ok()).toBe(true);
  expect(await slideIn.json()).toMatchObject({ name: "primitive-slide-in", type: "registry:ui" });
});
