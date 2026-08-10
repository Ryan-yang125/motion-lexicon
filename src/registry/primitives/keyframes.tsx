"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export type KeyframeMode = "keyframes" | "tween" | "steps";
export type KeyframeFill = "none" | "forwards" | "both";

export type KeyframesPrimitiveProps = {
  children: ReactNode;
  mode?: KeyframeMode;
  steps?: number;
  fill?: KeyframeFill;
  duration?: number;
  easing?: Transition["ease"];
  distance?: number;
  className?: string;
};

export function KeyframesPrimitive({
  children,
  mode = "keyframes",
  steps = 4,
  fill = "both",
  duration = 0.72,
  easing = EASE_IN_OUT,
  distance = 72,
  className,
}: KeyframesPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const count = Math.max(2, Math.round(steps));
  const frames = Array.from({ length: count }, (_, index) => {
    const progress = index / (count - 1);
    const x = -distance + distance * 2 * progress;
    const lift = index === Math.floor((count - 1) / 2) ? -10 : 0;
    return `translate3d(${x}px, ${lift}px, 0) scale(${index === count - 1 ? 1 : 0.96 + progress * 0.06})`;
  });
  const motionFrames = mode === "steps"
    ? frames.flatMap((frame, index) => index === frames.length - 1 ? [frame] : [frame, frame])
    : mode === "tween"
      ? [frames[0], frames.at(-1)!]
      : frames;
  const animate = reduceMotion
    ? { opacity: 1 }
    : { opacity: [0.55, 1], transform: motionFrames };

  return (
    <motion.div
      className={className}
      initial={fill === "none" || reduceMotion ? false : { opacity: 0.55, transform: frames[0] }}
      animate={animate}
      transition={reduceMotion ? { duration: 0.12 } : {
        duration,
        ease: mode === "steps" ? "linear" : easing,
        times: motionFrames.map((_, index) => index / (motionFrames.length - 1)),
      }}
    >
      {children}
    </motion.div>
  );
}
