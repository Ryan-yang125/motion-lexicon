"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type ToolCall = {
  id: string;
  name: string;
  summary: string;
  detail?: string;
  status: "running" | "complete" | "failed";
  duration?: string;
  kind?: "search" | "code" | "file" | "command";
};
export type ToolCallStackProps = {
  calls: readonly ToolCall[];
  label?: string;
  className?: string;
};

const marks = { search: "⌕", code: "<>", file: "□", command: ">_" } as const;

export function ToolCallStack({
  calls,
  label = "Tool calls",
  className = "",
}: ToolCallStackProps) {
  const [open, setOpen] = useState<string[]>(() =>
    calls.filter((call) => call.status === "running").map((call) => call.id),
  );
  const reduced = useReducedMotion();
  const complete = calls.filter((call) => call.status === "complete").length;

  return (
    <section
      className={`w-full overflow-hidden rounded-[10px] border border-neutral-200 bg-white text-neutral-950 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}
    >
      <header className="flex min-h-12 items-center gap-3 border-b border-neutral-100 px-4 dark:border-white/8">
        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
          {label}
        </span>
        <span className="ml-auto rounded-full bg-neutral-100 px-2 py-1 text-[9px] text-neutral-500 dark:bg-white/5 dark:text-neutral-400">
          {complete}/{calls.length}
        </span>
      </header>
      <div className="p-2">
        {calls.map((call) => {
          const expanded = open.includes(call.id);
          return (
            <div
              key={call.id}
              className="overflow-hidden rounded-lg border border-transparent hover:border-neutral-100 dark:hover:border-white/8"
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() =>
                  setOpen((current) =>
                    current.includes(call.id)
                      ? current.filter((id) => id !== call.id)
                      : [...current, call.id],
                  )
                }
                className="flex min-h-12 w-full items-center gap-3 px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600"
              >
                <span
                  className={`relative grid size-8 shrink-0 place-items-center rounded-lg border font-mono text-[9px] ${call.status === "complete" ? "border-emerald-200 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300" : call.status === "failed" ? "border-red-200 text-red-600 dark:border-red-500/30 dark:text-red-300" : "border-neutral-300 text-neutral-800 dark:border-white/20 dark:text-neutral-200"}`}
                >
                  {marks[call.kind ?? "command"]}
                  {call.status === "running" ? (
                    <motion.i
                      className="absolute inset-0 rounded-lg border border-neutral-500/50"
                      animate={
                        reduced ? undefined : { opacity: [0.25, 1, 0.25] }
                      }
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-[12px] font-medium">
                    {call.name}
                  </strong>
                  <span className="block truncate text-[10px] text-neutral-500 dark:text-neutral-400">
                    {call.summary}
                  </span>
                </span>
                {call.duration ? (
                  <code className="text-[9px] tabular-nums text-neutral-400">
                    {call.duration}
                  </code>
                ) : null}
              </button>
              <AnimatePresence initial={false}>
                {expanded && call.detail ? (
                  <motion.pre
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mx-3 mb-3 overflow-auto rounded-lg bg-neutral-950 p-3 text-[9px] leading-5 text-neutral-300"
                  >
                    <code>{call.detail}</code>
                  </motion.pre>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
