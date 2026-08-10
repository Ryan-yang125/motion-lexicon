"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

const DISTANT = 10_000;
const FOLLOW = { stiffness: 520, damping: 34, mass: 0.4 } as const;

export type FloatingDockItem = {
  id: string;
  label: string;
  icon: ReactNode;
  onSelect: () => void;
};

export type FloatingDockProps = {
  items: readonly FloatingDockItem[];
  label: string;
  activeId?: string;
  magnification?: number;
  distance?: number;
  className?: string;
};

function DockItem({ item, pointerX, reduced, active, magnification, distance }: {
  item: FloatingDockItem;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  reduced: boolean;
  active: boolean;
  magnification: number;
  distance: number;
}) {
  const root = useRef<HTMLButtonElement>(null);
  const raw = useTransform(pointerX, (position) => {
    const box = root.current?.getBoundingClientRect();
    if (!box || reduced || position === DISTANT) return 1;
    const delta = Math.abs(position - (box.left + box.width / 2));
    const influence = Math.max(0, 1 - delta / distance);
    return 1 + influence * (magnification - 1);
  });
  const scale = useSpring(raw, FOLLOW);
  const transform = useTransform(scale, (value) => `scale(${value}) translateZ(0)`);

  return (
    <div className="group relative grid w-12 place-items-center">
      <motion.button
        ref={root}
        type="button"
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        onFocus={() => {
          const box = root.current?.getBoundingClientRect();
          if (box && !reduced) pointerX.set(box.left + box.width / 2);
        }}
        onBlur={() => pointerX.set(DISTANT)}
        onClick={item.onSelect}
        className={`relative grid size-11 place-items-center rounded-[13px] border outline-none shadow-[0_8px_20px_-16px_rgba(28,25,23,.7)] focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.22),0_8px_20px_-16px_rgba(28,25,23,.7)] ${active ? "border-stone-800 bg-stone-800 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950" : "border-stone-200 bg-white text-stone-600 dark:border-white/15 dark:bg-[#292926] dark:text-stone-300"}`}
        style={{ transform, transformOrigin: "50% 100%", touchAction: "manipulation" }}
      >
        {item.icon}
        {active ? <span aria-hidden className="absolute -bottom-1 size-1 rounded-full bg-[#4568FF]" /> : null}
      </motion.button>
      <span role="tooltip" className="pointer-events-none absolute bottom-[calc(100%+10px)] whitespace-nowrap rounded-[7px] bg-stone-900 px-2 py-1 text-[10px] text-white opacity-0 shadow-lg transition-opacity duration-150 group-focus-within:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 dark:bg-stone-100 dark:text-stone-950">
        {item.label}
      </span>
    </div>
  );
}

export function FloatingDock({
  items,
  label,
  activeId,
  magnification = 1.48,
  distance = 108,
  className = "",
}: FloatingDockProps) {
  const pointerX = useMotionValue(DISTANT);
  const reduced = useReducedMotion() === true;

  return (
    <nav
      aria-label={label}
      onPointerMove={(event) => {
        if (event.pointerType !== "touch" && !reduced) pointerX.set(event.clientX);
      }}
      onPointerLeave={() => pointerX.set(DISTANT)}
      className={`flex min-h-[66px] items-end gap-1 rounded-[18px] border border-stone-200 bg-white/88 px-2.5 pb-2 pt-3 shadow-[0_18px_40px_-26px_rgba(28,25,23,.72)] backdrop-blur-md dark:border-white/15 dark:bg-[#1E1E1B]/92 ${className}`}
    >
      {items.map((item) => (
        <DockItem key={item.id} item={item} pointerX={pointerX} reduced={reduced} active={item.id === activeId} magnification={magnification} distance={distance} />
      ))}
    </nav>
  );
}
