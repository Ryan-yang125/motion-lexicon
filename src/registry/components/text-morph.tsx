"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type TextMorphProps = { phrases: readonly string[]; label?: string; interval?: number; initialIndex?: number; className?: string; onChange?: (phrase: string, index: number) => void };

export function TextMorph({ phrases, label = "Text morph", interval = 4200, initialIndex = 0, className = "", onChange }: TextMorphProps) {
  const reduced = useReducedMotion() === true;
  const regionId = useId(); const rootRef = useRef<HTMLDivElement>(null); const visibleRef = useRef(true);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialIndex, phrases.length - 1)));
  useEffect(() => setIndex((value) => Math.max(0, Math.min(value, phrases.length - 1))), [phrases.length]);
  useEffect(() => { const root = rootRef.current; if (!root) return; const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry?.isIntersecting ?? false; }, { threshold: .1 }); observer.observe(root); return () => observer.disconnect(); }, []);
  useEffect(() => { if (reduced || phrases.length < 2 || interval <= 0) return; const timer = window.setInterval(() => { if (!visibleRef.current) return; setIndex((current) => { const next = (current + 1) % phrases.length; onChange?.(phrases[next], next); return next; }); }, interval); return () => window.clearInterval(timer); }, [interval, onChange, phrases, reduced]);
  const select = (next: number) => { if (!phrases.length) return; const safe = (next + phrases.length) % phrases.length; setIndex(safe); onChange?.(phrases[safe], safe); };
  const phrase = phrases[index] ?? "";
  return <div ref={rootRef} role="group" aria-labelledby={regionId} className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-black/[.1] bg-white px-2 py-1.5 shadow-[0_10px_25px_-20px_rgba(36,32,27,.7)] ${className}`}>
    <span id={regionId} className="sr-only">{label}</span><button type="button" onClick={() => select(index - 1)} aria-label="Previous phrase" className="grid size-9 place-items-center rounded-full text-stone-500 outline-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#4568FF]">←</button>
    <span aria-live="polite" className="grid min-w-[14ch] text-center text-[13px] font-medium tracking-[-.02em] text-stone-800"><AnimatePresence mode="popLayout" initial={false}><motion.span key={phrase} initial={reduced ? false : { opacity: 0, y: 7, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={reduced ? undefined : { opacity: 0, y: -7, filter: "blur(3px)" }} transition={{ duration: reduced ? 0 : .23, ease: [0.22, 1, 0.36, 1] }} className="col-start-1 row-start-1 whitespace-nowrap">{phrase}</motion.span></AnimatePresence></span>
    <button type="button" onClick={() => select(index + 1)} aria-label="Next phrase" className="grid size-9 place-items-center rounded-full text-stone-500 outline-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#4568FF]">→</button>
  </div>;
}
