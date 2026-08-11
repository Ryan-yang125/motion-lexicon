import { expect, test } from "@playwright/test";

test("project overview creates a project with clear in-list feedback", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "项目总览" })).toBeVisible();
  await page.getByRole("button", { name: "新建项目" }).click();
  await expect(page.getByText("已创建", { exact: true })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "已添加到列表顶部" })).toBeVisible();
  await expect(page.getByText("刚刚创建", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "项目列表" }).getByRole("listitem").first()).toContainText("增长实验室");
});

test("project overview has no horizontal overflow or undersized visible controls", async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const audit = await page.evaluate(() => {
      const interactive = Array.from(document.querySelectorAll<HTMLElement>("button, a, input, select, textarea, [role=button]"))
        .filter((node) => node.getBoundingClientRect().width > 0 && node.getBoundingClientRect().height > 0)
        .map((node) => ({ label: node.getAttribute("aria-label") ?? node.textContent?.trim() ?? node.tagName, width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height }));
      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        interactive,
      };
    });
    expect(audit.document, `${width}px overflow`).toBeLessThanOrEqual(audit.viewport);
    expect(audit.interactive.filter((node) => node.width < 44 || node.height < 44), `${width}px undersized: ${JSON.stringify(audit.interactive)}`).toEqual([]);
  }
});

test("theme and reduced-motion paths preserve the creation feedback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "切换深色主题" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "新建项目" }).focus();
  await expect(page.getByRole("button", { name: "新建项目" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status").filter({ hasText: "已添加到列表顶部" })).toBeVisible();
  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});
