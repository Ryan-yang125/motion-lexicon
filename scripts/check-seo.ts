import { existsSync, readFileSync } from "node:fs";
import { registryBlocks } from "../src/data/block-registry";
import {
  registryComponentDependencies,
  registryComponentEngines,
  registryComponentRuntimeCost,
  registryComponentSignature,
  registryComponents
} from "../src/data/component-registry";
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
assert(release.version === "6.0.0", `Expected release 6.0.0, found ${release.version}`);
assert(registryBlocks.length === 10, `Expected 10 registry blocks, found ${registryBlocks.length}`);
assert(registryComponents.length === 100, `Expected 100 registry components, found ${registryComponents.length}`);
assert(canonicalMotionCatalog.length === 44, `Expected 44 motion primitives, found ${canonicalMotionCatalog.length}`);
assert(installablePrimitiveEntries.length === 40, `Expected 40 installable primitives, found ${installablePrimitiveEntries.length}`);
assert(seoGuides.length === 8, `Expected 8 scenario guides, found ${seoGuides.length}`);
assert(new Set(registryComponents.map((item) => item.id)).size === registryComponents.length, "Registry component IDs must be unique");
assert(new Set(registryBlocks.map((item) => item.id)).size === registryBlocks.length, "Registry block IDs must be unique");
assert(new Set(canonicalMotionCatalog.map((item) => item.id)).size === canonicalMotionCatalog.length, "Primitive IDs must be unique");

for (const component of registryComponents) {
  assert(component.name.zh.trim() && component.name.en.trim(), `${component.id} needs bilingual names`);
  assert(component.description.zh.trim() && component.description.en.trim(), `${component.id} needs bilingual descriptions`);
  assert(registryComponentSignature(component).zh.trim() && registryComponentSignature(component).en.trim(), `${component.id} needs a bilingual behavior signature`);
  assert(component.primitiveIds.length > 0, `${component.id} needs at least one related primitive`);
  for (const primitiveId of component.primitiveIds) {
    assert(canonicalMotionCatalog.some((entry) => entry.id === primitiveId), `${component.id} references an unknown primitive: ${primitiveId}`);
  }
  assert(registryComponentEngines(component).length > 0, `${component.id} needs at least one runtime engine`);
  assert(["light", "medium", "heavy"].includes(registryComponentRuntimeCost(component)), `${component.id} needs a valid runtime cost`);
  assert(Array.isArray(registryComponentDependencies(component)), `${component.id} dependencies must be readable`);
  assert(existsSync(`src/registry/components/${component.id}.tsx`), `${component.id} component source is missing`);
  assert(existsSync(`src/registry/demos/${component.id}-demo.tsx`), `${component.id} demo source is missing`);
  const source = readFileSync(`src/registry/components/${component.id}.tsx`, "utf8");
  assert(source.includes("export"), `${component.id} must export an installable React component`);
}

for (const block of registryBlocks) {
  assert(block.name.zh.trim() && block.name.en.trim(), `${block.id} needs bilingual names`);
  assert(block.description.zh.trim() && block.description.en.trim(), `${block.id} needs bilingual descriptions`);
  assert(block.primaryState.zh.trim() && block.primaryState.en.trim(), `${block.id} needs a bilingual primary state`);
  assert(block.signature.zh.trim() && block.signature.en.trim(), `${block.id} needs a bilingual behavior signature`);
  assert(block.primitiveIds.length > 0, `${block.id} needs related primitives`);
  assert(["product-mono", "editorial-warm", "spatial-dark"].includes(block.sceneFamily), `${block.id} needs a valid scene family`);
  assert(new Set(block.componentIds).size === block.componentIds.length, `${block.id} component IDs must be unique`);
  for (const componentId of block.componentIds) {
    assert(registryComponents.some((component) => component.id === componentId), `${block.id} references an unknown component: ${componentId}`);
  }
  assert(existsSync(`src/registry/blocks/${block.id}.tsx`), `${block.id} block source is missing`);
  assert(existsSync(`src/registry/block-demos/${block.id}-demo.tsx`), `${block.id} block demo is missing`);
  assert(existsSync(`public/r/${block.id}.json`), `${block.id} registry item is missing`);
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

const componentSelectionArticle = seoGuideArticles.find((article) => article.guideId === "component-or-primitive");
assert(componentSelectionArticle, "Component and primitive selection guide is missing");
function collectChineseCopy(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(collectChineseCopy);
  const record = value as Record<string, unknown>;
  return [
    ...(typeof record.zh === "string" ? [record.zh] : []),
    ...Object.values(record).flatMap(collectChineseCopy)
  ];
}
const componentSelectionChineseCopy = collectChineseCopy(componentSelectionArticle).join("\n");
assert(
  !/\b(?:Component|Components|Primitive|Primitives)\b/.test(componentSelectionChineseCopy),
  "Component and primitive selection guide must use natural Chinese terminology in Chinese copy"
);
assert(
  componentSelectionChineseCopy.includes("组件") && componentSelectionChineseCopy.includes("原子动效"),
  "Component and primitive selection guide must use the canonical Chinese terminology"
);

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
  pathFor(locale, ["blocks"]),
  ...registryBlocks.map((block) => pathFor(locale, ["blocks", block.id])),
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
assert(expectedPaths.length === 340, `Expected 340 localized routes, found ${expectedPaths.length}`);
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
for (const obsolete of ["/packs", "/catalog", "/finder", "/director", "/playground", "/guides/pack-or-primitive"]) {
  assert(!redirects.some((item) => item.source.includes(obsolete)), `Obsolete redirect remains: ${obsolete}`);
  assert(!sitemap.some((item) => item.includes(obsolete)), `Obsolete route remains in sitemap: ${obsolete}`);
}

console.log(`SEO check passed: 10 page blocks, 100 components, 40 installable primitives, 4 primitive guides, 8 bilingual long-form guides, and ${sitemap.length} canonical localized pages.`);
