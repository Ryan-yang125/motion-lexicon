"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type SplitTextRevealProps = {
  text: string;
  mode?: "word" | "character";
  label?: string;
  replayLabel?: string;
  className?: string;
};

export function SplitTextReveal({ text, mode = "word", label = "Split text reveal", replayLabel = "Replay reveal", className = "" }: SplitTextRevealProps) {
  const reduced = useReducedMotion() === true;
  const titleId = useId();
  const [run, setRun] = useState(0);
  const segments = mode === "character" ? Array.from(text) : text.split(/(\s+)/).filter(Boolean);
  return <section aria-labelledby={titleId} className={`overflow-hidden rounded-[18px] bg-[#e8dfd1] p-5 text-[#342b22] shadow-[0_18px_52px_-34px_rgba(81,57,37,.5)] sm:p-8 ${className}`}>
    <div className="flex items-start justify-between gap-4"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8d6c4b]">Editorial typography</span><button type="button" aria-label={replayLabel} onClick={() => setRun((value) => value + 1)} className="grid size-11 shrink-0 place-items-center rounded-full border border-[#342b22]/16 text-sm outline-none transition hover:bg-white/45 focus-visible:ring-2 focus-visible:ring-[#4568FF]" title={replayLabel}>↻</button></div>
    <h3 id={titleId} className="mt-8 max-w-[12ch] text-4xl font-medium leading-[.93] tracking-[-.065em] sm:text-6xl">
      {segments.map((segment, index) => <span key={`${run}-${index}-${segment}`} className="inline-block overflow-hidden align-top"><motion.span initial={reduced ? false : { y: "108%", rotate: 2, opacity: 0 }} animate={{ y: "0%", rotate: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : .52, delay: reduced ? 0 : index * .045, ease: [0.22, 1, 0.36, 1] }} className="inline-block will-change-transform">{segment}</motion.span></span>)}
    </h3>
    <p className="mt-6 max-w-sm text-[12px] leading-relaxed text-[#655445]">{label}</p>
  </section>;
}
