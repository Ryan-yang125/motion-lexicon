"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export type CardStackItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  art?: ReactNode;
};

export type CardStackProps = {
  items: readonly CardStackItem[];
  label?: string;
  defaultIndex?: number;
  onChange?: (item: CardStackItem, index: number) => void;
  className?: string;
};

export function CardStack({ items, label = "Story stack", defaultIndex = 0, onChange, className = "" }: CardStackProps) {
  const [index, setIndex] = useState(() => Math.max(0, Math.min(defaultIndex, Math.max(0, items.length - 1))));
  const startX = useRef<number | null>(null);
  const reduced = useReducedMotion() === true;
  const active = items[index];
  if (!active) return null;
  const setActive = (next: number) => {
    const normalized = (next + items.length) % items.length;
    setIndex(normalized);
    onChange?.(items[normalized], normalized);
  };
  const cards = [0, 1, 2].map((offset) => items[(index + offset) % items.length]).filter(Boolean);

  return (
    <section aria-label={label} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); setActive(index + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); setActive(index - 1); } }} className={`w-full overflow-hidden rounded-[20px] border border-[#c5def0]/20 bg-[#10171c] p-4 shadow-[0_24px_56px_-36px_rgba(0,0,0,.9)] ${className}`}>
      <div className="mb-3 flex items-start justify-between gap-3 text-[#e7f6ff]"><div><span className="font-mono text-[9px] tracking-[.16em] text-[#a7cbdc]/60">SEQUENTIAL READER</span><h3 className="mt-1 text-[15px] font-medium tracking-[-.03em]">{label}</h3></div><span className="font-mono text-[9px] tracking-[.12em] text-[#a7cbdc]/60">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span></div>
      <div className="relative min-h-[264px]" onPointerDown={(event) => { startX.current = event.clientX; }} onPointerUp={(event) => { if (startX.current === null) return; const delta = event.clientX - startX.current; startX.current = null; if (Math.abs(delta) > 34) setActive(index + (delta > 0 ? -1 : 1)); }}>
        {cards.slice().reverse().map((item, reverseIndex) => {
          const depth = cards.length - reverseIndex - 1;
          const isCurrent = depth === 0;
          return <motion.article key={`${item.id}-${index}-${depth}`} initial={reduced ? false : { opacity: 0, y: 22, rotate: depth * 1.5 }} animate={{ opacity: 1 - depth * 0.15, y: depth * 11, scale: 1 - depth * 0.045, rotate: depth * 1.35 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 28 }} className="absolute inset-x-0 top-0 overflow-hidden rounded-[16px] border border-white/15 bg-[#203039] shadow-[0_24px_40px_-28px_rgba(0,0,0,.95)]" style={{ zIndex: 10 - depth }}>
            <div className="relative min-h-[244px] overflow-hidden p-5">
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(139,217,221,.45),transparent_30%),radial-gradient(circle_at_18%_92%,rgba(247,157,91,.33),transparent_38%)]" />
              {item.art ? <div aria-hidden className="absolute inset-0 opacity-90">{item.art}</div> : null}
              <div className="relative z-10 flex min-h-[204px] flex-col justify-between text-[#eefaff]"><div className="flex items-start justify-between gap-3"><span className="rounded-full border border-white/20 bg-black/15 px-2.5 py-1 font-mono text-[8px] tracking-[.13em]">{item.meta ?? "FEATURE"}</span>{isCurrent ? <button type="button" aria-label={`Read next after ${item.title}`} onClick={() => setActive(index + 1)} className="grid size-11 place-items-center rounded-full border border-white/20 bg-[#f4e5cc] text-[#16252a] outline-none focus-visible:ring-2 focus-visible:ring-[#9ed8ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[#203039]"><span aria-hidden>→</span></button> : null}</div><div><h4 className="max-w-[13ch] font-serif text-[33px] leading-[.88] tracking-[-.065em]">{item.title}</h4>{item.description ? <p className="mt-3 max-w-[38ch] text-[11px] leading-relaxed text-[#e0f0ec]/75">{item.description}</p> : null}</div></div>
            </div>
          </motion.article>;
        })}
      </div>
      <div className="mt-3 flex gap-2" role="group" aria-label="Stack controls"><button type="button" onClick={() => setActive(index - 1)} className="min-h-11 flex-1 rounded-xl border border-white/15 bg-white/[0.06] px-3 text-[11px] font-medium text-[#daf1ef] outline-none focus-visible:ring-2 focus-visible:ring-[#9ed8ee]">Previous</button><button type="button" onClick={() => setActive(index + 1)} className="min-h-11 flex-1 rounded-xl bg-[#e4f0d8] px-3 text-[11px] font-semibold text-[#142228] outline-none focus-visible:ring-2 focus-visible:ring-[#9ed8ee] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10171c]">Next story</button></div>
    </section>
  );
}
