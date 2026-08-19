"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ChangelogEntry = { id: string; date: string; version: string; title: string; description: string; tag?: string };
export type ChangelogTimelineProps = { entries: readonly ChangelogEntry[]; label?: string; className?: string };

export function ChangelogTimeline({ entries, label = "Changelog", className = "" }: ChangelogTimelineProps) {
  const reduced = useReducedMotion() === true; const headingId = useId(); const [active, setActive] = useState(0); const current = entries[active];
  if (!current) return <div role="status" className={`rounded-[16px] bg-neutral-100 p-4 text-sm text-neutral-500 ${className}`}>No releases available.</div>;
  return <section aria-labelledby={headingId} className={`rounded-[16px] bg-[#202322] p-4 text-[#f5f2eb] shadow-[0_16px_38px_-28px_rgba(12,14,13,.7)] ${className}`}><span className="font-mono text-[10px] uppercase tracking-[.16em] text-[#b0c8ab]">{label}</span><div className="mt-5 grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)]"><div role="tablist" aria-label={label} className="flex gap-1 overflow-auto sm:block">{entries.map((entry, index) => <button key={entry.id} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)} className={`min-h-11 shrink-0 rounded-full px-3 text-left font-mono text-[10px] outline-none focus-visible:ring-2 focus-visible:ring-[#d3f3c6] sm:mb-1 sm:block sm:w-full ${index === active ? "bg-white text-[#202322]" : "text-white/56 hover:bg-white/10"}`}>{entry.version}</button>)}</div><AnimatePresence mode="wait" initial={false}><motion.article key={current.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -7 }} transition={{ duration: reduced ? 0 : .24 }}><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] text-white/55">{current.date}</span>{current.tag ? <span className="rounded-full bg-[#d7ebc8] px-2 py-1 font-mono text-[9px] text-[#263124]">{current.tag}</span> : null}</div><h3 id={headingId} className="mt-5 text-2xl font-medium tracking-[-.05em]">{current.title}</h3><p className="mt-3 max-w-md text-[12px] leading-relaxed text-white/68">{current.description}</p></motion.article></AnimatePresence></div></section>;
}
