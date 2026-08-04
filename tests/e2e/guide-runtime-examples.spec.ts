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
