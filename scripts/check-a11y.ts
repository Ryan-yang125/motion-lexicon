import { readFileSync } from "node:fs";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const css = readFileSync("src/styles.css", "utf8");

assert(css.includes("focus-visible"), "Visible focus styles are missing");
assert(css.includes("min-height: 2.75rem"), "44px interactive target baseline is missing");
assert(css.includes("--ink-dim: #737373"), "Light theme dim text contrast token regressed");
assert(css.includes("--ink-dim: #a1a1aa"), "Dark theme dim text contrast token regressed");
assert(css.includes("@media (prefers-reduced-motion: reduce)"), "Reduced-motion media query is missing");

console.log("Accessibility check passed: focus, target size, contrast tokens, and reduced motion are present.");
