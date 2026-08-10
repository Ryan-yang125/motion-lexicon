"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.33, 1, 0.68, 1] as const;

export type CrossfadePrimitiveProps = {
  stateKey: string | number;
  children: ReactNode;
  duration?: number;
  easing?: Transition["ease"];
  overlap?: number;
  className?: string;
};

export function CrossfadePrimitive({
  stateKey,
  children,
  duration = 0.2,
  easing = EASE,
  overlap = 0.5,
  className,
}: CrossfadePrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const overlapDelay = duration * Math.max(0, Math.min(1, 1 - overlap));

  return (
    <div className={`relative grid ${className ?? ""}`}>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          className="col-start-1 row-start-1"
          key={stateKey}
          initial={{ opacity: 0, filter: reduceMotion ? "blur(0px)" : "blur(2px)" }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            transition: reduceMotion ? { duration: 0.12 } : { duration, delay: overlapDelay, ease: easing },
          }}
          exit={{
            opacity: 0,
            filter: reduceMotion ? "blur(0px)" : "blur(2px)",
            transition: reduceMotion ? { duration: 0.12 } : { duration, ease: easing },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
