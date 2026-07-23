import { expect, test } from "@playwright/test";

test("desktop landing page renders without horizontal overflow", async ({ page }) => {
  await page.goto("/zh/");
  await expect(page).toHaveTitle(/Motion Lexicon/);
  await expect(page.getByRole("heading", { name: /看得见、调得动/ })).toBeVisible();
  await expect(page.locator(".library-card")).toHaveCount(6);

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(hasHorizontalOverflow).toBe(false);
});

test("english landing page renders english copy", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { name: /See it\. Tune it\./ })).toBeVisible();
  await expect(page.getByText("一个能看")).toHaveCount(0);
});

test("recipe controls update generated CSS, prompt, and URL query", async ({ page }) => {
  await page.goto("/zh/entrances/slide-in/");
  await expect(page.getByRole("heading", { level: 1, name: "滑入" })).toBeVisible();

  await page.getByRole("slider").first().press("ArrowRight");

  await expect(page.getByTestId("css-output")).toContainText("260ms");
  await page.getByRole("tab", { name: "Prompt" }).click();
  await expect(page.getByTestId("prompt-output")).toContainText("260ms");
  await expect(page).toHaveURL(/duration=260/);

  await page.getByRole("radio", { name: /清脆/ }).click();
  await page.getByRole("tab", { name: "CSS" }).click();
  await expect(page.getByTestId("css-output")).toContainText("cubic-bezier(0.16, 1, 0.3, 1)");
  await expect(page).toHaveURL(/ease=snap/);
});

test("copy prompt button reports success", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/en/entrances/slide-in/");
  await page.getByRole("button", { name: /Copy current prompt/ }).first().click();
  await expect(page.getByRole("button", { name: /Copied/ }).first()).toBeVisible();
});

test("mobile route is readable without horizontal overflow", async ({ page }) => {
  await page.goto("/en/entrances/slide-in/");
  await expect(page.getByRole("heading", { level: 1, name: "Slide in" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(hasHorizontalOverflow).toBe(false);
});
