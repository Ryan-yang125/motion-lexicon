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
  emptyLabel?: string;
  activeId?: string;
  magnification?: number;
  distance?: number;
  className?: string;
};

function DockItem({ item, pointerX, pointerY, reduced, active, magnification, distance }: {
  item: FloatingDockItem;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
  reduced: boolean;
  active: boolean;
  magnification: number;
  distance: number;
}) {
  const root = useRef<HTMLButtonElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const positionTooltip = () => {
    const node = tooltip.current;
    if (!node) return;
    node.style.transform = "";
    const box = node.getBoundingClientRect();
    const viewportPadding = 8;
    const shift = box.left < viewportPadding
      ? viewportPadding - box.left
      : box.right > window.innerWidth - viewportPadding
        ? window.innerWidth - viewportPadding - box.right
        : 0;
    if (shift !== 0) node.style.transform = `translateX(${shift}px)`;
  };
  const raw = useTransform([pointerX, pointerY], ([positionX, positionY]) => {
    const box = root.current?.getBoundingClientRect();
    if (!box || reduced || positionX === DISTANT || positionY === DISTANT) return 1;
    const delta = Math.hypot(
      Number(positionX) - (box.left + box.width / 2),
      Number(positionY) - (box.top + box.height / 2),
    );
    const influence = Math.max(0, 1 - delta / distance);
    return 1 + influence * (magnification - 1);
  });
  const scale = useSpring(raw, FOLLOW);
  const transform = useTransform(scale, (value) => `scale(${value}) translateZ(0)`);

  return (
    <div
      className="group relative grid w-11 shrink-0 place-items-center"
      onPointerEnter={positionTooltip}
    >
      <motion.button
        ref={root}
        type="button"
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        onFocus={() => {
          const box = root.current?.getBoundingClientRect();
          if (box && !reduced) {
            pointerX.set(box.left + box.width / 2);
            pointerY.set(box.top + box.height / 2);
          }
          positionTooltip();
        }}
        onBlur={() => {
          pointerX.set(DISTANT);
          pointerY.set(DISTANT);
          if (tooltip.current) tooltip.current.style.transform = "";
        }}
        onClick={item.onSelect}
        className={`relative grid size-11 place-items-center rounded-[13px] border outline-none shadow-[0_4px_8px_-6px_rgba(28,25,23,.7)] focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.22),0_4px_8px_-6px_rgba(28,25,23,.7)] ${active ? "border-stone-800 bg-stone-800 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-950" : "border-stone-200 bg-white text-stone-600 dark:border-white/15 dark:bg-[#292926] dark:text-stone-300"}`}
        style={{ transform, transformOrigin: "50% 100%", touchAction: "manipulation" }}
      >
        <span aria-hidden>
          {item.icon}
        </span>
        {active ? <span aria-hidden className="absolute -bottom-1 size-1 rounded-full bg-[#4568FF]" /> : null}
      </motion.button>
      <span
        ref={tooltip}
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] w-max max-w-[min(240px,calc(100vw-16px))] whitespace-normal rounded-[7px] bg-stone-900 px-2 py-1 text-center text-[10px] leading-[1.3] text-white opacity-0 shadow-lg transition-opacity duration-150 [overflow-wrap:anywhere] group-focus-within:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 dark:bg-stone-100 dark:text-stone-950"
      >
        {item.label}
      </span>
    </div>
  );
}

export function FloatingDock({
  items,
  label,
  emptyLabel = "No dock items",
  activeId,
  magnification = 1.48,
  distance = 108,
  className = "",
}: FloatingDockProps) {
  const pointerX = useMotionValue(DISTANT);
  const pointerY = useMotionValue(DISTANT);
  const reduced = useReducedMotion() === true;
  const resolvedMagnification = Number.isFinite(magnification) ? Math.max(1, magnification) : 1.48;
  const resolvedDistance = Number.isFinite(distance) ? Math.max(1, distance) : 108;

  return (
    <nav
      aria-label={label}
      onPointerMove={(event) => {
        if (event.pointerType !== "touch" && !reduced) {
          pointerX.set(event.clientX);
          pointerY.set(event.clientY);
        }
      }}
      onPointerLeave={() => {
        pointerX.set(DISTANT);
        pointerY.set(DISTANT);
      }}
      className={`flex min-h-[66px] max-w-full flex-wrap items-end justify-center gap-px rounded-[18px] border border-stone-200 bg-white/88 px-1.5 pb-2 pt-3 shadow-[0_4px_8px_-8px_rgba(28,25,23,.72)] backdrop-blur-md dark:border-white/15 dark:bg-[#1E1E1B]/92 ${className}`}
    >
      {items.length === 0 ? (
        <span role="status" className="grid min-h-11 place-items-center px-3 text-center text-[12px] text-stone-600 dark:text-stone-300">
          {emptyLabel}
        </span>
      ) : items.map((item) => (
          <DockItem key={item.id} item={item} pointerX={pointerX} pointerY={pointerY} reduced={reduced} active={item.id === activeId} magnification={resolvedMagnification} distance={resolvedDistance} />
        ))}
    </nav>
  );
}
