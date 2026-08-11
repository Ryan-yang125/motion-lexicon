"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SETTLE = { type: "spring", stiffness: 460, damping: 38, mass: 0.7 } as const;
const LEAVE = { duration: 0.16, ease: [0.23, 1, 0.32, 1] } as const;
const INSTANT = { duration: 0 } as const;

export type ToastTone = "neutral" | "success" | "warning" | "error";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
  action?: ReactNode;
};

export type ToastDismissReason = "button" | "keyboard" | "swipe";

export type ToastStackProps = {
  items: readonly ToastItem[];
  onDismiss: (id: string, reason: ToastDismissReason) => void;
  label?: string;
  dismissLabel?: (title: string) => string;
  depthLabel?: (depth: number) => string;
  maxVisible?: number;
  returnFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
};

const toneClass: Record<ToastTone, string> = {
  neutral: "bg-stone-500 dark:bg-stone-400",
  success: "bg-[#55745D] dark:bg-[#87A88F]",
  warning: "bg-[#A36F3F] dark:bg-[#D2A06F]",
  error: "bg-[#93664F] dark:bg-[#C99078]",
};

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return fine;
}

export function ToastStack({
  items,
  onDismiss,
  label = "Notifications",
  dismissLabel = (title) => `Dismiss ${title}`,
  depthLabel = (depth) => `Stack depth ${depth}`,
  maxVisible = 4,
  returnFocusRef,
  className = "",
}: ToastStackProps) {
  const reduced = useReducedMotion() === true;
  const finePointer = useFinePointer();
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLElement>(null);
  const toastRefs = useRef(new Map<string, HTMLElement>());
  const pendingDismiss = useRef<{ id: string; index: number; restoreFocus: boolean } | null>(null);
  const previousIds = useRef<Set<string> | null>(null);
  const [announcement, setAnnouncement] = useState<{ id: string; text: string } | null>(null);
  const visible = useMemo(
    () => items.slice(0, Math.max(1, maxVisible)),
    [items, maxVisible],
  );

  useEffect(() => {
    const first = items[0];
    if (first && previousIds.current && !previousIds.current.has(first.id)) {
      setAnnouncement({
        id: first.id,
        text: first.description ? `${first.title}. ${first.description}` : first.title,
      });
    } else if (!first) {
      setAnnouncement(null);
    }
    previousIds.current = new Set(items.map((item) => item.id));
  }, [items]);

  const visibleOrder = visible.map((item) => item.id).join("\u0000");

  useLayoutEffect(() => {
    const pending = pendingDismiss.current;
    if (!pending || items.some((item) => item.id === pending.id)) return;
    pendingDismiss.current = null;
    if (!pending.restoreFocus) return;

    if (visible.length === 0) {
      (returnFocusRef?.current ?? root.current)?.focus({ preventScroll: true });
      return;
    }
    const nextIndex = Math.min(pending.index, visible.length - 1);
    toastRefs.current.get(visible[nextIndex].id)?.focus({ preventScroll: true });
  }, [items, returnFocusRef, visible, visibleOrder]);

  const requestDismiss = (id: string, index: number, reason: ToastDismissReason) => {
    const toast = toastRefs.current.get(id);
    pendingDismiss.current = {
      id,
      index,
      restoreFocus: Boolean(toast?.contains(document.activeElement)),
    };
    onDismiss(id, reason);
  };

  const dismissFromKeyboard = (event: KeyboardEvent<HTMLElement>, id: string, index: number) => {
    const directDelete = event.target === event.currentTarget && (event.key === "Delete" || event.key === "Backspace");
    const directEnter = event.target === event.currentTarget && event.key === "Enter";
    if (event.key !== "Escape" && !directDelete && !directEnter) return;
    event.preventDefault();
    requestDismiss(id, index, "keyboard");
  };

  const collapsedHeight = visible.length === 0 ? 0 : 62 + (visible.length - 1) * 12;
  const expandedHeight = visible.length === 0 ? 0 : visible.length * 58 + (visible.length - 1) * 6;

  return (
    <section
      ref={root}
      data-toast-stack
      tabIndex={-1}
      aria-label={label}
      className={`w-full max-w-[390px] outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 ${className}`}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
      }}
      onPointerEnter={() => {
        if (finePointer) setExpanded(true);
      }}
      onPointerLeave={(event) => {
        if (finePointer && !event.currentTarget.contains(document.activeElement)) setExpanded(false);
      }}
    >
      <motion.ol
        layout={!reduced}
        className="relative m-0 list-none p-0"
        initial={false}
        style={{ height: expanded ? expandedHeight : collapsedHeight }}
        transition={reduced ? INSTANT : SETTLE}
      >
        <AnimatePresence initial={false}>
          {visible.map((item, index) => {
            const depth = visible.length - index - 1;
            const y = expanded ? index * 64 : index * 12;
            const scale = expanded ? 1 : 1 - index * 0.025;
            const tone = item.tone ?? "neutral";
            return (
              <motion.li
                key={item.id}
                layout={!reduced}
                initial={
                  reduced
                    ? { opacity: 0 }
                    : { opacity: 0, transform: "translate3d(18px, 6px, 0) scale(0.97)" }
                }
                animate={{
                  opacity: 1,
                  transform: `translate3d(${expanded ? 0 : index * 3}px, ${y}px, 0) scale(${scale})`,
                }}
                exit={
                  reduced
                    ? { opacity: 0, transition: INSTANT }
                    : {
                        opacity: 0,
                        transform: "translate3d(56px, 0, 0) scale(0.97)",
                        transition: LEAVE,
                      }
                }
                transition={reduced ? INSTANT : SETTLE}
                style={{ zIndex: visible.length - index, touchAction: "pan-y" }}
                className="absolute inset-x-0 top-0"
              >
                <motion.article
                  tabIndex={0}
                  ref={(node) => {
                    if (node) toastRefs.current.set(item.id, node);
                    else toastRefs.current.delete(item.id);
                  }}
                  aria-label={item.title}
                  drag={reduced ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 88 || Math.abs(info.velocity.x) > 520) {
                      requestDismiss(item.id, index, "swipe");
                    }
                  }}
                  onKeyDown={(event) => dismissFromKeyboard(event, item.id, index)}
                  style={{ touchAction: "pan-y" }}
                  className="flex min-h-[58px] items-center gap-3 rounded-[12px] border border-stone-200 bg-white px-3 py-1.5 shadow-[0_6px_12px_-10px_rgba(28,25,23,0.55)] outline-none focus-visible:border-[#4568FF] focus-visible:shadow-[inset_0_0_0_1px_#4568FF] dark:border-white/[0.16] dark:bg-[#1D1D1A] dark:focus-visible:border-[#93B0FF] dark:focus-visible:shadow-[inset_0_0_0_1px_#93B0FF]"
                >
                  <span
                    aria-hidden="true"
                    className={`size-2.5 shrink-0 rounded-[4px] ${toneClass[tone]}`}
                  />
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">
                      {item.title}
                    </strong>
                    {item.description ? (
                      <span className="mt-0.5 block truncate text-[11.5px] text-stone-500 dark:text-stone-400">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  {item.action ? <span className="shrink-0">{item.action}</span> : null}
                  <button
                    type="button"
                    aria-label={dismissLabel(item.title)}
                    onKeyDown={(event) => {
                      if (!["Enter", "Escape", "Delete", "Backspace"].includes(event.key)) return;
                      event.preventDefault();
                      event.stopPropagation();
                      requestDismiss(item.id, index, "keyboard");
                    }}
                    onClick={() => requestDismiss(item.id, index, "button")}
                    className="grid size-12 shrink-0 place-items-center rounded-[9px] text-stone-500 outline-none transition-colors duration-150 hover:bg-stone-100 hover:text-stone-800 focus-visible:bg-stone-100 focus-visible:shadow-[inset_0_0_0_1px_#4568FF] dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100 dark:focus-visible:bg-white/10 dark:focus-visible:shadow-[inset_0_0_0_1px_#93B0FF]"
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.article>
                <span className="sr-only">{depthLabel(depth + 1)}</span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ol>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement ? <span key={announcement.id}>{announcement.text}</span> : null}
      </span>
    </section>
  );
}
