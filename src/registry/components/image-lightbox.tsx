"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";

export type ImageLightboxItem = {
  id: string;
  title: string;
  caption?: string;
  meta?: string;
  art: ReactNode;
};

export type ImageLightboxProps = {
  items: readonly ImageLightboxItem[];
  label?: string;
  className?: string;
  onChange?: (item: ImageLightboxItem, index: number) => void;
};

type NavigationSource = "keyboard" | "pointer";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_MOVE = [0.77, 0, 0.175, 1] as const;

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const CLOSE_ICON = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
    <path d="m5.5 5.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ARROW_ICON = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
    <path d="m8.1 5.1 4.7 4.9-4.7 4.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function focusableWithin(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.getClientRects().length > 0,
  );
}

export function ImageLightbox({
  items,
  label = "Image collection",
  className = "",
  onChange,
}: ImageLightboxProps) {
  const reduced = useReducedMotion() === true;
  const layoutGroupId = useId();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const backdropDownRef = useRef(false);
  const navigationSourceRef = useRef<NavigationSource>("pointer");
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const open = activeIndex !== null;
  const activeItem = activeIndex === null ? null : items[activeIndex] ?? null;

  useEffect(() => {
    setActiveIndex((current) => {
      if (current === null || current < items.length) return current;
      return items.length > 0 ? items.length - 1 : null;
    });
  }, [items.length]);

  useEffect(() => {
    const node = document.createElement("div");
    node.dataset.imageLightboxPortal = "";
    document.body.appendChild(node);
    setPortalNode(node);
    return () => {
      node.remove();
    };
  }, []);

  useEffect(() => {
    if (!open || !portalNode) return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const siblings = Array.from(body.children).filter((child) => child !== portalNode);
    const inertState = siblings.map((element) => [element, element.getAttribute("inert")] as const);
    siblings.forEach((element) => element.setAttribute("inert", ""));
    body.style.overflow = "hidden";

    focusFrameRef.current = requestAnimationFrame(() => {
      focusFrameRef.current = null;
      closeRef.current?.focus({ preventScroll: true });
    });

    return () => {
      if (focusFrameRef.current !== null) {
        cancelAnimationFrame(focusFrameRef.current);
        focusFrameRef.current = null;
      }
      body.style.overflow = previousOverflow;
      inertState.forEach(([element, previous]) => {
        if (previous === null) element.removeAttribute("inert");
        else element.setAttribute("inert", previous);
      });
      const returnTarget = returnFocusRef.current;
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
    };
  }, [open, portalNode]);

  const openImage = (
    index: number,
    trigger: HTMLElement,
    source: NavigationSource,
  ) => {
    navigationSourceRef.current = source;
    returnFocusRef.current = trigger;
    setActiveIndex(index);
    const item = items[index];
    if (item) onChange?.(item, index);
  };

  const close = useCallback((source: NavigationSource = "pointer") => {
    navigationSourceRef.current = source;
    setActiveIndex(null);
  }, []);

  const move = useCallback(
    (delta: -1 | 1, source: NavigationSource) => {
      if (items.length < 2 || activeIndex === null) return;
      navigationSourceRef.current = source;
      const next = (activeIndex + delta + items.length) % items.length;
      setActiveIndex(next);
      onChange?.(items[next], next);
    },
    [activeIndex, items, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close("keyboard");
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        move(event.key === "ArrowLeft" ? -1 : 1, "keyboard");
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = focusableWithin(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, move, open]);

  const instant = reduced || navigationSourceRef.current === "keyboard";
  const sharedTransition = instant
    ? { duration: 0 }
    : { duration: 0.26, ease: EASE_MOVE };

  return (
    <LayoutGroup id={layoutGroupId}>
      <section aria-labelledby={titleId} className={`w-full ${className}`}>
        <header className="mb-2 flex min-h-11 items-end justify-between gap-4 px-1">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
              Gallery
            </span>
            <h3 id={titleId} className="mt-0.5 text-[13px] font-medium tracking-[-0.015em] text-[#292929] dark:text-stone-100">
              {label}
            </h3>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-400 dark:text-stone-500">
            {String(items.length).padStart(2, "0")} works
          </span>
        </header>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Open ${item.title}`}
              onClick={(event) =>
                openImage(
                  index,
                  event.currentTarget,
                  event.detail === 0 ? "keyboard" : "pointer",
                )
              }
              className="group overflow-hidden rounded-[13px] border border-black/[0.08] bg-white text-left outline-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 dark:border-white/[0.12] dark:bg-[#1D1D1A]"
            >
              <motion.span
                layoutId={`${layoutGroupId}-${item.id}`}
                transition={sharedTransition}
                className="block aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-white/[0.04]"
              >
                {item.art}
              </motion.span>
              <span className="flex min-h-[52px] items-center justify-between gap-2 border-t border-black/[0.07] px-2.5 dark:border-white/[0.1]">
                <span className="truncate text-[11px] font-medium text-[#292929] dark:text-stone-100">
                  {item.title}
                </span>
                <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-500">
                  {item.meta ?? String(index + 1).padStart(2, "0")}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {portalNode
        ? createPortal(
            <AnimatePresence>
              {activeItem && activeIndex !== null ? (
                <motion.div
                  key="image-lightbox"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: instant ? 0 : 0.18, ease: EASE_OUT }}
                  onPointerDown={(event) => {
                    backdropDownRef.current = event.target === event.currentTarget;
                  }}
                  onClick={(event) => {
                    if (event.target === event.currentTarget && backdropDownRef.current) {
                      close("pointer");
                    }
                    backdropDownRef.current = false;
                  }}
                  className="fixed inset-0 z-[100] grid place-items-center bg-[#171715]/88 p-3 backdrop-blur-[10px] sm:p-6"
                >
                  <motion.div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={`${layoutGroupId}-dialog-title`}
                    aria-describedby={activeItem.caption ? `${layoutGroupId}-dialog-caption` : undefined}
                    tabIndex={-1}
                    initial={instant ? false : { opacity: 0, transform: "translateY(10px) scale(0.98)" }}
                    animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                    exit={instant ? { opacity: 0 } : { opacity: 0, transform: "translateY(6px) scale(0.985)" }}
                    transition={{ duration: instant ? 0 : 0.24, ease: EASE_OUT }}
                    className="grid max-h-[calc(100dvh-24px)] w-full max-w-[980px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[18px] border border-white/[0.14] bg-[#EEECE5] shadow-[0_30px_100px_-30px_rgba(0,0,0,0.75)] outline-none dark:bg-[#1D1D1A] sm:max-h-[calc(100dvh-48px)]"
                  >
                    <header className="flex min-h-14 items-center justify-between gap-4 border-b border-black/[0.08] px-3 dark:border-white/[0.1]">
                      <div className="min-w-0">
                        <span className="block font-mono text-[8.5px] uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                        </span>
                        <h3
                          id={`${layoutGroupId}-dialog-title`}
                          className="truncate text-[13px] font-medium tracking-[-0.015em] text-[#292929] dark:text-stone-100"
                        >
                          {activeItem.title}
                        </h3>
                      </div>
                      <button
                        ref={closeRef}
                        type="button"
                        aria-label="Close gallery"
                        onClick={() => close("pointer")}
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-black/[0.09] bg-white/72 text-[#292929] outline-none transition-[background-color,transform] duration-150 active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 dark:border-white/[0.13] dark:bg-white/[0.06] dark:text-white"
                      >
                        {CLOSE_ICON}
                      </button>
                    </header>

                    <div className="relative grid min-h-0 place-items-center overflow-hidden p-3 sm:p-5">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.div
                          key={activeItem.id}
                          layoutId={`${layoutGroupId}-${activeItem.id}`}
                          role="img"
                          aria-label={activeItem.title}
                          initial={instant ? false : { opacity: 0.65, filter: "blur(2px)", transform: "scale(0.985)" }}
                          animate={{ opacity: 1, filter: "blur(0px)", transform: "scale(1)" }}
                          exit={instant ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", transform: "scale(0.99)" }}
                          transition={sharedTransition}
                          className="aspect-[4/3] max-h-full w-full max-w-[760px] overflow-hidden rounded-[13px] border border-black/[0.08] bg-stone-100 shadow-[0_24px_60px_-34px_rgba(41,41,41,0.65)] dark:border-white/[0.12] dark:bg-black/20"
                        >
                          {activeItem.art}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <footer className="grid min-h-[68px] grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 border-t border-black/[0.08] px-3 dark:border-white/[0.1]">
                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={() => move(-1, "pointer")}
                        disabled={items.length < 2}
                        className="grid size-11 place-items-center rounded-full border border-black/[0.09] bg-white/72 text-[#292929] outline-none transition-[background-color,transform] duration-150 active:scale-[0.96] disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-[#4568FF] dark:border-white/[0.13] dark:bg-white/[0.06] dark:text-white"
                      >
                        <span className="rotate-180">{ARROW_ICON}</span>
                      </button>
                      <p
                        id={`${layoutGroupId}-dialog-caption`}
                        className="min-w-0 text-center text-[11px] leading-[1.45] text-stone-500 dark:text-stone-400"
                      >
                        {activeItem.caption ?? activeItem.title}
                      </p>
                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={() => move(1, "pointer")}
                        disabled={items.length < 2}
                        className="grid size-11 place-items-center rounded-full border border-black/[0.09] bg-white/72 text-[#292929] outline-none transition-[background-color,transform] duration-150 active:scale-[0.96] disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-[#4568FF] dark:border-white/[0.13] dark:bg-white/[0.06] dark:text-white"
                      >
                        {ARROW_ICON}
                      </button>
                    </footer>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            portalNode,
          )
        : null}
    </LayoutGroup>
  );
}
