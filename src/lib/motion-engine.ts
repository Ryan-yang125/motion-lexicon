import type {
  Locale,
  MotionParam,
  MotionRecipe,
  ParamValue,
  ParamValues,
  RangeParam,
  SegmentedParam
} from "../data/types";
import { getMotionSpec } from "../data/motion-specs";
import { getGlossaryTermsForCanonical } from "../data/glossary";
import { text } from "../data/site";
import {
  buildMotionRuntimeSource,
  type MotionRuntimeConfig
} from "./motion-runtime";

export function getDefaultParamValues(recipe: MotionRecipe): ParamValues {
  return Object.fromEntries(
    recipe.params.map((param) => [param.id, param.defaultValue])
  );
}

export function getRangeParam(recipe: MotionRecipe, paramId: string): RangeParam {
  const param = recipe.params.find((item) => item.id === paramId);
  if (!param || param.kind !== "range") {
    throw new Error(`Missing range param: ${paramId}`);
  }
  return param;
}

export function getSegmentedParam(
  recipe: MotionRecipe,
  paramId: string
): SegmentedParam {
  const param = recipe.params.find((item) => item.id === paramId);
  if (!param || param.kind !== "segmented") {
    throw new Error(`Missing segmented param: ${paramId}`);
  }
  return param;
}

export function getParamDisplayValue(param: MotionParam, value: ParamValue) {
  if (param.kind === "range") {
    return `${Number(value)}${param.unit}`;
  }
  if (param.kind === "toggle") {
    return value ? "on" : "off";
  }
  return String(value);
}

export function getEaseCssValue(recipe: MotionRecipe, values: ParamValues) {
  const easeParam = recipe.params.find(
    (item): item is SegmentedParam => item.id === "ease" && item.kind === "segmented"
  );
  if (!easeParam) {
    return "cubic-bezier(0.23, 1, 0.32, 1)";
  }
  const selectedValue = String(values.ease ?? easeParam.defaultValue);
  return (
    easeParam.options.find((option) => option.value === selectedValue)?.cssValue ??
    easeParam.options[0].cssValue
  );
}

export function getEaseLabel(
  recipe: MotionRecipe,
  values: ParamValues,
  locale: Locale
) {
  const easeParam = recipe.params.find(
    (item): item is SegmentedParam => item.id === "ease" && item.kind === "segmented"
  );
  if (!easeParam) {
    return locale === "zh" ? "物理响应" : "Physical response";
  }
  const selectedValue = String(values.ease ?? easeParam.defaultValue);
  const selected = easeParam.options.find((option) => option.value === selectedValue);
  return text((selected ?? easeParam.options[0]).label, locale);
}

export function clampToStep(value: number, param: RangeParam) {
  const clamped = Math.min(param.max, Math.max(param.min, value));
  const stepped = Math.round((clamped - param.min) / param.step) * param.step + param.min;
  return Number(stepped.toFixed(4));
}

export function parseParamValues(
  recipe: MotionRecipe,
  search: URLSearchParams | Record<string, unknown>
): ParamValues {
  const defaults = getDefaultParamValues(recipe);

  for (const param of recipe.params) {
    const raw =
      search instanceof URLSearchParams ? search.get(param.id) : search[param.id];

    if (raw === null || raw === undefined || raw === "") {
      continue;
    }

    if (param.kind === "range") {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        defaults[param.id] = clampToStep(parsed, param);
      }
    }

    if (param.kind === "segmented") {
      const parsed = String(raw);
      if (param.options.some((option) => option.value === parsed)) {
        defaults[param.id] = parsed;
      }
    }

    if (param.kind === "toggle") {
      defaults[param.id] = raw === true || raw === "true" || raw === "1";
    }
  }

  return defaults;
}

export function valuesToSearchParams(
  recipe: MotionRecipe,
  values: ParamValues,
  existing = new URLSearchParams()
) {
  const next = new URLSearchParams(existing);
  const defaults = getDefaultParamValues(recipe);

  for (const param of recipe.params) {
    const value = values[param.id] ?? defaults[param.id];
    if (value === defaults[param.id]) {
      next.delete(param.id);
    } else {
      next.set(param.id, String(value));
    }
  }

  return next;
}

function numberValue(values: ParamValues, key: string, fallback: number) {
  const value = values[key];
  return Number.isFinite(Number(value)) ? Number(value) : fallback;
}

function resolvedValues(recipe: MotionRecipe, values: ParamValues) {
  return { ...getDefaultParamValues(recipe), ...values };
}

function stringValue(values: ParamValues, key: string, fallback: string) {
  const value = values[key];
  return value === undefined ? fallback : String(value);
}

