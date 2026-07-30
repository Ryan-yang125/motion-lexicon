import { getGlossaryTerm } from "../data/glossary";
import {
  motionIntentGroups,
  type LocalizedPhrases,
  type MotionIntentGroup,
  type MotionIntentVariant
} from "../data/motion-intents";
import { aliasMetadata } from "../data/motion-catalog";
import { getCanonicalRecipe } from "../data/recipes";
import type { Locale, MotionRecipe, ParamValue, ParamValues } from "../data/types";
import { getDefaultParamValues } from "./motion-engine";

export type MotionFinderConfidence = "high" | "medium" | "low";

export type MotionFinderCandidate = {
  rank: number;
  variantId: string;
  canonicalId: string;
  recipe: MotionRecipe;
  name: string;
  description: string;
  reason: string;
  distinction?: string;
  score: number;
  confidence: number;
  matchedTerms: string[];
  presetQuery?: string;
  presetValues: ParamValues;
  values: ParamValues;
  recipePath: string;
};

export type MotionFinderResult = {
  query: string;
  locale: Locale;
  confidence: MotionFinderConfidence;
  confidenceScore: number;
  matchedTerms: string[];
  groupId: string;
  groupName: string;
  reason: string;
  finderPath: string;
  comparePath: string;
  candidates: MotionFinderCandidate[];
};

type Match = { score: number; terms: string[] };

