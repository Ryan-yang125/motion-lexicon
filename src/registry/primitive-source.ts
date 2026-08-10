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
  if (easing === "ease-out") return "[0.16, 1, 0.3, 1]";
  if (easing === "ease-in") return "[0.55, 0, 1, 0.45]";
  if (easing === "ease-in-out") return "[0.65, 0, 0.35, 1]";
  if (easing === "custom") return "[0.25, 0.9, 0.3, 1]";
  if (easing === "asymmetric") return "[0.2, 0.8, 0.2, 1]";
  if (easing === "soft") return "[0.23, 1, 0.32, 1]";
  if (easing === "snap") return "[0.16, 1, 0.3, 1]";
  if (easing === "calm") return "[0.33, 1, 0.68, 1]";
  if (easing === "crisp") return "[0.2, 0.8, 0.2, 1]";
  if (easing === "smooth") return "[0.4, 0, 0.2, 1]";
  return "[0.23, 1, 0.32, 1]";
}

function transitionSource(recipe: MotionRecipe, values: ParamValues) {
  if (recipe.id === "spring") {
    const stiffness = numberValue(values, "stiffness", 180);
    const damping = numberValue(values, "damping", 22);
    const mass = numberValue(values, "mass", 1);
    const velocity = numberValue(values, "velocity", 0);
    return `{ type: "spring", stiffness: ${stiffness}, damping: ${damping}, mass: ${mass}, velocity: ${velocity} }`;
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
  const count = Math.round(numberValue(values, "count", 4));
  const distance = numberValue(values, "distance", 18);
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
      {items.slice(0, ${count}).map((item, index) => (
        <motion.li
          key={index}
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : ${distance} },
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
  const maxHeight = numberValue(values, "height", 140);
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
          style={{ overflow: "hidden", maxHeight: ${maxHeight} }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
`;
}

function tiltSource(exportName: string, values: ParamValues) {
  const angle = numberValue(values, "angle", 180);
  const perspective = numberValue(values, "perspective", 800);
  const duration = numberValue(values, "duration", 280) / 1000;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type ${exportName}Props = ComponentProps<typeof motion.div>;

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  return (
    <div style={{ perspective: ${perspective} }}>
      <motion.div
        {...props}
        whileHover={reduceMotion ? undefined : { rotateY: ${angle}, rotateX: ${Number((-angle * 0.06).toFixed(2))} }}
        transition={reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} }}
        style={{ ...props.style, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
`;
}

function scrollRevealSource(exportName: string, values: ParamValues) {
  const threshold = numberValue(values, "threshold", 20) / 100;
  const distance = numberValue(values, "distance", 28);
  const transition = `{ duration: ${numberValue(values, "duration", 260) / 1000}, ease: ${easingSource(values.ease)} }`;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type ${exportName}Props = ComponentProps<typeof motion.div>;

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : { opacity: 0, y: ${distance} }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: ${Number(threshold.toFixed(2))} }}
      transition={reduceMotion ? { duration: 0.12 } : ${transition}}
    >
      {children}
    </motion.div>
  );
}
`;
}

function directionalTransitionSource(exportName: string, values: ParamValues) {
  const distance = numberValue(values, "distance", 40);
  const duration = numberValue(values, "duration", 240) / 1000;
  const direction = stringValue(values, "direction", "left");
  const axis = direction === "up" || direction === "down" ? "y" : "x";
  const sign = direction === "left" || direction === "up" ? 1 : -1;
  return `"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ${exportName}({ stateKey, children }: { stateKey: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stateKey}
        initial={reduceMotion ? false : { opacity: 0, ${axis}: ${sign * distance} }}
        animate={{ opacity: 1, ${axis}: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, ${axis}: ${-sign * distance} }}
        transition={reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
`;
}

function crossfadeSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 200) / 1000;
  const overlap = numberValue(values, "overlap", 50) / 100;
  const enterDelay = Number((duration * (1 - overlap)).toFixed(3));
  return `"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ${exportName}({ stateKey, children }: { stateKey: string; children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false} mode="sync">
      <motion.div
        key={stateKey}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1, transition: reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, delay: ${enterDelay}, ease: ${easingSource(values.ease)} } }}
        exit={{ opacity: 0, transition: reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
`;
}

function morphSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 260) / 1000;
  const distance = numberValue(values, "distance", 48);
  const scale = numberValue(values, "scale", 86) / 100;
  const mode = stringValue(values, "mode", "morph");
  const layout = mode === "layout" ? "true" : '"position"';
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export type ${exportName}Props = ComponentProps<typeof motion.div> & { layoutId?: string };

export function ${exportName}({ children, layoutId = "shared-motion-element", ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      {...props}
      layout={${layout}}
      layoutId={layoutId}
      initial={reduceMotion ? false : { opacity: 0, y: ${distance}, scale: ${scale} }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} }}
      data-continuity="${mode}"
    >
      {children}
    </motion.div>
  );
}
`;
}

function holdToConfirmSource(exportName: string, values: ParamValues) {
  const holdMs = numberValue(values, "duration", 1200);
  const pressedScale = numberValue(values, "scale", 98) / 100;
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
      style={{ ...props.style, position: props.style?.position ?? "relative", overflow: "hidden" }}
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
        animate={{ scaleX: holding ? 1 : 0, opacity: holding ? 0.12 : 0 }}
        transition={reduceMotion ? { duration: 0.12 } : { duration: holding ? holdMs / 1000 : 0.14, ease: ${easingSource(values.ease)} }}
        style={{ position: "absolute", inset: 0, background: "currentColor", transformOrigin: "left", pointerEvents: "none" }}
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
import type { PanInfo } from "motion/react";
import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

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
    await animate(x, direction * (threshold + 160), { duration: reduceMotion ? 0.12 : ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} });
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
  const rawStart = numberValue(values, "start", 10) / 100;
  const rawEnd = numberValue(values, "end", 80) / 100;
  const start = Math.min(rawStart, rawEnd - 0.01);
  const end = Math.max(rawEnd, rawStart + 0.01);
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

function parallaxSource(exportName: string, values: ParamValues) {
  const distance = numberValue(values, "distance", 48);
  const speed = numberValue(values, "speed", 35) / 100;
  const travel = Number((distance * speed).toFixed(2));
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
  const travel = useTransform(scrollYProgress, [0, 1], [${travel}, ${-travel}]);

  return (
    <motion.div
      {...props}
      ref={target}
      style={{ ...props.style, ${axis}: reduceMotion ? 0 : travel }}
    >
      {children}
    </motion.div>
  );
}
`;
}

function reorderSource(exportName: string, values: ParamValues) {
  const scale = numberValue(values, "scale", 103) / 100;
  const distance = numberValue(values, "distance", 48);
  const duration = numberValue(values, "duration", 180) / 1000;
  const dragElastic = Number(Math.min(0.35, Math.max(0.08, distance / 200)).toFixed(2));
  return `"use client";

import { Reorder, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type ${exportName}Props<T extends string> = {
  values: T[];
  onReorder: (next: T[]) => void;
  renderItem: (value: T) => ReactNode;
  ariaLabel?: string;
};

export function ${exportName}<T extends string>({ values, onReorder, renderItem, ariaLabel = "Reorder items" }: ${exportName}Props<T>) {
  const reduceMotion = useReducedMotion();

  return (
    <Reorder.Group axis="y" values={values} onReorder={onReorder} aria-label={ariaLabel}>
      {values.map((value) => (
        <Reorder.Item
          key={value}
          value={value}
          dragElastic={${dragElastic}}
          whileDrag={reduceMotion ? undefined : { scale: ${scale}, zIndex: 1 }}
          transition={reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} }}
        >
          {renderItem(value)}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
`;
}

function rippleSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 160) / 1000;
  const size = numberValue(values, "size", 220);
  const opacity = numberValue(values, "opacity", 24) / 100;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { ComponentProps, PointerEvent, ReactNode } from "react";

type Ripple = { id: number; x: number; y: number };

export type ${exportName}Props = Omit<ComponentProps<typeof motion.button>, "children" | "onPointerDown"> & {
  children: ReactNode;
};

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  const nextId = useRef(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function addRipple(event: PointerEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ripple = { id: nextId.current++, x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    setRipples((current) => [...current, ripple]);
  }

  return (
    <motion.button
      {...props}
      type={props.type ?? "button"}
      onPointerDown={addRipple}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      style={{ ...props.style, position: props.style?.position ?? "relative", overflow: "hidden" }}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          aria-hidden="true"
          initial={{ scale: reduceMotion ? 1 : 0, opacity: ${opacity} }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.12 : ${Number(duration.toFixed(3))}, ease: "easeOut" }}
          onAnimationComplete={() => setRipples((current) => current.filter((item) => item.id !== ripple.id))}
          style={{ position: "absolute", left: ripple.x, top: ripple.y, width: "${size}%", aspectRatio: 1, borderRadius: "50%", background: "currentColor", translate: "-50% -50%", pointerEvents: "none" }}
        />
      ))}
      <span style={{ position: "relative" }}>{children}</span>
    </motion.button>
  );
}
`;
}

function beforeAfterSource(exportName: string, values: ParamValues) {
  const initialPosition = numberValue(values, "position", 50);
  const duration = numberValue(values, "duration", 180) / 1000;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import type { ComponentProps, KeyboardEvent, PointerEvent, ReactNode } from "react";

export type ${exportName}Props = Omit<ComponentProps<typeof motion.div>, "children" | "onPointerMove"> & {
  before: ReactNode;
  after: ReactNode;
  initialPosition?: number;
  label?: string;
};

export function ${exportName}({ before, after, initialPosition = ${initialPosition}, label = "Before and after", ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);

  function update(clientX: number) {
    const bounds = frame.current?.getBoundingClientRect();
    if (!bounds) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100)));
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setPosition((value) => Math.min(100, Math.max(0, value + (event.key === "ArrowRight" ? 2 : -2))));
  }

  return (
    <motion.div
      {...props}
      ref={frame}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      onKeyDown={handleKey}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => { setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); update(event.clientX); }}
      onPointerMove={(event: PointerEvent<HTMLDivElement>) => { if (dragging) update(event.clientX); }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      style={{ ...props.style, position: "relative", overflow: "hidden", touchAction: "none" }}
    >
      <div style={{ position: "absolute", inset: 0 }}>{before}</div>
      <div style={{ position: "absolute", inset: 0, clipPath: \`inset(0 \${100 - position}% 0 0)\` }}>{after}</div>
      <motion.div
        aria-hidden="true"
        animate={{ left: \`\${position}%\` }}
        transition={dragging || reduceMotion ? { duration: 0 } : { duration: ${Number(duration.toFixed(3))}, ease: "easeOut" }}
        style={{ position: "absolute", insetBlock: 0, width: 2, background: "currentColor", translate: "-50% 0", pointerEvents: "none" }}
      />
    </motion.div>
  );
}
`;
}

function numberTickerSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 240) / 1000;
  const distance = numberValue(values, "distance", 24);
  return `"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ComponentProps } from "react";

export type ${exportName}Props = Omit<ComponentProps<typeof motion.span>, "children"> & {
  value: number;
  format?: (value: number) => string;
};

const visuallyHidden = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 } as const;

export function ${exportName}({ value, format = (number) => number.toLocaleString(), ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  const previous = useRef(value);
  const direction = value >= previous.current ? 1 : -1;
  const label = format(value);
  useEffect(() => { previous.current = value; }, [value]);

  return (
    <motion.span {...props} style={{ ...props.style, display: "inline-grid", overflow: "hidden" }}>
      <span aria-live="polite" style={visuallyHidden}>{label}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          aria-hidden="true"
          initial={reduceMotion ? false : { y: direction * ${distance}, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: direction * -${distance}, opacity: 0 }}
          transition={reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} }}
          style={{ gridArea: "1 / 1" }}
        >
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
`;
}

function typewriterSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 1200);
  const maxCharacters = Math.round(numberValue(values, "characters", 18));
  const caret = booleanValue(values, "caret", true);
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export function ${exportName}({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();
  const content = useMemo(() => text.slice(0, ${maxCharacters}), [text]);
  const [length, setLength] = useState(reduceMotion ? content.length : 0);

  useEffect(() => {
    if (reduceMotion) { setLength(content.length); return; }
    setLength(0);
    const interval = window.setInterval(() => {
      setLength((value) => {
        if (value >= content.length) { window.clearInterval(interval); return value; }
        return value + 1;
      });
    }, Math.max(24, ${duration} / Math.max(1, content.length)));
    return () => window.clearInterval(interval);
  }, [content, reduceMotion]);

  return (
    <motion.span>
      <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>{content}</span>
      <span aria-hidden="true">{content.slice(0, length)}${caret ? "<span className=\"motion-typewriter-caret\">▍</span>" : ""}</span>
    </motion.span>
  );
}
`;
}

function keyframesSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 720) / 1000;
  const steps = Math.round(numberValue(values, "steps", 4));
  const mode = stringValue(values, "mode", "keyframes");
  const fill = stringValue(values, "fill", "both");
  const frames = mode === "tween"
    ? "{ opacity: 1, x: 0 }"
    : mode === "steps"
      ? `{ opacity: ${JSON.stringify(Array.from({ length: steps + 1 }, (_, index) => Number((index / steps).toFixed(3))))}, x: ${JSON.stringify(Array.from({ length: steps + 1 }, (_, index) => index % 2 === 0 ? 0 : 12))} }`
      : "{ opacity: [0.35, 1, 0.72, 1], x: [0, 18, -8, 0] }";
  const initial = fill === "both" ? "{ opacity: 0.35, x: 0 }" : "false";
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

export type ${exportName}Props = Omit<ComponentProps<typeof motion.div>, "children"> & { children: ReactNode };

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      {...props}
      initial={reduceMotion ? false : ${initial}}
      animate={reduceMotion ? { opacity: 1, x: 0 } : ${frames}}
      transition={{ duration: reduceMotion ? 0.12 : ${Number(duration.toFixed(3))}, ease: ${mode === "steps" ? '"linear"' : easingSource(values.ease)} }}
      data-fill="${fill}"
      data-steps={${steps}}
    >
      {children}
    </motion.div>
  );
}
`;
}

function shakeSource(exportName: string, values: ParamValues) {
  const distance = numberValue(values, "distance", 10);
  const cycles = Math.round(numberValue(values, "cycles", 3));
  const frames = [0];
  for (let index = 0; index < cycles * 2; index += 1) {
    const decay = 1 - index / (cycles * 2 + 1);
    frames.push(Number(((index % 2 === 0 ? -1 : 1) * distance * decay).toFixed(2)));
  }
  frames.push(0);
  return wrapperSource(
    exportName,
    { x: 0 },
    { x: frames },
    `{ duration: ${numberValue(values, "duration", 240) / 1000}, ease: "linear" }`
  );
}

function marqueeSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 8000) / 1000;
  const gap = numberValue(values, "gap", 32);
  const direction = stringValue(values, "direction", "left");
  const pauseOnHover = booleanValue(values, "pauseOnHover", true);
  const from = direction === "right" ? "-50%" : "0%";
  const to = direction === "right" ? "0%" : "-50%";
  return `"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export function ${exportName}({ items }: { items: ReactNode[] }) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const [paused, setPaused] = useState(false);
  const row = items.map((item, index) => <span key={index}>{item}</span>);
  useEffect(() => {
    if (reduceMotion) { controls.set({ x: "0%" }); return; }
    if (paused) { controls.stop(); return; }
    void controls.start({ x: [null, "${to}"], transition: { duration: ${Number(duration.toFixed(3))}, ease: "linear", repeat: Infinity } });
  }, [controls, paused, reduceMotion]);
  return (
    <div
      onPointerEnter={() => ${pauseOnHover ? "setPaused(true)" : "undefined"}}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => ${pauseOnHover ? "setPaused(true)" : "undefined"}}
      onBlur={() => setPaused(false)}
      style={{ overflow: "hidden" }}
    >
      <motion.div
        initial={{ x: "${from}" }}
        animate={controls}
        style={{ display: "flex", width: "max-content", gap: ${gap} }}
      >
        <span style={{ display: "flex", gap: ${gap} }}>{row}</span>
        <span aria-hidden="true" style={{ display: "flex", gap: ${gap} }}>{row}</span>
      </motion.div>
    </div>
  );
}
`;
}

function orbitSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 6000) / 1000;
  const radius = numberValue(values, "radius", 56);
  const rotation = stringValue(values, "direction", "normal") === "reverse" ? -360 : 360;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function ${exportName}({ center, orbiting }: { center: ReactNode; orbiting: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <div style={{ position: "relative", display: "grid", placeItems: "center", width: ${radius * 2}, height: ${radius * 2} }}>
      {center}
      <motion.div
        animate={{ rotate: reduceMotion ? 0 : ${rotation} }}
        transition={{ duration: ${Number(duration.toFixed(3))}, ease: "linear", repeat: reduceMotion ? 0 : Infinity }}
        style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}
      >
        <span style={{ transform: "translateX(${radius}px)" }}>{orbiting}</span>
      </motion.div>
    </div>
  );
}
`;
}

function blurRevealSource(exportName: string, values: ParamValues) {
  const blur = numberValue(values, "blur", 14);
  const mode = stringValue(values, "reveal", "blur");
  const transition = `{ duration: ${numberValue(values, "duration", 260) / 1000}, ease: ${easingSource(values.ease)} }`;
  const initial: MotionShape = mode === "clip"
    ? { opacity: 0, clipPath: "inset(0 0 100% 0)" }
    : mode === "mask"
      ? { opacity: 0, clipPath: "circle(0% at 50% 50%)" }
      : { opacity: 0, filter: `blur(${blur}px)` };
  const animate: MotionShape = mode === "clip"
    ? { opacity: 1, clipPath: "inset(0 0 0% 0)" }
    : mode === "mask"
      ? { opacity: 1, clipPath: "circle(75% at 50% 50%)" }
      : { opacity: 1, filter: "blur(0px)" };
  return wrapperSource(exportName, initial, animate, transition);
}

function textMorphSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 240) / 1000;
  const blur = numberValue(values, "blur", 8);
  const delay = numberValue(values, "delay", 120) / 1000;
  return `"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function ${exportName}({ value }: { value: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={value}
        initial={reduceMotion ? false : { opacity: 0, filter: "blur(${blur}px)", y: 5 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(${blur}px)", y: -5 }}
        transition={reduceMotion ? { duration: 0.12 } : { duration: ${Number(duration.toFixed(3))}, delay: ${Number(delay.toFixed(3))}, ease: ${easingSource(values.ease)} }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}
`;
}

function shimmerSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 1400) / 1000;
  const intensity = numberValue(values, "intensity", 14) / 100;
  return `"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

export type ${exportName}Props = Omit<ComponentProps<typeof motion.div>, "children"> & { children: ReactNode };

export function ${exportName}({ children, ...props }: ${exportName}Props) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div {...props} aria-busy="true" style={{ ...props.style, position: "relative", overflow: "hidden" }}>
      {children}
      <motion.span
        aria-hidden="true"
        initial={{ x: "-140%" }}
        animate={{ x: reduceMotion ? "0%" : "180%" }}
        transition={{ duration: reduceMotion ? 0.12 : ${Number(duration.toFixed(3))}, ease: "linear", repeat: reduceMotion ? 0 : Infinity }}
        style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgb(255 255 255 / ${intensity}), transparent)", pointerEvents: "none" }}
      />
    </motion.div>
  );
}
`;
}

function anticipationSource(exportName: string, values: ParamValues) {
  const duration = numberValue(values, "duration", 520) / 1000;
  const distance = numberValue(values, "distance", 32);
  const anticipation = numberValue(values, "anticipation", 18) / 100;
  const followThrough = numberValue(values, "followThrough", 12) / 100;
  return wrapperSource(
    exportName,
    { x: 0, scale: 1 },
    {
      x: [0, Number((-distance * anticipation).toFixed(2)), distance, Number((distance * followThrough).toFixed(2)), 0],
      scale: [1, Number((1 - anticipation * 0.1).toFixed(3)), Number((1 + followThrough * 0.1).toFixed(3)), 1]
    },
    `{ duration: ${Number(duration.toFixed(3))}, ease: ${easingSource(values.ease)} }`
  );
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
  if (recipe.id === "parallax") return parallaxSource(exportName, values);
  if (recipe.id === "drag-to-reorder") return reorderSource(exportName, values);
  if (recipe.id === "ripple") return rippleSource(exportName, values);
  if (recipe.id === "before-after-slider") return beforeAfterSource(exportName, values);
  if (recipe.id === "number-ticker") return numberTickerSource(exportName, values);
  if (recipe.id === "typewriter") return typewriterSource(exportName, values);
  if (recipe.id === "keyframes") return keyframesSource(exportName, values);
  if (recipe.id === "3d-tilt-flip") return tiltSource(exportName, values);
  if (recipe.id === "scroll-reveal") return scrollRevealSource(exportName, values);
  if (["direction-aware-transition", "page-transition"].includes(recipe.id)) return directionalTransitionSource(exportName, values);
  if (recipe.id === "crossfade") return crossfadeSource(exportName, values);
  if (recipe.id === "morph") return morphSource(exportName, values);
  if (recipe.id === "shake-wiggle") return shakeSource(exportName, values);
  if (recipe.id === "marquee") return marqueeSource(exportName, values);
  if (recipe.id === "orbit") return orbitSource(exportName, values);
  if (recipe.id === "blur") return blurRevealSource(exportName, values);
  if (recipe.id === "text-morph") return textMorphSource(exportName, values);
  if (recipe.id === "skeleton-shimmer") return shimmerSource(exportName, values);
  if (recipe.id === "anticipation") return anticipationSource(exportName, values);

  if (recipe.id === "hover-effect") {
    const target: MotionShape = { y: -numberValue(values, "distance", 4), scale: numberValue(values, "scale", 101) / 100 };
    return interactionSource(exportName, "hover", target, duration);
  }
  if (recipe.id === "press-tap-feedback") {
    return interactionSource(exportName, "tap", { scale: numberValue(values, "scale", 96) / 100 }, duration);
  }
  const repeat = ["loop", "idle-animation"].includes(recipe.id);
  const repeatDirection = stringValue(values, "direction", "normal");
  const loopInitial = repeatDirection === "reverse" ? 8 : -8;
  const loopTarget = repeatDirection === "reverse" ? -8 : 8;
  const idleStyle = stringValue(values, "style", "float");
  const slideDirection = stringValue(values, "direction", "up");
  const slideShapes: Record<string, { initial: MotionShape; animate: MotionShape }> = {
    up: { initial: { opacity: 0, y: distance }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -distance }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: distance }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -distance }, animate: { opacity: 1, x: 0 } },
    out: { initial: { opacity: 1, y: 0 }, animate: { opacity: 0, y: -distance } }
  };
  const origin = stringValue(values, "origin", "top-left").replaceAll("-", " ");
  const revealMode = stringValue(values, "reveal", "clip");
  const revealInitial: MotionShape = revealMode === "blur"
    ? { opacity: 0, y: distance, filter: `blur(${Math.max(6, distance / 2)}px)` }
    : revealMode === "mask"
      ? { opacity: 0, y: distance, clipPath: "circle(0% at 50% 50%)" }
      : { opacity: 0, y: distance, clipPath: "inset(0 0 100% 0)" };
  const revealTarget: MotionShape = revealMode === "blur"
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : revealMode === "mask"
      ? { opacity: 1, y: 0, clipPath: "circle(75% at 50% 50%)" }
      : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" };
  const transformMode = stringValue(values, "transform", "translate");
  const angle = numberValue(values, "angle", 12);
  const translateInitial: MotionShape = transformMode === "scale"
    ? { scale, transformOrigin: origin }
    : transformMode === "rotate"
      ? { rotate: angle, transformOrigin: origin }
      : transformMode === "skew"
        ? { skewX: angle, transformOrigin: origin }
        : transformMode === "perspective"
          ? { rotateY: angle, transformPerspective: 800, transformOrigin: origin }
          : { x: distance, transformOrigin: origin };
  const translateTarget: MotionShape = transformMode === "scale"
    ? { scale: 1 }
    : transformMode === "rotate"
      ? { rotate: 0 }
      : transformMode === "skew"
        ? { skewX: 0 }
        : transformMode === "perspective"
          ? { rotateY: 0, transformPerspective: 800 }
          : { x: 0 };
  const compositingProperty = stringValue(values, "property", "transform");
  const compositingInitial: MotionShape = compositingProperty === "left"
    ? { left: -distance }
    : compositingProperty === "opacity"
      ? { opacity: 0 }
      : { x: -distance };
  const compositingTarget: MotionShape = compositingProperty === "left"
    ? { left: 0 }
    : compositingProperty === "opacity"
      ? { opacity: 1 }
      : { x: 0 };
  const shapes: Record<string, { initial: MotionShape; animate: MotionShape }> = {
    "fade-in-fade-out": { initial: { opacity: numberValue(values, "opacity", 0) / 100 }, animate: { opacity: 1 } },
    "slide-in": slideShapes[slideDirection] ?? slideShapes.up,
    "scale-in": { initial: { opacity: 0, scale }, animate: { opacity: 1, scale: booleanValue(values, "overshoot", false) ? [scale, 1.025, 1] : 1 } },
    "reveal": { initial: revealInitial, animate: revealTarget },
    "duration": { initial: { x: 0 }, animate: { x: distance } },
    "translate": { initial: translateInitial, animate: translateTarget },
    "origin-aware-animation": { initial: { opacity: 0, scale, transformOrigin: origin }, animate: { opacity: 1, scale: 1 } },
    "easing": { initial: { x: -distance }, animate: { x: distance } },
    "spring": { initial: { x: -distance }, animate: { x: distance } },
    "loop": { initial: { rotate: loopInitial }, animate: { rotate: loopTarget } },
    "idle-animation": idleStyle === "pulse"
      ? { initial: { scale: 1 }, animate: { scale: [1, 1.02, 1] } }
      : { initial: { y: 0 }, animate: { y: [-distance / 4, distance / 4, -distance / 4] } },
    "compositing": { initial: compositingInitial, animate: compositingTarget }
  };
  const shape = shapes[recipe.id] ?? { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
  const transition = repeat ? repeatTransitionSource(recipe, values) : duration;
  const extra = recipe.id === "translate"
    ? `data-transform="${transformMode}" data-angle="${angle}" data-scale="${scale}"`
    : booleanValue(values, "layout", false) ? "layout" : "";
  return wrapperSource(exportName, shape.initial, shape.animate, transition, extra);
}
