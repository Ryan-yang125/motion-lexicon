import { existsSync, readFileSync } from "node:fs";
import { registryComponents } from "../src/data/component-registry";
import { catalogRecipes } from "../src/data/recipes";
import { release } from "../src/data/release";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const file of ["public/llms.txt", "public/llms-full.txt", "public/pricing.txt", "public/data/v3/catalog.json", "public/data/v3/motion-grammar.json", "public/data/v3/motion-blueprint.schema.json", "public/r/registry.json"]) {
  assert(existsSync(file), `Missing public artifact: ${file}`);
}

const catalog = JSON.parse(readFileSync("public/data/v3/catalog.json", "utf8")) as {
  release?: string;
  counts?: { components?: number; primitives?: number };
  components?: Array<{ id?: string }>;
  primitives?: Array<{ id?: string }>;
};
assert(catalog.release === release.version, "Public catalog release is stale");
assert(catalog.counts?.components === registryComponents.length, "Public component count is stale");
assert(catalog.counts?.primitives === catalogRecipes.length, "Public primitive count is stale");
assert(catalog.components?.length === registryComponents.length, "Public component list is incomplete");
assert(catalog.primitives?.length === catalogRecipes.length, "Public primitive list is incomplete");

const llms = readFileSync("public/llms.txt", "utf8");
for (const value of ["/en/components/", "/en/primitives/", "/en/skill/", "/r/registry.json", "/data/v3/catalog.json"]) {
  assert(llms.includes(value), `llms.txt is missing ${value}`);
}
for (const obsolete of ["/packs/", "/catalog/", "/finder/", "/director/"]) {
  assert(!llms.includes(obsolete), `llms.txt contains obsolete route ${obsolete}`);
}

console.log(`Public artifact check passed: V3 catalog, llms files, pricing, and registry expose ${registryComponents.length} components and ${catalogRecipes.length} primitives.`);
