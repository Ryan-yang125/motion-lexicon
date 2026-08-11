import { expect, test } from "@playwright/test";

test("project overview renders without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "项目总览" })).toBeVisible();
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});

test("creates a project and shows clear list feedback", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "新建项目" }).click();
  await page.getByLabel("项目名称").fill("北极星增长计划");
  await page.getByRole("button", { name: "创建项目" }).click();
  await expect(page.getByText("北极星增长计划")).toBeVisible();
  await expect(page.getByText("已创建", { exact: true })).toBeVisible();
});
