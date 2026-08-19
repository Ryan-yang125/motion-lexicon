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
  copy?: Partial<ImageLightboxCopy>;
  className?: string;
  onChange?: (item: ImageLightboxItem, index: number) => void;
};

export type ImageLightboxCopy = {
  gallery: string;
  works: (count: number) => string;
  empty: string;
  open: (title: string) => string;
  close: string;
  previous: string;
  next: string;
};

const DEFAULT_COPY: ImageLightboxCopy = {
  gallery: "Gallery",
  works: (count) => `${String(count).padStart(2, "0")} works`,
  empty: "No works in this gallery",
  open: (title) => `Open ${title}`,
  close: "Close gallery",
  previous: "Previous image",
  next: "Next image",
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
  copy: copyOverrides,
  className = "",
  onChange,
}: ImageLightboxProps) {
  const copy = { ...DEFAULT_COPY, ...copyOverrides };
  const reduced = useReducedMotion() === true;
  const layoutGroupId = useId();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusFrameRef = useRef<number | null>(null);
  const backdropDownRef = useRef(false);
  const navigationSourceRef = useRef<NavigationSource>("pointer");
  const [portalNode, setPortalNode] = useState<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIndex = activeId === null
    ? -1
    : items.findIndex((item) => item.id === activeId);
  const activeItem = activeIndex < 0 ? null : items[activeIndex];
  const open = activeItem !== null;

  useEffect(() => {
    if (activeId !== null && activeIndex < 0) setActiveId(null);
  }, [activeId, activeIndex]);

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
    const triggers = triggerRefs.current;
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
      const previousTarget = returnFocusRef.current;
      const returnTarget = previousTarget?.isConnected
        ? previousTarget
        : Array.from(triggers.values()).find((trigger) => trigger.isConnected);
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
    };
  }, [open, portalNode]);

  const openImage = (
    index: number,
    trigger: HTMLElement,
    source: NavigationSource,
  ) => {
    const item = items[index];
    if (!item) return;
    navigationSourceRef.current = source;
    returnFocusRef.current = trigger;
    setActiveId(item.id);
    onChange?.(item, index);
  };

  const close = useCallback((source: NavigationSource = "pointer") => {
    navigationSourceRef.current = source;
    setActiveId(null);
  }, []);

  const move = useCallback(
    (delta: -1 | 1, source: NavigationSource) => {
      if (items.length < 2 || activeIndex < 0) return;
      navigationSourceRef.current = source;
      const next = (activeIndex + delta + items.length) % items.length;
      setActiveId(items[next].id);
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
  const controlPressClass = reduced
    ? ""
    : "transition-[background-color,transform] duration-150 active:scale-[0.96]";

  return (
    <LayoutGroup id={layoutGroupId}>
      <section aria-labelledby={titleId} className={`w-full rounded-[18px] border border-[#3a3025]/15 bg-[#eee1cb] p-3 shadow-[0_18px_45px_-34px_rgba(51,37,21,.7)] dark:border-white/10 dark:bg-[#1c1814] ${className}`}>
        <header className="mb-3 flex min-h-11 items-end justify-between gap-4 px-1">
          <div className="min-w-0">
            <span className="block font-mono text-[9px] tracking-[.16em] text-[#746452] dark:text-[#e6cda8]/60">
              {copy.gallery}
            </span>
            <h3 id={titleId} className="mt-0.5 font-serif text-[18px] leading-none tracking-[-0.04em] text-[#29231c] dark:text-[#fff1dc]">
              {label}
            </h3>
          </div>
          <span className="shrink-0 font-mono text-[9px] tracking-[.1em] text-[#746452] dark:text-[#e6cda8]/60">
            {copy.works(items.length)}
          </span>
        </header>
        {items.length === 0 ? (
          <div role="status" className="grid min-h-28 place-items-center rounded-xl border border-[#3a3025]/15 bg-[#fff6e8] px-4 text-center text-[12px] text-[#6e5d49] dark:border-white/[0.12] dark:bg-[#181818] dark:text-neutral-300">
            {copy.empty}
          </div>
        ) : <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                if (node) triggerRefs.current.set(item.id, node);
                else triggerRefs.current.delete(item.id);
              }}
              type="button"
              aria-label={copy.open(item.title)}
              onClick={(event) =>
                openImage(
                  index,
                  event.currentTarget,
                  event.detail === 0 ? "keyboard" : "pointer",
                )
              }
              className="group overflow-hidden rounded-xl border border-[#3a3025]/15 bg-[#fff6e8] text-left outline-none transition-[border-color,box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eee1cb] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_16px_24px_-20px_rgba(53,36,17,.75)] dark:border-white/[0.12] dark:bg-[#181818]"
            >
              <motion.span
                layoutId={`${layoutGroupId}-${item.id}`}
                transition={sharedTransition}
                className="block aspect-[4/3] overflow-hidden bg-[#d3c2ab] dark:bg-white/[0.04]"
              >
                {item.art}
              </motion.span>
              <span className="flex min-h-[52px] items-center justify-between gap-2 border-t border-[#3a3025]/10 px-2.5 dark:border-white/[0.1]">
                <span className="truncate text-[11px] font-medium text-[#29231c] dark:text-neutral-100">
                  {item.title}
                </span>
                <span className="font-mono text-[8.5px] tracking-[.1em] text-[#7a6750] dark:text-neutral-400">
                  {item.meta ?? String(index + 1).padStart(2, "0")}
                </span>
              </span>
            </button>
          ))}
        </div>}
      </section>

      {portalNode
        ? createPortal(
            <AnimatePresence>
              {activeItem && activeIndex >= 0 ? (
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
                  className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-3 sm:p-6"
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
                    className="grid max-h-[calc(100dvh-24px)] w-full max-w-[980px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[18px] border border-[#f3d7ad]/20 bg-[#17130f] outline-none sm:max-h-[calc(100dvh-48px)]"
                  >
                    <header className="flex min-h-14 items-center justify-between gap-4 border-b border-white/10 px-3">
                      <div className="min-w-0">
                        <span className="block font-mono text-[8.5px] text-neutral-500 dark:text-neutral-400">
                          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                        </span>
                        <h3
                          id={`${layoutGroupId}-dialog-title`}
                          className="truncate font-serif text-[18px] leading-none tracking-[-0.04em] text-[#fff0db]"
                        >
                          {activeItem.title}
                        </h3>
                      </div>
                      <button
                        ref={closeRef}
                        type="button"
                        aria-label={copy.close}
                        onClick={() => close("pointer")}
                        className={`grid size-11 shrink-0 place-items-center rounded-full border border-white/15 bg-[#fff0db] text-[#292016] outline-none focus-visible:ring-2 focus-visible:ring-[#8eb9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17130f] ${controlPressClass}`}
                      >
                        {CLOSE_ICON}
                      </button>
                    </header>

                    <div className="relative grid min-h-0 place-items-center overflow-hidden bg-[radial-gradient(circle_at_22%_18%,rgba(205,115,69,.18),transparent_32%),radial-gradient(circle_at_82%_78%,rgba(77,117,108,.2),transparent_40%)] p-3 sm:p-5">
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
                          className="aspect-[4/3] max-h-full w-full max-w-[760px] overflow-hidden rounded-xl border border-[#f6dcc0]/20 bg-[#3a2c22] shadow-[0_28px_70px_-34px_rgba(0,0,0,.9)]"
                        >
                          {activeItem.art}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <footer className="grid min-h-[68px] grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 border-t border-white/10 px-3">
                      <button
                        type="button"
                        aria-label={copy.previous}
                        onClick={() => move(-1, "pointer")}
                        disabled={items.length < 2}
                        className={`grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-[#fff0db] outline-none disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-[#8eb9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17130f] ${controlPressClass}`}
                      >
                        <span className="rotate-180">{ARROW_ICON}</span>
                      </button>
                      <p
                        id={`${layoutGroupId}-dialog-caption`}
                        className="min-w-0 text-center text-[11px] leading-[1.45] text-[#ead6bb]/68 [overflow-wrap:anywhere]"
                      >
                        {activeItem.caption ?? activeItem.title}
                      </p>
                      <button
                        type="button"
                        aria-label={copy.next}
                        onClick={() => move(1, "pointer")}
                        disabled={items.length < 2}
                        className={`grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-[#fff0db] outline-none disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-[#8eb9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17130f] ${controlPressClass}`}
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
