"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SPRING = { type: "spring", stiffness: 430, damping: 32, mass: 0.58 } as const;
const INSTANT = { duration: 0 } as const;

export type VoiceCaptureState = "idle" | "recording" | "paused";

export type VoiceCaptureProps = {
  levels?: readonly number[];
  label?: string;
  recordLabel?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  recordingLabel?: string;
  pausedLabel?: string;
  sendLabel?: string;
  deleteLabel?: string;
  onStateChange?: (state: VoiceCaptureState) => void;
  onSend?: (durationSeconds: number) => void;
  onDelete?: () => void;
  className?: string;
};

const Mic = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden><rect x="8" y="3" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="1.7"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>;
const Pause = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>;
const Play = () => <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M8 5.8v12.4a1 1 0 0 0 1.55.84l9-6.2a1 1 0 0 0 0-1.68l-9-6.2A1 1 0 0 0 8 5.8Z"/></svg>;

export function VoiceCapture({
  levels = [0.22, 0.48, 0.3, 0.72, 0.45, 0.9, 0.36, 0.62, 0.28, 0.78, 0.52, 0.34, 0.84, 0.42, 0.66, 0.3, 0.56, 0.24],
  label = "Voice message",
  recordLabel = "Record voice message",
  pauseLabel = "Pause recording",
  resumeLabel = "Resume recording",
  recordingLabel = "Recording",
  pausedLabel = "Recording paused",
  sendLabel = "Send recording",
  deleteLabel = "Delete recording",
  onStateChange,
  onSend,
  onDelete,
  className = "",
}: VoiceCaptureProps) {
  const [state, setState] = useState<VoiceCaptureState>("idle");
  const [seconds, setSeconds] = useState(0);
  const startedAt = useRef<number | null>(null);
  const recordedMs = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const recordButton = useRef<HTMLButtonElement>(null);
  const primaryControl = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<"record" | "primary" | null>(null);
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion() === true;

  useLayoutEffect(() => {
    if (pendingFocus.current === "primary" && state !== "idle") {
      pendingFocus.current = null;
      primaryControl.current?.focus({ preventScroll: true });
    } else if (pendingFocus.current === "record" && state === "idle") {
      pendingFocus.current = null;
      recordButton.current?.focus({ preventScroll: true });
    }
  }, [state]);

  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    let intersecting = true;
    let documentVisible = !document.hidden;
    const update = () => setVisible(intersecting && documentVisible);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    });
    const onVisibility = () => {
      documentVisible = !document.hidden;
      update();
    };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [state]);

  useEffect(() => {
    if (state !== "recording") return;
    const update = () => {
      const runningMs = startedAt.current === null ? 0 : Math.max(0, Date.now() - startedAt.current);
      setSeconds(Math.floor((recordedMs.current + runningMs) / 1000));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [state]);

  const setPhase = (next: VoiceCaptureState) => {
    setState(next);
    onStateChange?.(next);
  };

  const resetDuration = () => {
    startedAt.current = null;
    recordedMs.current = 0;
    setSeconds(0);
  };

  const start = () => {
    recordedMs.current = 0;
    startedAt.current = Date.now();
    setSeconds(0);
    pendingFocus.current = "primary";
    setPhase("recording");
  };

  const pause = () => {
    if (startedAt.current !== null) {
      recordedMs.current += Math.max(0, Date.now() - startedAt.current);
      startedAt.current = null;
    }
    setSeconds(Math.floor(recordedMs.current / 1000));
    setPhase("paused");
  };

  const resume = () => {
    startedAt.current = Date.now();
    setPhase("recording");
  };

  const durationSeconds = () => {
    const runningMs = startedAt.current === null ? 0 : Math.max(0, Date.now() - startedAt.current);
    return Math.floor((recordedMs.current + runningMs) / 1000);
  };

  const remove = () => {
    pendingFocus.current = "record";
    setPhase("idle");
    resetDuration();
    onDelete?.();
  };

  const send = () => {
    const duration = durationSeconds();
    onSend?.(duration);
    pendingFocus.current = "record";
    setPhase("idle");
    resetDuration();
  };

  const time = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);
  const stateLabel = state === "recording" ? recordingLabel : pausedLabel;
  const transition = reduced ? INSTANT : SPRING;

  if (state === "idle") {
    return (
      <button
        ref={recordButton}
        type="button"
        aria-label={recordLabel}
        onClick={start}
        className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 text-[13px] font-medium text-stone-700 outline-none transition-[border-color,box-shadow,background-color] duration-150 focus-visible:border-[#4568FF] focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.2)] dark:border-white/15 dark:bg-[#242421] dark:text-stone-200 ${className}`}
      >
        <span className="grid size-7 place-items-center rounded-full bg-[#93664F]/12 text-[#93664F]"><Mic /></span>
        {label}
      </button>
    );
  }

  return (
    <motion.div
      ref={root}
      layout
      transition={transition}
      className={`flex min-h-14 w-full min-w-0 max-w-[420px] items-center gap-1 rounded-[16px] border border-stone-200 bg-white p-2 dark:border-white/15 dark:bg-[#242421] ${className}`}
    >
      <button
        ref={primaryControl}
        type="button"
        aria-label={state === "recording" ? pauseLabel : resumeLabel}
        onClick={state === "recording" ? pause : resume}
        className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-stone-900 text-white outline-none focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.28)] dark:bg-stone-100 dark:text-stone-950"
      >
        {state === "recording" ? <Pause /> : <Play />}
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${state === "recording" ? "bg-[#93664F]" : "bg-stone-300 dark:bg-stone-600"}`} />
        <div aria-hidden className="flex h-8 min-w-0 flex-1 items-center justify-center gap-0 overflow-hidden min-[390px]:gap-0.5">
          {levels.map((level, index) => {
            const base = Math.max(0.14, Math.min(1, level));
            return (
              <motion.span
                key={index}
                className="h-6 min-w-0 max-w-[3px] flex-1 origin-center rounded-full bg-stone-400 dark:bg-stone-500"
                animate={state === "recording" && !reduced && visible
                  ? { transform: [`scaleY(${base})`, `scaleY(${Math.min(1, base * 1.55)})`, `scaleY(${base})`] }
                  : { transform: `scaleY(${state === "paused" ? base * 0.58 : base})` }}
                transition={state === "recording" && !reduced && visible
                  ? { duration: 0.68 + (index % 4) * 0.08, repeat: Infinity, ease: "easeInOut", delay: index * 0.018 }
                  : transition}
              />
            );
          })}
        </div>
        <span role="timer" aria-label={`${stateLabel}, ${time}`} className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-stone-600 dark:text-stone-300">{time}</span>
      </div>

      <button
        type="button"
        aria-label={deleteLabel}
        onClick={remove}
        className="grid size-11 shrink-0 place-items-center rounded-[12px] text-[18px] text-stone-500 outline-none transition-colors duration-150 hover:bg-stone-100 hover:text-stone-700 focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.2)] dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-200"
      >
        <span aria-hidden>×</span>
      </button>
      <button
        type="button"
        aria-label={sendLabel}
        onClick={send}
        className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#4568FF] text-white outline-none transition-[background-color,box-shadow] duration-150 hover:bg-[#3658EC] focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.25)]"
      >
        <span aria-hidden>↗</span>
      </button>
      <AnimatePresence><motion.span key={state} role="status" className="sr-only">{stateLabel}</motion.span></AnimatePresence>
    </motion.div>
  );
}
