// @vitest-environment node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { registryComponents } from "../../src/data/component-registry";
import { catalogRecipes } from "../../src/data/recipes";
import { installablePrimitiveEntries } from "../../src/data/primitive-registry";

const publicDir = path.resolve(process.cwd(), "public");

async function parse(relativePath: string) {
  return JSON.parse(await readFile(path.join(publicDir, relativePath), "utf8")) as Record<string, unknown>;
}

describe("V4 public machine-readable artifacts", () => {
  it("publishes one catalog for components and primitives", async () => {
    const catalog = await parse("data/v4/catalog.json") as unknown as {
      schemaVersion: number;
      release: string;
      counts: { components: number; primitives: number };
      components: Array<{ id: string; urls: { registry: string } }>;
      primitives: Array<{ id: string; urls: { en: string; registry?: string } }>;
    };
    expect(catalog.schemaVersion).toBe(4);
    expect(catalog.release).toBe("4.0.0");
    expect(catalog.counts).toEqual({ components: 28, primitives: 44 });
    expect(catalog.components).toHaveLength(registryComponents.length);
    expect(catalog.primitives).toHaveLength(catalogRecipes.length);
    expect(catalog.components.every((item) => item.urls.registry.endsWith(`/r/${item.id}.json`))).toBe(true);
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
    expect(grammar.version).toBe("4.0.0");
    expect(grammar.collections.components.count).toBe(28);
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
    expect(llms).toContain("/en/components/");
    expect(llms).toContain("/en/primitives/");
    expect(llms).toContain("/data/v4/catalog.json");
    expect(llms).toContain("/data/v4/motion-grammar.json");
    expect(llms).not.toMatch(/\/(?:packs|catalog|finder|director)\//);
  });
});
