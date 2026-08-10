// @vitest-environment node

import { transform } from "esbuild";
import { describe, expect, it } from "vitest";
import {
  aliasMetadata,
  canonicalMotionCatalog,
  catalogRecipes,
  entries,
  getCanonicalRecipe,
  getMotionCatalogMeta,
  seedRecipe
} from "../../src/data/recipes";
import { installablePrimitiveEntries } from "../../src/data/primitive-registry";
import {
  clampToStep,
  getDefaultParamValues,
  parseParamValues,
  valuesToSearchParams
} from "../../src/lib/motion-engine";
import { buildPrimitiveSource } from "../../src/registry/primitive-source";

describe("canonical motion catalog", () => {
  it("publishes 31 motion examples, 9 playgrounds, and 4 guides", () => {
    expect(canonicalMotionCatalog).toHaveLength(44);
    expect(catalogRecipes).toHaveLength(44);
    expect(canonicalMotionCatalog.filter((item) => item.surfaceType === "component")).toHaveLength(31);
    expect(canonicalMotionCatalog.filter((item) => item.surfaceType === "playground")).toHaveLength(9);
    expect(canonicalMotionCatalog.filter((item) => item.surfaceType === "guide")).toHaveLength(4);
    expect(installablePrimitiveEntries).toHaveLength(40);
    expect(aliasMetadata).toHaveLength(47);
  });

  it("maps all 91 vocabulary terms to canonical primitives", () => {
    expect(entries).toHaveLength(91);
    const canonicalIds = new Set(canonicalMotionCatalog.map((item) => item.id));
    for (const entry of entries) {
      const metadata = getMotionCatalogMeta(entry);
      expect(canonicalIds.has(metadata.canonicalId), entry.id).toBe(true);
      expect(metadata.family, entry.id).toBe(entry.family);
      expect(metadata.surfaceType, entry.id).toBe(entry.surfaceType);
      expect(getCanonicalRecipe(entry)?.id, entry.id).toBe(metadata.canonicalId);
    }
  });

  it("keeps useful alias presets", () => {
    expect(aliasMetadata.find((item) => item.entryId === "linear")).toMatchObject({
      canonicalId: "easing",
      query: "ease=linear"
    });
    expect(aliasMetadata.find((item) => item.entryId === "rotate")).toMatchObject({
      canonicalId: "translate",
      query: "transform=rotate"
    });
  });
});

describe("typed primitive parameters", () => {
  it("hydrates, clamps, and serializes shareable props", () => {
    expect(getDefaultParamValues(seedRecipe)).toEqual({
      duration: 240,
      distance: 28,
      direction: "up",
      delay: 0,
      ease: "soft"
    });
    expect(parseParamValues(seedRecipe, new URLSearchParams("duration=9999&distance=19&direction=left&delay=bad&ease=snap"))).toEqual({
      duration: 1200,
      distance: 20,
      direction: "left",
      delay: 0,
      ease: "snap"
    });
    expect(valuesToSearchParams(seedRecipe, { duration: 440, distance: 28, direction: "up", delay: 0, ease: "soft" }, new URLSearchParams("view=code")).toString()).toBe("view=code&duration=440");
    const distance = seedRecipe.params.find((param) => param.id === "distance");
    expect(distance?.kind).toBe("range");
    if (distance?.kind === "range") expect(clampToStep(19, distance)).toBe(20);
  });

  it("keeps every default inside its declared contract", () => {
    for (const entry of entries) {
      for (const param of entry.params) {
        if (param.kind === "range") {
          expect(param.defaultValue, `${entry.id}.${param.id}`).toBeGreaterThanOrEqual(param.min);
          expect(param.defaultValue, `${entry.id}.${param.id}`).toBeLessThanOrEqual(param.max);
        }
        if (param.kind === "segmented") {
          expect(param.options.some((option) => option.value === param.defaultValue), `${entry.id}.${param.id}`).toBe(true);
        }
      }
    }
  });

  it("keeps interface timing concise", () => {
    const longForm = new Set(["hold-to-confirm", "marquee", "orbit", "idle-animation", "line-drawing", "skeleton-shimmer", "typewriter"]);
    for (const entry of catalogRecipes) {
      const duration = entry.params.find((param) => param.id === "duration");
      if (!duration || duration.kind !== "range") continue;
      if (entry.surfaceType === "component" && !longForm.has(entry.id)) {
        expect(duration.defaultValue, entry.id).toBeGreaterThanOrEqual(entry.id === "press-tap-feedback" ? 100 : 150);
        expect(duration.defaultValue, entry.id).toBeLessThanOrEqual(280);
      }
    }
  });
});

