import { expect, test } from "@playwright/test";

const demoPath = "/status-becomes-action/";

test("completion reveals the next action in the same control", async ({ page }) => {
  await page.goto(demoPath);
  const control = page.locator("[data-action]");
  await control.click();
  await expect(page.locator("[data-status-action]")).toHaveAttribute("data-state", "pending");
  await expect(control).toHaveAccessibleName("Download export");
  await expect(page.locator("[data-status-action]")).toHaveAttribute("data-state", "ready");
  await expect(page.getByText("Export ready. Download export is now available.")).toBeVisible();
  await control.click();
  await expect(page.locator("[data-status-action]")).toHaveAttribute("data-state", "terminal");
});

test("failure recovers and rapid repeats commit only the latest request", async ({ page }) => {
  await page.goto(`${demoPath}?outcome=fail-once`);
  const control = page.locator("[data-action]");
  await Promise.all([control.click(), control.click()]);
  await expect(page.locator("[data-status-action]")).toHaveAttribute("data-state", "ready");
  await control.click();
  await expect(page.locator("[data-status-action]")).toHaveAttribute("data-state", "terminal");

  await page.goto(`${demoPath}?outcome=fail-once`);
  await page.getByRole("button", { name: "Generate export" }).click();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("button", { name: "Download export" })).toBeVisible();
});

test("keyboard, cancellation, reduced motion, and control geometry are preserved", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(demoPath);
  await page.keyboard.press("Tab");
  const control = page.locator("[data-action]");
  await expect(control).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-status-action]")).toHaveAttribute("data-state", "pending");
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-status-action]")).toHaveAttribute("data-state", "idle");
  await expect(control).toBeFocused();
  const audit = await control.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return { width: rect.width, height: rect.height, transition: getComputedStyle(node).transitionDuration };
  });
  expect(audit.width).toBeGreaterThanOrEqual(44);
  expect(audit.height).toBeGreaterThanOrEqual(44);
  expect(audit.transition).toContain("0.001s");
});
