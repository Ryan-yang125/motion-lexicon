"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type ScrollRevealPrimitiveProps = {
  children: ReactNode;
  threshold?: number;
  distance?: number;
  duration?: number;
  easing?: Transition["ease"];
  once?: boolean;
  className?: string;
};

export function ScrollRevealPrimitive({
  children,
  threshold = 0.2,
  distance = 28,
  duration = 0.26,
  easing = EASE_OUT,
  once = true,
  className,
}: ScrollRevealPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` }}
      whileInView={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
      viewport={{ once, amount: Math.max(0, Math.min(1, threshold)) }}
      transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
    >
      {children}
    </motion.div>
  );
}
