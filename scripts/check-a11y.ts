import { readFileSync } from "node:fs";
import { registryComponents } from "../src/data/component-registry";
import { installablePrimitiveEntries } from "../src/data/primitive-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const stylePaths = [
  "src/styles.css",
  "src/library.css",
  "src/vocabulary.css",
  "src/apple-redesign.css",
  "src/interior-theme.css",
  "src/v4.css"
];
const css = stylePaths.map((file) => readFileSync(file, "utf8")).join("\n");

assert(css.includes(":focus-visible"), "Visible focus styles are missing");
assert(css.includes("@media (prefers-reduced-motion: reduce)"), "Reduced-motion handling is missing");
assert(css.includes("overflow-x: clip"), "The global layout must prevent horizontal overflow");
assert(css.includes("min-height: 44px") || css.includes("min-height: 2.75rem"), "A 44px interactive target baseline is missing");
assert(css.includes("--ink: #292929"), "Primary text token is missing");
assert(css.includes("--ink-2: #5d5d5d"), "Secondary text token is missing");
assert(css.includes("--hairline:"), "Non-color boundary token is missing");

const shell = readFileSync("src/components/LibraryShell.tsx", "utf8");
assert(shell.includes("aria-current"), "Sidebar navigation must expose the current page");
assert(shell.includes('aria-modal="true"'), "Mobile navigation must expose modal semantics");
assert(shell.includes("aria-label"), "Shell controls need accessible names");

for (const component of registryComponents) {
  const source = readFileSync(`src/registry/components/${component.id}.tsx`, "utf8");
  assert(!source.includes('outline: "none"'), `${component.id} removes focus without a replacement`);
  assert(
    source.includes("useReducedMotion") || source.includes("prefers-reduced-motion"),
    `${component.id} needs an equivalent reduced-motion result`
  );
  if (source.includes("<canvas")) {
    assert(
      source.includes("aria-hidden") || (source.includes('role="group"') && source.includes("aria-label=")),
      `${component.id} canvas needs a DOM accessibility equivalent`
    );
  }
}
for (const primitive of installablePrimitiveEntries) {
  const source = readFileSync(`src/registry/primitives/${primitive.id}.tsx`, "utf8");
  assert(source.includes("useReducedMotion"), `${primitive.id} needs an equivalent reduced-motion result`);
  assert(!source.includes('outline: "none"'), `${primitive.id} removes focus without a replacement`);
}

console.log(`Accessibility check passed: global focus, reduced motion, overflow containment, target sizing, navigation semantics, ${registryComponents.length} component sources, and ${installablePrimitiveEntries.length} primitive sources are covered.`);
