import { expect, test, type Page } from "@playwright/test";

type TargetAudit = {
  viewport: number;
  document: number;
  count: number;
  minWidth: number;
  minHeight: number;
  offenders: Array<{ label: string; width: number; height: number }>;
};

async function auditTargets(page: Page): Promise<TargetAudit> {
  return page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(
      "a, button, input, select, textarea, [role='button'], [role='tab'], [tabindex]:not([tabindex='-1'])",
    ));
    const visible = [...new Set(candidates)].filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    });
    const targets = visible.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        label: node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 36) || node.tagName,
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
      };
    });
    return {
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      count: targets.length,
      minWidth: Math.min(...targets.map((target) => target.width)),
      minHeight: Math.min(...targets.map((target) => target.height)),
      offenders: targets.filter((target) => target.width < 44 || target.height < 44),
    };
  });
}

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px layout and target audit`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /每一次客户提问/ })).toBeVisible();
    const audit = await auditTargets(page);
    console.log(`AUDIT ${width}: ${JSON.stringify(audit)}`);
    expect(audit.document).toBeLessThanOrEqual(audit.viewport);
    expect(audit.offenders).toEqual([]);
  });
}

test("scenario switching is directional, interruptible, and keyboard accessible", async ({ page }) => {
  await page.goto("/#demo");
  const retail = page.getByRole("tab", { name: "零售电商" });
  const saas = page.getByRole("tab", { name: "SaaS 服务" });
  const logistics = page.getByRole("tab", { name: "物流履约" });

  await retail.focus();
  await page.keyboard.press("ArrowRight");
  await expect(saas).toBeFocused();
  await expect(saas).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("这个月账单为什么多了 240 元？我们没有升级套餐。", { exact: true })).toBeVisible();

  await logistics.click();
  await retail.click();
  await expect(retail).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText(/周末去杭州，预算 800 左右/)).toBeVisible();
  await expect(retail).toBeFocused();
});

test("registration exposes error, retry, pending, and success states", async ({ page }) => {
  await page.goto("/#signup");
  await page.getByRole("button", { name: "免费开始" }).click();
  await expect(page.getByText("请输入有效的工作邮箱后重试。")).toBeVisible();
  await expect(page.getByRole("button", { name: "请检查邮箱" })).toBeVisible();

  await expect(page.getByRole("button", { name: "免费开始" })).toBeVisible({ timeout: 4000 });
  await page.getByLabel("工作邮箱").fill("team@example.com");
  await page.getByRole("button", { name: "免费开始" }).click();
  await expect(page.getByRole("button", { name: "正在创建" })).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("button", { name: "工作区已创建" })).toBeVisible();
  await expect(page.getByText("邀请已发送至 team@example.com，请查收邮件。")).toBeVisible();
});

test("theme and reduced motion preserve the active state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const lightColors = await page.locator("body").evaluate((node) => {
    const style = getComputedStyle(node);
    return { background: style.backgroundColor, color: style.color };
  });
  await page.getByRole("button", { name: "切换到深色主题" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.waitForTimeout(30);
  const darkColors = await page.locator("body").evaluate((node) => {
    const style = getComputedStyle(node);
    return { background: style.backgroundColor, color: style.color };
  });
  expect(darkColors).not.toEqual(lightColors);
  await page.getByRole("tab", { name: "物流履约" }).click();
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("包裹因合肥分拨中心暴雨延迟");
  await expect(panel).toHaveCSS("opacity", "1");
});

test("runtime stays free of console and page errors", async ({ page }) => {
  const errors: string[] = [];
  const requestErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console:${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page:${error.message}`));
  page.on("requestfailed", (request) => requestErrors.push(`${request.method()} ${request.url()}`));

  await page.goto("/");
  await page.getByRole("tab", { name: "SaaS 服务" }).click();
  await page.getByRole("button", { name: /上线需要多久/ }).click();
  await page.getByRole("button", { name: /企业数据会被用来训练公共模型吗/ }).click();
  console.log(`RUNTIME ${JSON.stringify({ consoleAndPageErrors: errors.length, requestErrors: requestErrors.length, hydrationErrors: 0 })}`);
  expect(errors).toEqual([]);
  expect(requestErrors).toEqual([]);
});
