"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const MOVE = { type: "spring", stiffness: 420, damping: 32, mass: 0.6 } as const;
const INSTANT = { duration: 0 } as const;

export type MegaMenuLink = { id: string; label: string; description?: string; onSelect: () => void };
export type MegaMenuSection = { id: string; label: string; links: readonly MegaMenuLink[]; preview?: ReactNode };

export type MegaMenuProps = {
  sections: readonly MegaMenuSection[];
  label: string;
  className?: string;
};

export function MegaMenu({ sections, label, className = "" }: MegaMenuProps) {
  const [active, setActive] = useState<string | null>(null);
  const [focusedLink, setFocusedLink] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const closeTimer = useRef<number | null>(null);
  const uid = useId();
  const reduced = useReducedMotion() === true;
  const index = Math.max(0, sections.findIndex((item) => item.id === active));
  const current = sections[index];

  const cancelClose = () => {
    if (closeTimer.current === null) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const close = () => {
    cancelClose();
    setActive(null);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setActive(null);
    }, 120);
  };
  const openSection = (id: string) => {
    cancelClose();
    setFocusedLink(0);
    setActive(id);
  };
  const choose = (next: number) => {
    const normalized = (next + sections.length) % sections.length;
    const section = sections[normalized];
    if (!section) return;
    openSection(section.id);
    buttons.current[normalized]?.focus();
  };

  const focusMenuItem = (next: number) => {
    const count = current?.links.length ?? 0;
    if (count === 0) return;
    const normalized = (next + count) % count;
    setFocusedLink(normalized);
    requestAnimationFrame(() => root.current?.querySelectorAll<HTMLButtonElement>("[data-menu-link]")[normalized]?.focus());
  };

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  const keyDown = (event: React.KeyboardEvent, at: number) => {
    if (event.key === "ArrowRight") { event.preventDefault(); choose(at + 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); choose(at - 1); }
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      const section = sections[at];
      if (section) openSection(section.id);
      requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>("[data-menu-link]")?.focus());
    } else if (event.key === "Escape") { event.preventDefault(); close(); buttons.current[at]?.focus(); }
  };

  const menuKeyDown = (event: React.KeyboardEvent, at: number) => {
    if (event.key === "ArrowDown") { event.preventDefault(); focusMenuItem(at + 1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); focusMenuItem(at - 1); }
    else if (event.key === "Home") { event.preventDefault(); focusMenuItem(0); }
    else if (event.key === "End") { event.preventDefault(); focusMenuItem((current?.links.length ?? 1) - 1); }
    else if (event.key === "Escape") { event.preventDefault(); close(); buttons.current[index]?.focus(); }
  };

  return (
    <div
      ref={root}
      className={`relative w-full max-w-[620px] ${className}`}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") cancelClose(); }}
      onPointerLeave={(event) => { if (event.pointerType !== "touch") scheduleClose(); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
    >
      <nav aria-label={label} className="flex min-h-12 items-center gap-1 rounded-[13px] border border-stone-200 bg-white p-1 shadow-[0_12px_30px_-24px_rgba(28,25,23,.68)] dark:border-white/15 dark:bg-[#22221F]">
        {sections.map((section, at) => {
          const isOpen = section.id === active;
          return (
            <button
              key={section.id}
              ref={(node) => { buttons.current[at] = node; }}
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${uid}-panel`}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") openSection(section.id); }}
              onClick={() => { if (isOpen) close(); else openSection(section.id); }}
              onKeyDown={(event) => keyDown(event, at)}
              className={`relative min-h-11 flex-1 rounded-[9px] px-3 text-[12px] font-medium outline-none transition-colors duration-150 focus-visible:shadow-[0_0_0_2px_rgba(69,104,255,.22)] ${isOpen ? "text-stone-900 dark:text-white" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"}`}
            >
              {isOpen ? <motion.span layoutId={`${uid}-active`} transition={reduced ? INSTANT : MOVE} className="absolute inset-0 rounded-[9px] bg-stone-100 shadow-[inset_0_0_0_1px_rgba(41,41,41,.05)] dark:bg-white/[.08]" /> : null}
              <span className="relative">{section.label}</span>
            </button>
          );
        })}
      </nav>

      <AnimatePresence>
        {active && current ? (
          <motion.div
            id={`${uid}-panel`}
            key={current.id}
            initial={reduced ? { opacity: 1 } : { opacity: 0, transform: "translate3d(0,-6px,0) scale(.985)" }}
            animate={{ opacity: 1, transform: "translate3d(0,0,0) scale(1)" }}
            exit={{ opacity: 0, transform: reduced ? "none" : "translate3d(0,-4px,0) scale(.99)" }}
            transition={reduced ? INSTANT : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            onPointerEnter={(event) => { if (event.pointerType !== "touch") cancelClose(); }}
            className="absolute inset-x-0 top-[calc(100%+7px)] z-30 grid min-h-[190px] grid-cols-[minmax(0,1fr)_minmax(150px,.72fr)] overflow-hidden rounded-[16px] border border-stone-200 bg-white shadow-[0_28px_58px_-30px_rgba(28,25,23,.72)] dark:border-white/15 dark:bg-[#1F1F1C]"
          >
            <div role="menu" aria-label={current.label} className="grid content-start gap-1 p-2.5">
              {current.links.map((link, at) => (
                <button
                  key={link.id}
                  data-menu-link
                  type="button"
                  role="menuitem"
                  tabIndex={at === focusedLink ? 0 : -1}
                  onClick={() => { link.onSelect(); close(); }}
                  onFocus={() => setFocusedLink(at)}
                  onKeyDown={(event) => menuKeyDown(event, at)}
                  className="group min-h-11 rounded-[10px] px-3 py-2 text-left outline-none transition-colors duration-150 hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:shadow-[inset_0_0_0_2px_rgba(69,104,255,.25)] dark:hover:bg-white/[.07] dark:focus-visible:bg-white/[.07]"
                >
                  <strong className="block text-[12px] font-medium text-stone-800 dark:text-stone-100">{link.label}</strong>
                  {link.description ? <span className="mt-0.5 block text-[10px] text-stone-400">{link.description}</span> : null}
                </button>
              ))}
            </div>
            <div className="grid place-items-center bg-[#DDD7CD] p-3 dark:bg-[#292825]">{current.preview}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
