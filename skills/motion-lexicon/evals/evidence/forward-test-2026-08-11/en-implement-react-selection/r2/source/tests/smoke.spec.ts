import { expect, test } from "@playwright/test";

test("project cards open an inspector without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Active projects" })).toBeVisible();
  const northstarCard = page.getByRole("button", { name: /northstar/i });
  const lumenCard = page.getByRole("button", { name: /lumen launch/i });

  await northstarCard.click();
  await lumenCard.click();
  await expect(page.getByRole("heading", { name: "Lumen launch" })).toBeVisible();
  await expect(northstarCard).toHaveAttribute("aria-pressed", "false");
  await expect(lumenCard).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Lumen launch" })).not.toBeVisible();
  await expect(lumenCard).toHaveAttribute("aria-pressed", "true");
  await expect(lumenCard).toBeFocused();
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});
