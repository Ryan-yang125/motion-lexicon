"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";

const EASE_OUT = [0.33, 1, 0.68, 1] as const;

export type LineDrawingPrimitiveProps = {
  path?: string;
  duration?: number;
  easing?: Transition["ease"];
  delay?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
};

export function LineDrawingPrimitive({
  path = "M6 13.5 10.5 18 20 7.5",
  duration = 1,
  easing = EASE_OUT,
  delay = 0,
  strokeWidth = 2,
  label = "Complete",
  className,
}: LineDrawingPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      className={className}
      viewBox="0 0 26 26"
      fill="none"
      role="img"
      aria-label={label}
    >
      <motion.path
        d={path}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduceMotion ? { duration: 0.12 } : { duration, delay, ease: easing }}
      />
    </motion.svg>
  );
}
