"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type HoldActionPhase = "idle" | "holding" | "releasing" | "complete";

export type UseHoldActionOptions = {
  onComplete: () => void;
  onCancel?: () => void;
  duration?: number;
  moveTolerance?: number;
  disabled?: boolean;
};

export function useHoldAction({ onComplete, onCancel, duration = 1200, moveTolerance = 10, disabled = false }: UseHoldActionOptions) {
  const [phase, setPhase] = useState<HoldActionPhase>("idle");
  const [progress, setProgress] = useState(0);
  const phaseRef = useRef<HoldActionPhase>("idle");
  const frame = useRef(0);
  const startedAt = useRef(0);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const complete = useRef(onComplete);
  const cancel = useRef(onCancel);
  complete.current = onComplete;
  cancel.current = onCancel;

  const stop = useCallback((next: HoldActionPhase = "idle") => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    phaseRef.current = next;
    setPhase(next);
    setProgress(next === "complete" ? 1 : 0);
    origin.current = null;
  }, []);

  const release = useCallback(() => {
    if (phaseRef.current !== "holding") return;
    cancel.current?.();
    stop("releasing");
    window.setTimeout(() => phaseRef.current === "releasing" && stop(), 160);
  }, [stop]);

  const begin = useCallback((point?: { x: number; y: number }) => {
    if (disabled || phaseRef.current === "holding" || phaseRef.current === "complete") return;
    origin.current = point ?? null;
    phaseRef.current = "holding";
    setPhase("holding");
    setProgress(0);
    startedAt.current = performance.now();

    const tick = (now: number) => {
      const next = Math.min(1, (now - startedAt.current) / duration);
      setProgress(next);
      if (next < 1) {
        frame.current = requestAnimationFrame(tick);
        return;
      }
      frame.current = 0;
      phaseRef.current = "complete";
      setPhase("complete");
      navigator.vibrate?.(12);
      complete.current();
    };
    frame.current = requestAnimationFrame(tick);
  }, [disabled, duration]);

  useEffect(() => {
    const abandon = () => release();
    const visibility = () => document.hidden && release();
    window.addEventListener("blur", abandon);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", abandon);
      document.removeEventListener("visibilitychange", visibility);
      cancelAnimationFrame(frame.current);
    };
  }, [release]);

  return {
    phase,
    progress,
    reset: () => stop(),
    bind: {
      onPointerDown: (event: React.PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        begin({ x: event.clientX, y: event.clientY });
      },
      onPointerMove: (event: React.PointerEvent) => {
        const start = origin.current;
        if (!start || phaseRef.current !== "holding") return;
        if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > moveTolerance) release();
      },
      onPointerUp: release,
      onPointerCancel: release,
      onPointerLeave: release,
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Escape") { event.preventDefault(); release(); return; }
        if (!event.repeat && (event.key === " " || event.key === "Enter")) { event.preventDefault(); begin(); }
      },
      onKeyUp: (event: React.KeyboardEvent) => {
        if (event.key === " " || event.key === "Enter") release();
      },
      onBlur: release,
      onClick: (event: React.MouseEvent) => event.preventDefault(),
      onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
    },
  };
}

export type HoldActionProps = {
  children: React.ReactNode;
  onComplete: () => void;
  onCancel?: () => void;
  duration?: number;
  completeLabel?: string;
  hint?: string;
  resetAfter?: number;
  disabled?: boolean;
  className?: string;
};

export function HoldAction({ children, onComplete, onCancel, duration = 1200, completeLabel = "Complete", hint, resetAfter = 1400, disabled = false, className = "" }: HoldActionProps) {
  const { bind, phase, progress, reset } = useHoldAction({ onComplete, onCancel, duration, disabled });
  const reduced = useReducedMotion() === true;
  const hintId = useId();
  const fill = useMotionValue(0);
  const clipPath = useTransform(fill, (value) => `inset(0 ${(1 - value) * 100}% 0 0)`);
  const completed = phase === "complete";

  useEffect(() => {
    const controls = animate(fill, progress, { duration: reduced ? 0 : phase === "releasing" ? 0.16 : 0.08, ease: "linear" });
    return () => controls.stop();
  }, [fill, phase, progress, reduced]);
  useEffect(() => {
    if (!completed || resetAfter <= 0) return;
    const timer = window.setTimeout(reset, resetAfter);
    return () => window.clearTimeout(timer);
  }, [completed, reset, resetAfter]);

  return (
    <button type="button" aria-disabled={disabled || completed} aria-describedby={hintId} {...bind} style={{ touchAction: "manipulation", WebkitTouchCallout: "none" }} className={`relative isolate inline-grid min-h-11 select-none place-items-center overflow-hidden rounded-[9px] border border-neutral-300 bg-white px-4 text-[12px] font-medium text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-[#1b1b1b] dark:text-white ${className}`}>
      <span className="relative z-10 grid"><span className="col-start-1 row-start-1 whitespace-nowrap">{completed ? completeLabel : children}</span></span>
      <motion.span aria-hidden="true" data-hold-fill style={{ clipPath }} className="absolute inset-0 bg-neutral-950 dark:bg-white" />
      <motion.span aria-hidden="true" style={{ clipPath }} className="relative z-10 col-start-1 row-start-1 whitespace-nowrap text-white dark:text-neutral-950">{completed ? completeLabel : children}</motion.span>
      <span id={hintId} className="sr-only">{hint ?? `Press and hold for ${Math.round(duration / 100) / 10} seconds. Releasing early cancels the action.`}</span>
      <span className="sr-only" role="status" aria-live="polite">{completed ? completeLabel : ""}</span>
    </button>
  );
}
