/* global console, process */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const skillDirectory = path.join(repositoryRoot, "skills", "motion-lexicon");
const errors = [];

const readText = (filePath) => fs.readFileSync(filePath, "utf8");
const hasFile = (relativePath) => fs.existsSync(path.join(repositoryRoot, relativePath));
const fail = (message) => errors.push(message);

const validateUniqueIds = (items, pathLabel) => {
  if (!Array.isArray(items)) return new Set();
  const ids = new Set();
  for (const [index, item] of items.entries()) {
    const id = item?.id;
    if (typeof id !== "string") continue;
    if (ids.has(id)) fail(`${pathLabel}[${index}].id must be unique; "${id}" is already declared.`);
    ids.add(id);
  }
  return ids;
};

const requiredFiles = [
  "skills/motion-lexicon/SKILL.md",
  "skills/motion-lexicon/agents/openai.yaml",
  "skills/motion-lexicon/assets/motion-blueprint.schema.json",
  "skills/motion-lexicon/assets/example-motion-blueprint.json",
  "skills/motion-lexicon/assets/candidate-template.md",
  "skills/motion-lexicon/THIRD_PARTY_NOTICES.md",
  "skills/motion-lexicon/scripts/validate-motion-blueprint.mjs",
  "skills/motion-lexicon/evals/evals.json",
  "skills/motion-lexicon/evals/trigger-evals.json",
  "skills/motion-lexicon/evals/forward-test-contract.json",
  "skills/motion-lexicon/references/motion-language.md",
  "skills/motion-lexicon/references/interior-principles.md",
  "skills/motion-lexicon/references/contract.md",
  "skills/motion-lexicon/references/components.md",
  "skills/motion-lexicon/references/composition.md",
  "skills/motion-lexicon/references/implementation-css.md",
  "skills/motion-lexicon/references/review-rubric.md",
  "skills/motion-lexicon/references/contribution.md",
  "skills/motion-lexicon/references/primitives/entrances.md",
  "skills/motion-lexicon/references/primitives/feedback.md",
  "skills/motion-lexicon/references/primitives/transitions.md",
  "skills/motion-lexicon/references/primitives/sequencing.md",
  "skills/motion-lexicon/references/moments/feedback.md",
  "skills/motion-lexicon/references/moments/choice.md",
  "skills/motion-lexicon/references/moments/change.md",
  "skills/motion-lexicon/references/moments/workflow.md"
];

for (const filePath of requiredFiles) {
  if (!hasFile(filePath)) {
    fail(`Required Motion Lexicon file is absent: ${filePath}`);
  }
}

