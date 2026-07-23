import { describe, expect, it } from "vitest";
import {
  getGlossaryTerm,
  getGlossaryTermsForCanonical,
  glossaryTerms
} from "../../src/data/glossary";
import {
  getMotionGuidance,
  motionGuidanceByCanonicalId
} from "../../src/data/motion-guidance";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import { compactCatalogEntries } from "../../src/data/compact-catalog";
import { getCategory } from "../../src/data/categories";
import { catalogRecipes, entries } from "../../src/data/recipes";
import { entryStructuredData } from "../../src/lib/structured-data";

function expectUnique(values: string[], label: string) {
  expect(new Set(values).size, label).toBe(values.length);
}

describe("Motion Lexicon animation vocabulary", () => {
  it("covers all 91 terms with stable identity and original technical definitions", () => {
    expect(glossaryTerms).toHaveLength(91);
    expectUnique(glossaryTerms.map((entry) => entry.id), "glossary ids");
    expectUnique(glossaryTerms.map((entry) => entry.name.en), "English glossary names");

    for (const term of glossaryTerms) {
      const inventoryEntry = entries.find((entry) => entry.id === term.id);
      expect(inventoryEntry, term.id).toBeDefined();
      expect(term.name.en, term.id).toBe(inventoryEntry?.source.term);
      expect(inventoryEntry?.source.skill, term.id).toBe("motion-lexicon");
      expect(term.categoryId, term.id).toBe(inventoryEntry?.categoryId);
      expect(term.section, term.id).toBe(inventoryEntry?.source.glossarySection);
      expect(term.definition.en, term.id).toMatch(/[.!?]$/);
      expect(term.definition.en.replace(/[.!?]$/, ""), term.id).toBe(
        inventoryEntry?.source.definition.replace(/[.!?]$/, "")
      );
    }
  });

  it("ships a specific Chinese translation for every definition", () => {
    expectUnique(glossaryTerms.map((entry) => entry.definition.zh), "Chinese definitions");

    for (const term of glossaryTerms) {
      expect(term.name.zh.trim().length, `${term.id}.name.zh`).toBeGreaterThan(0);
      expect(term.definition.zh.trim().length, `${term.id}.definition.zh`).toBeGreaterThan(6);
      expect(term.definition.zh, `${term.id}.definition.zh`).toMatch(/[。！？]$/);
      expect(term.definition.zh, `${term.id}.definition.zh`).not.toMatch(
        /核心词条|用来帮助|用来把.*处理得更精致/
      );
    }
  });

  it("preserves 44 workspaces while exposing all 47 aliases with distinctions", () => {
    const canonicalTerms = glossaryTerms.filter((entry) => entry.canonical);
    const aliases = glossaryTerms.filter((entry) => entry.alias);
    expect(canonicalTerms).toHaveLength(44);
    expect(aliases).toHaveLength(47);
    expectUnique(aliases.map((entry) => entry.distinction?.zh ?? ""), "Chinese distinctions");
    expectUnique(aliases.map((entry) => entry.distinction?.en ?? ""), "English distinctions");

    for (const alias of aliases) {
      expect(alias.canonicalId, alias.id).not.toBe(alias.id);
      expect(alias.distinction?.zh.trim().length, `${alias.id}.distinction.zh`).toBeGreaterThan(10);
      expect(alias.distinction?.en.trim().length, `${alias.id}.distinction.en`).toBeGreaterThan(20);
    }

    for (const metadata of canonicalMotionCatalog) {
      const grouped = getGlossaryTermsForCanonical(metadata.id);
      expect(grouped.map((entry) => entry.id), metadata.id).toEqual([
        metadata.id,
        ...metadata.aliases
      ]);
      expect(grouped[0]?.canonical, metadata.id).toBe(true);
    }

    expect(getGlossaryTerm("pop-in")?.canonicalId).toBe("scale-in");
    expect(getGlossaryTerm("pop-in")?.definition.en).toBe(
      "An entrance crosses the final scale briefly, then settles back to create a compact spring-like accent."
    );
    expect(getGlossaryTerm("missing-term")).toBeUndefined();
    expect(getGlossaryTermsForCanonical("missing-workspace")).toEqual([]);
  });

  it("keeps the lightweight landing index aligned with canonical vocabulary", () => {
    expect(compactCatalogEntries).toHaveLength(44);
    for (const entry of compactCatalogEntries) {
      const term = getGlossaryTerm(entry.id);
      expect(entry.name, entry.id).toEqual(term?.name);
      expect(entry.shortDescription, entry.id).toEqual(
        canonicalMotionCatalog.find((metadata) => metadata.id === entry.id)?.summary
      );
    }
  });
});

