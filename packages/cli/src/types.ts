import type {
  EntryType,
  MotionFamily,
  MotionSurfaceType,
  ParamKind,
  ParamUnit,
  ParamValue,
  ParamValues
} from "../../../src/data/types.js";

export const schemaVersion = 1 as const;
export const version = "0.1.0";

export type CliLocale = "zh" | "en";
export type DiscoveryFormat = "text" | "json" | "md";
export type ExportFormat =
  | "prompt"
  | "html"
  | "css"
  | "js"
  | "bundle"
  | "json"
  | "files";

export type CatalogOptions = {
  locale?: CliLocale;
  category?: string;
  surface?: MotionSurfaceType;
};

export type SearchOptions = CatalogOptions & {
  limit?: number;
};

export type RecipeOptions = {
  locale?: CliLocale;
  params?: Record<string, unknown>;
};

export type CatalogItem = {
  id: string;
  categoryId: string;
  family: MotionFamily;
  surfaceType: MotionSurfaceType;
  entryType: EntryType;
  name: string;
  description: string;
  aliases: string[];
  path: string;
  previewUrl: string;
};

export type CatalogDocument = {
  schemaVersion: typeof schemaVersion;
  locale: CliLocale;
  count: number;
  items: CatalogItem[];
};

export type SearchItem = CatalogItem & {
  score: number;
};

export type SearchDocument = {
  schemaVersion: typeof schemaVersion;
  query: string;
  locale: CliLocale;
  count: number;
  items: SearchItem[];
};

export type RecipeParamOption = {
  value: string;
  cssValue: string;
  label: string;
};

export type RecipeParam = {
  id: string;
  kind: ParamKind;
  label: string;
  description: string;
  defaultValue: ParamValue;
  value: ParamValue;
  unit?: ParamUnit;
  min?: number;
  max?: number;
  step?: number;
  options?: RecipeParamOption[];
};

export type RecipeDocument = {
  schemaVersion: typeof schemaVersion;
  requestedId: string;
  id: string;
  canonicalId: string;
  alias?: string;
  presetQuery?: string;
  locale: CliLocale;
  path: string;
  previewUrl: string;
  categoryId: string;
  family: MotionFamily;
  surfaceType: MotionSurfaceType;
  entryType: EntryType;
  aliases: string[];
  name: string;
  shortDescription: string;
  definition: string;
  usage: string[];
  examples: string[];
  context: string[];
  params: RecipeParam[];
  values: ParamValues;
  query: string;
  reducedMotion: string;
  reviewNotes: string[];
  relatedEntries: string[];
};

export type RecipeExportDocument = {
  schemaVersion: typeof schemaVersion;
  requestedId: string;
  id: string;
  canonicalId: string;
  alias?: string;
  presetQuery?: string;
  locale: CliLocale;
  path: string;
  previewUrl: string;
  values: ParamValues;
  query: string;
  prompt: string;
  html: string;
  css: string;
  js: string;
  bundle: string;
};

export type ResolvedRecipe = {
  requestedId: string;
  canonicalId: string;
  alias?: string;
  presetQuery?: string;
  presetValues: ParamValues;
  values: ParamValues;
};

export type SchemaName = "recipe" | "catalog" | "search" | "export";

export class MotionLexiconError extends Error {
  readonly code: string;

  constructor(message: string, code = "INVALID_INPUT") {
    super(message);
    this.name = "MotionLexiconError";
    this.code = code;
  }
}
