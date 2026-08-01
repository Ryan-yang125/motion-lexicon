/* global console, process */

import Ajv2020 from "ajv/dist/2020.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
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

const schemaResult = readJson(schemaPath, "Motion Blueprint schema");
const blueprintResult = readJson(blueprintPath, "Blueprint");

if (schemaResult.ok && blueprintResult.ok) {
  try {
    const validator = new Ajv2020({ allErrors: true }).compile(schemaResult.value);

    if (!validator(blueprintResult.value)) {
      for (const error of validator.errors ?? []) {
        addIssue(formatSchemaError(error));
      }
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
