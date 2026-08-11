import { expect, test, type Page } from "@playwright/test";

type Audit = {
  viewport: number;
  document: number;
  minimumWidth: number;
  minimumHeight: number;
  count: number;
  offenders: { label: string; width: number; height: number }[];
};

async function auditTargets(page: Page): Promise<Audit> {
  return page.evaluate(() => {
    const selector = "button, a, input, select, textarea, [role='button'], [tabindex]:not([tabindex='-1'])";
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    });
    const measurements = nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        label: node.getAttribute("aria-label") || node.textContent?.trim().replace(/\s+/g, " ").slice(0, 48) || node.tagName,
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10,
      };
    });
    return {
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      minimumWidth: Math.min(...measurements.map((item) => item.width)),
      minimumHeight: Math.min(...measurements.map((item) => item.height)),
      count: measurements.length,
      offenders: measurements.filter((item) => item.width < 44 || item.height < 44),
    };
  });
}

for (const width of [320, 390, 768, 1440]) {
  test(`${width}px layout, overflow, and target audit`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    const requestErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("requestfailed", (request) => requestErrors.push(`${request.method()} ${request.url()}`));
    page.on("console", (message) => {
      if (message.type() === "error") runtimeErrors.push(message.text());
    });

    await page.setViewportSize({ width, height: 900 });
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: "All open" })).toBeVisible();
    const listAudit = await auditTargets(page);
    const audits = [listAudit];

    if (width < 700) {
      await page.locator(".ticket-row", { hasText: "Maya Chen" }).click();
      await expect(page.getByRole("heading", { name: "Unable to invite new teammates" })).toBeVisible();
      audits.push(await auditTargets(page));
    }

    const combined = {
      width,
      viewport: Math.min(...audits.map((item) => item.viewport)),
      document: Math.max(...audits.map((item) => item.document)),
      minimumWidth: Math.min(...audits.map((item) => item.minimumWidth)),
      minimumHeight: Math.min(...audits.map((item) => item.minimumHeight)),
      targetCount: audits.reduce((sum, item) => sum + item.count, 0),
      offenders: audits.flatMap((item) => item.offenders),
    };
    console.log(`AUDIT ${JSON.stringify(combined)}`);

    expect(combined.document).toBeLessThanOrEqual(combined.viewport);
    expect(combined.offenders).toEqual([]);
    expect(runtimeErrors).toEqual([]);
    expect(requestErrors).toEqual([]);
  });
}

test("reply success survives an interrupted selection", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/support");
  const textarea = page.getByRole("textbox", { name: "Reply to Maya Chen" });
  await textarea.fill("I found the mail queue issue and re-sent all three invitations.");
  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByRole("button", { name: "Sending…", exact: true })).toHaveAttribute("aria-busy", "true");

  await page.locator(".ticket-row", { hasText: "Oliver Grant" }).click();
  await expect(page.getByRole("heading", { name: "Invoice shows an extra seat" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send reply" })).toBeDisabled();

  await page.waitForTimeout(950);
  await page.locator(".ticket-row", { hasText: "Maya Chen" }).click();
  await expect(page.locator(".thread").getByText("I found the mail queue issue and re-sent all three invitations.", { exact: true })).toBeVisible();
  await expect(textarea).toHaveValue("");
});

test("reply error is recoverable and resolve is reversible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/support");
  const textarea = page.getByRole("textbox", { name: "Reply to Maya Chen" });
  await textarea.fill("fail this reply");
  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByRole("alert")).toContainText("Reply wasn’t sent");
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();

  await textarea.fill("The invitations have been re-sent successfully.");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator(".thread").getByText("The invitations have been re-sent successfully.", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Resolve", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Conversation resolved" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reopen ticket" })).toBeFocused();
  await page.getByRole("button", { name: "Reopen ticket" }).click();
  await expect(page.getByRole("button", { name: "Resolve", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resolve", exact: true })).toBeFocused();
});

test("keyboard focus, themes, and reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("/support");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Beacon support inbox" })).toBeFocused();
  await page.keyboard.press("Tab");
  const themeButton = page.getByRole("button", { name: "Toggle color theme" });
  await expect(themeButton).toBeFocused();
  const lightBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.waitForFunction((before) => getComputedStyle(document.body).backgroundColor !== before, lightBackground);
  const darkBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(darkBackground).not.toBe(lightBackground);

  const firstTicket = page.locator(".ticket-row", { hasText: "Maya Chen" });
  await firstTicket.click();
  await expect(page.getByRole("button", { name: /Inbox/ })).toBeFocused();
  await page.getByRole("button", { name: /Inbox/ }).click();
  await expect(firstTicket).toBeFocused();

  await page.locator(".ticket-row", { hasText: "Oliver Grant" }).click();
  const transform = await page.locator(".thread-and-composer").last().evaluate((node) => getComputedStyle(node).transform);
  expect(transform).toBe("none");
  console.log(`ACCESSIBILITY ${JSON.stringify({ focusReturn: true, lightBackground, darkBackground, reducedMotionTransform: transform })}`);
});
