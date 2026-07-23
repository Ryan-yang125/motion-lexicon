import { categories } from "../../../src/data/categories.js";
import {
  aliasMetadata,
  canonicalMotionCatalog
} from "../../../src/data/motion-catalog.js";
import {
  catalogRecipes,
  getCanonicalRecipe
} from "../../../src/data/recipes.js";
import { siteUrl } from "../../../src/data/site.js";
import type {
  Locale,
  MotionParam,
  MotionRecipe,
  MotionSurfaceType,
  ParamValue,
  ParamValues,
  RangeParam
} from "../../../src/data/types.js";
import {
  buildCopyBundle,
  buildRecipeCss,
  buildRecipeHtml,
  buildRecipeJs,
  buildRecipePrompt,
  createRecipeSearchIndex,
  getDefaultParamValues,
  valuesToSearchParams
} from "../../../src/lib/motion-engine.js";
import {
  MotionLexiconError,
  schemaVersion,
  type CatalogDocument,
  type CatalogItem,
  type CatalogOptions,
  type CliLocale,
  type RecipeDocument,
  type RecipeExportDocument,
  type RecipeOptions,
  type ResolvedRecipe,
  type SchemaName,
  type SearchDocument,
  type SearchOptions
} from "./types.js";

const aliasById = new Map(aliasMetadata.map((alias) => [alias.entryId, alias]));
const categoryIds = new Set(categories.map((category) => category.id));
const surfaceTypes = new Set<MotionSurfaceType>([
  "component",
  "playground",
  "guide"
]);

function localize(value: Record<Locale, string>, locale: CliLocale) {
  return value[locale];
}

function recipePath(recipe: MotionRecipe, locale: CliLocale, query = "") {
  const base = `/${locale}/${recipe.categoryId}/${recipe.canonicalId}/`;
  return query ? `${base}?${query}` : base;
}

function absolutePreviewUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

function validateLocale(locale: CliLocale | undefined): CliLocale {
  if (locale === undefined) return "en";
  if (locale === "zh" || locale === "en") return locale;
  throw new MotionLexiconError(`Unsupported locale: ${String(locale)}. Use zh or en.`);
}

function validateFilters(options: CatalogOptions) {
  if (options.category && !categoryIds.has(options.category)) {
    throw new MotionLexiconError(`Unknown category: ${options.category}.`);
  }
  if (options.surface && !surfaceTypes.has(options.surface)) {
    throw new MotionLexiconError(
      `Unknown surface: ${options.surface}. Use component, playground, or guide.`
    );
  }
}

function catalogItem(recipe: MotionRecipe, locale: CliLocale): CatalogItem {
  const path = recipePath(recipe, locale);
  return {
    id: recipe.canonicalId,
    categoryId: recipe.categoryId,
    family: recipe.family,
    surfaceType: recipe.surfaceType,
    entryType: recipe.entryType,
    name: localize(recipe.name, locale),
    description: localize(recipe.shortDescription, locale),
    aliases: [...recipe.aliases],
    path,
    previewUrl: absolutePreviewUrl(path)
  };
}

function normalizeId(id: string) {
  return id.trim().toLowerCase();
}

function requireRecipe(id: string) {
  const normalized = normalizeId(id);
  if (!normalized) {
    throw new MotionLexiconError("A recipe id or alias is required.");
  }
  const recipe = getCanonicalRecipe(normalized);
  if (!recipe) {
    throw new MotionLexiconError(`Unknown recipe or alias: ${id}.`, "NOT_FOUND");
  }
  return { normalized, recipe };
}

function numericValue(raw: unknown, param: RangeParam) {
  if (typeof raw !== "number" && typeof raw !== "string") {
    throw new MotionLexiconError(`Parameter ${param.id} requires a number.`);
  }
  const source = String(raw).trim();
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(source)) {
    throw new MotionLexiconError(`Parameter ${param.id} requires a number.`);
  }
  const value = Number(source);
  if (!Number.isFinite(value) || value < param.min || value > param.max) {
    throw new MotionLexiconError(
      `Parameter ${param.id} must be between ${param.min} and ${param.max}.`
    );
  }
  const steps = (value - param.min) / param.step;
  if (Math.abs(steps - Math.round(steps)) > 1e-8) {
    throw new MotionLexiconError(
      `Parameter ${param.id} must follow a step of ${param.step} from ${param.min}.`
    );
  }
  return Number(value.toFixed(8));
}

