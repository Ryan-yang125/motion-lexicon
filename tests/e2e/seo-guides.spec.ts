import { expect, test, type Page } from "@playwright/test";
import { seoGuideArticles } from "../../src/data/seo-guide-articles";

async function findOverflowingDiagramText(page: Page) {
  return page.locator(".seo-guide-diagram svg .seo-guide-diagram-node").evaluateAll((nodes) => {
    return nodes.flatMap((node) => {
      const bounds = node.querySelector("rect")?.getBBox();
      if (!bounds) return [];
      return Array.from(node.querySelectorAll("text")).flatMap((text) => {
        const box = text.getBBox();
        const escapesNode = box.x < bounds.x || box.y < bounds.y || box.x + box.width > bounds.x + bounds.width || box.y + box.height > bounds.y + bounds.height;
        return escapesNode ? [text.getAttribute("aria-label")] : [];
      });
    });
  });
}

async function findOverflowingCaseStudyCode(page: Page) {
  return page.locator(".seo-guide-case-study pre").evaluateAll((blocks) => {
    return blocks.flatMap((block, index) => block.scrollWidth > block.clientWidth + 1 ? [index] : []);
  });
}

test("scenario guides render a full illustrated article with a checklist and implementation", async ({ page }, testInfo) => {
  await page.goto("/zh/guides/css-motion-jank/");

  await expect(page.getByRole("heading", { level: 1, name: "CSS 动效卡顿：从帧到属性逐项排查" })).toBeVisible();
  await expect(page.locator(".seo-guide-article > section")).toHaveCount(7);
  await expect(page.locator("figure.seo-guide-diagram")).toHaveCount(3);
  await expect(page.locator(".seo-guide-checklist li")).toHaveCount(5);
  await expect(page.locator(".seo-guide-case-study pre code")).toContainText("requestAnimationFrame");
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.some((schema) => schema.includes('"@type":"TechArticle"') && schema.includes('"wordCount"'))).toBe(true);

  await page.goto("/zh/guides/");
  const guideSchemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(guideSchemas.some((schema) => schema.includes('"@type":"ItemList"') && schema.includes('"url":"https://motion-lexicon.pages.dev/zh/guides/save-submit-publish-feedback/"'))).toBe(true);

  await page.goto("/en/guides/save-submit-publish-feedback/");
  await expect(page.locator('.seo-guide-diagram svg .seo-guide-diagram-node-detail[aria-label="Prevent duplicates and show progress"]')).toHaveCount(1);
  if (!testInfo.project.name.includes("mobile")) {
    for (const locale of ["zh", "en"]) {
      for (const guideId of [
        "save-submit-publish-feedback",
        "card-list-filter-continuity",
        "css-motion-jank",
        "spring-or-ease-out",
        "reduced-motion",
        "form-validation-delete-permission",
        "from-brief-to-spec",
        "pack-or-primitive"
      ]) {
        await page.goto(`/${locale}/guides/${guideId}/`);
        expect(await findOverflowingDiagramText(page), `${locale}/${guideId}`).toEqual([]);
      }
    }
  }

  await page.goto("/en/guides/spring-or-ease-out/");
  await expect(page.getByRole("heading", { level: 1, name: "Choose spring or ease-out by meaning" })).toBeVisible();
  await expect(page.locator("figure.seo-guide-diagram")).toHaveCount(3);
  await expect(page.locator(".seo-guide-checklist li")).toHaveCount(5);
});

test("scenario guide layouts stay inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh/guides/save-submit-publish-feedback/");

  await expect(page.locator(".seo-guide-diagram svg").first()).toBeHidden();
  await expect(page.locator(".seo-guide-diagram-mobile").first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("scenario guide implementation code stays within its container on desktop and mobile", async ({ page }) => {
  for (const [label, viewport] of [
    ["desktop", { width: 1440, height: 960 }],
    ["mobile", { width: 390, height: 844 }]
  ] as const) {
    await page.setViewportSize(viewport);
    await page.goto("/zh/guides/form-validation-delete-permission/");

    await expect(page.locator(".seo-guide-case-study pre")).toContainText("data-delete-status");
    expect(await findOverflowingCaseStudyCode(page), label).toEqual([]);

    const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(pageOverflow, label).toBeLessThanOrEqual(1);
  }
});

test("deletion guide implementation keeps exit, recovery, and undo in one working flow", async ({ page }) => {
  const deletionGuide = seoGuideArticles.find((article) => article.guideId === "form-validation-delete-permission");
  expect(deletionGuide).toBeDefined();
  await page.setContent(deletionGuide!.caseStudy.code);

  const row = page.locator("[data-project-row]");
  const status = page.getByRole("status");
  const undo = page.getByRole("button", { name: "Undo" });

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(status).toHaveText("Project deleted. Undo is available.");
  await expect(undo).toBeVisible();
  await undo.click();
  await expect(status).toHaveText("Project restored.");
  await expect(row).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(undo).toBeEnabled();
  await undo.click();
  await expect(status).toHaveText("Project restored.");
  await expect(row).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(row).toHaveCount(0, { timeout: 1_000 });
});
