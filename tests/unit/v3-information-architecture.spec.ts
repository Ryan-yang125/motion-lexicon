import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { registryComponents } from "../../src/data/component-registry";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import { getStaticPaths, pathFor, sitemapPaths, staticRedirects } from "../../src/data/site";
import { locales } from "../../src/data/types";

describe("V3 component registry architecture", () => {
  it("publishes Components and Primitives as the two primary directories", () => {
    expect(registryComponents).toHaveLength(28);
    expect(canonicalMotionCatalog).toHaveLength(44);
    expect(new Set(registryComponents.map((item) => item.id)).size).toBe(28);

    for (const locale of locales) {
      expect(sitemapPaths()).toContain(pathFor(locale, ["components"]));
      expect(sitemapPaths()).toContain(pathFor(locale, ["primitives"]));
      for (const component of registryComponents) {
        expect(sitemapPaths()).toContain(pathFor(locale, ["components", component.id]));
      }
      for (const primitive of canonicalMotionCatalog) {
        expect(sitemapPaths()).toContain(pathFor(locale, ["primitives", primitive.id]));
      }
    }
  });

  it("uses one source of truth for previews, code, and registry files", () => {
    for (const component of registryComponents) {
      expect(existsSync(`src/registry/components/${component.id}.tsx`)).toBe(true);
      expect(existsSync(`src/registry/demos/${component.id}-demo.tsx`)).toBe(true);
      expect(existsSync(`public/r/${component.id}.json`)).toBe(true);
    }
  });

  it("removes obsolete product routes", () => {
    const obsolete = ["/packs", "/catalog", "/finder", "/director", "/playground"];
    expect(getStaticPaths()).toHaveLength(172);
    for (const fragment of obsolete) {
      expect(sitemapPaths().some((route) => route.includes(fragment))).toBe(false);
      expect(staticRedirects().some((route) => route.source.includes(fragment))).toBe(false);
    }
  });

  it("opens the Chinese component directory from the domain root", () => {
    expect(staticRedirects()).toContainEqual({
      source: "/",
      destination: "/zh/components/",
      status: 301
    });
  });
});
