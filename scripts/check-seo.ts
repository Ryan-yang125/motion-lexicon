import { categories } from "../src/data/categories";
import { getCategorySeoHub } from "../src/data/category-seo";
import { motionPacks } from "../src/data/motion-packs";
import { release } from "../src/data/release";
import { seoGuideArticles } from "../src/data/seo-guide-articles";
import { seoGuides } from "../src/data/seo-guides";
import {
  aliasMetadata,
  canonicalIdByEntryId,
  canonicalMotionCatalog
} from "../src/data/motion-catalog";
import { entries, getCanonicalRecipe } from "../src/data/recipes";
import {
  getStaticPaths,
  pathFor,
  sitemapPaths,
  siteUrl,
  staticRedirects
} from "../src/data/site";
import { locales } from "../src/data/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

assert(siteUrl.startsWith("https://"), "siteUrl must be HTTPS");
assert(!siteUrl.includes(".local"), "siteUrl must not use a local domain");
assert(entries.length === 91, `Expected 91 glossary entries, found ${entries.length}`);
assert(canonicalMotionCatalog.length === 44, `Expected 44 canonical entries, found ${canonicalMotionCatalog.length}`);
assert(aliasMetadata.length === 47, `Expected 47 aliases, found ${aliasMetadata.length}`);
assert(motionPacks.length === 28, `Expected 28 Motion Packs, found ${motionPacks.length}`);
assert(release.version === "2.1.0", `Expected public release 2.1.0, found ${release.version}`);
assert(seoGuides.length === 8, `Expected 8 scenario guides, found ${seoGuides.length}`);
assert(seoGuideArticles.length === seoGuides.length, `Expected ${seoGuides.length} long-form scenario guides, found ${seoGuideArticles.length}`);
assert(new Set(motionPacks.map((pack) => pack.id)).size === motionPacks.length, "Motion Packs contain duplicate IDs");
assert(new Set(seoGuideArticles.map((article) => article.guideId)).size === seoGuideArticles.length, "Long-form scenario guides contain duplicate IDs");

for (const guide of seoGuides) {
  const article = seoGuideArticles.find((candidate) => candidate.guideId === guide.id);
  assert(article, `${guide.id} is missing its long-form scenario article`);
  assert(article.sections.length === 5, `${guide.id} must have five editorial sections`);
  assert(article.diagrams.length === 3, `${guide.id} must have three editorial diagrams`);
  assert(article.checklist.length === 5, `${guide.id} must have five checklist items`);
  assert(article.caseStudy.code.trim().length > 80, `${guide.id} is missing a substantial implementation example`);

  for (const locale of locales) {
    const body = article.sections
      .flatMap((section) => section.paragraphs)
      .map((paragraph) => paragraph[locale])
      .join(" ")
      .trim();
    const bodyLength = locale === "zh" ? Array.from(body).length : body.split(/\s+/).filter(Boolean).length;
    const minimumLength = locale === "zh" ? 1000 : 700;
    assert(bodyLength >= minimumLength, `${guide.id}.${locale} long-form body is too short (${bodyLength}/${minimumLength})`);
  }

  for (const diagram of article.diagrams) {
    assert(diagram.nodes.length >= 2, `${guide.id}.${diagram.id} needs at least two diagram nodes`);
    assert(diagram.title.zh.trim().length > 0 && diagram.title.en.trim().length > 0, `${guide.id}.${diagram.id} needs localized titles`);
    assert(diagram.alt.zh.trim().length > 0 && diagram.alt.en.trim().length > 0, `${guide.id}.${diagram.id} needs localized alt text`);
  }
}

