import { glossaryTerms } from "../src/data/glossary";
import { motionGuidanceByCanonicalId } from "../src/data/motion-guidance";
import { canonicalMotionCatalog, catalogRecipes, entries } from "../src/data/recipes";
import { createRecipeSearchIndex } from "../src/lib/motion-engine";
import { locales } from "../src/data/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(glossaryTerms.length === 91, `Expected 91 vocabulary terms, found ${glossaryTerms.length}`);
assert(glossaryTerms.filter((term) => term.canonical).length === 44, "Expected 44 canonical vocabulary terms");
assert(glossaryTerms.filter((term) => term.alias).length === 47, "Expected 47 vocabulary aliases");
assert(new Set(glossaryTerms.map((term) => term.id)).size === 91, "Vocabulary IDs must be unique");
assert(new Set(glossaryTerms.map((term) => term.definition.en)).size === 91, "English definitions must be unique");

for (const term of glossaryTerms) {
  assert(/[.!?]$/.test(term.definition.en), `${term.id} English definition is missing terminal punctuation`);
  assert(term.definition.en.length >= 45, `${term.id} English definition needs implementation-level detail`);
  assert(/[。！？]$/.test(term.definition.zh), `${term.id} Chinese definition is missing terminal punctuation`);
  if (term.alias) {
    assert(term.distinction?.zh, `${term.id} is missing a Chinese distinction`);
    assert(term.distinction?.en, `${term.id} is missing an English distinction`);
  }
}

for (const entry of entries) {
  assert(entry.source.skill === "motion-lexicon", `${entry.id} has an external vocabulary dependency`);
  assert(entry.source.definition === entry.definition.en, `${entry.id} source definition is out of sync`);
}

assert(
  Object.keys(motionGuidanceByCanonicalId).length === canonicalMotionCatalog.length,
  "Every canonical workspace needs one guidance contract"
);

for (const metadata of canonicalMotionCatalog) {
  const guidance = motionGuidanceByCanonicalId[metadata.id];
  assert(guidance, `${metadata.id} is missing motion guidance`);
  assert(guidance.reviewNotes.length >= 2, `${metadata.id} needs at least two specific review notes`);
}

for (const alias of glossaryTerms.filter((term) => term.alias)) {
  const recipe = catalogRecipes.find((entry) => entry.id === alias.canonicalId);
  assert(recipe, `${alias.id} points to a missing canonical workspace`);
  for (const locale of locales) {
    const index = createRecipeSearchIndex(recipe, locale);
    for (const query of [alias.id, alias.name.en, alias.name.zh]) {
      assert(index.includes(query.toLocaleLowerCase()), `${alias.id} is not searchable by ${query} in ${locale}`);
    }
  }
}

console.log(
  `Vocabulary check passed: ${glossaryTerms.length} independently maintained terms, ` +
  `${glossaryTerms.filter((term) => term.alias).length} searchable distinctions, ` +
  `${Object.keys(motionGuidanceByCanonicalId).length} specific guidance contracts.`
);
