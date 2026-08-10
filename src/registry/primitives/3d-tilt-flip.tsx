"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export type Motion3dTiltFlipPrimitiveProps = {
  flipped: boolean;
  front: ReactNode;
  back: ReactNode;
  angle?: number;
  perspective?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

export function Motion3dTiltFlipPrimitive({
  flipped,
  front,
  back,
  angle = 180,
  perspective = 800,
  duration = 0.28,
  easing = EASE_IN_OUT,
  className,
}: Motion3dTiltFlipPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={className} style={{ perspective }}>
      <motion.div
        className="relative size-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ transform: reduceMotion || !flipped ? "rotateY(0deg)" : `rotateY(${angle}deg)` }}
        transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>{front}</div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden", transform: `rotateY(${angle}deg)` }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}