const requireObjectFields = (value, fields, pathLabel) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${pathLabel} must be an object.`);
    return;
  }

  for (const field of fields) {
    if (!(field in value)) {
      fail(`${pathLabel}.${field} is required.`);
    }
  }
};

const validateBlueprint = (blueprint, pathLabel) => {
  requireObjectFields(
    blueprint,
    ["version", "locale", "intent", "scope", "stateGraph", "actors", "beats", "accessibility", "delivery", "provenance"],
    pathLabel
  );

  if (!blueprint || typeof blueprint !== "object" || Array.isArray(blueprint)) {
    return;
  }

  if (blueprint.version !== "2.0") {
    fail(`${pathLabel}.version must equal "2.0".`);
  }

  if (!["zh", "en"].includes(blueprint.locale)) {
    fail(`${pathLabel}.locale must be "zh" or "en".`);
  }

  requireObjectFields(blueprint.intent, ["productGoal", "userIntent", "feeling"], `${pathLabel}.intent`);
  requireObjectFields(blueprint.scope, ["surface", "framework", "input"], `${pathLabel}.scope`);
  requireObjectFields(blueprint.stateGraph, ["initial", "states", "transitions"], `${pathLabel}.stateGraph`);
  requireObjectFields(blueprint.accessibility, ["reducedMotion", "focus", "aria", "keyboard"], `${pathLabel}.accessibility`);
  requireObjectFields(blueprint.delivery, ["formats", "integration"], `${pathLabel}.delivery`);
  requireObjectFields(blueprint.provenance, ["status", "foundations", "moments", "confidence"], `${pathLabel}.provenance`);

  if (!Array.isArray(blueprint.actors) || blueprint.actors.length < 1 || blueprint.actors.length > 3) {
    fail(`${pathLabel}.actors needs one to three actors.`);
  } else {
    const primaryActors = blueprint.actors.filter((actor) => actor?.role === "primary");
    if (primaryActors.length !== 1) {
      fail(`${pathLabel}.actors needs exactly one primary actor.`);
    }
    for (const [index, actor] of blueprint.actors.entries()) {
      requireObjectFields(actor, ["id", "role", "kind", "element"], `${pathLabel}.actors[${index}]`);
      if (!["primary", "supporting"].includes(actor?.role)) {
        fail(`${pathLabel}.actors[${index}].role needs primary or supporting.`);
      }
      if (!["trigger", "hero", "status", "record", "environment"].includes(actor?.kind)) {
        fail(`${pathLabel}.actors[${index}].kind needs a documented semantic kind.`);
      }
    }
  }

  const actorIds = validateUniqueIds(blueprint.actors, `${pathLabel}.actors`);

  if (!Array.isArray(blueprint.beats) || blueprint.beats.length < 1 || blueprint.beats.length > 5) {
    fail(`${pathLabel}.beats needs one to five focused beats.`);
  } else {
    for (const [index, beat] of blueprint.beats.entries()) {
      requireObjectFields(
        beat,
        ["id", "at", "actor", "purpose", "primitive", "from", "to", "durationMs", "easing", "properties"],
        `${pathLabel}.beats[${index}]`
      );
      if (typeof beat?.durationMs !== "number" || beat.durationMs < 0 || beat.durationMs > 2000) {
        fail(`${pathLabel}.beats[${index}].durationMs must stay within 0–2000.`);
      }
      if (!Array.isArray(beat?.properties) || beat.properties.length < 1) {
        fail(`${pathLabel}.beats[${index}].properties needs at least one property.`);
      }
      if (!["arrive", "leave", "feedback", "linear", "spring"].includes(beat?.easing)) {
        fail(`${pathLabel}.beats[${index}].easing needs a documented timing token.`);
      }
      if (!actorIds.has(beat?.actor)) {
        fail(`${pathLabel}.beats[${index}].actor must reference a declared actor.`);
      }
    }
  }
  validateUniqueIds(blueprint.beats, `${pathLabel}.beats`);

  if (blueprint.stateGraph && Array.isArray(blueprint.stateGraph.states)) {
    const stateIds = validateUniqueIds(blueprint.stateGraph.states, `${pathLabel}.stateGraph.states`);
    if (!stateIds.has(blueprint.stateGraph.initial)) {
      fail(`${pathLabel}.stateGraph.initial must reference a declared state.`);
    }
    for (const [index, transition] of (blueprint.stateGraph.transitions ?? []).entries()) {
      if (!stateIds.has(transition?.from) || !stateIds.has(transition?.to)) {
        fail(`${pathLabel}.stateGraph.transitions[${index}] must connect declared states.`);
      }
    }
  }

  if (!Array.isArray(blueprint.delivery?.formats) || blueprint.delivery.formats.length < 1) {
    fail(`${pathLabel}.delivery.formats needs at least one output format.`);
  }

  if (!["draft", "candidate", "published"].includes(blueprint.provenance?.status)) {
    fail(`${pathLabel}.provenance.status needs a valid publication stage.`);
  }
};

const validateSkillDocument = () => {
  const skillText = readText(path.join(skillDirectory, "SKILL.md"));
  const validatorText = readText(path.join(skillDirectory, "scripts", "validate-motion-blueprint.mjs"));
  const thirdPartyNotices = readText(path.join(skillDirectory, "THIRD_PARTY_NOTICES.md"));
  const packageManifest = JSON.parse(readText(path.join(repositoryRoot, "package.json")));
  const requiredHeadings = ["## Recommend", "## Compose", "## Implement", "## Review", "## Contribute"];
  for (const heading of requiredHeadings) {
    if (!skillText.includes(heading)) {
      fail(`SKILL.md needs the ${heading} mode.`);
    }
  }

  const legacyReferences = [/npx\s+-y/i, /packages\/cli/i, /references\/cli/i, /cli:build/i];
  for (const pattern of legacyReferences) {
    if (pattern.test(skillText)) {
      fail(`SKILL.md includes a retired public-command dependency: ${pattern}.`);
    }
  }

  if (/^\s*import\s+.+?\s+from\s+["'](?:ajv|ajv\/)/m.test(validatorText)) {
    fail("Motion Blueprint validator must bundle its schema runtime for standalone Skill installs.");
  }

  if (packageManifest.dependencies?.ajv || !packageManifest.devDependencies?.ajv) {
    fail("Ajv must remain a development dependency because the installed Skill carries its own validator runtime.");
  }

  for (const signal of ["Ajv", "fast-deep-equal", "fast-uri", "json-schema-traverse", "MIT License", "BSD 3-Clause License"]) {
    if (!thirdPartyNotices.includes(signal)) {
      fail(`Motion Blueprint third-party notices need the ${signal} attribution.`);
    }
  }

  const interiorText = readText(path.join(skillDirectory, "references", "interior-principles.md"));
  const interiorSignals = ["Bezel", "Panel", "Well", "event", "Reserve", "cubic-bezier(.23, 1, .32, 1)", "reduced motion"];
  for (const signal of interiorSignals) {
    if (!interiorText.toLowerCase().includes(signal.toLowerCase())) {
      fail(`Interior reference needs the ${signal} principle.`);
    }
  }

  const candidateTemplate = readText(path.join(skillDirectory, "assets", "candidate-template.md"));
  for (const signal of ["status: candidate", "Motion Blueprint", "Product scenes", "Quality evidence"]) {
    if (!candidateTemplate.includes(signal)) {
      fail(`Candidate template needs the ${signal} section.`);
    }
  }

  const componentReference = readText(path.join(skillDirectory, "references", "components.md"));
  const publicCatalog = JSON.parse(readText(path.join(repositoryRoot, "public", "data", "v4", "catalog.json")));
  if (!componentReference.includes(`Use only the ${publicCatalog.components?.length ?? 0} published IDs below.`)) {
    fail("Generated component reference has a stale published-component count.");
  }
  for (const component of publicCatalog.components ?? []) {
    if (typeof component.id !== "string" || typeof component.name?.zh !== "string" || typeof component.name?.en !== "string" ||
        !componentReference.includes(`\`${component.id}\``) ||
        !componentReference.includes(component.name.zh) ||
        !componentReference.includes(component.name.en)) {
      fail(`Generated component reference is missing ${component.id}.`);
    }
  }

  const publishedPrimitiveIds = new Set((publicCatalog.primitives ?? []).map((primitive) => primitive.id));
  const componentRows = componentReference
    .split("\n")
    .filter((line) => /^\| `[^`]+` \|/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
  const publishedComponents = new Map((publicCatalog.components ?? []).map((component) => [component.id, component]));
  if (componentRows.length !== publishedComponents.size) {
    fail(`Generated component reference needs exactly ${publishedComponents.size} component rows.`);
  }
  for (const row of componentRows) {
    const id = row[0]?.match(/^`([^`]+)`$/)?.[1];
    const component = publishedComponents.get(id);
    if (!component) {
      fail(`Generated component reference includes unknown component ${id ?? row[0]}.`);
      continue;
    }
    if (row[1] !== `${component.name.zh} / ${component.name.en}` ||
        row[2] !== `${component.description.zh} / ${component.description.en}`) {
      fail(`Generated component reference ${id} has stale Chinese or English copy.`);
    }

    const foundations = [...(row[3] ?? "").matchAll(/`([^`]+)`/g)].map((match) => match[1]);
    for (const foundation of foundations) {
      if (!publishedPrimitiveIds.has(foundation)) {
        fail(`Generated component reference ${id} uses unpublished primitive ${foundation}.`);
      }
    }

    const runtime = (row[4] ?? "").split(";").map((part) => part.trim());
    const engines = (runtime[0] ?? "").split(",").map((engine) => engine.trim()).filter(Boolean);
    const runtimeCost = runtime[1];
    const dependencyText = (runtime[2] ?? "").replace(/^deps:\s*/, "");
    const dependencies = dependencyText === "none"
      ? []
      : dependencyText.split(",").map((dependency) => dependency.trim()).filter(Boolean);
    if (JSON.stringify(engines) !== JSON.stringify(component.engines ?? []) ||
        runtimeCost !== component.runtimeCost ||
        JSON.stringify(dependencies) !== JSON.stringify(component.dependencies ?? [])) {
      fail(`Generated component reference ${id} has stale engine, cost, or dependency metadata.`);
    }
  }

  const exampleBlueprint = JSON.parse(readText(path.join(skillDirectory, "assets", "example-motion-blueprint.json")));
  const examplePrimitiveIds = [
    ...(exampleBlueprint.beats ?? []).map((beat) => beat.primitive),
    ...(exampleBlueprint.provenance?.foundations ?? [])
  ];
  for (const primitiveId of examplePrimitiveIds) {
    if (!publishedPrimitiveIds.has(primitiveId)) {
      fail(`Example Motion Blueprint uses unpublished primitive ${primitiveId}.`);
    }
  }

  for (const momentName of ["feedback", "choice", "change", "workflow"]) {
    const momentPath = path.join(skillDirectory, "references", "moments", `${momentName}.md`);
    const momentRows = readText(momentPath)
      .split("\n")
      .filter((line) => /^\| [^|-].+ \|/.test(line) && !line.startsWith("| Moment |"))
      .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
    for (const row of momentRows) {
      const primitiveIds = [...(row[3] ?? "").matchAll(/`([^`]+)`/g)].map((match) => match[1]);
      if (primitiveIds.length === 0) {
        fail(`Product Moment ${momentName}/${row[0]} needs exact published primitive IDs.`);
      }
      for (const primitiveId of primitiveIds) {
        if (!publishedPrimitiveIds.has(primitiveId)) {
          fail(`Product Moment ${momentName}/${row[0]} uses unpublished primitive ${primitiveId}.`);
        }
      }
    }
  }

  const leavingCurve = "cubic-bezier(.23, 1, .32, 1)";
  const leavingSources = [
    ["SKILL.md", skillText],
    ["references/motion-language.md", readText(path.join(skillDirectory, "references", "motion-language.md"))],
    ["references/interior-principles.md", interiorText],
    ["references/implementation-css.md", readText(path.join(skillDirectory, "references", "implementation-css.md"))]
  ];
  for (const [label, source] of leavingSources) {
    if (!source.includes(leavingCurve)) {
      fail(`${label} needs the documented strong ease-out leaving curve ${leavingCurve}.`);
    }
    if (/cubic-bezier\(\.4,\s*0,\s*1,\s*1\)/.test(source)) {
      fail(`${label} still contains the retired ease-in leaving curve.`);
    }
  }

  const motionLanguage = leavingSources[1][1];
  if (!motionLanguage.includes("`morph` primitive with shared mode") || motionLanguage.includes("`shared-element-transition`")) {
    fail("Motion language needs the published morph primitive for shared-element continuity.");
  }
};

