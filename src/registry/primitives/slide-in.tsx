"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type SlideDirection = "up" | "down" | "left" | "right" | "out";

export type SlideInPrimitiveProps = {
  present: boolean;
  children: ReactNode;
  direction?: SlideDirection;
  distance?: number;
  duration?: number;
  easing?: Transition["ease"];
  delay?: number;
  className?: string;
};

function offset(direction: SlideDirection, distance: number) {
  if (direction === "left") return `translate3d(${distance}px, 0, 0)`;
  if (direction === "right") return `translate3d(${-distance}px, 0, 0)`;
  if (direction === "down") return `translate3d(0, ${-distance}px, 0)`;
  return `translate3d(0, ${distance}px, 0)`;
}

export function SlideInPrimitive({
  present,
  children,
  direction = "up",
  distance = 28,
  duration = 0.24,
  easing = EASE_OUT,
  delay = 0,
  className,
}: SlideInPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const travel = offset(direction, distance);
  const exit = direction === "out" ? `translate3d(0, ${-distance}px, 0)` : travel;

  return (
    <AnimatePresence initial={false}>
      {present ? (
        <motion.div
          className={className}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: travel }}
          animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: exit }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, delay, ease: easing }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
