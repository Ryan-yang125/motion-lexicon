import { expect, test } from "@playwright/test";

test("desktop landing page renders without horizontal overflow", async ({ page }) => {
  await page.goto("/zh/");
  await expect(page).toHaveTitle(/Motion Lexicon/);
  await expect(page.getByRole("heading", { name: /说出你要的感觉/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /开始描述动效/ })).toBeVisible();
  await expect(page.locator(".library-card")).toHaveCount(3);

  const hasHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(hasHorizontalOverflow).toBe(false);
});

test("english landing page renders english copy", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("heading", { name: /Describe the feel/ })).toBeVisible();
  await expect(page.getByText("一个能看")).toHaveCount(0);
});

test("brand mark keeps its easing geometry and theme contrast", async ({ page }) => {
  await page.goto("/en/");
  const marks = page.locator(".brand-mark-svg");
  await expect(marks).toHaveCount(2);
  await expect(marks.first().locator(".brand-mark-curve")).toHaveAttribute(
    "d",
    "M23 62C26 35 37 27 65 25"
  );

  const lightBackground = await marks.first().locator(".brand-mark-background").evaluate(
    (element) => getComputedStyle(element).fill
  );
  expect(lightBackground).toBe("rgb(21, 21, 22)");

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const darkBackground = await marks.first().locator(".brand-mark-background").evaluate(
    (element) => getComputedStyle(element).fill
  );
  const keyframe = await marks.first().locator(".brand-mark-keyframe").evaluate(
    (element) => getComputedStyle(element).fill
  );
  expect(darkBackground).toBe("rgb(245, 245, 247)");
  expect(keyframe).toBe("rgb(10, 132, 255)");
});

test("recipe controls update generated CSS, prompt, and URL query", async ({ page }) => {
  await page.goto("/zh/entrances/slide-in/");
  await expect(page.getByRole("heading", { level: 1, name: "滑入" })).toBeVisible();
  await page.locator(".apple-output-disclosure summary").click();

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
