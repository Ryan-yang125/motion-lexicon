// @vitest-environment node

import { readFileSync } from "node:fs";
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
  const source = (id: string) => readFileSync(`src/registry/primitives/${id}.tsx`, "utf8");
  const demo = (id: string) => readFileSync(`src/registry/primitive-demos/${id}-demo.tsx`, "utf8");

  it("ships one typed primitive and one real demo for every installable entry", async () => {
    for (const entry of installablePrimitiveEntries) {
      const implementation = source(entry.id);
      const scene = demo(entry.id);
      expect(implementation, entry.id).toContain(`export function ${entry.exportName}`);
      expect(implementation, entry.id).toContain('from "motion/react"');
      expect(implementation, entry.id).toContain("useReducedMotion");
      expect(implementation, entry.id).not.toContain("transition: all");
      expect(implementation, entry.id).not.toMatch(/scale\(0\)(?!\.)/);
      expect(scene, entry.id).toContain(`@/registry/primitives/${entry.id}`);
      await expect(transform(implementation, { loader: "tsx", jsx: "automatic", target: "es2022" }), entry.id).resolves.toBeTruthy();
    }
  });

  it("connects every public parameter to its real demo", () => {
    const missing: string[] = [];
    for (const entry of installablePrimitiveEntries) {
      const scene = demo(entry.id);
      for (const param of entry.recipe.params) {
        if (!scene.includes(`"${param.id}"`)) missing.push(`${entry.id}.${param.id}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("exports interaction semantics for direct-manipulation primitives", () => {
    expect(source("drag-to-reorder")).toContain("<Reorder.Group");
    expect(source("drag-to-reorder")).toContain("onReorder={onReorder}");
    expect(source("scroll-reveal")).toContain("whileInView");
    expect(source("stagger")).toContain("staggerChildren");
    expect(source("accordion-collapse")).toContain("AnimatePresence");
    expect(source("line-drawing")).toContain("pathLength");
  });

  it("preserves the complete behavior contract of stateful primitives", () => {
    const hold = source("hold-to-confirm");
    expect(hold).toContain("onConfirm: () => void");
    expect(hold).toContain("animate(progress, 1");
    expect(hold).toContain("duration: duration * (1 - current)");
    expect(hold).not.toContain("reduceMotion ? 0.25");
    expect(hold).toContain("onPointerCancel={cancel}");
    expect(hold).toContain("onKeyDown");

    const dismiss = source("swipe-to-dismiss");
    expect(dismiss).toContain("onDismiss?: () => void");
    expect(dismiss).toContain("Math.abs(info.offset.x) >= threshold");
    expect(dismiss).toContain('drag="x"');
    expect(dismiss).toContain("exit={reduceMotion");
    expect(dismiss).toContain("onDragEnd={finish}");

    const scroll = source("scroll-driven-animation");
    expect(scroll).toContain("useScroll");
    expect(scroll).toContain("useTransform(scrollYProgress, [from, to], [distance, -distance])");
    expect(scroll).toContain("translate3d");

    const loop = source("loop");
    expect(loop).toContain("repeat: infinite ? Infinity");
    expect(loop).toContain('direction === "alternate" ? "reverse" : "loop"');

    const shimmer = source("skeleton-shimmer");
    expect(shimmer).toContain("repeat: reduceMotion ? 0 : Infinity");
  });

  it("keeps specialized primitives faithful to their behavior", () => {
    expect(source("ripple")).toContain("event.clientX - rect.left");
    expect(source("ripple")).toContain("onPointerDown={(event)");

    const parallax = source("parallax");
    expect(parallax).toContain("useScroll");
    expect(parallax).toContain("[range, -range]");
    expect(parallax).toContain("translate3d");

    const ticker = source("number-ticker");
    expect(ticker).toContain("value: number");
    expect(ticker).toContain("key={value}");
    expect(ticker).toContain("aria-live=\"polite\"");

    expect(source("marquee")).not.toContain('<motion.div aria-hidden="true"');
    expect(source("marquee")).toContain('<span aria-hidden="true"');
    expect(source("slide-in")).toContain("function offset");
    expect(source("slide-in")).toContain('direction === "out"');

    const compare = source("before-after-slider");
    expect(compare).toContain('type="range"');
    expect(compare).toContain("clipPath");
    expect(compare).toContain("initialPosition = 50");
    expect(compare).toContain("}, [initialPosition])");

    const flip = source("3d-tilt-flip");
    expect(flip).toContain('animate={{ transform: flipped ? `rotateY(${angle}deg)` : "rotateY(0deg)" }}');
    expect(flip).toContain("transition={reduceMotion ? { duration: 0 }");

    const typewriter = source("typewriter");
    expect(typewriter).toContain("window.setInterval");
    expect(typewriter).toContain("text.slice(0, characters ?? text.length)");
    expect(typewriter).toContain("caret ?");

    expect(source("origin-aware-animation")).toContain('"top-left": "top left"');
    expect(source("easing")).toContain("custom: [0.25, 0.9, 0.3, 1]");
    expect(source("easing")).toContain("calm: [0.33, 1, 0.68, 1]");
  });
});
