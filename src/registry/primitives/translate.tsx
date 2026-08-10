"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type TransformMode = "translate" | "scale" | "rotate" | "skew" | "perspective";
export type TransformOrigin = "center" | "top" | "bottom" | "left" | "right";

export type TranslatePrimitiveProps = {
  active: boolean;
  children: ReactNode;
  mode?: TransformMode;
  distance?: number;
  angle?: number;
  scale?: number;
  origin?: TransformOrigin;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
};

function activeTransform(mode: TransformMode, distance: number, angle: number, scale: number) {
  if (mode === "scale") return `scale(${scale})`;
  if (mode === "rotate") return `rotate(${angle}deg)`;
  if (mode === "skew") return `skewX(${angle}deg)`;
  if (mode === "perspective") return `perspective(700px) rotateY(${angle}deg)`;
  return `translate3d(${distance}px, 0, 0)`;
}

export function TranslatePrimitive({
  active,
  children,
  mode = "translate",
  distance = 36,
  angle = 12,
  scale = 0.92,
  origin = "center",
  duration = 0.28,
  easing = EASE_OUT,
  className,
}: TranslatePrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={{ transformOrigin: origin }}
      initial={false}
      animate={{
        opacity: 1,
        transform: reduceMotion || !active
          ? "translate3d(0, 0, 0) scale(1) rotate(0deg) skewX(0deg)"
          : activeTransform(mode, distance, angle, scale),
      }}
      transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
    >
      {children}
    </motion.div>
  );
}
