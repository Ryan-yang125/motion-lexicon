import { categories } from "./categories";
import { aliasMetadata, canonicalMotionCatalog } from "./motion-catalog";
import type { Locale } from "./types";

export const siteUrl = "https://motion-lexicon.pages.dev";
export const defaultLocale: Locale = "zh";

export function isLocale(value: string | undefined): value is Locale {
  return value === "zh" || value === "en";
}

export function text<T extends Record<Locale, string>>(value: T, locale: Locale) {
  return value[locale];
}

export function localeLabel(locale: Locale) {
  return locale === "zh" ? "中文" : "English";
}

export function pathFor(locale: Locale, parts: string[] = []) {
  return `/${[locale, ...parts].filter(Boolean).join("/")}/`;
}

export function firstEntryPathForCategory(locale: Locale, categoryId: string) {
  const entry = canonicalMotionCatalog.find((item) => item.categoryId === categoryId);
  return entry ? pathFor(locale, [entry.categoryId, entry.id]) : pathFor(locale, [categoryId]);
}

export function switchLocalePath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return pathFor(nextLocale);
  }
  if (isLocale(segments[0])) {
    return pathFor(nextLocale, segments.slice(1));
  }
  return pathFor(nextLocale, segments);
}

export function getStaticPaths() {
  return sitemapPaths();
}

export function sitemapPaths() {
  const paths = new Set<string>();

  for (const locale of ["zh", "en"] as const) {
    paths.add(pathFor(locale));
    paths.add(pathFor(locale, ["catalog"]));
    paths.add(pathFor(locale, ["vocabulary"]));

    for (const category of categories) {
      paths.add(pathFor(locale, [category.id]));
    }

    for (const item of canonicalMotionCatalog) {
      paths.add(pathFor(locale, [item.categoryId, item.id]));
    }
  }

  return Array.from(paths);
}

export type StaticRedirect = {
  source: string;
  destination: string;
  status: 301;
};

export function staticRedirects(): StaticRedirect[] {
  const redirects = new Map<string, StaticRedirect>();
  const add = (source: string, destination: string) => {
    redirects.set(source, { source, destination, status: 301 });
  };

  add("/", pathFor(defaultLocale));

  for (const canonicalPath of sitemapPaths()) {
    const withoutTrailingSlash = canonicalPath.replace(/\/$/, "");
    if (withoutTrailingSlash) {
      add(withoutTrailingSlash, canonicalPath);
    }
  }

  for (const locale of ["zh", "en"] as const) {
    const primaryPlaygroundPath = pathFor(locale, ["easing", "easing"]);
    add(pathFor(locale, ["playground"]), primaryPlaygroundPath);
    add(pathFor(locale, ["playground"]).replace(/\/$/, ""), primaryPlaygroundPath);

    for (const alias of aliasMetadata) {
      const source = pathFor(locale, alias.sourcePath.split("/").filter(Boolean));
      const canonical = pathFor(locale, alias.canonicalPath.split("/").filter(Boolean));
      const focus = new URLSearchParams(alias.query ?? "");
      focus.set("term", alias.entryId);
      const destination = `${canonical}?${focus.toString()}`;
      add(source, destination);
      add(source.replace(/\/$/, ""), destination);
    }
  }

  return Array.from(redirects.values());
}