const publishFeedbackArticle = seoGuideArticles.find((article) => article.guideId === "save-submit-publish-feedback");
assert(publishFeedbackArticle, "Save and publish scenario article is missing");
assert(
  publishFeedbackArticle.caseStudy.code.includes(".publish-result { opacity: 0; visibility: hidden;") &&
    publishFeedbackArticle.caseStudy.code.includes('[data-state="complete"] .publish-button { opacity: 0; visibility: hidden;') &&
    publishFeedbackArticle.caseStudy.code.includes('[data-state="complete"] .publish-result { opacity: 1; visibility: visible;') &&
    publishFeedbackArticle.caseStudy.code.includes('<section class="publish-action" data-state="ready">') &&
    publishFeedbackArticle.caseStudy.code.includes('<script>') &&
    publishFeedbackArticle.caseStudy.code.includes('if (action.dataset.state !== "ready") return;') &&
    publishFeedbackArticle.caseStudy.code.includes("publishButton.disabled = true;") &&
    publishFeedbackArticle.caseStudy.code.includes("data-publish-submissions") &&
    publishFeedbackArticle.caseStudy.code.includes("await publishRequest();") &&
    publishFeedbackArticle.caseStudy.code.includes("publishedLink.focus();"),
  "Publish feedback example must execute independently and accept only one request while working"
);

const springArticle = seoGuideArticles.find((article) => article.guideId === "spring-or-ease-out");
assert(springArticle, "Spring and ease-out scenario article is missing");
assert(
    springArticle.caseStudy.code.includes("releaseVelocity = 0") &&
    springArticle.caseStudy.code.includes("let velocity = releaseVelocity;") &&
    springArticle.caseStudy.code.includes('reducedMotionQuery.addEventListener("change", onReducedMotionChange);') &&
    springArticle.caseStudy.code.includes('reducedMotionQuery.removeEventListener("change", onReducedMotionChange);'),
  "Spring example must preserve release velocity and react immediately to reduced-motion changes"
);

const jankArticle = seoGuideArticles.find((article) => article.guideId === "css-motion-jank");
assert(jankArticle, "CSS motion jank scenario article is missing");
assert(
  jankArticle.caseStudy.code.includes(".result-card { opacity: 1; transform: translateY(0); transition:") &&
    jankArticle.caseStudy.code.includes('.result-card[data-motion="leave"]') &&
    jankArticle.caseStudy.code.includes(".result-card { transition-duration: 1ms; }") &&
    !jankArticle.caseStudy.code.includes('.result-card[data-motion="ready"] {\n  transition:') &&
    jankArticle.caseStudy.code.includes('<section class="filter-demo">') &&
    jankArticle.caseStudy.code.includes("<script>") &&
    jankArticle.caseStudy.code.includes("window.cancelAnimationFrame(renderFrame);") &&
    jankArticle.caseStudy.code.includes("window.clearTimeout(leaveTimer);") &&
    !jankArticle.caseStudy.code.includes("cancelPendingCardTransitions") &&
    !jankArticle.caseStudy.code.includes("query: string"),
  "Filter-card example must run independently and cancel stale visual work"
);

const continuityArticle = seoGuideArticles.find((article) => article.guideId === "card-list-filter-continuity");
assert(continuityArticle, "Filter continuity scenario article is missing");
assert(
  continuityArticle.caseStudy.code.includes(".result-empty { min-height: 160px; opacity: 0; visibility: hidden;") &&
    continuityArticle.caseStudy.code.includes('.result-list[data-empty="true"] + .result-empty { opacity: 1; visibility: visible; }'),
  "Hidden filter empty states must leave the focus order"
);

const reducedMotionArticle = seoGuideArticles.find((article) => article.guideId === "reduced-motion");
assert(reducedMotionArticle, "Reduced-motion scenario article is missing");
assert(
  reducedMotionArticle.caseStudy.code.includes("@keyframes settle-in") &&
    reducedMotionArticle.caseStudy.code.includes("to { opacity: 1; transform: scale(1); }") &&
    reducedMotionArticle.caseStudy.code.includes("[data-save-state] { transition: transform 120ms ease, opacity 160ms ease; }"),
  "Reduced-motion save feedback example must define its settle-in keyframes and keep its transition on the stable state selector"
);

