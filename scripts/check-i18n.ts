import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { categories } from "../src/data/categories";
import { aliasMetadata, canonicalMotionCatalog } from "../src/data/motion-catalog";
import { entries } from "../src/data/recipes";
import { locales, type LocalizedText } from "../src/data/types";
import { resources } from "../src/i18n/resources";
import { getStaticPaths, pathFor } from "../src/data/site";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") {
    return [prefix];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key)
  );
}

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertLocalized(value: LocalizedText, path: string) {
  for (const locale of locales) {
    assert(typeof value[locale] === "string", `${path}.${locale} is missing`);
    assert(value[locale].trim().length > 0, `${path}.${locale} is empty`);
  }
}

const zhKeys = flattenKeys(resources.zh.translation).sort();
const enKeys = flattenKeys(resources.en.translation).sort();
assert(JSON.stringify(zhKeys) === JSON.stringify(enKeys), "i18n resource keys differ between zh and en");

async function sourceFiles(directory: string): Promise<string[]> {
  const items = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(items.map((item) => {
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) return sourceFiles(itemPath);
    return /\.(?:ts|tsx)$/.test(item.name) ? [itemPath] : [];
  }));
  return nested.flat();
}

const knownUiKeys = new Set(zhKeys);
for (const filePath of await sourceFiles(path.resolve("src"))) {
  if (filePath.endsWith(path.join("i18n", "resources.ts"))) continue;
  const source = await readFile(filePath, "utf8");
  for (const match of source.matchAll(/\bt\(\s*["']([^"']+)["']/g)) {
    assert(knownUiKeys.has(match[1]), `Unknown static i18n key ${match[1]} in ${path.relative(process.cwd(), filePath)}`);
  }
}

for (const category of categories) {
  assertLocalized(category.name, `category.${category.id}.name`);
  assertLocalized(category.eyebrow, `category.${category.id}.eyebrow`);
  assertLocalized(category.description, `category.${category.id}.description`);
}

for (const entry of entries) {
  assertLocalized(entry.name, `entry.${entry.id}.name`);
  assertLocalized(entry.shortDescription, `entry.${entry.id}.shortDescription`);
  assertLocalized(entry.definition, `entry.${entry.id}.definition`);
  assertLocalized(entry.reducedMotion, `entry.${entry.id}.reducedMotion`);
  assertLocalized(entry.seo.title, `entry.${entry.id}.seo.title`);
  assertLocalized(entry.seo.description, `entry.${entry.id}.seo.description`);

  for (const [index, usage] of entry.usage.entries()) {
    assertLocalized(usage, `entry.${entry.id}.usage.${index}`);
  }
  for (const [index, example] of entry.examples.entries()) {
    assertLocalized(example, `entry.${entry.id}.examples.${index}`);
  }
  for (const [index, note] of entry.reviewNotes.entries()) {
    assertLocalized(note, `entry.${entry.id}.reviewNotes.${index}`);
  }
  for (const param of entry.params) {
    assertLocalized(param.label, `entry.${entry.id}.params.${param.id}.label`);
    assertLocalized(param.description, `entry.${entry.id}.params.${param.id}.description`);
    if (param.kind === "segmented") {
      for (const option of param.options) {
        assertLocalized(option.label, `entry.${entry.id}.params.${param.id}.${option.value}`);
      }
    }
  }
}

const paths = getStaticPaths();
for (const entry of canonicalMotionCatalog) {
  for (const locale of locales) {
    assert(
      paths.includes(pathFor(locale, [entry.categoryId, entry.id])),
      `Missing static path for ${locale}/${entry.categoryId}/${entry.id}`
    );
  }
}

for (const alias of aliasMetadata) {
  assert(entries.some((entry) => entry.id === alias.entryId), `Alias ${alias.entryId} has no localized glossary source`);
}

console.log(
  `i18n check passed: ${entries.length} localized terms, ${canonicalMotionCatalog.length} canonical routes, ` +
    `${aliasMetadata.length} localized aliases, ${categories.length} categories, ${zhKeys.length} UI keys.`
);
