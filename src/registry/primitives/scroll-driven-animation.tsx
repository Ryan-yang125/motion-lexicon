"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";

export type ScrollDrivenAnimationPrimitiveProps = {
  children: ReactNode;
  start?: number;
  end?: number;
  distance?: number;
  axis?: "x" | "y";
  containerRef?: RefObject<HTMLElement | null>;
  className?: string;
};

export function ScrollDrivenAnimationPrimitive({
  children,
  start = 0.1,
  end = 0.8,
  distance = 80,
  axis = "y",
  containerRef,
  className,
}: ScrollDrivenAnimationPrimitiveProps) {
  const target = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    container: containerRef,
    offset: ["start end", "end start"],
  });
  const from = Math.min(start, end - 0.01);
  const to = Math.max(end, from + 0.01);
  const travel = useTransform(scrollYProgress, [from, to], [distance, -distance]);
  const transform = useTransform(travel, (value) =>
    reduceMotion
      ? "translate3d(0, 0, 0)"
      : axis === "x"
        ? `translate3d(${value}px, 0, 0)`
        : `translate3d(0, ${value}px, 0)`,
  );

  return (
    <motion.div ref={target} className={className} style={{ transform }}>
      {children}
    </motion.div>
  );
}
