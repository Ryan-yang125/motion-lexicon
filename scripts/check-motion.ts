import { readFileSync, readdirSync } from "node:fs";
import { registryComponents } from "../src/data/component-registry";
import { installablePrimitiveEntries } from "../src/data/primitive-registry";
import { catalogRecipes } from "../src/data/recipes";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

type CssBlock = { body: string; end: number; header: string; start: number };

function findBlocks(css: string, pattern: RegExp): CssBlock[] {
  const matcher = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
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
    assert(depth === 0, `Unbalanced CSS block near ${match[0]}`);
    blocks.push({ start: match.index, end: cursor, header: css.slice(match.index, open).trim(), body: css.slice(open + 1, cursor - 1) });
    matcher.lastIndex = cursor;
  }
  return blocks;
}

function layoutPropertiesInKeyframes(css: string) {
  const layoutProperty = /(?:^|[;{])\s*(?:width|height|min-width|max-width|min-height|max-height|top|right|bottom|left|inset(?:-[\w-]+)?|margin(?:-[\w-]+)?|padding(?:-[\w-]+)?)\s*:/m;
  return findBlocks(css, /@(?:-webkit-)?keyframes\s+[\w-]+\s*\{/i)
    .filter((block) => layoutProperty.test(block.body))
    .map((block) => block.header);
}

const stylePaths = ["src/styles.css", "src/library.css", "src/interior-theme.css", "src/v4.css"];
for (const file of stylePaths) {
  const css = readFileSync(file, "utf8");
  assert(!/transition\s*:\s*all\b/.test(css), `${file} uses transition: all`);
  assert(!/scale\(0\)/.test(css), `${file} animates from scale(0)`);
  assert(!/\bease-in\b(?!-out)/.test(css), `${file} uses ease-in for interface motion`);
  assert(css.includes("@media (prefers-reduced-motion: reduce)"), `${file} needs a reduced-motion branch`);
  assert(layoutPropertiesInKeyframes(css).length === 0, `${file} animates layout properties in keyframes: ${layoutPropertiesInKeyframes(css).join(", ")}`);
}

const registryFiles = readdirSync("src/registry/components").filter((file) => file.endsWith(".tsx"));
assert(registryFiles.length === registryComponents.length, "Component registry source count is inconsistent");
for (const file of registryFiles) {
  const source = readFileSync(`src/registry/components/${file}`, "utf8");
  assert(!/transition\s*:\s*["'`]all\b/.test(source), `${file} uses transition: all`);
  assert(!/scale\s*:\s*0(?!\.)/.test(source), `${file} animates from scale 0`);
  if (source.includes('from "motion/react"')) assert(source.includes("useReducedMotion"), `${file} uses Motion without a reduced-motion branch`);
}

for (const primitive of installablePrimitiveEntries) {
  const source = readFileSync(`src/registry/primitives/${primitive.id}.tsx`, "utf8");
  assert(source.includes(`export function ${primitive.exportName}`), `${primitive.id} export is missing`);
  assert(source.includes('from "motion/react"'), `${primitive.id} must use Motion`);
  assert(source.includes("useReducedMotion"), `${primitive.id} needs a reduced-motion branch`);
  assert(!/transition\s*:\s*["'`]all\b/.test(source), `${primitive.id} uses transition: all`);
  assert(!/scale\s*:\s*0(?!\.)/.test(source), `${primitive.id} animates from scale 0`);
}

const primitiveSource = (id: string) => {
  const primitive = installablePrimitiveEntries.find((entry) => entry.id === id);
  assert(primitive, `Missing ${id} registry primitive`);
  return readFileSync(`src/registry/primitives/${primitive.id}.tsx`, "utf8");
};
assert(primitiveSource("hold-to-confirm").includes("onConfirm: () => void"), "Hold-to-confirm needs a completion callback");
assert(primitiveSource("hold-to-confirm").includes("onPointerCancel={cancel}"), "Hold-to-confirm must be cancellable");
assert(primitiveSource("swipe-to-dismiss").includes("onDragEnd={finish}"), "Swipe-to-dismiss needs threshold handling");
assert(primitiveSource("scroll-driven-animation").includes("useScroll"), "Scroll-driven animation must read scroll progress");
assert(primitiveSource("skeleton-shimmer").includes("repeat: reduceMotion ? 0 : Infinity"), "Skeleton shimmer must loop while loading");
assert(primitiveSource("drag-to-reorder").includes("<Reorder.Group"), "Drag-to-reorder needs a reorder state contract");
assert(primitiveSource("ripple").includes("onPointerDown={(event)"), "Ripple must originate at the pointer");
assert(primitiveSource("parallax").includes("useScroll"), "Parallax must read scroll progress");
assert(primitiveSource("number-ticker").includes("key={value}"), "Number ticker must react to value changes");
assert(primitiveSource("before-after-slider").includes('type="range"'), "Before-after needs an operable divider");
assert(primitiveSource("typewriter").includes("window.setInterval"), "Typewriter must reveal discrete characters");
assert(!primitiveSource("marquee").includes('<motion.div aria-hidden="true"'), "Looping content must remain available to assistive technology");

const longForm = new Set(["hold-to-confirm", "marquee", "orbit", "idle-animation", "line-drawing", "skeleton-shimmer", "typewriter"]);
for (const recipe of catalogRecipes) {
  const duration = recipe.params.find((param) => param.id === "duration");
  if (!duration || duration.kind !== "range" || recipe.surfaceType !== "component") continue;
  if (!longForm.has(recipe.id)) {
    const minimum = recipe.id === "press-tap-feedback" ? 100 : 150;
    assert(duration.defaultValue >= minimum && duration.defaultValue <= 280, `${recipe.id} default timing is outside the interface range`);
  }
}

console.log(`Motion check passed: ${registryComponents.length} product components and ${installablePrimitiveEntries.length} React + Motion primitives are reduced-motion aware, compositor safe, and registry ready.`);
