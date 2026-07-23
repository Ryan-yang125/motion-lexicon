import { glossaryTerms } from "./glossary";
import {
  canonicalMotionCatalog,
  getCanonicalId,
  getMotionCatalogMeta
} from "./motion-catalog";
import { enrichMotionEntry } from "./motion-specs";
import type { MotionEntry, MotionRecipe, PreviewKind } from "./types";

const previewKindByCategory: Readonly<Record<string, PreviewKind>> = {
  entrances: "entranceExit",
  sequencing: "sequencing",
  transforms: "transform",
  "state-transitions": "state",
  scroll: "scroll",
  feedback: "feedback",
  easing: "easing",
  springs: "spring",
  loops: "loop",
  "polish-effects": "effect",
  performance: "performance",
  principles: "principle"
};

function relatedCanonicalIds(canonicalId: string, categoryId: string) {
  const categoryPeers = canonicalMotionCatalog
    .filter((item) => item.categoryId === categoryId && item.id !== canonicalId)
    .map((item) => item.id);
  const index = canonicalMotionCatalog.findIndex((item) => item.id === canonicalId);
  const neighbours = [
    canonicalMotionCatalog[index - 1]?.id,
    canonicalMotionCatalog[index + 1]?.id
  ].filter((id): id is string => Boolean(id) && id !== canonicalId);
  return Array.from(new Set([...categoryPeers, ...neighbours])).slice(0, 3);
}

/**
 * Runtime entries are assembled from the compact Motion Lexicon glossary.
 * The historical generated entry files remain source archives; their repeated
 * boilerplate stays out of the browser bundle.
 */
const rawEntries: MotionEntry[] = glossaryTerms.map((term) => {
  const metadata = getMotionCatalogMeta(term.id);
  if (!metadata) {
    throw new Error(`Missing catalog metadata for glossary term: ${term.id}`);
  }
  const previewKind = previewKindByCategory[term.categoryId];
  if (!previewKind) {
    throw new Error(`Missing preview kind for category: ${term.categoryId}`);
  }
  return {
    id: term.id,
    slug: term.id,
    categoryId: term.categoryId,
    entryType: ["performance", "principles"].includes(term.categoryId) ? "concept" : "recipe",
    previewKind,
    source: {
      skill: "motion-lexicon",
      glossarySection: term.section,
      term: term.name.en,
      definition: term.definition.en
    },
    name: term.name,
    shortDescription: metadata.summary,
    definition: term.definition,
    usage: [],
    examples: [],
    context: [term.definition],
    params: [],
    reviewNotes: [],
    reducedMotion: term.definition,
    relatedEntries: relatedCanonicalIds(metadata.canonicalId, metadata.categoryId),
    seo: {
      title: term.name,
      description: metadata.summary
    }
  };
});

export const entries: MotionRecipe[] = rawEntries.map(enrichMotionEntry);

export const recipes = entries;

const entryById = new Map(entries.map((entry) => [entry.id, entry]));
const firstEntryByCategory = new Map<string, MotionRecipe>();

for (const entry of entries) {
  if (!firstEntryByCategory.has(entry.categoryId)) {
    firstEntryByCategory.set(entry.categoryId, entry);
  }
}

export const catalogRecipes: MotionRecipe[] = canonicalMotionCatalog.map(
  (metadata) => {
    const recipe = entryById.get(metadata.representativeEntryId);
    if (!recipe) {
      throw new Error(`Missing representative recipe: ${metadata.representativeEntryId}`);
    }
    return recipe;
  }
);

const catalogRecipeById = new Map(catalogRecipes.map((entry) => [entry.id, entry]));

export function getRecipe(categoryId: string, recipeId: string) {
  const entry = entryById.get(recipeId);
  return entry?.categoryId === categoryId ? entry : undefined;
}

export function getCatalogRecipe(recipeId: string) {
  return catalogRecipeById.get(recipeId);
}

export function getRecipesByCategory(categoryId: string) {
  return entries.filter((entry) => entry.categoryId === categoryId);
}

export function getCatalogRecipesByCategory(categoryId: string) {
  return catalogRecipes.filter((entry) => entry.categoryId === categoryId);
}

export function getCanonicalRecipe(
  entryOrId: string | { id: string }
): MotionRecipe | undefined {
  const canonicalId = getCanonicalId(entryOrId);
  return canonicalId ? entryById.get(canonicalId) : undefined;
}

export function getFirstRecipeByCategory(categoryId: string) {
  return firstEntryByCategory.get(categoryId);
}

export const seedRecipe = entries.find((entry) => entry.id === "slide-in") ?? entries[0];

export {
  aliasMetadata,
  canonicalIdByEntryId,
  canonicalMotionCatalog,
  getCanonicalId,
  getMotionCatalogMeta,
  isCanonicalEntryId
} from "./motion-catalog";
