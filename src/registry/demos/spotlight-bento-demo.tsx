"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

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
  const items: readonly SpotlightBentoItem[] = [
    { id: "latency", label: demoValue(locale, "响应中位数", "Median response"), value: "34 ms", meta: demoValue(locale, "实时", "Live"), icon: pulse, tone: "blue" },
    { id: "regions", label: demoValue(locale, "活跃区域", "Active regions"), value: demoValue(locale, "12 个区域", "12 regions"), meta: "+2", icon: nodes, tone: "moss" },
    { id: "delivery", label: demoValue(locale, "成功送达", "Successful deliveries"), value: "99.98%", meta: demoValue(locale, "30 天", "30d"), icon: pulse, tone: "clay" },
    { id: "sessions", label: demoValue(locale, "当前会话", "Sessions now"), value: "8,492", meta: "+8%", icon: nodes, tone: "ink" },
  ];
  return (
    <div role="group" aria-label={demoText("spotlight-bento", locale)} className="mx-auto w-full max-w-[440px]">
      <SpotlightBento items={items} label={demoValue(locale, "网络概览", "Network overview")} />
    </div>
  );
}
