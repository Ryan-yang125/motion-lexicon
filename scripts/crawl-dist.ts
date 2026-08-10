import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { registryComponents } from "../src/data/component-registry";
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

const requiredAssets = [
  "favicon.ico", "favicon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png",
  "site.webmanifest", "og-default.png", "og-zh.png", "og-en.png",
  "og-components-zh.png", "og-components-en.png", "og-primitives-zh.png", "og-primitives-en.png",
  "og-guides-zh.png", "og-guides-en.png", "og-method-zh.png", "og-method-en.png",
  "og-skill-zh.png", "og-skill-en.png", "og-vocabulary-zh.png", "og-vocabulary-en.png",
  "robots.txt", "sitemap.xml", "_headers", "_redirects", "404.html", "r/registry.json"
];
for (const asset of requiredAssets) assert(existsSync(path.join("dist", asset)), `Missing dist asset: ${asset}`);

const routes = sitemapPaths();
const staticRoutes = getStaticPaths();
const routeSet = new Set(routes);
assert(routeSet.size === routes.length, "Sitemap routes contain duplicates");
assert(routes.length === 214, `Expected 214 canonical routes, found ${routes.length}`);
assert(staticRoutes.length === routes.length, "Static and sitemap route counts differ");

const sitemapXml = readFileSync("dist/sitemap.xml", "utf8");
assert((sitemapXml.match(/<loc>/g) ?? []).length === routes.length, "Sitemap XML route count is inconsistent");
assert((sitemapXml.match(/hreflang=/g) ?? []).length === routes.length * 3, "Sitemap hreflang clusters are incomplete");

const internalLinks = new Set<string>();
for (const routePath of routes) {
  assert(existsSync(routeFile(routePath)), `Missing prerendered HTML: ${routePath}`);
  const html = readFileSync(routeFile(routePath), "utf8");
  const locale = routePath.split("/").filter(Boolean)[0];
  assert(isLocale(locale), `${routePath} has no valid locale`);
  assert(tags(html, "h1").length === 1, `${routePath} must contain exactly one H1`);
  assert(/<div id="root">[\s\S]+<\/div>/.test(html), `${routePath} has no prerendered app content`);
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  assert(tags(head, "title").length === 1, `${routePath} must contain exactly one title`);
  const canonical = tags(head, "link").map(attributes).filter((tag) => tag.get("rel") === "canonical");
  assert(canonical.length === 1 && canonical[0].get("href") === `${siteUrl}${routePath}`, `${routePath} canonical is inconsistent`);
  const alternates = tags(head, "link").map(attributes).filter((tag) => tag.get("rel") === "alternate" && tag.has("hreflang"));
  assert(alternates.length === 3, `${routePath} needs zh-CN, en, and x-default alternates`);
  const schemas = Array.from(html.matchAll(/<script\b(?=[^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g), (match) => JSON.parse(match[1]) as Record<string, unknown>);
  assert(schemas.some((schema) => schema["@type"] === "WebPage" && schema.url === `${siteUrl}${routePath}`), `${routePath} WebPage JSON-LD is missing`);
  const ogImage = tags(head, "meta").map(attributes).find((tag) => tag.get("property") === "og:image")?.get("content");
  assert(ogImage?.startsWith(siteUrl), `${routePath} has no first-party Open Graph image`);
  assert(existsSync(path.join("dist", (ogImage ?? "").replace(siteUrl, ""))), `${routePath} Open Graph image is missing`);

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

for (const href of internalLinks) assert(routeSet.has(href), `Internal link has no static target: ${href}`);

const registry = JSON.parse(readFileSync("dist/r/registry.json", "utf8")) as { items?: Array<{ name?: string }> };
const registryItemCount = registryComponents.length + installablePrimitiveEntries.length;
assert(registry.items?.length === registryItemCount, "Published shadcn registry count is inconsistent");
for (const component of registryComponents) {
  assert(registry.items?.some((item) => item.name === component.id), `Registry index is missing ${component.id}`);
  const item = JSON.parse(readFileSync(`dist/r/${component.id}.json`, "utf8")) as { name?: string; type?: string; files?: unknown[] };
  assert(item.name === component.id && item.type === "registry:ui" && (item.files?.length ?? 0) > 0, `Registry item ${component.id} is invalid`);
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
for (const obsolete of ["/packs", "/catalog", "/finder", "/director", "/playground"]) {
  assert(!redirects.includes(obsolete), `Obsolete redirect remains: ${obsolete}`);
}

const headers = readFileSync("dist/_headers", "utf8");
for (const header of ["Content-Security-Policy:", "Strict-Transport-Security:", "X-Content-Type-Options: nosniff", "X-Frame-Options: DENY", "Referrer-Policy:"]) {
  assert(headers.includes(header), `Static headers are missing ${header}`);
}
assert(!listFiles("dist").some((file) => file.endsWith(".map")), "Production output contains source maps");

console.log(`Dist crawl passed: ${routes.length} canonical pages, ${internalLinks.size} internal links, ${registryItemCount} registry items, and ${requiredAssets.length} required assets.`);
