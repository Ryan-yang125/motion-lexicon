"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type RecommendationAlternative = {
  id: string;
  title: string;
  signal?: string;
};
export type AgentRecommendationProps = {
  title: string;
  description: string;
  confidence: number;
  alternatives?: readonly RecommendationAlternative[];
  eyebrow?: string;
  confidenceLabel?: string;
  acceptLabel?: string;
  acceptedLabel?: string;
  alternativesLabel?: string;
  onAccept?: () => void;
  className?: string;
};

export function AgentRecommendation({
  title,
  description,
  confidence,
  alternatives = [],
  eyebrow = "Agent recommendation",
  confidenceLabel = "Confidence",
  acceptLabel = "Accept",
  acceptedLabel = "Accepted ✓",
  alternativesLabel = "Alternatives",
  onAccept,
  className = "",
}: AgentRecommendationProps) {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const reduced = useReducedMotion();
  return (
    <section
      className={`w-full rounded-[10px] border border-neutral-200 bg-white p-4 text-neutral-950 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
          <span className="text-[13px]">↗</span>
          <motion.i
            aria-hidden="true"
            className="absolute inset-0 rounded-lg border border-neutral-950 dark:border-neutral-50"
            animate={
              reduced ? undefined : { scale: [1, 1.35], opacity: [0.35, 0] }
            }
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </span>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            {eyebrow}
          </span>
          <h3 className="mt-1 text-[15px] font-semibold tracking-[-.02em]">
            {title}
          </h3>
          <p className="mt-1 text-[11px] leading-5 text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-[9px] text-neutral-400">{confidenceLabel}</span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-white/8">
          <motion.i
            className="block h-full rounded-full bg-neutral-950 dark:bg-neutral-50"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, confidence))}%` }}
            transition={{ duration: reduced ? 0 : 0.7 }}
          />
        </span>
        <code className="text-[9px] text-neutral-500 dark:text-neutral-400">
          {confidence}%
        </code>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="min-h-11 rounded-lg px-3 text-[10px] text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5"
        >
          {alternativesLabel}
          {alternatives.length ? ` · ${alternatives.length}` : ""}
        </button>
        <motion.button
          type="button"
          onClick={() => {
            setAccepted(true);
            onAccept?.();
          }}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          className={`ml-auto min-h-11 rounded-lg px-4 text-[10px] font-semibold text-white ${accepted ? "bg-emerald-600" : "bg-neutral-950 dark:bg-neutral-50 dark:text-neutral-950"}`}
        >
          {accepted ? acceptedLabel : acceptLabel}
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {open && alternatives.length ? (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 grid overflow-hidden border-t border-neutral-100 pt-3 dark:border-white/8"
          >
            {alternatives.map((alternative) => (
              <button
                key={alternative.id}
                type="button"
                className="flex min-h-11 items-center rounded-lg px-2 text-left hover:bg-neutral-50 dark:hover:bg-white/5"
              >
                <span className="text-[10px]">{alternative.title}</span>
                {alternative.signal ? (
                  <small className="ml-auto text-[9px] text-neutral-400">
                    {alternative.signal}
                  </small>
                ) : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
