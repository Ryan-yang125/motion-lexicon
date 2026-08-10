"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export type HoverEffectPrimitiveProps = {
  children: ReactNode;
  distance?: number;
  scale?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

export function HoverEffectPrimitive({
  children,
  distance = 4,
  scale = 1.01,
  duration = 0.15,
  easing = EASE_OUT,
  className,
}: HoverEffectPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const resting = "translate3d(0, 0, 0) scale(1)";
  const lifted = `translate3d(0, ${-distance}px, 0) scale(${scale})`;

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ transform: resting }}
      whileHover={reduceMotion ? undefined : { transform: lifted }}
      whileFocus={reduceMotion ? undefined : { transform: lifted }}
      transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
    >
      {children}
    </motion.div>
  );
}
