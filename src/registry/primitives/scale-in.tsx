"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type ScaleInPrimitiveProps = {
  present: boolean;
  children: ReactNode;
  startScale?: number;
  overshoot?: boolean;
  duration?: number;
  easing?: Transition["ease"];
  delay?: number;
  origin?: string;
  className?: string;
};

export function ScaleInPrimitive({
  present,
  children,
  startScale = 0.92,
  overshoot = false,
  duration = 0.2,
  easing = EASE_OUT,
  delay = 0,
  origin = "center",
  className,
}: ScaleInPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const initial = `scale(${startScale})`;
  const animate = overshoot
    ? [initial, "scale(1.018)", "scale(1)"]
    : "scale(1)";

  return (
    <AnimatePresence initial={false}>
      {present ? (
        <motion.div
          className={className}
          style={{ transformOrigin: origin }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: initial }}
          animate={{ opacity: 1, transform: reduceMotion ? "scale(1)" : animate }}
          exit={{ opacity: 0, transform: reduceMotion ? "scale(1)" : initial }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, delay, ease: easing }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
