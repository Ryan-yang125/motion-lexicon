/* global console, process */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const skillDirectory = path.join(repositoryRoot, "skills", "motion-lexicon");
const bundledBlueprintValidatorPath = path.join(skillDirectory, "scripts", "validate-motion-blueprint.mjs");
const errors = [];

const readText = (filePath) => fs.readFileSync(filePath, "utf8");
const hasFile = (relativePath) => fs.existsSync(path.join(repositoryRoot, relativePath));
const fail = (message) => errors.push(message);
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const sha256Pattern = /^[a-f0-9]{64}$/;
const publicCatalog = JSON.parse(readText(path.join(repositoryRoot, "public", "data", "v4", "catalog.json")));
const publishedPrimitiveIds = new Set((publicCatalog.primitives ?? []).map((primitive) => primitive.id));
const requireRecordedForwardTest = process.argv.includes("--require-recorded");
const uint64be = (value) => {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64BE(BigInt(value));
  return buffer;
};
const sha256Tree = (rootDirectory, excludedTopLevel = new Set(), excludedPaths = new Set()) => {
  const files = [];
  const visit = (directory, relativeDirectory = "") => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      if (!relativeDirectory && excludedTopLevel.has(entry.name)) continue;
      if (excludedPaths.has(relativePath)) continue;
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolutePath, relativePath);
      else if (entry.isFile()) files.push([relativePath, absolutePath]);
      else if (entry.isSymbolicLink()) fail(`Tree hash rejects symbolic link: ${path.relative(repositoryRoot, absolutePath)}.`);
      else fail(`Tree hash rejects unsupported entry: ${path.relative(repositoryRoot, absolutePath)}.`);
    }
  };
  visit(rootDirectory);
  files.sort(([left], [right]) => left.localeCompare(right));
  const hash = crypto.createHash("sha256");
  for (const [relativePath, absolutePath] of files) {
    const pathBytes = Buffer.from(relativePath, "utf8");
    const contentBytes = fs.readFileSync(absolutePath);
    hash.update(uint64be(pathBytes.length));
    hash.update(pathBytes);
    hash.update(uint64be(contentBytes.length));
    hash.update(contentBytes);
  }
  return hash.digest("hex");
};
const isInside = (parentDirectory, candidatePath) => {
  const relativePath = path.relative(parentDirectory, candidatePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
};
const staysInsideRealEvidenceRoot = (evidenceRoot, absolutePath, label) => {
  if (!fs.existsSync(evidenceRoot)) return false;
  if (fs.lstatSync(evidenceRoot).isSymbolicLink()) {
    fail(`${label} cannot use a symbolic-link evidence root.`);
    return false;
  }

  const relativePath = path.relative(evidenceRoot, absolutePath);
  let currentPath = evidenceRoot;
  for (const segment of relativePath.split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, segment);
    if (!fs.existsSync(currentPath)) break;
    if (fs.lstatSync(currentPath).isSymbolicLink()) {
      fail(`${label} cannot traverse symbolic link ${path.relative(repositoryRoot, currentPath)}.`);
      return false;
    }
  }

  if (fs.existsSync(absolutePath)) {
    const realEvidenceRoot = fs.realpathSync.native(evidenceRoot);
    const realAbsolutePath = fs.realpathSync.native(absolutePath);
    if (!isInside(realEvidenceRoot, realAbsolutePath)) {
      fail(`${label} must stay inside the real recorded evidence root.`);
      return false;
    }
  }
  return true;
};
const resolveRepositoryEvidencePath = (relativePath, evidenceRoot, label) => {
  if (typeof relativePath !== "string" || relativePath.length === 0 || path.isAbsolute(relativePath)) {
    fail(`${label} must be a non-empty repository-relative path.`);
    return null;
  }
  const absolutePath = path.resolve(repositoryRoot, relativePath);
  if (!isInside(evidenceRoot, absolutePath)) {
    fail(`${label} must stay inside the recorded evidence root.`);
    return null;
  }
  if (!staysInsideRealEvidenceRoot(evidenceRoot, absolutePath, label)) return null;
  return absolutePath;
};
const readJsonArtifact = (absolutePath, label) => {
  try {
    return JSON.parse(readText(absolutePath));
  } catch (error) {
    fail(`${label} contains invalid JSON: ${error.message}`);
    return null;
  }
};
const resolveJsonPointer = (value, pointer) => {
  if (pointer === "") return { found: true, value };
  if (!pointer.startsWith("/")) return { found: false };
  let current = value;
  for (const encodedPart of pointer.slice(1).split("/")) {
    const part = encodedPart.replaceAll("~1", "/").replaceAll("~0", "~");
    if (current === null || typeof current !== "object") return { found: false };
    if (Array.isArray(current)) {
      if (!/^(0|[1-9]\d*)$/.test(part)) return { found: false };
      const index = Number(part);
      if (index >= current.length || !Object.hasOwn(current, index)) return { found: false };
      current = current[index];
      continue;
    }
    if (!Object.hasOwn(current, part)) return { found: false };
    current = current[part];
  }
  return { found: true, value: current };
};

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
  "skills/motion-lexicon/assets/motion-lexicon-page.css",
  "skills/motion-lexicon/THIRD_PARTY_NOTICES.md",
  "skills/motion-lexicon/scripts/validate-motion-blueprint.mjs",
  "skills/motion-lexicon/evals/evals.json",
  "skills/motion-lexicon/evals/trigger-evals.json",
  "skills/motion-lexicon/evals/forward-test-contract.json",
  "skills/motion-lexicon/evals/evidence/README.md",
  "skills/motion-lexicon/evals/fixtures/vite-react-ts-tailwind/manifest.json",
  "skills/motion-lexicon/references/motion-language.md",
  "skills/motion-lexicon/references/interior-principles.md",
  "skills/motion-lexicon/references/contract.md",
  "skills/motion-lexicon/references/components.md",
  "skills/motion-lexicon/references/composition.md",
  "skills/motion-lexicon/references/implementation-css.md",
  "skills/motion-lexicon/references/review-rubric.md",
  "skills/motion-lexicon/references/contribution.md",
  "skills/motion-lexicon/references/page-composition.md",
  "skills/motion-lexicon/references/page-system.md",
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

const candidatePrimitiveIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const validateBlueprint = (blueprint, pathLabel, { allowProposedCandidatePrimitive = false } = {}) => {
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

  const proposedCandidatePrimitiveIds = new Set();
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
      if (
        allowProposedCandidatePrimitive &&
        blueprint.provenance?.status === "candidate" &&
        typeof beat?.primitive === "string" &&
        candidatePrimitiveIdPattern.test(beat.primitive) &&
        !publishedPrimitiveIds.has(beat.primitive)
      ) {
        proposedCandidatePrimitiveIds.add(beat.primitive);
      } else if (!publishedPrimitiveIds.has(beat?.primitive)) {
        fail(`${pathLabel}.beats[${index}].primitive must be an exact published primitive ID.`);
      }
    }
  }
  if (proposedCandidatePrimitiveIds.size > 1) {
    fail(`${pathLabel}.beats may use at most one explicit proposed candidate primitive ID.`);
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
  if (!Array.isArray(blueprint.provenance?.foundations)) {
    fail(`${pathLabel}.provenance.foundations must be an array of exact published primitive IDs.`);
  } else {
    for (const [index, foundation] of blueprint.provenance.foundations.entries()) {
      if (!publishedPrimitiveIds.has(foundation)) {
        fail(`${pathLabel}.provenance.foundations[${index}] must be an exact published primitive ID.`);
      }
    }
  }
};

const executeBundledBlueprintValidator = (blueprintPath, pathLabel) => {
  const validation = spawnSync(process.execPath, [bundledBlueprintValidatorPath, blueprintPath], {
    cwd: repositoryRoot,
    encoding: "utf8"
  });
  if (validation.error) {
    fail(`${pathLabel} bundled validator could not run: ${validation.error.message}`);
    return null;
  }
  if (validation.status !== 0) {
    const detail = `${validation.stdout ?? ""}\n${validation.stderr ?? ""}`.trim();
    fail(`${pathLabel} fails the bundled validator${detail ? `: ${detail}` : "."}`);
  }
  return validation;
};

