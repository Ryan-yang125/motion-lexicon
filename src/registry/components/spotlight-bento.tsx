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
  selectedId?: string;
  onSelect?: (item: SpotlightBentoItem) => void;
};

const toneClass = {
  blue: "bg-[#315f8c] text-[#eff9ff]",
  clay: "bg-[#d36a42] text-[#fff3df]",
  moss: "bg-[#6b8760] text-[#f5ffe8]",
  ink: "bg-[#2a2520] text-[#fff0dc]",
} as const;

export function SpotlightBento({
  items,
  label = "Product signals",
  className = "",
  selectedId,
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
      className={`w-full rounded-[18px] border border-[#f3dab2]/20 bg-[#15130f] p-2 shadow-[0_24px_48px_-34px_rgba(0,0,0,.9)] ${className}`}
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
        className="relative isolate grid grid-cols-2 gap-1.5 overflow-hidden rounded-[13px] bg-[radial-gradient(circle_at_76%_16%,rgba(229,154,89,.22),transparent_34%),radial-gradient(circle_at_12%_90%,rgba(80,130,116,.22),transparent_40%)]"
      >
        <div
          ref={lightRef}
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 z-0 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,225,179,.44)_0%,rgba(255,225,179,0)_72%)] ${
            reduced ? "" : "will-change-transform"
          }`}
        />

        {items.map((item) => {
          const interactive = typeof onSelect === "function";
          const selected = interactive && item.id === selectedId;
          const cardClassName = `group relative z-10 min-h-[106px] min-w-0 overflow-hidden rounded-xl border bg-[#211d17]/94 p-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,.03)] ${
            selected
              ? "border-[#f1c98d]/75"
              : "border-white/[0.1]"
          } ${
            item.wide ? "col-span-2" : ""
          } ${
            interactive
              ? "outline-none focus-visible:ring-2 focus-visible:ring-[#f1c98d] focus-visible:ring-offset-1 focus-visible:ring-offset-[#15130f]"
              : ""
          } ${
            interactive && !reduced
              ? "transition-[transform,border-color,background-color] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[#f1c98d]/45"
              : ""
          }`;
          const content = (
            <>
              <span aria-hidden className="absolute -right-7 -top-8 size-24 rounded-full border border-white/[0.08]" />
              <span className="flex items-start justify-between gap-2">
                <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${toneClass[item.tone ?? "ink"]}`}>
                  {item.icon ?? <span className="size-1.5 rounded-full bg-current" />}
                </span>
                {item.meta ? (
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#f6dfbb]/52">{item.meta}</span>
                ) : null}
              </span>
              <span className="mt-3 block min-w-0">
                <strong className="block truncate text-[14px] font-medium tracking-[-0.025em] text-[#fff0d8]">{item.value}</strong>
                <span className="mt-0.5 block truncate text-[10.5px] text-[#f6dfbb]/60">{item.label}</span>
              </span>
              {interactive ? (
                <span
                  aria-hidden
                  data-spotlight-indicator
                  data-motion-mode={reduced ? "instant" : "standard"}
                  className={`absolute inset-x-3 bottom-0 h-px bg-[#f2c98c] ${selected ? "opacity-100" : "opacity-0 group-focus-visible:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"} ${
                    reduced
                      ? ""
                      : `origin-left transition-[opacity,transform] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] ${selected ? "scale-x-100" : "scale-x-0 group-focus-visible:scale-x-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-x-100"}`
                  }`}
                />
              ) : null}
            </>
          );

          return interactive ? (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
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
