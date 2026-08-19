"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type DynamicToolbarAction = { id: string; label: string; icon?: string; disabled?: boolean };
export type DynamicToolbarProps = { actions: readonly DynamicToolbarAction[]; label?: string; onAction?: (action: DynamicToolbarAction) => void; className?: string };

export function DynamicToolbar({ actions, label = "Editing tools", onAction, className = "" }: DynamicToolbarProps) {
  const reduced = useReducedMotion() === true; const id = useId(); const [expanded, setExpanded] = useState(false);
  return <section aria-labelledby={id} className={`flex min-h-[160px] items-center justify-center rounded-[18px] bg-[#eaebe8] p-4 ${className}`}><motion.div layout transition={{ duration: reduced ? 0 : .25 }} className={`flex items-center rounded-full border border-black/[.11] bg-white p-1.5 shadow-[0_15px_32px_-23px_rgba(32,35,32,.42)] ${expanded ? "gap-1" : "gap-0"}`}><span id={id} className="sr-only">{label}</span><button type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)} className="grid min-h-11 min-w-11 place-items-center rounded-full bg-[#252827] text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF]">✦</button><AnimatePresence initial={false}>{expanded ? <motion.div initial={reduced ? false : { opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={reduced ? undefined : { opacity: 0, width: 0 }} transition={{ duration: reduced ? 0 : .2 }} className="flex overflow-hidden">{actions.map((action) => <button key={action.id} type="button" disabled={action.disabled} onClick={() => onAction?.(action)} className="min-h-11 min-w-11 rounded-full px-2 text-[11px] text-neutral-600 outline-none transition hover:bg-neutral-100 disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-[#4568FF]" aria-label={action.label}>{action.icon ?? action.label.slice(0, 1)}</button>)}</motion.div> : null}</AnimatePresence></motion.div></section>;
}
