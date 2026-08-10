"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";

export type ParallaxPrimitiveProps = {
  children: ReactNode;
  distance?: number;
  speed?: number;
  axis?: "x" | "y";
  containerRef?: RefObject<HTMLElement | null>;
  className?: string;
};

export function ParallaxPrimitive({
  children,
  distance = 48,
  speed = 0.35,
  axis = "y",
  containerRef,
  className,
}: ParallaxPrimitiveProps) {
  const target = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    container: containerRef,
    offset: ["start end", "end start"],
  });
  const range = distance * Math.max(0.1, Math.min(0.8, speed));
  const travel = useTransform(scrollYProgress, [0, 1], [range, -range]);
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
