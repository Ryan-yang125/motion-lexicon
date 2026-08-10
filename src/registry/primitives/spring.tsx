"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type SpringPrimitiveProps = {
  active: boolean;
  children: ReactNode;
  distance?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  className?: string;
};

export function SpringPrimitive({
  active,
  children,
  distance = 48,
  stiffness = 220,
  damping = 24,
  mass = 1,
  velocity = 0,
  className,
}: SpringPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ transform: reduceMotion || !active ? "translate3d(0, 0, 0)" : `translate3d(${distance}px, 0, 0)` }}
      transition={reduceMotion ? { duration: 0.12 } : { type: "spring", stiffness, damping, mass, velocity }}
    >
      {children}
    </motion.div>
  );
}
