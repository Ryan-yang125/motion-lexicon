"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ImageTrailItem = { id: string; src: string; alt: string; label?: string };
export type ImageTrailProps = { images: readonly ImageTrailItem[]; label?: string; threshold?: number; maxVisible?: number; className?: string };
type TrailEntry = ImageTrailItem & { key: number; x: number; y: number; rotation: number };

export function ImageTrail({ images, label = "Image trail", threshold = 54, maxVisible = 5, className = "" }: ImageTrailProps) {
  const reduced = useReducedMotion() === true;
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const sequenceRef = useRef(0);
  const timeoutsRef = useRef(new Set<number>());
  const [trail, setTrail] = useState<TrailEntry[]>([]);
  useEffect(() => () => { timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout)); timeoutsRef.current.clear(); }, []);
  const clearTrail = () => setTrail([]);
  const add = (clientX: number, clientY: number) => {
    if (reduced || images.length === 0) return;
    const root = rootRef.current; if (!root) return;
    const rect = root.getBoundingClientRect();
    const point = { x: clientX - rect.left, y: clientY - rect.top };
    const previous = lastRef.current;
    if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < threshold) return;
    lastRef.current = point;
    const key = sequenceRef.current++;
    const item = images[key % images.length];
    const entry: TrailEntry = { ...item, key, x: point.x, y: point.y, rotation: ((key * 17) % 18) - 9 };
    setTrail((current) => [...current.slice(-(Math.max(1, maxVisible) - 1)), entry]);
    const timeout = window.setTimeout(() => { timeoutsRef.current.delete(timeout); setTrail((current) => current.filter((candidate) => candidate.key !== key)); }, 980);
    timeoutsRef.current.add(timeout);
  };
  const active = images[0];
  if (!active) return <div role="status" className={`grid min-h-64 place-items-center rounded-[18px] bg-stone-100 text-sm text-stone-500 ${className}`}>No images available.</div>;
  return <section aria-labelledby={titleId} className={`overflow-hidden rounded-[18px] bg-[#d5d9cc] p-2 shadow-[0_18px_58px_-32px_rgba(36,47,31,.55)] ${className}`}>
    <div ref={rootRef} aria-label={label} onPointerMove={(event) => { if (event.pointerType === "mouse") add(event.clientX, event.clientY); }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); add(event.clientX, event.clientY); }} onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerLeave={() => { lastRef.current = null; }} className="relative min-h-[360px] overflow-hidden rounded-[13px] bg-[#243127] outline-none" tabIndex={0} onKeyDown={(event) => { if (event.key === "Escape") clearTrail(); }}>
      <img src={active.src} alt={active.alt} className="absolute inset-0 size-full object-cover opacity-70" /><span className="absolute inset-0 bg-[linear-gradient(140deg,rgba(13,22,15,.46),rgba(24,44,33,.08)_50%,rgba(12,20,14,.58))]" />
      <div className="relative z-10 flex min-h-[360px] flex-col justify-between p-5 text-white"><div><span className="font-mono text-[10px] uppercase tracking-[.2em] text-white/65">Editorial interaction</span><h3 id={titleId} className="mt-2 max-w-[9ch] text-4xl font-medium leading-[.94] tracking-[-.06em]">Follow the quiet movement.</h3></div><div className="flex items-end justify-between gap-3"><p className="max-w-[26ch] text-[12px] leading-relaxed text-white/74">Move through the frame to collect fragments. Touch or click creates a single trace.</p><button type="button" onClick={clearTrail} className="min-h-11 shrink-0 rounded-full border border-white/30 bg-black/10 px-4 text-[11px] outline-none backdrop-blur-sm transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-white">Clear</button></div></div>
      <AnimatePresence>{!reduced && trail.map((entry) => <motion.figure key={entry.key} initial={{ opacity: 0, scale: .76, x: entry.x - 55, y: entry.y - 70, rotate: entry.rotation - 7 }} animate={{ opacity: 1, scale: 1, x: entry.x - 55, y: entry.y - 70, rotate: entry.rotation }} exit={{ opacity: 0, scale: .9, transition: { duration: .26 } }} transition={{ duration: .24, ease: [0.22, 1, 0.36, 1] }} className="pointer-events-none absolute left-0 top-0 z-20 w-[110px] overflow-hidden rounded-[5px] border border-white/55 bg-white shadow-[0_18px_34px_-17px_rgba(0,0,0,.8)]"><img src={entry.src} alt="" className="aspect-[4/5] w-full object-cover" />{entry.label ? <figcaption className="truncate px-2 py-1.5 font-mono text-[8px] uppercase tracking-[.12em] text-stone-600">{entry.label}</figcaption> : null}</motion.figure>)}</AnimatePresence>
    </div>
  </section>;
}
