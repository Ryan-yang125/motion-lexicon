"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

export type TaskProgressStatus = "queued" | "active" | "blocked" | "failed" | "recovered" | "complete";

export type TaskProgressItem = {
  id: string;
  title: string;
  detail?: string;
  status: TaskProgressStatus;
  progress?: number;
  meta?: string;
};

export type TaskProgressProps = {
  tasks: readonly TaskProgressItem[];
  label?: string;
  expandedLabel?: string;
  compactLabel?: string;
  statusLabels?: Partial<Record<TaskProgressStatus, string>>;
  className?: string;
};

const defaultStatusLabels: Record<TaskProgressStatus, string> = {
  queued: "Queued",
  active: "In progress",
  blocked: "Blocked",
  failed: "Failed",
  recovered: "Recovered",
  complete: "Complete",
};

const statusStyle: Record<TaskProgressStatus, string> = {
  queued: "border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-white/10 dark:bg-white/[.03] dark:text-neutral-400",
  active: "border-neutral-900 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950",
  blocked: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200",
  failed: "border-red-300 bg-red-50 text-red-700 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200",
  recovered: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-200",
  complete: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-200",
};

function StatusMark({ status }: { status: TaskProgressStatus }) {
  if (status === "complete") return <span aria-hidden="true">✓</span>;
  if (status === "failed") return <span aria-hidden="true">!</span>;
  if (status === "blocked") return <span aria-hidden="true">×</span>;
  if (status === "recovered") return <span aria-hidden="true">↻</span>;
  return <span aria-hidden="true">{status === "active" ? "•" : "○"}</span>;
}

export function TaskProgress({
  tasks,
  label = "Task progress",
  expandedLabel = "Expanded",
  compactLabel = "Compact",
  statusLabels,
  className = "",
}: TaskProgressProps) {
  const [layout, setLayout] = useState<"expanded" | "compact">("expanded");
  const reduced = useReducedMotion() === true;
  const labels = { ...defaultStatusLabels, ...statusLabels };
  const summary = useMemo(() => tasks.reduce<Record<TaskProgressStatus, number>>((counts, task) => {
    counts[task.status] += 1;
    return counts;
  }, { queued: 0, active: 0, blocked: 0, failed: 0, recovered: 0, complete: 0 }), [tasks]);

  return (
    <section className={`w-full rounded-[10px] border border-neutral-200 bg-white p-3 text-neutral-950 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}>
      <header className="mb-3 flex min-h-11 items-center gap-2 px-1">
        <div className="min-w-0">
          <strong className="block text-[12px]">{label}</strong>
          <span className="block text-[9px] text-neutral-500 dark:text-neutral-400">
            {summary.active ? `${summary.active} ${labels.active.toLowerCase()}` : `${summary.complete}/${tasks.length} ${labels.complete.toLowerCase()}`}
          </span>
        </div>
        <div className="ml-auto flex rounded-lg bg-neutral-100 p-0.5 dark:bg-white/5" role="group" aria-label={label}>
          <button type="button" aria-pressed={layout === "expanded"} onClick={() => setLayout("expanded")} className={`min-h-11 rounded-md px-3 text-[10px] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${layout === "expanded" ? "bg-white shadow-sm dark:bg-white/10" : "text-neutral-500"}`}>{expandedLabel}</button>
          <button type="button" aria-pressed={layout === "compact"} onClick={() => setLayout("compact")} className={`min-h-11 rounded-md px-3 text-[10px] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${layout === "compact" ? "bg-white shadow-sm dark:bg-white/10" : "text-neutral-500"}`}>{compactLabel}</button>
        </div>
      </header>

      <motion.ol layout={!reduced} className={layout === "compact" ? "flex flex-wrap gap-1.5" : "grid gap-1.5"} aria-label={label}>
        {tasks.map((task) => (
          <motion.li layout={!reduced} key={task.id} className={`relative overflow-hidden rounded-lg border ${layout === "compact" ? "min-h-11 px-2" : "min-h-14 px-3"} ${task.status === "active" ? "border-neutral-400 bg-neutral-50 dark:border-white/25 dark:bg-white/[.03]" : "border-neutral-100 dark:border-white/[.08]"}`}>
            <div className="flex min-h-10 items-center gap-2.5 py-2">
              <span className={`grid size-6 shrink-0 place-items-center rounded-md border text-[10px] ${statusStyle[task.status]}`}><StatusMark status={task.status} /></span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-[11px] font-medium">{task.title}</strong>
                {layout === "expanded" && task.detail ? <span className="block truncate text-[9px] text-neutral-500 dark:text-neutral-400">{task.detail}</span> : null}
              </span>
              {layout === "expanded" ? <span className="shrink-0 text-[9px] text-neutral-500 dark:text-neutral-400">{labels[task.status]}</span> : null}
              {task.meta ? <code className="shrink-0 text-[9px] text-neutral-400">{task.meta}</code> : null}
            </div>
            <AnimatePresence initial={false}>
              {task.status === "active" && typeof task.progress === "number" ? <motion.span key="progress" className="absolute inset-x-0 bottom-0 h-px bg-neutral-200 dark:bg-white/10" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.i className="block h-full bg-neutral-950 dark:bg-white" initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, task.progress))}%` }} transition={{ duration: reduced ? 0 : 0.32 }} /></motion.span> : null}
            </AnimatePresence>
          </motion.li>
        ))}
      </motion.ol>
      <span className="sr-only" role="status">{tasks.map((task, index) => `${index + 1}. ${task.title}: ${labels[task.status]}`).join(". ")}</span>
    </section>
  );
}