const deletionArticle = seoGuideArticles.find((article) => article.guideId === "form-validation-delete-permission");
assert(deletionArticle, "High-risk interaction scenario article is missing");
assert(
  deletionArticle.caseStudy.code.includes('<script>') &&
    deletionArticle.caseStudy.code.includes('row.addEventListener("transitionend", onLeaveEnd);') &&
    deletionArticle.caseStudy.code.includes('event.target !== row || event.propertyName !== "opacity"') &&
    deletionArticle.caseStudy.code.includes('row.removeEventListener("transitionend", onLeaveEnd)') &&
    deletionArticle.caseStudy.code.includes("window.setTimeout(finishRemoval, 220);") &&
    deletionArticle.caseStudy.code.includes("row.remove();") &&
    deletionArticle.caseStudy.code.includes("await restoreProject(projectId);") &&
    deletionArticle.caseStudy.code.includes("undoButton.disabled = false;") &&
    deletionArticle.caseStudy.code.includes('role="status" aria-live="polite"') &&
    deletionArticle.caseStudy.code.includes("undoButton.focus();") &&
    deletionArticle.caseStudy.code.includes("deleteButton.focus();") &&
    deletionArticle.caseStudy.code.includes('window.matchMedia("(prefers-reduced-motion: reduce)")') &&
    deletionArticle.caseStudy.code.includes("} catch {"),
  "Deletion example must handle exit cleanup, focus recovery, reduced motion, and failure accessibly"
);

assert(
  springArticle.caseStudy.code.includes('<section class="curve-demo">') &&
    springArticle.caseStudy.code.includes("<style>") &&
    springArticle.caseStudy.code.includes("<script>") &&
    springArticle.caseStudy.code.includes("function springTo(element, from, target, releaseVelocity = 0)") &&
    springArticle.caseStudy.code.includes(".save-status { opacity: 0; transform: translateY(6px);") &&
    springArticle.caseStudy.code.includes('.save-status[data-state="saving"], .save-status[data-state="saved"]') &&
    !springArticle.caseStudy.code.includes("HTMLElement") &&
    !springArticle.caseStudy.code.includes("MediaQueryListEvent") &&
    !springArticle.caseStudy.code.includes("export function"),
  "Spring and ease-out example must be a self-contained browser runtime with visible save-state motion"
);

const canonicalIds = new Set(canonicalMotionCatalog.map((item) => item.id));
assert(canonicalIds.size === canonicalMotionCatalog.length, "Canonical catalog contains duplicate IDs");
assert(Object.keys(canonicalIdByEntryId).length === entries.length, "Every glossary entry must resolve to one canonical ID");

for (const entry of entries) {
  const canonicalId = canonicalIdByEntryId[entry.id];
  assert(canonicalId, `Glossary entry ${entry.id} has no canonical mapping`);
  assert(canonicalIds.has(canonicalId), `Glossary entry ${entry.id} maps to unknown canonical ${canonicalId}`);
}

const surfaceCounts = canonicalMotionCatalog.reduce<Record<string, number>>((counts, item) => {
  counts[item.surfaceType] = (counts[item.surfaceType] ?? 0) + 1;
  return counts;
}, {});
assert(surfaceCounts.component === 31, `Expected 31 components, found ${surfaceCounts.component ?? 0}`);
assert(surfaceCounts.playground === 9, `Expected 9 playgrounds, found ${surfaceCounts.playground ?? 0}`);
assert(surfaceCounts.guide === 4, `Expected 4 guides, found ${surfaceCounts.guide ?? 0}`);

for (const category of categories) {
  const count = entries.filter((entry) => entry.categoryId === category.id).length;
  assert(count === category.plannedCount, `${category.id} plannedCount ${category.plannedCount} does not match ${count}`);
  const hub = getCategorySeoHub(category.id);
  assert(hub, `${category.id} is missing editorial SEO hub content`);
  assert(hub.framework.length === 3, `${category.id} needs three editorial decision steps`);
  assert(hub.faqs.length >= 2, `${category.id} needs at least two FAQs`);
  assert(hub.featuredPackIds.length >= 2, `${category.id} needs related Product Moments`);
}

for (const item of canonicalMotionCatalog) {
  const representative = entries.find((entry) => entry.id === item.representativeEntryId);
  assert(representative, `Canonical entry ${item.id} has no representative glossary entry`);
  assert(representative.categoryId === item.categoryId, `${item.id} category differs from its representative entry`);
  assert(item.canonicalPath === `/${item.categoryId}/${item.id}`, `${item.id} has an inconsistent canonicalPath`);
}

