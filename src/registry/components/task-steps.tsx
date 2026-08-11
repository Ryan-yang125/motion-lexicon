"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const POP = { type: "spring", stiffness: 640, damping: 22, mass: 0.7 } as const;
const CELL = { type: "spring", stiffness: 520, damping: 34, mass: 0.45 } as const;
const STILL = { duration: 0 } as const;

export type TaskStep = {
  id: string;
  label: string;

  meta?: string;
};

export type TaskStepStatus = "pending" | "active" | "done" | "error";

export type TaskStepsCopy = {
  failedAt: (label: string) => string;
  complete: (count: number) => string;
  progress: (label: string, position: number, total: number) => string;
  runComplete: string;
  runFailed: string;
};

const DEFAULT_COPY: TaskStepsCopy = {
  failedAt: (label) => `Failed at ${label}`,
  complete: (count) => `All ${count} steps complete`,
  progress: (label, position, total) => `${label}, step ${position} of ${total}`,
  runComplete: "Run complete",
  runFailed: "Run failed",
};

export type UseTaskStepsOptions = {
  steps: TaskStep[];

  current: number;

  failed?: boolean;
  copy?: Partial<TaskStepsCopy>;
};

export function useTaskSteps({ steps, current, failed = false, copy: copyOverrides }: UseTaskStepsOptions) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides };
  const complete = !failed && current >= steps.length;

  const rows = steps.map((step, i) => ({
    ...step,
    status: (i < current
      ? "done"
      : i === current && failed
        ? "error"
        : i === current && !complete
          ? "active"
          : "pending") as TaskStepStatus,
  }));

  const active = rows.find((r) => r.status === "active");
  const sentence = failed
    ? copy.failedAt(steps[Math.min(current, steps.length - 1)]?.label ?? "step")
    : complete
      ? copy.complete(steps.length)
      : active
        ? copy.progress(active.label, current + 1, steps.length)
        : "";

  return { rows, complete, failed, sentence };
}

const Tick = (
  <svg viewBox="0 0 256 256" width="11" height="11" fill="none" aria-hidden>
    <polyline
      points="216 72 104 184 48 128"
      stroke="currentColor"
      strokeWidth="26"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Cross = (
  <svg viewBox="0 0 256 256" width="10" height="10" fill="none" aria-hidden>
    <path
      d="M200 56 56 200 M56 56l144 144"
      stroke="currentColor"
      strokeWidth="26"
      strokeLinecap="round"
    />
  </svg>
);

const Arc = ({ spin }: { spin: boolean }) => (
  <motion.svg
    viewBox="0 0 16 16"
    className="size-3"
    aria-hidden
    animate={spin ? { rotate: 360 } : { rotate: 0 }}
    transition={spin ? { duration: 0.8, ease: "linear", repeat: Infinity } : STILL}
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="2"
    />
    <path
      d="M8 2 a6 6 0 0 1 6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

export type TaskStepsProps = UseTaskStepsOptions & {
  label?: string;
  className?: string;
};

export function TaskSteps({
  steps,
  current,
  failed = false,
  label = "Task progress",
  copy: copyOverrides,
  className = "",
}: TaskStepsProps) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides };
  const { rows, complete, sentence } = useTaskSteps({ steps, current, failed, copy });
  const reduced = useReducedMotion() === true;

  const [spoken, setSpoken] = useState("");
  useEffect(() => {
    if (!sentence) return;
    const t = setTimeout(() => setSpoken(sentence), 500);
    return () => clearTimeout(t);
  }, [sentence]);

  return (
    <div className={`w-full ${className}`}>
      <ol aria-label={label} className="space-y-0.5">
        {rows.map((row) => {
          const tone =
            row.status === "done"
              ? "text-stone-600 dark:text-stone-300"
              : row.status === "active"
                ? "font-medium text-stone-800 dark:text-stone-100"
                : row.status === "error"
                  ? "font-medium text-red-600 dark:text-red-400"
                  : "text-stone-400 dark:text-stone-500";

          return (
            <li
              key={row.id}
              aria-current={row.status === "active" ? "step" : undefined}
              className="flex h-7 items-center gap-2.5 px-1"
            >
              <span className="relative grid size-4 shrink-0 place-items-center">
                <AnimatePresence initial={false}>
                  {row.status === "done" ? (
                    <motion.span
                      key="done"
                      className="col-start-1 row-start-1 grid size-4 place-items-center rounded-[5px] bg-emerald-500/[0.14] text-emerald-600 dark:bg-emerald-400/[0.16] dark:text-emerald-400"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, transition: STILL }}
                      transition={reduced ? STILL : POP}
                    >
                      {Tick}
                    </motion.span>
                  ) : row.status === "error" ? (
                    <motion.span
                      key="error"
                      className="col-start-1 row-start-1 grid size-4 place-items-center rounded-[5px] bg-red-500/[0.12] text-red-600 dark:bg-red-400/[0.14] dark:text-red-400"
                      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, transition: STILL }}
                      transition={reduced ? STILL : POP}
                    >
                      {Cross}
                    </motion.span>
                  ) : row.status === "active" ? (
                    <motion.span
                      key="active"
                      className="col-start-1 row-start-1 text-stone-500 dark:text-stone-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: STILL }}
                      transition={reduced ? STILL : CELL}
                    >
                      <Arc spin={!reduced} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="pending"
                      className="col-start-1 row-start-1 size-[5px] rounded-[2px] bg-stone-300 dark:bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: STILL }}
                      transition={STILL}
                    />
                  )}
                </AnimatePresence>
              </span>

              <span
                className={`min-w-0 flex-1 truncate text-[12.5px] transition-colors duration-200 ${tone}`}
              >
                {row.label}
              </span>

              {row.meta ? (
                <span
                  className={`shrink-0 font-mono text-[10.5px] tabular-nums transition-opacity duration-200 ${
                    row.status === "done"
                      ? "text-stone-400 opacity-100 dark:text-stone-500"
                      : "opacity-0"
                  }`}
                  aria-hidden={row.status !== "done"}
                >
                  {row.meta}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
      <span role="status" className="sr-only">
        {spoken}
      </span>
      <span className="sr-only" aria-live={complete || failed ? "polite" : "off"}>
        {complete ? copy.runComplete : failed ? copy.runFailed : ""}
      </span>
    </div>
  );
}
