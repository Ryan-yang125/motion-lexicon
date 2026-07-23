import { expect, test } from "@playwright/test";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";

test("landing page exposes GitHub, CLI, Skill, and versioned public data", async ({ page, request }) => {
  await page.goto("/zh/");

  await expect(page.getByRole("link", { name: "Motion Lexicon on GitHub" })).toHaveAttribute(
    "href",
    repositoryUrl
  );
  await expect(page.getByText("npx github:Ryan-yang125/motion-lexicon", { exact: true })).toBeVisible();
  await expect(
    page.getByText("npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon", {
      exact: true
    })
  ).toBeVisible();

  const catalogResponse = await request.get("/data/v1/catalog.json");
  expect(catalogResponse.ok()).toBe(true);
  await expect(catalogResponse.json()).resolves.toMatchObject({
    kind: "catalog",
    schemaVersion: 1,
    counts: { recipes: 44, vocabularyTerms: 91 }
  });

  const llmsResponse = await request.get("/llms.txt");
  expect(llmsResponse.ok()).toBe(true);
  expect(await llmsResponse.text()).toContain("# Motion Lexicon");
});
