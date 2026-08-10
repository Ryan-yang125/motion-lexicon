"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type SkeletonShimmerPrimitiveProps = {
  children: ReactNode;
  duration?: number;
  intensity?: number;
  label?: string;
  className?: string;
};

export function SkeletonShimmerPrimitive({
  children,
  duration = 1.4,
  intensity = 0.14,
  label = "Loading",
  className,
}: SkeletonShimmerPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative isolate overflow-hidden ${className ?? ""}`} role="status" aria-label={label}>
      {children}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 skew-x-[-16deg]"
        style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,${intensity}), transparent)` }}
        animate={{ transform: reduceMotion ? "translate3d(0, 0, 0)" : "translate3d(300%, 0, 0)" }}
        transition={{ duration, ease: "linear", repeat: reduceMotion ? 0 : Infinity, repeatDelay: 0.12 }}
      />
    </div>
  );
}
