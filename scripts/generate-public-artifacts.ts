import { readFileSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registryBlocks } from "../src/data/block-registry";
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
import { seoGuides } from "../src/data/seo-guides";
import { motionGrammar, motionSkillModes } from "../src/data/motion-grammar";
import { pathFor, siteUrl } from "../src/data/site";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const installSkill = "npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon";
const skillComponentReferencePath = path.join(root, "skills", "motion-lexicon", "references", "components.md");
const skillPageCssPath = path.join(root, "skills", "motion-lexicon", "assets", "motion-lexicon-page.css");
const v4CssPath = path.join(root, "src", "v4.css");

function absolute(route: string) {
  return `${siteUrl}${route}`;
}

const catalog = {
  schemaVersion: 4,
  release: release.version,
  name: "Motion Lexicon",
  description: "Copy-ready React page blocks and components powered by Motion, GSAP, Three.js, WebGL, SVG, and CSS, plus Motion primitives.",
  siteUrl,
  repositoryUrl,
  registryUrl: `${siteUrl}/r/registry.json`,
  skill: { install: installSkill, source: `${repositoryUrl}/tree/main/skills/motion-lexicon` },
  counts: { blocks: registryBlocks.length, components: registryComponents.length, primitives: catalogRecipes.length },
  blocks: registryBlocks.map((block) => ({
    id: block.id,
    name: block.name,
    description: block.description,
    primitiveIds: block.primitiveIds,
    dependencies: block.dependencies,
    signature: block.signature,
    urls: {
      zh: absolute(pathFor("zh", ["components", block.id])),
      en: absolute(pathFor("en", ["components", block.id])),
      registry: `${siteUrl}/r/${block.id}.json`
    }
  })),
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

const llmsIndex = [
  "# Motion Lexicon",
  "",
  "> Copy-ready React page blocks and components powered by Motion, GSAP, Three.js, WebGL, SVG, and CSS, plus motion primitives and an Agent Skill.",
  "",
  "## Core resources",
  "",
  `- [Machine-readable catalog](${siteUrl}/data/v4/catalog.json): ${registryBlocks.length} page blocks, ${registryComponents.length} components, and ${catalogRecipes.length} motion primitives with bilingual names, descriptions, URLs, and registry metadata.`,
  `- [shadcn registry](${siteUrl}/r/registry.json): Installable React page block, component, and primitive index.`,
  `- [Motion Grammar](${siteUrl}/data/v4/motion-grammar.json): Composition rules, timing tokens, and Skill modes.`,
  `- [Motion Blueprint schema](${siteUrl}/data/v4/motion-blueprint.schema.json): JSON Schema for portable product-motion decisions.`,
  "",
  "## English",
  "",
  `- [Components](${absolute(pathFor("en", ["components"]))}): Complete React page blocks and copy-ready product interactions.`,
  `- [Motion primitives](${absolute(pathFor("en", ["primitives"]))}): Precise behaviors, timing, and implementation guidance.`,
  `- [Animation vocabulary](${absolute(pathFor("en", ["vocabulary"]))}): 91 bilingual motion terms with definitions, distinctions, and canonical workspaces.`,
  `- [Scenario guides](${absolute(pathFor("en", ["guides"]))}): Long-form motion decisions and production examples.`,
  `- [Method](${absolute(pathFor("en", ["method"]))}): How the library is authored, verified, and maintained.`,
  `- [Agent Skill](${absolute(pathFor("en", ["skill"]))}): Build complete React pages, recommend and compose motion, implement interactions, review code, and contribute candidates.`,
  "",
  "## 中文",
  "",
  `- [组件](${absolute(pathFor("zh", ["components"]))}): 完整 React 页面 Block 与可直接安装的产品交互。`,
  `- [原子动效](${absolute(pathFor("zh", ["primitives"]))}): 精确的动效行为、节奏与实现规则。`,
  `- [动画词汇表](${absolute(pathFor("zh", ["vocabulary"]))}): 91 个中英双语动效术语，包含定义、辨析和对应工作区。`,
  `- [场景指南](${absolute(pathFor("zh", ["guides"]))}): 深度动效决策与生产示例。`,
  `- [方法](${absolute(pathFor("zh", ["method"]))}): 内容编写、验证与维护方式。`,
  `- [Agent Skill](${absolute(pathFor("zh", ["skill"]))}): 构建完整 React 页面，并推荐、编排、实现、审查和贡献动效。`,
  "",
  "## Optional",
  "",
  `- [Full bilingual reference](${siteUrl}/llms-full.txt): Every published component, primitive, and scenario guide.`,
  `- [Pricing](${siteUrl}/pricing.txt): Free and open-source availability in English and Chinese.`,
  `- [Source](${repositoryUrl}): MIT code, CC BY 4.0 original editorial content, notices, and contribution history.`,
  `- [Agent Skill source](${repositoryUrl}/tree/main/skills/motion-lexicon): Install with \`${installSkill}\`.`,
  `- [Release ${release.version}](${repositoryUrl}/releases): Public artifact version ${release.version}, updated ${release.updatedDate}.`,
  ""
];

const llmsFull = [
  ...llmsIndex,
  "## English page blocks",
  "",
  ...registryBlocks.map((block) =>
    `- [${block.name.en}](${absolute(pathFor("en", ["components", block.id]))}): ${block.description.en} [Registry](${siteUrl}/r/${block.id}.json)`
  ),
  "",
  "## 中文页面 Blocks",
  "",
  ...registryBlocks.map((block) =>
    `- [${block.name.zh}](${absolute(pathFor("zh", ["components", block.id]))}): ${block.description.zh} [Registry](${siteUrl}/r/${block.id}.json)`
  ),
  "",
  "## English components",
  "",
  ...registryComponents.map((component) =>
    `- [${component.name.en}](${absolute(pathFor("en", ["components", component.id]))}): ${component.description.en} [Registry](${siteUrl}/r/${component.id}.json)`
  ),
  "",
  "## 中文组件",
  "",
  ...registryComponents.map((component) =>
    `- [${component.name.zh}](${absolute(pathFor("zh", ["components", component.id]))}): ${component.description.zh} [Registry](${siteUrl}/r/${component.id}.json)`
  ),
  "",
  "## English motion primitives",
  "",
  ...catalogRecipes.map((primitive) =>
    `- [${primitive.name.en}](${absolute(pathFor("en", ["primitives", primitive.id]))}): ${primitive.shortDescription.en}${getPrimitiveRegistryEntry(primitive.id)?.installable ? ` [Registry](${siteUrl}/r/primitive-${primitive.id}.json)` : ""}`
  ),
  "",
  "## 中文原子动效",
  "",
  ...catalogRecipes.map((primitive) =>
    `- [${primitive.name.zh}](${absolute(pathFor("zh", ["primitives", primitive.id]))}): ${primitive.shortDescription.zh}${getPrimitiveRegistryEntry(primitive.id)?.installable ? ` [Registry](${siteUrl}/r/primitive-${primitive.id}.json)` : ""}`
  ),
  "",
  "## English scenario guides",
  "",
  ...seoGuides.map((guide) =>
    `- [${guide.title.en}](${absolute(pathFor("en", ["guides", guide.id]))}): ${guide.description.en}`
  ),
  "",
  "## 中文场景指南",
  "",
  ...seoGuides.map((guide) =>
    `- [${guide.title.zh}](${absolute(pathFor("zh", ["guides", guide.id]))}): ${guide.description.zh}`
  ),
  ""
].join("\n");

const pricing = [
  "# Pricing / 定价",
  "",
  "## English",
  "",
  "Motion Lexicon is free and open source. The website, registry, machine-readable catalog, and Agent Skill require no paid plan, account, API key, or usage fee.",
  "",
  "## 中文",
  "",
  "Motion Lexicon 免费开源。网站、Registry、机器可读目录和 Agent Skill 均无需付费方案、账户、API Key 或使用费。",
  ""
].join("\n");

const markdownCell = (value: string) => value.replaceAll("|", "\\|").replaceAll("\n", " ");

export function renderSkillComponentReference() {
  const rows = registryComponents.map((component) => {
    const engines = registryComponentEngines(component).join(", ");
    const dependencies = registryComponentDependencies(component).join(", ");
    return [
      `\`${component.id}\``,
      `${markdownCell(component.name.zh)} / ${markdownCell(component.name.en)}`,
      `${markdownCell(component.description.zh)} / ${markdownCell(component.description.en)}`,
      component.primitiveIds.map((id) => `\`${id}\``).join(", "),
      `${engines}; ${registryComponentRuntimeCost(component)}; deps: ${dependencies || "none"}`
    ].join(" | ");
  });

  return [
    "# Published component catalog",
    "",
    `Generated from \`src/data/component-registry.ts\` for Motion Lexicon ${release.skillVersion}.`,
    `Use only the ${registryComponents.length} published IDs below. Treat any other ID as a candidate, not a published component.`,
    "",
    "| ID | 名称 / Name | 产品用途 / Product use | Foundations | Runtime |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
    "",
    "## Selection rules",
    "",
    "1. Match the user-visible product event to the product-use column.",
    "2. Prefer one component whose published behavior already covers the full event.",
    "3. Use Foundations to explain or tune the component's motion language.",
    "4. State the exact published ID and installation URL: `https://motion-lexicon.pages.dev/r/<id>.json`.",
    "5. If no row fits, recommend primitives or mark a new contribution as `candidate`.",
    ""
  ].join("\n");
}

function extractTokenBlock(source: string, selector: string) {
  const start = source.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`Missing ${selector} token block in src/v4.css`);
  const end = source.indexOf("\n}", start);
  if (end < 0) throw new Error(`Unclosed ${selector} token block in src/v4.css`);
  return source.slice(start, end + 2);
}

