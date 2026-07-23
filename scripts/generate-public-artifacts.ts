import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categories } from "../src/data/categories";
import { glossaryTerms } from "../src/data/glossary";
import { getMotionGuidance } from "../src/data/motion-guidance";
import { getMotionSpec } from "../src/data/motion-specs";
import { canonicalMotionCatalog, catalogRecipes } from "../src/data/recipes";
import { pathFor, siteUrl } from "../src/data/site";
import type { Locale, MotionParam } from "../src/data/types";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");
const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const schemaVersion = 1;
const cliCommand = "npx github:Ryan-yang125/motion-lexicon";
const skillCommand = "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon";

type Artifact = {
  relativePath: string;
  content: string;
};

function absoluteUrl(routePath: string) {
  return `${siteUrl}${routePath}`;
}

function localizedRecipeUrls(categoryId: string, recipeId: string) {
  return Object.fromEntries(
    (["zh", "en"] as const).map((locale) => [
      locale,
      absoluteUrl(pathFor(locale, [categoryId, recipeId]))
    ])
  ) as Record<Locale, string>;
}

function localizedVocabularyUrls(termId: string) {
  return Object.fromEntries(
    (["zh", "en"] as const).map((locale) => [
      locale,
      `${absoluteUrl(pathFor(locale, ["vocabulary"]))}#term-${termId}`
    ])
  ) as Record<Locale, string>;
}

function localizedRecipeFocusUrls(categoryId: string, canonicalId: string, termId: string) {
  const focus = canonicalId === termId ? "" : `?term=${encodeURIComponent(termId)}`;
  return Object.fromEntries(
    (["zh", "en"] as const).map((locale) => [
      locale,
      `${absoluteUrl(pathFor(locale, [categoryId, canonicalId]))}${focus}`
    ])
  ) as Record<Locale, string>;
}

function recipeArtifact(recipeId: string) {
  const recipe = catalogRecipes.find((entry) => entry.id === recipeId);
  if (!recipe) throw new Error(`Missing canonical recipe: ${recipeId}`);

  const guidance = getMotionGuidance(recipe.id);
  if (!guidance) throw new Error(`Missing guidance for canonical recipe: ${recipe.id}`);

  const spec = getMotionSpec(recipe.id);
  return {
    kind: "recipe",
    schemaVersion,
    schemaUrl: `${siteUrl}/data/v1/schema.json`,
    id: recipe.id,
    canonicalId: recipe.canonicalId,
    categoryId: recipe.categoryId,
    family: recipe.family,
    surfaceType: recipe.surfaceType,
    scene: spec.scene,
    name: recipe.name,
    summary: recipe.shortDescription,
    definition: recipe.definition,
    aliases: recipe.aliases,
    urls: localizedRecipeUrls(recipe.categoryId, recipe.id),
    dataUrl: `${siteUrl}/data/v1/recipes/${recipe.id}.json`,
    parameters: recipe.params,
    guidance: {
      purpose: guidance.purpose,
      frequency: guidance.frequency,
      trigger: guidance.trigger,
      enterExit: guidance.enterExit,
      interruptibility: guidance.interruptibility,
      gestureRules: guidance.gestureRules
    },
    reducedMotion: guidance.reducedMotionStrategy,
    reviewNotes: guidance.reviewNotes,
    relatedRecipes: recipe.relatedEntries
  };
}

