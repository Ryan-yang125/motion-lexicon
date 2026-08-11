import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`layout and targets at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /让每一次回应/ })).toBeVisible();
    const audit = await page.locator("a, button, input, select, textarea, [role=button], [role=radio]").evaluateAll((nodes) => {
      const measurements = nodes.filter((node) => {
        const style = getComputedStyle(node); const rect = node.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      }).map((node) => {
        const rect = node.getBoundingClientRect();
        return { label: (node.textContent || node.getAttribute("aria-label") || node.tagName).trim(), width: rect.width, height: rect.height };
      });
      return { viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, minimum: measurements.reduce((min, item) => ({ width: Math.min(min.width, item.width), height: Math.min(min.height, item.height) }), { width: Infinity, height: Infinity }), offenders: measurements.filter((item) => item.width < 44 || item.height < 44) };
    });
    expect(audit.document).toBeLessThanOrEqual(audit.viewport);
    expect(audit.offenders).toEqual([]);
  });
}

test("primary interaction, theme, FAQ, form and keyboard flows", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("radio", { name: "订单进度" }).click();
  await expect(page.getByText("订单 #EK-2608")).toBeVisible();
  await page.getByRole("radio", { name: "异常处理" }).click();
  await expect(page.getByText("新买的咖啡机漏水")).toBeVisible();
  await page.getByRole("radio", { name: "售前咨询" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "订单进度" })).toBeFocused();
  await page.getByRole("button", { name: "切换浅色或深色主题" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "切换浅色或深色主题" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("heading", { name: "把顾虑讲清楚。" }).scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "AI 无法解决时会发生什么？" }).click();
  await expect(page.getByText("它会根据意图、情绪和业务规则升级给人工")).toBeVisible();
  await page.getByLabel("工作邮箱").fill("invalid");
  await page.getByRole("button", { name: "创建工作区" }).click();
  await expect(page.getByText("请输入有效的工作邮箱后重试。")).toBeVisible();
  await page.getByLabel("工作邮箱").fill("team@relay.example");
  await page.getByRole("button", { name: "创建工作区" }).click();
  await expect(page.getByText("工作区已创建：请查看你的邮箱完成设置。")).toBeVisible();
  expect(errors).toEqual([]);
});

test("reduced motion preserves scenario state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("radio", { name: "异常处理" }).click();
  await expect(page.getByText("专员将在 3 分钟内接入")).toBeVisible();
});
