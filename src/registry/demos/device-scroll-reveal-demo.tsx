"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { DeviceScrollReveal } from "@/registry/components/device-scroll-reveal";

function Screen({ kind, locale }: { kind: "map" | "plan" | "receipt"; locale: "zh" | "en" }) {
  if (kind === "map") return <div className="relative size-full overflow-hidden bg-[#dce7d2] p-5"><div className="absolute -left-8 top-8 size-36 rounded-full border-[22px] border-[#9dad86]" /><div className="absolute right-2 top-14 h-40 w-20 rotate-[28deg] rounded-full bg-[#e7c68d]" /><span className="relative rounded-full bg-[#2e4938] px-2 py-1 font-mono text-[8px] uppercase tracking-[.14em] text-white">{demoValue(locale, "今日路线", "Today’s route")}</span><div className="absolute bottom-7 left-5 right-5 rounded-[14px] bg-white/92 p-3 shadow-sm"><strong className="block text-[13px] text-[#23352a]">{demoValue(locale, "帕尔马花园", "Palma garden")}</strong><span className="mt-1 block text-[10px] text-[#6c7868]">1.8 km · 24 min</span></div></div>;
  if (kind === "plan") return <div className="size-full bg-[#f4f0e9] p-5"><span className="font-mono text-[8px] uppercase tracking-[.14em] text-stone-500">{demoValue(locale, "四月 18 日", "April 18")}</span><h4 className="mt-3 text-xl font-medium tracking-[-.05em] text-[#2c2c28]">A quiet day</h4><div className="mt-5 space-y-2">{["09:30 Market", "13:00 Table", "16:40 Coast"].map((item, index) => <div key={item} className={`rounded-xl p-2.5 text-[10px] ${index === 1 ? "bg-[#d88c63] text-white" : "border border-stone-200 text-stone-600"}`}>{item}</div>)}</div></div>;
  return <div className="size-full bg-[#283a32] p-5 text-[#fffaf0]"><span className="font-mono text-[8px] uppercase tracking-[.14em] text-[#d5bf91]">{demoValue(locale, "已保存", "Saved")}</span><div className="mt-10 rounded-[16px] bg-[#f4e6ca] p-4 text-[#2c392f]"><strong className="text-[17px] tracking-[-.04em]">18:42</strong><span className="mt-1 block text-[10px] text-[#637064]">Reservation confirmed</span><div className="mt-5 h-px bg-[#2c392f]/15" /><span className="mt-3 block font-mono text-[8px] uppercase tracking-[.14em]">PALMA / 04.18</span></div></div>;
}

export function DeviceScrollRevealDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <DeviceScrollReveal label={demoValue(locale, "设备滚动展示演示", "Device scroll reveal demo")} steps={[
    { id: "find", label: demoValue(locale, "发现", "Discover"), title: demoValue(locale, "从一个地点开始。", "Start with one place."), copy: demoValue(locale, "设备、内容和叙事保持在同一个连续的画面里。", "Device, content, and narrative stay in one continuous frame."), screen: <Screen kind="map" locale={locale} /> },
    { id: "shape", label: demoValue(locale, "编排", "Shape"), title: demoValue(locale, "把一天编成自己的节奏。", "Make the day your own rhythm."), copy: demoValue(locale, "切换步骤时，屏幕保留物理边界和阅读位置。", "Each step retains the physical boundary and reading position of the screen."), screen: <Screen kind="plan" locale={locale} /> },
    { id: "save", label: demoValue(locale, "确认", "Confirm"), title: demoValue(locale, "把决定留在手边。", "Keep the decision close."), copy: demoValue(locale, "完整状态在设备中落定，下一次操作保持明确。", "The complete state settles inside the device and leaves the next action clear."), screen: <Screen kind="receipt" locale={locale} /> },
  ]} />;
}
