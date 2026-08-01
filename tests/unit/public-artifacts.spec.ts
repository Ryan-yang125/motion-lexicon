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
  it("publishes the easing-curve brand mark across browser assets", async () => {
    const geometry = "M23 62C26 35 37 27 65 25";
    const axis = "M22 64V24M22 64H66";
    const favicon = await readArtifact("favicon.svg");
    const mark = await readArtifact("brand/motion-lexicon-mark.svg");
    const inverse = await readArtifact("brand/motion-lexicon-mark-inverse.svg");

    for (const asset of [favicon, mark, inverse]) {
      expect(asset).toContain(geometry);
      expect(asset).toContain(axis);
      expect(asset.toLowerCase()).toContain("#0a84ff");
    }
  });

  it("publishes the complete canonical catalog and vocabulary", async () => {
    const catalog = await parseArtifact("data/v1/catalog.json") as unknown as {
      schemaVersion: number;
      counts: {
        categories: number;
        recipes: number;
        packs: number;
        motionPrimitives: number;
        productMoments: number;
        vocabularyTerms: number;
        aliases: number;
      };
      recipes: Array<{ id: string; dataUrl: string; productMoments: Array<{ id: string }> }>;
      endpoints: {
        productMoments: { zh: string; en: string };
        motionPrimitives: { zh: string; en: string };
        motionBlueprintSchema: string;
      };
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
      packs: 28,
      motionPrimitives: 44,
      productMoments: 28,
      vocabularyTerms: 91,
      aliases: 47
    });
    expect(catalog.recipes).toHaveLength(44);
    expect(new Set(catalog.recipes.map((recipe) => recipe.id)).size).toBe(44);
    expect(catalog.recipes.find((recipe) => recipe.id === "press-tap-feedback")?.productMoments).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "save-confirmation" })])
    );
    expect(catalog.endpoints.productMoments.en).toBe("https://motion-lexicon.pages.dev/en/packs/");
    expect(catalog.endpoints.motionPrimitives.en).toBe("https://motion-lexicon.pages.dev/en/catalog/");
    expect(catalog.endpoints.motionBlueprintSchema).toBe(
      "https://motion-lexicon.pages.dev/data/v2/motion-blueprint.schema.json"
    );
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
    expect(schema.oneOf).toHaveLength(4);
    expect(schema.$defs).toHaveProperty("recipeDocument");
    expect(schema.$defs).toHaveProperty("motionPacksDocument");
    expect(schema.$defs).toHaveProperty("catalogDocument");
    expect(schema.$defs).toHaveProperty("vocabularyDocument");
    expect(schema.$defs).toHaveProperty("motionFoundation");
    expect(schema.$defs).toHaveProperty("productMomentReference");

    for (const filename of recipeFiles) {
      const recipe = await parseArtifact(`data/v1/recipes/${filename}`);
      expect(recipe.kind, filename).toBe("recipe");
      expect(recipe.parameters, filename).toBeInstanceOf(Array);
      expect(recipe.guidance, filename).toBeTypeOf("object");
      expect(recipe.productMoments, filename).toBeInstanceOf(Array);
      expect(recipe, filename).not.toHaveProperty("outputs");
      expect(recipe, filename).not.toHaveProperty("prompt");
      expect(recipe, filename).not.toHaveProperty("html");
      expect(recipe, filename).not.toHaveProperty("css");
      expect(recipe, filename).not.toHaveProperty("js");
    }
  });

  it("publishes all 28 copy-ready Motion Packs", async () => {
    const packs = await parseArtifact("data/v1/packs.json") as unknown as {
      kind: string;
      count: number;
      packs: Array<{
        id: string;
        foundations: Array<{
          id: string;
          role: string;
          roleLabel: { zh: string; en: string };
          note: { zh: string; en: string };
        }>;
        source: { html: string; css: string; js: string };
      }>;
    };

    expect(packs).toMatchObject({ kind: "packs", count: 28 });
    expect(packs.packs).toHaveLength(28);
    expect(new Set(packs.packs.map((pack) => pack.id)).size).toBe(28);
    expect(packs.packs.map((pack) => pack.id)).toEqual(
      expect.arrayContaining([
        "upload-complete",
        "sync-recovery",
        "delete-confirmation",
        "assignee-picker",
        "permission-change",
        "search-suggestions",
        "kanban-move",
        "cart-update",
        "comment-reply",
        "approval-request",
        "checkout-payment",
        "scheduled-publish"
      ])
    );
    for (const pack of packs.packs) {
      expect(pack.source.html, pack.id).toContain("data-motion-pack");
      expect(pack.source.css, pack.id).toContain("prefers-reduced-motion");
      expect(pack.source.js, pack.id).toContain("querySelector");
      expect(pack.foundations.length, pack.id).toBeGreaterThanOrEqual(3);
      expect(new Set(pack.foundations.map((foundation) => foundation.id)).size, pack.id).toBe(
        pack.foundations.length
      );
      for (const foundation of pack.foundations) {
        expect(foundation.role).not.toHaveLength(0);
        expect(foundation.roleLabel.zh).not.toHaveLength(0);
        expect(foundation.roleLabel.en).not.toHaveLength(0);
        expect(foundation.note.zh).not.toHaveLength(0);
        expect(foundation.note.en).not.toHaveLength(0);
      }
    }
  });

  it("publishes the shared Motion Grammar for the website and Motion Director", async () => {
    const grammar = await parseArtifact("data/v2/motion-grammar.json") as unknown as {
      kind: string;
      version: string;
      project: { releaseVersion: string; skillCommand: string };
      urls: { zh: string; en: string };
      grammar: {
        collections: { primitives: { count: number }; moments: { count: number } };
        invariants: Array<{ zh: string; en: string }>;
      };
      modes: Array<{ id: string; title: { zh: string; en: string } }>;
      examples: Array<{
        version: string;
        provenance: { status: string; moments: string[] };
      }>;
    };

    expect(grammar.kind).toBe("motion-grammar");
    expect(grammar.version).toBe("2.0.0");
    expect(grammar.project.releaseVersion).toBe("2.0.0");
    expect(grammar.project.skillCommand).toBe(
      "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon"
    );
    expect(grammar.urls.en).toBe("https://motion-lexicon.pages.dev/en/director/");
    expect(grammar.urls.zh).toBe("https://motion-lexicon.pages.dev/zh/director/");
    expect(grammar.grammar.collections).toMatchObject({
      primitives: { count: 44 },
      moments: { count: 28 }
    });
    expect(grammar.grammar.invariants).toHaveLength(6);
    expect(grammar.modes.map((mode) => mode.id)).toEqual([
      "recommend",
      "compose",
      "implement",
      "review",
      "contribute"
    ]);
    expect(grammar.examples).toEqual([
      expect.objectContaining({
        version: "2.0",
        provenance: expect.objectContaining({ status: "published", moments: ["approval-request"] })
      })
    ]);
  });

  it("publishes the Motion Blueprint schema that the Skill uses", async () => {
    const publicSchema = await parseArtifact("data/v2/motion-blueprint.schema.json");
    const skillSchema = JSON.parse(
      await readFile(path.resolve(process.cwd(), "skills/motion-lexicon/assets/motion-blueprint.schema.json"), "utf8")
    ) as Record<string, unknown>;

    expect(publicSchema).toEqual(skillSchema);
    expect(publicSchema).toMatchObject({
      $id: "https://motion-lexicon.pages.dev/data/v2/motion-blueprint.schema.json",
      title: "Motion Lexicon Motion Blueprint"
    });
  });

  it("advertises Motion Director and the Agent Skill in both LLM indexes", async () => {
    const expectedReferences = [
      "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon",
      "https://motion-lexicon.pages.dev/en/director/",
      "https://motion-lexicon.pages.dev/data/v2/motion-grammar.json"
    ];

    for (const filename of ["llms.txt", "llms-full.txt"]) {
      const content = await readArtifact(filename);
      for (const reference of expectedReferences) expect(content, filename).toContain(reference);
      expect(content, filename).toContain("https://motion-lexicon.pages.dev/en/finder/");
      expect(content, filename).toContain("https://motion-lexicon.pages.dev/en/packs/");
      expect(content, filename).toContain("https://motion-lexicon.pages.dev/en/catalog/");
      expect(/\bcli\b/i.test(content), filename).toBe(false);
    }
  });

  it("publishes a machine-readable free pricing statement", async () => {
    const pricing = await readArtifact("pricing.txt");
    const catalog = await parseArtifact("data/v1/catalog.json") as unknown as {
      endpoints: {
        pricing: string;
        motionGrammar: string;
        motionBlueprintSchema: string;
        director: { en: string; zh: string };
      };
    };

    expect(pricing).toContain("- Price: $0");
    expect(pricing).toContain("- Account required: No");
    expect(pricing).toContain("- Billing: None");
    expect(catalog.endpoints.pricing).toBe("https://motion-lexicon.pages.dev/pricing.txt");
    expect(catalog.endpoints.motionGrammar).toBe(
      "https://motion-lexicon.pages.dev/data/v2/motion-grammar.json"
    );
    expect(catalog.endpoints.motionBlueprintSchema).toBe(
      "https://motion-lexicon.pages.dev/data/v2/motion-blueprint.schema.json"
    );
    expect(catalog.endpoints.director.en).toBe("https://motion-lexicon.pages.dev/en/director/");
    expect(catalog.endpoints.director.zh).toBe("https://motion-lexicon.pages.dev/zh/director/");

    for (const filename of ["llms.txt", "llms-full.txt"]) {
      expect(await readArtifact(filename), filename).toContain(
        "https://motion-lexicon.pages.dev/pricing.txt (free; no account required)"
      );
    }
  });
});
