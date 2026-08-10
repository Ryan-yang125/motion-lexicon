"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

export type CompositingProperty = "transform" | "opacity";

export type CompositingPrimitiveProps = {
  active: boolean;
  children: ReactNode;
  property?: CompositingProperty;
  distance?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

export function CompositingPrimitive({
  active,
  children,
  property = "transform",
  distance = 80,
  duration = 0.52,
  easing = [0.23, 1, 0.32, 1],
  className,
}: CompositingPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const animate = property === "opacity"
    ? { opacity: active ? 1 : 0.28 }
    : { opacity: 1, transform: reduceMotion || !active ? "translate3d(0, 0, 0)" : `translate3d(${distance}px, 0, 0)` };

  return (
    <motion.div
      className={className}
      initial={false}
      animate={animate}
      transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
      style={{ willChange: property }}
    >
      {children}
    </motion.div>
  );
}
