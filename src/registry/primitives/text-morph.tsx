"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type TextMorphPrimitiveProps = {
  value: string;
  duration?: number;
  easing?: Transition["ease"];
  blur?: number;
  delay?: number;
  className?: string;
};

export function TextMorphPrimitive({
  value,
  duration = 0.24,
  easing = EASE_OUT,
  blur = 8,
  delay = 0,
  className,
}: TextMorphPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={`relative inline-grid ${className ?? ""}`} aria-live="polite">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          className="col-start-1 row-start-1"
          key={value}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: `blur(${blur}px)`, transform: "translate3d(0, 5px, 0)" }}
          animate={{ opacity: 1, filter: "blur(0px)", transform: "translate3d(0, 0, 0)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: `blur(${Math.min(blur, 4)}px)`, transform: "translate3d(0, -4px, 0)" }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, delay, ease: easing }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