const validateSkillDocument = () => {
  const skillText = readText(path.join(skillDirectory, "SKILL.md"));
  const validatorText = readText(path.join(skillDirectory, "scripts", "validate-motion-blueprint.mjs"));
  const thirdPartyNotices = readText(path.join(skillDirectory, "THIRD_PARTY_NOTICES.md"));
  const packageManifest = JSON.parse(readText(path.join(repositoryRoot, "package.json")));
  const requiredHeadings = ["## Build Page", "## Recommend", "## Compose", "## Implement", "## Review", "## Contribute"];
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

  const pageComposition = readText(path.join(skillDirectory, "references", "page-composition.md"));
  const pageSystem = readText(path.join(skillDirectory, "references", "page-system.md"));
  const pageCss = readText(path.join(skillDirectory, "assets", "motion-lexicon-page.css"));
  for (const signal of ["Host inspection", "Framework", "Route", "Component system", "Tokens / theme", "Page Plan", "320", "390", "768", "1440", "44 px", "https://motion-lexicon.pages.dev/r/<component-id>.json", "Tailwind", "min-height: 44px", "browser checks", "every visible `button`", "offenders", "mark acceptance incomplete"]) {
    if (!pageComposition.includes(signal)) fail(`Page composition reference needs ${signal}.`);
  }
  for (const signal of ["#EFEEEA", "#141312", "Bezel", "Panel", "Well", "prefers-reduced-motion"]) {
    if (!pageSystem.includes(signal)) fail(`Page system reference needs ${signal}.`);
  }
  for (const signal of ["--bezel: #efeeea", "--panel: #ffffff", "--well: #f6f6f4", ":root.dark", ".ml-page", "@media (prefers-reduced-motion: reduce)"]) {
    if (!pageCss.includes(signal)) fail(`Generated page CSS needs ${signal}.`);
  }
  for (const signal of ["complete React page", "Host inspection", "Page Plan", "320, 390, 768, and 1440", "light and dark themes", "Registry integration gate", "Build success alone", "browser automation", "every visible `button`", "offenders", "Fix every offender", "exact published ID in every candidate row", "chosen ID in the Pick line", "write the final JSON to a temporary file", "exits `0`", "runnable code in the requested", "run its compile or build command", "monotonic request or intent version", "Simple copy edits, static token or breakpoint changes"]) {
    if (!skillText.includes(signal)) fail(`SKILL.md needs the Build Page signal: ${signal}.`);
  }

  const candidateTemplate = readText(path.join(skillDirectory, "assets", "candidate-template.md"));
  for (const signal of ["status: candidate", "<required: preset | moment-candidate | primitive-candidate>", "<required: zh | en>", "Motion Blueprint", "Product scenes", "Portable implementation", "Quality evidence", "Command or action", "Artifact", "Observed result"]) {
    if (!candidateTemplate.includes(signal)) {
      fail(`Candidate template needs the ${signal} section.`);
    }
  }

  const componentReference = readText(path.join(skillDirectory, "references", "components.md"));
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

  for (const referenceName of ["entrances.md", "feedback.md", "transitions.md", "sequencing.md"]) {
    const referenceText = readText(path.join(skillDirectory, "references", "primitives", referenceName));
    const candidateRows = referenceText.split("\n").filter((line) => /^\| (?!---)(?!Primitive)/.test(line));
    for (const row of candidateRows) {
      const id = row.split("|")[1]?.trim().match(/^`([^`]+)`$/)?.[1];
      if (!id || !publishedPrimitiveIds.has(id)) fail(`Primitive reference ${referenceName} has a candidate row without an exact published ID: ${row}`);
    }
    if (referenceName !== "entrances.md" && !referenceText.includes("cannot appear as a candidate ID")) fail(`Primitive reference ${referenceName} must distinguish concept-only labels from candidate IDs.`);
  }
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

  if (suite.skill_name !== "motion-lexicon" || suite.version !== "3.0") {
    fail("Eval suite needs the Motion Lexicon v3.0 identity.");
  }

  if (!Array.isArray(suite.evals) || suite.evals.length < 38) {
    fail("Eval suite needs at least 38 cases.");
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
    page: false,
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
    if (evaluation.mode === "build-page") categorySignals.page = true;
    if (evaluation.mode === "negative-trigger" && evaluation.shouldUseSkill === false) categorySignals.negative = true;
  }

  if (chineseCount < 12 || englishCount < 12) {
    fail("Eval suite needs at least 12 Chinese and 12 English cases.");
  }

  for (const mode of ["build-page", "recommend", "compose", "implement", "review", "contribute", "negative-trigger"]) {
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

  if (!Array.isArray(evaluations) || evaluations.length !== 28) {
    fail("Trigger eval suite needs exactly 28 cases.");
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

  if (shouldTrigger < 12 || shouldSkip < 12) {
    fail("Trigger eval suite needs at least twelve positive and twelve negative cases.");
  }
};

const validatePageEvalFixture = (evaluation) => {
  const fixture = evaluation.fixture;
  const label = `Eval ${evaluation.id} fixture`;
  if (!fixture || fixture.id !== "vite-react-ts-tailwind") {
    fail(`${label} must bind the committed vite-react-ts-tailwind fixture.`);
    return;
  }
  const expectedPath = "evals/fixtures/vite-react-ts-tailwind";
  const expectedManifestPath = `${expectedPath}/manifest.json`;
  if (fixture.path !== expectedPath || fixture.manifestPath !== expectedManifestPath) {
    fail(`${label} paths must reference the committed fixture and manifest.`);
    return;
  }
  const fixtureDirectory = path.join(skillDirectory, fixture.path);
  const manifestPath = path.join(skillDirectory, fixture.manifestPath);
  const manifest = readJsonArtifact(manifestPath, `${label} manifest`);
  if (!manifest) return;
  const manifestPaths = (manifest.files ?? []).map((file) => file.path);
  if (manifest.id !== fixture.id || manifest.fileCount !== manifestPaths.length) {
    fail(`${label} manifest identity or file count is inconsistent.`);
  }
  if (fixture.fileCount !== manifest.fileCount || fixture.treeSha256 !== manifest.treeSha256) {
    fail(`${label} binding must repeat the committed manifest count and tree hash.`);
  }
  if (JSON.stringify(evaluation.files) !== JSON.stringify(manifestPaths)) {
    fail(`${label} files must exactly match the ordered committed manifest.`);
  }
  for (const file of manifest.files ?? []) {
    const absolutePath = path.join(fixtureDirectory, file.path);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      fail(`${label} is missing ${file.path}.`);
    } else if (sha256(fs.readFileSync(absolutePath)) !== file.sha256) {
      fail(`${label} file hash drifted for ${file.path}.`);
    }
  }
  const actualTreeSha256 = sha256Tree(fixtureDirectory, new Set(), new Set(["manifest.json"]));
  if (actualTreeSha256 !== manifest.treeSha256) fail(`${label} tree hash drifted.`);
};

const validateForwardTestContract = () => {
  let contract;
  try {
    contract = JSON.parse(readText(path.join(skillDirectory, "evals", "forward-test-contract.json")));
  } catch (error) {
    fail(`Fresh-context scoring contract contains invalid JSON: ${error.message}`);
    return;
  }

  if (!["contract-only", "recorded"].includes(contract.status)) {
    fail("Fresh-context scoring contract status needs contract-only or recorded.");
  }
  if (requireRecordedForwardTest && contract.status !== "recorded") {
    fail("Release requires a recorded 36-run forward test with committed evidence.");
  }
  if (contract.runRequirements?.freshContextPerRun !== true || contract.runRequirements?.repetitionsPerCase !== 3) {
    fail("Fresh-context scoring contract needs isolated contexts and three repetitions per case.");
  }
  if (JSON.stringify(contract.runRequirements?.installedSkillExcludes) !== JSON.stringify(["evals"])) {
    fail("Fresh-context runs must install a Skill copy that excludes evals.");
  }
  if (!Array.isArray(contract.cases) || contract.cases.length !== 12) {
    fail("Fresh-context scoring contract needs exactly twelve representative cases for 36-run coverage.");
  }
  const taskFixtures = JSON.parse(readText(path.join(skillDirectory, "evals", "evals.json")));
  const taskFixtureIds = new Set((taskFixtures.evals ?? []).map((evaluation) => evaluation.id));
  const contractCaseIds = new Set();
  for (const testCase of contract.cases ?? []) {
    if (contractCaseIds.has(testCase.evalId)) {
      fail(`Fresh-context scoring contract repeats task fixture ${testCase.evalId}.`);
    }
    contractCaseIds.add(testCase.evalId);
    if (!taskFixtureIds.has(testCase.evalId)) {
      fail(`Fresh-context scoring contract references unknown task fixture ${testCase.evalId}.`);
    }
    if (!Array.isArray(testCase.critical) || testCase.critical.length < 1) {
      fail(`Fresh-context scoring contract case ${testCase.evalId} needs critical assertions.`);
    }
  }
  const pageCaseCount = (contract.cases ?? []).filter((testCase) => {
    const fixture = (taskFixtures.evals ?? []).find((evaluation) => evaluation.id === testCase.evalId);
    return fixture?.mode === "build-page";
  }).length;
  if (pageCaseCount < 4) fail("Fresh-context scoring contract needs at least four Build Page cases.");
  for (const testCase of contract.cases ?? []) {
    const evaluation = (taskFixtures.evals ?? []).find((item) => item.id === testCase.evalId);
    if (evaluation?.mode === "build-page" || ["en-implement-react-selection", "en-contribute-primitive-candidate"].includes(evaluation?.id)) validatePageEvalFixture(evaluation);
  }
  if (contract.scoring?.criticalPassRate !== 1 || contract.scoring?.overallPassRate !== 0.9) {
    fail("Fresh-context scoring contract needs a 100% critical and 90% overall threshold.");
  }
  for (const field of ["suite", "skillVersion", "skillSha256", "skillTreeSha256", "model", "startedAt", "completedAt", "evidenceRoot", "scorer", "runs", "summary"]) {
    if (!(field in (contract.resultFormat ?? {}))) {
      fail(`Fresh-context result format is missing ${field}.`);
    }
  }

  if (contract.status === "recorded") {
    validateForwardTestResult(contract, taskFixtures);
  }

};

const validateForwardTestResult = (contract, taskFixtures) => {
  const resultPath = path.join(skillDirectory, "evals", "forward-test-2026-08-11.json");
  let result;
  try {
    result = JSON.parse(readText(resultPath));
  } catch (error) {
    fail(`Recorded fresh-context result contains invalid JSON: ${error.message}`);
    return;
  }

  const packageManifest = JSON.parse(readText(path.join(repositoryRoot, "package.json")));
  const skillText = readText(path.join(skillDirectory, "SKILL.md"));
  const fixtureById = new Map((taskFixtures.evals ?? []).map((fixture) => [fixture.id, fixture]));
  const caseById = new Map((contract.cases ?? []).map((testCase) => [testCase.evalId, testCase]));
  const expectedRunTotal = caseById.size * contract.runRequirements.repetitionsPerCase;
  const expectedEvidenceRootPath = "skills/motion-lexicon/evals/evidence/forward-test-2026-08-11";
  const evidenceRoot = path.join(repositoryRoot, expectedEvidenceRootPath);

  if (result.suite !== contract.suite) fail("Recorded fresh-context result has the wrong suite.");
  if (result.skillVersion !== packageManifest.version) fail("Recorded fresh-context result has a stale Skill version.");
  if (result.skillSha256 !== sha256(skillText)) fail("Recorded fresh-context result does not match the current SKILL.md hash.");
  if (result.skillTreeSha256 !== sha256Tree(skillDirectory, new Set(["evals"]))) {
    fail("Recorded fresh-context result does not match the current installed Skill payload hash.");
  }
  if (typeof result.model !== "string" || result.model.length === 0) fail("Recorded fresh-context result needs a model.");
  if (!Number.isFinite(Date.parse(result.startedAt)) || !Number.isFinite(Date.parse(result.completedAt))) {
    fail("Recorded fresh-context result needs valid ISO-8601 timestamps.");
  } else if (Date.parse(result.completedAt) < Date.parse(result.startedAt)) {
    fail("Recorded fresh-context result completes before it starts.");
  }
  const suiteStartedAt = Date.parse(result.startedAt);
  const suiteCompletedAt = Date.parse(result.completedAt);
  const validateEvidenceTimeRange = (artifact, label) => {
    const startedAt = Date.parse(artifact?.startedAt);
    const completedAt = Date.parse(artifact?.completedAt);
    if (!Number.isFinite(startedAt) || !Number.isFinite(completedAt)) {
      fail(`${label} needs valid timestamps.`);
    } else if (completedAt < startedAt) {
      fail(`${label} completes before it starts.`);
    } else if (startedAt < suiteStartedAt || completedAt > suiteCompletedAt) {
      fail(`${label} timestamps must stay inside the recorded suite interval.`);
    }
  };
  if (result.evidenceRoot !== expectedEvidenceRootPath) {
    fail(`Recorded fresh-context evidenceRoot must equal ${expectedEvidenceRootPath}.`);
  }
  if (!fs.existsSync(evidenceRoot) || !fs.lstatSync(evidenceRoot).isDirectory()) {
    fail("Recorded fresh-context evidence root is missing.");
  }
  if (typeof result.scorer?.identity !== "string" || result.scorer.identity.trim().length < 3) {
    fail("Recorded fresh-context result needs an independent scorer identity.");
  }
  if (result.scorer?.independent !== true) {
    fail("Recorded fresh-context scorer must declare independence.");
  }
  const scorerPromptPath = resolveRepositoryEvidencePath(result.scorer?.promptPath, evidenceRoot, "recordedResult.scorer.promptPath");
  if (!scorerPromptPath || !fs.existsSync(scorerPromptPath) || !fs.statSync(scorerPromptPath).isFile()) {
    fail("Recorded fresh-context scorer prompt artifact is missing.");
  } else if (sha256(fs.readFileSync(scorerPromptPath)) !== result.scorer.promptSha256) {
    fail("Recorded fresh-context scorer prompt hash does not match its artifact.");
  }
  if (!Array.isArray(result.runs) || result.runs.length !== expectedRunTotal) {
    fail(`Recorded fresh-context result needs exactly ${expectedRunTotal} runs.`);
    return;
  }

  const runKeys = new Set();
  const outputPaths = new Set();
  const runHomes = new Set();
  const runCodexHomes = new Set();
  const runWorkdirs = new Set();
  let criticalPassed = 0;
  let criticalTotal = 0;
  let assertionsPassed = 0;
  let assertionsTotal = 0;
  const passingRepetitionsByCase = new Map([...caseById.keys()].map((evalId) => [evalId, 0]));

  for (const [index, run] of result.runs.entries()) {
    const fixture = fixtureById.get(run.evalId);
    const testCase = caseById.get(run.evalId);
    const runPath = `recordedResult.runs[${index}]`;
    if (!fixture || !testCase) {
      fail(`${runPath} references an eval outside the contract: ${run.evalId}.`);
      continue;
    }
    if (!Number.isInteger(run.repetition) || run.repetition < 1 || run.repetition > 3) {
      fail(`${runPath}.repetition needs an integer from 1 through 3.`);
    }
    const runKey = `${run.evalId}#${run.repetition}`;
    if (runKeys.has(runKey)) fail(`${runPath} duplicates ${runKey}.`);
    runKeys.add(runKey);

    const runEvidenceRoot = path.join(evidenceRoot, run.evalId, `r${run.repetition}`);
    const artifactPaths = Array.isArray(run.artifactPaths) ? run.artifactPaths : [];
    const uniqueArtifactPaths = new Set(artifactPaths);
    const artifactFilePaths = new Set();
    if (uniqueArtifactPaths.size !== artifactPaths.length) fail(`${runPath}.artifactPaths contains duplicates.`);
    for (const [artifactIndex, artifactPath] of artifactPaths.entries()) {
      const absolutePath = resolveRepositoryEvidencePath(artifactPath, evidenceRoot, `${runPath}.artifactPaths[${artifactIndex}]`);
      if (absolutePath && !isInside(runEvidenceRoot, absolutePath)) {
        fail(`${runPath}.artifactPaths[${artifactIndex}] must stay inside its run directory.`);
      }
      if (absolutePath && !fs.existsSync(absolutePath)) fail(`${runPath}.artifactPaths[${artifactIndex}] does not exist.`);
      else if (absolutePath) {
        if (fs.lstatSync(absolutePath).isSymbolicLink()) fail(`${runPath}.artifactPaths[${artifactIndex}] cannot be a symbolic link.`);
        if (fs.statSync(absolutePath).isFile()) artifactFilePaths.add(artifactPath);
      }
    }
    const fileHashPaths = Object.keys(run.artifactFileSha256 ?? {});
    if (JSON.stringify([...fileHashPaths].sort()) !== JSON.stringify([...artifactFilePaths].sort())) {
      fail(`${runPath}.artifactFileSha256 must bind every artifact file exactly once.`);
    }
    for (const artifactPath of artifactFilePaths) {
      const expectedHash = run.artifactFileSha256?.[artifactPath];
      const absolutePath = path.resolve(repositoryRoot, artifactPath);
      if (!sha256Pattern.test(expectedHash ?? "") || sha256(fs.readFileSync(absolutePath)) !== expectedHash) {
        fail(`${runPath}.artifactFileSha256 does not match ${artifactPath}.`);
      }
    }
    const requireArtifact = (relativePath, label, expectedKind = "file") => {
      const absolutePath = resolveRepositoryEvidencePath(relativePath, evidenceRoot, `${runPath}.${label}`);
      if (!absolutePath) return null;
      if (!isInside(runEvidenceRoot, absolutePath)) fail(`${runPath}.${label} must stay inside its run directory.`);
      if (!uniqueArtifactPaths.has(relativePath)) fail(`${runPath}.${label} must be listed in artifactPaths.`);
      if (!fs.existsSync(absolutePath)) {
        fail(`${runPath}.${label} does not exist.`);
        return null;
      }
      const stats = fs.statSync(absolutePath);
      if (expectedKind === "file" && !stats.isFile()) fail(`${runPath}.${label} must be a file.`);
      if (expectedKind === "directory" && !stats.isDirectory()) fail(`${runPath}.${label} must be a directory.`);
      return absolutePath;
    };
    const verifyFileHash = (relativePath, absolutePath, hashField) => {
      const expectedHash = run.artifactSha256?.[hashField];
      if (!sha256Pattern.test(expectedHash ?? "")) {
        fail(`${runPath}.artifactSha256.${hashField} needs a SHA-256 digest.`);
      } else if (absolutePath && fs.statSync(absolutePath).isFile() && sha256(fs.readFileSync(absolutePath)) !== expectedHash) {
        fail(`${runPath}.artifactSha256.${hashField} does not match ${relativePath}.`);
      }
    };

    if (run.prompt !== fixture.prompt) fail(`${runPath}.prompt does not exactly match its fixture.`);
    if (run.promptSha256 !== sha256(fixture.prompt)) fail(`${runPath}.promptSha256 does not match the exact prompt.`);
    const promptArtifact = requireArtifact(run.promptPath, "promptPath");
    if (promptArtifact && readText(promptArtifact) !== fixture.prompt) fail(`${runPath}.promptPath does not contain the exact fixture prompt.`);
    verifyFileHash(run.promptPath, promptArtifact, "prompt");
    if (run.triggered !== fixture.shouldUseSkill) fail(`${runPath}.triggered contradicts shouldUseSkill.`);
    if (run.processExitCode !== 0) fail(`${runPath}.processExitCode must be zero.`);
    const outputArtifact = requireArtifact(run.outputPath, "outputPath");
    verifyFileHash(run.outputPath, outputArtifact, "output");
    const transcriptArtifact = requireArtifact(run.transcriptPath, "transcriptPath");
    verifyFileHash(run.transcriptPath, transcriptArtifact, "transcript");
    if (transcriptArtifact) {
      const eventLines = readText(transcriptArtifact).split(/\r?\n/).filter(Boolean);
      if (eventLines.length === 0) fail(`${runPath}.transcriptPath must contain JSONL events.`);
      for (const [eventIndex, eventLine] of eventLines.entries()) {
        try { JSON.parse(eventLine); } catch { fail(`${runPath}.transcriptPath line ${eventIndex + 1} is invalid JSON.`); }
      }
    }
    if (outputPaths.has(run.outputPath)) fail(`${runPath}.outputPath must be unique.`);
    else outputPaths.add(run.outputPath);

    const isolationArtifact = requireArtifact(run.isolationManifestPath, "isolationManifestPath");
    verifyFileHash(run.isolationManifestPath, isolationArtifact, "isolationManifest");
    const initialFixtureArtifact = requireArtifact(run.isolation?.initialFixturePath, "isolation.initialFixturePath");
    verifyFileHash(run.isolation?.initialFixturePath, initialFixtureArtifact, "initialFixtureManifest");
    const isolationManifest = isolationArtifact ? readJsonArtifact(isolationArtifact, `${runPath}.isolationManifestPath`) : null;
    const initialFixtureManifest = initialFixtureArtifact ? readJsonArtifact(initialFixtureArtifact, `${runPath}.isolation.initialFixturePath`) : null;

    const isolation = run.isolation ?? {};
    for (const field of ["freshHome", "freshCodexHome", "freshProject", "declaredFixtureOnly", "skillEvalsExcluded"]) {
      if (isolation?.[field] !== true) fail(`${runPath}.isolation.${field} must be true.`);
    }
    if (!Number.isInteger(isolation?.initialFixtureFileCount) || isolation.initialFixtureFileCount < 0) {
      fail(`${runPath}.isolation.initialFixtureFileCount needs a non-negative integer.`);
    }
    if (!sha256Pattern.test(isolation?.initialFixtureSha256 ?? "")) {
      fail(`${runPath}.isolation.initialFixtureSha256 needs a SHA-256 digest.`);
    }
    for (const field of ["neighborRunHits", "sourceRepositoryHits"]) {
      if (isolation?.[field] !== 0) fail(`${runPath}.isolation.${field} must be zero.`);
    }
    if (isolation?.expectedAnswerExposure !== false) fail(`${runPath}.isolation.expectedAnswerExposure must be false.`);
    if (!isolationManifest || !isolationManifest.isolation) {
      fail(`${runPath}.isolation must exist in the preserved isolation manifest.`);
    } else {
      for (const [field, value] of Object.entries(isolation)) {
        if (isolationManifest.isolation[field] !== value) fail(`${runPath}.isolation.${field} does not match the preserved isolation manifest.`);
      }
      for (const field of Object.keys(isolationManifest.isolation)) {
        if (!(field in isolation)) fail(`${runPath} isolation manifest contains unexpected isolation field ${field}.`);
      }
    }
    if (isolationManifest) {
      validateEvidenceTimeRange(isolationManifest, `${runPath}.isolationManifestPath`);
      for (const [field, expected] of [["evalId", run.evalId], ["repetition", run.repetition], ["promptSha256", run.promptSha256], ["skillSha256", result.skillSha256], ["skillTreeSha256", result.skillTreeSha256], ["evalsPresent", false]]) {
        if (isolationManifest[field] !== expected) fail(`${runPath} isolation manifest ${field} is inconsistent.`);
      }
      for (const [field, values] of [["home", runHomes], ["codexHome", runCodexHomes], ["workdir", runWorkdirs]]) {
        const value = isolationManifest[field];
        if (typeof value !== "string" || !path.isAbsolute(value)) fail(`${runPath} isolation manifest ${field} must be an absolute path.`);
        else if (values.has(value)) fail(`${runPath} isolation manifest ${field} must be unique.`);
        else values.add(value);
      }
      if (typeof isolationManifest.skillPath !== "string" || !isolationManifest.skillPath.endsWith("/skills/motion-lexicon")) {
        fail(`${runPath} isolation manifest needs the installed Skill path.`);
      }
    }
    if (!initialFixtureManifest || initialFixtureManifest.fileCount !== isolation.initialFixtureFileCount || initialFixtureManifest.treeSha256 !== isolation.initialFixtureSha256) {
      fail(`${runPath} initial fixture manifest does not match the recorded isolation fields.`);
    }

    const hashes = run.artifactSha256;
    let contributeSourceArtifact = null;
    let contributeDistArtifact = null;
    let contributeBuildEvidence = null;
    if (fixture.mode === "build-page" || fixture.id === "en-implement-react-selection") {
      if (run.buildExitCode !== 0) fail(`${runPath}.buildExitCode must be zero for ${fixture.mode}.`);
      if (fixture.mode === "build-page" && run.browserAcceptanceExitCode !== 0) fail(`${runPath}.browserAcceptanceExitCode must be zero for Build Page.`);
      if (fixture.mode === "implement" && run.browserAcceptanceExitCode !== null) fail(`${runPath}.browserAcceptanceExitCode must be null for Implement.`);
      const sourceArtifact = requireArtifact(run.sourcePath, "sourcePath", "directory");
      const distArtifact = requireArtifact(run.distPath, "distPath", "directory");
      if (sourceArtifact && ["node_modules", ".git", "dist"].some((entry) => fs.existsSync(path.join(sourceArtifact, entry)))) {
        fail(`${runPath}.sourcePath must exclude node_modules, .git, and dist.`);
      }
      const sourceTreeSha256 = sourceArtifact ? sha256Tree(sourceArtifact) : null;
      const distTreeSha256 = distArtifact ? sha256Tree(distArtifact) : null;
      if (hashes?.sourceTree !== sourceTreeSha256) fail(`${runPath}.artifactSha256.sourceTree does not match the preserved source tree.`);
      if (hashes?.distTree !== distTreeSha256) fail(`${runPath}.artifactSha256.distTree does not match the preserved dist tree.`);
      const buildArtifact = requireArtifact(run.buildEvidencePath, "buildEvidencePath");
      verifyFileHash(run.buildEvidencePath, buildArtifact, "buildEvidence");
      const buildEvidence = buildArtifact ? readJsonArtifact(buildArtifact, `${runPath}.buildEvidencePath`) : null;
      if (!buildEvidence || buildEvidence.exitCode !== 0 || buildEvidence.command !== "npm run build") {
        fail(`${runPath}.buildEvidencePath must record npm run build with exit code 0.`);
      } else {
        validateEvidenceTimeRange(buildEvidence, `${runPath}.buildEvidencePath`);
        if (buildEvidence.sourceTreeSha256 !== sourceTreeSha256 || buildEvidence.distTreeSha256 !== distTreeSha256) {
          fail(`${runPath}.buildEvidencePath tree hashes do not match preserved source and dist.`);
        }
        if (!Number.isFinite(Date.parse(buildEvidence.startedAt)) || !Number.isFinite(Date.parse(buildEvidence.completedAt))) {
          fail(`${runPath}.buildEvidencePath needs valid timestamps.`);
        }
        if (typeof buildEvidence.stdout !== "string" || buildEvidence.stdout.length === 0 || typeof buildEvidence.stderr !== "string") {
          fail(`${runPath}.buildEvidencePath must preserve build stdout and stderr.`);
        }
      }
      if (distArtifact && !fs.existsSync(path.join(distArtifact, "index.html"))) fail(`${runPath}.distPath needs a built index.html.`);
      if (sourceArtifact && (!fs.existsSync(path.join(sourceArtifact, "package.json")) || !fs.existsSync(path.join(sourceArtifact, "src")))) {
        fail(`${runPath}.sourcePath needs package.json and src/.`);
      }
      if (fixture.mode === "build-page") {
      const browserArtifact = requireArtifact(run.browserAcceptancePath, "browserAcceptancePath");
      verifyFileHash(run.browserAcceptancePath, browserArtifact, "browserAcceptance");
      const browserEvidence = browserArtifact ? readJsonArtifact(browserArtifact, `${runPath}.browserAcceptancePath`) : null;
      if (!browserEvidence || browserEvidence.exitCode !== 0 || typeof browserEvidence.automationCommand !== "string" || browserEvidence.automationCommand.length === 0) {
        fail(`${runPath}.browserAcceptancePath must record browser automation and exit code 0.`);
      }
      if (browserEvidence?.evalId !== run.evalId || browserEvidence?.repetition !== run.repetition) {
        fail(`${runPath}.browserAcceptancePath must bind the current eval ID and repetition.`);
      }
      if (browserEvidence?.sourceTreeSha256 !== sourceTreeSha256 || browserEvidence?.distTreeSha256 !== distTreeSha256) {
        fail(`${runPath}.browserAcceptancePath must bind the preserved source and dist trees.`);
      }
      const viewports = browserEvidence?.viewports;
      if (!Array.isArray(viewports) || viewports.length !== 4 || JSON.stringify(viewports.map((item) => item.width).sort((a, b) => a - b)) !== JSON.stringify([320, 390, 768, 1440])) {
        fail(`${runPath}.browserAcceptancePath needs one record for each required viewport.`);
      } else {
        for (const viewport of viewports) {
          if (!Number.isFinite(viewport.documentWidth) || viewport.documentWidth > viewport.width) fail(`${runPath} viewport ${viewport.width} overflows horizontally.`);
          if (!Number.isInteger(viewport.interactiveNodeCount) || viewport.interactiveNodeCount < 1) fail(`${runPath} viewport ${viewport.width} needs enumerated interactive nodes.`);
          if (viewport.minimumTargetWidth < 44 || viewport.minimumTargetHeight < 44) fail(`${runPath} viewport ${viewport.width} has a target below 44 px.`);
          if (!Array.isArray(viewport.offenders) || viewport.offenders.length !== 0) fail(`${runPath} viewport ${viewport.width} has target offenders.`);
          if (!Array.isArray(viewport.interactions) || viewport.interactions.length < 1) fail(`${runPath} viewport ${viewport.width} needs observed interactions.`);
          if (!Array.isArray(viewport.nodes) || viewport.nodes.length !== viewport.interactiveNodeCount) {
            fail(`${runPath} viewport ${viewport.width} must preserve every enumerated interactive node.`);
          } else {
            const minimumWidth = Math.min(...viewport.nodes.map((node) => node.width));
            const minimumHeight = Math.min(...viewport.nodes.map((node) => node.height));
            if (viewport.nodes.some((node) => typeof node.selector !== "string" || node.selector.length === 0 || node.width < 44 || node.height < 44)) {
              fail(`${runPath} viewport ${viewport.width} contains an invalid or undersized interactive node.`);
            }
            if (viewport.minimumTargetWidth !== minimumWidth || viewport.minimumTargetHeight !== minimumHeight) {
              fail(`${runPath} viewport ${viewport.width} minimum target measurements do not match its nodes.`);
            }
          }
        }
      }
      for (const theme of ["light", "dark"]) {
        if (browserEvidence?.themes?.[theme]?.observed !== true || typeof browserEvidence.themes[theme].activation !== "string" || typeof browserEvidence.themes[theme].result !== "string") fail(`${runPath} needs observed ${theme} theme evidence.`);
      }
      if (browserEvidence?.keyboard?.observed !== true || typeof browserEvidence.keyboard.path !== "string" || typeof browserEvidence.keyboard.focusEntry !== "string" || typeof browserEvidence.keyboard.focusReturn !== "string" || typeof browserEvidence.keyboard.result !== "string") fail(`${runPath} needs observed keyboard path, focus entry, and focus return.`);
      if (browserEvidence?.reducedMotion?.observed !== true || browserEvidence.reducedMotion.preference !== "reduce" || typeof browserEvidence.reducedMotion.result !== "string") fail(`${runPath} needs observed reduced-motion evidence.`);
      if (browserEvidence?.primaryState?.observed !== true || !Array.isArray(browserEvidence.primaryState.states) || browserEvidence.primaryState.states.length < 2 || typeof browserEvidence.primaryState.result !== "string") fail(`${runPath} needs observed primary-state evidence.`);
      for (const field of ["consoleErrors", "pageErrors", "requestFailures", "hydrationErrors"]) {
        if (browserEvidence?.runtime?.[field] !== 0) fail(`${runPath} browser runtime ${field} must be zero.`);
      }
      } else {
        if (run.browserAcceptancePath !== null || hashes?.browserAcceptance !== null) fail(`${runPath} Implement browser evidence fields must be null.`);
      }
      if (initialFixtureManifest?.id !== fixture.fixture?.id || initialFixtureManifest?.treeSha256 !== fixture.fixture?.treeSha256 || initialFixtureManifest?.fileCount !== fixture.fixture?.fileCount) {
        fail(`${runPath} did not start from the fixture bound to its eval case.`);
      }
      for (const field of ["blueprintPath", "validatorEvidencePath", "candidatePath", "placeholderScanPath", "validatorExitCode"]) {
        if (run[field] !== null) fail(`${runPath}.${field} must be null for ${fixture.mode}.`);
      }
      for (const field of ["blueprint", "validatorEvidence", "candidate", "placeholderScan"]) {
        if (hashes?.[field] !== null) fail(`${runPath}.artifactSha256.${field} must be null for ${fixture.mode}.`);
      }
    } else {
      if (fixture.mode === "contribute") {
        if (run.buildExitCode !== 0) fail(`${runPath}.buildExitCode must be zero for Contribute.`);
        if (run.browserAcceptanceExitCode !== null || run.browserAcceptancePath !== null || hashes?.browserAcceptance !== null) {
          fail(`${runPath} Contribute browser evidence fields must be null.`);
        }
        const sourceArtifact = requireArtifact(run.sourcePath, "sourcePath", "directory");
        const distArtifact = requireArtifact(run.distPath, "distPath", "directory");
        contributeSourceArtifact = sourceArtifact;
        contributeDistArtifact = distArtifact;
        if (sourceArtifact && ["node_modules", ".git", "dist"].some((entry) => fs.existsSync(path.join(sourceArtifact, entry)))) {
          fail(`${runPath}.sourcePath must exclude node_modules, .git, and dist.`);
        }
        const sourceTreeSha256 = sourceArtifact ? sha256Tree(sourceArtifact) : null;
        const distTreeSha256 = distArtifact ? sha256Tree(distArtifact) : null;
        if (hashes?.sourceTree !== sourceTreeSha256) fail(`${runPath}.artifactSha256.sourceTree does not match the preserved source tree.`);
        if (hashes?.distTree !== distTreeSha256) fail(`${runPath}.artifactSha256.distTree does not match the preserved dist tree.`);
        const buildArtifact = requireArtifact(run.buildEvidencePath, "buildEvidencePath");
        verifyFileHash(run.buildEvidencePath, buildArtifact, "buildEvidence");
        const buildEvidence = buildArtifact ? readJsonArtifact(buildArtifact, `${runPath}.buildEvidencePath`) : null;
        contributeBuildEvidence = buildEvidence;
        if (!buildEvidence || buildEvidence.exitCode !== 0 || buildEvidence.command !== "npm run build" || buildEvidence.sourceTreeSha256 !== sourceTreeSha256 || buildEvidence.distTreeSha256 !== distTreeSha256) {
          fail(`${runPath}.buildEvidencePath must bind a successful npm run build to preserved source and dist.`);
        } else {
          validateEvidenceTimeRange(buildEvidence, `${runPath}.buildEvidencePath`);
          if (typeof buildEvidence.stdout !== "string" || buildEvidence.stdout.length === 0 || typeof buildEvidence.stderr !== "string") {
            fail(`${runPath}.buildEvidencePath must preserve stdout and stderr.`);
          }
        }
        if (distArtifact && !fs.existsSync(path.join(distArtifact, "index.html"))) fail(`${runPath}.distPath needs a built index.html.`);
        if (sourceArtifact && (!fs.existsSync(path.join(sourceArtifact, "package.json")) || !fs.existsSync(path.join(sourceArtifact, "src")))) {
          fail(`${runPath}.sourcePath needs package.json and src/.`);
        }
      } else {
        for (const field of ["buildExitCode", "browserAcceptanceExitCode", "sourcePath", "distPath", "buildEvidencePath", "browserAcceptancePath"]) {
          if (run[field] !== null) fail(`${runPath}.${field} must be null outside Build Page, Implement, and Contribute.`);
        }
        for (const field of ["sourceTree", "distTree", "buildEvidence", "browserAcceptance"]) {
          if (hashes?.[field] !== null) fail(`${runPath}.artifactSha256.${field} must be null outside Build Page, Implement, and Contribute.`);
        }
      }
      if (fixture.mode === "compose") {
        if (run.validatorExitCode !== 0) fail(`${runPath}.validatorExitCode must be zero for Compose.`);
        const blueprintArtifact = requireArtifact(run.blueprintPath, "blueprintPath");
        const validatorArtifact = requireArtifact(run.validatorEvidencePath, "validatorEvidencePath");
        verifyFileHash(run.blueprintPath, blueprintArtifact, "blueprint");
        verifyFileHash(run.validatorEvidencePath, validatorArtifact, "validatorEvidence");
        if (blueprintArtifact) {
          const blueprint = readJsonArtifact(blueprintArtifact, `${runPath}.blueprintPath`);
          if (blueprint) validateBlueprint(blueprint, `${runPath}.blueprintPath`);
          executeBundledBlueprintValidator(blueprintArtifact, `${runPath}.blueprintPath`);
          const fencedMatch = outputArtifact ? readText(outputArtifact).match(/```json\s*\n([\s\S]*?)\n```/) : null;
          if (!fencedMatch || fencedMatch[1] !== readText(blueprintArtifact).trimEnd()) {
            fail(`${runPath}.blueprintPath must match the final fenced JSON byte-for-byte.`);
          }
        }
        const validatorEvidence = validatorArtifact ? readJsonArtifact(validatorArtifact, `${runPath}.validatorEvidencePath`) : null;
        if (!validatorEvidence || validatorEvidence.exitCode !== 0 || !String(validatorEvidence.command ?? "").includes("validate-motion-blueprint.mjs")) {
          fail(`${runPath}.validatorEvidencePath must record the bundled validator with exit code 0.`);
        } else {
          validateEvidenceTimeRange(validatorEvidence, `${runPath}.validatorEvidencePath`);
          if (blueprintArtifact && validatorEvidence.blueprintSha256 !== sha256(fs.readFileSync(blueprintArtifact))) {
            fail(`${runPath}.validatorEvidencePath Blueprint hash does not match.`);
          }
        }
        for (const field of ["candidatePath", "placeholderScanPath"]) {
          if (run[field] !== null) fail(`${runPath}.${field} must be null for Compose.`);
        }
        for (const field of ["candidate", "placeholderScan"]) {
          if (hashes?.[field] !== null) fail(`${runPath}.artifactSha256.${field} must be null for Compose.`);
        }
      } else if (fixture.mode === "contribute") {
        if (run.validatorExitCode !== 0) fail(`${runPath}.validatorExitCode must be zero for Contribute.`);
        const candidateArtifact = requireArtifact(run.candidatePath, "candidatePath");
        const blueprintArtifact = requireArtifact(run.blueprintPath, "blueprintPath");
        const validatorArtifact = requireArtifact(run.validatorEvidencePath, "validatorEvidencePath");
        const placeholderScanArtifact = requireArtifact(run.placeholderScanPath, "placeholderScanPath");
        verifyFileHash(run.candidatePath, candidateArtifact, "candidate");
        verifyFileHash(run.blueprintPath, blueprintArtifact, "blueprint");
        verifyFileHash(run.validatorEvidencePath, validatorArtifact, "validatorEvidence");
        verifyFileHash(run.placeholderScanPath, placeholderScanArtifact, "placeholderScan");
        if (blueprintArtifact) {
          const blueprint = readJsonArtifact(blueprintArtifact, `${runPath}.blueprintPath`);
          if (blueprint) validateBlueprint(blueprint, `${runPath}.blueprintPath`, { allowProposedCandidatePrimitive: true });
          executeBundledBlueprintValidator(blueprintArtifact, `${runPath}.blueprintPath`);
          if (blueprint?.locale !== "en" || blueprint?.provenance?.status !== "candidate") {
            fail(`${runPath}.blueprintPath must be an English candidate Blueprint.`);
          }
        }
        const validatorEvidence = validatorArtifact ? readJsonArtifact(validatorArtifact, `${runPath}.validatorEvidencePath`) : null;
        if (!validatorEvidence || validatorEvidence.exitCode !== 0 || !String(validatorEvidence.command ?? "").includes("validate-motion-blueprint.mjs")) {
          fail(`${runPath}.validatorEvidencePath must record the bundled validator with exit code 0.`);
        } else {
          validateEvidenceTimeRange(validatorEvidence, `${runPath}.validatorEvidencePath`);
          if (blueprintArtifact && validatorEvidence.blueprintSha256 !== sha256(fs.readFileSync(blueprintArtifact))) {
            fail(`${runPath}.validatorEvidencePath Blueprint hash does not match.`);
          }
        }
        if (candidateArtifact) {
          const candidateText = readText(candidateArtifact);
          for (const pattern of [/^title:\s*[^\s].+$/m, /^status:\s*["']?candidate["']?$/m, /^level:\s*["']?primitive-candidate["']?$/m, /^locale:\s*["']?en["']?$/m, /^owner:\s*[^\s].+$/m, /^## Product need$/m, /^## Classification$/m, /^## Motion Blueprint$/m, /^## Product scenes$/m, /^## Portable implementation$/m, /^## Quality evidence$/m]) {
            if (!pattern.test(candidateText)) fail(`${runPath}.candidatePath is missing required finished candidate structure: ${pattern}.`);
          }
          for (const field of ["Original request", "User-visible event", "Why this scene deserves a reusable pattern", "Level", "Closest existing foundations", "Closest existing Product Moments", "Distinction", "Source artifact", "Markup and product state", "Animated properties", "Interruption policy", "Reduced motion", "Focus, keyboard, and status"]) {
            const fieldPattern = field === "Source artifact" ? "Source artifacts?" : field;
            if (!new RegExp(`\\*\\*${fieldPattern}:\\*\\*\\s+\\S`).test(candidateText)) fail(`${runPath}.candidatePath has an incomplete ${field} field.`);
          }
          const productSceneSection = candidateText.split(/^## Product scenes$/m)[1]?.split(/^## /m)[0] ?? "";
          const productSceneRows = productSceneSection.split("\n").filter((line) => {
            if (!/^\s*\|/.test(line) || /^\s*\|\s*(?:---|Scene\s*\|)/i.test(line)) return false;
            return line.split("|").slice(1, -1).some((cell) => cell.trim().length > 0);
          });
          if (productSceneRows.length !== 3 || productSceneRows.some((row) => {
            const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
            return cells.length !== 5 || cells.some((cell) => cell.length === 0);
          })) {
            fail(`${runPath}.candidatePath needs exactly three complete product-scene data rows.`);
          }
          const portableSection = candidateText.split(/^## Portable implementation$/m)[1]?.split(/^## /m)[0] ?? "";
          const portableFences = [...portableSection.matchAll(/```(?:tsx|jsx|typescript|javascript|js|html|css)\s*\n([\s\S]*?)\n```/gi)].map((match) => match[1].trimEnd());
          const portableLinks = [...portableSection.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
          const portableLinkBasenames = new Set(portableLinks.map((link) => path.basename(link)));
          const portableCodePaths = [...portableSection.matchAll(/`([^`\n]+\.(?:html|css|js))`/gi)].map((match) => match[1]).filter((reference) => !portableLinkBasenames.has(reference));
          const portableReferences = [...new Set([...portableLinks, ...portableCodePaths])];
          if (portableFences.length === 0 && portableReferences.length === 0) {
            fail(`${runPath}.candidatePath must include fenced portable source or portable source artifact references.`);
          }
          const portableArtifacts = contributeBuildEvidence?.portableArtifacts;
          if (!Array.isArray(portableArtifacts) || portableArtifacts.length < 1) {
            fail(`${runPath}.buildEvidencePath must bind the Contribute portable source into dist.`);
          } else if (!contributeSourceArtifact || !contributeDistArtifact || !candidateArtifact || !isInside(contributeSourceArtifact, candidateArtifact)) {
            fail(`${runPath}.candidatePath and portable source must stay inside the preserved source tree.`);
          } else {
            const sourceExtensions = new Set();
            const boundSourcePaths = new Set();
            for (const [portableIndex, portable] of portableArtifacts.entries()) {
              const sourceRelativePath = portable?.sourcePath;
              const distRelativePath = portable?.distPath;
              const sourcePath = typeof sourceRelativePath === "string" ? path.resolve(contributeSourceArtifact, sourceRelativePath) : null;
              const distPath = typeof distRelativePath === "string" ? path.resolve(contributeDistArtifact, distRelativePath) : null;
              if (!sourcePath || !distPath || !isInside(contributeSourceArtifact, sourcePath) || !isInside(contributeDistArtifact, distPath)) {
                fail(`${runPath}.buildEvidencePath portableArtifacts[${portableIndex}] must use safe source/dist-relative paths.`);
                continue;
              }
              if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile() || !fs.existsSync(distPath) || !fs.statSync(distPath).isFile()) {
                fail(`${runPath}.buildEvidencePath portableArtifacts[${portableIndex}] source or dist file is missing.`);
                continue;
              }
              const sourceHash = sha256(fs.readFileSync(sourcePath));
              const distHash = sha256(fs.readFileSync(distPath));
              if (portable.sourceSha256 !== sourceHash || portable.distSha256 !== distHash || sourceHash !== distHash) {
                fail(`${runPath}.buildEvidencePath portableArtifacts[${portableIndex}] must bind byte-identical copied portable source and dist files.`);
              }
              boundSourcePaths.add(sourcePath);
              sourceExtensions.add(path.extname(sourcePath).toLowerCase());
            }
            let portableReferenceDirectory = path.dirname(candidateArtifact);
            for (const link of portableReferences) {
              const candidates = [
                path.resolve(path.dirname(candidateArtifact), link),
                path.resolve(contributeSourceArtifact, link),
                path.resolve(portableReferenceDirectory, link)
              ].filter((candidatePath, candidateIndex, all) => all.indexOf(candidatePath) === candidateIndex);
              const linkedPath = candidates.find((candidatePath) => isInside(contributeSourceArtifact, candidatePath) && boundSourcePaths.has(candidatePath));
              if (!linkedPath) {
                fail(`${runPath}.candidatePath portable reference ${link} is not bound to preserved source and dist.`);
              } else {
                portableReferenceDirectory = path.dirname(linkedPath);
              }
            }
            if (portableFences.length > 0) {
              const boundContents = new Set([...boundSourcePaths].map((filePath) => readText(filePath).trimEnd()));
              if (!portableFences.some((source) => boundContents.has(source))) {
                fail(`${runPath}.candidatePath fenced portable source must match a source/dist-bound file.`);
              }
            }
            for (const extension of [".html", ".css", ".js"]) {
              if (!sourceExtensions.has(extension)) fail(`${runPath}.buildEvidencePath portableArtifacts needs a copied ${extension} file.`);
            }
          }
          const qualitySection = candidateText.split(/^## Quality evidence$/m)[1] ?? "";
          const qualityRows = qualitySection.split("\n").filter((line) => /^\| (?!---|Check )/.test(line));
          if (qualityRows.length < 8 || qualityRows.some((row) => row.split("|").slice(1, -1).some((cell) => cell.trim().length === 0))) {
            fail(`${runPath}.candidatePath must complete every quality-evidence command, artifact, observation, and status cell.`);
          }
          const embeddedBlueprint = candidateText.match(/```json\s*\n([\s\S]*?)\n```/);
          if (!embeddedBlueprint || !blueprintArtifact || embeddedBlueprint[1] !== readText(blueprintArtifact).trimEnd()) {
            fail(`${runPath}.candidatePath Blueprint must match blueprint.json byte-for-byte.`);
          }
          const candidateTemplateText = readText(path.join(skillDirectory, "assets", "candidate-template.md"));
          const templatePlaceholders = [...new Set(candidateTemplateText.match(/<[^>\n]+>/g) ?? [])].sort();
          const remainingPlaceholders = templatePlaceholders.filter((placeholder) => candidateText.includes(placeholder));
          if (remainingPlaceholders.length !== 0) fail(`${runPath}.candidatePath still contains template placeholders: ${remainingPlaceholders.join(", ")}.`);
          const placeholderScan = placeholderScanArtifact ? readJsonArtifact(placeholderScanArtifact, `${runPath}.placeholderScanPath`) : null;
          if (!placeholderScan || placeholderScan.placeholderCount !== remainingPlaceholders.length || JSON.stringify(placeholderScan.placeholders) !== JSON.stringify(templatePlaceholders) || JSON.stringify(placeholderScan.remaining) !== JSON.stringify(remainingPlaceholders) || placeholderScan.templateSha256 !== sha256(candidateTemplateText) || placeholderScan.candidateSha256 !== sha256(fs.readFileSync(candidateArtifact)) || typeof placeholderScan.command !== "string") {
            fail(`${runPath}.placeholderScanPath must prove zero placeholders for candidate.md.`);
          }
        }
      } else {
        for (const field of ["blueprintPath", "validatorEvidencePath", "candidatePath", "placeholderScanPath", "validatorExitCode"]) {
          if (run[field] !== null) fail(`${runPath}.${field} must be null outside Compose and Contribute.`);
        }
        for (const field of ["blueprint", "validatorEvidence", "candidate", "placeholderScan"]) {
          if (hashes?.[field] !== null) fail(`${runPath}.artifactSha256.${field} must be null outside Compose and Contribute.`);
        }
      }
      if (fixture.mode === "contribute") {
        if (initialFixtureManifest?.id !== fixture.fixture?.id || initialFixtureManifest?.treeSha256 !== fixture.fixture?.treeSha256 || initialFixtureManifest?.fileCount !== fixture.fixture?.fileCount) {
          fail(`${runPath} Contribute did not start from its bound fixture.`);
        }
      } else if (initialFixtureManifest?.id !== "empty" || initialFixtureManifest?.fileCount !== 0 || initialFixtureManifest?.treeSha256 !== sha256("")) {
        fail(`${runPath} case must start from the declared empty fixture.`);
      }
    }

    const expectedAssertions = [
      ...testCase.critical.map((id) => ({ id, critical: true })),
      ...fixture.assertions.map((_, assertionIndex) => ({ id: `eval-${assertionIndex + 1}`, critical: false }))
    ];
    if (!Array.isArray(run.assertions) || run.assertions.length !== expectedAssertions.length) {
      fail(`${runPath}.assertions needs every critical and eval assertion exactly once.`);
      continue;
    }
    for (const expected of expectedAssertions) {
      const matches = run.assertions.filter((assertion) => assertion?.id === expected.id);
      if (matches.length !== 1 || matches[0].critical !== expected.critical) {
        fail(`${runPath}.assertions needs exactly one correctly classified ${expected.id}.`);
      }
    }
    for (const [assertionIndex, assertion] of run.assertions.entries()) {
      if (![0, 1].includes(assertion?.score)) fail(`${runPath}.assertions[${assertionIndex}].score needs 0 or 1.`);
      const evidence = assertion?.evidence;
      if (!evidence || typeof evidence.note !== "string" || evidence.note.trim().length < 3) fail(`${runPath}.assertions[${assertionIndex}].evidence needs a specific note.`);
      const evidenceArtifact = resolveRepositoryEvidencePath(evidence?.artifactPath, evidenceRoot, `${runPath}.assertions[${assertionIndex}].evidence.artifactPath`);
      if (!uniqueArtifactPaths.has(evidence?.artifactPath)) fail(`${runPath}.assertions[${assertionIndex}] evidence artifact must be listed in artifactPaths.`);
      if (!evidenceArtifact || !fs.existsSync(evidenceArtifact) || !fs.statSync(evidenceArtifact).isFile()) {
        fail(`${runPath}.assertions[${assertionIndex}] evidence artifact is missing.`);
      } else if (/^lines:(\d+)(?:-(\d+))?$/.test(evidence.locator ?? "")) {
        const [, startText, endText] = evidence.locator.match(/^lines:(\d+)(?:-(\d+))?$/);
        const start = Number(startText);
        const end = Number(endText ?? startText);
        const lineCount = readText(evidenceArtifact).split(/\r?\n/).length;
        if (start < 1 || end < start || end > lineCount) fail(`${runPath}.assertions[${assertionIndex}] evidence line locator is out of range.`);
      } else if (typeof evidence.locator === "string" && evidence.locator.startsWith("json:")) {
        const artifactJson = readJsonArtifact(evidenceArtifact, `${runPath}.assertions[${assertionIndex}] evidence artifact`);
        if (artifactJson && !resolveJsonPointer(artifactJson, evidence.locator.slice(5)).found) fail(`${runPath}.assertions[${assertionIndex}] evidence JSON pointer does not exist.`);
      } else {
        fail(`${runPath}.assertions[${assertionIndex}] evidence locator must be a text line range or JSON pointer.`);
      }
    }

    const runCritical = run.assertions.filter((assertion) => assertion.critical);
    const runCriticalPassed = runCritical.filter((assertion) => assertion.score === 1).length;
    const runAssertionsPassed = run.assertions.filter((assertion) => assertion.score === 1).length;
    const computedPassed = runCriticalPassed === runCritical.length && runAssertionsPassed / run.assertions.length >= 0.9;
    if (run.passed !== computedPassed) fail(`${runPath}.passed does not follow the scoring rule.`);
    if (run.passed) passingRepetitionsByCase.set(run.evalId, passingRepetitionsByCase.get(run.evalId) + 1);
    criticalPassed += runCriticalPassed;
    criticalTotal += runCritical.length;
    assertionsPassed += runAssertionsPassed;
    assertionsTotal += run.assertions.length;
  }

  for (const evalId of caseById.keys()) {
    for (let repetition = 1; repetition <= 3; repetition += 1) {
      if (!runKeys.has(`${evalId}#${repetition}`)) fail(`Recorded fresh-context result is missing ${evalId} repetition ${repetition}.`);
    }
  }

  const casesPassingAllThreeRepetitions = [...passingRepetitionsByCase.values()].filter((count) => count === 3).length;
  const overallPassRate = assertionsTotal === 0 ? 0 : assertionsPassed / assertionsTotal;
  const computedSummary = {
    cleanRuns: expectedRunTotal,
    criticalPassed,
    criticalTotal,
    assertionsPassed,
    assertionsTotal,
    overallPassRate,
    casesPassingAllThreeRepetitions,
    casesTotal: caseById.size,
    passed: casesPassingAllThreeRepetitions === caseById.size && criticalPassed === criticalTotal && overallPassRate >= contract.scoring.overallPassRate
  };
  for (const [field, expected] of Object.entries(computedSummary)) {
    if (result.summary?.[field] !== expected) fail(`Recorded fresh-context summary.${field} should equal ${expected}.`);
  }
  if (!computedSummary.passed) fail("Recorded fresh-context status requires all 36 runs to pass the contract.");
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
    executeBundledBlueprintValidator(blueprintPath, blueprintPath);
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
  const forwardContract = JSON.parse(readText(path.join(skillDirectory, "evals", "forward-test-contract.json")));
  const forwardStatus = forwardContract.status === "recorded"
    ? `The recorded ${forwardContract.cases.length * forwardContract.runRequirements.repetitionsPerCase}-run model forward-test result is complete and valid.`
    : "No model forward-test result is claimed.";
  console.log(`Motion Lexicon Skill validation passed: ${evalSuite.evals.length} task fixtures, ${triggerSuite.length} trigger fixtures, the Blueprint schema, generated page system, and fresh-context scoring contract are structurally valid. ${forwardStatus}`);
}