function catalogArtifact() {
  return {
    kind: "catalog",
    schemaVersion,
    schemaUrl: `${siteUrl}/data/v1/schema.json`,
    project: {
      name: "Motion Lexicon",
      description: {
        zh: "可视、可调、可复制的界面动效词典。",
        en: "A visual, tunable, and copy-ready lexicon for interface motion."
      },
      siteUrl,
      repositoryUrl,
      locales: ["zh", "en"],
      cliCommand,
      skillCommand
    },
    endpoints: {
      catalog: `${siteUrl}/data/v1/catalog.json`,
      vocabulary: `${siteUrl}/data/v1/vocabulary.json`,
      recipeTemplate: `${siteUrl}/data/v1/recipes/{id}.json`,
      schema: `${siteUrl}/data/v1/schema.json`,
      pricing: `${siteUrl}/pricing.txt`,
      llms: `${siteUrl}/llms.txt`,
      llmsFull: `${siteUrl}/llms-full.txt`
    },
    counts: {
      categories: categories.length,
      recipes: catalogRecipes.length,
      vocabularyTerms: glossaryTerms.length,
      aliases: glossaryTerms.filter((term) => term.alias).length
    },
    categories: categories.map((category) => ({
      id: category.id,
      order: category.order,
      name: category.name,
      description: category.description,
      recipeCount: canonicalMotionCatalog.filter((entry) => entry.categoryId === category.id).length,
      urls: Object.fromEntries(
        (["zh", "en"] as const).map((locale) => [
          locale,
          absoluteUrl(pathFor(locale, [category.id]))
        ])
      )
    })),
    recipes: catalogRecipes.map((recipe) => ({
      id: recipe.id,
      categoryId: recipe.categoryId,
      family: recipe.family,
      surfaceType: recipe.surfaceType,
      name: recipe.name,
      summary: recipe.shortDescription,
      aliases: recipe.aliases,
      urls: localizedRecipeUrls(recipe.categoryId, recipe.id),
      dataUrl: `${siteUrl}/data/v1/recipes/${recipe.id}.json`
    }))
  };
}

function vocabularyArtifact() {
  return {
    kind: "vocabulary",
    schemaVersion,
    schemaUrl: `${siteUrl}/data/v1/schema.json`,
    count: glossaryTerms.length,
    canonicalCount: glossaryTerms.filter((term) => term.canonical).length,
    aliasCount: glossaryTerms.filter((term) => term.alias).length,
    urls: Object.fromEntries(
      (["zh", "en"] as const).map((locale) => [
        locale,
        absoluteUrl(pathFor(locale, ["vocabulary"]))
      ])
    ),
    terms: glossaryTerms.map((term) => {
      const canonical = canonicalMotionCatalog.find((entry) => entry.id === term.canonicalId);
      if (!canonical) throw new Error(`Missing canonical metadata for vocabulary term: ${term.id}`);
      return {
        id: term.id,
        canonicalId: term.canonicalId,
        categoryId: term.categoryId,
        canonical: term.canonical,
        alias: term.alias,
        name: term.name,
        definition: term.definition,
        ...(term.distinction ? { distinction: term.distinction } : {}),
        vocabularyUrls: localizedVocabularyUrls(term.id),
        recipeUrls: localizedRecipeFocusUrls(canonical.categoryId, term.canonicalId, term.id)
      };
    })
  };
}

const localizedTextSchema = {
  type: "object",
  additionalProperties: false,
  required: ["zh", "en"],
  properties: {
    zh: { type: "string", minLength: 1 },
    en: { type: "string", minLength: 1 }
  }
};

const localizedUrlsSchema = {
  type: "object",
  additionalProperties: false,
  required: ["zh", "en"],
  properties: {
    zh: { type: "string", format: "uri" },
    en: { type: "string", format: "uri" }
  }
};

