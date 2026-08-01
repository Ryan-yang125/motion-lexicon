/* global console, process */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const skillDirectory = path.resolve(scriptDirectory, "..");
const defaultBlueprintPath = path.join(skillDirectory, "assets", "example-motion-blueprint.json");
const providedPath = process.argv[2];
const blueprintPath = providedPath ? path.resolve(process.cwd(), providedPath) : defaultBlueprintPath;
const issues = [];

const addIssue = (message) => issues.push(message);
const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

const needFields = (value, fields, label) => {
  if (!isObject(value)) {
    addIssue(`${label} needs an object value.`);
    return;
  }

  for (const field of fields) {
    if (!(field in value)) addIssue(`${label}.${field} is required.`);
  }
};

let blueprint;
try {
  blueprint = JSON.parse(fs.readFileSync(blueprintPath, "utf8"));
} catch (error) {
  addIssue(`Blueprint JSON is unavailable or invalid: ${error.message}`);
}

if (blueprint) {
  needFields(
    blueprint,
    ["version", "locale", "intent", "scope", "stateGraph", "actors", "beats", "accessibility", "delivery", "provenance"],
    "blueprint"
  );

  if (blueprint.version !== "2.0") addIssue("blueprint.version must equal 2.0.");
  if (!["zh", "en"].includes(blueprint.locale)) addIssue("blueprint.locale must equal zh or en.");

  needFields(blueprint.intent, ["productGoal", "userIntent", "feeling"], "blueprint.intent");
  needFields(blueprint.scope, ["surface", "framework", "input"], "blueprint.scope");
  needFields(blueprint.stateGraph, ["initial", "states", "transitions"], "blueprint.stateGraph");
  needFields(blueprint.accessibility, ["reducedMotion", "focus", "aria", "keyboard"], "blueprint.accessibility");
  needFields(blueprint.delivery, ["formats", "integration"], "blueprint.delivery");
  needFields(blueprint.provenance, ["status", "foundations", "moments", "confidence"], "blueprint.provenance");

  if (!Array.isArray(blueprint.actors) || blueprint.actors.length < 1 || blueprint.actors.length > 3) {
    addIssue("blueprint.actors needs one to three actors.");
  } else {
    if (blueprint.actors.filter((actor) => actor?.role === "primary").length !== 1) {
      addIssue("blueprint.actors needs exactly one primary actor.");
    }
    for (const [index, actor] of blueprint.actors.entries()) {
      needFields(actor, ["id", "role", "kind", "element"], `blueprint.actors[${index}]`);
      if (!["primary", "supporting"].includes(actor?.role)) {
        addIssue(`blueprint.actors[${index}].role needs primary or supporting.`);
      }
      if (!["trigger", "hero", "status", "record", "environment"].includes(actor?.kind)) {
        addIssue(`blueprint.actors[${index}].kind needs a documented semantic kind.`);
      }
    }
  }

  if (!Array.isArray(blueprint.beats) || blueprint.beats.length < 1 || blueprint.beats.length > 5) {
    addIssue("blueprint.beats needs one to five focused beats.");
  } else {
    for (const [index, beat] of blueprint.beats.entries()) {
      needFields(
        beat,
        ["id", "at", "actor", "purpose", "primitive", "from", "to", "durationMs", "easing", "properties"],
        `blueprint.beats[${index}]`
      );
      if (!["arrive", "leave", "feedback", "linear", "spring"].includes(beat?.easing)) {
        addIssue(`blueprint.beats[${index}].easing needs a documented easing token.`);
      }
    }
  }

  const stateIds = new Set(blueprint.stateGraph?.states?.map((state) => state?.id));
  if (blueprint.stateGraph?.initial && !stateIds.has(blueprint.stateGraph.initial)) {
    addIssue("blueprint.stateGraph.initial must reference a declared state.");
  }

  for (const [index, transition] of (blueprint.stateGraph?.transitions ?? []).entries()) {
    if (!stateIds.has(transition?.from) || !stateIds.has(transition?.to)) {
      addIssue(`blueprint.stateGraph.transitions[${index}] must connect declared states.`);
    }
  }

  if (!["draft", "candidate", "published"].includes(blueprint.provenance?.status)) {
    addIssue("blueprint.provenance.status needs draft, candidate, or published.");
  }
}

if (issues.length > 0) {
  console.error("Motion Blueprint validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`Motion Blueprint validation passed: ${blueprintPath}`);
}
