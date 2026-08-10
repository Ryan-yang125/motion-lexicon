"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

export type AnticipationPrimitiveProps = {
  trigger: string | number;
  children: ReactNode;
  distance?: number;
  anticipation?: number;
  followThrough?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

export function AnticipationPrimitive({
  trigger,
  children,
  distance = 32,
  anticipation = 0.18,
  followThrough = 0.12,
  duration = 0.52,
  easing = [0.16, 1, 0.3, 1],
  className,
}: AnticipationPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const pull = distance * anticipation;
  const follow = distance * followThrough;

  return (
    <motion.div
      className={className}
      key={trigger}
      animate={reduceMotion ? { opacity: [0.65, 1] } : {
        transform: [
          "translate3d(0, 0, 0) scale(1)",
          `translate3d(${-pull}px, 0, 0) scale(0.98)`,
          `translate3d(${distance}px, 0, 0) scale(1.025)`,
          `translate3d(${distance - follow}px, 0, 0) scale(1)`,
        ],
      }}
      transition={{ duration: reduceMotion ? 0.14 : duration, ease: easing, times: [0, 0.18, 0.72, 1] }}
    >
      {children}
    </motion.div>
  );
}
