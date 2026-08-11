import { expect, test } from "@playwright/test";

test("selecting projects keeps the selected identity and Escape restores the card", async ({ page }) => {
  await page.goto("/");

  const northstar = page.getByRole("button", { name: /Northstar onboarding/ });
  const atlas = page.getByRole("button", { name: /Atlas reporting/ });
  await northstar.click();
  await expect(page.getByRole("heading", { name: "Northstar onboarding" })).toBeVisible();
  await expect(northstar).toHaveAttribute("aria-pressed", "true");

  await atlas.click();
  await expect(page.getByRole("heading", { name: "Atlas reporting" })).toBeVisible();
  await expect(atlas).toHaveAttribute("aria-pressed", "true");
  await expect(northstar).toHaveAttribute("aria-pressed", "false");

  await page.keyboard.press("Escape");
  await expect(page.getByText("Select a project")).toBeVisible();
  await expect(atlas).toBeFocused();

  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
});
