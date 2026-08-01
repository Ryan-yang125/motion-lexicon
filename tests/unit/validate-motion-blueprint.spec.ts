import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

type Blueprint = Record<string, unknown>;

const repositoryRoot = process.cwd();
const validatorPath = path.join(repositoryRoot, "skills/motion-lexicon/scripts/validate-motion-blueprint.mjs");
const examplePath = path.join(repositoryRoot, "skills/motion-lexicon/assets/example-motion-blueprint.json");
const exampleBlueprint = JSON.parse(readFileSync(examplePath, "utf8")) as Blueprint;

const cloneBlueprint = () => JSON.parse(JSON.stringify(exampleBlueprint)) as Blueprint;

const validate = (blueprint: unknown) => {
  const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), "motion-blueprint-validation-"));
  const blueprintPath = path.join(temporaryDirectory, "blueprint.json");
  writeFileSync(blueprintPath, JSON.stringify(blueprint));

  try {
    return spawnSync(process.execPath, [validatorPath, blueprintPath], {
      cwd: repositoryRoot,
      encoding: "utf8"
    });
  } finally {
    rmSync(temporaryDirectory, { force: true, recursive: true });
  }
};

describe("Motion Blueprint schema validator", () => {
  it("accepts the bundled schema-valid example", () => {
    const result = spawnSync(process.execPath, [validatorPath], {
      cwd: repositoryRoot,
      encoding: "utf8"
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Motion Blueprint validation passed:");
  });

  it.each([
    [
      "a field with the wrong scalar type",
      (blueprint: Blueprint) => {
        ((blueprint.beats as Blueprint[])[0]).durationMs = "forever";
      },
      "blueprint.beats[0].durationMs must be integer."
    ],
    [
      "an unknown beat purpose",
      (blueprint: Blueprint) => {
        ((blueprint.beats as Blueprint[])[0]).purpose = "decorate";
      },
      "blueprint.beats[0].purpose must be equal to one of the allowed values."
    ],
    [
      "an unsupported animated property",
      (blueprint: Blueprint) => {
        ((blueprint.beats as Blueprint[])[0]).properties = ["width"];
      },
      "blueprint.beats[0].properties[0] must be equal to one of the allowed values."
    ],
    [
      "an unsupported delivery format",
      (blueprint: Blueprint) => {
        (blueprint.delivery as Blueprint).formats = ["gif"];
      },
      "blueprint.delivery.formats[0] must be equal to one of the allowed values."
    ],
    [
      "an unknown root property",
      (blueprint: Blueprint) => {
        blueprint.unexpected = true;
      },
      "blueprint.unexpected is not allowed."
    ],
    [
      "an unknown nested property",
      (blueprint: Blueprint) => {
        (blueprint.intent as Blueprint).extraDetail = "unexpected";
      },
      "blueprint.intent.extraDetail is not allowed."
    ],
    [
      "a missing required nested property",
      (blueprint: Blueprint) => {
        delete (blueprint.accessibility as Blueprint).keyboard;
      },
      "blueprint.accessibility.keyboard is required."
    ]
  ])("rejects %s", (_description, makeInvalid, expectedIssue) => {
    const blueprint = cloneBlueprint();
    makeInvalid(blueprint);

    const result = validate(blueprint);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Motion Blueprint validation failed:");
    expect(result.stderr).toContain(expectedIssue);
  });
});