const aliasById = new Map(aliasMetadata.map((alias) => [alias.entryId, alias]));

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\s_./]+/g, " ")
    .replace(/[-–—]+/g, " ")
    .replace(/[，。！？、；：,.!?;:()[\]{}"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scorePhrases(query: string, phrases: LocalizedPhrases): Match {
  const normalizedQuery = normalize(query);
  const matches = new Map<string, number>();
  for (const phrase of [...phrases.zh, ...phrases.en]) {
    const normalizedPhrase = normalize(phrase);
    if (!normalizedPhrase) continue;
    const exact = normalizedQuery === normalizedPhrase;
    const contained = normalizedQuery.includes(normalizedPhrase);
    const reverseContained = normalizedPhrase.length >= 4 && normalizedPhrase.includes(normalizedQuery);
    if (!exact && !contained && !reverseContained) continue;
    const specificity = Math.min(10, Array.from(normalizedPhrase.replaceAll(" ", "")).length);
    const weight = specificity + (exact ? 10 : contained ? 4 : 1);
    matches.set(phrase, Math.max(matches.get(phrase) ?? 0, weight));
  }
  return {
    score: Array.from(matches.values()).reduce((sum, value) => sum + value, 0),
    terms: Array.from(matches.keys())
  };
}

function variantMatch(query: string, variant: MotionIntentVariant) {
  return scorePhrases(query, variant.signals);
}

function groupMatch(query: string, group: MotionIntentGroup) {
  const direct = scorePhrases(query, group.signals);
  const variants = group.variants.map((variant) => variantMatch(query, variant));
  const strongestVariant = Math.max(0, ...variants.map((match) => match.score));
  const supportingVariants = variants.reduce((sum, match) => sum + match.score, 0);
  return {
    group,
    direct,
    variants,
    score: direct.score + strongestVariant * 0.8 + supportingVariants * 0.08
  };
}

function presetValue(recipe: MotionRecipe, id: string, raw: string): ParamValue {
  const param = recipe.params.find((candidate) => candidate.id === id);
  if (!param) return raw;
  if (param.kind === "range") return Number(raw);
  if (param.kind === "toggle") return raw === "true" || raw === "1";
  return raw;
}

function resolveVariant(variantId: string) {
  const recipe = getCanonicalRecipe(variantId);
  if (!recipe) throw new Error(`Motion intent variant has no recipe: ${variantId}`);
  const alias = aliasById.get(variantId);
  const presetValues: ParamValues = {};
  if (alias?.query) {
    for (const [id, raw] of new URLSearchParams(alias.query)) {
      presetValues[id] = presetValue(recipe, id, raw);
    }
  }
  return {
    recipe,
    presetQuery: alias?.query,
    presetValues,
    values: { ...getDefaultParamValues(recipe), ...presetValues }
  };
}

function recipePath(recipe: MotionRecipe, locale: Locale, presetQuery?: string) {
  const base = `/${locale}/${recipe.categoryId}/${recipe.canonicalId}/`;
  return presetQuery ? `${base}?${presetQuery}` : base;
}

function finderPath(query: string, locale: Locale, variants?: readonly string[]) {
  const params = new URLSearchParams({ q: query });
  if (variants?.length) params.set("compare", variants.join(","));
  return `/${locale}/finder/?${params.toString()}`;
}

function roundConfidence(value: number) {
  return Number(Math.max(0, Math.min(0.99, value)).toFixed(2));
}

export function recommendMotions(
  query: string,
  locale: Locale = "en",
  limit = 3
): MotionFinderResult {
  const cleanQuery = query.trim();
  if (!cleanQuery) throw new Error("A motion description is required.");
  if (locale !== "zh" && locale !== "en") {
    throw new Error(`Unsupported locale: ${String(locale)}. Use zh or en.`);
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 3) {
    throw new Error("Motion Finder limit must be an integer from 1 to 3.");
  }

  const rankedGroups = motionIntentGroups
    .map((group, index) => ({ ...groupMatch(cleanQuery, group), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const selected = rankedGroups[0];
  const directTerms = selected.direct.terms;
  const allMatchedTerms = Array.from(
    new Set([...directTerms, ...selected.variants.flatMap((match) => match.terms)])
  );
  const bestVariantScore = Math.max(0, ...selected.variants.map((match) => match.score));
  const confidenceScore = roundConfidence(
    0.18 + Math.min(0.45, selected.direct.score / 50) + Math.min(0.34, bestVariantScore / 45)
  );
  const confidence: MotionFinderConfidence = confidenceScore >= 0.72
    ? "high"
    : confidenceScore >= 0.42
      ? "medium"
      : "low";

  const candidates = selected.group.variants
    .map((variant, index) => {
      const matched = selected.variants[index];
      const resolved = resolveVariant(variant.variantId);
      const glossary = getGlossaryTerm(variant.variantId);
      const evidence = matched.score + selected.direct.score * 0.25;
      const score = Math.round(Math.min(100, 32 + evidence * 2.2));
      const candidateConfidence = roundConfidence(
        0.24 + Math.min(0.55, matched.score / 42) + Math.min(0.16, selected.direct.score / 70)
      );
      return {
        sourceIndex: index,
        evidence,
        candidate: {
          rank: 0,
          variantId: variant.variantId,
          canonicalId: resolved.recipe.canonicalId,
          recipe: resolved.recipe,
          name: glossary?.name[locale] ?? resolved.recipe.name[locale],
          description: glossary?.definition[locale] ?? resolved.recipe.definition[locale],
          reason: variant.reason[locale],
          ...(glossary?.distinction ? { distinction: glossary.distinction[locale] } : {}),
          score,
          confidence: candidateConfidence,
          matchedTerms: Array.from(new Set([...directTerms, ...matched.terms])),
          ...(resolved.presetQuery ? { presetQuery: resolved.presetQuery } : {}),
          presetValues: resolved.presetValues,
          values: resolved.values,
          recipePath: recipePath(resolved.recipe, locale, resolved.presetQuery)
        } satisfies MotionFinderCandidate
      };
    })
    .sort((a, b) => b.evidence - a.evidence || a.sourceIndex - b.sourceIndex)
    .slice(0, limit)
    .map(({ candidate }, index) => ({ ...candidate, rank: index + 1 }));

  const variants = candidates.map((candidate) => candidate.variantId);
  return {
    query: cleanQuery,
    locale,
    confidence,
    confidenceScore,
    matchedTerms: allMatchedTerms,
    groupId: selected.group.id,
    groupName: selected.group.name[locale],
    reason: selected.group.reason[locale],
    finderPath: finderPath(cleanQuery, locale),
    comparePath: finderPath(cleanQuery, locale, variants),
    candidates
  };
}
