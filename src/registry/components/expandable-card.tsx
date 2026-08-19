"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

export type ExpandableCardItem = { id: string; title: string; summary: string; detail: string; image: string; imageAlt: string; meta?: string };
export type ExpandableCardProps = { items: readonly ExpandableCardItem[]; label?: string; initialId?: string; className?: string; onChange?: (item: ExpandableCardItem | null) => void };

export function ExpandableCard({ items, label = "Expandable stories", initialId, className = "", onChange }: ExpandableCardProps) {
  const reduced = useReducedMotion() === true;
  const titleId = useId();
  const [expandedId, setExpandedId] = useState<string | null>(() => initialId && items.some((item) => item.id === initialId) ? initialId : null);
  useEffect(() => { if (expandedId && !items.some((item) => item.id === expandedId)) setExpandedId(null); }, [expandedId, items]);
  const toggle = (item: ExpandableCardItem) => { const next = expandedId === item.id ? null : item.id; setExpandedId(next); onChange?.(next ? item : null); };
  return <section aria-labelledby={titleId} className={`rounded-[18px] bg-[#f0ebe3] p-3 text-[#27231e] shadow-[0_18px_55px_-35px_rgba(67,51,34,.6)] ${className}`}>
    <div className="mb-3 flex items-center justify-between px-2 pt-1"><h3 id={titleId} className="font-mono text-[10px] uppercase tracking-[.18em] text-stone-500">{label}</h3><span className="font-mono text-[10px] text-stone-500">{String(items.length).padStart(2, "0")} notes</span></div>
    <LayoutGroup id={titleId}><div className="grid gap-2 sm:grid-cols-3">
      {items.map((item) => { const expanded = item.id === expandedId; return <motion.article layout key={item.id} className={`overflow-hidden rounded-[14px] bg-[#fcfaf7] ${expanded ? "sm:col-span-2" : ""}`} transition={{ duration: reduced ? 0 : .36, ease: [0.22, 1, 0.36, 1] }}>
        <button type="button" aria-expanded={expanded} onClick={() => toggle(item)} className="group block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4568FF]">
          <motion.div layout className={`relative overflow-hidden ${expanded ? "aspect-[16/8]" : "aspect-[4/5]"}`}><img src={item.image} alt={item.imageAlt} className="size-full object-cover transition duration-500 group-hover:scale-[1.035]" /><span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(24,20,16,.5),transparent_55%)]" /><span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[.15em] text-white/78">{item.meta ?? "Field note"}</span></motion.div>
          <motion.div layout className="p-3.5"><h4 className="text-lg font-medium leading-[.98] tracking-[-.045em]">{item.title}</h4><p className="mt-2 text-[12px] leading-relaxed text-stone-600">{item.summary}</p><AnimatePresence initial={false}>{expanded ? <motion.p initial={reduced ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={reduced ? undefined : { opacity: 0, height: 0 }} className="overflow-hidden pt-3 text-[12px] leading-relaxed text-stone-500">{item.detail}</motion.p> : null}</AnimatePresence><span className="mt-4 inline-flex min-h-11 items-center font-mono text-[10px] uppercase tracking-[.14em] text-stone-600">{expanded ? "Close story" : "Read story"}<span aria-hidden className="ml-2">↗</span></span></motion.div>
        </button>
      </motion.article>; })}
    </div></LayoutGroup>
  </section>;
}
