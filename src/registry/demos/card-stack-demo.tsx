"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import { CardStack, type CardStackItem } from "@/registry/components/card-stack";

const stories: readonly CardStackItem[] = [
  { id: "0", title: "The last ferry", description: "A quiet route across the estuary, recorded over three November evenings.", meta: "FIELD / 01", art: <div aria-hidden className="size-full bg-[linear-gradient(145deg,#143e55_0_36%,#e4975f_36%_40%,#163039_40%_100%)]" /> },
  { id: "1", title: "Green room", description: "A small archive of rehearsal notes, wet paint and stage light.", meta: "FIELD / 02", art: <div aria-hidden className="size-full bg-[radial-gradient(circle_at_78%_25%,#efbd6a_0_9%,transparent_9.5%),linear-gradient(135deg,#2a564d,#173438)]" /> },
  { id: "2", title: "A slow signal", description: "A radio station at 2:17 AM, keeping its one surviving frequency warm.", meta: "FIELD / 03", art: <div aria-hidden className="size-full bg-[repeating-linear-gradient(90deg,transparent_0_28px,rgba(202,178,255,.14)_28px_29px),linear-gradient(135deg,#271b48,#17283b)]" /> },
];

export function CardStackDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const localized = stories.map((item, index) => ({ ...item, title: locale === "zh" ? ["最后一班渡轮", "绿色房间", "缓慢的信号"][index] : item.title, description: locale === "zh" ? ["穿过河口的一条安静航线，被记录在十一月的三个夜晚。", "一份排练笔记、湿漆与舞台灯的微型档案。", "凌晨两点十七分，一家电台仍为最后的频率留着温度。 "][index] : item.description }));
  return <div role="group" aria-label={demoText("card-stack", locale)} className="mx-auto w-full max-w-[500px]"><CardStack items={localized} label={demoValue(locale, "夜班读物", "Night shift reader")} /></div>;
}
