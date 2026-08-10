import type { MotionRecipe, ParamValue, ParamValues } from "../data/types";
import { getPrimitiveRegistryEntry } from "../data/primitive-registry";

type MotionShape = Record<string, number | string | number[] | string[]>;

function numberValue(values: ParamValues, key: string, fallback: number) {
  const value = values[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringValue(values: ParamValues, key: string, fallback: string) {
  const value = values[key];
  return typeof value === "string" ? value : fallback;
}

function booleanValue(values: ParamValues, key: string, fallback: boolean) {
  const value = values[key];
  return typeof value === "boolean" ? value : fallback;
}

function sourceObject(value: MotionShape) {
  return JSON.stringify(value).replace(/"([a-zA-Z_$][\w$]*)":/g, "$1: ");
}

function easingSource(value: ParamValue | undefined) {
  const easing = typeof value === "string" ? value : "ease-out";
  if (easing === "linear") return '"linear"';
  if (easing === "ease-in") return '"easeIn"';
  if (easing === "ease-in-out") return '"easeInOut"';
  if (easing === "soft") return "[0.23, 1, 0.32, 1]";
  if (easing === "crisp") return "[0.2, 0.8, 0.2, 1]";
  if (easing === "smooth") return "[0.4, 0, 0.2, 1]";
  return "[0.23, 1, 0.32, 1]";
}

function transitionSource(recipe: MotionRecipe, values: ParamValues, repeat = false) {
  if (recipe.id === "spring") {
    const stiffness = numberValue(values, "stiffness", 180);
    const damping = numberValue(values, "damping", 22);
    const mass = numberValue(values, "mass", 1);
    return `{ type: "spring", stiffness: ${stiffness}, damping: ${damping}, mass: ${mass} }`;
  }
  const duration = numberValue(values, "duration", recipe.surfaceType === "playground" ? 520 : 220) / 1000;
  const delay = numberValue(values, "delay", 0) / 1000;
  return `{ duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)}${delay ? `, delay: ${Number(delay.toFixed(3))}` : ""}${repeat ? ', repeat: Infinity, repeatType: "mirror"' : ""} }`;
}

function wrapperSource(
  exportName: string,
  initial: MotionShape,
  animate: MotionShape,
  transition: string,
  extra = ""
) {
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type ${exportName}Props = ComponentProps<typeof motion.div>;

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : ${sourceObject(initial)}}
      animate={${sourceObject(animate)}}
      transition={reduceMotion ? { duration: 0.12 } : ${transition}}
      ${extra}
    >
      {children}
    </motion.div>
  );
}
`;
}

function interactionSource(
  exportName: string,
  interaction: "hover" | "tap" | "drag" | "inView" | "layout",
  target: MotionShape,
  transition: string
) {
  const prop = interaction === "hover"
    ? "whileHover"
    : interaction === "tap"
      ? "whileTap"
      : interaction === "inView"
        ? "whileInView"
        : interaction === "layout"
          ? "animate"
          : "whileDrag";
  const support = interaction === "drag"
    ? '\n      drag="x"\n      dragConstraints={{ left: 0, right: 0 }}\n      dragElastic={0.18}'
    : interaction === "inView"
      ? '\n      initial={reduceMotion ? false : { opacity: 0, y: 18 }}\n      viewport={{ once: true, amount: 0.5 }}'
      : interaction === "layout"
        ? "\n      layout"
        : "";

  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type ${exportName}Props = ComponentProps<typeof motion.div>;

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      {...props}${support}
      ${prop}={reduceMotion ? undefined : ${sourceObject(target)}}
      transition={reduceMotion ? { duration: 0.12 } : ${transition}}
    >
      {children}
    </motion.div>
  );
}
`;
}

function staggerSource(exportName: string, values: ParamValues) {
  const interval = numberValue(values, "stagger", 55) / 1000;
  const transition = `{ duration: ${numberValue(values, "duration", 220) / 1000}, ease: ${easingSource(values.ease)} }`;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ${exportName}({ items }: { items: ReactNode[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : ${Number(interval.toFixed(3))} } } }}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={reduceMotion ? { duration: 0.12 } : ${transition}}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
`;
}

function lineDrawingSource(exportName: string, recipe: MotionRecipe, values: ParamValues) {
  return `"use client";

import { motion, useReducedMotion } from "motion/react";

export function ${exportName}() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.path
        d="m5 12 4 4 10-10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduceMotion ? { duration: 0.12 } : ${transitionSource(recipe, values)}}
      />
    </motion.svg>
  );
}
`;
}

function accordionSource(exportName: string, recipe: MotionRecipe, values: ParamValues) {
  return `"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ${exportName}({ open, children }: { open: boolean; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0.12 } : ${transitionSource(recipe, values)}}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
