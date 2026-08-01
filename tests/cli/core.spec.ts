import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  catalog,
  exportRecipe,
  getSchema,
  list,
  packs,
  recommend,
  resolveRecipe,
  runCli,
  search,
  showPack,
  show,
  version,
  writeRecipeFiles
} from "motion-lexicon";

describe("Motion Lexicon CLI API", () => {
  it("reports the v1.2.0 CLI release version", () => {
    expect(version).toBe("1.2.0");
  });

  it("lists real product Motion Packs with a portable implementation", () => {
    const result = packs({ locale: "zh" });
    expect(result).toMatchObject({ schemaVersion: 1, count: 28 });
    expect(result.items[0]).toMatchObject({
      id: "save-confirmation",
      name: "保存确认",
      previewUrl: "https://motion-lexicon.pages.dev/zh/packs/save-confirmation/"
    });
    const archiveUndo = showPack("archive-undo", { locale: "en" });
    expect(archiveUndo).toMatchObject({
      id: "archive-undo",
      name: "Archive undo",
      guidance: { reducedMotion: expect.any(String) },
      source: { html: expect.any(String), css: expect.any(String), js: expect.any(String) }
    });
    expect(archiveUndo.foundations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          role: expect.any(String),
          note: expect.any(String),
          previewUrl: expect.stringContaining("/en/")
        })
      ])
    );
    expect(result.items.map((item) => item.id)).toEqual(
      expect.arrayContaining([
        "upload-complete",
        "sync-recovery",
        "delete-confirmation",
        "assignee-picker",
        "permission-change",
        "search-suggestions",
        "kanban-move",
        "cart-update",
        "comment-reply",
        "approval-request",
        "checkout-payment",
        "scheduled-publish"
      ])
    );
  });

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

  it("provides list as a stable Motion Primitives entry alongside catalog", () => {
    const listed = list({ locale: "en" });
    const cataloged = catalog({ locale: "en" });

    expect(listed).toEqual(cataloged);
    expect(listed).toMatchObject({ count: 44 });
    expect(listed.items.find((item) => item.id === "press-tap-feedback")?.productMoments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "save-confirmation", role: "input-feedback" })
      ])
    );
  });

  it("searches canonical names and aliases in Chinese and English", () => {
    expect(search("弹簧", { locale: "zh" }).items[0].id).toBe("spring");
    expect(search("pop-in", { locale: "en" }).items[0].id).toBe("scale-in");
    expect(search("shared element", { locale: "en" }).items[0].id).toBe("morph");
  });

  it("recommends three explainable variants with shareable finder links", () => {
    const result = recommend("卡片弹出来要有重量、最后收得住", {
      locale: "zh"
    });
    expect(result).toMatchObject({
      schemaVersion: 1,
      groupId: "entrance-feel",
      confidence: "high",
      count: 3
    });
    expect(result.items.map((item) => item.variantId)).toEqual([
      "spring",
      "pop-in",
      "scale-in"
    ]);
    expect(result.compareUrl).toContain("/zh/finder/?q=");
    expect(result.compareUrl).toContain("compare=spring%2Cpop-in%2Cscale-in");
    expect(getSchema("recommend")).toMatchObject({
      schemaVersion: 1,
      title: "Motion Lexicon recommend schema"
    });
  });

  it("keeps the full comparison trio in Finder links when --limit trims CLI items", () => {
    for (const limit of [1, 2] as const) {
      const result = recommend("卡片弹出来要有重量、最后收得住", {
        locale: "zh",
        limit
      });
      const compare = new URL(result.compareUrl).searchParams.get("compare");

      expect(result.count).toBe(limit);
      expect(result.items).toHaveLength(limit);
      expect(compare).toBe("spring,pop-in,scale-in");
    }
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

  it("prints Motion Pack listings and portable bundles", async () => {
    const listing = capture();
    expect(await runCli(["packs", "--locale", "en", "--format", "json"], listing.io)).toBe(0);
    expect(JSON.parse(listing.stdout())).toMatchObject({ count: 28 });

    const bundle = capture();
    expect(
      await runCli(["pack", "save-confirmation", "--locale", "en", "--format", "bundle"], bundle.io)
    ).toBe(0);
    expect(bundle.stdout()).toContain("/* Prompt */");
    expect(bundle.stdout()).toContain("<!-- HTML -->");
  });

  it("lists Motion Primitives through the list command", async () => {
    const output = capture();
    expect(await runCli(["list", "--locale", "zh", "--format", "json"], output.io)).toBe(0);

    const result = JSON.parse(output.stdout());
    expect(result).toMatchObject({ count: 44 });
    expect(result.items).toHaveLength(44);
    const pressFeedback = result.items.find(
      (item: { id: string }) => item.id === "press-tap-feedback"
    );
    expect(pressFeedback.productMoments).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "save-confirmation" })])
    );
    expect(output.stderr()).toBe("");
  });

  it("prints machine-readable recommendations", async () => {
    const output = capture();
    expect(
      await runCli(
        ["recommend", "same thumbnail expands into detail", "--format", "json"],
        output.io
      )
    ).toBe(0);
    const result = JSON.parse(output.stdout());
    expect(result).toMatchObject({
      groupId: "state-continuity",
      count: 3
    });
    expect(result.items[0]).toMatchObject({
      variantId: "shared-element-transition",
      canonicalId: "morph"
    });
    expect(output.stderr()).toBe("");
  });

  it("keeps a Top 3 web comparison when --limit reduces JSON items", async () => {
    const output = capture();
    expect(
      await runCli(
        ["recommend", "card enters with weight", "--limit", "1", "--format", "json"],
        output.io
      )
    ).toBe(0);
    const result = JSON.parse(output.stdout());
    const compare = new URL(result.compareUrl).searchParams.get("compare");

    expect(result.count).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(compare?.split(",")).toHaveLength(3);
    expect(output.stderr()).toBe("");
  });

  it("writes validation errors to stderr and exits with code 2", async () => {
    const output = capture();
    expect(await runCli(["export", "slide-in", "-p", "duration=261"], output.io)).toBe(2);
    expect(output.stdout()).toBe("");
    expect(output.stderr()).toMatch(/Error:.*step of 20/);
  });
});
