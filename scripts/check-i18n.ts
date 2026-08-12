import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { registryBlocks } from "../src/data/block-registry";
import { categories } from "../src/data/categories";
import { registryComponents } from "../src/data/component-registry";
import { aliasMetadata, canonicalMotionCatalog } from "../src/data/motion-catalog";
import { entries } from "../src/data/recipes";
import { locales, type LocalizedText } from "../src/data/types";
import { resources } from "../src/i18n/resources";
import { demoIds, demoLabels } from "../src/registry/demo-locale";
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
      paths.includes(pathFor(locale, ["primitives", entry.id])),
      `Missing static path for ${locale}/primitives/${entry.id}`
    );
  }
}

for (const component of registryComponents) {
  assertLocalized(component.name, `component.${component.id}.name`);
  assertLocalized(component.description, `component.${component.id}.description`);
  for (const locale of locales) {
    assert(
      paths.includes(pathFor(locale, ["components", component.id])),
      `Missing static path for ${locale}/components/${component.id}`
    );
  }
}

for (const block of registryBlocks) {
  assertLocalized(block.name, `block.${block.id}.name`);
  assertLocalized(block.description, `block.${block.id}.description`);
  assertLocalized(block.signature, `block.${block.id}.signature`);
  for (const locale of locales) {
    assert(
      paths.includes(pathFor(locale, ["components", block.id])),
      `Missing static path for ${locale}/components/${block.id}`
    );
  }
  const source = await readFile(path.resolve(`src/registry/blocks/${block.id}.tsx`), "utf8");
  const demo = await readFile(path.resolve(`src/registry/block-demos/${block.id}-demo.tsx`), "utf8");
  assert(source.includes('type Locale = "zh" | "en"'), `Block ${block.id} needs an explicit locale contract`);
  assert(demo.includes("locale"), `Block demo ${block.id} needs to forward locale`);
}

assert(demoIds.length === 59, `Expected 59 localized demos, found ${demoIds.length}`);
assert(
  JSON.stringify([...demoIds].sort()) === JSON.stringify(registryComponents.map(({ id }) => id).sort()),
  "Localized demo IDs differ from the component registry"
);

for (const id of demoIds) {
  assertLocalized(demoLabels[id], `demo.${id}`);
  assert(demoLabels[id].zh !== demoLabels[id].en, `demo.${id} uses identical zh and en labels`);

  const source = await readFile(path.resolve(`src/registry/demos/${id}-demo.tsx`), "utf8");
  assert(/\blocale\s*=\s*["']en["']/.test(source), `Demo ${id} does not accept a locale prop`);
  assert(source.includes(`demoText("${id}", locale)`), `Demo ${id} lacks its localized accessible name`);
  assert(source.includes("demoValue(locale"), `Demo ${id} lacks localized visible or state text`);
}

for (const alias of aliasMetadata) {
  assert(entries.some((entry) => entry.id === alias.entryId), `Alias ${alias.entryId} has no localized glossary source`);
}

console.log(
  `i18n check passed: ${registryBlocks.length} blocks, ${registryComponents.length} components and ${demoIds.length} bilingual component demos, ${entries.length} localized terms, ` +
    `${canonicalMotionCatalog.length} primitives, ${aliasMetadata.length} aliases, ${categories.length} categories, and ${zhKeys.length} UI keys.`
);
