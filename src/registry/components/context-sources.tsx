"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export type ContextSource = {
  id: string;
  title: string;
  excerpt: string;
  kind: string;
  origin: string;
  relevance?: number;
};
export type ContextSourcesProps = {
  sources: readonly ContextSource[];
  label?: string;
  countLabel?: (count: number) => string;
  className?: string;
};

export function ContextSources({
  sources,
  label = "Retrieved context",
  countLabel = (count) => `${count} sources`,
  className = "",
}: ContextSourcesProps) {
  const [active, setActive] = useState(sources[0]?.id ?? "");
  const reduced = useReducedMotion();
  return (
    <section
      className={`w-full rounded-[10px] border border-neutral-200 bg-white p-3 text-neutral-950 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}
    >
      <header className="flex min-h-10 items-center gap-2 px-1">
        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
          {label}
        </span>
        <span className="ml-auto text-[9px] text-neutral-400">
          {countLabel(sources.length)}
        </span>
      </header>
      <div className="mt-1 grid gap-2 sm:grid-cols-2">
        {sources.map((source, index) => {
          const open = active === source.id;
          return (
            <motion.article
              layout={!reduced}
              key={source.id}
              className={`relative overflow-hidden rounded-lg border p-3 ${open ? "border-neutral-400 bg-neutral-50 sm:col-span-2 dark:border-white/25 dark:bg-white/[.03]" : "border-neutral-100 dark:border-white/8"}`}
            >
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setActive(open ? "" : source.id)}
                className="flex min-h-11 w-full items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-neutral-100 font-mono text-[9px] text-neutral-500 dark:bg-white/5">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-[11px]">
                    {source.title}
                  </strong>
                  <span className="block truncate text-[9px] text-neutral-400">
                    {source.kind} · {source.origin}
                  </span>
                </span>
                {typeof source.relevance === "number" ? (
                  <code className="text-[9px] text-neutral-500 dark:text-neutral-400">
                    {source.relevance}%
                  </code>
                ) : null}
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.p
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 overflow-hidden pl-10 text-[10px] leading-5 text-neutral-500 dark:text-neutral-400"
                  >
                    {source.excerpt}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
