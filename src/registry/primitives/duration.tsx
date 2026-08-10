"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type DurationPrimitiveProps = {
  active: boolean;
  children: ReactNode;
  duration?: number;
  easing?: Transition["ease"];
  delay?: number;
  distance?: number;
  className?: string;
};

export function DurationPrimitive({
  active,
  children,
  duration = 0.24,
  easing = EASE_OUT,
  delay = 0,
  distance = 110,
  className,
}: DurationPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{
        opacity: 1,
        transform: reduceMotion || !active
          ? "translate3d(0, 0, 0)"
          : `translate3d(${distance}px, 0, 0)`,
      }}
      transition={reduceMotion ? { duration: 0.12 } : { duration, delay, ease: easing }}
    >
      {children}
    </motion.div>
  );
}