function schemaArtifact() {
  const baseDocumentProperties = {
    kind: { type: "string" },
    schemaVersion: { const: schemaVersion },
    schemaUrl: { type: "string", format: "uri" }
  };
  const baseDocumentRequired = ["kind", "schemaVersion", "schemaUrl"];

  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: `${siteUrl}/data/v1/schema.json`,
    title: "Motion Lexicon public data",
    description: "Schema for the versioned catalog, vocabulary, and individual recipe artifacts.",
    oneOf: [
      { $ref: "#/$defs/catalogDocument" },
      { $ref: "#/$defs/vocabularyDocument" },
      { $ref: "#/$defs/recipeDocument" }
    ],
    $defs: {
      localizedText: localizedTextSchema,
      localizedUrls: localizedUrlsSchema,
      rangeParameter: {
        type: "object",
        additionalProperties: false,
        required: ["id", "kind", "label", "description", "defaultValue", "min", "max", "step", "unit"],
        properties: {
          id: { type: "string" },
          kind: { const: "range" },
          label: { $ref: "#/$defs/localizedText" },
          description: { $ref: "#/$defs/localizedText" },
          defaultValue: { type: "number" },
          min: { type: "number" },
          max: { type: "number" },
          step: { type: "number", exclusiveMinimum: 0 },
          unit: { type: "string" }
        }
      },
      segmentedParameter: {
        type: "object",
        additionalProperties: false,
        required: ["id", "kind", "label", "description", "defaultValue", "options"],
        properties: {
          id: { type: "string" },
          kind: { const: "segmented" },
          label: { $ref: "#/$defs/localizedText" },
          description: { $ref: "#/$defs/localizedText" },
          defaultValue: { type: "string" },
          options: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "value", "cssValue"],
              properties: {
                label: { $ref: "#/$defs/localizedText" },
                value: { type: "string" },
                cssValue: { type: "string" }
              }
            }
          }
        }
      },
      toggleParameter: {
        type: "object",
        additionalProperties: false,
        required: ["id", "kind", "label", "description", "defaultValue"],
        properties: {
          id: { type: "string" },
          kind: { const: "toggle" },
          label: { $ref: "#/$defs/localizedText" },
          description: { $ref: "#/$defs/localizedText" },
          defaultValue: { type: "boolean" }
        }
      },
      parameter: {
        oneOf: [
          { $ref: "#/$defs/rangeParameter" },
          { $ref: "#/$defs/segmentedParameter" },
          { $ref: "#/$defs/toggleParameter" }
        ]
      },
      catalogItem: {
        type: "object",
        additionalProperties: false,
        required: ["id", "categoryId", "family", "surfaceType", "name", "summary", "aliases", "urls", "dataUrl"],
        properties: {
          id: { type: "string" },
          categoryId: { type: "string" },
          family: { type: "string" },
          surfaceType: { enum: ["component", "playground", "guide"] },
          name: { $ref: "#/$defs/localizedText" },
          summary: { $ref: "#/$defs/localizedText" },
          aliases: { type: "array", items: { type: "string" }, uniqueItems: true },
          urls: { $ref: "#/$defs/localizedUrls" },
          dataUrl: { type: "string", format: "uri" }
        }
      },
      catalogDocument: {
        type: "object",
        additionalProperties: true,
        required: [...baseDocumentRequired, "project", "endpoints", "counts", "categories", "recipes"],
        properties: {
          ...baseDocumentProperties,
          kind: { const: "catalog" },
          categories: { type: "array", minItems: 1 },
          recipes: { type: "array", items: { $ref: "#/$defs/catalogItem" } }
        }
      },
      vocabularyTerm: {
        type: "object",
        additionalProperties: false,
        required: ["id", "canonicalId", "categoryId", "canonical", "alias", "name", "definition", "vocabularyUrls", "recipeUrls"],
        properties: {
          id: { type: "string" },
          canonicalId: { type: "string" },
          categoryId: { type: "string" },
          canonical: { type: "boolean" },
          alias: { type: "boolean" },
          name: { $ref: "#/$defs/localizedText" },
          definition: { $ref: "#/$defs/localizedText" },
          distinction: { $ref: "#/$defs/localizedText" },
          vocabularyUrls: { $ref: "#/$defs/localizedUrls" },
          recipeUrls: { $ref: "#/$defs/localizedUrls" }
        }
      },
      vocabularyDocument: {
        type: "object",
        additionalProperties: true,
        required: [...baseDocumentRequired, "count", "canonicalCount", "aliasCount", "urls", "terms"],
        properties: {
          ...baseDocumentProperties,
          kind: { const: "vocabulary" },
          terms: { type: "array", items: { $ref: "#/$defs/vocabularyTerm" } }
        }
      },
      guidance: {
        type: "object",
        additionalProperties: false,
        required: ["purpose", "frequency", "trigger", "enterExit", "interruptibility", "gestureRules"],
        properties: Object.fromEntries(
          ["purpose", "frequency", "trigger", "enterExit", "interruptibility", "gestureRules"].map((key) => [
            key,
            { $ref: "#/$defs/localizedText" }
          ])
        )
      },
      recipeDocument: {
        type: "object",
        additionalProperties: false,
        required: [
          ...baseDocumentRequired,
          "id",
          "canonicalId",
          "categoryId",
          "family",
          "surfaceType",
          "scene",
          "name",
          "summary",
          "definition",
          "aliases",
          "urls",
          "dataUrl",
          "parameters",
          "guidance",
          "reducedMotion",
          "reviewNotes",
          "relatedRecipes"
        ],
        properties: {
          ...baseDocumentProperties,
          kind: { const: "recipe" },
          id: { type: "string" },
          canonicalId: { type: "string" },
          categoryId: { type: "string" },
          family: { type: "string" },
          surfaceType: { enum: ["component", "playground", "guide"] },
          scene: { type: "string" },
          name: { $ref: "#/$defs/localizedText" },
          summary: { $ref: "#/$defs/localizedText" },
          definition: { $ref: "#/$defs/localizedText" },
          aliases: { type: "array", items: { type: "string" }, uniqueItems: true },
          urls: { $ref: "#/$defs/localizedUrls" },
          dataUrl: { type: "string", format: "uri" },
          parameters: { type: "array", items: { $ref: "#/$defs/parameter" } },
          guidance: { $ref: "#/$defs/guidance" },
          reducedMotion: { $ref: "#/$defs/localizedText" },
          reviewNotes: { type: "array", items: { $ref: "#/$defs/localizedText" } },
          relatedRecipes: { type: "array", items: { type: "string" }, uniqueItems: true }
        }
      }
    }
  };
}

