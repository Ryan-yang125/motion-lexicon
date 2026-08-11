"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const CROSSFADE = { type: "spring", stiffness: 260, damping: 34, mass: 0.8 } as const;
const INSTANT = { duration: 0 } as const;
export type AsyncActionStatus = "idle" | "pending" | "success" | "error";
type Props = { onAction: () => unknown; children: string; pendingLabel?: string; successLabel?: string; errorLabel?: string; resetAfter?: number; disabled?: boolean; onError?: (error: unknown) => void; className?: string };

function Spinner({ still }: { still: boolean }) { return <motion.svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0" animate={still ? undefined : { rotate: 360 }} transition={still ? undefined : { duration: 0.85, repeat: Infinity, ease: "linear" }}><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.22"/><path d="M10.5 6A4.5 4.5 0 0 0 6 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></motion.svg>; }
function CheckMark() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0"><path d="M2.6 6.3 4.9 8.6 9.4 3.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function AlertMark() { return <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0"><path d="M6 2.9v3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M6 9.05h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>; }

export function LoadingButton({ onAction, children, pendingLabel = children, successLabel = "Done", errorLabel = "Try again", resetAfter = 1400, disabled = false, onError, className = "" }: Props) {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<AsyncActionStatus>("idle");
  const runId = useRef(0); const timer = useRef<ReturnType<typeof setTimeout> | null>(null); const alive = useRef(true);
  const action = useRef(onAction); const fail = useRef(onError); action.current = onAction; fail.current = onError;
  const clear = useCallback(() => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } }, []);
  useEffect(() => () => { alive.current = false; runId.current += 1; clear(); }, [clear]);
  const run = useCallback(() => {
    if (status === "pending") return;
    const id = ++runId.current; clear(); setStatus("pending");
    Promise.resolve().then(() => action.current()).then(() => {
      if (!alive.current || id !== runId.current) return;
      setStatus("success"); timer.current = setTimeout(() => { if (alive.current && id === runId.current) setStatus("idle"); }, resetAfter);
    }, (error: unknown) => { if (!alive.current || id !== runId.current) return; fail.current?.(error); setStatus("error"); });
  }, [clear, resetAfter, status]);
  const pending = status === "pending";
  const label = status === "pending" ? pendingLabel : status === "success" ? successLabel : status === "error" ? errorLabel : children;
  const faces = [{ key: "idle", text: children, tone: "text-stone-700 dark:text-stone-200", icon: null }, { key: "pending", text: pendingLabel, tone: "text-stone-500 dark:text-stone-400", icon: <Spinner still={reduced === true || !pending} /> }, { key: "success", text: successLabel, tone: "text-emerald-600 dark:text-emerald-400", icon: <CheckMark /> }, { key: "error", text: errorLabel, tone: "text-red-600 dark:text-red-400", icon: <AlertMark /> }];
  return <><motion.button type="button" disabled={disabled} aria-label={label} aria-busy={pending || undefined} aria-disabled={pending || undefined} whileTap={disabled || pending || reduced ? undefined : { y: 1 }} transition={CELL} onClick={(event) => { if (pending) { event.preventDefault(); return; } run(); }} className={`relative inline-flex h-9 select-none items-center justify-center rounded-[9px] border border-stone-200 bg-white px-3.5 text-[13px] font-medium text-stone-700 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(28,25,23,0.06),0_1px_2px_rgba(28,25,23,0.08)] outline-none transition-[border-color,box-shadow,background-color] duration-150 hover:bg-stone-50 focus-visible:border-[#4568FF] dark:border-white/[0.16] dark:bg-[#252522] dark:text-stone-200 dark:hover:bg-[#2A2A27] dark:focus-visible:border-[#93B0FF] ${className}`} style={{ borderRadius: 9, touchAction: "manipulation" }}><span aria-hidden className="relative grid place-items-center">{faces.map((face) => <motion.span key={face.key} initial={false} animate={face.key === status ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 3, filter: "blur(3px)" }} transition={reduced ? INSTANT : CROSSFADE} className={`col-start-1 row-start-1 flex items-center justify-center gap-1.5 whitespace-nowrap ${face.tone}`}>{face.icon}{face.text}</motion.span>)}</span></motion.button><span role="status" aria-live="polite" className="sr-only">{status === "success" ? successLabel : status === "error" ? errorLabel : ""}</span></>;
}
