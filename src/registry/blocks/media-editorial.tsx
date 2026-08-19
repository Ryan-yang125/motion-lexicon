"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CinematicHero } from "@/registry/components/cinematic-hero";
import {
  FocusGallery,
  type FocusGalleryItem,
} from "@/registry/components/focus-gallery";
import { KineticHeading } from "@/registry/components/kinetic-heading";
import { ScrollStory } from "@/registry/components/scroll-story";

type Locale = "zh" | "en";
export type MediaEditorialBlockProps = { locale?: Locale; className?: string };

const art = (tone: string, accent: string) => (
  <div aria-hidden className={`relative size-full overflow-hidden ${tone}`}>
    <span
      className={`absolute -left-[8%] bottom-[-34%] size-[78%] rounded-full border-[18px] ${accent}`}
    />
    <span className="absolute right-[18%] top-[15%] h-[68%] w-[9%] rounded-full bg-[#e06d4a]" />
    <span className="absolute inset-x-0 bottom-[19%] h-px bg-white/70" />
  </div>
);

export function MediaEditorialBlock({
  locale = "en",
  className = "",
}: MediaEditorialBlockProps) {
  const reduced = useReducedMotion() === true;
  const [joined, setJoined] = useState(false);
  const copy = locale === "zh" ? zh : en;
  const gallery: readonly FocusGalleryItem[] = [
    {
      id: "harbour",
      title: copy.harbour,
      caption: copy.harbourCopy,
      meta: "NORTH / 01",
      art: art("bg-[#18475e]", "border-[#efbd6c]"),
    },
    {
      id: "orchard",
      title: copy.orchard,
      caption: copy.orchardCopy,
      meta: "NORTH / 02",
      art: art("bg-[#b85a43]", "border-[#f2c06c]"),
    },
    {
      id: "signal",
      title: copy.signal,
      caption: copy.signalCopy,
      meta: "NORTH / 03",
      art: art("bg-[#29204c]", "border-[#b69aff]"),
    },
  ];
  return (
    <motion.section
      data-page-block="media-editorial"
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.28 }}
      className={`w-full overflow-hidden rounded-[18px] border border-[#4b3526]/15 bg-[#f4ead9] text-[#2e251d] ${className}`}
    >
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-[#4b3526]/12 px-5 sm:px-8">
        <a
          href="#editorial-home"
          className="flex min-h-11 items-center gap-2 font-serif text-[22px] tracking-[-.06em] outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff]"
        >
          Northline{" "}
          <span className="font-mono text-[9px] tracking-[.16em]">JOURNAL</span>
        </a>
        <nav
          aria-label={copy.navigation}
          className="hidden gap-4 text-[11px] font-medium text-[#745f4b] md:flex"
        >
          <a href="#editorial-stories">{copy.stories}</a>
          <a href="#editorial-gallery">{copy.gallery}</a>
          <a href="#editorial-letter">{copy.letter}</a>
        </nav>
        <button
          type="button"
          onClick={() => setJoined(true)}
          className="min-h-11 rounded-full bg-[#2f251b] px-4 text-[11px] font-semibold text-[#fff2de] outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff]"
        >
          {joined ? copy.joined : copy.subscribe}
        </button>
      </header>
      <div id="editorial-home" className="p-4 sm:p-6 lg:p-8">
        <CinematicHero
          eyebrow={copy.issue}
          title={copy.title}
          description={copy.intro}
          actionLabel={copy.read}
          art={art(
            "bg-[linear-gradient(126deg,#17475f_0_44%,#d96847_44%_50%,#395b50_50%)]",
            "border-[#f0bd68]",
          )}
        />
        <section
          id="editorial-stories"
          className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(260px,.82fr)]"
        >
          <div>
            <span className="font-mono text-[9px] tracking-[.16em] text-[#80674e]">
              {copy.featured}
            </span>
            <KineticHeading
              text={copy.headline}
              label={copy.featured}
              detail={copy.body}
              className="mt-3"
            />
            <div className="mt-6 flex items-center gap-3 border-y border-[#4b3526]/12 py-4">
              <span className="grid size-9 place-items-center rounded-full bg-[#31546a] font-serif text-white">
                N
              </span>
              <span>
                <strong className="block text-[11px]">Mina Alvarez</strong>
                <span className="text-[9px] text-[#80674e]">{copy.byline}</span>
              </span>
            </div>
          </div>
          <ScrollStory
            label={copy.storyLabel}
            height={360}
            chapters={[
              {
                id: "arrive",
                eyebrow: "01",
                title: copy.arrive,
                copy: copy.arriveCopy,
                scene: art("bg-[#20475b]", "border-[#f0bd68]"),
              },
              {
                id: "listen",
                eyebrow: "02",
                title: copy.listen,
                copy: copy.listenCopy,
                scene: art("bg-[#703d3f]", "border-[#f2c06c]"),
              },
              {
                id: "return",
                eyebrow: "03",
                title: copy.return,
                copy: copy.returnCopy,
                scene: art("bg-[#2d2859]", "border-[#bba8ff]"),
              },
            ]}
          />
        </section>
        <section id="editorial-gallery" className="mt-10">
          <FocusGallery items={gallery} label={copy.galleryLabel} />
        </section>
        <section
          id="editorial-letter"
          className="mt-8 grid gap-4 border-t border-[#4b3526]/12 pt-8 sm:grid-cols-[1fr_auto] sm:items-end"
        >
          <div>
            <span className="font-mono text-[9px] tracking-[.16em] text-[#80674e]">
              {copy.letter}
            </span>
            <h2 className="mt-2 max-w-[18ch] font-serif text-[30px] leading-[.9] tracking-[-.06em]">
              {copy.letterTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setJoined(true)}
            className="min-h-11 rounded-full border border-[#4b3526]/20 bg-[#fff6e9] px-4 text-[11px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff]"
          >
            {joined ? copy.joined : copy.subscribe}
          </button>
        </section>
      </div>
    </motion.section>
  );
}
const en = {
  navigation: "Journal navigation",
  stories: "Stories",
  gallery: "Gallery",
  letter: "Letter",
  subscribe: "Subscribe",
  joined: "Subscribed",
  issue: "NORTHLINE / AUTUMN 2026",
  title: "Listen between tides",
  intro:
    "A visual journal of harbour light, late ferries and the frequencies that remain after midnight.",
  read: "Read the issue",
  featured: "FEATURED STORY",
  headline: "A harbour keeps its own weather.",
  body: "For three November evenings, we followed the last crossing from the old breakwater to the edge of the city. The route is short; the light never repeats itself.",
  byline: "Words and images · 8 min read",
  storyLabel: "Harbour story",
  arrive: "Arrive",
  arriveCopy: "The ferry leaves before the street lamps settle.",
  listen: "Listen",
  listenCopy: "Wind makes a radio of every railing.",
  return: "Return",
  returnCopy: "The same coast becomes a different page.",
  galleryLabel: "Field studies",
  harbour: "Harbour after rain",
  harbourCopy: "Wet cobalt, rust and reflected traffic.",
  orchard: "Orchard table",
  orchardCopy: "Late fruit, linen and the last usable daylight.",
  signal: "Night score",
  signalCopy: "An ultraviolet pulse against a sodium-orange line.",
  letterTitle: "One new field note, sent when it is ready.",
};
const zh = {
  navigation: "刊物导航",
  stories: "故事",
  gallery: "画廊",
  letter: "来信",
  subscribe: "订阅",
  joined: "已订阅",
  issue: "北岸 / 2026 秋季册",
  title: "在潮汐之间聆听",
  intro: "一本关于港湾光线、末班渡轮与午夜后仍在回响的频率的影像日记。",
  read: "阅读本期",
  featured: "本期特写",
  headline: "港湾拥有自己的天气。",
  body: "连续三个十一月夜晚，我们跟随最后一班渡轮，从旧防波堤抵达城市边缘。航线很短，光线从未重复。",
  byline: "文字与影像 · 阅读约 8 分钟",
  storyLabel: "港湾故事",
  arrive: "抵达",
  arriveCopy: "街灯尚未安定，渡轮已经离岸。",
  listen: "聆听",
  listenCopy: "每一段栏杆都被风吹成电台。",
  return: "返回",
  returnCopy: "同一片海岸成为另一张页面。",
  galleryLabel: "现场研究",
  harbour: "雨后的港湾",
  harbourCopy: "湿润钴蓝、锈色与街灯倒影。",
  orchard: "果园餐桌",
  orchardCopy: "晚熟果实、亚麻与最后的可用日光。",
  signal: "夜间乐谱",
  signalCopy: "紫外脉冲停留在钠灯橙线旁。",
  letterTitle: "一则新的现场笔记，在它准备好时抵达。",
};
