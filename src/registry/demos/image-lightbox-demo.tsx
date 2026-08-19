"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import {
  ImageLightbox,
  type ImageLightboxItem,
} from "@/registry/components/image-lightbox";

const works: readonly ImageLightboxItem[] = [
  {
    id: "interval",
    title: "Saltwater / 01",
    caption: "A tide study from the North Sea, printed in ink blue and burnt orange.",
    meta: "N–01",
    art: (
      <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#184258]">
        <div className="absolute -left-[8%] bottom-[-42%] size-[126%] rounded-full border-[20px] border-[#eac486]" />
        <div className="absolute inset-y-0 left-[38%] w-[3px] bg-[#ff7d51]" />
        <span className="absolute right-[10%] top-[9%] font-mono text-[8px] tracking-[0.16em] text-[#fff1d5]/70">NORTH / 24</span>
      </div>
    ),
  },
  {
    id: "field",
    title: "Fruit at Dusk",
    caption: "A still life from the studio kitchen; pomegranate, linen and a blue hour wall.",
    meta: "N–02",
    art: (
      <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#d96f4d]">
        <div className="absolute -left-[8%] bottom-[-30%] size-[86%] rounded-full bg-[#f2c76f]" />
        <div className="absolute right-[16%] top-[19%] size-[38%] rounded-full bg-[#642e39] shadow-[inset_-12px_-8px_0_rgba(0,0,0,.12)]" />
        <div className="absolute inset-x-0 bottom-[18%] h-[18%] bg-[#294962]" />
      </div>
    ),
  },
  {
    id: "nocturne",
    title: "Night Frequency",
    caption: "An after-hours radio score, marked in ultraviolet and sodium light.",
    meta: "N–03",
    art: (
      <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#191737]">
        <div className="absolute -left-[10%] top-[12%] size-[74%] rounded-full border-[16px] border-[#9979ff]" />
        <div className="absolute right-[12%] top-[18%] h-[60%] w-[10%] rounded-full bg-[#ff9478]" />
        <div className="absolute bottom-[19%] right-[9%] h-px w-[48%] bg-[#e8ddff]/70" />
      </div>
    ),
  },
  {
    id: "fold",
    title: "Folded Weather",
    caption: "Hand-cut color fields set into a warm paper volume.",
    meta: "S–01",
    art: (
      <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#e5c39e]">
        <div className="absolute inset-[12%_18%] -rotate-3 bg-[#f8ead0] shadow-[0_24px_42px_-24px_rgba(41,41,41,0.65)]" />
        <div className="absolute left-[24%] top-[29%] h-[38%] w-[38%] bg-[#385b55] [clip-path:polygon(0_0,100%_0,45%_100%)]" />
        <div className="absolute bottom-[18%] right-[17%] size-[23%] rounded-full bg-[#d85c3c] mix-blend-multiply" />
      </div>
    ),
  },
  {
    id: "trace",
    title: "Garden Margin",
    caption: "A close crop of verbena against wet stone and a hand-painted frame.",
    meta: "S–02",
    art: (
      <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#54725d]">
        <div className="absolute bottom-[-12%] left-[28%] h-[112%] w-[30%] rotate-[28deg] rounded-full bg-[#c3db8f]" />
        <div className="absolute right-[13%] top-[18%] size-[30%] rounded-full border-[10px] border-[#f2d1a8] bg-[#6c3f3e]" />
        <div className="absolute bottom-[14%] left-[10%] h-px w-[26%] bg-[#f5e7d2]/70" />
      </div>
    ),
  },
  {
    id: "aperture",
    title: "Tangerine Lens",
    caption: "A large-format optical study with a cobalt field and an exposed edge.",
    meta: "S–03",
    art: (
      <div aria-hidden="true" className="relative size-full overflow-hidden bg-[#155481]">
        <div className="absolute left-[13%] top-[15%] size-[56%] rounded-full bg-[#f0a341]" />
        <div className="absolute bottom-[11%] right-[12%] size-[52%] rounded-full border-[10px] border-[#ffc875] bg-[#893f54]/80 mix-blend-multiply" />
        <div className="absolute left-[34%] top-[35%] size-[18%] rounded-full border border-white/45 bg-white/10" />
      </div>
    ),
  },
];

export function ImageLightboxDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const zh: Record<string, Pick<ImageLightboxItem, "title" | "caption">> = {
    interval: { title: "盐水 / 01", caption: "一张来自北海的潮汐研究，以墨蓝和焦橙印刷。" },
    field: { title: "暮色果实", caption: "工作室厨房的静物：石榴、亚麻和蓝调时刻的墙面。" },
    nocturne: { title: "夜间频率", caption: "一份深夜电台乐谱，以紫外和钠灯色标记。" },
    fold: { title: "折叠的天气", caption: "手工裁切的色块被置入温暖的纸张体积。" },
    trace: { title: "花园留白", caption: "马鞭草的近景，背后是湿石与手绘边框。" },
    aperture: { title: "橘色镜头", caption: "大画幅光学研究，带有钴蓝平面与外露边缘。" },
  };
  const localized = locale === "zh" ? works.map((item) => ({ ...item, ...zh[item.id] })) : works;
  return (
    <div role="group" aria-label={demoText("image-lightbox", locale)} className="mx-auto w-full max-w-[520px]">
      <ImageLightbox
        items={localized}
        label={demoValue(locale, "北岸印刷厂 · 秋季册", "Northline Press · Autumn issue")}
        copy={locale === "zh" ? {
          gallery: "画廊",
          works: (count) => `${String(count).padStart(2, "0")} 件作品`,
          empty: "画廊中暂无作品",
          open: (title) => `打开${title}`,
          close: "关闭画廊",
          previous: "上一张图片",
          next: "下一张图片",
        } : undefined}
      />
    </div>
  );
}
