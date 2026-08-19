"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type FocusGalleryItem = {
  id: string;
  title: string;
  caption?: string;
  meta?: string;
  art: ReactNode;
};

export type FocusGalleryProps = {
  items: readonly FocusGalleryItem[];
  label?: string;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (item: FocusGalleryItem, index: number) => void;
  className?: string;
};

export function FocusGallery({
  items,
  label = "Focus gallery",
  activeId,
  defaultActiveId,
  onActiveChange,
  className = "",
}: FocusGalleryProps) {
  const fallbackId = items[0]?.id ?? "";
  const [internalId, setInternalId] = useState(defaultActiveId ?? fallbackId);
  const selectedId = activeId ?? internalId;
  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const selected = items[selectedIndex];
  const reduced = useReducedMotion() === true;
  const startX = useRef<number | null>(null);
  const transition = reduced ? { duration: 0 } : { duration: 0.34, ease: [0.22, 1, 0.36, 1] as const };

  const setActive = (index: number) => {
    const item = items[index];
    if (!item) return;
    if (activeId === undefined) setInternalId(item.id);
    onActiveChange?.(item, index);
  };
  const move = (delta: number) => setActive((selectedIndex + delta + items.length) % Math.max(items.length, 1));
  const status = useMemo(() => selected ? `${selected.title}. ${selected.caption ?? ""}` : "", [selected]);

  if (!selected) return null;

  return (
    <section
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        if (event.key === "Home") { event.preventDefault(); setActive(0); }
        if (event.key === "End") { event.preventDefault(); setActive(items.length - 1); }
      }}
      onPointerDown={(event) => { startX.current = event.clientX; }}
      onPointerUp={(event) => {
        if (startX.current === null) return;
        const delta = event.clientX - startX.current;
        startX.current = null;
        if (Math.abs(delta) > 36) move(delta > 0 ? -1 : 1);
      }}
      className={`w-full overflow-hidden rounded-[20px] border border-[#3c3024]/15 bg-[#f2e6d3] p-3 shadow-[0_24px_50px_-38px_rgba(48,31,13,.82)] dark:border-white/10 dark:bg-[#191510] ${className}`}
    >
      <div className="mb-3 flex items-end justify-between gap-4 px-1">
        <div><span className="font-mono text-[9px] tracking-[.16em] text-[#7b6650] dark:text-[#f3d6af]/60">EDITORIAL SELECTION</span><h3 className="mt-1 font-serif text-[20px] leading-none tracking-[-.05em] text-[#2d251d] dark:text-[#fff2dc]">{label}</h3></div>
        <span className="font-mono text-[9px] tracking-[.12em] text-[#7b6650] dark:text-[#f3d6af]/60">{String(selectedIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_128px]">
        <div className="relative min-h-[250px] overflow-hidden rounded-[15px] bg-[#221913] sm:min-h-[300px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div key={selected.id} initial={reduced ? false : { opacity: 0, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.985 }} transition={transition} className="absolute inset-0">
              {selected.art}
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5 text-[#fff3df]">
            <span className="font-mono text-[9px] tracking-[.14em] text-[#ffe1b7]/75">{selected.meta ?? "FEATURE"}</span>
            <strong className="mt-1 block font-serif text-[30px] leading-[.9] tracking-[-.055em]">{selected.title}</strong>
            {selected.caption ? <span className="mt-2 block max-w-[42ch] text-[11px] leading-relaxed text-white/72">{selected.caption}</span> : null}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
          {items.map((item, index) => {
            const active = index === selectedIndex;
            return <button key={item.id} type="button" aria-pressed={active} aria-label={`Show ${item.title}`} onClick={() => setActive(index)} className={`group relative min-h-[80px] overflow-hidden rounded-xl border text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2e6d3] dark:focus-visible:ring-offset-[#191510] ${active ? "border-[#c56b47] ring-1 ring-[#c56b47]/35" : "border-[#3c3024]/15 dark:border-white/10"}`}>
              <span className={`absolute inset-0 ${active ? "opacity-100" : "opacity-65 group-hover:opacity-100"}`}>{item.art}</span>
              <span className="absolute inset-0 bg-black/20" />
              <span className="relative z-10 flex h-full items-end p-2 font-mono text-[8px] tracking-[.12em] text-white">{String(index + 1).padStart(2, "0")}</span>
            </button>;
          })}
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite">{status}</span>
    </section>
  );
}
