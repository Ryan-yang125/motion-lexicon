"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type AnimatedTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  portrait: string;
  portraitAlt: string;
  company?: string;
};

export type AnimatedTestimonialsProps = {
  testimonials: readonly AnimatedTestimonial[];
  label?: string;
  autoAdvanceMs?: number;
  initialIndex?: number;
  className?: string;
  onChange?: (testimonial: AnimatedTestimonial, index: number) => void;
};

export function AnimatedTestimonials({ testimonials, label = "Customer testimonials", autoAdvanceMs = 6500, initialIndex = 0, className = "", onChange }: AnimatedTestimonialsProps) {
  const reduced = useReducedMotion() === true;
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const visibleRef = useRef(true);
  const pausedRef = useRef(false);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialIndex, testimonials.length - 1)));
  const active = testimonials[index];
  useEffect(() => setIndex((value) => Math.max(0, Math.min(value, testimonials.length - 1))), [testimonials.length]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry?.isIntersecting ?? false; }, { threshold: .15 });
    observer.observe(root); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduced || testimonials.length < 2 || autoAdvanceMs <= 0) return;
    const timer = window.setInterval(() => {
      if (!visibleRef.current || pausedRef.current) return;
      setIndex((current) => {
        const next = (current + 1) % testimonials.length;
        onChange?.(testimonials[next], next);
        return next;
      });
    }, autoAdvanceMs);
    return () => window.clearInterval(timer);
  }, [autoAdvanceMs, onChange, reduced, testimonials]);
  const select = (next: number) => {
    if (!testimonials.length) return;
    const safe = (next + testimonials.length) % testimonials.length;
    setIndex(safe); onChange?.(testimonials[safe], safe);
  };
  if (!active) return <div role="status" className={`grid min-h-64 place-items-center rounded-[18px] bg-stone-100 text-sm text-stone-500 ${className}`}>No testimonials available.</div>;
  return <section ref={rootRef} aria-labelledby={headingId} onPointerEnter={() => { pausedRef.current = true; }} onPointerLeave={() => { pausedRef.current = false; }} onFocusCapture={() => { pausedRef.current = true; }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) pausedRef.current = false; }} className={`overflow-hidden rounded-[18px] bg-[#241f1b] text-[#f7f0e7] shadow-[0_20px_60px_-30px_rgba(45,28,15,.8)] ${className}`}>
    <div className="grid min-h-[380px] md:grid-cols-[minmax(190px,.72fr)_minmax(0,1.28fr)]">
      <div className="relative min-h-52 overflow-hidden bg-[#b65e43] md:min-h-0">
        <AnimatePresence mode="wait" initial={false}><motion.img key={active.id} src={active.portrait} alt={active.portraitAlt} initial={reduced ? false : { opacity: 0, scale: 1.12 }} animate={{ opacity: 1, scale: 1 }} exit={reduced ? undefined : { opacity: 0, scale: .96 }} transition={{ duration: reduced ? 0 : .56, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 size-full object-cover" /></AnimatePresence>
        <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(36,31,27,.45),transparent_60%)]" />
        <span className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[.18em] text-white/75">{String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</span>
      </div>
      <div className="flex flex-col justify-between p-5 sm:p-8"><div>
        <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#dcae83]">{label}</span>
        <AnimatePresence mode="wait" initial={false}><motion.div key={active.id} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -10 }} transition={{ duration: reduced ? 0 : .34, ease: [0.22, 1, 0.36, 1] }}><blockquote id={headingId} className="mt-5 max-w-[24ch] text-2xl font-medium leading-[1.08] tracking-[-.04em] sm:text-3xl">“{active.quote}”</blockquote><div className="mt-6"><strong className="text-sm">{active.name}</strong><span className="mt-1 block text-[12px] text-[#d8c6b6]">{active.role}{active.company ? ` · ${active.company}` : ""}</span></div></motion.div></AnimatePresence>
      </div><div className="mt-6 flex items-center justify-between gap-3"><div role="tablist" aria-label={label} className="flex gap-1.5">{testimonials.map((item, itemIndex) => <button key={item.id} type="button" role="tab" aria-selected={itemIndex === index} aria-label={`Show testimonial from ${item.name}`} onClick={() => select(itemIndex)} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); select(index + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); select(index - 1); } }} className={`min-h-11 min-w-11 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#f1c48e] ${itemIndex === index ? "bg-[#f3e1cc] text-[#332218]" : "border border-white/20 text-white/70 hover:border-white/45"}`}>{String(itemIndex + 1).padStart(2, "0")}</button>)}</div><button type="button" onClick={() => select(index + 1)} className="min-h-11 rounded-full border border-white/20 px-4 text-[12px] outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#f1c48e]">Next <span aria-hidden>→</span></button></div></div>
    </div>
  </section>;
}
