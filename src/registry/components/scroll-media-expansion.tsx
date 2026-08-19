"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type ScrollMediaExpansionSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  accent?: string;
};

export type ScrollMediaExpansionProps = {
  slides: readonly ScrollMediaExpansionSlide[];
  label?: string;
  initialIndex?: number;
  className?: string;
  onChange?: (slide: ScrollMediaExpansionSlide, index: number) => void;
};

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, Math.max(0, max)));

export function ScrollMediaExpansion({
  slides,
  label = "Scroll media expansion",
  initialIndex = 0,
  className = "",
  onChange,
}: ScrollMediaExpansionProps) {
  const reduced = useReducedMotion() === true;
  const titleId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(() => clamp(initialIndex, slides.length));
  const active = slides[activeIndex];

  useEffect(() => {
    setActiveIndex((index) => clamp(index, slides.length));
  }, [slides.length]);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  const select = (index: number, focus = false) => {
    const nextIndex = clamp(index, slides.length);
    const next = slides[nextIndex];
    if (!next) return;
    setActiveIndex(nextIndex);
    onChange?.(next, nextIndex);
    const target = itemRefs.current[nextIndex];
    target?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    if (focus) target?.focus({ preventScroll: true });
  };

  const onScroll = () => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const scroller = scrollerRef.current;
      if (!scroller || slides.length === 0) return;
      const center = scroller.getBoundingClientRect().top + scroller.clientHeight / 2;
      let closest = activeIndex;
      let distance = Number.POSITIVE_INFINITY;
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        const rect = item.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height / 2 - center);
        if (nextDistance < distance) {
          closest = index;
          distance = nextDistance;
        }
      });
      if (closest !== activeIndex && slides[closest]) {
        setActiveIndex(closest);
        onChange?.(slides[closest], closest);
      }
    });
  };

  if (!active) {
    return <div role="status" className={`grid min-h-64 place-items-center rounded-[18px] bg-stone-100 p-6 text-sm text-stone-500 ${className}`}>No media available.</div>;
  }

  return (
    <section aria-labelledby={titleId} className={`overflow-hidden rounded-[18px] bg-[#1d211f] text-white shadow-[0_18px_60px_-30px_rgba(22,25,21,.72)] ${className}`}>
      <div className="grid min-h-[430px] grid-rows-[minmax(250px,1fr)_180px] md:grid-cols-[minmax(0,1.35fr)_minmax(190px,.65fr)] md:grid-rows-1">
        <div className="relative isolate overflow-hidden bg-[#443d34]">
          <motion.img
            key={active.id}
            src={active.image}
            alt={active.imageAlt}
            initial={reduced ? false : { opacity: 0.35, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.48, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,17,15,.42),transparent_62%),linear-gradient(0deg,rgba(16,17,15,.6),transparent_48%)]" />
          <div className="absolute inset-x-5 bottom-5 max-w-md sm:inset-x-8 sm:bottom-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/75">{active.eyebrow}</span>
            <h3 id={titleId} className="mt-2 max-w-[13ch] text-3xl font-medium leading-[.96] tracking-[-.055em] sm:text-5xl">{active.title}</h3>
            <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-white/78">{active.description}</p>
          </div>
          <div className="absolute right-5 top-5 font-mono text-[10px] text-white/70">{String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</div>
        </div>
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); select(activeIndex + 1, true); }
            if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); select(activeIndex - 1, true); }
            if (event.key === "Home") { event.preventDefault(); select(0, true); }
            if (event.key === "End") { event.preventDefault(); select(slides.length - 1, true); }
          }}
          tabIndex={0}
          aria-label={`${label} chapters`}
          className="flex overflow-x-auto overscroll-contain border-t border-white/10 bg-[#1d211f] p-2 outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#c3ff69] md:block md:overflow-y-auto md:border-l md:border-t-0 md:p-3"
        >
          {slides.map((slide, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={slide.id}
                ref={(node) => { itemRefs.current[index] = node; }}
                type="button"
                aria-current={selected ? "step" : undefined}
                onClick={() => select(index)}
                className={`group relative min-h-36 min-w-[180px] overflow-hidden rounded-[12px] text-left outline-none md:mb-2 md:block md:min-w-0 ${selected ? "ring-1 ring-white/55" : "opacity-65 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#c3ff69]"}`}
              >
                <img src={slide.image} alt="" className="absolute inset-0 size-full object-cover opacity-55 transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute inset-0 bg-black/40" />
                <span className="relative flex min-h-36 flex-col justify-end p-3">
                  <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/70">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 text-sm leading-tight">{slide.title}</strong>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