export function renderSkillPageCss(source = readFileSync(v4CssPath, "utf8")) {
  const lightTokens = extractTokenBlock(source, ":root");
  const darkTokens = extractTokenBlock(source, ":root.dark");
  const transferableRules = String.raw`*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  max-width: 100%;
  min-height: 100%;
  margin: 0;
  overflow-x: clip;
}

body {
  color: var(--ink);
  background: var(--bezel);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  font-size: 14px;
  letter-spacing: -0.15px;
}

button,
input,
select,
textarea {
  font: inherit;
}

button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[role="button"]:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.ml-page {
  width: min(calc(100% - 48px), 1180px);
  margin-inline: auto;
  padding-block: 24px 48px;
  line-height: 1.5;
}

.ml-panel {
  border: 1px solid var(--hairline);
  border-radius: 16px;
  background: var(--panel);
  box-shadow: var(--shadow-lift);
}

.ml-well {
  border-radius: 12px;
  background: var(--well);
  box-shadow: var(--shadow-well);
}

.ml-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.ml-control {
  min-width: 44px;
  min-height: 44px;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  color: var(--ink);
  background: var(--panel);
  transition: transform 120ms var(--ease-out), background-color 150ms ease, border-color 150ms ease;
}

.ml-control:active {
  transform: translateY(1px);
}

.ml-meta {
  color: var(--ink-3);
  font-family: "SF Mono", ui-monospace, Menlo, Monaco, Consolas, monospace;
  font-size: 10.5px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
}

@media (max-width: 767px) {
  .ml-page {
    width: min(calc(100% - 32px), 1180px);
    padding-block: 16px 32px;
  }

  .ml-card-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }

  .ml-control:active {
    transform: none;
  }
}`;
  return `${lightTokens}\n\n${darkTokens}\n\n${transferableRules}\n`;
}

