"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type AgentTask = {
  id: string;
  title: string;
  detail?: string;
  status: "queued" | "running" | "complete" | "failed";
  progress?: number;
  meta?: string;
};
export type AgentTaskQueueProps = {
  tasks: readonly AgentTask[];
  label?: string;
  runningLabel?: (count: number) => string;
  clearLabel?: string;
  rowsLabel?: string;
  compactLabel?: string;
  className?: string;
};

export function AgentTaskQueue({
  tasks,
  label = "Agent tasks",
  runningLabel = (count) => `${count} running`,
  clearLabel = "Queue clear",
  rowsLabel = "Rows",
  compactLabel = "Compact",
  className = "",
}: AgentTaskQueueProps) {
  const [layout, setLayout] = useState<"rows" | "compact">("rows");
  const reduced = useReducedMotion();
  const active = tasks.filter((task) => task.status === "running").length;

  return (
    <section
      className={`w-full rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-950 shadow-[0_18px_50px_-36px_rgba(24,24,27,.5)] dark:border-white/10 dark:bg-[#17191d] dark:text-zinc-50 ${className}`}
    >
      <header className="mb-2 flex min-h-10 items-center gap-2 px-1">
        <div>
          <strong className="block text-[12px]">{label}</strong>
          <span className="text-[9px] text-zinc-400">
            {active ? runningLabel(active) : clearLabel}
          </span>
        </div>
        <div className="ml-auto flex rounded-lg bg-zinc-100 p-0.5 dark:bg-white/5">
          <button
            type="button"
            aria-label={rowsLabel}
            aria-pressed={layout === "rows"}
            onClick={() => setLayout("rows")}
            className={`min-h-11 min-w-11 rounded-md px-2 text-[10px] ${layout === "rows" ? "bg-white shadow-sm dark:bg-white/10" : "text-zinc-400"}`}
          >
            {rowsLabel}
          </button>
          <button
            type="button"
            aria-label={compactLabel}
            aria-pressed={layout === "compact"}
            onClick={() => setLayout("compact")}
            className={`min-h-11 min-w-11 rounded-md px-2 text-[10px] ${layout === "compact" ? "bg-white shadow-sm dark:bg-white/10" : "text-zinc-400"}`}
          >
            {compactLabel}
          </button>
        </div>
      </header>
      <motion.ol
        layout={!reduced}
        className={
          layout === "compact" ? "flex flex-wrap gap-2" : "grid gap-1.5"
        }
      >
        {tasks.map((task, index) => (
          <motion.li
            layout={!reduced}
            key={task.id}
            className={`relative overflow-hidden border ${layout === "compact" ? "min-h-10 rounded-full px-3" : "min-h-14 rounded-xl px-3"} ${task.status === "running" ? "border-[#4568ff]/35 bg-[#4568ff]/[.035]" : "border-zinc-100 dark:border-white/8"}`}
          >
            <div className="flex h-full min-h-10 items-center gap-3 py-2">
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[9px] ${task.status === "complete" ? "bg-emerald-500 text-white" : task.status === "failed" ? "bg-red-500 text-white" : task.status === "running" ? "bg-[#4568ff] text-white" : "bg-zinc-100 text-zinc-400 dark:bg-white/5"}`}
              >
                {task.status === "complete"
                  ? "✓"
                  : task.status === "failed"
                    ? "!"
                    : index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-[11px] font-medium">
                  {task.title}
                </strong>
                {layout === "rows" && task.detail ? (
                  <span className="block truncate text-[9px] text-zinc-400">
                    {task.detail}
                  </span>
                ) : null}
              </span>
              {task.meta ? (
                <code className="text-[9px] text-zinc-400">{task.meta}</code>
              ) : null}
            </div>
            <AnimatePresence>
              {task.status === "running" &&
              typeof task.progress === "number" ? (
                <motion.span
                  aria-label={`${task.progress}%`}
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-zinc-100 dark:bg-white/5"
                >
                  <motion.i
                    className="block h-full bg-[#4568ff]"
                    initial={{ width: 0 }}
                    animate={{ width: `${task.progress}%` }}
                    transition={{ duration: reduced ? 0 : 0.5 }}
                  />
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
