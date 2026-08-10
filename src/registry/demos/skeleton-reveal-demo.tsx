"use client";

import { useState } from "react";
import { SkeletonReveal } from "@/registry/components/skeleton-reveal";

function SkeletonCard() {
  return (
    <div className="h-[178px] rounded-[13px] border border-stone-200 bg-white p-4 dark:border-white/[0.16] dark:bg-[#1D1D1A]">
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

function LoadedCard() {
  return (
    <div className="h-[178px] rounded-[13px] border border-stone-200 bg-white p-4 shadow-[0_6px_12px_-10px_rgba(28,25,23,0.5)] dark:border-white/[0.16] dark:bg-[#1D1D1A]">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-[10px] bg-[#55745D] text-[12px] font-semibold text-white">ML</span>
        <span className="min-w-0 flex-1">
          <strong className="block text-[13px] font-medium text-stone-800 dark:text-stone-100">Motion report</strong>
          <span className="mt-0.5 block text-[11.5px] text-stone-500 dark:text-stone-400">Last 7 days · updated now</span>
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[ ["2.8k", "Views"], ["184", "Copies"], ["96%", "Success"] ].map(([value, key]) => (
          <span key={key} className="grid h-14 content-center rounded-[9px] bg-stone-50 px-2.5 dark:bg-white/[0.06]">
            <strong className="text-[14px] font-semibold tabular-nums text-stone-800 dark:text-stone-100">{value}</strong>
            <small className="mt-0.5 text-[10.5px] text-stone-500 dark:text-stone-400">{key}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkeletonRevealDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="mb-3 flex justify-end">
        <button type="button" onClick={() => setLoading((value) => !value)} className="mat-cap press h-11 rounded-[9px] px-3.5 text-[12.5px] font-medium text-ink">
          {loading ? "Show content" : "Reload"}
        </button>
      </div>
      <SkeletonReveal loading={loading} skeleton={<SkeletonCard />} minHeight={178}>
        <LoadedCard />
      </SkeletonReveal>
    </div>
  );
}
