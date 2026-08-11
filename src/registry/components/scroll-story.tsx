"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ScrollStoryChapter = {
  id: string;
  eyebrow?: string;
  title: string;
  copy?: string;
  scene: ReactNode;
};

export type ScrollStoryProps = {
  chapters: readonly ScrollStoryChapter[];
  label: string;
  emptyLabel?: string;
  height?: number;
  className?: string;
};

export function ScrollStory({ chapters, label, emptyLabel = "No chapters available.", height = 360, className = "" }: ScrollStoryProps) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sections = useRef(new Map<string, HTMLElement>());
  const chaptersRef = useRef(chapters);
  const lastActiveIndex = useRef(chapters.length > 0 ? 0 : -1);
  const [activeId, setActiveId] = useState<string | null>(() => chapters[0]?.id ?? null);
  const [reduced, setReduced] = useState<boolean | null>(null);
  chaptersRef.current = chapters;

  const matchedActiveIndex = activeId === null
    ? -1
    : chapters.findIndex((chapter) => chapter.id === activeId);
  const activeIndex = matchedActiveIndex >= 0
    ? matchedActiveIndex
    : chapters.length > 0
      ? activeId === null
        ? 0
        : Math.min(Math.max(lastActiveIndex.current, 0), chapters.length - 1)
      : -1;
  const current = chapters[activeIndex] ?? null;
  const effectiveActiveId = current?.id ?? null;

  useLayoutEffect(() => {
    if (chapters.length === 0) {
      lastActiveIndex.current = -1;
      if (activeId !== null) setActiveId(null);
      return;
    }
    if (matchedActiveIndex >= 0) {
      lastActiveIndex.current = matchedActiveIndex;
      return;
    }
    if (effectiveActiveId === null) return;
    lastActiveIndex.current = activeIndex;
    setActiveId(effectiveActiveId);
  }, [activeId, activeIndex, chapters.length, effectiveActiveId, matchedActiveIndex]);

  useLayoutEffect(() => {
    const shell = root.current;
    const scroll = scroller.current;
    if (!shell || !scroll || chapters.length === 0) return;
    const media = gsap.matchMedia();
    media.add(
      { reduceMotion: "(prefers-reduced-motion: reduce)" },
      (context) => {
        const reduce = Boolean(context.conditions?.reduceMotion);
        setReduced(reduce);
        const triggers = chapters.flatMap((chapter) => {
          const section = sections.current.get(chapter.id);
          if (!section) return [];
          return ScrollTrigger.create({
            trigger: section,
            scroller: scroll,
            start: "top 58%",
            end: "bottom 42%",
            onToggle: ({ isActive }) => {
              if (!isActive) return;
              const liveIndex = chaptersRef.current.findIndex((item) => item.id === chapter.id);
              if (liveIndex < 0) return;
              lastActiveIndex.current = liveIndex;
              setActiveId(chapter.id);
            },
          });
        });
        return () => triggers.forEach((trigger) => trigger.kill());
      },
      shell,
    );
    return () => media.revert();
  }, [chapters]);

  useLayoutEffect(() => {
    const node = stage.current;
    if (!node || reduced === null) return;
    if (reduced) {
      gsap.set(node, { clearProps: "transform,filter,opacity" });
      return;
    }
    const tween = gsap.fromTo(
      node,
      { opacity: 0.42, y: 14, scale: 0.985, filter: "blur(5px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.26, ease: "power3.out", overwrite: true },
    );
    return () => { tween.kill(); };
  }, [effectiveActiveId, reduced]);

  if (!current) {
    return (
      <div
        role="group"
        aria-label={label}
        className={`grid w-full min-w-0 place-items-center rounded-[18px] border border-stone-200 bg-white p-4 text-center text-[12px] text-stone-600 shadow-[0_4px_8px_-7px_rgba(28,25,23,.64)] dark:border-white/15 dark:bg-[#22221F] dark:text-stone-300 ${className}`}
        style={{ height }}
      >
        <p role="status">{emptyLabel}</p>
      </div>
    );
  }

  const scrollToChapter = (id: string) => {
    const scroll = scroller.current;
    const section = sections.current.get(id);
    if (!scroll || !section) return;
    const nextIndex = chapters.findIndex((chapter) => chapter.id === id);
    if (nextIndex >= 0) {
      lastActiveIndex.current = nextIndex;
      setActiveId(id);
    }
    const scrollRect = scroll.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const sectionTop = scroll.scrollTop + sectionRect.top - scrollRect.top;
    const centeredTop = sectionTop - (scroll.clientHeight - sectionRect.height) / 2;
    scroll.scrollTo({
      top: Math.max(0, centeredTop),
      behavior: reduced === false ? "smooth" : "auto",
    });
  };

  return (
    <div
      ref={root}
      role="group"
      aria-label={label}
      className={`grid w-full min-w-0 grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] overflow-hidden rounded-[18px] border border-stone-200 bg-white shadow-[0_4px_8px_-7px_rgba(28,25,23,.64)] dark:border-white/15 dark:bg-[#22221F] ${className}`}
      style={{ height }}
    >
      <div ref={scroller} className="overscroll-contain overflow-y-auto border-r border-stone-200 bg-[#F4F1EB] px-3 py-[38%] [scrollbar-width:none] dark:border-white/10 dark:bg-[#1C1C1A]">
        {chapters.map((chapter) => (
          <section
            key={chapter.id}
            ref={(node) => {
              if (node) sections.current.set(chapter.id, node);
              else sections.current.delete(chapter.id);
            }}
            className="grid min-h-[72%] content-center py-6"
          >
            <button
              type="button"
              aria-current={chapter.id === effectiveActiveId ? "step" : undefined}
              onClick={() => scrollToChapter(chapter.id)}
              className={`min-h-11 rounded-[12px] px-3 py-2 text-left outline-none transition-[background-color,box-shadow,color] duration-150 focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.2)] ${chapter.id === effectiveActiveId ? "bg-white text-stone-900 shadow-[0_8px_24px_-20px_rgba(28,25,23,.6)] dark:bg-white/10 dark:text-white" : "text-stone-600 hover:bg-white/55 dark:text-stone-300 dark:hover:bg-white/5"}`}
            >
              {chapter.eyebrow ? <span className="block text-[9px] uppercase tracking-[.1em]">{chapter.eyebrow}</span> : null}
              <strong className="mt-1 block text-[12px] leading-tight">{chapter.title}</strong>
              {chapter.copy ? <span className="mt-1 block text-[10px] leading-relaxed">{chapter.copy}</span> : null}
            </button>
          </section>
        ))}
      </div>
      <div className="relative grid min-w-0 place-items-center overflow-hidden bg-[#D9D4CB] p-4 dark:bg-[#2B2A27]">
        <div ref={stage} key={current.id} className="w-full will-change-transform">
          {current.scene}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1" aria-hidden>
          {chapters.map((chapter) => (
            <span key={chapter.id} className="h-1 w-4 overflow-hidden rounded-full bg-stone-500/20">
              <span
                data-scroll-story-indicator
                data-motion-mode={reduced === false ? "standard" : "instant"}
                className={`block h-full rounded-full bg-stone-800 dark:bg-white ${reduced === false ? `w-full origin-left transition-transform duration-150 ${chapter.id === effectiveActiveId ? "scale-x-100" : "scale-x-25"}` : chapter.id === effectiveActiveId ? "w-full" : "w-1/4"}`}
              />
            </span>
          ))}
        </div>
        <span role="status" className="sr-only">{current.title}</span>
      </div>
    </div>
  );
}
