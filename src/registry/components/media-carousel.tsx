"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

export type MediaCarouselItem = {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  meta?: string;
  art: ReactNode;
};

export type MediaCarouselProps = {
  items: readonly MediaCarouselItem[];
  label?: string;
  initialIndex?: number;
  className?: string;
  onSelect?: (item: MediaCarouselItem, index: number) => void;
};

const clampIndex = (value: number, length: number) =>
  Math.min(Math.max(value, 0), Math.max(0, length - 1));

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const PREVIOUS_ICON = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
    <path
      d="m11.8 5.2-4.6 4.8 4.6 4.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NEXT_ICON = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
    <path
      d="m8.2 5.2 4.6 4.8-4.6 4.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function MediaCarousel({
  items,
  label = "Featured stories",
  initialIndex = 0,
  className = "",
  onSelect,
}: MediaCarouselProps) {
  const reduced = useReducedMotion() === true;
  const titleId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const scrollFrameRef = useRef<number | null>(null);
  const initialPositionedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    clampIndex(initialIndex, items.length),
  );
  const activeIndexRef = useRef(activeIndex);

  useIsomorphicLayoutEffect(() => {
    if (initialPositionedRef.current || items.length === 0) return;
    const index = clampIndex(initialIndex, items.length);
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return;

    activeIndexRef.current = index;
    setActiveIndex(index);
    viewport.scrollLeft = slide.offsetLeft - viewport.offsetLeft;
    initialPositionedRef.current = true;
  }, [initialIndex, items.length]);

  useEffect(() => {
    const next = clampIndex(activeIndexRef.current, items.length);
    activeIndexRef.current = next;
    setActiveIndex(next);
  }, [items.length]);

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    },
    [],
  );

  const selectIndex = useCallback(
    (nextIndex: number) => {
      if (items.length === 0) return;
      const index = clampIndex(nextIndex, items.length);
      if (activeIndexRef.current === index) return;
      activeIndexRef.current = index;
      setActiveIndex(index);
      onSelect?.(items[index], index);
    },
    [items, onSelect],
  );

  const goTo = useCallback(
    (nextIndex: number, animate: boolean, focus = false) => {
      if (items.length === 0) return;
      const index = clampIndex(nextIndex, items.length);
      const viewport = viewportRef.current;
      const slide = slideRefs.current[index];
      if (!viewport || !slide) return;

      viewport.scrollTo({
        left: slide.offsetLeft - viewport.offsetLeft,
        behavior: animate && !reduced ? "smooth" : "auto",
      });
      selectIndex(index);
      if (focus) slide.focus({ preventScroll: true });
    },
    [items.length, reduced, selectIndex],
  );

  const updateFromScroll = () => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      const viewport = viewportRef.current;
      if (!viewport || items.length === 0) return;
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const nextDistance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = index;
        }
      });
      selectIndex(nearest);
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keyTargets: Record<string, number> = {
      ArrowLeft: activeIndex - 1,
      ArrowRight: activeIndex + 1,
      Home: 0,
      End: items.length - 1,
    };
    const next = keyTargets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    goTo(next, false, true);
  };

  const hasPrevious = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  return (
    <section
      aria-labelledby={titleId}
      className={`w-full overflow-hidden rounded-[18px] border border-stone-200 bg-[#EEECE5] p-3 shadow-[0_18px_48px_-38px_rgba(41,41,41,0.55)] dark:border-white/[0.14] dark:bg-[#1D1D1A] ${className}`}
    >
      <header className="mb-2 flex min-h-11 items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            Collection
          </span>
          <h3
            id={titleId}
            className="mt-0.5 truncate text-[13px] font-medium tracking-[-0.015em] text-[#292929] dark:text-stone-100"
          >
            {label}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            aria-live="polite"
            className="mr-1 font-mono text-[10px] tabular-nums text-stone-500 dark:text-stone-400"
          >
            {items.length === 0 ? "00 / 00" : `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`}
          </span>
          <button
            type="button"
            aria-label="Previous slide"
            disabled={!hasPrevious}
            onClick={() => goTo(activeIndex - 1, true)}
            className="grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white/75 text-[#292929] outline-none transition-[background-color,color,transform] duration-150 active:scale-[0.96] disabled:cursor-default disabled:text-stone-300 disabled:active:scale-100 focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 dark:border-white/[0.12] dark:bg-black/20 dark:text-stone-100 dark:disabled:text-stone-600"
          >
            {PREVIOUS_ICON}
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={!hasNext}
            onClick={() => goTo(activeIndex + 1, true)}
            className="grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white/75 text-[#292929] outline-none transition-[background-color,color,transform] duration-150 active:scale-[0.96] disabled:cursor-default disabled:text-stone-300 disabled:active:scale-100 focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 dark:border-white/[0.12] dark:bg-black/20 dark:text-stone-100 dark:disabled:text-stone-600"
          >
            {NEXT_ICON}
          </button>
        </div>
      </header>

      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={items.length === 0 ? -1 : 0}
        onKeyDown={onKeyDown}
        onScroll={updateFromScroll}
        className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain rounded-[14px] outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-offset-2 [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {items.map((item, index) => {
          const active = index === activeIndex;
          return (
            <article
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
              className="w-[88%] min-w-[88%] snap-center first:snap-start last:snap-end sm:w-[72%] sm:min-w-[72%]"
            >
              <button
                ref={(node) => {
                  slideRefs.current[index] = node;
                }}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => goTo(index, true)}
                onFocus={() => {
                  if (index !== activeIndex) goTo(index, false);
                }}
                className={`group block w-full overflow-hidden rounded-[14px] border bg-white text-left outline-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-[#4568FF] focus-visible:ring-inset dark:bg-[#151513] ${
                  active
                    ? "border-black/[0.16] shadow-[0_12px_30px_-24px_rgba(41,41,41,0.55)] dark:border-white/[0.22]"
                    : "border-black/[0.07] dark:border-white/[0.1]"
                }`}
              >
                <span className="block aspect-[16/10] overflow-hidden border-b border-black/[0.07] bg-stone-100 dark:border-white/[0.1] dark:bg-white/[0.04]">
                  {item.art}
                </span>
                <span className="grid min-h-[112px] grid-cols-[1fr_auto] gap-x-4 gap-y-2 p-3.5">
                  <span className="min-w-0">
                    {item.eyebrow ? (
                      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                        {item.eyebrow}
                      </span>
                    ) : null}
                    <span className="mt-1 block text-[14px] font-medium tracking-[-0.02em] text-[#292929] dark:text-stone-100">
                      {item.title}
                    </span>
                    {item.description ? (
                      <span className="mt-1.5 block max-w-[34rem] text-[11px] leading-[1.55] text-stone-500 dark:text-stone-400">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                  {item.meta ? (
                    <span className="self-start whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-stone-400 dark:text-stone-500">
                      {item.meta}
                    </span>
                  ) : null}
                </span>
              </button>
            </article>
          );
        })}
      </div>
      <p className="sr-only">
        Swipe or scroll through the slides. Use Left and Right Arrow, Home, or End from the carousel to move between slides.
      </p>
    </section>
  );
}
