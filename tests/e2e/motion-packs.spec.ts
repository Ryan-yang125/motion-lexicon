import { expect, test } from "@playwright/test";

test("Motion Pack gallery contains 16 interactive product moments and filters by group", async ({ page }) => {
  await page.goto("/zh/packs/");
  await expect(page.getByRole("heading", { name: "16 个真实产品瞬间" })).toBeVisible();
  await expect(page.getByTestId(/motion-pack-card-/)).toHaveCount(16);

  await page.getByRole("tab", { name: "完成反馈" }).click();
  await expect(page.getByTestId(/motion-pack-card-/)).toHaveCount(4);
  await expect(page.getByTestId("motion-pack-card-save-confirmation")).toBeVisible();
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
});

test("Motion Pack pages stay within the viewport on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/packs/progress-steps/");
  await expect(page.getByRole("heading", { level: 1, name: "Progress steps" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
