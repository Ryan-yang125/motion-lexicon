/* global console, process */

import Ajv2020 from "ajv/dist/2020.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
// The bundled entrypoint lives in <installed-skill>/scripts/.
const skillDirectory = path.resolve(scriptDirectory, "..");
const schemaPath = path.join(skillDirectory, "assets", "motion-blueprint.schema.json");
const defaultBlueprintPath = path.join(skillDirectory, "assets", "example-motion-blueprint.json");
const providedPath = process.argv[2];
const blueprintPath = providedPath ? path.resolve(process.cwd(), providedPath) : defaultBlueprintPath;
const issues = [];

const addIssue = (message) => issues.push(message);

const readJson = (filePath, label) => {
  try {
    return { ok: true, value: JSON.parse(fs.readFileSync(filePath, "utf8")) };
  } catch (error) {
    addIssue(`${label} JSON is unavailable or invalid: ${error.message}`);
    return { ok: false };
  }
};

const decodeJsonPointerSegment = (segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~");

const formatInstancePath = (instancePath) => {
  if (!instancePath) return "blueprint";

  return instancePath
    .split("/")
    .slice(1)
    .map(decodeJsonPointerSegment)
    .reduce(
      (label, segment) => (Number.isInteger(Number(segment)) && String(Number(segment)) === segment
        ? `${label}[${segment}]`
        : `${label}.${segment}`),
      "blueprint"
    );
};

const formatSchemaError = (error) => {
  const instancePath = formatInstancePath(error.instancePath);

  if (error.keyword === "required") {
    return `${instancePath}.${error.params.missingProperty} is required.`;
  }

  if (error.keyword === "additionalProperties") {
    return `${instancePath}.${error.params.additionalProperty} is not allowed.`;
  }

  return `${instancePath} ${error.message ?? "is invalid"}.`;
};

const validateUniqueIds = (items, pathLabel) => {
  if (!Array.isArray(items)) return new Set();

  const ids = new Set();
  for (const [index, item] of items.entries()) {
    const id = item?.id;
    if (typeof id !== "string") continue;
    if (ids.has(id)) addIssue(`${pathLabel}[${index}].id must be unique; "${id}" is already declared.`);
    ids.add(id);
  }
  return ids;
};

const validateBlueprintReferences = (blueprint) => {
  if (!blueprint || typeof blueprint !== "object" || Array.isArray(blueprint)) return;

  const stateGraph = blueprint.stateGraph;
  if (stateGraph && typeof stateGraph === "object" && !Array.isArray(stateGraph)) {
    const stateIds = validateUniqueIds(stateGraph.states, "blueprint.stateGraph.states");
    if (Array.isArray(stateGraph.states) && Array.isArray(stateGraph.transitions)) {
      if (!stateIds.has(stateGraph.initial)) {
        addIssue("blueprint.stateGraph.initial must reference a declared state.");
      }

      for (const [index, transition] of stateGraph.transitions.entries()) {
        if (!transition || typeof transition !== "object" || Array.isArray(transition)) continue;

        if (!stateIds.has(transition.from)) {
          addIssue(`blueprint.stateGraph.transitions[${index}].from must reference a declared state.`);
        }

        if (!stateIds.has(transition.to)) {
          addIssue(`blueprint.stateGraph.transitions[${index}].to must reference a declared state.`);
        }
      }
    }
  }

  const actorIds = validateUniqueIds(blueprint.actors, "blueprint.actors");
  validateUniqueIds(blueprint.beats, "blueprint.beats");
  if (Array.isArray(blueprint.beats)) {
    for (const [index, beat] of blueprint.beats.entries()) {
      if (!beat || typeof beat !== "object" || Array.isArray(beat)) continue;
      if (!actorIds.has(beat.actor)) {
        addIssue(`blueprint.beats[${index}].actor must reference a declared actor.`);
      }
    }
  }
};

const schemaResult = readJson(schemaPath, "Motion Blueprint schema");
const blueprintResult = readJson(blueprintPath, "Blueprint");

if (schemaResult.ok && blueprintResult.ok) {
  try {
    const validator = new Ajv2020({ allErrors: true }).compile(schemaResult.value);
    const schemaValid = validator(blueprintResult.value);

    if (!schemaValid) {
      for (const error of validator.errors ?? []) {
        addIssue(formatSchemaError(error));
      }
    } else {
      validateBlueprintReferences(blueprintResult.value);
    }
  } catch (error) {
    addIssue(`Motion Blueprint schema could not be compiled: ${error.message}`);
  }
}

if (issues.length > 0) {
  console.error("Motion Blueprint validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`Motion Blueprint validation passed: ${blueprintPath}`);
}
