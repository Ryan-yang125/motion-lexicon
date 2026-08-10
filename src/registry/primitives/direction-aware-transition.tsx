"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type NavigationDirection = "left" | "right" | "up" | "down";

export type DirectionAwareTransitionPrimitiveProps = {
  stateKey: string | number;
  direction: NavigationDirection;
  children: ReactNode;
  distance?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

export function DirectionAwareTransitionPrimitive({
  stateKey,
  direction,
  children,
  distance = 40,
  duration = 0.24,
  easing = EASE_OUT,
  className,
}: DirectionAwareTransitionPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const offset = {
    left: [-distance, 0],
    right: [distance, 0],
    up: [0, -distance],
    down: [0, distance],
  }[direction];
  const enter = `translate3d(${offset[0]}px, ${offset[1]}px, 0)`;
  const exit = `translate3d(${-offset[0]}px, ${-offset[1]}px, 0)`;

  return (
    <AnimatePresence initial={false} mode="popLayout" custom={direction}>
      <motion.div
        className={className}
        key={stateKey}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: enter }}
        animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: exit }}
        transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
