"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

export type EasingName = "ease-out" | "ease-in" | "ease-in-out" | "linear" | "custom" | "asymmetric" | "soft" | "snap" | "calm";

export type EasingPrimitiveProps = {
  active: boolean;
  children: ReactNode;
  distance?: number;
  duration?: number;
  easing?: EasingName;
  className?: string;
};

const curves: Record<EasingName, Transition["ease"]> = {
  "ease-out": [0.16, 1, 0.3, 1],
  "ease-in": [0.55, 0, 1, 0.45],
  "ease-in-out": [0.65, 0, 0.35, 1],
  linear: "linear",
  custom: [0.25, 0.9, 0.3, 1],
  asymmetric: [0.2, 0.8, 0.2, 1],
  soft: [0.23, 1, 0.32, 1],
  snap: [0.16, 1, 0.3, 1],
  calm: [0.33, 1, 0.68, 1],
};

export function EasingPrimitive({
  active,
  children,
  distance = 120,
  duration = 0.52,
  easing = "ease-out",
  className,
}: EasingPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ transform: reduceMotion || !active ? "translate3d(0, 0, 0)" : `translate3d(${distance}px, 0, 0)` }}
      transition={reduceMotion ? { duration: 0.12 } : { duration, ease: curves[easing] }}
    >
      {children}
    </motion.div>
  );
}
