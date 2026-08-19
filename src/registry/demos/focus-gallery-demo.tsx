"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { FocusGallery, type FocusGalleryItem } from "@/registry/components/focus-gallery";

const editions: readonly FocusGalleryItem[] = [
  { id: "harbor", title: "Harbor after rain", caption: "A field study in wet cobalt, rust and reflected traffic.", meta: "NORTH / 01", art: <div aria-hidden className="size-full bg-[#18445c]"><div className="h-full w-full bg-[radial-gradient(circle_at_73%_24%,#f1c06f_0_8%,transparent_8.5%),linear-gradient(145deg,transparent_0_42%,#d66745_42%_55%,transparent_55%),repeating-linear-gradient(0deg,rgba(255,255,255,.18)_0_1px,transparent_1px_16px)]" /></div> },
  { id: "orchard", title: "Orchard table", caption: "Late fruit, a linen fold and the last usable daylight.", meta: "NORTH / 02", art: <div aria-hidden className="relative size-full overflow-hidden bg-[#be5a42]"><span className="absolute -left-7 bottom-[-35%] size-[84%] rounded-full bg-[#f2c56b]" /><span className="absolute right-[17%] top-[20%] size-[34%] rounded-full bg-[#5b3035]" /><span className="absolute inset-x-0 bottom-[20%] h-[19%] bg-[#3f675f]" /></div> },
  { id: "night", title: "Night score", caption: "A violet radio signal measured against a sodium-orange line.", meta: "NORTH / 03", art: <div aria-hidden className="relative size-full overflow-hidden bg-[#211b42]"><span className="absolute -left-[12%] top-[18%] size-[76%] rounded-full border-[18px] border-[#9c7bff]" /><span className="absolute right-[17%] top-[18%] h-[62%] w-[9%] rounded-full bg-[#ff9a75]" /></div> },
];

export function FocusGalleryDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const localized = editions.map((item, index) => ({ ...item, title: locale === "zh" ? ["雨后的港湾", "果园餐桌", "夜间乐谱"][index] : item.title, caption: locale === "zh" ? ["湿润钴蓝、锈色与街灯倒影的现场研究。", "晚熟果实、亚麻折痕与最后的可用日光。", "紫色电台信号被放在钠灯橙线旁测量。 "][index] : item.caption }));
  return <div role="group" aria-label={demoText("focus-gallery", locale)} className="mx-auto w-full max-w-[600px]"><FocusGallery items={localized} label={demoValue(locale, "北岸秋季册", "Northline autumn issue")} /></div>;
}
