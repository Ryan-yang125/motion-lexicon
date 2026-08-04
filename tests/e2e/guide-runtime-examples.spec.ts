import { expect, test } from "@playwright/test";
import { seoGuideArticles } from "../../src/data/seo-guide-articles";

function exampleFor(guideId: string) {
  const article = seoGuideArticles.find((candidate) => candidate.guideId === guideId);
  if (!article) throw new Error(`Missing guide example: ${guideId}`);
  return article.caseStudy.code;
}

test("publish example runs once while the working action is locked", async ({ page }) => {
  await page.setContent(exampleFor("save-submit-publish-feedback"));

  const publishButton = page.getByRole("button", { name: "Publish article" });
  const status = page.locator("[data-publish-status]");
  const requestCount = page.locator("[data-publish-submissions]");
  const result = page.locator("[data-publish-result]");

  await publishButton.focus();
  await page.keyboard.press("Enter");
  await expect(publishButton).toBeDisabled();
  await publishButton.evaluate((button) => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  await expect(requestCount).toHaveText("1");
  await expect(status).toHaveText("Article published. You can open it now.");
  await expect(result).toHaveAttribute("aria-hidden", "false");
  const publishedLink = page.getByRole("link", { name: "Open published article" });
  await expect(publishedLink).toBeVisible();
  await expect(publishedLink).toBeFocused();
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`deletion example preserves Undo and Delete focus with ${reducedMotion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.setContent(exampleFor("form-validation-delete-permission"));

    const row = page.locator("[data-project-row]");
    const deleteButton = page.getByRole("button", { name: "Delete" });
    const undoButton = page.getByRole("button", { name: "Undo" });
    const status = page.getByRole("status");

    await deleteButton.click();
    await expect(status).toHaveText("Project deleted. Undo is available.");
    await expect(undoButton).toBeFocused();
    await expect(row).toHaveCount(0);

    await undoButton.click();
    await expect(status).toHaveText("Project restored.");
    await expect(row).toBeVisible();
    await expect(deleteButton).toBeFocused();
  });
}

test("filter example cancels a stale transition and commits only the latest query", async ({ page }) => {
  await page.setContent(exampleFor("css-motion-jank"));

  const input = page.getByRole("searchbox", { name: "Filter projects" });
  const resultCount = page.getByRole("status");
  const results = page.locator("[data-result-list] .result-card");

  await expect(resultCount).toHaveText("4 projects shown.");
  await input.fill("alpha");
  await input.fill("delta");
  await expect(resultCount).toHaveText("1 project shown.");
  await expect(results).toHaveText(["Delta reports"]);
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`spring and ease-out example runs with visible saving feedback and no page errors in ${reducedMotion}`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    await page.emulateMedia({ reducedMotion });
    await page.setContent(exampleFor("spring-or-ease-out"));

    const drawer = page.locator("[data-drawer]");
    const saveButton = page.getByRole("button", { name: "Save settings" });
    const saveStatus = page.getByRole("status");
    const initialTransform = await drawer.evaluate((element) => (element as HTMLElement).style.transform);

    await page.getByRole("button", { name: "Open drawer" }).click();
    await expect.poll(() => drawer.evaluate((element) => (element as HTMLElement).style.transform)).not.toBe(initialTransform);

    await saveButton.click();
    await expect(saveStatus).toHaveAttribute("data-state", "saving");
    await expect(saveStatus).toHaveText("Saving settings.");
    await expect(saveStatus).toHaveText("Settings saved.");
    expect(runtimeErrors).toEqual([]);
  });
}

test("spring drawer reverses from its current position without jumping to the previous target", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setContent(exampleFor("spring-or-ease-out"));

  const drawer = page.locator("[data-drawer]");
  const toggle = page.locator("[data-drawer-toggle]");
  const drawerX = () =>
    drawer.evaluate((element) => {
      const match = (element as HTMLElement).style.transform.match(/translateX\(([-\d.]+)px\)/);
      return Number(match?.[1]);
    });

  await toggle.click();
  await expect.poll(async () => drawerX()).toBeGreaterThan(-236);
  const [beforeReverse, afterReverse] = await drawer.evaluate((element) => {
    const readX = () => Number((element as HTMLElement).style.transform.match(/translateX\(([-\d.]+)px\)/)?.[1]);
    const before = readX();
    (document.querySelector("[data-drawer-toggle]") as HTMLButtonElement).click();
    return [before, readX()];
  });

  expect(Math.abs(afterReverse - beforeReverse)).toBeLessThan(12);
  await expect.poll(async () => drawerX()).toBeLessThan(beforeReverse);
});

test("spring drawer lets a range drag take over and settle from the selected position", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setContent(exampleFor("spring-or-ease-out"));

  const drawer = page.locator("[data-drawer]");
  const range = page.locator("[data-drawer-range]");
  const drawerX = () =>
    drawer.evaluate((element) => Number((element as HTMLElement).style.transform.match(/translateX\(([-\d.]+)px\)/)?.[1]));

  await page.locator("[data-drawer-toggle]").click();
  await expect.poll(async () => drawerX()).toBeGreaterThan(-236);
  const [beforeTakeover, afterPointerDown] = await range.evaluate((input) => {
    const drawerElement = document.querySelector("[data-drawer]") as HTMLElement;
    const readX = () => Number(drawerElement.style.transform.match(/translateX\(([-\d.]+)px\)/)?.[1]);
    const before = readX();
    input.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    return [before, readX()];
  });
  expect(Math.abs(afterPointerDown - beforeTakeover)).toBeLessThan(12);

  await range.evaluate((input) => {
    (input as HTMLInputElement).value = "-160";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect.poll(async () => drawerX()).toBe(-160);

  await range.evaluate((input) => input.dispatchEvent(new Event("change", { bubbles: true })));
  await expect.poll(async () => drawerX()).toBeLessThan(-160);
});
