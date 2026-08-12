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
      className={`w-full rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-950 shadow-[0_18px_50px_-36px_rgba(24,24,27,.5)] dark:border-white/10 dark:bg-[#17191d] dark:text-zinc-50 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-[#4568ff]" />
        <span className="font-mono text-[9px] uppercase tracking-[.14em] text-zinc-400">
          {label}
        </span>
        {!complete ? (
          <span className="ml-auto text-[10px] text-zinc-400">
            {streamingLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-[14px] leading-7 tracking-[-.01em]">
        {words.slice(0, visible).join(" ")}
        {!complete ? (
          <motion.span
            aria-hidden="true"
            className="ml-1 inline-block h-[1em] w-[2px] translate-y-0.5 bg-[#4568ff]"
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
            className="mt-4 border-t border-zinc-100 pt-3 dark:border-white/8"
          >
            <button
              type="button"
              aria-expanded={sourceOpen}
              onClick={() => setSourceOpen((value) => !value)}
              className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-[11px] font-medium hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] dark:hover:bg-white/5"
            >
              <span className="flex -space-x-1">
                {sources.slice(0, 3).map((source, index) => (
                  <i
                    key={source.id}
                    className="grid size-5 place-items-center rounded-full border border-white bg-zinc-100 text-[8px] not-italic text-zinc-500 dark:border-[#17191d] dark:bg-white/10 dark:text-zinc-300"
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
                      className="rounded-xl p-2.5 hover:bg-zinc-50 dark:hover:bg-white/5"
                    >
                      <strong className="block truncate text-[11px]">
                        {source.title}
                      </strong>
                      <span className="text-[10px] text-zinc-400">
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
              className="min-h-11 rounded-full border border-zinc-200 px-3 text-[11px] text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
