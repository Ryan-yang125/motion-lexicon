"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

export type AnswerSource = {
  id: string;
  title: string;
  domain: string;
  excerpt?: string;
};
export type StreamingAnswerProps = {
  text: string;
  sources?: readonly AnswerSource[];
  followUps?: readonly string[];
  speed?: number;
  label?: string;
  streamingLabel?: string;
  sourcesLabel?: (count: number) => string;
  onFollowUp?: (prompt: string) => void;
  className?: string;
};

export function StreamingAnswer({
  text,
  sources = [],
  followUps = [],
  speed = 34,
  label = "Answer",
  streamingLabel = "Streaming",
  sourcesLabel = (count) => `${count} sources`,
  onFollowUp,
  className = "",
}: StreamingAnswerProps) {
  const reduced = useReducedMotion();
  const words = useMemo(() => text.split(/\s+/), [text]);
  const [visible, setVisible] = useState(reduced ? words.length : 1);
  const [sourceOpen, setSourceOpen] = useState(false);

  useEffect(() => {
    setVisible(reduced ? words.length : 1);
    if (reduced) return;
    const timer = window.setInterval(
      () =>
        setVisible((count) => {
          if (count >= words.length) {
            window.clearInterval(timer);
            return count;
          }
          return count + 1;
        }),
      speed,
    );
    return () => window.clearInterval(timer);
  }, [reduced, speed, words.length, text]);

  const complete = visible >= words.length;
  return (
    <section
      aria-label={label}
      className={`w-full rounded-[10px] border border-neutral-200 bg-white p-4 text-neutral-950 dark:border-white/10 dark:bg-[#1b1b1b] dark:text-neutral-50 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
          {label}
        </span>
        {!complete ? (
          <span className="ml-auto text-[10px] text-neutral-400">
            {streamingLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-[14px] leading-7 tracking-[-.01em]">
        {words.slice(0, visible).join(" ")}
        {!complete ? (
          <motion.span
            aria-hidden="true"
            className="ml-1 inline-block h-[1em] w-px translate-y-0.5 bg-neutral-950 dark:bg-neutral-50"
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        ) : null}
      </p>
      <AnimatePresence>
        {complete && sources.length ? (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 border-t border-neutral-100 pt-3 dark:border-white/8"
          >
            <button
              type="button"
              aria-expanded={sourceOpen}
              onClick={() => setSourceOpen((value) => !value)}
              className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-[11px] font-medium hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-white/5"
            >
              <span className="flex -space-x-1">
                {sources.slice(0, 3).map((source, index) => (
                  <i
                    key={source.id}
                    className="grid size-5 place-items-center rounded-full border border-white bg-neutral-100 text-[8px] not-italic text-neutral-500 dark:border-[#181818] dark:bg-white/10 dark:text-neutral-300"
                  >
                    {index + 1}
                  </i>
                ))}
              </span>
              {sourcesLabel(sources.length)}
            </button>
            <AnimatePresence initial={false}>
              {sourceOpen ? (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 grid overflow-hidden sm:grid-cols-2"
                >
                  {sources.map((source) => (
                    <li
                      key={source.id}
                      className="rounded-lg p-2.5 hover:bg-neutral-50 dark:hover:bg-white/5"
                    >
                      <strong className="block truncate text-[11px]">
                        {source.title}
                      </strong>
                      <span className="text-[10px] text-neutral-400">
                        {source.domain}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
      {complete && followUps.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {followUps.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onFollowUp?.(prompt)}
              className="min-h-11 rounded-lg border border-neutral-200 px-3 text-[11px] text-neutral-600 transition hover:border-neutral-400 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-white/10 dark:text-neutral-300 dark:hover:bg-white/5"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
