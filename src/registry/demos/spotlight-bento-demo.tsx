"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { useState } from "react";
import { SpotlightBento, type SpotlightBentoItem } from "@/registry/components/spotlight-bento";

const pulse = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
    <path d="M3 10h3l1.4-4 3.2 8 1.5-4H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const nodes = (
  <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden>
    <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="11" cy="15" r="2" stroke="currentColor" strokeWidth="1.4" />
    <path d="m6.8 6.2 6.2-.8M6.2 7.8l3.6 5.6m3-6.6-1.2 6.3" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export function SpotlightBentoDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [selectedId, setSelectedId] = useState("latency");
  const items: readonly SpotlightBentoItem[] = [
    { id: "latency", label: demoValue(locale, "黎明前的投稿", "Before-dawn submissions"), value: "34", meta: demoValue(locale, "本周", "This week"), icon: pulse, tone: "blue" },
    { id: "regions", label: demoValue(locale, "正在校样的城市", "Cities in proof"), value: demoValue(locale, "12 个城市", "12 cities"), meta: "+2", icon: nodes, tone: "moss" },
    { id: "delivery", label: demoValue(locale, "印刷完成", "Prints approved"), value: "99.98%", meta: demoValue(locale, "第 08 册", "Issue 08"), icon: pulse, tone: "clay" },
    { id: "sessions", label: demoValue(locale, "夜间读者", "Night readers"), value: "8,492", meta: "+8%", icon: nodes, tone: "ink" },
  ];
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  return (
    <div role="group" aria-label={demoText("spotlight-bento", locale)} className="mx-auto w-full max-w-[440px]">
      <SpotlightBento
        items={items}
        label={demoValue(locale, "北岸印刷厂 · 读者信号", "Northline Press · Reader signals")}
        selectedId={selectedId}
        onSelect={(item) => setSelectedId(item.id)}
      />
      <span className="sr-only" role="status" aria-live="polite">
        {demoValue(locale, `已选择${selected.label}`, `${selected.label} selected`)}
      </span>
    </div>
  );
}
