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
  await page.keyboard.press("ControlOrMeta+K");
  const search = page.getByRole("combobox", { name: "搜索 Motion Lexicon" });
  await expect(search).toBeFocused();
  await search.fill("drawer");
  await expect(page.getByRole("option", { name: /抽屉/ })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/zh\/components\/drawer\//);
  await expect(page.getByRole("heading", { level: 1, name: "抽屉" })).toBeVisible();
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
  await expectNoHorizontalOverflow(page);
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
