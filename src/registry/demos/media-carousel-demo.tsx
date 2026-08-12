"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import {
  MediaCarousel,
  type MediaCarouselItem,
} from "@/registry/components/media-carousel";

type Story = Omit<MediaCarouselItem, "art"> & {
  art: (label: string, locale: "zh" | "en") => React.ReactNode;
  artLabel: { zh: string; en: string };
};

const stories: readonly Story[] = [
  {
    id: "atrium",
    eyebrow: "Architecture",
    title: "Quiet Geometry",
    description: "A study in light, rhythm and the spaces between objects.",
    meta: "04:12",
    artLabel: { zh: "蓝色建筑抽象构图", en: "Abstract blue architectural forms" },
    art: (label, locale) => (
      <div
        role="img"
        aria-label={label}
        className="relative size-full overflow-hidden bg-[#ededed]"
      >
        <div className="absolute inset-y-[12%] left-[9%] w-[36%] rounded-t-full bg-[#171717] " />
        <div className="absolute inset-y-[24%] right-[8%] w-[42%] rounded-[45%_8px_8px_45%] border border-white/60 bg-[#fafafa]/75 " />
        <div className="absolute bottom-[12%] left-[30%] h-[38%] w-px bg-[#292929]/24" />
        <span className="absolute bottom-[10%] right-[10%] font-mono text-[9px] uppercase tracking-[0.18em] text-[#292929]">
          {demoValue(locale, "卷 01", "Vol. 01")}
        </span>
      </div>
    ),
  },
  {
    id: "earth",
    eyebrow: "Materials",
    title: "Earth Register",
    description: "Clay, mineral and paper arranged as a tactile field note.",
    meta: "06:38",
    artLabel: { zh: "陶土与苔藓材质构图", en: "Clay and moss material composition" },
    art: (label, locale) => (
      <div
        role="img"
        aria-label={label}
        className="relative size-full overflow-hidden bg-[#e5e5e5]"
      >
        <div className="absolute -left-[8%] top-[12%] aspect-square w-[58%] rounded-full bg-[#525252] " />
        <div className="absolute bottom-[8%] right-[7%] h-[68%] w-[38%] rounded-[999px_999px_12px_12px] bg-[#737373]" />
        <div className="absolute left-[39%] top-[18%] h-[58%] w-[18%] rotate-[8deg] rounded-full border border-[#292929]/20 bg-[#fafafa]/80 " />
        <span className="absolute bottom-[10%] left-[10%] font-mono text-[9px] uppercase tracking-[0.18em] text-[#292929]">
          {demoValue(locale, "现场 07", "Field 07")}
        </span>
      </div>
    ),
  },
  {
    id: "signal",
    eyebrow: "Sound",
    title: "A Signal in Blue",
    description: "Synthetic tones translated into a restrained visual score.",
    meta: "03:49",
    artLabel: { zh: "深色声波构图", en: "Dark sound-wave composition" },
    art: (label, locale) => (
      <div
        role="img"
        aria-label={label}
        className="relative size-full overflow-hidden bg-[#171817]"
      >
        <div className="absolute inset-x-[8%] top-1/2 h-px bg-white/18" />
        <div className="absolute inset-x-[14%] top-[36%] flex h-[30%] items-center justify-between gap-1">
          {[18, 44, 70, 36, 86, 58, 28, 68, 42, 20, 54, 34].map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="w-px rounded-full bg-[#a3a3a3]"
              style={{ height: `${height}%`, opacity: 0.45 + index / 30 }}
            />
          ))}
        </div>
        <div className="absolute right-[9%] top-[12%] size-12 rounded-full border border-white/15 bg-white/[0.04]" />
        <span className="absolute bottom-[10%] left-[9%] font-mono text-[9px] uppercase tracking-[0.18em] text-white">
          {demoValue(locale, "频率 21", "Frequency 21")}
        </span>
      </div>
    ),
  },
  {
    id: "paper",
    eyebrow: "Edition",
    title: "Notes on Stillness",
    description: "Small observations from an unhurried afternoon.",
    meta: "08:05",
    artLabel: { zh: "编辑纸张构图", en: "Editorial paper composition" },
    art: (label, locale) => (
      <div
        role="img"
        aria-label={label}
        className="relative size-full overflow-hidden bg-[#e5e5e5]"
      >
        <div className="absolute inset-[11%_20%_10%_12%] rotate-[-4deg] rounded-[3px] border border-black/10 bg-[#fafafa] shadow-[0_4px_8px_-6px_rgba(41,41,41,0.5)]" />
        <div className="absolute left-[22%] top-[25%] h-px w-[34%] bg-[#292929]/65" />
        <div className="absolute left-[22%] top-[34%] h-px w-[48%] bg-[#292929]/18" />
        <div className="absolute left-[22%] top-[40%] h-px w-[43%] bg-[#292929]/18" />
        <div className="absolute bottom-[20%] right-[16%] size-[22%] rounded-full bg-[#525252] mix-blend-multiply" />
        <span className="absolute bottom-[10%] left-[9%] font-mono text-[9px] uppercase tracking-[0.18em] text-[#292929]">
          {demoValue(locale, "随笔 12", "Essay 12")}
        </span>
      </div>
    ),
  },
];

export function MediaCarouselDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh: Record<string, Pick<MediaCarouselItem, "eyebrow" | "title" | "description">> = {
    atrium: { eyebrow: "建筑", title: "安静几何", description: "关于光、节奏与物体间隙的研究。" },
    earth: { eyebrow: "材料", title: "大地档案", description: "陶土、矿物和纸张组成一页触感笔记。" },
    signal: { eyebrow: "声音", title: "蓝色信号", description: "把合成音色转成克制的视觉谱面。" },
    paper: { eyebrow: "辑刊", title: "静止札记", description: "一个缓慢下午里的细小观察。" },
  };
  const localized: MediaCarouselItem[] = stories.map(({ art, artLabel, ...item }) => ({
    ...item,
    ...(locale === "zh" ? zh[item.id] : {}),
    art: art(artLabel[locale], locale),
  }));
  return (
    <div role="group" aria-label={demoText("media-carousel", locale)} className="mx-auto w-full max-w-[520px]">
      <MediaCarousel
        items={localized}
        label={demoValue(locale, "精选故事", "Selected stories")}
        copy={locale === "zh" ? {
          collection: "选集",
          emptyCollection: "暂无故事",
          previousSlide: "上一张",
          nextSlide: "下一张",
          carouselRole: "轮播",
          slideRole: "幻灯片",
          position: (index, total) => `第 ${index} 张，共 ${total} 张`,
          instructions: "左右滑动或滚动浏览；焦点位于轮播时，可用左右方向键、Home 或 End 键切换。",
        } : undefined}
      />
    </div>
  );
}