describe("canonical motion guidance", () => {
  it("provides a complete, specific review contract for all 44 workspaces", () => {
    const canonicalIds = canonicalMotionCatalog.map((entry) => entry.id).sort();
    expect(Object.keys(motionGuidanceByCanonicalId).sort()).toEqual(canonicalIds);

    const guidance = canonicalIds.map((id) => getMotionGuidance(id));
    expect(guidance.every(Boolean)).toBe(true);

    const localizedFields = [
      "purpose",
      "frequency",
      "trigger",
      "enterExit",
      "interruptibility",
      "gestureRules",
      "reducedMotionStrategy"
    ] as const;

    for (const field of localizedFields) {
      expectUnique(
        guidance.map((entry) => entry?.[field].zh ?? ""),
        `${field}.zh`
      );
      expectUnique(
        guidance.map((entry) => entry?.[field].en ?? ""),
        `${field}.en`
      );
    }

    for (const entry of guidance) {
      if (!entry) continue;
      for (const field of localizedFields) {
        expect(entry[field].zh.trim().length, `${entry.canonicalId}.${field}.zh`).toBeGreaterThan(8);
        expect(entry[field].en.trim().length, `${entry.canonicalId}.${field}.en`).toBeGreaterThan(16);
      }
      expect(entry.reviewNotes.length, `${entry.canonicalId}.reviewNotes`).toBeGreaterThanOrEqual(2);
      for (const [index, note] of entry.reviewNotes.entries()) {
        expect(note.zh.trim().length, `${entry.canonicalId}.reviewNotes.${index}.zh`).toBeGreaterThan(6);
        expect(note.en.trim().length, `${entry.canonicalId}.reviewNotes.${index}.en`).toBeGreaterThan(12);
      }
    }

    expect(getMotionGuidance("missing-workspace")).toBeUndefined();
  });
});

describe("vocabulary structured data", () => {
  it("connects every canonical workspace to its complete term set", () => {
    for (const recipe of catalogRecipes) {
      const category = getCategory(recipe.categoryId);
      expect(category, recipe.id).toBeDefined();
      if (!category) continue;

      const schema = entryStructuredData("en", category, recipe) as {
        "@type": string;
        url: string;
        about?: { termCode?: string; inDefinedTermSet?: string; url?: string };
        mentions?: Array<{ termCode?: string; inDefinedTermSet?: string }>;
      };

      expect(schema["@type"], recipe.id).toBe("TechArticle");
      expect(schema.url, recipe.id).toBe(
        `https://motion-lexicon.pages.dev/en/${recipe.categoryId}/${recipe.id}/`
      );
      expect(schema.about?.termCode, recipe.id).toBe(recipe.id);
      expect(schema.about?.inDefinedTermSet, recipe.id).toBe(
        "https://motion-lexicon.pages.dev/en/vocabulary/"
      );
      expect(schema.about?.url, recipe.id).toBe(
        `https://motion-lexicon.pages.dev/en/vocabulary/#term-${recipe.id}`
      );
      expect(schema.mentions?.length ?? 0, recipe.id).toBe(recipe.aliases.length);
      expect(
        schema.mentions?.every(
          (term) => term.inDefinedTermSet === "https://motion-lexicon.pages.dev/en/vocabulary/"
        ) ?? true,
        recipe.id
      ).toBe(true);
    }
  });
});
