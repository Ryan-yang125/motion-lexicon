"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type AccordionCollapsePrimitiveProps = {
  open: boolean;
  children: ReactNode;
  duration?: number;
  easing?: Transition["ease"];
  maxHeight?: number;
  className?: string;
};

export function AccordionCollapsePrimitive({
  open,
  children,
  duration = 0.22,
  easing = EASE_OUT,
  maxHeight = 320,
  className,
}: AccordionCollapsePrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          className={className}
          style={{ overflow: "hidden", maxHeight }}
          initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
