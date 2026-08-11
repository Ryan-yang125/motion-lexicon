import { expect, test } from "@playwright/test";

test("AI customer service landing page works across layouts", async ({ page }) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(`${message.text()} @ ${message.location().url}`); });
  page.on("response", (response) => { if (response.status() >= 400) consoleErrors.push(`${response.status()} ${response.url()}`); });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /让每一次客户对话/ })).toBeVisible();

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const audit = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("button, a, input, select, textarea, [role='tab']"));
      const sizes = nodes.filter((node) => {
        const style = getComputedStyle(node);
        return style.display !== "none" && style.visibility !== "hidden";
      }).map((node) => {
        const rect = node.getBoundingClientRect();
        return { label: node.getAttribute("aria-label") || node.textContent?.trim(), width: rect.width, height: rect.height };
      }).filter((node) => node.width > 0 && node.height > 0);
      return { viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, sizes };
    });
    console.info(`AUDIT ${width}: ${JSON.stringify({ viewport: audit.viewport, document: audit.document, minWidth: Math.min(...audit.sizes.map((item) => item.width)), minHeight: Math.min(...audit.sizes.map((item) => item.height)) })}`);
    expect(audit.document).toBeLessThanOrEqual(audit.viewport);
    const offenders = audit.sizes.filter((item) => item.width < 44 || item.height < 44);
    expect(offenders, `target offenders at ${width}px: ${JSON.stringify(offenders)}`).toEqual([]);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("tab", { name: "电商售后" }).click();
  await page.getByRole("tab", { name: "SaaS 支持" }).click();
  await expect(page.getByText("SSO 域名限制")).toBeVisible();
  await page.getByRole("tab", { name: "即时配送" }).click();
  await expect(page.getByText("延误券")).toBeVisible();
  await page.getByRole("tab", { name: "即时配送" }).focus();
  await page.getByRole("tab", { name: "即时配送" }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: "SaaS 支持" })).toBeFocused();
  await expect(page.getByText("SSO 域名限制")).toBeVisible();
  await page.getByLabel("工作邮箱").fill("not-an-email");
  await page.getByRole("button", { name: /免费创建工作区/ }).last().click();
  await expect(page.getByText("请输入有效的工作邮箱后重试。")).toBeVisible();
  await page.getByLabel("工作邮箱").fill("team@xingqiao.ai");
  await page.getByRole("button", { name: /免费创建工作区/ }).last().click();
  await expect(page.getByRole("button", { name: "正在创建…" })).toBeVisible();
  await expect(page.getByText("欢迎！我们已准备好你的工作区。")).toBeVisible();
  await page.getByLabel("切换深色模式").click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByLabel("切换深色模式").click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("tab", { name: "电商售后" }).click();
  await expect(page.getByText("发起快递核查")).toBeVisible();
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
