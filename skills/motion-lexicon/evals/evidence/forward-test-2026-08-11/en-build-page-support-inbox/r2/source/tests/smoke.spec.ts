import { expect, test } from "@playwright/test";

test("support inbox supports async reply, interruption, error retry, and resolution", async ({ page, browser }, testInfo) => {
  await page.goto("/support");
  await expect(page.getByRole("heading", { name: "Inbox" })).toBeVisible();
  await page.getByLabel("Reply to Maya Chen").fill("I found the missing records and republished the export.");
  await page.getByRole("button", { name: "Send reply" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Sending…" })).toBeVisible();
  await page.getByRole("button", { name: /Invoice needs our PO number/ }).click();
  await expect(page.getByLabel("Reply to Owen Wright")).toBeVisible();
  await page.getByRole("button", { name: "Resolve ticket" }).click();
  await expect(page.getByText("Ticket resolved")).toBeVisible();
  await page.getByRole("button", { name: "Reopen", exact: true }).click();
  await page.getByLabel("Reply to Owen Wright").fill("Please fail this delivery");
  await page.getByRole("button", { name: "Send reply" }).click();
  await expect(page.getByRole("button", { name: "Retry send" })).toBeVisible();
  await page.getByLabel("Reply to Owen Wright").fill("The updated invoice is attached.");
  await page.getByRole("button", { name: "Retry send" }).click();
  await expect(page.getByRole("button", { name: "Sent" })).toBeVisible();
  const touchContext = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(new URL("/support", testInfo.project.use.baseURL as string).toString());
  await touchPage.getByLabel("Reply to Maya Chen").fill("Touch submission check");
  const sendBox = await touchPage.getByRole("button", { name: "Send reply" }).boundingBox();
  expect(sendBox).not.toBeNull();
  await touchPage.touchscreen.tap(sendBox!.x + sendBox!.width / 2, sendBox!.y + sendBox!.height / 2);
  await expect(touchPage.getByRole("button", { name: "Sending…" })).toBeVisible();
  await touchContext.close();
});

test("support inbox meets layout, theme, keyboard, motion, and runtime checks", async ({ page }) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const requestErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("requestfailed", (request) => requestErrors.push(`${request.method()} ${request.url()}`));
  page.on("response", (response) => { if (response.status() >= 400) requestErrors.push(`${response.status()} ${response.url()}`); });
  const viewports = [320, 390, 768, 1440];
  const audits: Array<{ width: number; documentWidth: number; minimum: { width: number; height: number }; offenders: string[] }> = [];

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/support");
    const audit = await page.evaluate(() => {
      const visible = (element: Element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && box.width > 0 && box.height > 0;
      };
      const items = Array.from(document.querySelectorAll<HTMLElement>("button, a, input, select, textarea, [role='radio']")).filter(visible);
      const boxes = items.map((element) => ({ label: element.getAttribute("aria-label") || element.textContent?.trim() || element.tagName, ...element.getBoundingClientRect().toJSON() }));
      const offenders = boxes.filter((box) => box.width < 44 || box.height < 44).map((box) => `${box.label}: ${Math.round(box.width)}x${Math.round(box.height)}`);
      return { width: document.documentElement.clientWidth, documentWidth: document.documentElement.scrollWidth, minimum: { width: Math.min(...boxes.map((box) => box.width)), height: Math.min(...boxes.map((box) => box.height)) }, offenders };
    });
    audits.push(audit);
    expect(audit.documentWidth).toBeLessThanOrEqual(audit.width);
    expect(audit.offenders).toEqual([]);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/support");
  await page.getByRole("button", { name: "Theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Theme" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);

  await page.getByLabel("Reply to Maya Chen").fill("Keyboard path check");
  await page.getByLabel("Reply to Maya Chen").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Send reply" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByLabel("Reply to Maya Chen")).toBeFocused();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: /Invoice needs our PO number/ }).click();
  await expect(page.getByLabel("Reply to Owen Wright")).toBeVisible();
  const reducedTransition = await page.locator(".conversation-frame").evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(reducedTransition)).toBeLessThanOrEqual(0.01);
  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(requestErrors).toEqual([]);
  console.log("SUPPORT_AUDIT", JSON.stringify(audits));
});
