import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalog,
  exportRecipe,
  resolveRecipe,
  runCli,
  search,
  show,
  writeRecipeFiles
} from "motion-lexicon";

describe("Motion Lexicon CLI API", () => {
  it("returns the 44 canonical recipes with schema version 1", () => {
    const result = catalog({ locale: "zh" });
    expect(result.schemaVersion).toBe(1);
    expect(result.count).toBe(44);
    expect(result.items[0]).toMatchObject({
      id: "fade-in-fade-out",
      name: "淡入 / 淡出",
      previewUrl: "https://motion-lexicon.pages.dev/zh/entrances/fade-in-fade-out/"
    });
  });

  it("searches canonical names and aliases in Chinese and English", () => {
    expect(search("弹簧", { locale: "zh" }).items[0].id).toBe("spring");
    expect(search("pop-in", { locale: "en" }).items[0].id).toBe("scale-in");
    expect(search("shared element", { locale: "en" }).items[0].id).toBe("morph");
  });

  it("resolves aliases and preserves their preset values", () => {
    const resolved = resolveRecipe("pop-in");
    expect(resolved).toMatchObject({
      canonicalId: "scale-in",
      alias: "pop-in",
      presetQuery: "scale=86&overshoot=true",
      presetValues: { scale: 86, overshoot: true }
    });
    expect(show("pop-in", { locale: "zh" })).toMatchObject({
      id: "scale-in",
      values: { scale: 86, overshoot: true },
      query: "scale=86&overshoot=true",
      previewUrl: "https://motion-lexicon.pages.dev/zh/entrances/scale-in/?scale=86&overshoot=true"
    });
    expect(show("fill-mode").query).toBe("fill=both");
  });

  it("strictly validates range, enum, toggle, and unknown parameters", () => {
    expect(() => exportRecipe("slide-in", { params: { duration: 261 } })).toThrow(/step of 20/);
    expect(() => exportRecipe("slide-in", { params: { direction: "diagonal" } })).toThrow(/must be one of/);
    expect(() => exportRecipe("scale-in", { params: { overshoot: "yes" } })).toThrow(/requires true/);
    expect(() => exportRecipe("slide-in", { params: { speed: 2 } })).toThrow(/Unknown parameter/);
  });

  it("builds every portable export from the same resolved values", () => {
    const result = exportRecipe("slide-in", {
      locale: "en",
      params: { duration: 260, direction: "left" }
    });
    expect(result.schemaVersion).toBe(1);
    expect(result.values).toMatchObject({ duration: 260, direction: "left" });
    expect(result.prompt).toContain("Duration 260ms");
    expect(result.html).toContain('data-motion="slide-in"');
    expect(result.css).toContain("260ms");
    expect(result.bundle).toContain("/* Prompt */");
  });

  it("writes a runnable files export", async () => {
    const root = await mkdtemp(join(tmpdir(), "motion-lexicon-cli-"));
    const output = join(root, "demo");
    const result = await writeRecipeFiles(exportRecipe("ripple"), output);
    expect(result.files.map((file) => file.split("/").at(-1))).toEqual([
      "index.html",
      "styles.css",
      "prompt.md",
      "recipe.json",
      "motion.js"
    ]);
    expect(await readFile(join(output, "index.html"), "utf8")).toContain("./motion.js");
  });
});

describe("runCli", () => {
  function capture() {
    let stdout = "";
    let stderr = "";
    return {
      io: {
        stdout: (value: string) => { stdout += value; },
        stderr: (value: string) => { stderr += value; },
        cwd: () => process.cwd()
      },
      stdout: () => stdout,
      stderr: () => stderr
    };
  }

  it("keeps machine-readable output on stdout", async () => {
    const output = capture();
    expect(await runCli(["show", "pop-in", "--format", "json"], output.io)).toBe(0);
    expect(JSON.parse(output.stdout())).toMatchObject({ schemaVersion: 1, id: "scale-in" });
    expect(output.stderr()).toBe("");
  });

  it("writes validation errors to stderr and exits with code 2", async () => {
    const output = capture();
    expect(await runCli(["export", "slide-in", "-p", "duration=261"], output.io)).toBe(2);
    expect(output.stdout()).toBe("");
    expect(output.stderr()).toMatch(/Error:.*step of 20/);
  });
});
