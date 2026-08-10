"use client";

import { useId, useRef, useState, type ReactNode } from "react";
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
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const reduced = useReducedMotion() === true;
  const index = Math.max(0, sections.findIndex((item) => item.id === active));
  const current = sections[index];

  const close = () => setActive(null);
  const choose = (next: number) => {
    const normalized = (next + sections.length) % sections.length;
    const section = sections[normalized];
    if (!section) return;
    setActive(section.id);
    buttons.current[normalized]?.focus();
  };

  const keyDown = (event: React.KeyboardEvent, at: number) => {
    if (event.key === "ArrowRight") { event.preventDefault(); choose(at + 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); choose(at - 1); }
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(sections[at]?.id ?? null);
      requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>("[data-menu-link]")?.focus());
    } else if (event.key === "Escape") { event.preventDefault(); close(); buttons.current[at]?.focus(); }
  };

  return (
    <div
      ref={root}
      className={`relative w-full max-w-[620px] ${className}`}
      onPointerLeave={(event) => { if (event.pointerType !== "touch") close(); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}
    >
      <nav aria-label={label} className="flex min-h-12 items-center gap-1 rounded-[13px] border border-stone-200 bg-white p-1 shadow-[0_12px_30px_-24px_rgba(28,25,23,.68)] dark:border-white/15 dark:bg-[#22221F]">
        {sections.map((section, at) => {
          const open = section.id === active;
          return (
            <button
              key={section.id}
              ref={(node) => { buttons.current[at] = node; }}
              type="button"
              aria-expanded={open}
              aria-controls={`${uid}-panel`}
              onPointerEnter={(event) => { if (event.pointerType !== "touch") setActive(section.id); }}
              onClick={() => setActive(open ? null : section.id)}
              onKeyDown={(event) => keyDown(event, at)}
              className={`relative min-h-11 flex-1 rounded-[9px] px-3 text-[12px] font-medium outline-none transition-colors duration-150 focus-visible:shadow-[0_0_0_2px_rgba(69,104,255,.22)] ${open ? "text-stone-900 dark:text-white" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"}`}
            >
              {open ? <motion.span layoutId={`${uid}-active`} transition={reduced ? INSTANT : MOVE} className="absolute inset-0 rounded-[9px] bg-stone-100 shadow-[inset_0_0_0_1px_rgba(41,41,41,.05)] dark:bg-white/[.08]" /> : null}
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
            className="absolute inset-x-0 top-[calc(100%+7px)] z-30 grid min-h-[190px] grid-cols-[minmax(0,1fr)_minmax(150px,.72fr)] overflow-hidden rounded-[16px] border border-stone-200 bg-white shadow-[0_28px_58px_-30px_rgba(28,25,23,.72)] dark:border-white/15 dark:bg-[#1F1F1C]"
          >
            <div role="menu" aria-label={current.label} className="grid content-start gap-1 p-2.5">
              {current.links.map((link) => (
                <button
                  key={link.id}
                  data-menu-link
                  type="button"
                  role="menuitem"
                  onClick={() => { link.onSelect(); close(); }}
                  onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); buttons.current[index]?.focus(); } }}
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
