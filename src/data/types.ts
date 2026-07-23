export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export type LocalizedText = Record<Locale, string>;

export type ParamKind = "range" | "segmented" | "toggle";

export type ParamUnit = "ms" | "px" | "%" | "deg" | "x" | "";

export type BaseParam = {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
};

export type RangeParam = BaseParam & {
  kind: "range";
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: ParamUnit;
};

export type SegmentedParam = BaseParam & {
  kind: "segmented";
  defaultValue: string;
  options: Array<{
    label: LocalizedText;
    value: string;
    cssValue: string;
  }>;
};

export type ToggleParam = BaseParam & {
  kind: "toggle";
  defaultValue: boolean;
};

export type MotionParam = RangeParam | SegmentedParam | ToggleParam;

export type ParamValue = number | string | boolean;

export type ParamValues = Record<string, ParamValue>;

export type Category = {
  id: string;
  order: number;
  name: LocalizedText;
  eyebrow: LocalizedText;
  description: LocalizedText;
  plannedCount: number;
};

export type EntryType = "recipe" | "concept";

export type PreviewKind =
  | "entranceExit"
  | "sequencing"
  | "transform"
  | "state"
  | "scroll"
  | "feedback"
  | "easing"
  | "spring"
  | "loop"
  | "effect"
  | "performance"
  | "principle";

export type MotionSurfaceType = "component" | "playground" | "guide";

export type MotionFamily =
  | "entrance"
  | "timeline"
  | "transform"
  | "state"
  | "scroll"
  | "feedback"
  | "easing"
  | "spring"
  | "loop"
  | "effect"
  | "performance"
  | "principle";

export type EntrySource = {
  skill: string;
  glossarySection: string;
  term: string;
  definition: string;
};

export type MotionEntry = {
  id: string;
  slug: string;
  categoryId: string;
  entryType: EntryType;
  previewKind: PreviewKind;
  source: EntrySource;
  name: LocalizedText;
  shortDescription: LocalizedText;
  definition: LocalizedText;
  usage: LocalizedText[];
  examples: LocalizedText[];
  context: LocalizedText[];
  params: MotionParam[];
  reviewNotes: LocalizedText[];
  reducedMotion: LocalizedText;
  relatedEntries: string[];
  seo: {
    title: LocalizedText;
    description: LocalizedText;
  };
};

/**
 * A runtime recipe is an inventory entry enriched by the canonical motion
 * catalog. Raw glossary entries stay intact while every public surface gets a
 * stable family, output contract, and canonical destination.
 */
export type MotionRecipe = Omit<MotionEntry, "params"> & {
  params: MotionParam[];
  canonicalId: string;
  family: MotionFamily;
  surfaceType: MotionSurfaceType;
  aliases: string[];
};
