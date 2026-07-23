import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  defaultLocale,
  getStaticPaths,
  isLocale,
  pathFor,
  sitemapPaths,
  siteUrl,
  staticRedirects
} from "../src/data/site";
import { locales } from "../src/data/types";
import { render } from "../src/entry-server";
import { generatePublicArtifacts } from "./generate-public-artifacts";
import type { HelmetServerState } from "react-helmet-async/lib/types";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const templatePath = path.join(distDir, "index.html");

function stripDefaultHead(html: string) {
  return html
    .replace(/<title>.*?<\/title>/s, "")
    .replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/s, "");
}

function injectAppHtml(
  template: string,
  appHtml: string,
  helmet: HelmetServerState
) {
  const helmetHead = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString().replace(/\bhrefLang=/g, "hreflang="),
    helmet.script.toString()
  ]
    .filter(Boolean)
    .join("\n    ");

  return stripDefaultHead(template)
    .replace(/<html[^>]*>/, `<html ${helmet.htmlAttributes.toString()}>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace("</head>", `    ${helmetHead}\n  </head>`);
}

async function writeRoute(routePath: string, html: string) {
  const outputPath =
    routePath === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, routePath.replace(/^\//, ""), "index.html");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

async function writeSitemap() {
  const sitemapRoutePaths = sitemapPaths();
  const sitemapRouteSet = new Set(sitemapRoutePaths);
  const entries = sitemapRoutePaths
    .map((routePath) => {
      const segments = routePath.split("/").filter(Boolean);
      const locale = segments[0];
      if (!isLocale(locale)) {
        throw new Error(`Sitemap route is missing a locale: ${routePath}`);
      }

      const parts = segments.slice(1);
      const alternates = locales.map((alternateLocale) => {
        const alternatePath = pathFor(alternateLocale, parts);
        if (!sitemapRouteSet.has(alternatePath)) {
          throw new Error(`Sitemap hreflang target is not canonical: ${alternatePath}`);
        }
        return `    <xhtml:link rel="alternate" hreflang="${alternateLocale === "zh" ? "zh-CN" : "en"}" href="${siteUrl}${alternatePath}" />`;
      });
      alternates.push(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${pathFor(defaultLocale, parts)}" />`
      );

      return [
        "  <url>",
        `    <loc>${siteUrl}${routePath}</loc>`,
        ...alternates,
        "  </url>"
      ].join("\n");
    })
    .join("\n");

  await writeFile(
    path.join(distDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`,
    "utf8"
  );
}

async function writeRobots() {
  await writeFile(
    path.join(distDir, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
    "utf8"
  );
}

async function writeRedirects() {
  const rules = staticRedirects().map(
    ({ source, destination, status }) => `${source} ${destination} ${status}`
  );
  rules.push("/.well-known/security.txt /security.txt 301");
  await writeFile(path.join(distDir, "_redirects"), `${rules.join("\n")}\n`, "utf8");
}

async function main() {
  const template = await readFile(templatePath, "utf8");

  for (const routePath of getStaticPaths()) {
    const { appHtml, helmet } = await render(routePath);
    if (!helmet) {
      throw new Error(`Missing helmet data for ${routePath}`);
    }
    await writeRoute(routePath, injectAppHtml(template, appHtml, helmet));
  }

  await writeSitemap();
  await writeRobots();
  await writeRedirects();
  await generatePublicArtifacts(distDir);
}

await main();
