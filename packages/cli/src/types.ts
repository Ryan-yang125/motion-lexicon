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
export const version = "1.2.0";

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

export type MotionPackOptions = {
  locale?: CliLocale;
  group?: string;
};

export type SearchOptions = CatalogOptions & {
  limit?: number;
};

export type RecommendOptions = {
  locale?: CliLocale;
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
  productMoments: ProductMomentReference[];
  path: string;
  previewUrl: string;
};

export type CatalogDocument = {
  schemaVersion: typeof schemaVersion;
  locale: CliLocale;
  count: number;
  items: CatalogItem[];
};

export type MotionPackItem = {
  id: string;
  groupId: string;
  groupName: string;
  name: string;
  description: string;
  scene: string;
  timing: string;
  foundations: MotionFoundationReference[];
  path: string;
  previewUrl: string;
};

/** A product moment that uses an atomic motion primitive. */
export type ProductMomentReference = {
  id: string;
  groupId: string;
  groupName: string;
  name: string;
  description: string;
  scene: string;
  role: string;
  roleLabel: string;
  note: string;
  path: string;
  previewUrl: string;
};

/** An atomic motion primitive that composes a product moment. */
export type MotionFoundationReference = {
  id: string;
  categoryId: string;
  name: string;
  role: string;
  roleLabel: string;
  note: string;
  path: string;
  previewUrl: string;
};

export type MotionPacksDocument = {
  schemaVersion: typeof schemaVersion;
  locale: CliLocale;
  count: number;
  groups: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  items: MotionPackItem[];
};

export type MotionPackDocument = MotionPackItem & {
  schemaVersion: typeof schemaVersion;
  locale: CliLocale;
  useCase: string;
  prompt: string;
  guidance: {
    trigger: string;
    outcome: string;
    reducedMotion: string;
  };
  keywords: string[];
  source: {
    html: string;
    css: string;
    js: string;
    bundle: string;
  };
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

export type RecommendItem = {
  rank: number;
  variantId: string;
  canonicalId: string;
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
  path: string;
  previewUrl: string;
};

export type RecommendDocument = {
  schemaVersion: typeof schemaVersion;
  query: string;
  locale: CliLocale;
  confidence: "high" | "medium" | "low";
  confidenceScore: number;
  matchedTerms: string[];
  groupId: string;
  groupName: string;
  reason: string;
  finderPath: string;
  finderUrl: string;
  comparePath: string;
  compareUrl: string;
  count: number;
  items: RecommendItem[];
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
  productMoments: ProductMomentReference[];
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

export type SchemaName =
  | "recipe"
  | "catalog"
  | "search"
  | "recommend"
  | "export"
  | "packs"
  | "pack";

export class MotionLexiconError extends Error {
  readonly code: string;

  constructor(message: string, code = "INVALID_INPUT") {
    super(message);
    this.name = "MotionLexiconError";
    this.code = code;
  }
}
