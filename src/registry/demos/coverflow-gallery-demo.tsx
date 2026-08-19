"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { CoverflowGallery, type CoverflowGalleryItem } from "@/registry/components/coverflow-gallery";

const tracks: readonly CoverflowGalleryItem[] = [
  { id: "tide", title: "Tide receiver", caption: "Salt, vinyl and a receiving mast.", meta: "A / 01", art: <div aria-hidden className="size-full bg-[radial-gradient(circle_at_70%_22%,#f0ae65_0_11%,transparent_11.5%),linear-gradient(135deg,#1b5a76,#1f234c)]" /> },
  { id: "glass", title: "Glass harbour", caption: "A blue room built for a slow chorus.", meta: "A / 02", art: <div aria-hidden className="size-full bg-[linear-gradient(125deg,#d66744_0_38%,#f3cc8b_38%_44%,#234e64_44%)]" /> },
  { id: "sleeper", title: "Sleeper signal", caption: "One ultraviolet pulse in a dark field.", meta: "A / 03", art: <div aria-hidden className="size-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.16)_0_1px,transparent_1px_18px),linear-gradient(135deg,#33205d,#141a38)]" /> },
  { id: "moss", title: "Moss station", caption: "A low frequency for wet trees.", meta: "A / 04", art: <div aria-hidden className="size-full bg-[radial-gradient(circle_at_31%_72%,#e7c276_0_9%,transparent_9.5%),linear-gradient(135deg,#284d47,#6f8d68)]" /> },
];

export function CoverflowGalleryDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const localized = tracks.map((item, index) => ({ ...item, title: locale === "zh" ? ["潮汐接收器", "玻璃港湾", "睡眠信号", "苔藓车站"][index] : item.title }));
  return <div role="group" aria-label={demoText("coverflow-gallery", locale)} className="mx-auto w-full max-w-[560px]"><CoverflowGallery items={localized} label={demoValue(locale, "夜间收听室", "Night listening room")} /></div>;
}
