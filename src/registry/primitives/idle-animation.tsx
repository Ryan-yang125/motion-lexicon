"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type IdleStyle = "float" | "pulse";

export type IdleAnimationPrimitiveProps = {
  children: ReactNode;
  style?: IdleStyle;
  distance?: number;
  duration?: number;
  pause?: number;
  className?: string;
};

export function IdleAnimationPrimitive({
  children,
  style = "float",
  distance = 8,
  duration = 2.2,
  pause = 0.3,
  className,
}: IdleAnimationPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const transform = style === "pulse"
    ? ["scale(1)", "scale(1.035)", "scale(1)"]
    : ["translate3d(0, 0, 0)", `translate3d(0, ${-distance}px, 0)`, "translate3d(0, 0, 0)"];

  return (
    <motion.div
      className={className}
      animate={reduceMotion ? { opacity: 1 } : { transform }}
      transition={{ duration, ease: [0.65, 0, 0.35, 1], repeat: reduceMotion ? 0 : Infinity, repeatDelay: pause }}
    >
      {children}
    </motion.div>
  );
}