describe("React + Motion primitive registry", () => {
  it("builds every installable primitive from typed catalog data", async () => {
    for (const entry of installablePrimitiveEntries) {
      const source = buildPrimitiveSource(entry.recipe, getDefaultParamValues(entry.recipe));
      expect(source, entry.id).toContain(`export function ${entry.exportName}`);
      expect(source, entry.id).toContain('from "motion/react"');
      expect(source, entry.id).toContain("useReducedMotion");
      expect(source, entry.id).not.toContain("transition: all");
      expect(source, entry.id).not.toContain("scale: 0,");
      await expect(transform(source, { loader: "tsx", jsx: "automatic", target: "es2022" }), entry.id).resolves.toBeTruthy();
    }
  });

  it("turns parameter changes into the copied React source", () => {
    const slide = catalogRecipes.find((entry) => entry.id === "slide-in")!;
    const source = buildPrimitiveSource(slide, { ...getDefaultParamValues(slide), duration: 360, distance: 44 });
    expect(source).toContain("x: 44");
    expect(source).toContain("duration: 0.36");

    const spring = catalogRecipes.find((entry) => entry.id === "spring")!;
    const springSource = buildPrimitiveSource(spring, { stiffness: 320, damping: 28, mass: 0.8, velocity: 0, distance: 64 });
    expect(springSource).toContain("stiffness: 320");
    expect(springSource).toContain("damping: 28");
    expect(springSource).toContain("mass: 0.8");
  });

  it("exports interaction semantics for direct-manipulation primitives", () => {
    const source = (id: string) => {
      const entry = catalogRecipes.find((item) => item.id === id)!;
      return buildPrimitiveSource(entry, getDefaultParamValues(entry));
    };
    expect(source("drag-to-reorder")).toContain('drag="x"');
    expect(source("scroll-reveal")).toContain("whileInView");
    expect(source("stagger")).toContain("staggerChildren");
    expect(source("accordion-collapse")).toContain("AnimatePresence");
    expect(source("line-drawing")).toContain("pathLength");
  });

  it("preserves the complete behavior contract of stateful primitives", () => {
    const source = (id: string, values?: Record<string, string | number | boolean>) => {
      const entry = catalogRecipes.find((item) => item.id === id)!;
      return buildPrimitiveSource(entry, values ?? getDefaultParamValues(entry));
    };

    const hold = source("hold-to-confirm");
    expect(hold).toContain("onConfirm: () => void");
    expect(hold).toContain("setTimeout");
    expect(hold).toContain("onPointerCancel={cancelHold}");
    expect(hold).toContain("onKeyDown");

    const dismiss = source("swipe-to-dismiss");
    expect(dismiss).toContain("onDismiss?: () => void");
    expect(dismiss).toContain("Math.abs(info.offset.x) >= threshold");
    expect(dismiss).toContain("onDragEnd={finishDrag}");

    const scroll = source("scroll-driven-animation", { start: 20, end: 75, distance: 120, axis: "x" });
    expect(scroll).toContain("useScroll");
    expect(scroll).toContain("useTransform(scrollYProgress, [0.2, 0.75], [120, -120])");
    expect(scroll).toContain("x: reduceMotion ? 0 : progress");

    const loop = source("loop", { duration: 1600, pause: 240, direction: "alternate", iterations: 4, infinite: false });
    expect(loop).toContain('repeat: 3, repeatType: "reverse", repeatDelay: 0.24');

    const shimmer = source("skeleton-shimmer");
    expect(shimmer).toContain("repeat: Infinity");
    expect(shimmer).toContain('repeatType: "loop"');
  });
});
