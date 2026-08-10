"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type BlurRevealMode = "blur" | "clip" | "mask";

export type BlurPrimitiveProps = {
  present: boolean;
  children: ReactNode;
  blur?: number;
  mode?: BlurRevealMode;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

export function BlurPrimitive({
  present,
  children,
  blur = 14,
  mode = "blur",
  duration = 0.26,
  easing = EASE_OUT,
  className,
}: BlurPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? { opacity: 0 } : {
    opacity: 0,
    filter: mode === "blur" ? `blur(${blur}px)` : "blur(0px)",
    clipPath: mode === "clip" ? "inset(0 0 100% 0 round 12px)" : "inset(0 0 0% 0 round 12px)",
    maskPosition: mode === "mask" ? "100% 0" : "0% 0",
  };

  return (
    <AnimatePresence initial={false}>
      {present ? (
        <motion.div
          className={className}
          style={mode === "mask" ? {
            maskImage: "linear-gradient(90deg, transparent, #000 40%, #000)",
            maskSize: "220% 100%",
          } : undefined}
          initial={initial}
          animate={{ opacity: 1, filter: "blur(0px)", clipPath: "inset(0 0 0% 0 round 12px)", maskPosition: "0% 0" }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
