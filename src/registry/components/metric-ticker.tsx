"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type MetricTickerProps = { label: string; value: number; format?: (value: number) => string; delta?: number; period?: string; className?: string };

export function MetricTicker({ label, value, format = (next) => next.toLocaleString(), delta = 0, period = "vs. last period", className = "" }: MetricTickerProps) {
  const reduced = useReducedMotion() === true; const titleId = useId(); const previous = useRef(value); const [change, setChange] = useState(0);
  useEffect(() => { if (previous.current !== value) { setChange(previous.current); previous.current = value; } }, [value]);
  const positive = delta >= 0;
  return <section aria-labelledby={titleId} className={`rounded-[15px] border border-black/[.1] bg-white p-4 shadow-[0_12px_29px_-23px_rgba(28,28,28,.37)] ${className}`}><div className="flex items-start justify-between gap-3"><span id={titleId} className="text-[12px] font-medium text-neutral-600">{label}</span><span className={`rounded-full px-2 py-1 font-mono text-[10px] ${positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{positive ? "+" : ""}{delta}%</span></div><div className="mt-5 flex items-end justify-between gap-3"><span aria-live="polite" className="relative inline-grid overflow-hidden text-3xl font-medium tracking-[-.055em] text-[#292929]"><AnimatePresence mode="popLayout" initial={false}><motion.span key={value} initial={reduced ? false : { opacity: 0, y: positive ? 18 : -18 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: positive ? -12 : 12 }} transition={{ duration: reduced ? 0 : .27, ease: [0.22, 1, 0.36, 1] }} className="col-start-1 row-start-1 tabular-nums">{format(value)}</motion.span></AnimatePresence></span><span className="font-mono text-[10px] text-neutral-400">{period}</span></div>{change ? <span className="sr-only">Previous value {format(change)}</span> : null}</section>;
}
