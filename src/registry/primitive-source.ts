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

function transitionSource(recipe: MotionRecipe, values: ParamValues) {
  if (recipe.id === "spring") {
    const stiffness = numberValue(values, "stiffness", 180);
    const damping = numberValue(values, "damping", 22);
    const mass = numberValue(values, "mass", 1);
    return `{ type: "spring", stiffness: ${stiffness}, damping: ${damping}, mass: ${mass} }`;
  }
  const duration = numberValue(values, "duration", recipe.surfaceType === "playground" ? 520 : 220) / 1000;
  const delay = numberValue(values, "delay", 0) / 1000;
  return `{ duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)}${delay ? `, delay: ${Number(delay.toFixed(3))}` : ""} }`;
}

function repeatTransitionSource(recipe: MotionRecipe, values: ParamValues) {
  const duration = numberValue(values, "duration", 1400) / 1000;
  const pause = numberValue(values, "pause", 0) / 1000;
  const finiteIterations = Math.max(1, Math.round(numberValue(values, "iterations", 3)));
  const infinite = recipe.id === "loop" ? booleanValue(values, "infinite", false) : true;
  const direction = stringValue(values, "direction", "normal");
  const repeatType = direction === "alternate" || recipe.id === "idle-animation" ? "reverse" : "loop";
  const repeat = infinite ? "Infinity" : String(finiteIterations - 1);
  return `{ duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)}, repeat: ${repeat}, repeatType: "${repeatType}"${pause ? `, repeatDelay: ${Number(pause.toFixed(3))}` : ""} }`;
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

function holdToConfirmSource(exportName: string, values: ParamValues) {
  const holdMs = numberValue(values, "duration", 1200);
  const pressedScale = numberValue(values, "activeScale", 98) / 100;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";

export type ${exportName}Props = Omit<ComponentProps<typeof motion.button>, "children" | "onPointerDown" | "onPointerUp" | "onPointerCancel" | "onPointerLeave" | "onKeyDown" | "onKeyUp"> & {
  children: ReactNode;
  holdMs?: number;
  onConfirm: () => void;
};

export function ${exportName}({ children, holdMs = ${holdMs}, onConfirm, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holding, setHolding] = useState(false);

  function cancelHold() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }

  function startHold() {
    if (props.disabled || timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onConfirm();
    }, holdMs);
  }

  useEffect(() => cancelHold, []);

  return (
    <motion.button
      {...props}
      type={props.type ?? "button"}
      aria-pressed={holding}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerCancel={cancelHold}
      onPointerLeave={cancelHold}
      onKeyDown={(event) => {
        if ((event.key === " " || event.key === "Enter") && !event.repeat) {
          event.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") cancelHold();
      }}
      whileTap={reduceMotion ? undefined : { scale: ${pressedScale} }}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ scaleX: holding ? 1 : 0, opacity: holding ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0.12 } : { duration: holding ? holdMs / 1000 : 0.14, ease: "linear" }}
        style={{ position: "absolute", inset: 0, transformOrigin: "left", pointerEvents: "none" }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </motion.button>
  );
}
`;
}

function swipeToDismissSource(exportName: string, values: ParamValues) {
  const threshold = numberValue(values, "distance", 96);
  const resistance = numberValue(values, "resistance", 65);
  const duration = numberValue(values, "duration", 240) / 1000;
  const elastic = Number(Math.max(0.08, 1 - resistance / 100).toFixed(2));
  return `"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useState } from "react";
import type { ComponentProps, PanInfo, ReactNode } from "react";

export type ${exportName}Props = Omit<ComponentProps<typeof motion.div>, "children" | "onDragEnd"> & {
  children: ReactNode;
  onDismiss?: () => void;
  threshold?: number;
};

