// @vitest-environment node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { registryBlocks } from "../../src/data/block-registry";
import { registryComponents } from "../../src/data/component-registry";
import { catalogRecipes } from "../../src/data/recipes";
import { installablePrimitiveEntries } from "../../src/data/primitive-registry";

const publicDir = path.resolve(process.cwd(), "public");

async function parse(relativePath: string) {
  return JSON.parse(await readFile(path.join(publicDir, relativePath), "utf8")) as Record<string, unknown>;
}

describe("V4 public machine-readable artifacts", () => {
  it("publishes one catalog for blocks, components, and primitives", async () => {
    const catalog = await parse("data/v4/catalog.json") as unknown as {
      schemaVersion: number;
      release: string;
      counts: { blocks: number; components: number; primitives: number };
      blocks: Array<{ id: string; urls: { en: string; zh: string; registry: string } }>;
      components: Array<{ id: string; dependencies: string[]; devDependencies?: string[]; engines: string[]; runtimeCost: string; urls: { registry: string } }>;
      primitives: Array<{ id: string; urls: { en: string; registry?: string } }>;
    };
    expect(catalog.schemaVersion).toBe(4);
    expect(catalog.release).toBe("4.4.0");
    expect(catalog.counts).toEqual({ blocks: 5, components: 59, primitives: 44 });
    expect(catalog.blocks).toHaveLength(registryBlocks.length);
    expect(catalog.components).toHaveLength(registryComponents.length);
    expect(catalog.primitives).toHaveLength(catalogRecipes.length);
    expect(catalog.components.every((item) => item.urls.registry.endsWith(`/r/${item.id}.json`))).toBe(true);
    expect(catalog.blocks.every((item) => item.urls.registry.endsWith(`/r/${item.id}.json`))).toBe(true);
    expect(catalog.blocks.every((item) => item.urls.en.includes(`/en/components/${item.id}/`) && item.urls.zh.includes(`/zh/components/${item.id}/`))).toBe(true);
    expect(catalog.components.find((item) => item.id === "scroll-story")).toMatchObject({ dependencies: ["gsap"], engines: ["gsap"], runtimeCost: "medium" });
    expect(catalog.components.find((item) => item.id === "network-globe")).toMatchObject({ dependencies: ["motion", "three"], engines: ["motion", "three"], runtimeCost: "heavy" });
    expect(catalog.components.find((item) => item.id === "network-globe")?.devDependencies).toEqual(["@types/three"]);
    expect(catalog.components.find((item) => item.id === "procedural-product-viewer")?.devDependencies).toEqual(["@types/three"]);
    expect(catalog.primitives.every((item) => item.urls.en.includes(`/en/primitives/${item.id}/`))).toBe(true);
    expect(catalog.primitives.filter((item) => item.urls.registry)).toHaveLength(installablePrimitiveEntries.length);
    expect(catalog.primitives.filter((item) => item.urls.registry).every((item) => item.urls.registry?.endsWith(`/r/primitive-${item.id}.json`))).toBe(true);
  });

  it("publishes the V4 Motion Grammar and the Skill schema", async () => {
    const grammar = await parse("data/v4/motion-grammar.json") as unknown as {
      version: string;
      collections: { components: { count: number }; primitives: { count: number } };
      urls: { zh: string; en: string };
    };
    const publicSchema = await parse("data/v4/motion-blueprint.schema.json");
    const skillSchema = JSON.parse(await readFile(path.resolve("skills/motion-lexicon/assets/motion-blueprint.schema.json"), "utf8"));
    expect(grammar.version).toBe("4.4.0");
    expect(grammar.collections.components.count).toBe(59);
    expect(grammar.collections.primitives.count).toBe(44);
    expect(grammar.urls).toEqual({
      zh: "https://motion-lexicon.pages.dev/zh/skill/",
      en: "https://motion-lexicon.pages.dev/en/skill/"
    });
    expect(publicSchema).toEqual(skillSchema);
    expect(publicSchema.$id).toBe("https://motion-lexicon.pages.dev/data/v4/motion-blueprint.schema.json");
  });

  it("publishes current agent discovery files", async () => {
    const llms = await readFile(path.join(publicDir, "llms.txt"), "utf8");
    const llmsFull = await readFile(path.join(publicDir, "llms-full.txt"), "utf8");
    const pricing = await readFile(path.join(publicDir, "pricing.txt"), "utf8");
    expect(llms).toContain("## Core resources");
    expect(llms).toContain("## English");
    expect(llms).toContain("## 中文");
    expect(llms).toContain("## Optional");
    expect(llms).toContain("/en/components/");
    expect(llms).toContain("/zh/components/");
    expect(llms).toContain("/en/primitives/");
    expect(llms).toContain("/zh/primitives/");
    expect(llms).toContain("/en/guides/");
    expect(llms).toContain("/zh/guides/");
    expect(llms).toContain("/data/v4/catalog.json");
    expect(llms).toContain("/data/v4/motion-grammar.json");
    expect(llms).toMatch(/- \[[^\]]+\]\(https:\/\/[^)]+\):/);
    expect(llms).not.toMatch(/\/(?:packs|catalog|finder|director)\//);
    expect(llmsFull).toContain("## English components");
    expect(llmsFull).toContain("## 中文组件");
    expect(llmsFull).toContain("## English page blocks");
    expect(llmsFull).toContain("## 中文页面 Blocks");
    expect(llmsFull).toContain("## English scenario guides");
    expect(llmsFull).toContain("## 中文场景指南");
    expect(pricing).toContain("free and open source");
    expect(pricing).toContain("免费开源");
  });

  it("keeps the transferable Skill page system synchronized with the website tokens", async () => {
    const pageCss = await readFile(path.resolve("skills/motion-lexicon/assets/motion-lexicon-page.css"), "utf8");
    expect(pageCss).toContain("--bezel: #efeeea");
    expect(pageCss).toContain("--bezel: #141312");
    expect(pageCss).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
