"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

type Ripple = { id: number; x: number; y: number };

export type RipplePrimitiveProps = {
  children: ReactNode;
  onPress?: () => void;
  duration?: number;
  size?: number;
  opacity?: number;
  className?: string;
};

export function RipplePrimitive({
  children,
  onPress,
  duration = 0.16,
  size = 2.2,
  opacity = 0.24,
  className,
}: RipplePrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  return (
    <motion.button
      type="button"
      className={`relative isolate overflow-hidden ${className ?? ""}`}
      whileTap={reduceMotion ? { opacity: 0.78 } : { transform: "scale(0.97)" }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={(event) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setRipples((current) => [...current, {
          id: event.timeStamp,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }]);
      }}
      onClick={onPress}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-current"
            key={ripple.id}
            style={{ left: ripple.x, top: ripple.y, width: "100%", aspectRatio: 1 }}
            initial={{ opacity, transform: "translate(-50%, -50%) scale(0.08)" }}
            animate={{ opacity: 0, transform: `translate(-50%, -50%) scale(${size})` }}
            exit={{ opacity: 0 }}
            transition={{ duration, ease: [0.23, 1, 0.32, 1] }}
            onAnimationComplete={() => setRipples((current) => current.filter((item) => item.id !== ripple.id))}
          />
        ))}
      </AnimatePresence>
      <span className="relative">{children}</span>
    </motion.button>
  );
}
