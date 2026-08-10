"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type NavigationDirection = -1 | 1;

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
  const enter = `translate3d(${direction * distance}px, 0, 0)`;
  const exit = `translate3d(${-direction * distance}px, 0, 0)`;

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