for (const alias of aliasMetadata) {
  const sourceEntry = entries.find((entry) => entry.id === alias.entryId);
  assert(sourceEntry, `Alias ${alias.entryId} has no glossary entry`);
  assert(canonicalIds.has(alias.canonicalId), `Alias ${alias.entryId} points to unknown ${alias.canonicalId}`);
  assert(alias.entryId !== alias.canonicalId, `${alias.entryId} cannot alias itself`);
  assert(
    alias.sourcePath === `/${sourceEntry.categoryId}/${sourceEntry.id}`,
    `Alias ${alias.entryId} sourcePath does not match its legacy route`
  );
  if (alias.query) {
    const canonicalRecipe = getCanonicalRecipe(alias.canonicalId);
    assert(canonicalRecipe, `Alias ${alias.entryId} has no canonical recipe`);
    const parameterIds = new Set(canonicalRecipe.params.map((parameter) => parameter.id));
    for (const key of new URLSearchParams(alias.query).keys()) {
      assert(parameterIds.has(key), `Alias ${alias.entryId} query uses unknown parameter ${key}`);
    }
  }
}

const staticPaths = getStaticPaths();
const sitemap = sitemapPaths();
const expectedIndexablePaths = locales.flatMap((locale) => [
  pathFor(locale),
  pathFor(locale, ["catalog"]),
  pathFor(locale, ["finder"]),
  pathFor(locale, ["guides"]),
  pathFor(locale, ["method"]),
  pathFor(locale, ["vocabulary"]),
  pathFor(locale, ["packs"]),
  pathFor(locale, ["director"]),
  ...motionPacks.map((pack) => pathFor(locale, ["packs", pack.id])),
  ...seoGuides.map((guide) => pathFor(locale, ["guides", guide.id])),
  ...categories.map((category) => pathFor(locale, [category.id])),
  ...canonicalMotionCatalog.map((item) => pathFor(locale, [item.categoryId, item.id]))
]);
const expectedCandidatePaths = locales.map((locale) => pathFor(locale, ["lab", "motion-blueprints"]));
const expectedStaticPaths = [...expectedIndexablePaths, ...expectedCandidatePaths];

assert(expectedIndexablePaths.length === 200, `Expected 200 indexable localized paths, found ${expectedIndexablePaths.length}`);
assert(expectedStaticPaths.length === 202, `Expected 202 localized static paths, found ${expectedStaticPaths.length}`);
assert(staticPaths.length === expectedStaticPaths.length, `Expected ${expectedStaticPaths.length} static paths, found ${staticPaths.length}`);
assert(sitemap.length === expectedIndexablePaths.length, `Expected ${expectedIndexablePaths.length} sitemap URLs, found ${sitemap.length}`);
assert(new Set(staticPaths).size === staticPaths.length, "Static paths contain duplicates");
assert(new Set(sitemap).size === sitemap.length, "Sitemap paths contain duplicates");

for (const routePath of expectedIndexablePaths) {
  assert(routePath.endsWith("/"), `Canonical path needs a trailing slash: ${routePath}`);
  assert(staticPaths.includes(routePath), `Static paths missing ${routePath}`);
  assert(sitemap.includes(routePath), `Sitemap missing ${routePath}`);
}

for (const routePath of expectedCandidatePaths) {
  assert(staticPaths.includes(routePath), `Static paths missing candidate route ${routePath}`);
  assert(!sitemap.includes(routePath), `Candidate route leaked into sitemap: ${routePath}`);
}

for (const locale of locales) {
  assert(!sitemap.includes(pathFor(locale, ["playground"])), `Playground alias leaked into sitemap for ${locale}`);
  for (const alias of aliasMetadata) {
    const aliasPath = pathFor(locale, alias.sourcePath.split("/").filter(Boolean));
    assert(!sitemap.includes(aliasPath), `Alias leaked into sitemap: ${aliasPath}`);
  }
}

const redirects = staticRedirects();
const redirectBySource = new Map(redirects.map((redirect) => [redirect.source, redirect]));
assert(redirectBySource.get("/")?.destination === pathFor("zh"), "Root redirect is inconsistent");

