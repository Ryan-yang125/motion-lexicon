"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

export type SpotlightBentoItem = {
  id: string;
  label: string;
  value: string;
  meta?: string;
  icon?: ReactNode;
  tone?: "blue" | "clay" | "moss" | "ink";
  wide?: boolean;
};

export type SpotlightBentoProps = {
  items: readonly SpotlightBentoItem[];
  label?: string;
  className?: string;
  onSelect?: (item: SpotlightBentoItem) => void;
};

const toneClass = {
  blue: "bg-[#4568FF] text-white",
  clay: "bg-[#B3654A] text-white",
  moss: "bg-[#73806B] text-white",
  ink: "bg-[#292929] text-white dark:bg-stone-100 dark:text-[#292929]",
} as const;

export function SpotlightBento({
  items,
  label = "Product signals",
  className = "",
  onSelect,
}: SpotlightBentoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const scheduleRef = useRef<() => void>(() => undefined);
  const pointRef = useRef({ x: 220, y: 125 });
  const reduced = useReducedMotion() === true;

  const paint = () => {
    frameRef.current = null;
    const light = lightRef.current;
    if (!light) return;
    light.style.transform = `translate3d(${pointRef.current.x - 150}px, ${pointRef.current.y - 150}px, 0)`;
  };

  const schedule = () => {
    if (frameRef.current === null) frameRef.current = requestAnimationFrame(paint);
  };
  scheduleRef.current = schedule;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const resize = new ResizeObserver(([entry]) => {
      pointRef.current = {
        x: entry.contentRect.width * 0.72,
        y: entry.contentRect.height * 0.28,
      };
      scheduleRef.current();
    });
    resize.observe(root);
    return () => {
      resize.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const moveLight = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      reduced ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    pointRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    schedule();
  };

  return (
    <section
      aria-label={label}
      className={`w-full rounded-[18px] border border-stone-200 bg-[#EAE8E1] p-2 shadow-[0_16px_44px_-36px_rgba(41,41,41,0.48)] dark:border-white/[0.14] dark:bg-[#191917] ${className}`}
    >
      <div
        ref={rootRef}
        onPointerMove={moveLight}
        onPointerLeave={() => {
          const root = rootRef.current;
          if (!root) return;
          pointRef.current = { x: root.clientWidth * 0.72, y: root.clientHeight * 0.28 };
          schedule();
        }}
        className="relative isolate grid grid-cols-2 gap-1.5 overflow-hidden rounded-[13px]"
      >
        <div
          ref={lightRef}
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 z-0 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(69,104,255,0.30)_0%,rgba(179,101,74,0.14)_42%,rgba(115,128,107,0)_72%)] blur-2xl ${
            reduced ? "" : "will-change-transform"
          }`}
        />

        {items.map((item) => {
          const interactive = typeof onSelect === "function";
          const cardClassName = `group relative z-10 min-h-[106px] min-w-0 overflow-hidden rounded-[12px] border border-black/[0.075] bg-white/72 p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-[18px] dark:border-white/[0.1] dark:bg-[#242421]/78 ${
            item.wide ? "col-span-2" : ""
          } ${
            interactive
              ? "outline-none focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-1"
              : ""
          } ${
            interactive && !reduced
              ? "transition-[transform,border-color,box-shadow] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-black/[0.14] [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_26px_-20px_rgba(41,41,41,0.6)]"
              : ""
          }`;
          const content = (
            <>
              <span className="flex items-start justify-between gap-2">
                <span className={`grid size-9 shrink-0 place-items-center rounded-[10px] ${toneClass[item.tone ?? "ink"]}`}>
                  {item.icon ?? <span className="size-1.5 rounded-full bg-current" />}
                </span>
                {item.meta ? (
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-500">{item.meta}</span>
                ) : null}
              </span>
              <span className="mt-3 block min-w-0">
                <strong className="block truncate text-[13px] font-medium tracking-[-0.015em] text-[#292929] dark:text-stone-100">{item.value}</strong>
                <span className="mt-0.5 block truncate text-[10.5px] text-stone-500 dark:text-stone-400">{item.label}</span>
              </span>
              {interactive ? (
                <span aria-hidden className="absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 bg-[#4568FF] opacity-0 transition-[opacity,transform] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] group-focus-visible:scale-x-100 group-focus-visible:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-x-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100" />
              ) : null}
            </>
          );

          return interactive ? (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={cardClassName}
            >
              {content}
            </button>
          ) : (
            <article key={item.id} className={cardClassName}>
              {content}
            </article>
          );
        })}
      </div>
    </section>
  );
}