function formatParameter(param: MotionParam, locale: Locale) {
  if (param.kind === "range") {
    return `${param.label[locale]} (${param.id}): default ${param.defaultValue}${param.unit}; range ${param.min}-${param.max}${param.unit}; step ${param.step}${param.unit}`;
  }
  if (param.kind === "toggle") {
    return `${param.label[locale]} (${param.id}): default ${param.defaultValue}`;
  }
  return `${param.label[locale]} (${param.id}): default ${param.defaultValue}; options ${param.options.map((option) => option.value).join(", ")}`;
}

function llmsArtifact() {
  const lines = [
    "# Motion Lexicon",
    "",
    "> A free, open-source, bilingual reference for choosing, tuning, reviewing, and implementing interface motion.",
    "",
    `- Website: ${siteUrl}/en/`,
    `- Chinese website: ${siteUrl}/zh/`,
    `- Source: ${repositoryUrl}`,
    `- Pricing: ${siteUrl}/pricing.txt (free; no account required)`,
    `- Catalog JSON: ${siteUrl}/data/v1/catalog.json`,
    `- Vocabulary JSON: ${siteUrl}/data/v1/vocabulary.json`,
    `- JSON Schema: ${siteUrl}/data/v1/schema.json`,
    `- Full machine-readable text: ${siteUrl}/llms-full.txt`,
    "",
    "## Free tools",
    "",
    `- CLI: \`${cliCommand}\``,
    `- Agent Skill: \`${skillCommand}\``,
    "",
    "## Canonical recipes",
    ""
  ];

  for (const category of categories) {
    lines.push(`### ${category.name.en}`);
    lines.push("");
    for (const recipe of catalogRecipes.filter((entry) => entry.categoryId === category.id)) {
      lines.push(
        `- [${recipe.name.en}](${absoluteUrl(pathFor("en", [recipe.categoryId, recipe.id]))}): ${recipe.shortDescription.en} [JSON](${siteUrl}/data/v1/recipes/${recipe.id}.json)`
      );
    }
    lines.push("");
  }

  return `${lines.join("\n").trim()}\n`;
}

