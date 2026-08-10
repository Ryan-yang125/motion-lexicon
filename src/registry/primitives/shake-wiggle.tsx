"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type ShakeWigglePrimitiveProps = {
  trigger: string | number;
  children: ReactNode;
  distance?: number;
  cycles?: number;
  duration?: number;
  className?: string;
};

export function ShakeWigglePrimitive({
  trigger,
  children,
  distance = 10,
  cycles = 3,
  duration = 0.24,
  className,
}: ShakeWigglePrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const count = Math.max(1, Math.round(cycles));
  const frames = [0];
  for (let index = 0; index < count; index += 1) frames.push(index % 2 ? distance : -distance);
  frames.push(0);

  return (
    <motion.div
      className={className}
      key={trigger}
      animate={reduceMotion
        ? { opacity: [1, 0.6, 1] }
        : { transform: frames.map((value) => `translate3d(${value}px, 0, 0)`) }}
      transition={{ duration: reduceMotion ? 0.14 : duration, ease: [0.36, 0.07, 0.19, 0.97] }}
    >
      {children}
    </motion.div>
  );
}
