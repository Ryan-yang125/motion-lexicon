"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type OrbitPrimitiveProps = {
  center: ReactNode;
  satellite: ReactNode;
  radius?: number;
  duration?: number;
  direction?: "normal" | "reverse";
  className?: string;
};

export function OrbitPrimitive({
  center,
  satellite,
  radius = 56,
  duration = 6,
  direction = "normal",
  className,
}: OrbitPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const end = direction === "reverse" ? -360 : 360;

  return (
    <div className={`relative grid place-items-center ${className ?? ""}`}>
      {center}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid place-items-center"
        animate={{ transform: reduceMotion ? "rotate(0deg)" : `rotate(${end}deg)` }}
        transition={{ duration, ease: "linear", repeat: reduceMotion ? 0 : Infinity }}
      >
        <span style={{ transform: `translate3d(0, ${-radius}px, 0)` }}>{satellite}</span>
      </motion.div>
    </div>
  );
}
