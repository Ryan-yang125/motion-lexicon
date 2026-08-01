import { expect, test } from "@playwright/test";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";

test("landing page exposes GitHub, Motion Director, Skill, and versioned public data", async ({ page, request }) => {
  await page.goto("/zh/");

  await expect(page.getByText("Motion Lexicon V2.0 · 免费开源", { exact: true })).toBeVisible();

  await expect(page.getByRole("contentinfo").getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    repositoryUrl
  );
  await page.locator(".library-utility-trigger").click();
  const resources = page.locator(".library-utility-popover");
  await expect(resources.getByRole("link", { name: "Agent Skill", exact: true })).toHaveAttribute(
    "href",
    `${repositoryUrl}/tree/main/skills/motion-lexicon`
  );
  await expect(resources.getByRole("link", { name: "Motion Grammar JSON", exact: true })).toHaveAttribute(
    "href",
    "/data/v2/motion-grammar.json"
  );
  await expect(resources.getByRole("link", { name: "Catalog JSON", exact: true })).toHaveAttribute(
    "href",
    "/data/v1/catalog.json"
  );
  await expect(resources.getByRole("link", { name: "Packs JSON", exact: true })).toHaveAttribute(
    "href",
    "/data/v1/packs.json"
  );

  const motionGrammarResponse = await request.get("/data/v2/motion-grammar.json");
  expect(motionGrammarResponse.ok()).toBe(true);
  await expect(motionGrammarResponse.json()).resolves.toMatchObject({
    kind: "motion-grammar",
    version: "2.0.0",
    grammar: { collections: { primitives: { count: 44 }, moments: { count: 28 } } },
    modes: expect.arrayContaining([
      expect.objectContaining({ id: "recommend" }),
      expect.objectContaining({ id: "contribute" })
    ])
  });

  const catalogResponse = await request.get("/data/v1/catalog.json");
  expect(catalogResponse.ok()).toBe(true);
  await expect(catalogResponse.json()).resolves.toMatchObject({
    kind: "catalog",
    schemaVersion: 1,
    counts: { recipes: 44, vocabularyTerms: 91 }
  });

  const packsResponse = await request.get("/data/v1/packs.json");
  expect(packsResponse.ok()).toBe(true);
  await expect(packsResponse.json()).resolves.toMatchObject({
    kind: "packs",
    schemaVersion: 1,
    count: 28
  });

  const llmsResponse = await request.get("/llms.txt");
  expect(llmsResponse.ok()).toBe(true);
  expect(await llmsResponse.text()).toContain("# Motion Lexicon");

  const pricingResponse = await request.get("/pricing.txt");
  expect(pricingResponse.ok()).toBe(true);
  expect(await pricingResponse.text()).toContain("- Price: $0");
});
