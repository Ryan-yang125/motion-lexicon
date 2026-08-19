"use client";

import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

export type KineticHeadingProps = { text: string; label?: string; detail?: string; className?: string };

export function KineticHeading({ text, label = "Kinetic heading", detail = "Move across the heading or use arrow keys to change its tension.", className = "" }: KineticHeadingProps) {
  const reduced = useReducedMotion() === true;
  const headingId = useId(); const rootRef = useRef<HTMLElement>(null); const [tension, setTension] = useState(.52);
  const setFromPointer = (event: ReactPointerEvent<HTMLElement>) => { if (reduced || event.pointerType !== "mouse") return; const bounds = event.currentTarget.getBoundingClientRect(); setTension(Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))); };
  const weight = 390 + tension * 400; const spacing = -0.066 + tension * .046;
  return <section ref={rootRef} tabIndex={0} aria-labelledby={headingId} onPointerMove={setFromPointer} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); setTension((value) => Math.min(1, value + .08)); } if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); setTension((value) => Math.max(0, value - .08)); } if (event.key === "Home") { event.preventDefault(); setTension(0); } if (event.key === "End") { event.preventDefault(); setTension(1); } }} className={`relative overflow-hidden rounded-[18px] bg-[#e1e6de] p-5 text-[#1d2a22] outline-none shadow-[0_16px_48px_-30px_rgba(35,56,40,.6)] focus-visible:ring-2 focus-visible:ring-[#4568FF] sm:p-8 ${className}`}>
    <div aria-hidden className="absolute -right-8 -top-14 size-48 rounded-full bg-[#b7ca9f] blur-3xl" /><div className="relative"><span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#63745e]">{label}</span><motion.h3 id={headingId} animate={reduced ? { x: 0, letterSpacing: "-0.04em" } : { x: (tension - .5) * 12, letterSpacing: `${spacing}em` }} transition={{ type: "spring", stiffness: 250, damping: 22, mass: .45 }} style={{ fontWeight: reduced ? 600 : weight }} className="mt-8 max-w-[9ch] text-5xl leading-[.84] sm:text-7xl">{text}</motion.h3><div className="mt-8 flex items-center justify-between gap-4"><p className="max-w-xs text-[12px] leading-relaxed text-[#52604f]">{detail}</p><button type="button" onClick={() => setTension(.52)} className="min-h-11 shrink-0 rounded-full border border-[#1d2a22]/15 bg-white/45 px-4 text-[11px] outline-none transition hover:bg-white/75 focus-visible:ring-2 focus-visible:ring-[#4568FF]">Reset</button></div></div>
  </section>;
}