for (const canonicalPath of sitemap) {
  const source = canonicalPath.replace(/\/$/, "");
  assert(redirectBySource.get(source)?.destination === canonicalPath, `Missing trailing-slash redirect for ${source}`);
}

for (const locale of locales) {
  const playgroundPath = pathFor(locale, ["playground"]);
  assert(
    redirectBySource.get(playgroundPath)?.destination === pathFor(locale, ["easing", "easing"]),
    `Playground alias has the wrong destination for ${locale}`
  );
  for (const alias of aliasMetadata) {
    const source = pathFor(locale, alias.sourcePath.split("/").filter(Boolean));
    const canonical = pathFor(locale, alias.canonicalPath.split("/").filter(Boolean));
    const focus = new URLSearchParams(alias.query ?? "");
    focus.set("term", alias.entryId);
    const expectedDestination = `${canonical}?${focus.toString()}`;
    assert(redirectBySource.get(source)?.destination === expectedDestination, `Alias redirect is wrong for ${source}`);
    assert(redirectBySource.get(source.replace(/\/$/, ""))?.destination === expectedDestination, `Slashless alias redirect is wrong for ${source}`);
  }
}

for (const locale of locales) {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const item of canonicalMotionCatalog) {
    const entry = entries.find((candidate) => candidate.id === item.representativeEntryId);
    assert(entry, `Missing SEO entry for ${item.id}`);
    const title = entry.seo.title[locale].trim();
    const description = entry.seo.description[locale].trim();
    assert(title.length >= 12, `${entry.id}.${locale} title too short`);
    assert(description.length >= 50, `${entry.id}.${locale} description too short`);
    if (locale === "en") {
      assert(description.length <= 160, `${entry.id}.en description exceeds 160 characters (${description.length})`);
    }
    assert(!titles.has(title), `Duplicate ${locale} title: ${title}`);
    assert(!descriptions.has(description), `Duplicate ${locale} description: ${description}`);
    titles.add(title);
    descriptions.add(description);
  }

  for (const guide of seoGuides) {
    assert(
      guide.title[locale].trim().length >= (locale === "zh" ? 6 : 12),
      `${guide.id}.${locale} title too short`
    );
    assert(
      guide.description[locale].trim().length >= (locale === "zh" ? 20 : 50),
      `${guide.id}.${locale} description too short`
    );
    if (locale === "en") {
      assert(guide.description.en.length <= 155, `${guide.id}.en description exceeds 155 characters`);
    }
  }

  const packTitles = new Set<string>();
  const packDescriptions = new Set<string>();
  for (const pack of motionPacks) {
    const title = locale === "zh"
      ? `${pack.name.zh}产品动效：HTML、CSS、JS 示例 | Motion Lexicon`
      : `${pack.name.en} product motion: HTML, CSS, JS | Motion Lexicon`;
    const description = pack.shortDescription[locale].trim();
    assert(!packTitles.has(title), `Duplicate ${locale} Motion Pack title: ${title}`);
    assert(!packDescriptions.has(description), `Duplicate ${locale} Motion Pack description: ${description}`);
    if (locale === "en") {
      assert(description.length <= 155, `${pack.id}.en source description exceeds 155 characters`);
    }
    packTitles.add(title);
    packDescriptions.add(description);
  }

  const easingHub = getCategorySeoHub("easing");
  const easingRecipe = canonicalMotionCatalog.find((item) => item.id === "easing");
  const easingEntry = easingRecipe ? entries.find((entry) => entry.id === easingRecipe.representativeEntryId) : undefined;
  assert(easingHub && easingEntry, "Easing hub or recipe is missing");
  assert(
    `${easingHub.title[locale]} | Motion Lexicon` !== easingEntry.seo.title[locale],
    `${locale} easing category and recipe titles must be distinct`
  );
}

console.log(
  `SEO check passed: ${entries.length} glossary terms → ${canonicalMotionCatalog.length} canonical entries ` +
    `(${surfaceCounts.component} components, ${surfaceCounts.playground} playgrounds, ${surfaceCounts.guide} guides), ` +
    `${motionPacks.length} Motion Packs, ${sitemap.length} localized sitemap URLs and ${aliasMetadata.length} redirects per locale.`
);