function booleanValue(raw: unknown, param: MotionParam) {
  if (raw === true || raw === "true" || raw === "1") return true;
  if (raw === false || raw === "false" || raw === "0") return false;
  throw new MotionLexiconError(
    `Parameter ${param.id} requires true, false, 1, or 0.`
  );
}

function parseStrictParam(param: MotionParam, raw: unknown): ParamValue {
  if (param.kind === "range") return numericValue(raw, param);
  if (param.kind === "toggle") return booleanValue(raw, param);
  const value = String(raw);
  if (!param.options.some((option) => option.value === value)) {
    throw new MotionLexiconError(
      `Parameter ${param.id} must be one of: ${param.options.map((item) => item.value).join(", ")}.`
    );
  }
  return value;
}

function validateParams(recipe: MotionRecipe, input: Record<string, unknown>) {
  const values: ParamValues = {};
  for (const [id, raw] of Object.entries(input)) {
    const param = recipe.params.find((candidate) => candidate.id === id);
    if (!param) {
      const available = recipe.params.map((candidate) => candidate.id).join(", ");
      throw new MotionLexiconError(
        `Unknown parameter for ${recipe.canonicalId}: ${id}.${available ? ` Available: ${available}.` : " This recipe has no parameters."}`
      );
    }
    values[id] = parseStrictParam(param, raw);
  }
  return values;
}

function queryValues(
  recipe: MotionRecipe,
  values: ParamValues,
  presetQuery?: string
) {
  const query = valuesToSearchParams(recipe, values);
  if (presetQuery) {
    const presetInput = Object.fromEntries(new URLSearchParams(presetQuery));
    const presetValues = validateParams(recipe, presetInput);
    for (const [id, presetValue] of Object.entries(presetValues)) {
      if (values[id] === presetValue) query.set(id, String(values[id]));
    }
  }
  return query.toString();
}

export function resolveRecipe(
  id: string,
  params: Record<string, unknown> = {}
): ResolvedRecipe {
  const { normalized, recipe } = requireRecipe(id);
  const alias = aliasById.get(normalized);
  const presetInput = alias?.query
    ? Object.fromEntries(new URLSearchParams(alias.query))
    : {};
  const presetValues = validateParams(recipe, presetInput);
  const explicitValues = validateParams(recipe, params);
  return {
    requestedId: normalized,
    canonicalId: recipe.canonicalId,
    ...(alias ? { alias: normalized } : {}),
    ...(alias?.query ? { presetQuery: alias.query } : {}),
    presetValues,
    values: {
      ...getDefaultParamValues(recipe),
      ...presetValues,
      ...explicitValues
    }
  };
}

export function catalog(options: CatalogOptions = {}): CatalogDocument {
  const locale = validateLocale(options.locale);
  validateFilters(options);
  const items = catalogRecipes
    .filter((recipe) => !options.category || recipe.categoryId === options.category)
    .filter((recipe) => !options.surface || recipe.surfaceType === options.surface)
    .map((recipe) => catalogItem(recipe, locale));
  return { schemaVersion, locale, count: items.length, items };
}

function normalizedSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\s_./]+/g, " ")
    .replace(/[-–—]+/g, " ")
    .trim();
}

function searchTokens(query: string) {
  const normalized = normalizedSearchText(query);
  const words = normalized.split(/\s+/).filter(Boolean);
  const cjk = Array.from(normalized.replace(/[^\p{Script=Han}]/gu, ""));
  const grams = cjk.length > 1
    ? Array.from({ length: cjk.length - 1 }, (_, index) => cjk.slice(index, index + 2).join(""))
    : cjk;
  return Array.from(new Set([...words, ...grams])).filter(Boolean);
}