const validateSchema = () => {
  let schema;
  try {
    schema = JSON.parse(readText(path.join(skillDirectory, "assets", "motion-blueprint.schema.json")));
  } catch (error) {
    fail(`Motion Blueprint schema contains invalid JSON: ${error.message}`);
    return;
  }

  const requiredFields = ["version", "locale", "intent", "scope", "stateGraph", "actors", "beats", "accessibility", "delivery", "provenance"];
  if (schema.$id !== "https://motion-lexicon.pages.dev/data/v4/motion-blueprint.schema.json") {
    fail("Motion Blueprint schema needs the public V4 schema URL.");
  }
  for (const field of requiredFields) {
    if (!schema.required?.includes(field)) {
      fail(`Motion Blueprint schema needs ${field} in required.`);
    }
  }
  const actorSchema = schema.properties?.actors;
  if (!actorSchema?.items?.required?.includes("kind")) {
    fail("Motion Blueprint schema requires an actor kind.");
  }
  if (actorSchema?.minContains !== 1 || actorSchema?.maxContains !== 1) {
    fail("Motion Blueprint schema needs one primary actor constraint.");
  }
  const beatSchema = schema.properties?.beats?.items;
  if (!beatSchema?.required?.includes("durationMs")) {
    fail("Motion Blueprint schema needs durationMs for every beat.");
  }
};

