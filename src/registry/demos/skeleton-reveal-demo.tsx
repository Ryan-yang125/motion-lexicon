"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";
import type { Locale } from "@/data/types";

import { useState } from "react";
import { SkeletonReveal } from "@/registry/components/skeleton-reveal";

function SkeletonCard() {
  return (
    <div className="h-[178px] rounded-[10px] border border-stone-200 bg-white p-4 dark:border-white/[0.16] dark:bg-[#1b1b1b]">
      <div className="flex items-center gap-3">
        <span className="size-10 rounded-[10px] bg-stone-200/80 dark:bg-white/10" />
        <span className="grid flex-1 gap-2">
          <span className="h-3 w-2/5 rounded-[4px] bg-stone-200/80 dark:bg-white/10" />
          <span className="h-2.5 w-3/5 rounded-[4px] bg-stone-100 dark:bg-white/[0.07]" />
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((item) => <span key={item} className="h-14 rounded-[9px] bg-stone-100 dark:bg-white/[0.06]" />)}
      </div>
    </div>
  );
}

function LoadedCard({ locale }: { locale: Locale }) {
  return (
    <div className="h-[178px] rounded-[10px] border border-stone-200 bg-white p-4 shadow-[0_6px_12px_-10px_rgba(28,25,23,0.5)] dark:border-white/[0.16] dark:bg-[#1b1b1b]">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-[10px] bg-[#171717] text-[12px] font-semibold text-white">AR</span>
        <span className="min-w-0 flex-1">
          <strong className="block text-[13px] font-medium text-stone-800 dark:text-stone-100">{demoValue(locale, "Agent 运行报告", "Agent run report")}</strong>
          <span className="mt-0.5 block text-[11.5px] text-stone-500 dark:text-stone-400">{demoValue(locale, "产品界面任务 · 刚刚完成", "Product UI task · completed now")}</span>
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[ ["14", demoValue(locale, "文件", "Files")], ["38", demoValue(locale, "检查", "Checks")], ["100%", demoValue(locale, "通过", "Passed")] ].map(([value, key]) => (
          <span key={key} className="grid h-14 content-center rounded-[9px] bg-stone-50 px-2.5 dark:bg-white/[0.06]">
            <strong className="text-[14px] font-semibold tabular-nums text-stone-800 dark:text-stone-100">{value}</strong>
            <small className="mt-0.5 text-[10.5px] text-stone-500 dark:text-stone-400">{key}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkeletonRevealDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const [loading, setLoading] = useState(true);

  return (
    <div role="group" aria-label={demoText("skeleton-reveal", locale)} className="mx-auto w-full max-w-[380px] rounded-[16px] bg-[#f5ead9] p-3">
      <div className="mb-3 flex justify-end">
        <button type="button" onClick={() => setLoading((value) => !value)} className="mat-cap press h-11 rounded-[9px] px-3.5 text-[12.5px] font-medium text-ink">
          {loading ? demoValue(locale, "显示内容", "Show content") : demoValue(locale, "重新加载", "Reload")}
        </button>
      </div>
      <SkeletonReveal loading={loading} skeleton={<SkeletonCard />} minHeight={178} label={demoValue(locale, "Agent 运行报告", "Agent run report")} loadingLabel={demoValue(locale, "正在汇总运行证据", "Collecting run evidence")} loadedLabel={demoValue(locale, "运行报告已加载", "Run report loaded")}>
        <LoadedCard locale={locale} />
      </SkeletonReveal>
    </div>
  );
}
