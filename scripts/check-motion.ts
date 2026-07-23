import { readFileSync } from "node:fs";
import { catalogRecipes } from "../src/data/recipes";
import type { MotionParam, RangeParam } from "../src/data/types";
import { buildRecipeCss, buildRecipeHtml, getDefaultParamValues } from "../src/lib/motion-engine";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

type CssBlock = {
  body: string;
  end: number;
  header: string;
  start: number;
};

function findBlocks(css: string, pattern: RegExp): CssBlock[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matcher = new RegExp(pattern.source, flags);
  const blocks: CssBlock[] = [];
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(css))) {
    const open = css.indexOf("{", match.index);
    if (open < 0) break;

    let depth = 1;
    let cursor = open + 1;
    while (cursor < css.length && depth > 0) {
      if (css[cursor] === "{") depth += 1;
      if (css[cursor] === "}") depth -= 1;
      cursor += 1;
    }

    assert(depth === 0, `Unbalanced CSS block near: ${match[0]}`);
    blocks.push({
      start: match.index,
      end: cursor,
      header: css.slice(match.index, open).trim(),
      body: css.slice(open + 1, cursor - 1)
    });
    matcher.lastIndex = cursor;
  }

  return blocks;
}

function removeBlocks(css: string, blocks: CssBlock[]) {
  let output = css;
  for (const block of [...blocks].sort((a, b) => b.start - a.start)) {
    output = `${output.slice(0, block.start)}${" ".repeat(block.end - block.start)}${output.slice(block.end)}`;
  }
  return output;
}

