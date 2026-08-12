"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type ThinkingTraceStep = {
  id: string;
  label: string;
  detail?: string;
  status: "complete" | "active" | "queued";
};

export type AgentThinkingTraceProps = {
  steps: readonly ThinkingTraceStep[];
  duration?: string;
  label?: string;
  defaultExpanded?: boolean;
  className?: string;
};

const ease = [0.23, 1, 0.32, 1] as const;

export function AgentThinkingTrace({
  steps,
  duration = "4.2s",
  label = "Thinking",
  defaultExpanded = true,
  className = "",
}: AgentThinkingTraceProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const reduced = useReducedMotion();
  const active = steps.find((step) => step.status === "active") ?? steps.at(-1);

  return (
    <section
      className={`w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-[0_18px_50px_-34px_rgba(24,24,27,.45)] dark:border-white/10 dark:bg-[#17191d] dark:text-zinc-50 ${className}`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
        className="flex min-h-14 w-full items-center gap-3 px-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4568ff]"
      >
        <span
          className="relative grid size-8 shrink-0 place-items-center rounded-xl bg-zinc-950 dark:bg-zinc-50"
          aria-hidden="true"
        >
          {[0, 1, 2].map((index) => (
            <motion.i
              key={index}
              className="absolute size-1 rounded-full bg-white dark:bg-zinc-950"
              animate={
                reduced
                  ? undefined
                  : { x: [-5, 0, 5], opacity: [0.25, 1, 0.25] }
              }
              transition={{
                duration: 1.2,
                delay: index * 0.14,
                repeat: Infinity,
                ease,
              }}
            />
          ))}
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block text-[13px] font-semibold">{label}</strong>
          <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
            {active?.label}
          </span>
        </span>
        <code className="rounded-md bg-zinc-100 px-2 py-1 text-[10px] tabular-nums text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
          {duration}
        </code>
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-4 fill-none stroke-current text-zinc-400"
          strokeWidth="1.5"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.28, ease }}
        >
          <path d="m4 6 4 4 4-4" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? { display: "none" } : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.32, ease }}
            className="overflow-hidden"
          >
            <ol className="border-t border-zinc-100 px-4 py-3 dark:border-white/8">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className="relative grid grid-cols-[20px_1fr] gap-3 pb-3 last:pb-0"
                >
                  {index < steps.length - 1 ? (
                    <span
                      className="absolute left-[9px] top-4 h-[calc(100%-4px)] w-px bg-zinc-200 dark:bg-white/10"
                      aria-hidden="true"
                    />
                  ) : null}
                  <motion.span
                    aria-hidden="true"
                    className={`relative z-10 mt-1 grid size-5 place-items-center rounded-full border ${step.status === "complete" ? "border-emerald-500 bg-emerald-500 text-white" : step.status === "active" ? "border-[#4568ff] bg-white text-[#4568ff] dark:bg-[#17191d]" : "border-zinc-200 bg-white text-zinc-300 dark:border-white/15 dark:bg-[#17191d]"}`}
                    animate={
                      step.status === "active" && !reduced
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(69,104,255,.25)",
                              "0 0 0 5px rgba(69,104,255,0)",
                            ],
                          }
                        : undefined
                    }
                    transition={{ duration: 1.4, repeat: Infinity }}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                  </motion.span>
                  <div>
                    <strong className="block text-[12px] font-medium">
                      {step.label}
                    </strong>
                    {step.detail ? (
                      <p className="mt-0.5 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                        {step.detail}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
