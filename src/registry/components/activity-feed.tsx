"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const INSERT = { type: "spring", stiffness: 420, damping: 38, mass: 0.72 } as const;
const LEAVE = { duration: 0.14, ease: [0.4, 0, 1, 1] } as const;
const INSTANT = { duration: 0 } as const;

export type ActivityTone = "neutral" | "success" | "warning" | "error";

export type ActivityItem = {
  id: string;
  title: string;
  description?: string;
  time: string;
  group?: string;
  unread?: boolean;
  tone?: ActivityTone;
};

export type ActivityFeedProps = {
  items: readonly ActivityItem[];
  label?: string;
  emptyLabel?: string;
  onItemClick?: (item: ActivityItem) => void;
  className?: string;
};

const dotClass: Record<ActivityTone, string> = {
  neutral: "bg-stone-400 dark:bg-stone-500",
  success: "bg-[#55745D] dark:bg-[#87A88F]",
  warning: "bg-[#A36F3F] dark:bg-[#D2A06F]",
  error: "bg-[#93664F] dark:bg-[#C99078]",
};

export function ActivityFeed({
  items,
  label = "Activity",
  emptyLabel = "No activity yet",
  onItemClick,
  className = "",
}: ActivityFeedProps) {
  const reduced = useReducedMotion() === true;
  const first = useRef<string | null>(null);
  const initialized = useRef(false);
  const [announcement, setAnnouncement] = useState("");
  let previousGroup: string | undefined;
  let unreadDividerShown = false;

  useEffect(() => {
    const newest = items[0];
    if (!initialized.current) {
      initialized.current = true;
      first.current = newest?.id ?? null;
      return;
    }
    if (newest && first.current !== newest.id) setAnnouncement(newest.title);
    else if (!newest) setAnnouncement("");
    first.current = newest?.id ?? null;
  }, [items]);

  if (items.length === 0) {
    return (
      <div className={`grid min-h-28 place-items-center rounded-[12px] border border-stone-200 bg-white text-[12.5px] text-stone-500 dark:border-white/[0.16] dark:bg-[#1D1D1A] dark:text-stone-400 ${className}`}>
        {emptyLabel}
      </div>
    );
  }

  return (
    <section aria-label={label} className={`w-full max-w-[430px] ${className}`}>
      <ol className="relative m-0 list-none p-0">
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const showGroup = Boolean(item.group && item.group !== previousGroup);
            previousGroup = item.group;
            const showUnread = Boolean(item.unread && !unreadDividerShown);
            if (showUnread) unreadDividerShown = true;
            const content = (
              <>
                <span className="relative mt-[18px] grid size-3 shrink-0 place-items-center" aria-hidden="true">
                  <span className={`size-2 rounded-[3px] ${dotClass[item.tone ?? "neutral"]}`} />
                </span>
                <span className="min-w-0 flex-1 py-2.5">
                  <span className="flex items-baseline justify-between gap-3">
                    <strong className="truncate text-[12.5px] font-medium text-stone-800 dark:text-stone-100">{item.title}</strong>
                    <time className="shrink-0 font-mono text-[10px] tabular-nums text-stone-400 dark:text-stone-500">{item.time}</time>
                  </span>
                  {item.description ? <span className="mt-0.5 block text-[11.5px] leading-relaxed text-stone-500 dark:text-stone-400">{item.description}</span> : null}
                </span>
              </>
            );

            return (
              <motion.li
                key={item.id}
                layout={!reduced}
                initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0, -10px, 0)", filter: "blur(3px)" }}
                animate={{ opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0px)" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, transform: "translate3d(12px, 0, 0)", transition: LEAVE }}
                transition={reduced ? INSTANT : { ...INSERT, delay: Math.min(index, 3) * 0.025 }}
              >
                {showGroup ? (
                  <div className="pb-1 pt-2 text-[10.5px] font-medium text-stone-400 dark:text-stone-500">{item.group}</div>
                ) : null}
                {showUnread ? (
                  <div className="flex items-center gap-2 py-1" aria-label="Unread activity starts here">
                    <span className="h-px flex-1 bg-[#4568FF]/25 dark:bg-[#93B0FF]/30" />
                    <span className="text-[9.5px] font-medium text-[#4568FF] dark:text-[#93B0FF]">Unread</span>
                    <span className="h-px flex-1 bg-[#4568FF]/25 dark:bg-[#93B0FF]/30" />
                  </div>
                ) : null}
                <div className="relative">
                  {index < items.length - 1 ? <span aria-hidden="true" className="absolute bottom-0 left-[13px] top-[30px] w-px bg-stone-200 dark:bg-white/[0.12]" /> : null}
                  {onItemClick ? (
                    <button
                      type="button"
                      onClick={() => onItemClick(item)}
                      className={`relative flex min-h-11 w-full gap-2.5 rounded-[10px] px-2 text-left outline-none transition-colors duration-150 hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:shadow-[inset_0_0_0_1px_#4568FF] dark:hover:bg-white/[0.07] dark:focus-visible:bg-white/[0.07] dark:focus-visible:shadow-[inset_0_0_0_1px_#93B0FF] ${item.unread ? "bg-[#4568FF]/[0.035] dark:bg-[#93B0FF]/[0.05]" : ""}`}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className={`relative flex min-h-11 gap-2.5 rounded-[10px] px-2 ${item.unread ? "bg-[#4568FF]/[0.035] dark:bg-[#93B0FF]/[0.05]" : ""}`}>{content}</div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
    </section>
  );
}
