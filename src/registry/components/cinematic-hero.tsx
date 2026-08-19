"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export type CinematicHeroProps = { eyebrow?: string; title: string; description?: string; actionLabel?: string; onAction?: () => void; art: ReactNode; className?: string };

export function CinematicHero({ eyebrow = "New release", title, description, actionLabel = "Explore story", onAction, art, className = "" }: CinematicHeroProps) {
  const reduced = useReducedMotion() === true;
  return <section className={`relative isolate min-h-[340px] overflow-hidden rounded-[22px] border border-[#4b3425]/15 bg-[#281c17] p-5 text-[#fff1dd] shadow-[0_28px_70px_-42px_rgba(48,25,8,.9)] sm:min-h-[390px] sm:p-7 ${className}`}><motion.div initial={reduced ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={reduced ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }} aria-hidden className="absolute inset-0">{art}</motion.div><div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(30,19,14,.9)_0%,rgba(30,19,14,.58)_45%,rgba(30,19,14,.06)_100%)]" /><div className="relative z-10 flex min-h-[300px] max-w-[28rem] flex-col justify-between"><span className="font-mono text-[9px] tracking-[.18em] text-[#ffd5a6]/75">{eyebrow}</span><div><h2 className="max-w-[10ch] font-serif text-[42px] leading-[.84] tracking-[-.075em] sm:text-[56px]">{title}</h2>{description ? <p className="mt-5 max-w-[36ch] text-[12px] leading-relaxed text-[#ffe8c9]/76">{description}</p> : null}<button type="button" onClick={onAction} className="mt-6 min-h-11 rounded-full bg-[#f6d7a7] px-4 text-[11px] font-semibold text-[#302016] outline-none focus-visible:ring-2 focus-visible:ring-[#8eb9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#281c17]">{actionLabel} <span aria-hidden>→</span></button></div></div></section>;
}