export async function generatePublicArtifacts(outputDir = publicDir) {
  await rm(path.join(outputDir, "data", "v1"), { recursive: true, force: true });
  await rm(path.join(outputDir, "data", "v2"), { recursive: true, force: true });
  await rm(path.join(outputDir, "data", "v3"), { recursive: true, force: true });
  await mkdir(path.join(outputDir, "data", "v4"), { recursive: true });
  await writeFile(path.join(outputDir, "data", "v4", "catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  await writeFile(path.join(outputDir, "data", "v4", "motion-grammar.json"), `${JSON.stringify({
    ...motionGrammar,
    modes: motionSkillModes,
    urls: {
      zh: absolute(pathFor("zh", ["skill"])),
      en: absolute(pathFor("en", ["skill"]))
    }
  }, null, 2)}\n`);
  const blueprintSchema = await readFile(path.join(root, "skills", "motion-lexicon", "assets", "motion-blueprint.schema.json"));
  await writeFile(path.join(outputDir, "data", "v4", "motion-blueprint.schema.json"), blueprintSchema);
  await writeFile(path.join(outputDir, "llms.txt"), llmsIndex.join("\n"));
  await writeFile(path.join(outputDir, "llms-full.txt"), llmsFull);
  await writeFile(path.join(outputDir, "pricing.txt"), pricing);
  if (path.resolve(outputDir) === publicDir) {
    await writeFile(skillComponentReferencePath, renderSkillComponentReference());
    await writeFile(skillPageCssPath, renderSkillPageCss());
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generatePublicArtifacts();
  console.log(`Generated V4 public artifacts: ${registryBlocks.length} blocks, ${registryComponents.length} components, and ${catalogRecipes.length} primitives.`);
}