const validateEvals = () => {
  let suite;
  try {
    suite = JSON.parse(readText(path.join(skillDirectory, "evals", "evals.json")));
  } catch (error) {
    fail(`Motion Lexicon eval suite contains invalid JSON: ${error.message}`);
    return;
  }

  if (suite.skill_name !== "motion-lexicon" || suite.version !== "2.0") {
    fail("Eval suite needs the Motion Lexicon v2.0 identity.");
  }

  if (!Array.isArray(suite.evals) || suite.evals.length < 30) {
    fail("Eval suite needs at least 30 cases.");
    return;
  }

  const ids = new Set();
  let chineseCount = 0;
  let englishCount = 0;
  const modes = new Set();
  const categorySignals = {
    atomic: false,
    composition: false,
    async: false,
    undo: false,
    highFrequency: false,
    reducedMotion: false,
    review: false,
    contribution: false,
    negative: false
  };

  for (const evaluation of suite.evals) {
    if (ids.has(evaluation.id)) {
      fail(`Eval ID repeats: ${evaluation.id}.`);
    }
    ids.add(evaluation.id);

    if (!evaluation.id || !evaluation.mode || !evaluation.locale || !evaluation.prompt || !evaluation.expected_output) {
      fail("Every eval needs id, mode, locale, prompt, and expected_output.");
    }
    if (typeof evaluation.shouldUseSkill !== "boolean") {
      fail(`Eval ${evaluation.id} needs a boolean shouldUseSkill field.`);
    }
    if (!Array.isArray(evaluation.assertions) || evaluation.assertions.length < 3) {
      fail(`Eval ${evaluation.id} needs at least three assertions.`);
    }
    if (evaluation.locale === "zh") chineseCount += 1;
    if (evaluation.locale === "en") englishCount += 1;
    modes.add(evaluation.mode);

    const content = `${evaluation.id} ${evaluation.prompt}`.toLowerCase();
    if (/(card-arrival|toast-arrival|exact-shared-element|exact-morph)/.test(content)) categorySignals.atomic = true;
    if (evaluation.mode === "compose") categorySignals.composition = true;
    if (/async|upload-failure|save-failure|out-of-order|race/.test(content)) categorySignals.async = true;
    if (/undo/.test(content)) categorySignals.undo = true;
    if (/high-frequency|rapid|keystroke/.test(content)) categorySignals.highFrequency = true;
    if (/reduced-motion|减少动态|reduce/.test(content)) categorySignals.reducedMotion = true;
    if (evaluation.mode === "review") categorySignals.review = true;
    if (evaluation.mode === "contribute") categorySignals.contribution = true;
    if (evaluation.mode === "negative-trigger" && evaluation.shouldUseSkill === false) categorySignals.negative = true;
  }

  if (chineseCount < 12 || englishCount < 12) {
    fail("Eval suite needs at least 12 Chinese and 12 English cases.");
  }

  for (const mode of ["recommend", "compose", "implement", "review", "contribute", "negative-trigger"]) {
    if (!modes.has(mode)) {
      fail(`Eval suite needs ${mode} coverage.`);
    }
  }

  for (const [category, covered] of Object.entries(categorySignals)) {
    if (!covered) {
      fail(`Eval suite needs ${category} coverage.`);
    }
  }
};

