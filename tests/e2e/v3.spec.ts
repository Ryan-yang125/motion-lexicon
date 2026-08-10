import { expect, test } from "@playwright/test";
import { registryComponents } from "../../src/data/component-registry";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth
  }));
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth);
}

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

test("primitive directory and workbench use the direct V3 routes", async ({ page }) => {
  await page.goto("/zh/primitives/");
  await expect(page.getByRole("heading", { level: 1, name: "原子动效" })).toBeVisible();
  await expect(page.locator(".primitive-card")).toHaveCount(canonicalMotionCatalog.length);
  await page.locator('.primitive-card[href="/zh/primitives/slide-in/"]').click();
  await expect(page).toHaveURL(/\/zh\/primitives\/slide-in\//);
  await expect(page.getByRole("heading", { level: 1, name: "滑入" })).toBeVisible();
  await expect(page.getByRole("slider").first()).toBeVisible();
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
  await hold.dispatchEvent("pointerdown", { pointerId: 1, pointerType: "mouse", button: 0, clientX: 20, clientY: 20 });
  await page.waitForTimeout(80);
  const initialClip = await hold.locator("[data-hold-fill]").evaluate((node) => (node as HTMLElement).style.clipPath);
  expect(Number(initialClip.match(/inset\(0px ([\d.]+)%/)?.[1])).toBeGreaterThan(0);
  await expect.poll(async () => {
    const clip = await hold.locator("[data-hold-fill]").evaluate((node) => (node as HTMLElement).style.clipPath);
    return Number(clip.match(/inset\(0px ([\d.]+)%/)?.[1]);
  }).toBeLessThan(100);
  await hold.dispatchEvent("pointerup", { pointerId: 1, pointerType: "mouse", button: 0, clientX: 20, clientY: 20 });
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
  expect(index.items).toHaveLength(registryComponents.length);
  const copyButton = await request.get("/r/copy-button.json");
  expect(copyButton.ok()).toBe(true);
  expect(await copyButton.json()).toMatchObject({ name: "copy-button", type: "registry:ui" });
});