export function ${exportName}({ children, onDismiss, threshold = ${threshold}, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-threshold, 0, threshold], [0, 1, 0]);

  async function finishDrag(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const shouldDismiss = Math.abs(info.offset.x) >= threshold || Math.abs(info.velocity.x) >= 800;
    if (!shouldDismiss) {
      await animate(x, 0, { type: "spring", stiffness: 360, damping: 30 });
      return;
    }
    const direction = info.offset.x === 0 ? Math.sign(info.velocity.x) || 1 : Math.sign(info.offset.x);
    await animate(x, direction * (threshold + 160), { duration: reduceMotion ? 0.12 : ${Number(duration.toFixed(3))}, ease: "easeOut" });
    setVisible(false);
    onDismiss?.();
  }

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          {...props}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={${elastic}}
          dragMomentum={false}
          onDragEnd={finishDrag}
          exit={{ opacity: 0 }}
          style={{ ...props.style, x, opacity }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
`;
}

function scrollDrivenSource(exportName: string, values: ParamValues) {
  const start = numberValue(values, "start", 10) / 100;
  const end = numberValue(values, "end", 80) / 100;
  const distance = numberValue(values, "distance", 80);
  const axis = stringValue(values, "axis", "y") === "x" ? "x" : "y";
  return `"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { ComponentProps, ReactNode } from "react";

export type ${exportName}Props = Omit<ComponentProps<typeof motion.div>, "children" | "ref"> & {
  children: ReactNode;
};

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const target = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  const progress = useTransform(scrollYProgress, [${Number(start.toFixed(2))}, ${Number(end.toFixed(2))}], [${distance}, ${-distance}]);

  return (
    <motion.div
      {...props}
      ref={target}
      style={{ ...props.style, ${axis}: reduceMotion ? 0 : progress }}
    >
      {children}
    </motion.div>
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
  if (recipe.id === "hold-to-confirm") return holdToConfirmSource(exportName, values);
  if (recipe.id === "swipe-to-dismiss") return swipeToDismissSource(exportName, values);
  if (recipe.id === "scroll-driven-animation") return scrollDrivenSource(exportName, values);

  if (["hover-effect", "3d-tilt-flip"].includes(recipe.id)) {
    const target: MotionShape = recipe.id === "3d-tilt-flip"
      ? { rotateX: -4, rotateY: 7, y: -3 }
      : { y: -3, scale: 1.015 };
    return interactionSource(exportName, "hover", target, duration);
  }
  if (["press-tap-feedback", "ripple"].includes(recipe.id)) {
    return interactionSource(exportName, "tap", { scale: recipe.id === "ripple" ? 0.98 : 0.97 }, duration);
  }
  if (["drag-to-reorder", "before-after-slider"].includes(recipe.id)) {
    return interactionSource(exportName, "drag", { scale: 1.015 }, `{ type: "spring", stiffness: 360, damping: 30 }`);
  }
  if (recipe.id === "scroll-reveal") {
    return interactionSource(exportName, "inView", { opacity: 1, y: 0 }, duration);
  }
  if (["morph", "direction-aware-transition", "page-transition"].includes(recipe.id)) {
    return interactionSource(exportName, "layout", { opacity: 1 }, `{ type: "spring", stiffness: 260, damping: 28 }`);
  }

  const repeat = ["loop", "marquee", "orbit", "idle-animation", "skeleton-shimmer"].includes(recipe.id);
  const repeatDirection = stringValue(values, "direction", "normal");
  const loopInitial = repeatDirection === "reverse" ? 8 : -8;
  const loopTarget = repeatDirection === "reverse" ? -8 : 8;
  const marqueeInitial = repeatDirection === "right" ? "-50%" : "0%";
  const marqueeTarget = repeatDirection === "right" ? "0%" : "-50%";
  const orbitTarget = repeatDirection === "reverse" ? -360 : 360;
  const idleStyle = stringValue(values, "style", "float");
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
    "parallax": { initial: { y: distance / 2 }, animate: { y: -distance / 2 } },
    "shake-wiggle": { initial: { x: 0 }, animate: { x: [0, -7, 6, -4, 3, 0] } },
    "easing": { initial: { x: -distance }, animate: { x: distance } },
    "spring": { initial: { x: -distance }, animate: { x: distance } },
    "loop": { initial: { rotate: loopInitial }, animate: { rotate: loopTarget } },
    "marquee": { initial: { x: marqueeInitial }, animate: { x: marqueeTarget } },
    "orbit": { initial: { rotate: 0 }, animate: { rotate: orbitTarget } },
    "idle-animation": idleStyle === "pulse"
      ? { initial: { scale: 1 }, animate: { scale: [1, 1.02, 1] } }
      : { initial: { y: 0 }, animate: { y: [-distance / 4, distance / 4, -distance / 4] } },
    "blur": { initial: { opacity: 0, filter: `blur(${numberValue(values, "blur", 12)}px)` }, animate: { opacity: 1, filter: "blur(0px)" } },
    "text-morph": { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
    "skeleton-shimmer": { initial: { backgroundPosition: "120% 0" }, animate: { backgroundPosition: "-120% 0" } },
    "number-ticker": { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } },
    "typewriter": { initial: { clipPath: "inset(0 100% 0 0)" }, animate: { clipPath: "inset(0 0% 0 0)" } },
    "compositing": { initial: { x: -distance, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    "anticipation": { initial: { scale: 1 }, animate: { scale: [1, 0.96, 1.04, 1] } }
  };
  const shape = shapes[recipe.id] ?? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
  const transition = repeat ? repeatTransitionSource(recipe, values) : duration;
  const extra = repeat ? 'aria-hidden="true"' : booleanValue(values, "layout", false) ? "layout" : "";
  return wrapperSource(exportName, shape.initial, shape.animate, transition, extra);
}
