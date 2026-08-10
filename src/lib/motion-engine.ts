import { getGlossaryTermsForCanonical } from "../data/glossary";
import { text } from "../data/site";
import type {
  Locale,
  MotionParam,
  MotionRecipe,
  ParamValue,
  ParamValues,
  RangeParam
} from "../data/types";

export function getDefaultParamValues(recipe: MotionRecipe): ParamValues {
  return Object.fromEntries(recipe.params.map((param) => [param.id, param.defaultValue]));
}

export function getParamDisplayValue(param: MotionParam, value: ParamValue) {
  if (param.kind === "range") return `${Number(value)}${param.unit}`;
  if (param.kind === "toggle") return value ? "on" : "off";
  return String(value);
}

export function clampToStep(value: number, param: RangeParam) {
  const clamped = Math.min(param.max, Math.max(param.min, value));
  const stepped = Math.round((clamped - param.min) / param.step) * param.step + param.min;
  return Number(stepped.toFixed(4));
}

export function parseParamValues(
  recipe: MotionRecipe,
  search: URLSearchParams | Record<string, unknown>
): ParamValues {
  const defaults = getDefaultParamValues(recipe);
  for (const param of recipe.params) {
    const raw = search instanceof URLSearchParams ? search.get(param.id) : search[param.id];
    if (raw === null || raw === undefined || raw === "") continue;
    if (param.kind === "range") {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) defaults[param.id] = clampToStep(parsed, param);
    } else if (param.kind === "segmented") {
      const parsed = String(raw);
      if (param.options.some((option) => option.value === parsed)) defaults[param.id] = parsed;
    } else {
      defaults[param.id] = raw === true || raw === "true" || raw === "1";
    }
  }
  return defaults;
}

export function valuesToSearchParams(
  recipe: MotionRecipe,
  values: ParamValues,
  existing = new URLSearchParams()
) {
  const next = new URLSearchParams(existing);
  const defaults = getDefaultParamValues(recipe);
  for (const param of recipe.params) {
    const value = values[param.id] ?? defaults[param.id];
    if (value === defaults[param.id]) next.delete(param.id);
    else next.set(param.id, String(value));
  }
  return next;
}

export function createRecipeSearchIndex(recipe: MotionRecipe, locale: Locale) {
  const glossaryTerms = getGlossaryTermsForCanonical(recipe.canonicalId);
  return [
    text(recipe.name, locale),
    text(recipe.shortDescription, locale),
    text(recipe.definition, locale),
    ...recipe.usage.map((usage) => text(usage, locale)),
    ...recipe.examples.map((example) => text(example, locale)),
    recipe.source.term,
    recipe.source.definition,
    recipe.id,
    recipe.categoryId,
    ...glossaryTerms.flatMap((term) => [
      term.id,
      term.name.zh,
      term.name.en,
      term.definition.zh,
      term.definition.en,
      term.distinction?.zh ?? "",
      term.distinction?.en ?? ""
    ])
  ].join(" ").toLowerCase();
}
