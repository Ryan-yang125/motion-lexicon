"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type MorphMode = "morph" | "continuity" | "shared" | "layout";

export type MorphPrimitiveProps = {
  children: ReactNode;
  mode?: MorphMode;
  layoutId?: string;
  duration?: number;
  className?: string;
};

export function MorphPrimitive({
  children,
  mode = "morph",
  layoutId = "motion-lexicon-shared",
  duration = 0.26,
  className,
}: MorphPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      layout={reduceMotion ? false : mode === "layout" ? "position" : true}
      layoutId={reduceMotion || mode === "continuity" ? undefined : layoutId}
      transition={reduceMotion ? { duration: 0.12 } : {
        layout: { type: "spring", duration, bounce: mode === "morph" ? 0.16 : 0.08 },
      }}
    >
      {children}
    </motion.div>
  );
}