`;
}

export function buildPrimitiveSource(recipe: MotionRecipe, values: ParamValues) {
  const entry = getPrimitiveRegistryEntry(recipe.id);
  const exportName = entry?.exportName ?? "MotionPrimitive";
  const duration = transitionSource(recipe, values);
  const distance = numberValue(values, "distance", 28);
  const scale = numberValue(values, "scale", 92) / 100;

  if (recipe.id === "stagger") return staggerSource(exportName, values);
  if (recipe.id === "accordion-collapse") return accordionSource(exportName, recipe, values);
  if (recipe.id === "line-drawing") return lineDrawingSource(exportName, recipe, values);

  if (["hover-effect", "3d-tilt-flip"].includes(recipe.id)) {
    const target: MotionShape = recipe.id === "3d-tilt-flip"
      ? { rotateX: -4, rotateY: 7, y: -3 }
      : { y: -3, scale: 1.015 };
    return interactionSource(exportName, "hover", target, duration);
  }
  if (["press-tap-feedback", "hold-to-confirm", "ripple"].includes(recipe.id)) {
    return interactionSource(exportName, "tap", { scale: recipe.id === "ripple" ? 0.98 : 0.97 }, duration);
  }
  if (["drag-to-reorder", "swipe-to-dismiss", "before-after-slider"].includes(recipe.id)) {
    return interactionSource(exportName, "drag", { scale: 1.015 }, `{ type: "spring", stiffness: 360, damping: 30 }`);
  }
  if (recipe.id === "scroll-reveal") {
    return interactionSource(exportName, "inView", { opacity: 1, y: 0 }, duration);
  }
  if (["morph", "direction-aware-transition", "page-transition"].includes(recipe.id)) {
    return interactionSource(exportName, "layout", { opacity: 1 }, `{ type: "spring", stiffness: 260, damping: 28 }`);
  }

  const repeat = ["loop", "marquee", "orbit", "idle-animation"].includes(recipe.id);
  const shapes: Record<string, { initial: MotionShape; animate: MotionShape }> = {
    "fade-in-fade-out": { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "slide-in": { initial: { opacity: 0, x: distance }, animate: { opacity: 1, x: 0 } },
    "scale-in": { initial: { opacity: 0, scale }, animate: { opacity: 1, scale: 1 } },
    "reveal": { initial: { opacity: 0, y: 12, clipPath: "inset(0 0 100% 0)" }, animate: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" } },
    "keyframes": { initial: { opacity: 0.5, x: 0 }, animate: { opacity: [0.5, 1, 1], x: [0, distance, 0] } },
    "duration": { initial: { x: 0 }, animate: { x: distance } },
    "translate": { initial: { x: distance, rotate: numberValue(values, "angle", 0) }, animate: { x: 0, rotate: 0 } },
    "origin-aware-animation": { initial: { opacity: 0, scale: 0.88, transformOrigin: stringValue(values, "origin", "top left") }, animate: { opacity: 1, scale: 1 } },
    "crossfade": { initial: { opacity: 0 }, animate: { opacity: 1 } },
    "scroll-driven-animation": { initial: { y: distance }, animate: { y: -distance } },
    "parallax": { initial: { y: distance / 2 }, animate: { y: -distance / 2 } },
    "shake-wiggle": { initial: { x: 0 }, animate: { x: [0, -7, 6, -4, 3, 0] } },
    "easing": { initial: { x: -distance }, animate: { x: distance } },
    "spring": { initial: { x: -distance }, animate: { x: distance } },
    "loop": { initial: { rotate: -8 }, animate: { rotate: 8 } },
    "marquee": { initial: { x: "0%" }, animate: { x: "-50%" } },
    "orbit": { initial: { rotate: 0 }, animate: { rotate: 360 } },
    "idle-animation": { initial: { y: 0, scale: 1 }, animate: { y: [-2, 2, -2], scale: [1, 1.02, 1] } },
    "blur": { initial: { opacity: 0, filter: `blur(${numberValue(values, "blur", 12)}px)` }, animate: { opacity: 1, filter: "blur(0px)" } },
    "text-morph": { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
    "skeleton-shimmer": { initial: { backgroundPosition: "120% 0" }, animate: { backgroundPosition: "-120% 0" } },
    "number-ticker": { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } },
    "typewriter": { initial: { clipPath: "inset(0 100% 0 0)" }, animate: { clipPath: "inset(0 0% 0 0)" } },
    "compositing": { initial: { x: -distance, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    "anticipation": { initial: { scale: 1 }, animate: { scale: [1, 0.96, 1.04, 1] } }
  };
  const shape = shapes[recipe.id] ?? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
  const transition = repeat ? transitionSource(recipe, values, true) : duration;
  const extra = repeat ? 'aria-hidden="true"' : booleanValue(values, "layout", false) ? "layout" : "";
  return wrapperSource(exportName, shape.initial, shape.animate, transition, extra);
}