const validateTriggerEvals = () => {
  let evaluations;
  try {
    evaluations = JSON.parse(readText(path.join(skillDirectory, "evals", "trigger-evals.json")));
  } catch (error) {
    fail(`Trigger eval suite contains invalid JSON: ${error.message}`);
    return;
  }

  if (!Array.isArray(evaluations) || evaluations.length !== 20) {
    fail("Trigger eval suite needs exactly 20 cases.");
    return;
  }

  const ids = new Set();
  let shouldTrigger = 0;
  let shouldSkip = 0;
  for (const evaluation of evaluations) {
    if (!evaluation.id || !evaluation.query || typeof evaluation.should_trigger !== "boolean") {
      fail("Every trigger eval needs id, query, and should_trigger.");
    }
    if (ids.has(evaluation.id)) {
      fail(`Trigger eval ID repeats: ${evaluation.id}.`);
    }
    ids.add(evaluation.id);
    if (evaluation.should_trigger) shouldTrigger += 1;
    else shouldSkip += 1;
  }

  if (shouldTrigger < 8 || shouldSkip < 8) {
    fail("Trigger eval suite needs at least eight positive and eight negative cases.");
  }
};

const validateForwardTestContract = () => {
  let contract;
  try {
    contract = JSON.parse(readText(path.join(skillDirectory, "evals", "forward-test-contract.json")));
  } catch (error) {
    fail(`Fresh-context scoring contract contains invalid JSON: ${error.message}`);
    return;
  }

  if (contract.status !== "contract-only") {
    fail("Fresh-context scoring contract must remain contract-only until a recorded model run exists.");
  }
  if (contract.runRequirements?.freshContextPerRun !== true || contract.runRequirements?.repetitionsPerCase !== 3) {
    fail("Fresh-context scoring contract needs isolated contexts and three repetitions per case.");
  }
  if (!Array.isArray(contract.cases) || contract.cases.length < 8) {
    fail("Fresh-context scoring contract needs at least eight representative cases.");
  }
  const taskFixtures = JSON.parse(readText(path.join(skillDirectory, "evals", "evals.json")));
  const taskFixtureIds = new Set((taskFixtures.evals ?? []).map((evaluation) => evaluation.id));
  for (const testCase of contract.cases ?? []) {
    if (!taskFixtureIds.has(testCase.evalId)) {
      fail(`Fresh-context scoring contract references unknown task fixture ${testCase.evalId}.`);
    }
    if (!Array.isArray(testCase.critical) || testCase.critical.length < 1) {
      fail(`Fresh-context scoring contract case ${testCase.evalId} needs critical assertions.`);
    }
  }
  if (contract.scoring?.criticalPassRate !== 1 || contract.scoring?.overallPassRate !== 0.9) {
    fail("Fresh-context scoring contract needs a 100% critical and 90% overall threshold.");
  }
  for (const field of ["suite", "skillVersion", "model", "startedAt", "completedAt", "runs", "summary"]) {
    if (!(field in (contract.resultFormat ?? {}))) {
      fail(`Fresh-context result format is missing ${field}.`);
    }
  }
};

