"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SPRING = { type: "spring", stiffness: 430, damping: 30, mass: 0.55 } as const;
const INSTANT = { duration: 0 } as const;

export type RadialAction = {
  id: string;
  label: string;
  icon: ReactNode;
  onSelect: () => void;
};

export type RadialActionsProps = {
  actions: readonly RadialAction[];
  label: string;
  trigger: ReactNode;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  className?: string;
};

export function RadialActions({
  actions,
  label,
  trigger,
  radius = 82,
  startAngle = 200,
  endAngle = 340,
  className = "",
}: RadialActionsProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion() === true;
  const uid = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const activeIndexRef = useRef(0);
  const matchedActiveIndex = activeId === null
    ? -1
    : actions.findIndex((action) => action.id === activeId);
  const activeIndex = matchedActiveIndex >= 0
    ? matchedActiveIndex
    : actions.length > 0
      ? Math.min(activeIndexRef.current, actions.length - 1)
      : -1;
  const effectiveActiveId = actions[activeIndex]?.id ?? null;
  const actionOrder = actions.map((action) => action.id).join("\u0000");
  const menuOpen = open && actions.length > 0;

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    if (actions.length === 0) {
      activeIndexRef.current = 0;
      setActiveId(null);
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
      return;
    }
    if (effectiveActiveId === null || activeIndex < 0) return;
    activeIndexRef.current = activeIndex;
    if (activeId !== effectiveActiveId) setActiveId(effectiveActiveId);
    buttons.current.get(effectiveActiveId)?.focus({ preventScroll: true });
  }, [actionOrder, actions.length, activeId, activeIndex, effectiveActiveId, open]);

  const openMenu = () => {
    if (actions.length === 0) return;
    const index = matchedActiveIndex >= 0
      ? matchedActiveIndex
      : Math.min(activeIndexRef.current, actions.length - 1);
    activeIndexRef.current = index;
    setActiveId(actions[index].id);
    setOpen(true);
  };

  const move = (next: number) => {
    if (actions.length === 0) return;
    const index = (next + actions.length) % actions.length;
    activeIndexRef.current = index;
    setActiveId(actions[index].id);
    buttons.current.get(actions[index].id)?.focus({ preventScroll: true });
  };

  const keyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      move(index + 1);
    } else if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      move(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(actions.length - 1);
    }
  };

  return (
    <div className={`relative grid size-[220px] place-items-center ${className}`}>
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id={`${uid}-menu`}
            role="menu"
            aria-label={label}
            initial={false}
            exit={{ opacity: 0 }}
            transition={reduced ? INSTANT : { duration: 0.12 }}
            className="absolute inset-0"
          >
            {actions.map((action, index) => {
              const progress = actions.length === 1 ? 0.5 : index / (actions.length - 1);
              const angle = (startAngle + (endAngle - startAngle) * progress) * Math.PI / 180;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <motion.button
                  key={action.id}
                  ref={(node) => {
                    if (node) buttons.current.set(action.id, node);
                    else buttons.current.delete(action.id);
                  }}
                  type="button"
                  role="menuitem"
                  aria-label={action.label}
                  tabIndex={action.id === effectiveActiveId ? 0 : -1}
                  initial={reduced ? { opacity: 1, transform: `translate(${x}px, ${y}px)` } : { opacity: 0, transform: "translate(0px, 0px) scale(.94)" }}
                  animate={{ opacity: 1, transform: `translate(${x}px, ${y}px) scale(1)` }}
                  exit={{ opacity: 0, transform: "translate(0px, 0px) scale(.96)" }}
                  transition={reduced ? INSTANT : { ...SPRING, delay: index * 0.035 }}
                  onFocus={() => {
                    activeIndexRef.current = index;
                    setActiveId(action.id);
                  }}
                  onKeyDown={(event) => keyDown(event, index)}
                  onClick={() => { action.onSelect(); close(); }}
                  className="absolute left-1/2 top-1/2 -ml-[22px] -mt-[22px] grid size-11 place-items-center rounded-full border border-stone-200 bg-white text-stone-700 shadow-[0_10px_24px_-16px_rgba(28,25,23,.65)] outline-none focus-visible:border-[#4568FF] focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.2),0_10px_24px_-16px_rgba(28,25,23,.65)] dark:border-white/15 dark:bg-[#242421] dark:text-stone-200"
                >
                  {action.icon}
                </motion.button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? `${uid}-menu` : undefined}
        aria-disabled={actions.length === 0}
        onClick={() => { if (menuOpen) close(); else openMenu(); }}
        animate={{ transform: menuOpen && !reduced ? "rotate(45deg)" : "rotate(0deg)" }}
        transition={reduced ? INSTANT : SPRING}
        className="relative z-10 grid size-14 place-items-center rounded-full bg-stone-900 text-white shadow-[0_16px_32px_-18px_rgba(28,25,23,.8)] outline-none focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.28),0_16px_32px_-18px_rgba(28,25,23,.8)] aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:bg-stone-100 dark:text-stone-950"
      >
        {trigger}
      </motion.button>
    </div>
  );
}
