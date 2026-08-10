"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type MotionOrigin = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";

export type OriginAwareAnimationPrimitiveProps = {
  open: boolean;
  children: ReactNode;
  origin?: MotionOrigin;
  startScale?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

const origins: Record<MotionOrigin, string> = {
  "top-left": "top left",
  "top-right": "top right",
  "bottom-left": "bottom left",
  "bottom-right": "bottom right",
  center: "center",
};

export function OriginAwareAnimationPrimitive({
  open,
  children,
  origin = "top-left",
  startScale = 0.88,
  duration = 0.22,
  easing = EASE_OUT,
  className,
}: OriginAwareAnimationPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          className={className}
          style={{ transformOrigin: origins[origin] }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: `scale(${startScale})` }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: `scale(${startScale})` }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