function pricingArtifact() {
  return `# Pricing — Motion Lexicon

## Free

- Price: $0
- Billing: None
- Account required: No
- Website: ${siteUrl}
- CLI: ${cliCommand}
- Agent Skill: ${skillCommand}
- Source: ${repositoryUrl}
- Code license: MIT
- Vocabulary and editorial content license: CC BY 4.0
- Generated code snippets license: 0BSD
- Usage: The public static website is available without an account. The CLI and Agent Skill run locally.
- Last updated: 2026-07-23
`;
}

function llmsFullArtifact() {
  const lines = [llmsArtifact().trim(), "", "# Full recipe reference", ""];

  for (const recipe of catalogRecipes) {
    const guidance = getMotionGuidance(recipe.id);
    if (!guidance) throw new Error(`Missing guidance for ${recipe.id}`);
    lines.push(`## ${recipe.name.en} (${recipe.id})`);
    lines.push("");
    lines.push(`- Chinese name: ${recipe.name.zh}`);
    lines.push(`- Category: ${recipe.categoryId}`);
    lines.push(`- Surface: ${recipe.surfaceType}`);
    lines.push(`- Definition: ${recipe.definition.en}`);
    lines.push(`- Purpose: ${guidance.purpose.en}`);
    lines.push(`- Trigger: ${guidance.trigger.en}`);
    lines.push(`- Reduced motion: ${guidance.reducedMotionStrategy.en}`);
    lines.push(`- Preview: ${absoluteUrl(pathFor("en", [recipe.categoryId, recipe.id]))}`);
    lines.push(`- Data: ${siteUrl}/data/v1/recipes/${recipe.id}.json`);
    if (recipe.aliases.length > 0) lines.push(`- Aliases: ${recipe.aliases.join(", ")}`);
    if (recipe.params.length > 0) {
      lines.push("- Parameters:");
      for (const param of recipe.params) lines.push(`  - ${formatParameter(param, "en")}`);
    }
    lines.push("");
  }

  lines.push("# Complete vocabulary");
  lines.push("");
  for (const term of glossaryTerms) {
    const alias = term.alias ? ` Alias of ${term.canonicalId}.` : "";
    const distinction = term.distinction ? ` ${term.distinction.en}` : "";
    lines.push(`- ${term.name.en} (${term.id}): ${term.definition.en}${alias}${distinction}`);
  }

  return `${lines.join("\n").trim()}\n`;
}

function jsonArtifact(relativePath: string, value: unknown): Artifact {
  return { relativePath, content: `${JSON.stringify(value, null, 2)}\n` };
}

export function buildPublicArtifacts(): Artifact[] {
  return [
    { relativePath: "pricing.txt", content: pricingArtifact() },
    { relativePath: "llms.txt", content: llmsArtifact() },
    { relativePath: "llms-full.txt", content: llmsFullArtifact() },
    jsonArtifact("data/v1/schema.json", schemaArtifact()),
    jsonArtifact("data/v1/catalog.json", catalogArtifact()),
    jsonArtifact("data/v1/vocabulary.json", vocabularyArtifact()),
    ...catalogRecipes.map((recipe) =>
      jsonArtifact(`data/v1/recipes/${recipe.id}.json`, recipeArtifact(recipe.id))
    )
  ];
}

export async function generatePublicArtifacts(outputDir = publicDir) {
  const artifacts = buildPublicArtifacts();
  for (const artifact of artifacts) {
    const outputPath = path.join(outputDir, artifact.relativePath);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, artifact.content, "utf8");
  }
  return artifacts.map((artifact) => artifact.relativePath);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  const written = await generatePublicArtifacts();
  console.log(`Generated ${written.length} public artifacts in ${publicDir}`);
}
