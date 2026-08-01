import { expect, test } from "@playwright/test";

test("Motion Pack gallery contains 28 interactive product moments and filters by group", async ({ page }) => {
  await page.goto("/zh/packs/");
  await expect(page.getByRole("heading", { name: "28 个完整产品瞬间" })).toBeVisible();
  await expect(page.getByTestId(/motion-pack-card-/)).toHaveCount(28);
  const gallery = page.locator("#packs");
  const filters = gallery.getByRole("tablist", { name: "按场景筛选 Pack" });
  await expect(filters.getByRole("tab", { name: "全部" })).toHaveAttribute("aria-controls", "packs-panel");
  await expect(page.locator("#packs-panel")).toHaveAttribute("aria-labelledby", "packs-tab-all");

  await filters.getByRole("tab", { name: "完成反馈" }).click();
  await expect(page.getByTestId(/motion-pack-card-/)).toHaveCount(7);
  await expect(page.getByTestId("motion-pack-card-save-confirmation")).toBeVisible();
  await expect(page.getByTestId("motion-pack-card-upload-complete")).toBeVisible();
  await expect(page.locator("#packs-panel")).toHaveAttribute("aria-labelledby", "packs-tab-feedback");

  await filters.getByRole("tab", { name: "完成反馈" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "选择决策" })).toHaveAttribute("aria-selected", "true");
});

test("Motion Pack detail provides a stateful preview and portable prompt/code outputs", async ({ page }) => {
  await page.goto("/zh/packs/save-confirmation/");
  await expect(page.getByRole("heading", { level: 1, name: "保存确认" })).toBeVisible();

  const preview = page.locator(".motion-pack-stage");
  const save = preview.getByRole("button", { name: "保存" });
  await save.click();
  await expect(preview.locator(".mpp-status")).toHaveText("正在保存");
  await expect(preview.getByRole("button", { name: "已保存" })).toBeVisible({ timeout: 1_500 });

  const exportPanel = page.locator(".motion-pack-export");
  await expect(exportPanel.getByRole("tab", { name: "提示词" })).toHaveAttribute("aria-selected", "true");
  await expect(exportPanel.getByRole("button", { name: "复制提示词" })).toBeVisible();
  await exportPanel.getByRole("tab", { name: "代码" }).click();
  await expect(exportPanel.getByRole("button", { name: "复制全部代码" })).toBeVisible();
  await expect(exportPanel.getByTestId("motion-pack-code")).toContainText("data-motion-pack");

  const foundations = page.locator(".motion-pack-foundations");
  await expect(foundations.getByRole("heading", { name: "关联动效基础" })).toBeVisible();
  await expect(foundations.getByTestId("pack-foundation-press-tap-feedback")).toBeVisible();
  await foundations.getByTestId("pack-foundation-press-tap-feedback").click();
  await expect(page).toHaveURL(/\/zh\/feedback\/press-tap-feedback\//);
  await expect(page.getByRole("heading", { level: 1, name: "按压 / 轻触反馈" })).toBeVisible();
  await expect(page.getByTestId("foundation-pack-save-confirmation")).toBeVisible();
});

test("primitive aliases retain their Product Moment relationships", async ({ page }) => {
  await page.goto("/zh/entrances/pop-in/");
  await expect(page.getByRole("heading", { level: 1, name: "弹入" })).toBeVisible();
  await expect(page.getByTestId("foundation-pack-card-selection")).toBeVisible();
});

test("Motion Pack pages stay within the viewport on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/packs/progress-steps/");
  await expect(page.getByRole("heading", { level: 1, name: "Progress steps" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
