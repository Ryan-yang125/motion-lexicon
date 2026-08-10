"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

export type MarqueePrimitiveProps = {
  children: ReactNode;
  duration?: number;
  gap?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
  trackClassName?: string;
};

export function MarqueePrimitive({
  children,
  duration = 8,
  gap = 32,
  direction = "left",
  pauseOnHover = true,
  className,
  trackClassName,
}: MarqueePrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();
  const target = direction === "left" ? "translate3d(-50%, 0, 0)" : "translate3d(0%, 0, 0)";
  const initial = direction === "left" ? "translate3d(0%, 0, 0)" : "translate3d(-50%, 0, 0)";

  useEffect(() => {
    if (reduceMotion) return;
    void controls.start({ transform: target }, { duration, ease: "linear", repeat: Infinity });
    return () => controls.stop();
  }, [controls, duration, reduceMotion, target]);

  const resume = () => {
    if (!pauseOnHover || reduceMotion) return;
    void controls.start({ transform: target }, { duration, ease: "linear", repeat: Infinity });
  };

  return (
    <div
      className={`overflow-hidden ${className ?? ""}`}
      onPointerEnter={() => pauseOnHover && controls.stop()}
      onPointerLeave={resume}
      onFocus={() => pauseOnHover && controls.stop()}
      onBlur={resume}
    >
      <motion.div
        className={`flex w-max ${trackClassName ?? ""}`}
        style={{ gap }}
        initial={{ transform: initial }}
        animate={controls}
      >
        <span className="flex shrink-0 items-center" style={{ gap }}>{children}</span>
        <span aria-hidden="true" className="flex shrink-0 items-center" style={{ gap }}>{children}</span>
      </motion.div>
    </div>
  );
}
