"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type FadeInFadeOutPrimitiveProps = {
  present: boolean;
  children: ReactNode;
  duration?: number;
  easing?: Transition["ease"];
  delay?: number;
  startOpacity?: number;
  className?: string;
};

export function FadeInFadeOutPrimitive({
  present,
  children,
  duration = 0.2,
  easing = EASE_OUT,
  delay = 0,
  startOpacity = 0,
  className,
}: FadeInFadeOutPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0.12 }
    : { duration, delay, ease: easing };

  return (
    <AnimatePresence initial={false}>
      {present ? (
        <motion.div
          className={className}
          initial={{ opacity: reduceMotion ? 1 : startOpacity }}
          animate={{ opacity: 1 }}
          exit={{ opacity: reduceMotion ? 1 : startOpacity }}
          transition={transition}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
