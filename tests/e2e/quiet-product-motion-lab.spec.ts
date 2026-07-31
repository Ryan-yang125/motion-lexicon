import { expect, test } from "@playwright/test";

test.describe("Quiet Product Motion lab", () => {
  test.skip(process.env.MOTION_LEXICON_LAB !== "1", "The lab route is available only from the local Vite server.");

  test("keeps four real-product studies interactive and within the viewport", async ({ page }) => {
    await page.goto("/zh/lab/quiet-product-motion/");

    await expect(page.getByTestId("quiet-product-motion-lab")).toBeVisible();
    await expect(page.locator("[data-motion-sample]")).toHaveCount(4);

    const save = page.locator('[data-motion-sample="save"] button[data-state]');
    await save.click();
    await expect(save).toHaveAttribute("aria-busy", "true");
    await expect(save).toHaveAttribute("data-state", "saved", { timeout: 1_500 });

    const choice = page.locator('[data-motion-sample="choice"] [role="radio"]');
    await choice.nth(2).click();
    await expect(choice.nth(2)).toHaveAttribute("aria-checked", "true");

    const insertion = page.locator('[data-motion-sample="insertion"]');
    await expect(insertion.locator("li")).toHaveCount(2);
    await insertion.getByRole("button", { name: /添加图层|Add layer/ }).click();
    await expect(insertion.locator("li")).toHaveCount(3);

    const forgiveness = page.locator('[data-motion-sample="forgiveness"]');
    await forgiveness.getByRole("button", { name: /移到归档|Move to archive/ }).click();
    await expect(forgiveness.getByRole("button", { name: /撤销|Undo/ })).toBeVisible();
    await forgiveness.getByRole("button", { name: /撤销|Undo/ }).click();
    await expect(forgiveness.getByText(/已恢复|Restored/)).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test("keeps state feedback available with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/lab/quiet-product-motion/");

    const save = page.locator('[data-motion-sample="save"] button[data-state]');
    await save.click();
    await expect(save).toHaveAttribute("data-state", "saved", { timeout: 1_500 });
    await expect(page.getByRole("heading", { name: "Quiet Product Motion" })).toBeVisible();
  });
});
