"use client";

import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

export type ChromaticImageProps = { art: ReactNode; alt: string; label?: string; caption?: string; className?: string };

export function ChromaticImage({ art, alt, label = "Chromatic image", caption, className = "" }: ChromaticImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion() === true;
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    root.style.setProperty("--chromatic-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`);
    root.style.setProperty("--chromatic-y", `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`);
  };
  return <figure className={`w-full overflow-hidden rounded-[20px] border border-[#e5c6ed]/20 bg-[#17101f] p-3 shadow-[0_24px_54px_-36px_rgba(0,0,0,.9)] ${className}`}><div className="mb-2 flex items-center justify-between gap-3 px-1"><span className="font-mono text-[9px] tracking-[.15em] text-[#edc7ff]/62">CHROMATIC STUDY</span><span className="font-mono text-[8px] tracking-[.12em] text-[#edc7ff]/50">POINTER / FOCUS</span></div><div ref={rootRef} role="img" aria-label={alt} tabIndex={0} onFocus={() => setActive(true)} onBlur={() => setActive(false)} onPointerEnter={() => setActive(true)} onPointerLeave={() => setActive(false)} onPointerMove={move} className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#25163a] outline-none focus-visible:ring-2 focus-visible:ring-[#e9b3ff]" style={{ "--chromatic-x": "0px", "--chromatic-y": "0px" } as CSSProperties}>
    <div aria-hidden className="absolute inset-0">{art}</div>
    {!reduced ? <><div aria-hidden className={`pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-200 ${active ? "opacity-85" : "opacity-0"}`} style={{ transform: "translate3d(var(--chromatic-x), var(--chromatic-y), 0)", filter: "sepia(1) saturate(6) hue-rotate(298deg)" }}>{art}</div><div aria-hidden className={`pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-200 ${active ? "opacity-75" : "opacity-0"}`} style={{ transform: "translate3d(calc(var(--chromatic-x) * -1), calc(var(--chromatic-y) * -1), 0)", filter: "sepia(1) saturate(6) hue-rotate(145deg)" }}>{art}</div></> : null}
    <span aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,113,182,.12),transparent_45%,rgba(88,229,255,.14))]" /><span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[8px] tracking-[.14em] text-white">{label}</span>
  </div>{caption ? <figcaption className="mt-3 px-1 text-[11px] leading-relaxed text-[#ead6f0]/70">{caption}</figcaption> : null}</figure>;
}
