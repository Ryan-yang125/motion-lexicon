"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type PressTapFeedbackPrimitiveProps = {
  children: ReactNode;
  scale?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

export function PressTapFeedbackPrimitive({
  children,
  scale = 0.96,
  duration = 0.12,
  easing = EASE_OUT,
  className,
}: PressTapFeedbackPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileTap={reduceMotion ? { opacity: 0.78 } : { transform: `scale(${scale})`, opacity: 0.86 }}
      transition={{ duration: reduceMotion ? 0.08 : duration, ease: easing }}
    >
      {children}
    </motion.div>
  );
}
