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
  height?: number;
  className?: string;
};

export function ScrollStory({ chapters, label, height = 360, className = "" }: ScrollStoryProps) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sections = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState<boolean | null>(null);

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
        const triggers = sections.current.flatMap((section, index) => {
          if (!section) return [];
          return ScrollTrigger.create({
            trigger: section,
            scroller: scroll,
            start: "top 58%",
            end: "bottom 42%",
            onToggle: ({ isActive }) => { if (isActive) setActive(index); },
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
  }, [active, reduced]);

  const current = chapters[active] ?? chapters[0];
  if (!current) return null;

  const scrollToChapter = (index: number) => {
    const scroll = scroller.current;
    const section = sections.current[index];
    if (!scroll || !section) return;
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
      aria-label={label}
      className={`grid w-full min-w-0 grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] overflow-hidden rounded-[18px] border border-stone-200 bg-white shadow-[0_18px_42px_-34px_rgba(28,25,23,.72)] dark:border-white/15 dark:bg-[#22221F] ${className}`}
      style={{ height }}
    >
      <div ref={scroller} className="overscroll-contain overflow-y-auto border-r border-stone-200 bg-[#F4F1EB] px-3 py-[38%] [scrollbar-width:none] dark:border-white/10 dark:bg-[#1C1C1A]">
        {chapters.map((chapter, index) => (
          <section
            key={chapter.id}
            ref={(node) => { sections.current[index] = node; }}
            className="grid min-h-[72%] content-center py-6"
          >
            <button
              type="button"
              aria-current={index === active ? "step" : undefined}
              onClick={() => scrollToChapter(index)}
              className={`min-h-11 rounded-[12px] px-3 py-2 text-left outline-none transition-[background-color,box-shadow,color] duration-150 focus-visible:shadow-[0_0_0_3px_rgba(69,104,255,.2)] ${index === active ? "bg-white text-stone-900 shadow-[0_8px_24px_-20px_rgba(28,25,23,.6)] dark:bg-white/10 dark:text-white" : "text-stone-500 hover:bg-white/55 dark:hover:bg-white/5"}`}
            >
              {chapter.eyebrow ? <span className="block text-[9px] uppercase tracking-[.1em] opacity-55">{chapter.eyebrow}</span> : null}
              <strong className="mt-1 block text-[12px] leading-tight">{chapter.title}</strong>
              {chapter.copy ? <span className="mt-1 block text-[10px] leading-relaxed opacity-65">{chapter.copy}</span> : null}
            </button>
          </section>
        ))}
      </div>
      <div className="relative grid min-w-0 place-items-center overflow-hidden bg-[#D9D4CB] p-4 dark:bg-[#2B2A27]">
        <div ref={stage} key={current.id} className="w-full will-change-transform">
          {current.scene}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1" aria-hidden>
          {chapters.map((chapter, index) => (
            <span key={chapter.id} className="h-1 w-4 overflow-hidden rounded-full bg-stone-500/20">
              <span
                data-scroll-story-indicator
                data-motion-mode={reduced === false ? "standard" : "instant"}
                className={`block h-full rounded-full bg-stone-800 dark:bg-white ${reduced === false ? `w-full origin-left transition-transform duration-150 ${index === active ? "scale-x-100" : "scale-x-25"}` : index === active ? "w-full" : "w-1/4"}`}
              />
            </span>
          ))}
        </div>
        <span role="status" className="sr-only">{current.title}</span>
      </div>
    </div>
  );
}
