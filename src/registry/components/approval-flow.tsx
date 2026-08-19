"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type ApprovalOption = {
  id: string;
  label: string;
  description?: string;
  recommended?: boolean;
};
export type ApprovalFlowProps = {
  question: string;
  options: readonly ApprovalOption[];
  evidence?: readonly string[];
  eyebrow?: string;
  evidenceLabel?: string;
  approveLabel?: string;
  dismissLabel?: string;
  customPlaceholder?: string;
  approvedLabel?: string;
  reviewAgainLabel?: string;
  recommendedLabel?: string;
  onApprove?: (value: string) => void;
  onDismiss?: () => void;
  className?: string;
};

export function ApprovalFlow({
  question,
  options,
  evidence = [],
  eyebrow = "Approval required",
  evidenceLabel = "Evidence",
  approveLabel = "Approve",
  dismissLabel = "Dismiss",
  customPlaceholder = "Add instructions",
  approvedLabel = "Approved",
  reviewAgainLabel = "Review again",
  recommendedLabel = "Recommended",
  onApprove,
  onDismiss,
  className = "",
}: ApprovalFlowProps) {
  const [selected, setSelected] = useState(
    options.find((option) => option.recommended)?.id ?? options[0]?.id ?? "",
  );
  const [custom, setCustom] = useState("");
  const [approved, setApproved] = useState(false);
  const reduced = useReducedMotion();
  const value = custom.trim() || selected;

  return (
    <section
      className={`w-full rounded-[10px] border border-neutral-200 bg-white p-4 text-neutral-950 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {approved ? (
          <motion.div
            key="approved"
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid min-h-[220px] place-items-center text-center"
          >
            <div>
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-emerald-500 text-lg text-white">
                ✓
              </span>
              <strong className="mt-4 block text-[14px]">
                {approvedLabel}
              </strong>
              <button
                type="button"
                onClick={() => setApproved(false)}
                className="mt-3 min-h-11 rounded-full px-3 text-[11px] text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5"
              >
                {reviewAgainLabel}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
          >
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
              {eyebrow}
            </span>
            <h3 className="mt-2 text-[16px] font-semibold tracking-[-.025em]">
              {question}
            </h3>
            {evidence.length ? (
              <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-2.5 dark:border-white/10 dark:bg-white/[.03]">
                <span className="text-[9px] font-medium uppercase tracking-[.12em] text-neutral-500">{evidenceLabel}</span>
                <ul className="mt-1.5 grid gap-1" aria-label={evidenceLabel}>
                  {evidence.map((item) => <li className="text-[10px] text-neutral-600 dark:text-neutral-300" key={item}>• {item}</li>)}
                </ul>
              </div>
            ) : null}
            <div className="mt-4 grid gap-2" role="radiogroup">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected === option.id}
                  onClick={() => {
                    setSelected(option.id);
                    setCustom("");
                  }}
                  className={`relative min-h-12 rounded-lg border px-3 py-2 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-600 ${selected === option.id ? "border-neutral-950 bg-neutral-50 dark:border-neutral-50 dark:bg-white/5" : "border-neutral-200 hover:bg-neutral-50 dark:border-white/10 dark:hover:bg-white/5"}`}
                >
                  <span className="flex items-center gap-2 text-[12px] font-medium">
                    <i
                      className={`size-2 rounded-full ${selected === option.id ? "bg-neutral-950 dark:bg-neutral-50" : "bg-neutral-200 dark:bg-white/15"}`}
                    />
                    {option.label}
                    {option.recommended ? (
                      <small className="ml-auto rounded-md bg-neutral-100 px-2 py-0.5 text-[9px] text-neutral-600 dark:bg-white/8 dark:text-neutral-300">
                        {recommendedLabel}
                      </small>
                    ) : null}
                  </span>
                  {option.description ? (
                    <span className="mt-1 block pl-4 text-[10px] text-neutral-500 dark:text-neutral-400">
                      {option.description}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            <input
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              placeholder={customPlaceholder}
              className="mt-3 min-h-11 w-full rounded-lg border border-neutral-200 bg-transparent px-3 text-[12px] outline-none placeholder:text-neutral-500 focus:border-neutral-950 focus:ring-2 focus:ring-blue-600/20 dark:border-white/10 dark:focus:border-neutral-50"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onDismiss}
                className="min-h-11 rounded-lg px-4 text-[11px] text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5"
              >
                {dismissLabel}
              </button>
              <button
                type="button"
                disabled={!value}
                onClick={() => {
                  setApproved(true);
                  onApprove?.(value);
                }}
                className="min-h-11 rounded-lg bg-neutral-950 px-4 text-[11px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-40 dark:bg-neutral-50 dark:text-neutral-950"
              >
                {approveLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
