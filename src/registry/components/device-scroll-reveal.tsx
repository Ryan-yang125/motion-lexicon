"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type DeviceScrollRevealStep = { id: string; label: string; title: string; copy: string; screen: ReactNode };
export type DeviceScrollRevealProps = { steps: readonly DeviceScrollRevealStep[]; label?: string; initialStep?: number; className?: string; onStepChange?: (step: DeviceScrollRevealStep, index: number) => void };

export function DeviceScrollReveal({ steps, label = "Device product reveal", initialStep = 0, className = "", onStepChange }: DeviceScrollRevealProps) {
  const reduced = useReducedMotion() === true;
  const headingId = useId();
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialStep, steps.length - 1)));
  const active = steps[index];
  const timerRef = useRef<number | null>(null);
  useEffect(() => () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); }, []);
  useEffect(() => setIndex((current) => Math.max(0, Math.min(current, steps.length - 1))), [steps.length]);
  const select = (next: number) => {
    const nextIndex = Math.max(0, Math.min(next, steps.length - 1));
    const step = steps[nextIndex];
    if (!step) return;
    setIndex(nextIndex); onStepChange?.(step, nextIndex);
  };
  if (!active) return <div role="status" className={`grid min-h-64 place-items-center rounded-[18px] bg-stone-100 text-sm text-stone-500 ${className}`}>No product moments available.</div>;
  return (
    <section aria-labelledby={headingId} className={`overflow-hidden rounded-[18px] bg-[#e4dfd5] text-[#25231f] shadow-[0_18px_55px_-28px_rgba(53,42,30,.55)] ${className}`}>
      <div className="grid min-h-[430px] grid-rows-[.8fr_1fr] md:grid-cols-[minmax(0,.78fr)_minmax(0,1.22fr)] md:grid-rows-1">
        <div className="flex flex-col justify-between p-5 sm:p-8">
          <div><span className="font-mono text-[10px] uppercase tracking-[.18em] text-stone-500">{active.label}</span><h3 id={headingId} className="mt-3 max-w-[10ch] text-4xl font-medium leading-[.94] tracking-[-.06em]">{active.title}</h3><p className="mt-4 max-w-xs text-[13px] leading-relaxed text-stone-600">{active.copy}</p></div>
          <div role="tablist" aria-label={label} className="mt-7 flex gap-1.5">
            {steps.map((step, stepIndex) => <button key={step.id} type="button" role="tab" aria-selected={index === stepIndex} aria-label={`${stepIndex + 1}. ${step.title}`} onClick={() => select(stepIndex)} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); select(index + 1); } if (event.key === "ArrowLeft") { event.preventDefault(); select(index - 1); } }} className={`min-h-11 min-w-11 rounded-full border px-3 font-mono text-[10px] outline-none transition focus-visible:ring-2 focus-visible:ring-[#4568FF] ${index === stepIndex ? "border-[#25231f] bg-[#25231f] text-white" : "border-black/12 text-stone-500 hover:border-black/35"}`}>{String(stepIndex + 1).padStart(2, "0")}</button>)}
          </div>
        </div>
        <div className="relative grid min-h-[260px] place-items-center overflow-hidden bg-[#cfd8c9] p-6">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(253,255,244,.8),transparent_34%),linear-gradient(135deg,#b6c5ad,#dde0d2)]" />
          <motion.div animate={reduced ? { y: 0, rotate: 0 } : { y: [0, -8, 0], rotate: [-1.5, 1.2, -1.5] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative w-[min(82%,310px)] rounded-[29px] border-[7px] border-[#252827] bg-[#121514] p-1.5 shadow-[18px_30px_42px_-23px_rgba(35,46,31,.7)]">
            <div className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#2f3331]" />
            <div className="aspect-[9/16] overflow-hidden rounded-[21px] bg-[#f7f4ed]">
              <AnimatePresence mode="wait" initial={false}><motion.div key={active.id} initial={reduced ? false : { opacity: 0, y: 16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, y: -12, scale: 1.02 }} transition={{ duration: reduced ? 0 : .32, ease: [0.22, 1, 0.36, 1] }} className="size-full">{active.screen}</motion.div></AnimatePresence>
            </div>
          </motion.div>
          <span className="absolute bottom-4 right-5 font-mono text-[9px] uppercase tracking-[.16em] text-[#51604c]">Scroll through a product</span>
        </div>
      </div>
    </section>
  );
}
