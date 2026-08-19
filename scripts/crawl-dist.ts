import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { registryBlocks } from "../src/data/block-registry";
import { registryComponents } from "../src/data/component-registry";
import { canonicalMotionCatalog } from "../src/data/motion-catalog";
import { installablePrimitiveEntries } from "../src/data/primitive-registry";
import { defaultLocale, getStaticPaths, isLocale, pathFor, sitemapPaths, siteUrl, staticRedirects } from "../src/data/site";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function routeFile(routePath: string) {
  return path.join("dist", routePath.replace(/^\//, ""), "index.html");
}

function attributes(tag: string) {
  const result = new Map<string, string>();
  for (const match of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) result.set(match[1].toLowerCase(), match[2]);
  return result;
}

function tags(html: string, name: string) {
  return Array.from(html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g")), (match) => match[0]);
}

function listFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const fullPath = path.join(directory, name);
    return statSync(fullPath).isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function pngDimensions(file: string) {
  const image = readFileSync(file);
  assert(image.toString("hex", 0, 8) === "89504e470d0a1a0a", `${file} must be a PNG image`);
  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
    bytes: image.byteLength,
    hash: createHash("sha256").update(image).digest("hex")
  };
}

const requiredAssets = [
  "favicon.ico", "favicon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png",
  "site.webmanifest", "og-default.png", "og-zh.png", "og-en.png",
  "og-components-zh.png", "og-components-en.png", "og-primitives-zh.png", "og-primitives-en.png",
  "og-guides-zh.png", "og-guides-en.png", "og-method-zh.png", "og-method-en.png",
  "og-skill-zh.png", "og-skill-en.png", "og-vocabulary-zh.png", "og-vocabulary-en.png",
  "robots.txt", "sitemap.xml", "_headers", "_redirects", "404.html", "r/registry.json"
];
for (const asset of requiredAssets) assert(existsSync(path.join("dist", asset)), `Missing dist asset: ${asset}`);

const detailOgFiles = [
  ...registryBlocks.flatMap((block) => ["zh", "en"].map((locale) => `og/components/${block.id}-${locale}.png`)),
  ...registryComponents.flatMap((component) => ["zh", "en"].map((locale) => `og/components/${component.id}-${locale}.png`)),
  ...canonicalMotionCatalog.flatMap((primitive) => ["zh", "en"].map((locale) => `og/primitives/${primitive.id}-${locale}.png`))
];
assert(detailOgFiles.length === 308, `Expected 308 detail Open Graph images, found ${detailOgFiles.length}`);
let detailOgBytes = 0;
const detailOgHashes = new Set<string>();
for (const asset of detailOgFiles) {
  const file = path.join("dist", asset);
  assert(existsSync(file), `Missing detail Open Graph image: ${asset}`);
  const dimensions = pngDimensions(file);
  assert(dimensions.width === 1200 && dimensions.height === 630, `${asset} must be 1200x630`);
  assert(dimensions.bytes <= 300 * 1024, `${asset} exceeds the 300 KiB per-image budget`);
  detailOgBytes += dimensions.bytes;
  detailOgHashes.add(dimensions.hash);
}
assert(detailOgBytes <= 36 * 1024 * 1024, "Detail Open Graph images exceed the 36 MiB total budget");
assert(detailOgHashes.size === detailOgFiles.length, "Every detail page must have a visually distinct Open Graph image");

const routes = sitemapPaths();
const staticRoutes = getStaticPaths();
const routeSet = new Set(routes);
assert(routeSet.size === routes.length, "Sitemap routes contain duplicates");
assert(routes.length === 340, `Expected 340 canonical routes, found ${routes.length}`);
assert(staticRoutes.length === routes.length, "Static and sitemap route counts differ");

const sitemapXml = readFileSync("dist/sitemap.xml", "utf8");
assert((sitemapXml.match(/<loc>/g) ?? []).length === routes.length, "Sitemap XML route count is inconsistent");
assert((sitemapXml.match(/hreflang=/g) ?? []).length === routes.length * 3, "Sitemap hreflang clusters are incomplete");

const robots = readFileSync("dist/robots.txt", "utf8");
for (const userAgent of ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User"]) {
  assert(robots.includes(`User-agent: ${userAgent}\nAllow: /`), `robots.txt does not explicitly allow ${userAgent}`);
}
assert(robots.includes("No training-specific rule is declared."), "robots.txt must document its training-neutral policy");
assert(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots.txt sitemap URL is missing");

const internalLinks = new Set<string>();
const titlesByLocale = new Map<string, Map<string, string>>();
for (const routePath of routes) {
  assert(existsSync(routeFile(routePath)), `Missing prerendered HTML: ${routePath}`);
  const html = readFileSync(routeFile(routePath), "utf8");
  const locale = routePath.split("/").filter(Boolean)[0];
  assert(isLocale(locale), `${routePath} has no valid locale`);
  assert(tags(html, "h1").length === 1, `${routePath} must contain exactly one H1`);
  assert(/<div id="root">[\s\S]+<\/div>/.test(html), `${routePath} has no prerendered app content`);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const titleTags = tags(head, "title");
  assert(titleTags.length === 1, `${routePath} must contain exactly one title`);
  const pageTitle = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  assert(pageTitle, `${routePath} title is empty`);
  if (locale === "zh") assert(/\p{Script=Han}/u.test(pageTitle), `${routePath} Chinese title needs Han characters: ${pageTitle}`);
  if (/^\/zh\/components\/[^/]+\/$/.test(routePath)) {
    assert(pageTitle.endsWith(" React 组件 | Motion Lexicon"), `${routePath} must use the canonical Chinese component title`);
    assert(!pageTitle.includes("React 动效组件"), `${routePath} contains obsolete Chinese component terminology`);
  }
  if (/^\/zh\/blocks\/[^/]+\/$/.test(routePath)) {
    assert(pageTitle.endsWith(" React 页面 Block | Motion Lexicon"), `${routePath} must use the canonical Chinese block title`);
  }
  if (/^\/zh\/primitives\/[^/]+\/$/.test(routePath)) {
    assert(pageTitle.endsWith(" 原子动效 | Motion Lexicon"), `${routePath} must use the canonical Chinese primitive title`);
    assert(!pageTitle.includes("动效原语"), `${routePath} contains obsolete Chinese primitive terminology`);
  }
  const localeTitles = titlesByLocale.get(locale) ?? new Map<string, string>();
  const duplicateRoute = localeTitles.get(pageTitle);
  assert(!duplicateRoute, `${routePath} duplicates the ${locale} title from ${duplicateRoute}: ${pageTitle}`);
  localeTitles.set(pageTitle, routePath);
  titlesByLocale.set(locale, localeTitles);
  const canonical = tags(head, "link").map(attributes).filter((tag) => tag.get("rel") === "canonical");
  assert(canonical.length === 1 && canonical[0].get("href") === `${siteUrl}${routePath}`, `${routePath} canonical is inconsistent`);
  const alternates = tags(head, "link").map(attributes).filter((tag) => tag.get("rel") === "alternate" && tag.has("hreflang"));
  assert(alternates.length === 3, `${routePath} needs zh-CN, en, and x-default alternates`);
  const schemas = Array.from(html.matchAll(/<script\b(?=[^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g), (match) => JSON.parse(match[1]) as Record<string, unknown>);
  const webPageSchema = schemas.find((schema) => schema["@type"] === "WebPage" && schema.url === `${siteUrl}${routePath}`);
  assert(webPageSchema, `${routePath} WebPage JSON-LD is missing`);
  const publisher = webPageSchema.publisher as Record<string, unknown> | undefined;
  const website = webPageSchema.isPartOf as Record<string, unknown> | undefined;
  assert(publisher?.["@id"] === `${siteUrl}/#organization`, `${routePath} publisher entity ID is inconsistent`);
  assert(website?.["@id"] === `${siteUrl}/#website`, `${routePath} WebSite entity ID is inconsistent`);
  if (routePath === pathFor(locale)) {
    assert(website?.["@type"] === "WebSite" && website.url === siteUrl, `${routePath} must define the canonical root WebSite entity`);
    assert(publisher?.["@type"] === "Organization" && publisher.url === siteUrl, `${routePath} must define the publisher Organization entity`);
  }
  const ogImage = tags(head, "meta").map(attributes).find((tag) => tag.get("property") === "og:image")?.get("content");
  assert(ogImage?.startsWith(siteUrl), `${routePath} has no first-party Open Graph image`);
  assert(existsSync(path.join("dist", (ogImage ?? "").replace(siteUrl, ""))), `${routePath} Open Graph image is missing`);
  const ogImageAlt = tags(head, "meta").map(attributes).find((tag) => tag.get("property") === "og:image:alt")?.get("content");
  const twitterImageAlt = tags(head, "meta").map(attributes).find((tag) => tag.get("name") === "twitter:image:alt")?.get("content");
  assert(ogImageAlt === pageTitle, `${routePath} Open Graph image alt must match its concise page title`);
  assert(twitterImageAlt === pageTitle, `${routePath} Twitter image alt must match its concise page title`);

  const componentMatch = routePath.match(/^\/(zh|en)\/components\/([^/]+)\/$/);
  if (componentMatch) {
    assert(ogImage === `${siteUrl}/og/components/${componentMatch[2]}-${locale}.png`, `${routePath} must use its page-specific Open Graph image`);
    const componentId = componentMatch[2];
    for (const section of ["behavior", "events", "foundations", "runtime"]) {
      assert(html.includes(`data-seo-section="${section}"`), `${routePath} is missing the static ${section} section`);
    }
    assert(html.includes(`href="/r/${componentId}.json"`), `${routePath} is missing its public Registry JSON link`);
  }
  const blockMatch = routePath.match(/^\/(zh|en)\/blocks\/([^/]+)\/$/);
  if (blockMatch) {
    const blockId = blockMatch[2];
    assert(ogImage === `${siteUrl}/og/components/${blockId}-${locale}.png`, `${routePath} must use its page-specific Open Graph image`);
    for (const section of ["behavior", "foundations", "runtime"]) {
      assert(html.includes(`data-seo-section="${section}"`), `${routePath} is missing the static ${section} section`);
    }
    assert(html.includes(`href="/r/${blockId}.json"`), `${routePath} is missing its public Registry JSON link`);
  }
  const primitiveMatch = routePath.match(/^\/(zh|en)\/primitives\/([^/]+)\/$/);
  if (primitiveMatch) {
    assert(ogImage === `${siteUrl}/og/primitives/${primitiveMatch[2]}-${locale}.png`, `${routePath} must use its page-specific Open Graph image`);
  }

  for (const tagName of ["a", "link", "script", "img"]) {
    for (const tag of tags(html, tagName)) {
      const value = attributes(tag).get(tagName === "a" || tagName === "link" ? "href" : "src");
      if (!value?.startsWith("/")) continue;
      const localPath = value.split(/[?#]/, 1)[0];
      if (localPath.startsWith("/assets/") || /\.[a-z0-9]+$/i.test(localPath)) {
        assert(existsSync(path.join("dist", localPath)), `${routePath} references missing asset ${localPath}`);
      } else {
        assert(localPath.endsWith("/"), `${routePath} links to non-canonical URL ${localPath}`);
        internalLinks.add(localPath);
      }
    }
  }
}

for (const [locale, titles] of titlesByLocale) {
  assert(titles.size === routes.filter((routePath) => routePath.startsWith(`/${locale}/`)).length, `${locale} titles are not unique across all localized routes`);
}

for (const href of internalLinks) assert(routeSet.has(href), `Internal link has no static target: ${href}`);

const registry = JSON.parse(readFileSync("dist/r/registry.json", "utf8")) as { items?: Array<{ name?: string }> };
const registryItemCount = registryBlocks.length + registryComponents.length + installablePrimitiveEntries.length;
assert(registry.items?.length === registryItemCount, "Published shadcn registry count is inconsistent");
for (const component of registryComponents) {
  assert(registry.items?.some((item) => item.name === component.id), `Registry index is missing ${component.id}`);
  const item = JSON.parse(readFileSync(`dist/r/${component.id}.json`, "utf8")) as { name?: string; type?: string; files?: unknown[] };
  assert(item.name === component.id && item.type === "registry:ui" && (item.files?.length ?? 0) > 0, `Registry item ${component.id} is invalid`);
}
for (const block of registryBlocks) {
  assert(registry.items?.some((item) => item.name === block.id), `Registry index is missing ${block.id}`);
  const item = JSON.parse(readFileSync(`dist/r/${block.id}.json`, "utf8")) as { name?: string; type?: string; files?: Array<{ type?: string }> };
  assert(item.name === block.id && item.type === "registry:block" && item.files?.[0]?.type === "registry:component", `Registry block ${block.id} is invalid`);
}
for (const primitive of installablePrimitiveEntries) {
  assert(registry.items?.some((item) => item.name === primitive.registryId), `Registry index is missing ${primitive.registryId}`);
  const item = JSON.parse(readFileSync(`dist/r/${primitive.registryId}.json`, "utf8")) as { name?: string; type?: string; files?: unknown[] };
  assert(item.name === primitive.registryId && item.type === "registry:ui" && (item.files?.length ?? 0) > 0, `Registry item ${primitive.registryId} is invalid`);
}

const redirects = readFileSync("dist/_redirects", "utf8");
assert(redirects.includes(`/ ${pathFor(defaultLocale)} 301`), "Root redirect must open the landing page");
for (const redirect of staticRedirects()) {
  assert(redirects.includes(`${redirect.source} ${redirect.destination} ${redirect.status}`), `Missing redirect ${redirect.source}`);
}
for (const obsolete of ["/packs", "/catalog", "/finder", "/director", "/playground", "/guides/pack-or-primitive"]) {
  assert(!redirects.includes(obsolete), `Obsolete redirect remains: ${obsolete}`);
}
for (const locale of ["zh", "en"]) {
  assert(!existsSync(path.join("dist", locale, "guides", "pack-or-primitive", "index.html")), `Obsolete guide artifact remains for ${locale}`);
}

const headers = readFileSync("dist/_headers", "utf8");
for (const header of ["Content-Security-Policy:", "Strict-Transport-Security:", "X-Content-Type-Options: nosniff", "X-Frame-Options: DENY", "Referrer-Policy:"]) {
  assert(headers.includes(header), `Static headers are missing ${header}`);
}
assert(!listFiles("dist").some((file) => file.endsWith(".map")), "Production output contains source maps");

console.log(`Dist crawl passed: ${routes.length} canonical pages, ${internalLinks.size} internal links, ${registryItemCount} registry items, ${detailOgFiles.length} detail OG images (${Math.round(detailOgBytes / 1024)} KiB), and ${requiredAssets.length} required assets.`);
