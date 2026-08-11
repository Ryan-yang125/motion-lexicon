import { expect, test } from "@playwright/test";

test("support inbox completes send, recovery, interruption, and resolved workflows", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const requestFailures: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("requestfailed", (request) => requestFailures.push(`${request.method()} ${request.url()}`));

  await page.goto("/support");
  await expect(page.getByRole("heading", { name: "Inbox" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Olivia Martin/ })).toHaveAttribute("aria-current", "true");

  await page.getByRole("button", { name: "Resolved 1" }).click();
  await expect(page.getByRole("button", { name: /Noah Williams/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Olivia Martin/ })).toBeHidden();
  await page.getByRole("button", { name: "All 4" }).click();
  await page.getByPlaceholder("Search tickets").fill("Sofia");
  await expect(page.getByRole("button", { name: /Sofia Rossi/ })).toBeVisible();
  await page.getByPlaceholder("Search tickets").fill("");

  const reply = page.getByLabel("Reply to Olivia Martin");
  await reply.fill("I found the trace reference and sent it to your email.");
  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("button", { name: "Sent", exact: true })).toBeVisible();
  await expect(page.getByText("Reply sent to Olivia Martin.")).toBeVisible();
  await expect(page.getByLabel("Ticket TK-2841").getByText("I found the trace reference and sent it to your email.")).toBeVisible();

  await reply.fill("fail this delivery");
  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("wasn’t delivered");
  await reply.fill("Retry with a valid reply.");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: "Sent", exact: true })).toBeVisible();

  await reply.fill("Keep this draft if I change tickets.");
  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByRole("button", { name: "Sending…" })).toBeVisible();
  await page.getByRole("button", { name: /Marcus Chen/ }).click();
  await expect(page.getByRole("heading", { name: "Unable to invite a teammate" })).toBeVisible();
  await expect(page.getByText("Reply to Olivia Martin canceled. Draft saved.")).toBeVisible();
  await page.waitForTimeout(950);
  await expect(page.getByRole("heading", { name: "Unable to invite a teammate" })).toBeVisible();
  await page.getByRole("button", { name: /Olivia Martin/ }).click();
  await expect(reply).toHaveValue("Keep this draft if I change tickets.");

  await page.getByRole("button", { name: "Resolve", exact: true }).click();
  await expect(page.getByText("Conversation resolved")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reopen ticket" })).toBeVisible();
  await page.getByRole("button", { name: "Reopen ticket" }).click();
  await expect(page.getByLabel("Reply to Olivia Martin")).toBeVisible();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
  expect(requestFailures).toEqual([]);
});

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px has no overflow and all visible controls meet 44px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 800 : 900 });
    await page.goto("/support");
    const auditVisible = () => page.evaluate(() => {
      const selector = "button, a, input, select, textarea, [role='button'], [tabindex]:not([tabindex='-1'])";
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      });
      const sizes = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return { label: node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 50) || node.tagName, width: rect.width, height: rect.height };
      });
      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        count: sizes.length,
        minWidth: Math.min(...sizes.map((item) => item.width)),
        minHeight: Math.min(...sizes.map((item) => item.height)),
        offenders: sizes.filter((item) => item.width < 44 || item.height < 44),
      };
    });
    const audits = [await auditVisible()];
    if (width <= 720) {
      await page.getByRole("button", { name: /Olivia Martin/ }).click();
      audits.push(await auditVisible());
    }
    const audit = {
      viewport: Math.min(...audits.map((item) => item.viewport)),
      document: Math.max(...audits.map((item) => item.document)),
      count: audits.reduce((total, item) => total + item.count, 0),
      minWidth: Math.min(...audits.map((item) => item.minWidth)),
      minHeight: Math.min(...audits.map((item) => item.minHeight)),
      offenders: audits.flatMap((item) => item.offenders),
      states: audits.length,
    };
    console.log(`AUDIT ${width}: ${JSON.stringify(audit)}`);
    expect(audit.document).toBeLessThanOrEqual(audit.viewport);
    expect(audit.offenders).toEqual([]);
  });
}

test("theme, keyboard focus, mobile return, and reduced motion preserve the workflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/support");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Toggle dark theme" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("button", { name: "Toggle dark theme" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /Olivia Martin/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Refund not showing on card" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Inbox" })).toBeVisible();
  await page.getByRole("button", { name: "Inbox" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: /Olivia Martin/ })).toBeVisible();

  const transition = await page.getByText("Today", { exact: true }).evaluate((node) => getComputedStyle(node.closest(".message-thread")!).transitionDuration);
  expect(Number.parseFloat(transition)).toBeLessThanOrEqual(0.001);
});
