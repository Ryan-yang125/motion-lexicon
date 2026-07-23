import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { glossaryTerms } from "../src/data/glossary";
import { canonicalMotionCatalog } from "../src/data/motion-catalog";
import {
  defaultLocale,
  isLocale,
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

function routeFile(routePath: string) {
  return path.join("dist", routePath.replace(/^\//, ""), "index.html");
}

function attributes(tag: string) {
  const result = new Map<string, string>();
  for (const match of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) {
    result.set(match[1].toLowerCase(), match[2]);
  }
  return result;
}

function htmlTags(html: string, name: string) {
  return Array.from(html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g")), (match) => match[0]);
}

function listFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const fullPath = path.join(directory, name);
    return statSync(fullPath).isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function assertPng(name: string, width: number, height: number) {
  const filePath = path.join("dist", name);
  const bytes = readFileSync(filePath);
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  assert(signature.every((byte, index) => bytes[index] === byte), `${name} has an invalid PNG signature`);
  assert(bytes.readUInt32BE(16) === width, `${name} width must be ${width}`);
  assert(bytes.readUInt32BE(20) === height, `${name} height must be ${height}`);
}

const requiredAssets = [
  "favicon.ico",
  "favicon.svg",
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "site.webmanifest",
  "og-default.png",
  "og-zh.png",
  "og-en.png",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "_redirects",
  "404.html"
];

for (const asset of requiredAssets) {
  assert(existsSync(path.join("dist", asset)), `Missing dist asset: ${asset}`);
}

assertPng("apple-touch-icon.png", 180, 180);
assertPng("icon-192.png", 192, 192);
assertPng("icon-512.png", 512, 512);
assertPng("og-default.png", 1200, 630);
assertPng("og-zh.png", 1200, 630);
assertPng("og-en.png", 1200, 630);

const favicon = readFileSync(path.join("dist", "favicon.ico"));
assert(
  favicon[0] === 0 && favicon[1] === 0 && favicon[2] === 1 && favicon[3] === 0,
  "favicon.ico has an invalid ICO signature"
);

const manifest = JSON.parse(readFileSync(path.join("dist", "site.webmanifest"), "utf8")) as {
  start_url?: string;
  icons?: Array<{ src?: string; sizes?: string }>;
};
assert(manifest.start_url === pathFor(defaultLocale), "Manifest start_url must use the canonical default locale URL");
assert(manifest.icons?.some((icon) => icon.src === "/icon-192.png" && icon.sizes === "192x192"), "Manifest is missing its 192px icon");
assert(manifest.icons?.some((icon) => icon.src === "/icon-512.png" && icon.sizes === "512x512"), "Manifest is missing its 512px icon");

const sitemapRoutePaths = sitemapPaths();
const sitemapRouteSet = new Set(sitemapRoutePaths);
assert(sitemapRouteSet.size === sitemapRoutePaths.length, "sitemapPaths contains duplicate URLs");
for (const routePath of sitemapRoutePaths) {
  assert(routePath.endsWith("/"), `Canonical route must end in a slash: ${routePath}`);
  assert(existsSync(routeFile(routePath)), `Missing prerendered HTML for ${routePath}`);
}

const sitemapXml = readFileSync(path.join("dist", "sitemap.xml"), "utf8");
assert(sitemapXml.includes("xmlns:xhtml=\"http://www.w3.org/1999/xhtml\""), "Sitemap is missing the hreflang XML namespace");
const sitemapLocs = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);
const sitemapAlternates = Array.from(
  sitemapXml.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g),
  (match) => ({ language: match[1], url: match[2] })
);
assert(sitemapLocs.length === sitemapRoutePaths.length, "Sitemap URL count differs from sitemapPaths");
assert(sitemapAlternates.length === sitemapRoutePaths.length * 3, "Sitemap hreflang cluster count is incomplete");
assert(
  sitemapLocs.every((url) => sitemapRouteSet.has(url.replace(siteUrl, ""))),
  "Sitemap contains a non-canonical URL"
);
assert(
  sitemapAlternates.every(({ url }) => sitemapRouteSet.has(url.replace(siteUrl, ""))),
  "Sitemap hreflang points to a non-canonical URL"
);

const internalLinks = new Set<string>();
for (const routePath of sitemapRoutePaths) {
  const html = readFileSync(routeFile(routePath), "utf8");
  const canonicalTags = htmlTags(html, "link")
    .map(attributes)
    .filter((tag) => tag.get("rel") === "canonical");
  assert(canonicalTags.length === 1, `${routePath} must have exactly one canonical link`);
  assert(canonicalTags[0].get("href") === `${siteUrl}${routePath}`, `${routePath} canonical URL is inconsistent`);

  const segments = routePath.split("/").filter(Boolean);
  const locale = segments[0];
  assert(isLocale(locale), `${routePath} is missing a supported locale`);
  const routeParts = segments.slice(1);
  const alternateTags = htmlTags(html, "link")
    .map(attributes)
    .filter((tag) => tag.get("rel") === "alternate" && tag.has("hreflang"));
  const expectedAlternates = new Map([
    ["zh-CN", `${siteUrl}${pathFor("zh", routeParts)}`],
    ["en", `${siteUrl}${pathFor("en", routeParts)}`],
    ["x-default", `${siteUrl}${pathFor(defaultLocale, routeParts)}`]
  ]);
  assert(alternateTags.length === expectedAlternates.size, `${routePath} has an incomplete hreflang cluster`);
  for (const [language, url] of expectedAlternates) {
    assert(
      alternateTags.some((tag) => tag.get("hreflang") === language && tag.get("href") === url),
      `${routePath} is missing hreflang ${language}`
    );
  }

  const schemaBlocks = Array.from(
    html.matchAll(/<script\b(?=[^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g),
    (match) => match[1]
  );
  assert(schemaBlocks.length > 0, `${routePath} has no static JSON-LD`);
  let hasCanonicalWebPageSchema = false;
  const parsedSchemas: Array<Record<string, unknown>> = [];
  for (const schema of schemaBlocks) {
    const parsed = JSON.parse(schema) as Record<string, unknown>;
    parsedSchemas.push(parsed);
    assert(parsed["@context"] === "https://schema.org", `${routePath} has invalid JSON-LD context`);
    if (parsed["@type"] === "WebPage" && parsed.url === `${siteUrl}${routePath}`) {
      hasCanonicalWebPageSchema = true;
    }
  }
  assert(hasCanonicalWebPageSchema, `${routePath} WebPage schema is missing its canonical URL`);

  if (routeParts.length === 1 && routeParts[0] === "vocabulary") {
    const termSet = parsedSchemas.find((schema) => schema["@type"] === "DefinedTermSet");
    assert(termSet, `${routePath} is missing DefinedTermSet schema`);
    assert(termSet.url === `${siteUrl}${routePath}`, `${routePath} term-set URL is inconsistent`);
    const definedTerms = termSet.hasDefinedTerm;
    assert(Array.isArray(definedTerms), `${routePath} DefinedTermSet has no term list`);
    assert(definedTerms.length === glossaryTerms.length, `${routePath} must publish all ${glossaryTerms.length} terms`);
    const termCodes = new Set<string>();
    for (const term of definedTerms as Array<Record<string, unknown>>) {
      assert(term["@type"] === "DefinedTerm", `${routePath} contains a non-DefinedTerm item`);
      assert(typeof term.termCode === "string", `${routePath} has a term without termCode`);
      termCodes.add(term.termCode);
      assert(term.inDefinedTermSet === `${siteUrl}${routePath}`, `${routePath} term-set relation is inconsistent`);
      assert(
        typeof term.url === "string" && term.url === `${siteUrl}${routePath}#term-${term.termCode}`,
        `${routePath} has an inconsistent term URL for ${term.termCode}`
      );
    }
    assert(termCodes.size === glossaryTerms.length, `${routePath} has duplicate term codes`);
  }

  if (routeParts.length === 2) {
    const catalogEntry = canonicalMotionCatalog.find(
      (entry) => entry.categoryId === routeParts[0] && entry.id === routeParts[1]
    );
    if (catalogEntry) {
      const article = parsedSchemas.find((schema) => schema["@type"] === "TechArticle");
      assert(article, `${routePath} is missing TechArticle schema`);
      assert(article.url === `${siteUrl}${routePath}`, `${routePath} article URL is inconsistent`);
      const about = article.about as Record<string, unknown> | undefined;
      assert(about?.["@type"] === "DefinedTerm", `${routePath} article has no DefinedTerm subject`);
      assert(about?.termCode === catalogEntry.id, `${routePath} article subject is inconsistent`);
      assert(
        about?.inDefinedTermSet === `${siteUrl}${pathFor(locale, ["vocabulary"])}`,
        `${routePath} article points to the wrong vocabulary`
      );
      const mentions = article.mentions;
      const expectedMentionCount = catalogEntry.aliases.length;
      assert(
        (Array.isArray(mentions) ? mentions.length : 0) === expectedMentionCount,
        `${routePath} expected ${expectedMentionCount} related terms`
      );
    }
  }

  assert(/<div id="root">[\s\S]+<\/div>/.test(html), `${routePath} is missing prerendered application HTML`);
  assert(htmlTags(html, "h1").length === 1, `${routePath} must contain exactly one H1`);
  assert(htmlTags(html, "title").length === 1, `${routePath} must contain exactly one title`);
  assert(
    !/>\s*(?:common|nav|landing|catalog|workspace|footer|seo)\.[a-z0-9_.-]+\s*</i.test(html),
    `${routePath} contains an unresolved translation key`
  );

  for (const tagName of ["a", "link", "script", "img"]) {
    for (const tag of htmlTags(html, tagName)) {
      const value = attributes(tag).get(tagName === "a" || tagName === "link" ? "href" : "src");
      if (!value?.startsWith("/")) {
        continue;
      }
      const localPath = value.split(/[?#]/, 1)[0];
      if (localPath.startsWith("/assets/") || /\.[a-z0-9]+$/i.test(localPath)) {
        assert(existsSync(path.join("dist", localPath)), `${routePath} references missing asset ${localPath}`);
        continue;
      }
      assert(localPath.endsWith("/"), `${routePath} links to non-canonical URL ${localPath}`);
      internalLinks.add(localPath);
    }
  }
}

for (const href of internalLinks) {
  assert(sitemapRouteSet.has(href), `Internal link points to a redirect or non-indexable route: ${href}`);
  assert(existsSync(routeFile(href)), `Internal link has no prerendered target: ${href}`);
}

for (const locale of locales) {
  const alternateHome = pathFor(locale);
  assert(sitemapRouteSet.has(alternateHome), `Sitemap is missing locale home ${alternateHome}`);
}

const headers = readFileSync(path.join("dist", "_headers"), "utf8");
for (const header of [
  "Content-Security-Policy:",
  "Strict-Transport-Security:",
  "X-Content-Type-Options: nosniff",
  "X-Frame-Options: DENY",
  "Referrer-Policy:",
  "Permissions-Policy:",
  "Cache-Control: public, max-age=31536000, immutable"
]) {
  assert(headers.includes(header), `Static headers are missing ${header}`);
}

const redirects = readFileSync(path.join("dist", "_redirects"), "utf8");
assert(redirects.includes(`/ ${pathFor(defaultLocale)} 301`), "Root redirect must point to the canonical default locale URL");
assert(
  redirects.includes("/.well-known/security.txt /security.txt 301"),
  "Security contact discovery must resolve through the root fallback"
);
for (const redirect of staticRedirects()) {
  assert(
    redirects.includes(`${redirect.source} ${redirect.destination} ${redirect.status}`),
    `Built redirects are missing ${redirect.source}`
  );
  const destinationPath = redirect.destination.split("?", 1)[0];
  assert(sitemapRouteSet.has(destinationPath), `Redirect destination is not canonical: ${redirect.destination}`);
}
const redirectLines = redirects.trim().split("\n").filter(Boolean);
assert(redirectLines.length === staticRedirects().length + 1, "Built redirects contain unsupported or stale rules");

const notFoundHtml = readFileSync(path.join("dist", "404.html"), "utf8");
assert(notFoundHtml.includes('name="robots" content="noindex,follow"'), "404 page must be excluded from indexing");
assert(notFoundHtml.includes(`href="${pathFor(defaultLocale, ["catalog"])}"`), "404 page must link to the canonical catalog");

assert(!listFiles("dist").some((file) => file.endsWith(".map")), "Production output contains source maps");

console.log(
  `Dist crawl passed: ${sitemapRoutePaths.length} canonical routes, ${internalLinks.size} canonical internal links, ` +
    `${requiredAssets.length} verified assets, valid schema/hreflang/headers.`
);
