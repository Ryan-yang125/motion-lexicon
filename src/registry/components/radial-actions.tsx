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
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion() === true;
  const uid = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => buttons.current[active]?.focus());
  }, [open, active]);

  const move = (next: number) => {
    const index = (next + actions.length) % actions.length;
    setActive(index);
    buttons.current[index]?.focus();
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
        {open ? (
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
                  ref={(node) => { buttons.current[index] = node; }}
                  type="button"
                  role="menuitem"
                  aria-label={action.label}
                  initial={reduced ? { opacity: 1, transform: `translate(${x}px, ${y}px)` } : { opacity: 0, transform: "translate(0px, 0px) scale(.94)" }}
                  animate={{ opacity: 1, transform: `translate(${x}px, ${y}px) scale(1)` }}
                  exit={{ opacity: 0, transform: "translate(0px, 0px) scale(.96)" }}
                  transition={reduced ? INSTANT : { ...SPRING, delay: index * 0.035 }}
                  onFocus={() => setActive(index)}
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
        aria-expanded={open}
        aria-controls={`${uid}-menu`}
        onClick={() => setOpen((value) => !value)}
        animate={{ transform: open && !reduced ? "rotate(45deg)" : "rotate(0deg)" }}
        transition={reduced ? INSTANT : SPRING}
        className="relative z-10 grid size-14 place-items-center rounded-full bg-stone-900 text-white shadow-[0_16px_32px_-18px_rgba(28,25,23,.8)] outline-none focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.28),0_16px_32px_-18px_rgba(28,25,23,.8)] dark:bg-stone-100 dark:text-stone-950"
      >
        {trigger}
      </motion.button>
    </div>
  );
}
