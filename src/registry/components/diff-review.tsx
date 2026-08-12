"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type DiffChange = {
  id: string;
  field: string;
  before: string;
  after: string;
};
export type DiffReviewProps = {
  changes: readonly DiffChange[];
  title?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  editsLabel?: (count: number) => string;
  acceptAllLabel?: string;
  fieldLabel?: string;
  beforeLabel?: string;
  afterLabel?: string;
  decisionLabel?: string;
  acceptedLabel?: string;
  rejectedLabel?: string;
  reviewedLabel?: (decided: number, total: number) => string;
  className?: string;
};

export function DiffReview({
  changes,
  title = "Proposed changes",
  acceptLabel = "Accept",
  rejectLabel = "Reject",
  editsLabel = (count) => `${count} edits`,
  acceptAllLabel = "Accept all",
  fieldLabel = "Field",
  beforeLabel = "Before",
  afterLabel = "After",
  decisionLabel = "Decision",
  acceptedLabel = "Accepted",
  rejectedLabel = "Rejected",
  reviewedLabel = (decided, total) => `${decided}/${total} reviewed`,
  className = "",
}: DiffReviewProps) {
  const [decisions, setDecisions] = useState<
    Record<string, "accepted" | "rejected">
  >({});
  const reduced = useReducedMotion();
  const decided = Object.keys(decisions).length;
  return (
    <section
      className={`w-full overflow-hidden rounded-[10px] border border-neutral-200 bg-white text-neutral-950 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}
    >
      <header className="flex min-h-12 items-center gap-3 border-b border-neutral-100 px-4 dark:border-white/8">
        <strong className="text-[12px]">{title}</strong>
        <span className="text-[9px] text-neutral-400">
          {editsLabel(changes.length)}
        </span>
        <button
          type="button"
          onClick={() =>
            setDecisions(
              Object.fromEntries(
                changes.map((change) => [change.id, "accepted"]),
              ),
            )
          }
          className="ml-auto min-h-11 rounded-lg bg-neutral-950 px-3 text-[9px] font-semibold text-white dark:bg-neutral-50 dark:text-neutral-950"
        >
          {acceptAllLabel}
        </button>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[460px] border-collapse text-left">
          <thead>
            <tr className="text-[9px] uppercase tracking-[.12em] text-neutral-400">
              <th className="px-4 py-3 font-medium">{fieldLabel}</th>
              <th className="px-3 py-3 font-medium">{beforeLabel}</th>
              <th className="px-3 py-3 font-medium">{afterLabel}</th>
              <th className="px-3 py-3">
                <span className="sr-only">{decisionLabel}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <motion.tr
                layout={!reduced}
                key={change.id}
                className="border-t border-neutral-100 text-[10px] dark:border-white/8"
              >
                <th className="px-4 py-3 font-medium">{change.field}</th>
                <td className="px-3 py-3">
                  <span className="rounded-md bg-red-50 px-2 py-1 text-red-600 line-through decoration-red-300 dark:bg-red-500/10 dark:text-red-300">
                    {change.before}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {change.after}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <AnimatePresence mode="wait">
                    {decisions[change.id] ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-[9px] ${decisions[change.id] === "accepted" ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {decisions[change.id] === "accepted"
                          ? acceptedLabel
                          : rejectedLabel}
                      </motion.span>
                    ) : (
                      <motion.div key="actions" className="flex gap-1">
                        <button
                          type="button"
                          aria-label={`${acceptLabel} ${change.field}`}
                          onClick={() =>
                            setDecisions((current) => ({
                              ...current,
                              [change.id]: "accepted",
                            }))
                          }
                          className="grid size-11 place-items-center rounded-lg hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          aria-label={`${rejectLabel} ${change.field}`}
                          onClick={() =>
                            setDecisions((current) => ({
                              ...current,
                              [change.id]: "rejected",
                            }))
                          }
                          className="grid size-11 place-items-center rounded-lg hover:bg-red-50 hover:text-red-600"
                        >
                          ×
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="border-t border-neutral-100 px-4 py-2 text-[9px] text-neutral-400 dark:border-white/8">
        {reviewedLabel(decided, changes.length)}
      </footer>
    </section>
  );
}
