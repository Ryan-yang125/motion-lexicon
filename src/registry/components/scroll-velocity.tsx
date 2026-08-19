"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type ScrollVelocityProps = { text: string; label?: string; maxOffset?: number; className?: string };

export function ScrollVelocity({ text, label = "Scroll velocity", maxOffset = 34, className = "" }: ScrollVelocityProps) {
  const reduced = useReducedMotion() === true;
  const labelId = useId(); const rootRef = useRef<HTMLDivElement>(null); const visibleRef = useRef(true); const previousY = useRef(0); const settleRef = useRef<number | null>(null); const [offset, setOffset] = useState(0);
  useEffect(() => {
    const root = rootRef.current; if (!root || reduced) return;
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry?.isIntersecting ?? false; }, { threshold: .08 }); observer.observe(root);
    previousY.current = window.scrollY;
    const onScroll = () => { if (!visibleRef.current) return; const delta = window.scrollY - previousY.current; previousY.current = window.scrollY; const next = Math.max(-maxOffset, Math.min(maxOffset, delta * .72)); setOffset(next); if (settleRef.current !== null) window.clearTimeout(settleRef.current); settleRef.current = window.setTimeout(() => { settleRef.current = null; setOffset(0); }, 130); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); if (settleRef.current !== null) window.clearTimeout(settleRef.current); };
  }, [maxOffset, reduced]);
  const repeated = `${text} · ${text} · ${text}`;
  return <section ref={rootRef} aria-labelledby={labelId} className={`relative isolate overflow-hidden rounded-[16px] bg-[#20201e] px-4 py-7 text-[#f6f0e6] shadow-[0_14px_38px_-22px_rgba(12,12,10,.75)] ${className}`}>
    <span id={labelId} className="relative z-10 font-mono text-[10px] uppercase tracking-[.18em] text-[#d8bd93]">{label}</span><div aria-hidden className="mt-5 overflow-hidden"><motion.div animate={{ x: reduced ? 0 : offset }} transition={{ type: "spring", stiffness: 280, damping: 24, mass: .35 }} className="w-max whitespace-nowrap text-4xl font-medium leading-none tracking-[-.065em] text-[#f2ebe0] sm:text-6xl">{repeated}</motion.div></div><p className="relative z-10 mt-4 max-w-xs text-[12px] leading-relaxed text-white/64">{text}</p>
  </section>;
}
