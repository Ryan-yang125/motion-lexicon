import { existsSync, readFileSync } from "node:fs";
import { registryComponents } from "../src/data/component-registry";
import { installablePrimitiveEntries } from "../src/data/primitive-registry";
import { release } from "../src/data/release";
import { canonicalMotionCatalog } from "../src/data/motion-catalog";
import { seoGuideArticles } from "../src/data/seo-guide-articles";
import { seoGuides } from "../src/data/seo-guides";
import { getStaticPaths, pathFor, sitemapPaths, siteUrl, staticRedirects } from "../src/data/site";
import { locales } from "../src/data/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(siteUrl === "https://motion-lexicon.pages.dev", "Production site URL is inconsistent");
assert(release.version === "4.1.0", `Expected release 4.1.0, found ${release.version}`);
assert(registryComponents.length === 48, `Expected 48 registry components, found ${registryComponents.length}`);
assert(canonicalMotionCatalog.length === 44, `Expected 44 motion primitives, found ${canonicalMotionCatalog.length}`);
assert(installablePrimitiveEntries.length === 40, `Expected 40 installable primitives, found ${installablePrimitiveEntries.length}`);
assert(seoGuides.length === 8, `Expected 8 scenario guides, found ${seoGuides.length}`);
assert(new Set(registryComponents.map((item) => item.id)).size === registryComponents.length, "Registry component IDs must be unique");
assert(new Set(canonicalMotionCatalog.map((item) => item.id)).size === canonicalMotionCatalog.length, "Primitive IDs must be unique");

for (const component of registryComponents) {
  assert(component.name.zh.trim() && component.name.en.trim(), `${component.id} needs bilingual names`);
  assert(component.description.zh.trim() && component.description.en.trim(), `${component.id} needs bilingual descriptions`);
  assert(component.primitiveIds.length > 0, `${component.id} needs at least one related primitive`);
  assert(existsSync(`src/registry/components/${component.id}.tsx`), `${component.id} component source is missing`);
  assert(existsSync(`src/registry/demos/${component.id}-demo.tsx`), `${component.id} demo source is missing`);
  const source = readFileSync(`src/registry/components/${component.id}.tsx`, "utf8");
  assert(source.includes("export"), `${component.id} must export an installable React component`);
}

for (const primitive of installablePrimitiveEntries) {
  assert(existsSync(`src/registry/primitives/${primitive.id}.tsx`), `${primitive.id} primitive source is missing`);
  assert(existsSync(`src/registry/primitive-demos/${primitive.id}-demo.tsx`), `${primitive.id} primitive demo is missing`);
  assert(existsSync(`public/r/${primitive.registryId}.json`), `${primitive.registryId} registry item is missing`);
}

assert(seoGuideArticles.length === seoGuides.length, "Every scenario guide needs a long-form article");
for (const guide of seoGuides) {
  const article = seoGuideArticles.find((candidate) => candidate.guideId === guide.id);
  assert(article, `${guide.id} is missing its long-form article`);
  assert(article.sections.length === 5, `${guide.id} must have five editorial sections`);
  assert(article.diagrams.length === 3, `${guide.id} must have three diagrams`);
  assert(article.checklist.length === 5, `${guide.id} must have five checklist items`);
  assert(article.caseStudy.code.trim().length > 80, `${guide.id} needs a substantial implementation example`);
  for (const locale of locales) {
    const body = article.sections.flatMap((section) => section.paragraphs).map((paragraph) => paragraph[locale]).join(" ").trim();
    const length = locale === "zh" ? Array.from(body).length : body.split(/\s+/).filter(Boolean).length;
    const minimum = locale === "zh" ? 1000 : 700;
    assert(length >= minimum, `${guide.id}.${locale} is too short (${length}/${minimum})`);
  }
}

const springArticle = seoGuideArticles.find((article) => article.guideId === "spring-or-ease-out");
assert(springArticle, "Spring and ease-out guide is missing");
assert(
  springArticle.caseStudy.code.includes('drawerRange.addEventListener("change", () => settleDrawer());') &&
    springArticle.caseStudy.code.includes('drawerRange.addEventListener("pointerdown", () => {') &&
    springArticle.caseStudy.code.includes("let velocity = releaseVelocity;"),
  "Spring example must preserve continuous, finite drawer motion"
);

const expectedPaths = locales.flatMap((locale) => [
  pathFor(locale),
  pathFor(locale, ["components"]),
  ...registryComponents.map((component) => pathFor(locale, ["components", component.id])),
  pathFor(locale, ["primitives"]),
  ...canonicalMotionCatalog.map((primitive) => pathFor(locale, ["primitives", primitive.id])),
  pathFor(locale, ["guides"]),
  ...seoGuides.map((guide) => pathFor(locale, ["guides", guide.id])),
  pathFor(locale, ["method"]),
  pathFor(locale, ["vocabulary"]),
  pathFor(locale, ["skill"])
]);
const staticPaths = getStaticPaths();
const sitemap = sitemapPaths();
assert(expectedPaths.length === 214, `Expected 214 localized routes, found ${expectedPaths.length}`);
assert(staticPaths.length === expectedPaths.length, `Expected ${expectedPaths.length} static routes, found ${staticPaths.length}`);
assert(sitemap.length === expectedPaths.length, `Expected ${expectedPaths.length} sitemap routes, found ${sitemap.length}`);
assert(new Set(staticPaths).size === staticPaths.length, "Static routes contain duplicates");
for (const routePath of expectedPaths) {
  assert(routePath.endsWith("/"), `Canonical route needs a trailing slash: ${routePath}`);
  assert(staticPaths.includes(routePath), `Static route missing: ${routePath}`);
  assert(sitemap.includes(routePath), `Sitemap route missing: ${routePath}`);
}

const redirects = staticRedirects();
assert(redirects.some((item) => item.source === "/" && item.destination === "/zh/"), "Root must redirect to the Chinese landing page");
for (const obsolete of ["/packs", "/catalog", "/finder", "/director", "/playground"]) {
  assert(!redirects.some((item) => item.source.includes(obsolete)), `Obsolete redirect remains: ${obsolete}`);
  assert(!sitemap.some((item) => item.includes(obsolete)), `Obsolete route remains in sitemap: ${obsolete}`);
}

console.log(`SEO check passed: 48 components, 40 installable primitives, 4 primitive guides, 8 bilingual long-form guides, and ${sitemap.length} canonical localized pages.`);
