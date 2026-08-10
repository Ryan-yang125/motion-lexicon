"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type HoldToConfirmPrimitiveProps = {
  children: ReactNode;
  confirmed: ReactNode;
  onConfirm: () => void;
  duration?: number;
  holdScale?: number;
  disabled?: boolean;
  className?: string;
};

export function HoldToConfirmPrimitive({
  children,
  confirmed,
  onConfirm,
  duration = 1.2,
  holdScale = 0.98,
  disabled = false,
  className,
}: HoldToConfirmPrimitiveProps) {
  const reduceMotion = useReducedMotion();
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  const [holding, setHolding] = useState(false);
  const [complete, setComplete] = useState(false);
  const control = useRef<ReturnType<typeof animate> | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);

  const cancel = () => {
    if (progress.get() >= 1) return;
    control.current?.stop();
    setHolding(false);
    origin.current = null;
    const current = progress.get();
    control.current = animate(progress, 0, {
      duration: reduceMotion ? 0.08 : Math.max(0.08, current * 0.22),
      ease: [0.23, 1, 0.32, 1],
    });
  };

  const begin = (point?: { x: number; y: number }) => {
    if (disabled || holding || complete) return;
    setHolding(true);
    origin.current = point ?? null;
    const current = progress.get();
    control.current?.stop();
    control.current = animate(progress, 1, {
      duration: reduceMotion ? 0.25 : duration * (1 - current),
      ease: "linear",
      onComplete: () => {
        setHolding(false);
        setComplete(true);
        origin.current = null;
        navigator.vibrate?.(12);
        onConfirm();
      },
    });
  };

  useEffect(() => () => control.current?.stop(), []);

  return (
    <motion.button
      type="button"
      className={`relative isolate overflow-hidden ${className ?? ""}`}
      aria-disabled={disabled || complete}
      animate={{ transform: holding && !reduceMotion ? `scale(${holdScale})` : "scale(1)" }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        begin({ x: event.clientX, y: event.clientY });
      }}
      onPointerMove={(event) => {
        const start = origin.current;
        if (holding && start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) cancel();
      }}
      onPointerUp={cancel}
      onPointerCancel={cancel}
      onPointerLeave={cancel}
      onKeyDown={(event) => {
        if (!event.repeat && (event.key === " " || event.key === "Enter")) {
          event.preventDefault();
          begin();
        }
        if (event.key === "Escape") cancel();
      }}
      onKeyUp={(event) => {
        if (event.key === " " || event.key === "Enter") cancel();
      }}
    >
      <motion.span aria-hidden className="absolute inset-0 origin-left bg-current opacity-15" style={{ scaleX }} />
      <span className="relative">{complete ? confirmed : children}</span>
    </motion.button>
  );
}
