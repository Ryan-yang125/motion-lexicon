"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type LoopDirection = "normal" | "alternate" | "reverse";

export type LoopPrimitiveProps = {
  children: ReactNode;
  duration?: number;
  pause?: number;
  direction?: LoopDirection;
  iterations?: number;
  infinite?: boolean;
  distance?: number;
  className?: string;
};

export function LoopPrimitive({
  children,
  duration = 1.2,
  pause = 0.16,
  direction = "normal",
  iterations = 3,
  infinite = false,
  distance = 18,
  className,
}: LoopPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const reverse = direction === "reverse";
  const from = reverse ? distance : 0;
  const to = reverse ? 0 : distance;

  return (
    <motion.div
      className={className}
      animate={reduceMotion ? { opacity: 1 } : {
        transform: [`translate3d(0, ${from}px, 0)`, `translate3d(0, ${to}px, 0)`],
      }}
      transition={reduceMotion ? { duration: 0.12 } : {
        duration,
        ease: [0.77, 0, 0.175, 1],
        repeat: infinite ? Infinity : Math.max(0, Math.round(iterations) - 1),
        repeatType: direction === "alternate" ? "reverse" : "loop",
        repeatDelay: pause,
      }}
    >
      {children}
    </motion.div>
  );
}
