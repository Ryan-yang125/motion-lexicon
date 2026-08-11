import { expect, test } from "@playwright/test";

test("projects keep their identity through interrupted selections and Escape", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Make progress visible." })).toBeVisible();
  const northstar = page.getByRole("button", { name: "Inspect Northstar" });
  const fable = page.getByRole("button", { name: "Inspect Fable" });
  await northstar.click();
  await expect(page.getByRole("heading", { name: "Northstar" })).toBeVisible();
  await fable.click();
  await expect(page.getByRole("heading", { name: "Fable" })).toBeVisible();
  await expect(fable).toHaveAttribute("aria-pressed", "true");
  await expect(northstar).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: "Close Fable inspector" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(fable).toBeFocused();
});

for (const viewport of [320, 390, 768, 1440]) {
  test(`project workspace has no horizontal overflow at ${viewport}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Inspect Horizon" }).click();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      targets: Array.from(document.querySelectorAll("button")).map((node) => {
        const rect = node.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    }));
    expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
    for (const target of dimensions.targets) {
      expect(target.width).toBeGreaterThanOrEqual(44);
      expect(target.height).toBeGreaterThanOrEqual(44);
    }
  });
}
