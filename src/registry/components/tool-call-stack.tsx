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
      className={`w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-[0_18px_50px_-36px_rgba(24,24,27,.5)] dark:border-white/10 dark:bg-[#17191d] dark:text-zinc-50 ${className}`}
    >
      <header className="flex min-h-12 items-center gap-3 border-b border-zinc-100 px-4 dark:border-white/8">
        <span className="font-mono text-[9px] uppercase tracking-[.14em] text-zinc-400">
          {label}
        </span>
        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-1 text-[9px] text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
          {complete}/{calls.length}
        </span>
      </header>
      <div className="p-2">
        {calls.map((call) => {
          const expanded = open.includes(call.id);
          return (
            <div
              key={call.id}
              className="overflow-hidden rounded-xl border border-transparent hover:border-zinc-100 dark:hover:border-white/8"
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
                className="flex min-h-12 w-full items-center gap-3 px-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4568ff]"
              >
                <span
                  className={`relative grid size-8 shrink-0 place-items-center rounded-xl font-mono text-[9px] ${call.status === "complete" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : call.status === "failed" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300" : "bg-blue-50 text-[#4568ff] dark:bg-[#4568ff]/10 dark:text-[#93b0ff]"}`}
                >
                  {marks[call.kind ?? "command"]}
                  {call.status === "running" ? (
                    <motion.i
                      className="absolute inset-0 rounded-xl border border-[#4568ff]/50"
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
                  <span className="block truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                    {call.summary}
                  </span>
                </span>
                {call.duration ? (
                  <code className="text-[9px] tabular-nums text-zinc-400">
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
                    className="mx-3 mb-3 overflow-auto rounded-lg bg-zinc-950 p-3 text-[9px] leading-5 text-zinc-300"
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