function motionHoverRulesOutsideFinePointer(css: string) {
  const finePointerBlocks = findBlocks(
    css,
    /@media\s*\(\s*hover\s*:\s*hover\s*\)\s*and\s*\(\s*pointer\s*:\s*fine\s*\)\s*\{/i
  );
  const outside = removeBlocks(css, finePointerBlocks);
  const violations: string[] = [];
  const rules = outside.matchAll(/([^{}]*:hover[^{}]*)\{([^{}]*)\}/g);

  for (const match of rules) {
    const selector = match[1].trim().replace(/\s+/g, " ");
    const body = match[2];
    const motionDeclarations = body.matchAll(
      /(?:^|;)\s*(?:transform|translate|rotate|scale|offset(?:-[\w-]+)?|animation(?:-name|-play-state)?)\s*:\s*([^;]+)/gm
    );
    const moves = [...motionDeclarations].some((declaration) => !/^(?:none|initial|unset)\b/i.test(declaration[1].trim()));
    const animates = /(?:^|;)\s*animation\s*:\s*([^;]+)/m.test(body) &&
      !/^(?:none|initial|unset)\b/i.test(body.match(/(?:^|;)\s*animation\s*:\s*([^;]+)/m)?.[1]?.trim() ?? "");
    if (moves || animates) violations.push(selector);
  }

  return violations;
}

function layoutPropertiesInKeyframes(css: string) {
  const keyframes = findBlocks(css, /@(?:-webkit-)?keyframes\s+[\w-]+\s*\{/i);
  const layoutProperty = /(?:^|[;{])\s*(?:width|height|min-width|max-width|min-height|max-height|top|right|bottom|left|inset(?:-[\w-]+)?|margin(?:-[\w-]+)?|padding(?:-[\w-]+)?)\s*:/m;
  return keyframes.filter((block) => layoutProperty.test(block.body)).map((block) => block.header);
}

function reducedMotionBlock(css: string) {
  return findBlocks(css, /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{/i)[0];
}

function hasLowMotionTransition(segment: string) {
  const property = segment.match(/transition-property\s*:\s*([^;]+)/i)?.[1] ?? "";
  const duration = segment.match(/transition-duration\s*:\s*([^;]+)/i)?.[1] ?? "";
  const keepsStateCue = /(?:opacity|color|background-color|border-color)/i.test(property);
  const removesTravel = !/(?:transform|translate|rotate|scale|offset)/i.test(property);
  const staysBrief = /(?:1[0-9]{2}|200)ms/i.test(duration);
  return keepsStateCue && removesTravel && staysBrief;
}

function durationParam(params: MotionParam[]): RangeParam | undefined {
  return params.find((param): param is RangeParam => param.id === "duration" && param.kind === "range");
}

const staticStylePaths = ["src/styles.css", "src/library.css"];
const staticStyles = staticStylePaths.map((filePath) => ({ filePath, css: readFileSync(filePath, "utf8") }));
const staticCss = staticStyles.map(({ css }) => css).join("\n");

assert(!/transition\s*:\s*all\b/.test(staticCss), "Static CSS must not use transition: all");
assert(!/scale\(0\)/.test(staticCss), "Static CSS must not animate from scale(0)");
assert(!/\bease-in\b(?!-out)/.test(staticCss), "Static UI CSS must not use ease-in");
assert(
  staticCss.includes("@media (hover: hover) and (pointer: fine)"),
  "Static hover motion must include a fine-pointer media query"
);
assert(
  motionHoverRulesOutsideFinePointer(staticCss).length === 0,
  `Static hover motion is not fine-pointer gated: ${motionHoverRulesOutsideFinePointer(staticCss).join(", ")}`
);
assert(
  layoutPropertiesInKeyframes(staticCss).length === 0,
  `Static keyframes animate layout properties: ${layoutPropertiesInKeyframes(staticCss).join(", ")}`
);
for (const { filePath, css } of staticStyles) {
  const reduced = reducedMotionBlock(css);
  assert(reduced, `${filePath} reduced-motion media query is missing`);
  assert(hasLowMotionTransition(reduced.body), `${filePath} reduced motion must retain only brief opacity/color transitions`);
}

const microInteractionExceptions = new Set(["press-tap-feedback", "ripple"]);
const longFormExceptions = new Set([
  "hold-to-confirm",
  "marquee",
  "orbit",
  "idle-animation",
  "line-drawing",
  "skeleton-shimmer",
  "typewriter"
]);
const componentOutputs = new Map<string, string>();

for (const recipe of catalogRecipes) {
  const values = getDefaultParamValues(recipe);
  const generatedCss = buildRecipeCss(recipe, values);
  const generatedHtml = buildRecipeHtml(recipe, values, "en");
  const root = `.motion-demo.motion-demo--${recipe.canonicalId}`;
  const duration = durationParam(recipe.params);

  assert(generatedCss.includes(root), `${recipe.id} CSS is missing its scoped root`);
  assert(generatedHtml.includes(`data-motion="${recipe.canonicalId}"`), `${recipe.id} HTML is missing its motion identity`);
  assert(!/transition\s*:\s*all\b/.test(generatedCss), `${recipe.id} generated CSS uses transition: all`);
  assert(!/scale\(0\)/.test(generatedCss), `${recipe.id} generated CSS animates from scale(0)`);
  assert(!/\bease-in\b(?!-out)/.test(generatedCss), `${recipe.id} generated UI CSS uses ease-in`);
  assert(
    motionHoverRulesOutsideFinePointer(generatedCss).length === 0,
    `${recipe.id} generated hover motion is not fine-pointer gated: ${motionHoverRulesOutsideFinePointer(generatedCss).join(", ")}`
  );
  assert(
    layoutPropertiesInKeyframes(generatedCss).length === 0,
    `${recipe.id} generated keyframes animate layout properties: ${layoutPropertiesInKeyframes(generatedCss).join(", ")}`
  );

  const systemReduced = reducedMotionBlock(generatedCss);
  assert(systemReduced, `${recipe.id} CSS is missing a reduced-motion media query`);
  assert(generatedCss.includes(".force-reduced-motion"), `${recipe.id} CSS is missing manual reduced-motion output`);

  if (/transition\s*:/.test(generatedCss)) {
    const manualReduced = generatedCss.slice(0, systemReduced.start);
    assert(hasLowMotionTransition(manualReduced), `${recipe.id} manual reduced motion must keep only a brief opacity/color transition`);
    assert(hasLowMotionTransition(systemReduced.body), `${recipe.id} system reduced motion must keep only a brief opacity/color transition`);
  }

  if (recipe.surfaceType === "component" && duration) {
    const isMicroInteraction = microInteractionExceptions.has(recipe.id);
    const isLongForm = longFormExceptions.has(recipe.id);
    if (isMicroInteraction) {
      assert(duration.defaultValue >= 100 && duration.defaultValue <= 160, `${recipe.id} micro-interaction default must stay within 100–160ms`);
    } else if (!isLongForm) {
      assert(duration.defaultValue >= 150 && duration.defaultValue <= 280, `${recipe.id} UI default must stay within 150–280ms`);
    }
  }

  if (duration && duration.defaultValue > 280) {
    const rationale = `${duration.label.zh} ${duration.description.zh}`;
    assert(/演示|循环|按住|确认/.test(rationale), `${recipe.id} long duration needs an explicit demo, loop, or deliberate-interaction rationale`);
  }

  if (recipe.surfaceType !== "guide") {
    const normalized = generatedCss.replaceAll(recipe.canonicalId ?? recipe.id, "ENTRY");
    const existing = componentOutputs.get(normalized);
    assert(!existing, `${recipe.id} duplicates the generated motion CSS of ${existing}`);
    componentOutputs.set(normalized, recipe.id);
  }
}

console.log(
  `Motion check passed: ${catalogRecipes.length} canonical entries have scoped output, intentional defaults, ` +
    "fine-pointer hover motion, compositor-safe keyframes, and equivalent manual/system reduced-motion behavior."
);