function scoreRecipe(recipe: MotionRecipe, query: string) {
  const normalized = normalizedSearchText(query);
  const id = normalizedSearchText(recipe.id);
  const aliases = recipe.aliases.map(normalizedSearchText);
  const names = [recipe.name.zh, recipe.name.en].map(normalizedSearchText);
  const combined = normalizedSearchText(
    `${createRecipeSearchIndex(recipe, "zh")} ${createRecipeSearchIndex(recipe, "en")} ${recipe.aliases.join(" ")}`
  );
  let score = 0;
  if (id === normalized) score += 1000;
  if (aliases.includes(normalized)) score += 900;
  if (names.includes(normalized)) score += 850;
  if (id.startsWith(normalized)) score += 260;
  if (aliases.some((alias) => alias.startsWith(normalized))) score += 220;
  if (names.some((name) => name.includes(normalized))) score += 200;
  if (combined.includes(normalized)) score += 160;
  for (const token of searchTokens(query)) {
    if (id.includes(token)) score += 42;
    if (aliases.some((alias) => alias.includes(token))) score += 36;
    if (names.some((name) => name.includes(token))) score += 30;
    if (combined.includes(token)) score += token.length > 1 ? 12 : 2;
  }
  return score;
}

export function search(query: string, options: SearchOptions = {}): SearchDocument {
  const cleanQuery = query.trim();
  if (!cleanQuery) throw new MotionLexiconError("A search query is required.");
  const locale = validateLocale(options.locale);
  validateFilters(options);
  const limit = options.limit ?? 10;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new MotionLexiconError("Search limit must be an integer from 1 to 100.");
  }
  const items = catalogRecipes
    .filter((recipe) => !options.category || recipe.categoryId === options.category)
    .filter((recipe) => !options.surface || recipe.surfaceType === options.surface)
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, cleanQuery) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.recipe.id.localeCompare(b.recipe.id))
    .slice(0, limit)
    .map(({ recipe, score }) => ({ ...catalogItem(recipe, locale), score }));
  return { schemaVersion, query: cleanQuery, locale, count: items.length, items };
}

export function show(id: string, options: RecipeOptions = {}): RecipeDocument {
  const locale = validateLocale(options.locale);
  const { recipe } = requireRecipe(id);
  const resolved = resolveRecipe(id, options.params);
  const query = queryValues(recipe, resolved.values, resolved.presetQuery);
  const path = recipePath(recipe, locale, query);
  return {
    schemaVersion,
    requestedId: resolved.requestedId,
    id: recipe.canonicalId,
    canonicalId: recipe.canonicalId,
    ...(resolved.alias ? { alias: resolved.alias } : {}),
    ...(resolved.presetQuery ? { presetQuery: resolved.presetQuery } : {}),
    locale,
    path,
    previewUrl: absolutePreviewUrl(path),
    categoryId: recipe.categoryId,
    family: recipe.family,
    surfaceType: recipe.surfaceType,
    entryType: recipe.entryType,
    aliases: [...recipe.aliases],
    name: localize(recipe.name, locale),
    shortDescription: localize(recipe.shortDescription, locale),
    definition: localize(recipe.definition, locale),
    usage: recipe.usage.map((item) => localize(item, locale)),
    examples: recipe.examples.map((item) => localize(item, locale)),
    context: recipe.context.map((item) => localize(item, locale)),
    params: recipe.params.map((param) => ({
      id: param.id,
      kind: param.kind,
      label: localize(param.label, locale),
      description: localize(param.description, locale),
      defaultValue: param.defaultValue,
      value: resolved.values[param.id],
      ...(param.kind === "range"
        ? { unit: param.unit, min: param.min, max: param.max, step: param.step }
        : {}),
      ...(param.kind === "segmented"
        ? {
            options: param.options.map((option) => ({
              value: option.value,
              cssValue: option.cssValue,
              label: localize(option.label, locale)
            }))
          }
        : {})
    })),
    values: resolved.values,
    query,
    reducedMotion: localize(recipe.reducedMotion, locale),
    reviewNotes: recipe.reviewNotes.map((item) => localize(item, locale)),
    relatedEntries: [...recipe.relatedEntries]
  };
}

