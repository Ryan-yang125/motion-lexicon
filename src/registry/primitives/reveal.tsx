"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type RevealMode = "clip" | "mask" | "blur";

export type RevealPrimitiveProps = {
  present: boolean;
  children: ReactNode;
  mode?: RevealMode;
  distance?: number;
  duration?: number;
  easing?: Transition["ease"];
  delay?: number;
  className?: string;
};

export function RevealPrimitive({
  present,
  children,
  mode = "clip",
  distance = 20,
  duration = 0.26,
  easing = EASE_OUT,
  delay = 0,
  className,
}: RevealPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion
    ? { opacity: 0 }
    : {
        opacity: 0,
        transform: `translate3d(0, ${distance}px, 0)`,
        clipPath: mode === "clip" ? "inset(0 0 100% 0 round 12px)" : "inset(0 0 0% 0 round 12px)",
        filter: mode === "blur" ? "blur(10px)" : "blur(0px)",
        maskPosition: mode === "mask" ? "100% 0" : "0% 0",
      };

  return (
    <AnimatePresence initial={false}>
      {present ? (
        <motion.div
          className={className}
          style={mode === "mask" ? {
            maskImage: "linear-gradient(90deg, transparent, #000 36%, #000)",
            maskSize: "220% 100%",
          } : undefined}
          initial={initial}
          animate={{
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
            clipPath: "inset(0 0 0% 0 round 12px)",
            filter: "blur(0px)",
            maskPosition: "0% 0",
          }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, delay, ease: easing }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
