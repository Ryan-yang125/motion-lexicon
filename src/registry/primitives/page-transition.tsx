"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type PageTransitionDirection = "up" | "down" | "left" | "right";

export type PageTransitionPrimitiveProps = {
  pageKey: string | number;
  children: ReactNode;
  direction?: PageTransitionDirection;
  distance?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

function travel(direction: PageTransitionDirection, distance: number, reverse = false) {
  const sign = reverse ? -1 : 1;
  if (direction === "left") return `translate3d(${distance * sign}px, 0, 0)`;
  if (direction === "right") return `translate3d(${-distance * sign}px, 0, 0)`;
  if (direction === "down") return `translate3d(0, ${-distance * sign}px, 0)`;
  return `translate3d(0, ${distance * sign}px, 0)`;
}

export function PageTransitionPrimitive({
  pageKey,
  children,
  direction = "left",
  distance = 32,
  duration = 0.28,
  easing = EASE_OUT,
  className,
}: PageTransitionPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.section
        className={className}
        key={pageKey}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: travel(direction, distance) }}
        animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: travel(direction, distance, true) }}
        transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
      >
        {children}
      </motion.section>
    </AnimatePresence>
  );
}
