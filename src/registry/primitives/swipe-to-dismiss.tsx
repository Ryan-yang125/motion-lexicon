"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "motion/react";
import { useState, type ReactNode } from "react";

export type SwipeToDismissPrimitiveProps = {
  children: ReactNode;
  onDismiss?: () => void;
  threshold?: number;
  resistance?: number;
  className?: string;
};

export function SwipeToDismissPrimitive({
  children,
  onDismiss,
  threshold = 96,
  resistance = 0.65,
  className,
}: SwipeToDismissPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-threshold, 0, threshold], [0.15, 1, 0.15]);
  const [present, setPresent] = useState(true);

  const finish = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dismiss = Math.abs(info.offset.x) >= threshold || Math.abs(info.velocity.x) > 520;
    if (dismiss) {
      setPresent(false);
      onDismiss?.();
    }
  };

  return (
    <AnimatePresence initial={false}>
      {present ? (
        <motion.div
          className={className}
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={Math.max(0.05, Math.min(0.9, 1 - resistance))}
          dragMomentum={false}
          style={{ x, opacity, touchAction: "pan-y" }}
          onDragEnd={finish}
          exit={{ opacity: 0, transform: `translate3d(${x.get() < 0 ? -threshold : threshold}px, 0, 0)` }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
