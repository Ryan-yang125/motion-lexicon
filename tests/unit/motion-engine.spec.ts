import { describe, expect, it } from "vitest";
import {
  aliasMetadata,
  canonicalMotionCatalog,
  catalogRecipes,
  entries,
  getCanonicalRecipe,
  getMotionCatalogMeta,
  getRecipe,
  seedRecipe
} from "../../src/data/recipes";
import type { MotionRecipe } from "../../src/data/types";
import {
  buildRecipeCss,
  buildRecipeHtml,
  buildRecipeJs,
  buildRecipePrompt,
  clampToStep,
  getDefaultParamValues,
  getRangeParam,
  parseParamValues,
  valuesToSearchParams
} from "../../src/lib/motion-engine";

function recipe(id: string): MotionRecipe {
  const match = entries.find((entry) => entry.id === id);
  if (!match) throw new Error(`Missing test recipe: ${id}`);
  return match;
}

describe("canonical motion catalog", () => {
  it("publishes 31 components, 9 playgrounds, and 4 guides", () => {
    expect(canonicalMotionCatalog).toHaveLength(44);
    expect(catalogRecipes).toHaveLength(44);
    expect(canonicalMotionCatalog.filter((item) => item.surfaceType === "component")).toHaveLength(31);
    expect(canonicalMotionCatalog.filter((item) => item.surfaceType === "playground")).toHaveLength(9);
    expect(canonicalMotionCatalog.filter((item) => item.surfaceType === "guide")).toHaveLength(4);
    expect(aliasMetadata).toHaveLength(47);
  });

  it("maps all 91 inventory terms without orphans", () => {
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

  it("exposes valid alias redirects and useful preset queries", () => {
    const linear = aliasMetadata.find((item) => item.entryId === "linear");
    const rotate = aliasMetadata.find((item) => item.entryId === "rotate");

    expect(linear).toMatchObject({
      canonicalId: "easing",
      canonicalPath: "/easing/easing",
      query: "ease=linear"
    });
    expect(rotate).toMatchObject({
      canonicalId: "translate",
      query: "transform=rotate"
    });
  });
});

describe("semantic parameter contracts", () => {
  it("keeps the slide preset URL contract", () => {
    expect(getDefaultParamValues(seedRecipe)).toEqual({
      duration: 240,
      distance: 28,
      direction: "up",
      delay: 0,
      ease: "soft"
    });

    const values = parseParamValues(
      seedRecipe,
      new URLSearchParams("duration=9999&distance=19&direction=left&delay=bad&ease=snap")
    );
    expect(values).toEqual({
      duration: 1200,
      distance: 20,
      direction: "left",
      delay: 0,
      ease: "snap"
    });
  });

  it("omits defaults, accepts partial values, and preserves unrelated query state", () => {
    const params = valuesToSearchParams(
      seedRecipe,
      { duration: 440, distance: 28, delay: 0, ease: "soft" },
      new URLSearchParams("view=code")
    );
    expect(params.toString()).toBe("view=code&duration=440");
  });

  it("gives easing aliases their real curves", () => {
    expect(getDefaultParamValues(recipe("linear")).ease).toBe("linear");
    expect(getDefaultParamValues(recipe("ease-in")).ease).toBe("ease-in");
    expect(buildRecipeCss(recipe("linear"), getDefaultParamValues(recipe("linear")))).toContain(" 520ms linear infinite alternate");
  });

  it("uses physical spring parameters instead of a cosmetic easing preset", () => {
    const params = recipe("spring").params.map((param) => param.id);
    expect(params).toEqual(["stiffness", "damping", "mass", "velocity", "distance"]);
    expect(params).not.toContain("ease");

    const softValues = {
      stiffness: 100,
      damping: 12,
      mass: 1.8,
      velocity: 0,
      distance: 48
    };
    const firmValues = {
      stiffness: 420,
      damping: 38,
      mass: 0.7,
      velocity: 12,
      distance: 48
    };
    const soft = buildRecipeJs(recipe("spring"), softValues);
    const firm = buildRecipeJs(recipe("spring"), firmValues);
    expect(soft).not.toBe(firm);
    expect(soft).toContain("requestAnimationFrame");
    expect(soft).toContain('"stiffness": 100');
    expect(firm).toContain('"velocity": 12');
    expect(buildRecipeCss(recipe("spring"), softValues)).not.toContain("@keyframes motion-spring {");
  });

  it("gives major families parameters that match their behavior", () => {
    expect(getDefaultParamValues(recipe("rotate"))).toMatchObject({ transform: "rotate", angle: 12, origin: "center" });
    expect(getDefaultParamValues(recipe("transform-origin"))).toMatchObject({ transform: "rotate", origin: "top" });
    expect(getDefaultParamValues(recipe("pop-in"))).toMatchObject({ scale: 86, overshoot: true });
    expect(getDefaultParamValues(recipe("continuity-transition"))).toMatchObject({ mode: "continuity" });
    expect(getDefaultParamValues(recipe("shared-element-transition"))).toMatchObject({ mode: "shared" });
    expect(getDefaultParamValues(recipe("layout-animation"))).toMatchObject({ mode: "layout" });
    expect(getDefaultParamValues(recipe("scroll-driven-animation"))).toEqual({ start: 10, end: 80, distance: 80, axis: "y" });
    expect(getDefaultParamValues(recipe("rubber-banding"))).toMatchObject({ distance: 96, resistance: 65 });
    expect(getDefaultParamValues(recipe("clip-path"))).toMatchObject({ blur: 14, reveal: "clip" });
    expect(recipe("reduced-motion").params).toEqual([]);
  });

  it("keeps every configured default inside its declared contract", () => {
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

  it("ships crisp UI defaults and documents deliberate long-form timing", () => {
    const microInteractions = new Set(["press-tap-feedback"]);
    const longForm = new Set([
      "hold-to-confirm",
      "marquee",
      "orbit",
      "idle-animation",
      "line-drawing",
      "skeleton-shimmer",
      "typewriter"
    ]);

    for (const entry of catalogRecipes) {
      const duration = entry.params.find((param) => param.id === "duration");
      if (!duration || duration.kind !== "range") continue;

      if (entry.surfaceType === "component" && microInteractions.has(entry.id)) {
        expect(duration.defaultValue, entry.id).toBeGreaterThanOrEqual(100);
        expect(duration.defaultValue, entry.id).toBeLessThanOrEqual(160);
      } else if (entry.surfaceType === "component" && !longForm.has(entry.id)) {
        expect(duration.defaultValue, entry.id).toBeGreaterThanOrEqual(150);
        expect(duration.defaultValue, entry.id).toBeLessThanOrEqual(280);
      }

      if (duration.defaultValue > 280) {
        expect(`${duration.label.zh} ${duration.description.zh}`, entry.id).toMatch(/演示|循环|按住|确认/);
      }
    }
  });
});

describe("aligned HTML, CSS, and prompt output", () => {
  it("uses one canonical root across all copied artifacts", () => {
    const values = {
      duration: 500,
      distance: 36,
      direction: "up",
      delay: 120,
      ease: "calm"
    };
    const css = buildRecipeCss(seedRecipe, values);
    const html = buildRecipeHtml(seedRecipe, values);
    const prompt = buildRecipePrompt(seedRecipe, values, "zh");

    expect(css).toContain(".motion-demo.motion-demo--slide-in");
    expect(css).toContain("animation: motion-slide-in 500ms");
    expect(css).toContain("translateY(36px)");
    expect(html).toContain('class="motion-demo motion-demo--slide-in"');
    expect(prompt).toContain(".motion-demo--slide-in");
    expect(prompt).toContain("时长 500ms");
  });

  it("exports semantic interaction and state scenes", () => {
    const press = recipe("press-tap-feedback");
    expect(buildRecipeHtml(press)).toContain('<button class="motion-button"');
    expect(buildRecipeCss(press, getDefaultParamValues(press))).toContain(".motion-button:active");

    const accordion = recipe("accordion-collapse");
    expect(buildRecipeHtml(accordion)).toContain("<details open>");
    expect(buildRecipeCss(accordion, getDefaultParamValues(accordion))).toContain("summary");

    const scroll = recipe("scroll-driven-animation");
    expect(buildRecipeCss(scroll, getDefaultParamValues(scroll))).toContain("animation-timeline: scroll(nearest)");
  });

  it("exports executable vanilla runtimes for stateful components", () => {
    const contracts = [
      ["drag-to-reorder", "data-reorder-item", "setPointerCapture"],
      ["swipe-to-dismiss", "data-swipe-target", "0.11"],
      ["before-after-slider", 'type="range"', "ResizeObserver"],
      ["ripple", "data-ripple-button", "pointerdown"],
      ["hold-to-confirm", "data-hold-progress", "pointercancel"],
      ["spring", "data-spring-target", "requestAnimationFrame"]
    ] as const;

    for (const [id, htmlToken, jsToken] of contracts) {
      const entry = recipe(id);
      const values = getDefaultParamValues(entry);
      const html = buildRecipeHtml(entry, values, "en");
      const js = buildRecipeJs(entry, values);
      expect(html, id).toContain(htmlToken);
      expect(js, id).toContain(jsToken);
      expect(() => new Function(js), id).not.toThrow();
      expect(js, id).not.toContain("toString(");
      expect(js, id).not.toContain("__name");
    }

    expect(buildRecipeCss(recipe("ripple"), getDefaultParamValues(recipe("ripple")))).not.toContain("scale(0)");
  });

  it("builds every copied runtime independently in the test transform environment", () => {
    const runtimes = catalogRecipes
      .map((entry) => ({ entry, js: buildRecipeJs(entry, getDefaultParamValues(entry)) }))
      .filter(({ js }) => js.length > 0);

    expect(runtimes.map(({ entry }) => entry.id).sort()).toEqual([
      "crossfade",
      "morph",
      "direction-aware-transition",
      "page-transition",
      "text-morph",
      "number-ticker",
      "3d-tilt-flip",
      "loop",
      "marquee",
      "orbit",
      "idle-animation",
      "skeleton-shimmer",
      "easing",
      "drag-to-reorder",
      "swipe-to-dismiss",
      "before-after-slider",
      "ripple",
      "hold-to-confirm",
      "spring"
    ].sort());

    for (const { entry, js } of runtimes) {
      expect(() => new Function(js), entry.id).not.toThrow();
      expect(js, entry.id).not.toContain("toString(");
      expect(js, entry.id).not.toContain("__name");
      expect(js, entry.id).toContain("__motionLexiconCleanup");
    }

    const swipe = runtimes.find(({ entry }) => entry.id === "swipe-to-dismiss")?.js || "";
    expect(swipe).toContain("(1 - resistance)");
    const hold = runtimes.find(({ entry }) => entry.id === "hold-to-confirm")?.js || "";
    expect(hold).toContain('button.dataset.state = "holding"');
    expect(hold).toContain("watchReduced(run)");
  });

  it("gives state-change demos explicit replay semantics", () => {
    for (const id of ["crossfade", "morph", "direction-aware-transition", "page-transition", "text-morph", "number-ticker"]) {
      const entry = recipe(id);
      const values = getDefaultParamValues(entry);
      expect(buildRecipeHtml(entry, values, "en"), id).toContain("data-motion-replay");
      expect(buildRecipeJs(entry, values), id).toContain("getAnimations");
    }
  });

  it("gives continuous motion a visible pause and resume control", () => {
    for (const id of ["easing", "loop", "marquee", "orbit", "idle-animation", "skeleton-shimmer"]) {
      const entry = recipe(id);
      const values = getDefaultParamValues(entry);
      const html = buildRecipeHtml(entry, values, "en");
      const js = buildRecipeJs(entry, values);
      expect(html, id).toContain("data-motion-pause");
      expect(html, id).toContain('aria-disabled="true" disabled');
      expect(js, id).toContain("animation.pause");
      expect(js, id).toContain('button.removeAttribute("aria-disabled")');
    }
  });

  it("localizes visible specimen copy for the active locale", () => {
    const guide = recipe("reduced-motion");
    const zh = buildRecipeHtml(guide, getDefaultParamValues(guide), "zh");
    const en = buildRecipeHtml(guide, getDefaultParamValues(guide), "en");

    expect(zh).toContain("为移动、缩放、循环和视差提供等价的低动态表达");
    expect(zh).not.toContain("Provide equivalent");
    expect(en).toContain("Provide equivalent low-motion treatments");
  });

  it("includes manual and system reduced-motion modes", () => {
    const css = buildRecipeCss(seedRecipe, getDefaultParamValues(seedRecipe));
    expect(css).toContain(".force-reduced-motion");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain("animation-iteration-count: 1 !important");
  });

  it("generates complete outputs for every inventory term", () => {
    for (const entry of entries) {
      const values = getDefaultParamValues(entry);
      const css = buildRecipeCss(entry, values);
      const html = buildRecipeHtml(entry, values);
      const prompt = buildRecipePrompt(entry, values, "zh");

      expect(css, entry.id).toContain(`.motion-demo--${entry.canonicalId}`);
      expect(css, entry.id).toContain("prefers-reduced-motion");
      expect(html, entry.id).toContain(`motion-demo--${entry.canonicalId}`);
      expect(prompt, entry.id).toContain(`.motion-demo--${entry.canonicalId}`);
      expect(`${css}${html}${prompt}`, entry.id).not.toContain("undefined");
    }
  });

  it("clamps values to the nearest configured step", () => {
    expect(clampToStep(19, getRangeParam(seedRecipe, "distance"))).toBe(20);
  });

  it("keeps legacy category lookup available", () => {
    expect(getRecipe("easing", "linear")?.canonicalId).toBe("easing");
  });
});
