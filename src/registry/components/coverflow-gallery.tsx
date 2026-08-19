"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export type CoverflowGalleryItem = { id: string; title: string; caption?: string; meta?: string; art: ReactNode };
export type CoverflowGalleryProps = { items: readonly CoverflowGalleryItem[]; label?: string; defaultIndex?: number; onChange?: (item: CoverflowGalleryItem, index: number) => void; className?: string };

function distanceFrom(active: number, index: number, count: number) {
  let distance = index - active;
  if (distance > count / 2) distance -= count;
  if (distance < -count / 2) distance += count;
  return distance;
}

export function CoverflowGallery({ items, label = "Coverflow gallery", defaultIndex = 0, onChange, className = "" }: CoverflowGalleryProps) {
  const [active, setActiveState] = useState(() => Math.max(0, Math.min(defaultIndex, Math.max(0, items.length - 1))));
  const startX = useRef<number | null>(null);
  const reduced = useReducedMotion() === true;
  const current = items[active];
  if (!current) return null;
  const setActive = (index: number) => { const normalized = (index + items.length) % items.length; setActiveState(normalized); onChange?.(items[normalized], normalized); };

  return (
    <section aria-label={label} className={`w-full overflow-hidden rounded-[20px] border border-[#c7b6ee]/20 bg-[#17152a] p-3 text-[#fff0e0] shadow-[0_24px_56px_-36px_rgba(0,0,0,.9)] ${className}`}>
      <div className="mb-2 flex items-end justify-between gap-3 px-1"><div><span className="font-mono text-[9px] tracking-[.16em] text-[#cfc4fa]/62">LISTENING ROOM</span><h3 className="mt-1 font-serif text-[20px] leading-none tracking-[-.05em]">{label}</h3></div><span className="font-mono text-[9px] tracking-[.12em] text-[#cfc4fa]/62">{String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span></div>
      <div tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); setActive(active - 1); } if (event.key === "ArrowRight") { event.preventDefault(); setActive(active + 1); } }} onPointerDown={(event) => { startX.current = event.clientX; }} onPointerUp={(event) => { if (startX.current === null) return; const delta = event.clientX - startX.current; startX.current = null; if (Math.abs(delta) > 32) setActive(active + (delta > 0 ? -1 : 1)); }} className="relative h-[268px] touch-pan-y overflow-hidden rounded-[15px] bg-[radial-gradient(circle_at_50%_22%,rgba(144,109,255,.28),transparent_36%),linear-gradient(#242044,#151326)] outline-none focus-visible:ring-2 focus-visible:ring-[#b8a8ff]">
        {items.map((item, index) => {
          const distance = distanceFrom(active, index, items.length);
          const visible = Math.abs(distance) <= 2;
          return <motion.button key={item.id} type="button" aria-pressed={index === active} aria-label={`Show ${item.title}`} onClick={() => setActive(index)} initial={false} animate={{ x: `${distance * 55}%`, scale: distance === 0 ? 1 : 0.73, rotateY: distance * -31, opacity: visible ? (distance === 0 ? 1 : 0.52) : 0, zIndex: 10 - Math.abs(distance) }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 270, damping: 30 }} className="absolute left-[24%] top-4 h-[210px] w-[52%] min-w-[176px] overflow-hidden rounded-[13px] border border-white/20 bg-[#292342] text-left shadow-[0_24px_36px_-22px_rgba(0,0,0,.92)] outline-none focus-visible:ring-2 focus-visible:ring-[#e5c28f]" style={{ transformPerspective: 900 }}>
            <span aria-hidden className="absolute inset-0">{item.art}</span><span className="absolute inset-0 bg-gradient-to-t from-[#0b0920]/75 via-transparent to-transparent" /><span className="absolute inset-x-3 bottom-3"><strong className="block truncate font-serif text-[20px] leading-none tracking-[-.04em]">{item.title}</strong><span className="mt-1 block truncate font-mono text-[8px] tracking-[.12em] text-white/65">{item.meta ?? "TRACK"}</span></span>
          </motion.button>;
        })}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 px-1"><div className="min-w-0"><strong className="block truncate text-[12px] font-medium">{current.title}</strong>{current.caption ? <span className="mt-1 block truncate text-[10px] text-[#d8d0f4]/70">{current.caption}</span> : null}</div><div className="flex shrink-0 gap-1"><button type="button" aria-label="Previous work" onClick={() => setActive(active - 1)} className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.08] outline-none focus-visible:ring-2 focus-visible:ring-[#b8a8ff]">←</button><button type="button" aria-label="Next work" onClick={() => setActive(active + 1)} className="grid size-11 place-items-center rounded-full bg-[#f2d6a7] text-[#241b30] outline-none focus-visible:ring-2 focus-visible:ring-[#b8a8ff]">→</button></div></div>
    </section>
  );
}
