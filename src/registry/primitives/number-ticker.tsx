"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type NumberTickerPrimitiveProps = {
  value: number;
  format?: (value: number) => string;
  duration?: number;
  easing?: Transition["ease"];
  distance?: number;
  className?: string;
};

export function NumberTickerPrimitive({
  value,
  format = (number) => number.toLocaleString(),
  duration = 0.24,
  easing = EASE_OUT,
  distance = 24,
  className,
}: NumberTickerPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const formatted = format(value);

  return (
    <span className={`relative inline-grid overflow-hidden tabular-nums ${className ?? ""}`} aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          className="col-start-1 row-start-1"
          key={value}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` }}
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: `translate3d(0, ${-distance}px, 0)` }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
        >
          {formatted}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
