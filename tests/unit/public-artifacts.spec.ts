// @vitest-environment node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const publicDir = path.resolve(process.cwd(), "public");

async function readArtifact(relativePath: string) {
  return readFile(path.join(publicDir, relativePath), "utf8");
}

async function parseArtifact(relativePath: string) {
  return JSON.parse(await readArtifact(relativePath)) as Record<string, unknown>;
}

describe("public machine-readable artifacts", () => {
  it("publishes the complete canonical catalog and vocabulary", async () => {
    const catalog = await parseArtifact("data/v1/catalog.json") as unknown as {
      schemaVersion: number;
      counts: { categories: number; recipes: number; vocabularyTerms: number; aliases: number };
      recipes: Array<{ id: string; dataUrl: string }>;
    };
    const vocabulary = await parseArtifact("data/v1/vocabulary.json") as unknown as {
      count: number;
      canonicalCount: number;
      aliasCount: number;
      terms: Array<{ id: string; canonicalId: string }>;
    };

    expect(catalog.schemaVersion).toBe(1);
    expect(catalog.counts).toEqual({
      categories: 12,
      recipes: 44,
      vocabularyTerms: 91,
      aliases: 47
    });
    expect(catalog.recipes).toHaveLength(44);
    expect(new Set(catalog.recipes.map((recipe) => recipe.id)).size).toBe(44);
    expect(vocabulary).toMatchObject({ count: 91, canonicalCount: 44, aliasCount: 47 });
    expect(vocabulary.terms).toHaveLength(91);
    expect(new Set(vocabulary.terms.map((term) => term.id)).size).toBe(91);
  });

  it("keeps recipe artifacts metadata-only and covered by the public schema", async () => {
    const recipeFiles = (await readdir(path.join(publicDir, "data/v1/recipes")))
      .filter((filename) => filename.endsWith(".json"));
    const schema = await parseArtifact("data/v1/schema.json") as unknown as {
      oneOf: unknown[];
      $defs: Record<string, unknown>;
    };

    expect(recipeFiles).toHaveLength(44);
    expect(schema.oneOf).toHaveLength(3);
    expect(schema.$defs).toHaveProperty("recipeDocument");
    expect(schema.$defs).toHaveProperty("catalogDocument");
    expect(schema.$defs).toHaveProperty("vocabularyDocument");

    for (const filename of recipeFiles) {
      const recipe = await parseArtifact(`data/v1/recipes/${filename}`);
      expect(recipe.kind, filename).toBe("recipe");
      expect(recipe.parameters, filename).toBeInstanceOf(Array);
      expect(recipe.guidance, filename).toBeTypeOf("object");
      expect(recipe, filename).not.toHaveProperty("outputs");
      expect(recipe, filename).not.toHaveProperty("prompt");
      expect(recipe, filename).not.toHaveProperty("html");
      expect(recipe, filename).not.toHaveProperty("css");
      expect(recipe, filename).not.toHaveProperty("js");
    }
  });

  it("advertises the free CLI and Agent Skill in both LLM indexes", async () => {
    const expectedCommands = [
      "npx github:Ryan-yang125/motion-lexicon",
      "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon"
    ];

    for (const filename of ["llms.txt", "llms-full.txt"]) {
      const content = await readArtifact(filename);
      for (const command of expectedCommands) expect(content, filename).toContain(command);
    }
  });
});
