import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  registryComponentDependencies,
  registryComponentDevDependencies,
  registryComponentEngines,
  registryComponentRuntimeCost,
  registryComponentSignature,
  registryComponents
} from "../src/data/component-registry";
import { catalogRecipes } from "../src/data/recipes";
import { getPrimitiveRegistryEntry } from "../src/data/primitive-registry";
import { release } from "../src/data/release";
import { motionDirectorModes, motionGrammar } from "../src/data/motion-grammar";
import { pathFor, siteUrl } from "../src/data/site";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const installSkill = "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon";

function absolute(route: string) {
  return `${siteUrl}${route}`;
}

const catalog = {
  schemaVersion: 4,
  release: release.version,
  name: "Motion Lexicon",
  description: "Copy-ready React components powered by Motion, GSAP, Three.js, WebGL, SVG, and CSS, plus Motion primitives.",
  siteUrl,
  repositoryUrl,
  registryUrl: `${siteUrl}/r/registry.json`,
  skill: { install: installSkill, source: `${repositoryUrl}/tree/main/skills/motion-lexicon` },
  counts: { components: registryComponents.length, primitives: catalogRecipes.length },
  components: registryComponents.map((component) => ({
    id: component.id,
    category: component.category,
    name: component.name,
    description: component.description,
    primitiveIds: component.primitiveIds,
    dependencies: registryComponentDependencies(component),
    ...(registryComponentDevDependencies(component).length > 0 ? {
      devDependencies: registryComponentDevDependencies(component)
    } : {}),
    engines: registryComponentEngines(component),
    runtimeCost: registryComponentRuntimeCost(component),
    signature: registryComponentSignature(component),
    urls: {
      zh: absolute(pathFor("zh", ["components", component.id])),
      en: absolute(pathFor("en", ["components", component.id])),
      registry: `${siteUrl}/r/${component.id}.json`
    }
  })),
  primitives: catalogRecipes.map((primitive) => ({
    id: primitive.id,
    categoryId: primitive.categoryId,
    name: primitive.name,
    description: primitive.shortDescription,
    urls: {
      zh: absolute(pathFor("zh", ["primitives", primitive.id])),
      en: absolute(pathFor("en", ["primitives", primitive.id])),
      ...(getPrimitiveRegistryEntry(primitive.id)?.installable ? {
        registry: `${siteUrl}/r/primitive-${primitive.id}.json`
      } : {})
    }
  }))
};

const llmsHeader = [
  "# Motion Lexicon",
  "",
  "> Copy-ready React components powered by Motion, GSAP, Three.js, WebGL, SVG, and CSS, plus motion primitives and an Agent Skill.",
  "",
  `- Components: ${absolute(pathFor("en", ["components"]))}`,
  `- Motion primitives: ${absolute(pathFor("en", ["primitives"]))}`,
  `- Scenario guides: ${absolute(pathFor("en", ["guides"]))}`,
  `- Agent Skill: ${absolute(pathFor("en", ["skill"]))}`,
  `- shadcn registry: ${siteUrl}/r/registry.json`,
  `- Machine-readable catalog: ${siteUrl}/data/v4/catalog.json`,
  `- Motion Grammar: ${siteUrl}/data/v4/motion-grammar.json`,
  `- Motion Blueprint schema: ${siteUrl}/data/v4/motion-blueprint.schema.json`,
  `- Source: ${repositoryUrl}`,
  `- Skill install: \`${installSkill}\``,
  "- License: MIT for code; CC BY 4.0 for original editorial content.",
  ""
];

const llmsFull = [
  ...llmsHeader,
  "## Components",
  "",
  ...registryComponents.map((component) =>
    `- [${component.name.en}](${absolute(pathFor("en", ["components", component.id]))}): ${component.description.en} [Registry](${siteUrl}/r/${component.id}.json)`
  ),
  "",
  "## Motion primitives",
  "",
  ...catalogRecipes.map((primitive) =>
    `- [${primitive.name.en}](${absolute(pathFor("en", ["primitives", primitive.id]))}): ${primitive.shortDescription.en}${getPrimitiveRegistryEntry(primitive.id)?.installable ? ` [Registry](${siteUrl}/r/primitive-${primitive.id}.json)` : ""}`
  ),
  ""
].join("\n");

export async function generatePublicArtifacts(outputDir = publicDir) {
  await rm(path.join(outputDir, "data", "v1"), { recursive: true, force: true });
  await rm(path.join(outputDir, "data", "v2"), { recursive: true, force: true });
  await rm(path.join(outputDir, "data", "v3"), { recursive: true, force: true });
  await mkdir(path.join(outputDir, "data", "v4"), { recursive: true });
  await writeFile(path.join(outputDir, "data", "v4", "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  await writeFile(path.join(outputDir, "data", "v4", "motion-grammar.json"), `${JSON.stringify({
    ...motionGrammar,
    modes: motionDirectorModes,
    urls: {
      zh: absolute(pathFor("zh", ["skill"])),
      en: absolute(pathFor("en", ["skill"]))
    }
  }, null, 2)}\n`);
  const blueprintSchema = await readFile(path.join(root, "skills", "motion-lexicon", "assets", "motion-blueprint.schema.json"));
  await writeFile(path.join(outputDir, "data", "v4", "motion-blueprint.schema.json"), blueprintSchema);
  await writeFile(path.join(outputDir, "llms.txt"), llmsHeader.join("\n"));
  await writeFile(path.join(outputDir, "llms-full.txt"), llmsFull);
  await writeFile(path.join(outputDir, "pricing.txt"), "Motion Lexicon is free and open source. No paid plan, account, API key, or usage limit is required.\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generatePublicArtifacts();
  console.log(`Generated V4 public artifacts: ${registryComponents.length} components and ${catalogRecipes.length} primitives.`);
}
