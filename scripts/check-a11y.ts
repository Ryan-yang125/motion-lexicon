import { readFileSync } from "node:fs";

type Rgb = { r: number; g: number; b: number };

const WCAG_AA_NORMAL_TEXT = 4.5;
const WCAG_AA_LARGE_TEXT_OR_UI = 3;
const css = [
  "src/styles.css",
  "src/library.css",
  "src/vocabulary.css",
  "src/apple-redesign.css",
  "src/interior-theme.css"
].map((file) => readFileSync(file, "utf8")).join("\n");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readCustomProperties(selector: string) {
  const properties = new Map<string, string>();
  const blocks = css.matchAll(new RegExp(`${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\}`, "g"));
  let found = false;
  for (const block of blocks) {
    found = true;
    for (const declaration of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      properties.set(declaration[1], declaration[2].trim());
    }
  }
  assert(found, `Missing ${selector} color token block`);
  return properties;
}

function resolveCustomProperty(properties: Map<string, string>, token: string, seen = new Set<string>()): string {
  assert(!seen.has(token), `Circular color token reference: ${[...seen, token].join(" -> ")}`);
  const value = properties.get(token);
  assert(value, `Missing color token ${token}`);
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  if (!reference) return value;
  seen.add(token);
  return resolveCustomProperty(properties, reference[1], seen);
}

function parseCssColor(value: string, label: string): Rgb {
  const normalized = value.trim().toLowerCase();
  const hex = normalized.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (hex) {
    const expanded = hex.length === 3
      ? hex.split("").map((channel) => `${channel}${channel}`).join("")
      : hex;
    return {
      r: Number.parseInt(expanded.slice(0, 2), 16),
      g: Number.parseInt(expanded.slice(2, 4), 16),
      b: Number.parseInt(expanded.slice(4, 6), 16)
    };
  }

  const rgb = normalized.match(/^rgb\(\s*(\d{1,3})\s+?(?:,\s*)?(\d{1,3})\s+?(?:,\s*)?(\d{1,3})\s*\)$/);
  assert(rgb, `Unsupported color syntax for ${label}: ${value}`);
  const channels = rgb.slice(1).map(Number);
  assert(channels.every((channel) => channel >= 0 && channel <= 255), `Invalid RGB color for ${label}: ${value}`);
  return { r: channels[0], g: channels[1], b: channels[2] };
}

function relativeLuminance(color: Rgb) {
  const [red, green, blue] = [color.r, color.g, color.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: Rgb, background: Rgb) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkContrast(
  theme: string,
  label: string,
  properties: Map<string, string>,
  foregroundToken: string,
  backgroundToken: string,
  threshold: number
) {
  const foregroundValue = resolveCustomProperty(properties, foregroundToken);
  const backgroundValue = resolveCustomProperty(properties, backgroundToken);
  const ratio = contrastRatio(
    parseCssColor(foregroundValue, `${theme} ${foregroundToken}`),
    parseCssColor(backgroundValue, `${theme} ${backgroundToken}`)
  );
  assert(
    ratio >= threshold,
    `${theme} ${label} contrast is ${ratio.toFixed(2)}:1 (${foregroundToken} ${foregroundValue} on ${backgroundToken} ${backgroundValue}); WCAG AA requires at least ${threshold.toFixed(1)}:1`
  );
  return `${theme} ${label}: ${ratio.toFixed(2)}:1 (minimum ${threshold.toFixed(1)}:1)`;
}

assert(css.includes("focus-visible"), "Visible focus styles are missing");
assert(css.includes("min-height: 2.75rem"), "44px interactive target baseline is missing");
assert(css.includes("@media (prefers-reduced-motion: reduce)"), "Reduced-motion media query is missing");

const lightProperties = readCustomProperties(":root");
const darkProperties = new Map(lightProperties);
for (const [token, value] of readCustomProperties(":root.dark")) {
  darkProperties.set(token, value);
}

const contrastChecks: Array<[string, string, string, number]> = [
  ["primary text on page", "--ink", "--bg", WCAG_AA_NORMAL_TEXT],
  ["secondary text on page", "--ink-soft", "--bg", WCAG_AA_NORMAL_TEXT],
  ["dim text on page", "--ink-dim", "--bg", WCAG_AA_NORMAL_TEXT],
  ["placeholder text on panel", "--ink-dim", "--panel-solid", WCAG_AA_NORMAL_TEXT],
  ["dim text on raised panel", "--ink-dim", "--panel-raised", WCAG_AA_NORMAL_TEXT],
  ["accent text on page", "--accent", "--bg", WCAG_AA_NORMAL_TEXT],
  ["primary action text", "--apple-action-fg", "--apple-action-bg", WCAG_AA_NORMAL_TEXT],
  ["primary action hover text", "--apple-action-fg", "--apple-action-hover", WCAG_AA_NORMAL_TEXT],
  ["code text", "--code-text", "--code", WCAG_AA_NORMAL_TEXT],
  ["focus indicator", "--accent", "--bg", WCAG_AA_LARGE_TEXT_OR_UI]
];

const results: string[] = [];
for (const [theme, properties] of [["light", lightProperties], ["dark", darkProperties]] as const) {
  for (const [label, foreground, background, threshold] of contrastChecks) {
    results.push(checkContrast(theme, label, properties, foreground, background, threshold));
  }
}

console.log([
  `Accessibility check passed. WCAG AA thresholds: normal text ${WCAG_AA_NORMAL_TEXT.toFixed(1)}:1; large text and UI graphics ${WCAG_AA_LARGE_TEXT_OR_UI.toFixed(1)}:1.`,
  ...results,
  "Visible focus styles, the 44px target baseline, and reduced-motion handling are present."
].join("\n"));
