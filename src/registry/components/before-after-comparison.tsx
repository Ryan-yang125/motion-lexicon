"use client";

import { useId, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

export type BeforeAfterComparisonProps = { before: ReactNode; after: ReactNode; beforeLabel?: string; afterLabel?: string; alt: string; label?: string; defaultPosition?: number; onPositionChange?: (position: number) => void; className?: string };

export function BeforeAfterComparison({ before, after, beforeLabel = "Before", afterLabel = "After", alt, label = "Before and after comparison", defaultPosition = 50, onPositionChange, className = "" }: BeforeAfterComparisonProps) {
  const [position, setPosition] = useState(() => Math.max(0, Math.min(defaultPosition, 100)));
  const rangeId = useId();
  const reduced = useReducedMotion() === true;
  const update = (next: number) => { const value = Math.max(0, Math.min(next, 100)); setPosition(value); onPositionChange?.(value); };
  return <figure className={`w-full overflow-hidden rounded-[20px] border border-[#3a3024]/15 bg-[#eee1cb] p-3 shadow-[0_24px_54px_-38px_rgba(48,31,13,.8)] ${className}`}><div className="mb-2 flex items-center justify-between gap-3 px-1"><span className="font-mono text-[9px] tracking-[.15em] text-[#7b6650]">MATERIAL COMPARISON</span><span className="font-mono text-[8px] tracking-[.12em] text-[#7b6650]">DRAG / ARROWS</span></div><div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#253f45]" role="img" aria-label={alt} onPointerDown={(event) => { const root = event.currentTarget; root.setPointerCapture(event.pointerId); const rect = root.getBoundingClientRect(); update(((event.clientX - rect.left) / rect.width) * 100); }} onPointerMove={(event) => { if (!event.currentTarget.hasPointerCapture(event.pointerId)) return; const rect = event.currentTarget.getBoundingClientRect(); update(((event.clientX - rect.left) / rect.width) * 100); }}>
    <div aria-hidden className="absolute inset-0">{after}</div><div aria-hidden className={`absolute inset-y-0 left-0 overflow-hidden ${reduced ? "" : "transition-[width] duration-150"}`} style={{ width: `${position}%` }}><div className="absolute inset-y-0 left-0" style={{ width: `${10000 / Math.max(position, 1)}%` }}>{before}</div></div><span aria-hidden className="absolute inset-y-0 z-10 w-px bg-[#fff2dc] shadow-[0_0_0_1px_rgba(0,0,0,.14)]" style={{ left: `${position}%` }} /><span aria-hidden className="absolute z-20 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-[#fff2dc]/80 bg-[#202822] text-[#fff2dc] shadow-lg" style={{ left: `${position}%`, top: "calc(50% - 18px)" }}>↔</span><span className="absolute left-3 top-3 rounded-full bg-[#1f251d]/75 px-2.5 py-1 font-mono text-[8px] tracking-[.13em] text-[#fff2dc]">{beforeLabel}</span><span className="absolute right-3 top-3 rounded-full bg-[#fff2dc]/86 px-2.5 py-1 font-mono text-[8px] tracking-[.13em] text-[#282117]">{afterLabel}</span>
  </div><label className="sr-only" htmlFor={rangeId}>{label}</label><input id={rangeId} aria-label={label} type="range" min="0" max="100" value={position} onChange={(event) => update(Number(event.target.value))} className="mt-3 h-11 w-full accent-[#bb6042]" /></figure>;
}
