"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const INSERT = { type: "spring", stiffness: 420, damping: 38, mass: 0.72 } as const;
const LEAVE = { duration: 0.14, ease: [0.23, 1, 0.32, 1] } as const;
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
  unreadLabel?: string;
  unreadStartLabel?: string;
  toneLabels?: Partial<Record<ActivityTone, string>>;
  onItemClick?: (item: ActivityItem) => void;
  className?: string;
};

const dotClass: Record<ActivityTone, string> = {
  neutral: "bg-neutral-400 dark:bg-neutral-500",
  success: "bg-emerald-600",
  warning: "bg-amber-500",
  error: "bg-red-600",
};

const DEFAULT_TONE_LABELS: Record<ActivityTone, string> = {
  neutral: "",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

export function ActivityFeed({
  items,
  label = "Activity",
  emptyLabel = "No activity yet",
  unreadLabel = "Unread",
  unreadStartLabel = "Unread activity starts here",
  toneLabels: toneLabelOverrides,
  onItemClick,
  className = "",
}: ActivityFeedProps) {
  const toneLabels = { ...DEFAULT_TONE_LABELS, ...toneLabelOverrides };
  const reduced = useReducedMotion() === true;
  const previousIds = useRef<Set<string> | null>(null);
  const [announcement, setAnnouncement] = useState<{ id: string; title: string } | null>(null);
  let previousGroup: string | undefined;
  let unreadDividerShown = false;

  useEffect(() => {
    const newest = items[0];
    if (newest && previousIds.current && !previousIds.current.has(newest.id)) {
      setAnnouncement({ id: newest.id, title: newest.title });
    } else if (!newest) {
      setAnnouncement(null);
    }
    previousIds.current = new Set(items.map((item) => item.id));
  }, [items]);

  if (items.length === 0) {
    return (
      <section aria-label={label} className={`w-full max-w-[430px] ${className}`}>
        <div role="status" className="grid min-h-28 place-items-center rounded-[10px] border border-neutral-200 bg-white px-4 text-center text-[12.5px] text-neutral-600 dark:border-white/[0.16] dark:bg-[#181818] dark:text-neutral-300">
          {emptyLabel}
        </div>
      </section>
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
                  {toneLabels[item.tone ?? "neutral"] ? (
                    <span className="sr-only">{toneLabels[item.tone ?? "neutral"]}. </span>
                  ) : null}
                  <span className="flex items-baseline justify-between gap-3">
                    <strong className="truncate text-[12.5px] font-medium text-neutral-800 dark:text-neutral-100">{item.title}</strong>
                    <time className="max-w-[45%] shrink-0 truncate font-mono text-[10px] tabular-nums text-neutral-600 dark:text-neutral-400">{item.time}</time>
                  </span>
                  {item.description ? <span className="mt-0.5 block text-[11.5px] leading-relaxed text-neutral-600 [overflow-wrap:anywhere] dark:text-neutral-400">{item.description}</span> : null}
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
                  <div className="pb-1 pt-2 text-[10.5px] font-medium text-neutral-600 [overflow-wrap:anywhere] dark:text-neutral-400">{item.group}</div>
                ) : null}
                {showUnread ? (
                  <div className="flex items-center gap-2 py-1" aria-label={unreadStartLabel}>
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
                    <span className="text-[9.5px] font-medium text-neutral-500 dark:text-neutral-400">{unreadLabel}</span>
                    <span className="h-px flex-1 bg-neutral-200 dark:bg-white/10" />
                  </div>
                ) : null}
                <div className="relative">
                  {index < items.length - 1 ? <span aria-hidden="true" className="absolute bottom-0 left-[13px] top-[30px] w-px bg-neutral-200 dark:bg-white/[0.12]" /> : null}
                  {onItemClick ? (
                    <button
                      type="button"
                      onClick={() => onItemClick(item)}
                      className={`relative flex min-h-11 w-full gap-2.5 rounded-lg px-2 text-left outline-none transition-colors duration-150 hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-white/[0.07] dark:focus-visible:bg-white/[0.07] ${item.unread ? "bg-neutral-100/80 dark:bg-white/[0.05]" : ""}`}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className={`relative flex min-h-11 gap-2.5 rounded-lg px-2 ${item.unread ? "bg-neutral-100/80 dark:bg-white/[0.05]" : ""}`}>{content}</div>
                  )}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement ? <span key={announcement.id}>{announcement.title}</span> : null}
      </span>
    </section>
  );
}
