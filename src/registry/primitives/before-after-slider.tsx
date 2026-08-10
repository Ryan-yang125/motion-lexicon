"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

export type BeforeAfterSliderPrimitiveProps = {
  before: ReactNode;
  after: ReactNode;
  initialPosition?: number;
  duration?: number;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
};

export function BeforeAfterSliderPrimitive({
  before,
  after,
  initialPosition = 50,
  duration = 0.18,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterSliderPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const [position, setPosition] = useState(() => Math.max(10, Math.min(90, initialPosition)));

  useEffect(() => {
    setPosition(Math.max(10, Math.min(90, initialPosition)));
  }, [initialPosition]);

  return (
    <div className={`relative isolate overflow-hidden ${className ?? ""}`}>
      <div className="absolute inset-0" aria-label={afterLabel}>{after}</div>
      <motion.div
        className="absolute inset-0 overflow-hidden"
        aria-label={beforeLabel}
        animate={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        transition={reduceMotion ? { duration: 0 } : { duration, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="size-full">{before}</div>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-full origin-left border-l border-white shadow-[-1px_0_0_rgba(0,0,0,0.16)]"
        animate={{ transform: `translate3d(${position}%, 0, 0)` }}
        transition={reduceMotion ? { duration: 0 } : { duration, ease: [0.23, 1, 0.32, 1] }}
      />
      <input
        className="absolute inset-0 size-full cursor-ew-resize opacity-0"
        type="range"
        min="10"
        max="90"
        value={position}
        aria-label={`${beforeLabel} / ${afterLabel}`}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  );
}