const blueprintArgument = process.argv.find((argument) => argument.startsWith("--blueprint="));
const blueprintIndex = process.argv.indexOf("--blueprint");
const providedBlueprintPath = blueprintArgument
  ? blueprintArgument.slice("--blueprint=".length)
  : blueprintIndex >= 0
    ? process.argv[blueprintIndex + 1]
    : undefined;

validateSkillDocument();
validateSchema();
validateEvals();
validateTriggerEvals();
validateForwardTestContract();

const blueprintPath = providedBlueprintPath
  ? path.resolve(process.cwd(), providedBlueprintPath)
  : path.join(skillDirectory, "assets", "example-motion-blueprint.json");

if (!blueprintPath || !fs.existsSync(blueprintPath)) {
  fail(`Blueprint file is unavailable: ${providedBlueprintPath ?? blueprintPath}`);
} else {
  try {
    validateBlueprint(JSON.parse(readText(blueprintPath)), blueprintPath);
  } catch (error) {
    fail(`Blueprint contains invalid JSON: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error("Motion Lexicon skill validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  const evalSuite = JSON.parse(readText(path.join(skillDirectory, "evals", "evals.json")));
  const triggerSuite = JSON.parse(readText(path.join(skillDirectory, "evals", "trigger-evals.json")));
  console.log(`Motion Lexicon Skill fixture validation passed: ${evalSuite.evals.length} task fixtures, ${triggerSuite.length} trigger fixtures, the Blueprint schema, and the fresh-context scoring contract are structurally valid. No model forward-test was executed.`);
}
