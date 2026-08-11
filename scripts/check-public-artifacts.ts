import { existsSync, readFileSync } from "node:fs";
import { registryComponents } from "../src/data/component-registry";
import { catalogRecipes } from "../src/data/recipes";
import { installablePrimitiveEntries } from "../src/data/primitive-registry";
import { release } from "../src/data/release";
import { renderSkillComponentReference, renderSkillPageCss } from "./generate-public-artifacts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const file of ["public/llms.txt", "public/llms-full.txt", "public/pricing.txt", "public/data/v4/catalog.json", "public/data/v4/motion-grammar.json", "public/data/v4/motion-blueprint.schema.json", "public/r/registry.json"]) {
  assert(existsSync(file), `Missing public artifact: ${file}`);
}

const catalog = JSON.parse(readFileSync("public/data/v4/catalog.json", "utf8")) as {
  schemaVersion?: number;
  release?: string;
  counts?: { components?: number; primitives?: number };
  components?: Array<{ id?: string }>;
  primitives?: Array<{ id?: string; urls?: { registry?: string } }>;
};
assert(catalog.schemaVersion === 4, "Public catalog schema version is stale");
assert(catalog.release === release.version, "Public catalog release is stale");
assert(catalog.counts?.components === registryComponents.length, "Public component count is stale");
assert(catalog.counts?.primitives === catalogRecipes.length, "Public primitive count is stale");
assert(catalog.components?.length === registryComponents.length, "Public component list is incomplete");
assert(catalog.primitives?.length === catalogRecipes.length, "Public primitive list is incomplete");
assert(catalog.primitives?.filter((item) => item.urls?.registry).length === installablePrimitiveEntries.length, "Public primitive registry links are incomplete");
assert(
  JSON.stringify(catalog.components?.map((item) => item.id)) === JSON.stringify(registryComponents.map((item) => item.id)),
  "Public component IDs are out of sync with the registry source"
);

const skillComponentReference = readFileSync("skills/motion-lexicon/references/components.md", "utf8");
assert(skillComponentReference === renderSkillComponentReference(), "Generated Skill component reference is stale");
const skillPageCss = readFileSync("skills/motion-lexicon/assets/motion-lexicon-page.css", "utf8");
assert(skillPageCss === renderSkillPageCss(), "Generated Skill page CSS is stale");

const llms = readFileSync("public/llms.txt", "utf8");
for (const value of ["## Core resources", "## English", "## 中文", "## Optional", "/en/components/", "/zh/components/", "/en/primitives/", "/zh/primitives/", "/en/vocabulary/", "/zh/vocabulary/", "/en/guides/", "/zh/guides/", "/en/method/", "/zh/method/", "/en/skill/", "/zh/skill/", "/r/registry.json", "/data/v4/catalog.json", "/llms-full.txt", "/pricing.txt"]) {
  assert(llms.includes(value), `llms.txt is missing ${value}`);
}
assert(/- \[[^\]]+\]\(https:\/\/[^)]+\):/.test(llms), "llms.txt resources must use Markdown links with descriptions");
for (const obsolete of ["/packs/", "/catalog/", "/finder/", "/director/"]) {
  assert(!llms.includes(obsolete), `llms.txt contains obsolete route ${obsolete}`);
}

const llmsFull = readFileSync("public/llms-full.txt", "utf8");
for (const component of registryComponents) {
  assert(llmsFull.includes(`/en/components/${component.id}/`), `llms-full.txt is missing the English ${component.id} component`);
  assert(llmsFull.includes(`/zh/components/${component.id}/`), `llms-full.txt is missing the Chinese ${component.id} component`);
}
assert((llmsFull.match(/\/en\/guides\//g) ?? []).length >= 8, "llms-full.txt is missing English scenario guides");
assert((llmsFull.match(/\/zh\/guides\//g) ?? []).length >= 8, "llms-full.txt is missing Chinese scenario guides");
for (const obsolete of ["pack-or-primitive", "Product Moment", "Choose a Pack", "Pack 与"]) {
  assert(!llmsFull.includes(obsolete), `llms-full.txt contains obsolete public concept ${obsolete}`);
}
assert(llmsFull.includes("/en/guides/component-or-primitive/"), "llms-full.txt is missing the English component selection guide");
assert(llmsFull.includes("/zh/guides/component-or-primitive/"), "llms-full.txt is missing the Chinese component selection guide");

const pricing = readFileSync("public/pricing.txt", "utf8");
for (const value of ["# Pricing / 定价", "## English", "## 中文", "free and open source", "免费开源"]) {
  assert(pricing.includes(value), `pricing.txt is missing ${value}`);
}

console.log(`Public artifact check passed: V4.2 catalog, bilingual llms files, pricing, registry, generated Skill references, and page tokens expose ${registryComponents.length} components and ${installablePrimitiveEntries.length} installable primitives.`);
