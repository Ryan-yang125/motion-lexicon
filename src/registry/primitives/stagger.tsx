"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type StaggerPrimitiveProps = {
  items: readonly ReactNode[];
  interval?: number;
  distance?: number;
  duration?: number;
  easing?: Transition["ease"];
  className?: string;
  itemClassName?: string;
};

export function StaggerPrimitive({
  items,
  interval = 0.05,
  distance = 18,
  duration = 0.22,
  easing = EASE_OUT,
  className,
  itemClassName,
}: StaggerPrimitiveProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      className={className}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : interval } } }}
    >
      {items.map((item, index) => (
        <motion.li
          className={itemClassName}
          key={index}
          variants={{
            hidden: reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, transform: `translate3d(0, ${distance}px, 0)` },
            visible: { opacity: 1, transform: "translate3d(0, 0, 0)" },
          }}
          transition={reduceMotion ? { duration: 0.12 } : { duration, ease: easing }}
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
