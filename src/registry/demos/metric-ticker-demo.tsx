"use client";

import { useState } from "react";
import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { MetricTicker } from "@/registry/components/metric-ticker";

export function MetricTickerDemo({ locale = "en" }: DemoLocaleProps = {}) { const [value, setValue] = useState(12840); return <div className="rounded-[18px] bg-[#eef0ec] p-3"><MetricTicker label={demoValue(locale, "本月订阅", "Monthly subscribers")} value={value} delta={8.4} period={demoValue(locale, "较上月", "vs. last month")} /><button type="button" onClick={() => setValue((current) => current + 320)} className="mt-2 min-h-11 rounded-full border border-black/[.1] px-4 text-[11px] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#4568FF]">{demoValue(locale, "更新数据", "Update metric")}</button></div>; }
