import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { registryBlocks } from "../../src/data/block-registry";
import { registryComponents } from "../../src/data/component-registry";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import { installablePrimitiveEntries } from "../../src/data/primitive-registry";
import { getStaticPaths, pathFor, sitemapPaths, staticRedirects } from "../../src/data/site";
import { locales } from "../../src/data/types";

describe("V4 component registry architecture", () => {
  it("publishes Components and Primitives as the two primary directories", () => {
    expect(registryComponents).toHaveLength(52);
    expect(registryBlocks).toHaveLength(5);
    expect(canonicalMotionCatalog).toHaveLength(44);
    expect(new Set(registryComponents.map((item) => item.id)).size).toBe(52);
    expect(installablePrimitiveEntries).toHaveLength(40);

    for (const locale of locales) {
      expect(sitemapPaths()).toContain(pathFor(locale));
      expect(sitemapPaths()).toContain(pathFor(locale, ["components"]));
      expect(sitemapPaths()).toContain(pathFor(locale, ["primitives"]));
      for (const block of registryBlocks) {
        expect(sitemapPaths()).toContain(pathFor(locale, ["blocks", block.id]));
      }
      for (const component of registryComponents) {
        expect(sitemapPaths()).toContain(pathFor(locale, ["components", component.id]));
      }
      for (const primitive of canonicalMotionCatalog) {
        expect(sitemapPaths()).toContain(pathFor(locale, ["primitives", primitive.id]));
      }
    }
  });

  it("uses one source of truth for previews, code, and registry files", () => {
    for (const block of registryBlocks) {
      expect(existsSync(`src/registry/blocks/${block.id}.tsx`)).toBe(true);
      expect(existsSync(`src/registry/block-demos/${block.id}-demo.tsx`)).toBe(true);
      expect(existsSync(`public/r/${block.id}.json`)).toBe(true);
      const source = readFileSync(`src/registry/blocks/${block.id}.tsx`, "utf8");
      const registry = JSON.parse(readFileSync(`public/r/${block.id}.json`, "utf8")) as {
        type: string;
        files: Array<{ content: string; type: string }>;
      };
      expect(source).toContain(`export function ${block.exportName}`);
      expect(source).not.toMatch(/from ["'](?:@\/|\.\.?\/)/);
      expect(registry.type).toBe("registry:block");
      expect(registry.files).toHaveLength(1);
      expect(registry.files[0]).toMatchObject({ content: source, type: "registry:component" });
    }
    for (const component of registryComponents) {
      expect(existsSync(`src/registry/components/${component.id}.tsx`)).toBe(true);
      expect(existsSync(`src/registry/demos/${component.id}-demo.tsx`)).toBe(true);
      expect(existsSync(`public/r/${component.id}.json`)).toBe(true);
    }
    for (const primitive of installablePrimitiveEntries) {
      expect(existsSync(`src/registry/primitives/${primitive.id}.tsx`)).toBe(true);
      expect(existsSync(`src/registry/primitive-demos/${primitive.id}-demo.tsx`)).toBe(true);
      expect(existsSync(`public/r/${primitive.registryId}.json`)).toBe(true);
      const source = readFileSync(`src/registry/primitives/${primitive.id}.tsx`, "utf8");
      const registry = JSON.parse(readFileSync(`public/r/${primitive.registryId}.json`, "utf8")) as {
        files: Array<{ content: string }>;
      };
      expect(source).toContain(`export function ${primitive.exportName}`);
      expect(source).toContain('from "motion/react"');
      expect(source).toContain("useReducedMotion");
      expect(source).not.toMatch(/from ["'](?:@\/|\.\.?\/)/);
      expect(registry.files).toHaveLength(1);
      expect(registry.files[0]?.content).toBe(source);
    }
  });

  it("uses the custom registry glyph in the sidebar", () => {
    const shell = readFileSync("src/components/LibraryShell.tsx", "utf8");
    const icons = readFileSync("src/components/icons.tsx", "utf8");
    expect(shell).toContain("ComponentLibraryGlyph");
    expect(icons).toContain("export const ComponentLibraryGlyph");
  });

  it("removes obsolete product routes", () => {
    const obsolete = ["/packs", "/catalog", "/finder", "/director", "/playground"];
    expect(getStaticPaths()).toHaveLength(246);
    for (const fragment of obsolete) {
      expect(sitemapPaths().some((route) => route.includes(fragment))).toBe(false);
      expect(staticRedirects().some((route) => route.source.includes(fragment))).toBe(false);
    }
  });

  it("opens the Chinese landing page from the domain root", () => {
    expect(staticRedirects()).toContainEqual({
      source: "/",
      destination: "/zh/",
      status: 301
    });
  });

  it("keeps public deployment examples aligned with the static route count", () => {
    const demo = readFileSync("src/registry/primitive-demos/line-drawing-demo.tsx", "utf8");
    expect(demo).toContain(`${getStaticPaths().length} pages`);
  });
});