export function exportRecipe(
  id: string,
  options: RecipeOptions = {}
): RecipeExportDocument {
  const locale = validateLocale(options.locale);
  const { recipe } = requireRecipe(id);
  const resolved = resolveRecipe(id, options.params);
  const query = queryValues(recipe, resolved.values, resolved.presetQuery);
  const path = recipePath(recipe, locale, query);
  return {
    schemaVersion,
    requestedId: resolved.requestedId,
    id: recipe.canonicalId,
    canonicalId: recipe.canonicalId,
    ...(resolved.alias ? { alias: resolved.alias } : {}),
    ...(resolved.presetQuery ? { presetQuery: resolved.presetQuery } : {}),
    locale,
    path,
    previewUrl: absolutePreviewUrl(path),
    values: resolved.values,
    query,
    prompt: buildRecipePrompt(recipe, resolved.values, locale),
    html: buildRecipeHtml(recipe, resolved.values, locale),
    css: buildRecipeCss(recipe, resolved.values),
    js: buildRecipeJs(recipe, resolved.values),
    bundle: buildCopyBundle(recipe, resolved.values, locale)
  };
}

const definitions: Record<SchemaName, Record<string, unknown>> = {
  recipe: {
    type: "object",
    required: ["schemaVersion", "id", "canonicalId", "locale", "path", "previewUrl", "params", "values"],
    properties: {
      schemaVersion: { const: schemaVersion },
      id: { type: "string" },
      canonicalId: { type: "string" },
      alias: { type: "string" },
      locale: { enum: ["zh", "en"] },
      path: { type: "string", pattern: "^/" },
      previewUrl: { type: "string", format: "uri" },
      params: { type: "array" },
      values: { type: "object" }
    }
  },
  catalog: {
    type: "object",
    required: ["schemaVersion", "locale", "count", "items"],
    properties: {
      schemaVersion: { const: schemaVersion },
      locale: { enum: ["zh", "en"] },
      count: { type: "integer", minimum: 0 },
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "path", "previewUrl"],
          properties: {
            id: { type: "string" },
            path: { type: "string", pattern: "^/" },
            previewUrl: { type: "string", format: "uri" }
          }
        }
      }
    }
  },
  search: {
    type: "object",
    required: ["schemaVersion", "query", "locale", "count", "items"],
    properties: {
      schemaVersion: { const: schemaVersion },
      query: { type: "string" },
      locale: { enum: ["zh", "en"] },
      count: { type: "integer", minimum: 0 },
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "path", "previewUrl", "score"],
          properties: {
            id: { type: "string" },
            path: { type: "string", pattern: "^/" },
            previewUrl: { type: "string", format: "uri" },
            score: { type: "number", minimum: 0 }
          }
        }
      }
    }
  },
  export: {
    type: "object",
    required: ["schemaVersion", "id", "path", "previewUrl", "values", "prompt", "html", "css", "js", "bundle"],
    properties: {
      schemaVersion: { const: schemaVersion },
      id: { type: "string" },
      path: { type: "string", pattern: "^/" },
      previewUrl: { type: "string", format: "uri" },
      values: { type: "object" },
      prompt: { type: "string" },
      html: { type: "string" },
      css: { type: "string" },
      js: { type: "string" },
      bundle: { type: "string" }
    }
  }
};

export function getSchema(name: SchemaName = "recipe") {
  const definition = definitions[name];
  if (!definition) throw new MotionLexiconError(`Unknown schema: ${String(name)}.`);
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `https://motion-lexicon.pages.dev/schema/v1/${name}.json`,
    title: `Motion Lexicon ${name} schema`,
    schemaVersion,
    ...definition
  };
}

export function listCategories() {
  return categories.map((category) => category.id);
}

export function listCanonicalIds() {
  return canonicalMotionCatalog.map((item) => item.id);
}