function booleanValue(values: ParamValues, key: string, fallback: boolean) {
  const value = values[key];
  return value === undefined ? fallback : value === true || value === "true" || value === "1";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function classToken(value: string) {
  return value.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function directionTransform(direction: string, distance: number) {
  if (direction === "left") return `translateX(-${distance}px)`;
  if (direction === "right") return `translateX(${distance}px)`;
  if (direction === "down") return `translateY(-${distance}px)`;
  if (direction === "out") return `translateY(-${distance}px)`;
  return `translateY(${distance}px)`;
}

function rootSelector(recipe: MotionRecipe) {
  return `.motion-demo.motion-demo--${classToken(getMotionSpec(recipe).canonicalId)}`;
}

export function getMotionRuntimeConfig(
  recipe: MotionRecipe,
  inputValues: ParamValues,
  autoplay = false
): MotionRuntimeConfig {
  const values = resolvedValues(recipe, inputValues);
  return {
    id: getMotionSpec(recipe).canonicalId,
    duration: numberValue(values, "duration", 180),
    distance: numberValue(values, "distance", 72),
    resistance: numberValue(values, "resistance", 65),
    position: numberValue(values, "position", 50),
    stiffness: numberValue(values, "stiffness", 220),
    damping: numberValue(values, "damping", 24),
    mass: numberValue(values, "mass", 1),
    velocity: numberValue(values, "velocity", 0),
    rippleSize: numberValue(values, "size", 220),
    rippleOpacity: numberValue(values, "opacity", 24),
    dragScale: numberValue(values, "scale", 103),
    autoplay
  };
}

function baseCss(root: string) {
  return `${root} {
  position: relative;
  display: grid;
  place-items: center;
  width: min(100%, 34rem);
  min-height: 15rem;
  padding: 2rem;
  overflow: hidden;
  color: #18181b;
  background: #fafafa;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  isolation: isolate;
}

${root} *, ${root} *::before, ${root} *::after {
  box-sizing: border-box;
}

${root} .motion-surface {
  position: relative;
  display: grid;
  gap: 0.65rem;
  width: min(100%, 18rem);
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 6%), 0 10px 28px rgb(0 0 0 / 7%);
}

${root} .motion-line {
  display: block;
  width: 100%;
  height: 0.5rem;
  background: #e4e4e7;
  border-radius: 999px;
}

${root} .motion-line:last-child { width: 62%; }

${root} .motion-button {
  position: relative;
  min-height: 2.75rem;
  padding: 0.75rem 1.1rem;
  color: white;
  font: inherit;
  font-weight: 700;
  background: #18181b;
  border: 0;
  border-radius: 7px;
  cursor: pointer;
}

${root} .motion-button:focus-visible { outline: 3px solid rgb(37 99 235 / 32%); outline-offset: 3px; }

${root} .motion-action-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

${root} .motion-replay-scene {
  width: min(100%, 22rem);
  display: grid;
  place-items: center;
}

${root} .motion-pausable-scene {
  width: min(100%, 22rem);
  display: grid;
  place-items: center;
}

${root} button.motion-surface {
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

${root} .motion-replay-button,
${root} .motion-undo-button,
${root} .motion-dismiss-button,
${root} .motion-pause-button {
  min-height: 2.75rem;
  padding: 0.65rem 0.9rem;
  color: #18181b;
  font: 650 0.78rem/1 ui-sans-serif, system-ui, sans-serif;
  background: #ffffff;
  border: 1px solid #d4d4d8;
  border-radius: 7px;
  cursor: pointer;
}

${root} .motion-replay-button:focus-visible,
${root} .motion-undo-button:focus-visible,
${root} .motion-dismiss-button:focus-visible,
${root} .motion-pause-button:focus-visible,
${root} [data-reorder-item]:focus-visible,
${root} [data-swipe-target]:focus-visible {
  outline: 3px solid rgb(37 99 235 / 32%);
  outline-offset: 3px;
}

${root} .motion-status {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

${root} .motion-ripple-ink {
  position: absolute;
  width: 12px;
  height: 12px;
  pointer-events: none;
  background: rgb(255 255 255 / 72%);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
}

${root} .motion-state-stack { position: relative; width: min(100%, 18rem); height: 9rem; }
${root} .motion-state { position: absolute; inset: 0; display: grid; place-items: center; padding: 1rem; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; }
${root} .motion-state--to { background: #18181b; color: white; }

${root} .motion-scroll-track > span { color: #71717a; font: 600 0.72rem/1.2 ui-monospace, monospace; letter-spacing: 0.08em; text-transform: uppercase; }
${root} .motion-orbit-item { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; color: white; background: #2563eb; border-radius: 50%; }
${root} .motion-text-stack { position: relative; width: min(100%, 18rem); min-height: 4rem; }
${root} svg { width: min(100%, 20rem); height: auto; }`;
}

function reducedMotionCss(root: string, name: string) {
  return `@keyframes ${name}-reduced-fade {
  from { opacity: 0.84; }
  to { opacity: 1; }
}

.force-reduced-motion ${root} {
  animation: ${name}-reduced-fade 160ms cubic-bezier(0.23, 1, 0.32, 1) both !important;
}

.force-reduced-motion ${root} *,
.force-reduced-motion ${root} *::before,
.force-reduced-motion ${root} *::after {
  animation: none !important;
  animation-delay: 0ms !important;
  animation-iteration-count: 1 !important;
  transition-property: opacity, color, background-color, border-color !important;
  transition-duration: 160ms !important;
  transition-delay: 0ms !important;
  scroll-behavior: auto !important;
}

.force-reduced-motion ${root} .motion-button,
.force-reduced-motion ${root} [data-reorder-item],
.force-reduced-motion ${root} [data-swipe-target],
.force-reduced-motion ${root} [data-spring-target] {
  transform: none !important;
}

.force-reduced-motion ${root} .motion-path { stroke-dashoffset: 0 !important; }
.force-reduced-motion ${root} .motion-word--from { opacity: 0 !important; visibility: hidden; }
.force-reduced-motion ${root} .motion-word:not(.motion-word--from) { opacity: 1 !important; filter: none !important; transform: none !important; }

@media (prefers-reduced-motion: reduce) {
  ${root} {
    animation: ${name}-reduced-fade 160ms cubic-bezier(0.23, 1, 0.32, 1) both !important;
  }

  ${root} *, ${root} *::before, ${root} *::after {
    animation: none !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-property: opacity, color, background-color, border-color !important;
    transition-duration: 160ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }

  ${root} .motion-button,
  ${root} [data-reorder-item],
  ${root} [data-swipe-target],
  ${root} [data-spring-target] {
    transform: none !important;
  }

  ${root} .motion-path { stroke-dashoffset: 0 !important; }
  ${root} .motion-word--from { opacity: 0 !important; visibility: hidden; }
  ${root} .motion-word:not(.motion-word--from) { opacity: 1 !important; filter: none !important; transform: none !important; }
}`;
}

function behaviorCss(recipe: MotionRecipe, inputValues: ParamValues) {
  const spec = getMotionSpec(recipe);
  const id = spec.canonicalId;
  const root = rootSelector(recipe);
  const values = resolvedValues(recipe, inputValues);
  const name = `motion-${classToken(id)}`;
  const duration = numberValue(values, "duration", 420);
  const delay = numberValue(values, "delay", 0);
  const distance = numberValue(values, "distance", 28);
  const ease = getEaseCssValue(recipe, values);

  if (id === "fade-in-fade-out") {
    const opacity = numberValue(values, "opacity", 0) / 100;
    return `${root} .motion-surface { animation: ${name} ${duration}ms ${ease} ${delay}ms both; }
@keyframes ${name} { from { opacity: ${opacity}; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`;
  }

  if (id === "slide-in") {
    const direction = stringValue(values, "direction", "up");
    const exit = direction === "out";
    return `${root} .motion-surface { animation: ${name} ${duration}ms ${ease} ${delay}ms both; will-change: transform, opacity; }
@keyframes ${name} {
  ${exit ? "from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-" + distance + "px); }" : `from { opacity: 0; transform: ${directionTransform(direction, distance)}; } to { opacity: 1; transform: none; }`}
}`;
  }

  if (id === "scale-in") {
    const startScale = numberValue(values, "scale", 92) / 100;
    const overshoot = booleanValue(values, "overshoot", false);
    const frames = overshoot
      ? `0% { opacity: 0; transform: scale(${startScale}); } 68% { opacity: 1; transform: scale(1.04); } 100% { opacity: 1; transform: scale(1); }`
      : `from { opacity: 0; transform: scale(${startScale}); } to { opacity: 1; transform: scale(1); }`;
    return `${root} .motion-surface { animation: ${name} ${duration}ms ${ease} ${delay}ms both; transform-origin: var(--motion-transform-origin, center); }
@keyframes ${name} { ${frames} }`;
  }

  if (id === "reveal" || id === "blur") {
    const mode = stringValue(values, "reveal", id === "blur" ? "blur" : "clip");
    const blur = numberValue(values, "blur", 14);
    const from = mode === "blur"
      ? `opacity: 0; filter: blur(${blur}px); transform: translateY(${distance}px);`
      : mode === "mask"
        ? "opacity: 0; clip-path: inset(0 50% 0 50%);"
        : "opacity: 0; clip-path: inset(0 0 100% 0);";
    return `${root} .motion-surface { animation: ${name} ${duration}ms ${ease} ${delay}ms both; }
@keyframes ${name} { from { ${from} } to { opacity: 1; filter: blur(0); clip-path: inset(0); transform: none; } }`;
  }

  if (id === "stagger") {
    const stagger = numberValue(values, "stagger", 60);
    return `${root} .motion-list { display: grid; gap: 0.6rem; width: min(100%, 18rem); margin: 0; padding: 0; list-style: none; }
${root} .motion-list-item { padding: 0.8rem 1rem; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; animation: ${name} ${duration}ms ${ease} both; }
${root} .motion-list-item:nth-child(2) { animation-delay: ${stagger}ms; }
${root} .motion-list-item:nth-child(3) { animation-delay: ${stagger * 2}ms; }
${root} .motion-list-item:nth-child(4) { animation-delay: ${stagger * 3}ms; }
${root} .motion-list-item:nth-child(5) { animation-delay: ${stagger * 4}ms; }
${root} .motion-list-item:nth-child(6) { animation-delay: ${stagger * 5}ms; }
${root} .motion-list-item:nth-child(7) { animation-delay: ${stagger * 6}ms; }
${root} .motion-list-item:nth-child(8) { animation-delay: ${stagger * 7}ms; }
@keyframes ${name} { from { opacity: 0; transform: translateY(${distance}px); } to { opacity: 1; transform: none; } }`;
  }

  if (id === "keyframes") {
    const mode = stringValue(values, "mode", "keyframes");
    const steps = numberValue(values, "steps", 4);
    const fill = stringValue(values, "fill", "both");
    const timing = mode === "steps" ? `steps(${steps}, end)` : ease;
    const middle = mode === "tween" ? "" : "50% { transform: translateX(46px) rotate(4deg); }";
    return `${root} .motion-surface { animation: ${name} ${duration}ms ${timing} ${delay}ms 1 ${fill}; }
@keyframes ${name} { 0% { opacity: 0.45; transform: translateX(-46px); } ${middle} 100% { opacity: 1; transform: translateX(46px); } }`;
  }

  if (id === "duration") {
    return `${root} .motion-surface { animation: ${name} ${duration}ms ${ease} ${delay}ms both; }
@keyframes ${name} { from { opacity: 0.45; transform: translateX(-64px); } to { opacity: 1; transform: translateX(64px); } }`;
  }

  if (id === "translate") {
    const transform = stringValue(values, "transform", "translate");
    const angle = numberValue(values, "angle", 12);
    const startScale = numberValue(values, "scale", 92) / 100;
    const origin = stringValue(values, "origin", "center").replace("-", " ");
    const fromTransform = transform === "scale" ? `scale(${startScale})` : transform === "rotate" ? `rotate(${angle}deg)` : transform === "skew" ? `skewX(${angle}deg)` : transform === "perspective" ? `perspective(600px) rotateY(${angle}deg)` : `translateX(${distance}px)`;
    return `${root} .motion-surface { transform-origin: ${origin}; animation: ${name} ${duration}ms ${ease} both; }
@keyframes ${name} { from { opacity: 0.6; transform: ${fromTransform}; } to { opacity: 1; transform: none; } }`;
  }

  if (id === "3d-tilt-flip") {
    const angle = numberValue(values, "angle", 180);
    const perspective = numberValue(values, "perspective", 800);
    return `${root} { perspective: ${perspective}px; }
${root} .motion-flip { position: relative; width: 14rem; height: 9rem; transform-style: preserve-3d; animation: ${name} ${duration}ms ${ease} both; }
${root} .motion-face { position: absolute; inset: 0; display: grid; place-items: center; backface-visibility: hidden; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; }
${root} .motion-face--back { transform: rotateY(180deg); background: #18181b; color: white; }
@keyframes ${name} { from { transform: rotateY(0); } to { transform: rotateY(${angle}deg); } }`;
  }

  if (id === "origin-aware-animation") {
    const startScale = numberValue(values, "scale", 88) / 100;
    const origin = stringValue(values, "origin", "top-left").replace("-", " ");
    return `${root} .motion-surface { transform-origin: ${origin}; animation: ${name} ${duration}ms ${ease} both; }
@keyframes ${name} { from { opacity: 0; transform: scale(${startScale}); } to { opacity: 1; transform: scale(1); } }`;
  }

  if (id === "crossfade") {
    const overlap = numberValue(values, "overlap", 50);
    return `${root} .motion-state-stack { position: relative; width: min(100%, 18rem); height: 9rem; }
${root} .motion-state { position: absolute; inset: 0; display: grid; place-items: center; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; }
${root} .motion-state--from { animation: ${name}-out ${duration}ms linear both; }
${root} .motion-state--to { animation: ${name}-in ${duration}ms linear ${Math.round(duration * (1 - overlap / 100))}ms both; }
@keyframes ${name}-out { to { opacity: 0; } }
@keyframes ${name}-in { from { opacity: 0; } to { opacity: 1; } }`;
  }

  if (id === "morph") {
    const startScale = numberValue(values, "scale", 86) / 100;
    const mode = stringValue(values, "mode", "morph");
    const fromTransform = mode === "continuity"
      ? `translateX(-${Math.round(distance * 0.55)}px) scale(0.96)`
      : mode === "shared"
        ? `translate3d(-${distance}px, ${Math.round(distance * 0.3)}px, 0) scale(${Math.max(0.9, startScale)})`
        : mode === "layout"
          ? `translateX(-${distance}px) scaleX(${startScale})`
          : `translateX(-${Math.round(distance * 0.35)}px) scale(${startScale})`;
    const origin = mode === "layout" || mode === "continuity" ? "left center" : "center";
    return `${root} .motion-surface { width: min(100%, 18rem); transform-origin: ${origin}; animation: ${name} ${duration}ms ${ease} both; }
@keyframes ${name} { from { opacity: 0.65; transform: ${fromTransform}; } to { opacity: 1; transform: none; } }`;
  }

  if (id === "accordion-collapse") {
    const height = numberValue(values, "height", 140);
    return `${root} details { width: min(100%, 20rem); background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; }
${root} summary { padding: 1rem; cursor: pointer; font-weight: 650; }
${root} .motion-disclosure-content { min-height: ${height}px; padding: 0 1rem 1rem; overflow: hidden; }
${root} details[open] .motion-disclosure-content { animation: ${name} ${Math.min(duration, 240)}ms ${ease} both; }
@keyframes ${name} { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }`;
  }

  if (id === "direction-aware-transition" || id === "page-transition") {
    const direction = stringValue(values, "direction", "left");
    const from = directionTransform(direction, distance);
    const opposite = directionTransform(direction === "left" ? "right" : direction === "right" ? "left" : direction === "up" ? "down" : "up", distance);
    const viewTransition = id === "page-transition" ? `
::view-transition-old(root) { animation: ${name}-out ${duration}ms ${ease} both; }
::view-transition-new(root) { animation: ${name}-in ${duration}ms ${ease} both; }` : "";
    return `${root} .motion-state--from { animation: ${name}-out ${duration}ms ${ease} both; }
${root} .motion-state--to { animation: ${name}-in ${duration}ms ${ease} both; }${viewTransition}
@keyframes ${name}-out { to { opacity: 0; transform: ${opposite}; } }
@keyframes ${name}-in { from { opacity: 0; transform: ${from}; } to { opacity: 1; transform: none; } }`;
  }

  if (id === "scroll-reveal") {
    const threshold = numberValue(values, "threshold", 20);
    return `${root} { max-height: 15rem; overflow-y: auto; place-items: start center; }
${root} .motion-scroll-track { display: grid; place-items: center; gap: 10rem; width: 100%; min-height: 48rem; padding-block: 5rem; }
${root} .motion-surface { animation: ${name} ${duration}ms ${ease} both; }
@supports (animation-timeline: view()) {
  ${root} .motion-surface { animation-timeline: view(); animation-range: entry ${threshold}% cover ${Math.min(100, threshold + 35)}%; }
}
@keyframes ${name} { from { opacity: 0; transform: translateY(${distance}px); } to { opacity: 1; transform: none; } }`;
  }

  if (id === "scroll-driven-animation" || id === "parallax") {
    const axis = stringValue(values, "axis", "y");
    const start = numberValue(values, "start", 10);
    const end = numberValue(values, "end", 80);
    const speed = numberValue(values, "speed", 35) / 100;
    const travel = id === "parallax" ? Math.round(distance * speed) : distance;
    const translate = axis === "x" ? `translateX(${travel}px)` : `translateY(${travel}px)`;
    return `${root} { max-height: 15rem; overflow-y: auto; place-items: start center; }
${root} .motion-scroll-track { display: grid; place-items: center; gap: 10rem; width: 100%; min-height: 48rem; padding-block: 5rem; }
${root} .motion-surface { animation: ${name} linear both; animation-timeline: scroll(nearest); animation-range: ${start}% ${end}%; }
@keyframes ${name} { from { transform: ${translate}; } to { transform: none; } }
@supports not (animation-timeline: scroll()) { ${root} .motion-surface { animation: ${name} 700ms linear both; } }`;
  }

  if (id === "hover-effect") {
    const hoverScale = numberValue(values, "scale", 101) / 100;
    return `${root} .motion-button { transition: transform ${Math.min(duration, 180)}ms ${ease}; }
@media (hover: hover) and (pointer: fine) {
  ${root} .motion-button:hover { transform: translateY(-${distance}px) scale(${hoverScale}); box-shadow: 0 14px 28px rgb(0 0 0 / 16%); }
}`;
  }

  if (id === "press-tap-feedback") {
    const pressedScale = numberValue(values, "scale", 96) / 100;
    return `${root} .motion-button { transition: transform ${duration}ms ${ease}; }
${root} .motion-button:active { transform: scale(${pressedScale}); }`;
  }

  if (id === "hold-to-confirm") {
    const pressedScale = numberValue(values, "scale", 98) / 100;
    return `${root} .motion-button { position: relative; overflow: hidden; transition: transform 120ms cubic-bezier(0.23, 1, 0.32, 1), background-color 120ms ease-out; }
${root} .motion-button:active { transform: scale(${pressedScale}); }
${root} .motion-progress { position: absolute; inset: auto 0 0; height: 4px; pointer-events: none; background: #2563eb; clip-path: inset(0 100% 0 0); }
${root} .motion-button[data-state="holding"] { background: #1d4ed8; }
${root} .motion-button[data-state="complete"] { background: #166534; }`;
  }

  if (id === "drag-to-reorder") {
    return `${root} .motion-list { display: grid; gap: 0.5rem; width: min(100%, 18rem); margin: 0; padding: 0; list-style: none; }
${root} .motion-list-item { position: relative; padding: 0.85rem 1rem; touch-action: none; cursor: grab; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; }
${root} .motion-list-item.is-dragging { cursor: grabbing; box-shadow: 0 18px 34px rgb(0 0 0 / 18%); }
${root} .motion-list-item.is-drop-target { box-shadow: inset 0 2px #2563eb; }
${root} .motion-list-item.is-keyboard-dragging { outline: 3px solid rgb(37 99 235 / 32%); outline-offset: 3px; }
${root} .motion-drop-placeholder { min-height: 2.75rem; border: 1px dashed #2563eb; border-radius: 8px; background: rgb(37 99 235 / 8%); }`;
  }

  if (id === "swipe-to-dismiss") {
    return `${root} .motion-swipe-shell { width: min(100%, 18rem); text-align: center; }
${root} .motion-surface { width: 100%; touch-action: pan-y; user-select: none; }
${root} .motion-surface.is-dragging { cursor: grabbing; }
${root} .motion-undo-button[hidden] { display: none; }`;
  }

  if (id === "shake-wiggle") {
    const cycles = Math.round(numberValue(values, "cycles", 3));
    const points = Array.from({ length: cycles * 2 }, (_, index) => {
      const progress = Math.round(((index + 1) / (cycles * 2 + 1)) * 100);
      const travel = Math.round(distance * (1 - index / (cycles * 2 + 1))) * (index % 2 === 0 ? 1 : -1);
      return `${progress}% { transform: translateX(${travel}px); }`;
    }).join(" ");
    return `${root} .motion-surface { animation: ${name} ${Math.min(duration, 280)}ms cubic-bezier(0.77, 0, 0.175, 1) both; border-color: #b34d37; }
@keyframes ${name} { 0%, 100% { transform: none; } ${points} }`;
  }

  if (id === "ripple") {
    return `${root} .motion-button { position: relative; overflow: hidden; isolation: isolate; }
${root} .motion-button > :not(.motion-ripple-ink) { position: relative; z-index: 1; }`;
  }

  if (id === "easing") {
    return `${root} .motion-dot { width: 2rem; height: 2rem; background: #2563eb; border-radius: 50%; animation: ${name} ${duration}ms ${ease} infinite alternate; }
@keyframes ${name} { from { transform: translateX(-${distance / 2}px); } to { transform: translateX(${distance / 2}px); } }`;
  }

  if (id === "spring") {
    return `${root} .motion-surface[data-spring-target] { cursor: pointer; will-change: transform, opacity; }
${root} .motion-surface[data-spring-target]:focus-visible { outline: 3px solid rgb(37 99 235 / 32%); outline-offset: 3px; }`;
  }

  if (id === "loop") {
    const pause = numberValue(values, "pause", 160);
    const direction = stringValue(values, "direction", "normal");
    const iterations = booleanValue(values, "infinite", false) ? "infinite" : numberValue(values, "iterations", 3);
    return `${root} .motion-orbit-item { animation: ${name} ${duration + pause}ms cubic-bezier(0.77, 0, 0.175, 1) 0ms ${iterations} ${direction}; }
@keyframes ${name} { 0%, 18% { transform: translateX(-54px); } 82%, 100% { transform: translateX(54px); } }`;
  }

  if (id === "marquee") {
    const gap = numberValue(values, "gap", 32);
    const direction = stringValue(values, "direction", "left") === "right" ? "reverse" : "normal";
    return `${root} .motion-marquee { display: flex; width: 100%; overflow: hidden; }
${root} .motion-marquee-track { display: flex; flex: none; gap: ${gap}px; min-width: max-content; animation: ${name} ${duration}ms linear infinite ${direction}; }
${root} .motion-marquee-item { padding: 0.75rem 1rem; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 999px; }
${booleanValue(values, "pauseOnHover", true) ? `${root} .motion-marquee:focus-within .motion-marquee-track { animation-play-state: paused; }
@media (hover: hover) and (pointer: fine) { ${root} .motion-marquee:hover .motion-marquee-track { animation-play-state: paused; } }` : ""}
@keyframes ${name} { to { transform: translateX(calc(-50% - ${gap / 2}px)); } }`;
  }

  if (id === "orbit") {
    const radius = numberValue(values, "radius", 56);
    const direction = stringValue(values, "direction", "normal");
    return `${root} .motion-orbit { position: relative; width: ${radius * 2}px; aspect-ratio: 1; border: 1px dashed #a1a1aa; border-radius: 50%; }
${root} .motion-orbit-item { position: absolute; left: 50%; top: 50%; width: 1.4rem; height: 1.4rem; margin: -0.7rem; background: #2563eb; border-radius: 50%; animation: ${name} ${duration}ms linear infinite ${direction}; }
@keyframes ${name} { from { transform: rotate(0) translateX(${radius}px); } to { transform: rotate(360deg) translateX(${radius}px); } }`;
  }

  if (id === "idle-animation") {
    const style = stringValue(values, "style", "float");
    const pause = numberValue(values, "pause", 300);
    const frames = style === "pulse" ? "50% { opacity: 0.72; transform: scale(0.96); }" : `50% { transform: translateY(-${distance}px); }`;
    return `${root} .motion-surface { animation: ${name} ${duration + pause}ms cubic-bezier(0.77, 0, 0.175, 1) infinite; }
@keyframes ${name} { 0%, 100% { opacity: 1; transform: none; } ${frames} }`;
  }

  if (id === "before-after-slider") {
    const position = numberValue(values, "position", 50);
    return `${root} .motion-comparison { position: relative; width: min(100%, 22rem); aspect-ratio: 16 / 9; overflow: hidden; border-radius: 8px; background: #52525b; }
${root} .motion-before, ${root} .motion-after { position: absolute; inset: 0; display: grid; place-items: center; color: white; }
${root} .motion-after { overflow: hidden; background: #2563eb; clip-path: inset(0 ${100 - position}% 0 0); }
${root} .motion-divider { position: absolute; inset: 0 auto 0 0; width: 2px; pointer-events: none; background: white; box-shadow: 0 0 0 1px rgb(0 0 0 / 18%); transform: translate3d(0, 0, 0); }
${root} .motion-divider::after { content: "↔"; position: absolute; top: 50%; left: 50%; width: 2.25rem; height: 2.25rem; display: grid; place-items: center; color: #18181b; background: white; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 8px rgb(0 0 0 / 18%); }
${root} .motion-comparison-control { position: absolute; inset: 0; z-index: 2; width: 100%; height: 100%; margin: 0; cursor: ew-resize; opacity: 0; }`;
  }

  if (id === "line-drawing") {
    return `${root} .motion-path { fill: none; stroke: #2563eb; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 260; stroke-dashoffset: 260; animation: ${name} ${duration}ms ${ease} ${delay}ms both; }
@keyframes ${name} { to { stroke-dashoffset: 0; } }`;
  }

  if (id === "text-morph") {
    const blur = numberValue(values, "blur", 8);
    return `${root} .motion-word { position: absolute; font-size: 2rem; font-weight: 700; animation: ${name} ${duration}ms ${ease} ${delay}ms both; }
${root} .motion-word--from { animation-name: ${name}-out; }
@keyframes ${name} { from { opacity: 0; filter: blur(${blur}px); transform: translateY(0.35em); } to { opacity: 1; filter: blur(0); transform: none; } }
@keyframes ${name}-out { to { opacity: 0; filter: blur(${blur}px); transform: translateY(-0.35em); } }`;
  }

  if (id === "skeleton-shimmer") {
    const intensity = numberValue(values, "intensity", 14);
    return `${root} .motion-skeleton { display: grid; gap: 0.7rem; width: min(100%, 18rem); }
${root} .motion-skeleton-line { height: 0.8rem; overflow: hidden; background: #e4e4e7; border-radius: 999px; }
${root} .motion-skeleton-line::after { content: ""; display: block; width: 45%; height: 100%; background: linear-gradient(90deg, transparent, rgb(255 255 255 / ${intensity / 100}), transparent); animation: ${name} ${duration}ms linear infinite; }
@keyframes ${name} { from { transform: translateX(-120%); } to { transform: translateX(280%); } }`;
  }

  if (id === "number-ticker") {
    return `${root} .motion-number { height: 1.2em; overflow: hidden; font: 700 3rem/1.2 ui-monospace, monospace; font-variant-numeric: tabular-nums; }
${root} .motion-number-track { display: grid; animation: ${name} ${duration}ms ${ease} both; }
@keyframes ${name} { from { transform: translateY(${distance}px); opacity: 0; } to { transform: none; opacity: 1; } }`;
  }

  if (id === "typewriter") {
    const characters = Math.round(numberValue(values, "characters", 18));
    const caret = booleanValue(values, "caret", true);
    return `${root} .motion-typewriter { position: relative; max-width: ${characters}ch; overflow: hidden; white-space: nowrap; font: 650 1.4rem/1.4 ui-monospace, monospace; animation: ${name} ${duration}ms steps(${characters}, end) both; }
${caret ? `${root} .motion-typewriter::after { content: ""; display: inline-block; width: 2px; height: 1em; margin-left: 0.08em; vertical-align: -0.12em; background: #2563eb; animation: ${name}-caret 700ms step-end infinite; }` : ""}
@keyframes ${name} { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0); } }
@keyframes ${name}-caret { 50% { opacity: 0; } }`;
  }

  if (id === "compositing") {
    const property = stringValue(values, "property", "transform");
    const from = property === "left" ? `left: -${distance}px;` : property === "opacity" ? "opacity: 0;" : `transform: translateX(-${distance}px);`;
    const to = property === "left" ? `left: ${distance}px;` : property === "opacity" ? "opacity: 1;" : `transform: translateX(${distance}px);`;
    return `${root} .motion-surface { position: relative; animation: ${name} ${duration}ms ${ease} infinite alternate; }
@keyframes ${name} { from { ${from} } to { ${to} } }`;
  }

  if (id === "anticipation") {
    const anticipation = numberValue(values, "anticipation", 18) / 100;
    const followThrough = numberValue(values, "followThrough", 12) / 100;
    return `${root} .motion-surface { animation: ${name} ${duration}ms ${ease} both; }
@keyframes ${name} { 0% { transform: none; } 18% { transform: translateX(-${Math.round(distance * anticipation)}px) scaleX(${(1 - anticipation / 4).toFixed(3)}); } 72% { transform: translateX(${distance}px) scaleX(${(1 + followThrough / 3).toFixed(3)}); } 88% { transform: translateX(${Math.round(distance * (1 - followThrough))}px); } 100% { transform: translateX(${distance}px); } }`;
  }

  return `${root} .motion-guide { max-width: 26rem; padding: 1.25rem; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; box-shadow: inset 0 3px #2563eb; }
${root} .motion-guide strong { display: block; margin-bottom: 0.5rem; }`;
}

export function buildRecipeCss(recipe: MotionRecipe, values: ParamValues) {
  const root = rootSelector(recipe);
  const name = `motion-${classToken(getMotionSpec(recipe).canonicalId)}`;
  return [baseCss(root), behaviorCss(recipe, values), reducedMotionCss(root, name)].join("\n\n");
}

export function buildRecipeJs(recipe: MotionRecipe, values: ParamValues) {
  return buildMotionRuntimeSource(getMotionRuntimeConfig(recipe, values));
}

function surfaceMarkup(label: string) {
  return `<article class="motion-surface">
    <strong>${label}</strong>
    <span class="motion-line"></span>
    <span class="motion-line"></span>
  </article>`;
}

export function buildRecipeHtml(
  recipe: MotionRecipe,
  inputValues: ParamValues = {},
  locale: Locale = "en"
) {
  const spec = getMotionSpec(recipe);
  const id = spec.canonicalId;
  const values = resolvedValues(recipe, inputValues);
  const label = escapeHtml(text(recipe.name, locale));
  const root = `motion-demo motion-demo--${classToken(id)}`;
  const copy = locale === "zh"
    ? {
        item: "项目",
        front: "正面",
        back: "背面",
        previous: "上一状态",
        disclosure: "展开内容可通过键盘和辅助技术正常访问。",
        scroll: "滚动",
        continue: "继续",
        drag: "拖动项目",
        motion: "动态",
        interface: "界面",
        before: "调整前",
        after: "调整后",
        plan: "规划",
        build: "构建",
        loading: "内容加载中",
        typewriter: "让动态清晰可读。",
        demo: "示例",
        replay: "重播动效",
        pause: "暂停动效",
        resume: "继续动效",
        dismiss: "关闭",
        undo: "撤销关闭",
        restored: "内容已恢复",
        confirmed: "已确认",
        hold: "持续按住以确认",
        cancelled: "操作已取消",
        comparison: "前后对比分割位置",
        pickup: "已拾取项目，使用上下方向键移动，空格键放下",
        dropped: "项目已移动",
        move: "项目位置",
        dismissed: "内容已关闭",
        reorderInstructions: "按住并拖动排序；键盘用户按空格键拾取，再用上下方向键移动。",
        swipeInstructions: "水平滑动关闭；键盘用户按 Delete 键关闭。"
      }
    : {
        item: "Item",
        front: "Front",
        back: "Back",
        previous: "Previous",
        disclosure: "Expandable content remains available to keyboard and assistive technology users.",
        scroll: "Scroll",
        continue: "Continue",
        drag: "Drag item",
        motion: "Motion",
        interface: "Interface",
        before: "Before",
        after: "After",
        plan: "Plan",
        build: "Build",
        loading: "Loading content",
        typewriter: "Motion, made legible.",
        demo: "demo",
        replay: "Replay motion",
        pause: "Pause motion",
        resume: "Resume motion",
        dismiss: "Dismiss",
        undo: "Undo dismissal",
        restored: "Item restored",
        confirmed: "Confirmed",
        hold: "Keep holding to confirm",
        cancelled: "Action cancelled",
        comparison: "Before and after divider position",
        pickup: "Item picked up. Use arrow keys to move and Space to drop.",
        dropped: "Item moved",
        move: "Item position",
        dismissed: "Item dismissed",
        reorderInstructions: "Press and drag to reorder. Keyboard users can press Space, then move with the arrow keys.",
        swipeInstructions: "Swipe horizontally to dismiss. Keyboard users can press Delete."
      };
  const withReplay = (scene: string) => `<div class="motion-replay-scene">
    ${scene}
    <div class="motion-action-row"><button class="motion-replay-button" type="button" data-motion-replay>${copy.replay}</button></div>
  </div>`;
  const withPause = (scene: string) => `<div class="motion-pausable-scene">
    ${scene}
    <div class="motion-action-row"><button class="motion-pause-button" type="button" data-motion-pause data-pause-label="${copy.pause}" data-resume-label="${copy.resume}" aria-pressed="false" aria-disabled="true" disabled><span data-motion-pause-label>${copy.pause}</span></button></div>
  </div>`;
  let content = surfaceMarkup(label);

  if (id === "stagger") {
    const count = Math.round(numberValue(values, "count", 4));
    content = `<ol class="motion-list">${Array.from({ length: count }, (_, index) => `<li class="motion-list-item">${copy.item} ${index + 1}</li>`).join("")}</ol>`;
  } else if (id === "3d-tilt-flip") {
    content = withReplay(`<div class="motion-flip"><article class="motion-face motion-face--front">${copy.front}</article><article class="motion-face motion-face--back">${copy.back}</article></div>`);
  } else if (id === "crossfade" || id === "direction-aware-transition" || id === "page-transition") {
    content = withReplay(`<div class="motion-state-stack"><article class="motion-state motion-state--from">${copy.previous}</article><article class="motion-state motion-state--to">${label}</article></div>`);
  } else if (id === "morph") {
    content = withReplay(surfaceMarkup(label));
  } else if (id === "accordion-collapse") {
    content = `<details open><summary>${label}</summary><div class="motion-disclosure-content">${copy.disclosure}</div></details>`;
  } else if (id === "scroll-driven-animation" || id === "parallax" || id === "scroll-reveal") {
    content = `<div class="motion-scroll-track"><span>${copy.scroll}</span>${surfaceMarkup(label)}<span>${copy.continue}</span></div>`;
  } else if (id === "hold-to-confirm") {
    content = `<div><button class="motion-button" type="button" data-hold-button data-idle-label="${label}" data-complete-label="${copy.confirmed}" data-hold-message="${copy.hold}" data-cancel-label="${copy.cancelled}" aria-pressed="false"><span data-hold-label>${label}</span><span class="motion-progress" data-hold-progress aria-hidden="true"></span></button><span class="motion-status" data-motion-status role="status" aria-live="polite"></span></div>`;
  } else if (id === "ripple") {
    content = `<button class="motion-button" type="button" data-ripple-button><span>${label}</span></button>`;
  } else if (["hover-effect", "press-tap-feedback"].includes(id)) {
    content = `<button class="motion-button" type="button">${label}</button>`;
  } else if (id === "drag-to-reorder") {
    content = `<div><ul class="motion-list" role="listbox" aria-label="${copy.reorderInstructions}" data-reorder-list>${["A", "B", "C"].map((suffix) => `<li class="motion-list-item" role="option" tabindex="0" aria-grabbed="false" data-reorder-item data-pickup-label="${copy.pickup}" data-drop-label="${copy.dropped}" data-move-label="${copy.move}" data-cancel-label="${copy.cancelled}">${copy.drag} ${suffix}</li>`).join("")}</ul><span class="motion-status" data-motion-status role="status" aria-live="assertive"></span></div>`;
  } else if (id === "swipe-to-dismiss") {
    content = `<div class="motion-swipe-shell"><article class="motion-surface" tabindex="0" data-swipe-target data-dismiss-label="${copy.dismissed}" aria-label="${label}. ${copy.swipeInstructions}"><strong>${label}</strong><span class="motion-line"></span><span class="motion-line"></span></article><div class="motion-action-row"><button class="motion-dismiss-button" type="button" data-swipe-dismiss>${copy.dismiss}</button><button class="motion-undo-button" type="button" data-swipe-undo data-restore-label="${copy.restored}" hidden>${copy.undo}</button></div><span class="motion-status" data-motion-status role="status" aria-live="polite"></span></div>`;
  } else if (id === "easing") {
    content = withPause(`<div class="motion-dot" role="img" aria-label="${label}"></div>`);
  } else if (id === "loop") {
    content = withPause(`<div class="motion-orbit-item" aria-label="${label}">●</div>`);
  } else if (id === "marquee") {
    content = withPause(`<div class="motion-marquee" tabindex="0"><div class="motion-marquee-track"><span class="motion-marquee-item">${label}</span><span class="motion-marquee-item">${copy.motion}</span><span class="motion-marquee-item">${copy.interface}</span><span class="motion-marquee-item" aria-hidden="true">${label}</span><span class="motion-marquee-item" aria-hidden="true">${copy.motion}</span><span class="motion-marquee-item" aria-hidden="true">${copy.interface}</span></div></div>`);
  } else if (id === "orbit") {
    content = withPause(`<div class="motion-orbit" aria-label="${label}"><span class="motion-orbit-item"></span></div>`);
  } else if (id === "idle-animation") {
    content = withPause(surfaceMarkup(label));
  } else if (id === "before-after-slider") {
    const position = numberValue(values, "position", 50);
    content = `<figure class="motion-comparison" data-comparison><div class="motion-before">${copy.before}</div><div class="motion-after" data-comparison-after>${copy.after}</div><span class="motion-divider" data-comparison-divider aria-hidden="true"></span><input class="motion-comparison-control" type="range" min="0" max="100" step="1" value="${position}" aria-label="${copy.comparison}" data-comparison-input></figure>`;
  } else if (id === "line-drawing") {
    content = `<svg viewBox="0 0 240 120" role="img" aria-label="${label}"><path class="motion-path" d="M20 92 C54 16 104 18 126 67 S192 112 220 30"></path></svg>`;
  } else if (id === "text-morph") {
    content = withReplay(`<div class="motion-text-stack" role="status" aria-label="${label}"><span class="motion-word motion-word--from" aria-hidden="true">${copy.plan}</span><span class="motion-word">${copy.build}</span></div>`);
  } else if (id === "skeleton-shimmer") {
    content = withPause(`<div class="motion-skeleton" role="status" aria-label="${copy.loading}"><span class="motion-skeleton-line"></span><span class="motion-skeleton-line"></span><span class="motion-skeleton-line"></span></div>`);
  } else if (id === "number-ticker") {
    content = withReplay(`<div class="motion-number" aria-label="128"><span class="motion-number-track">128</span></div>`);
  } else if (id === "typewriter") {
    content = `<p class="motion-typewriter" aria-label="${copy.typewriter}">${copy.typewriter}</p>`;
  } else if (id === "spring") {
    content = `<div class="motion-replay-scene"><button class="motion-surface" type="button" data-spring-target><strong>${label}</strong><span class="motion-line"></span><span class="motion-line"></span></button><div class="motion-action-row"><button class="motion-replay-button" type="button" data-motion-replay>${copy.replay}</button></div></div>`;
  } else if (spec.scene === "guide") {
    content = `<article class="motion-guide"><strong>${label}</strong><span>${escapeHtml(text(spec.metadata.summary, locale))}</span></article>`;
  }

  return `<div class="${root}" data-motion="${classToken(id)}" aria-label="${label} ${copy.demo}">
  ${content}
</div>`;
}

function triggerInstruction(canonicalId: string, locale: Locale) {
  const interactive = [
    "hover-effect",
    "press-tap-feedback",
    "hold-to-confirm",
    "drag-to-reorder",
    "swipe-to-dismiss",
    "ripple",
    "before-after-slider"
  ];
  const scroll = ["scroll-reveal", "scroll-driven-animation", "parallax"];
  const loops = ["loop", "marquee", "orbit", "idle-animation", "skeleton-shimmer"];
  if (locale === "zh") {
    if (interactive.includes(canonicalId)) return "由真实的指针、触摸或键盘交互触发";
    if (scroll.includes(canonicalId)) return "由视口进入或滚动进度驱动";
    if (loops.includes(canonicalId)) return "循环期间支持暂停，并控制持续动态的干扰";
    return "在状态发生变化时触发一次，并允许重新播放";
  }
  if (interactive.includes(canonicalId)) return "Trigger it from real pointer, touch, or keyboard interaction";
  if (scroll.includes(canonicalId)) return "Drive it from viewport entry or scroll progress";
  if (loops.includes(canonicalId)) return "Keep continuous motion pausable and low-distraction";
  return "Trigger it once when state changes and keep it replayable";
}

export function getRecipeTeachingNotice(
  recipe: MotionRecipe,
  inputValues: ParamValues,
  locale: Locale
) {
  const values = resolvedValues(recipe, inputValues);
  const id = getMotionSpec(recipe).canonicalId;
  if (id === "easing" && stringValue(values, "ease", "ease-out") === "ease-in") {
    return locale === "zh"
      ? "教学对照：ease-in 用于观察迟缓的起步感，不用于响应用户的生产 UI。"
      : "Teaching comparison: ease-in demonstrates a sluggish start and is not for production UI that responds to users.";
  }
  if (id === "compositing" && stringValue(values, "property", "transform") === "left") {
    return locale === "zh"
      ? "教学对照：left 会逐帧触发布局，仅用于性能对比；生产实现请选择 transform。"
      : "Teaching comparison: left triggers layout on every frame and is shown only for profiling; use transform in production.";
  }
  return "";
}

export function buildRecipePrompt(
  recipe: MotionRecipe,
  inputValues: ParamValues,
  locale: Locale
) {
  const spec = getMotionSpec(recipe);
  const values = resolvedValues(recipe, inputValues);
  const parameters = recipe.params.map((param) => {
    const value = values[param.id];
    return `${text(param.label, locale)} ${getParamDisplayValue(param, value)}`;
  }).join(locale === "zh" ? "、" : ", ");
  const selector = `.motion-demo--${classToken(spec.canonicalId)}`;
  const trigger = triggerInstruction(spec.canonicalId, locale);
  const summary = text(spec.metadata.summary, locale);
  const needsRuntime = buildRecipeJs(recipe, values).length > 0;
  const teachingNotice = getRecipeTeachingNotice(recipe, values, locale);

  if (locale === "zh") {
    return `${teachingNotice ? `${teachingNotice} ` : ""}实现「${text(recipe.name, locale)}」：${summary}${parameters ? ` 参数设为${parameters}。` : ""}${trigger}。使用语义化 HTML，CSS 作用域限定在 ${selector}${needsRuntime ? "，并挂载随组件提供的原生 JavaScript 交互运行时" : ""}。为 prefers-reduced-motion 和 .force-reduced-motion 提供等价的低动态方案。`;
  }

  return `${teachingNotice ? `${teachingNotice} ` : ""}Implement ${text(recipe.name, locale)}: ${summary}${parameters ? ` Use ${parameters}.` : ""} ${trigger}. Use semantic HTML, scope CSS to ${selector}${needsRuntime ? ", and mount the provided vanilla JavaScript interaction runtime" : ""}. Provide equivalent low-motion behavior for prefers-reduced-motion and .force-reduced-motion.`;
}

export function buildCopyBundle(
  recipe: MotionRecipe,
  values: ParamValues,
  locale: Locale
) {
  const js = buildRecipeJs(recipe, values);
  return [
    "/* Prompt */",
    buildRecipePrompt(recipe, values, locale),
    "",
    "<!-- HTML -->",
    buildRecipeHtml(recipe, values, locale),
    ...(js ? ["", "/* JavaScript */", js] : []),
    "",
    "/* CSS */",
    buildRecipeCss(recipe, values)
  ].join("\n");
}

export function createRecipeSearchIndex(recipe: MotionRecipe, locale: Locale) {
  const glossaryTerms = getGlossaryTermsForCanonical(recipe.canonicalId);
  return [
    text(recipe.name, locale),
    text(recipe.shortDescription, locale),
    text(recipe.definition, locale),
    ...recipe.usage.map((usage) => text(usage, locale)),
    ...recipe.examples.map((example) => text(example, locale)),
    recipe.source.term,
    recipe.source.definition,
    recipe.id,
    recipe.categoryId,
    ...glossaryTerms.flatMap((term) => [
      term.id,
      term.name.zh,
      term.name.en,
      term.definition.zh,
      term.definition.en,
      term.distinction?.zh ?? "",
      term.distinction?.en ?? ""
    ])
  ]
    .join(" ")
    .toLowerCase();
}
