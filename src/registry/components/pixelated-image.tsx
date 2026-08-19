"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export type PixelatedImageProps = {
  art: ReactNode;
  label?: string;
  alt: string;
  caption?: string;
  defaultRevealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
  className?: string;
};

export function PixelatedImage({ art, alt, label = "Pixelated image", caption, defaultRevealed = true, onRevealChange, className = "" }: PixelatedImageProps) {
  const [revealed, setRevealed] = useState(defaultRevealed);
  const reduced = useReducedMotion() === true;
  const toggle = () => { const next = !revealed; setRevealed(next); onRevealChange?.(next); };
  return (
    <figure className={`w-full overflow-hidden rounded-[20px] border border-[#b9d1d5]/20 bg-[#0c171b] p-3 shadow-[0_24px_54px_-36px_rgba(0,0,0,.9)] ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-3 px-1"><span className="font-mono text-[9px] tracking-[.15em] text-[#bce8e7]/60">RESOLUTION STUDY</span><button type="button" aria-pressed={revealed} onClick={toggle} className="min-h-11 rounded-full border border-white/15 bg-white/[0.06] px-3 text-[10px] font-medium text-[#e9fff6] outline-none focus-visible:ring-2 focus-visible:ring-[#8bd9e2]">{revealed ? "View grid" : "Develop image"}</button></div>
      <button type="button" aria-label={`${label}: ${alt}`} aria-pressed={revealed} onClick={toggle} className="relative block aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-[#17333d] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#8bd9e2]">
        <motion.span initial={false} animate={{ opacity: revealed ? 1 : 0.38, scale: revealed ? 1 : 1.045, filter: revealed ? "blur(0px)" : "blur(4px)" }} transition={reduced ? { duration: 0 } : { duration: 0.38, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 block">{art}</motion.span>
        <motion.span aria-hidden initial={false} animate={{ opacity: revealed ? 0.14 : 0.92, backgroundSize: revealed ? "9px 9px" : "28px 28px" }} transition={reduced ? { duration: 0 } : { duration: 0.36 }} className="absolute inset-0 bg-[linear-gradient(90deg,rgba(239,255,248,.9)_1px,transparent_1px),linear-gradient(rgba(239,255,248,.9)_1px,transparent_1px)] mix-blend-screen" />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,177,103,.18),transparent_42%,rgba(92,219,214,.14))]" />
        <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[8px] tracking-[.14em] text-[#effff7]">{revealed ? "FULL FRAME" : "24 × 15 GRID"}</span>
      </button>
      {caption ? <figcaption className="mt-3 px-1 text-[11px] leading-relaxed text-[#c7dfdd]/70">{caption}</figcaption> : null}
    </figure>
  );
}
