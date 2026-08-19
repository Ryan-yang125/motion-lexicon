"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { ExpandingSearch } from "@/registry/components/expanding-search";

export function ExpandingSearchDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("expanding-search", locale)} className="w-full max-w-[440px] rounded-[18px] bg-[#efe8dc] p-4 dark:bg-[#211d1a]">
      <div className="mb-8 max-w-[250px] font-serif text-[25px] leading-[.95] tracking-[-.045em] text-[#4a2e25] dark:text-[#f0dfce]">{demoValue(locale, "收集值得回看的页面", "An archive worth returning to")}</div>
      <ExpandingSearch className="max-w-full" label={demoValue(locale, "搜索档案", "Search archive")} placeholder={demoValue(locale, "搜索文章、地点或作者", "Search essays, places, authors")} clearLabel={demoValue(locale, "清除搜索", "Clear search")} formatResults={locale === "zh" ? (count, query) => `${query} 有 ${count} 条结果` : undefined} />
      <div className="mt-8 flex gap-2 font-mono text-[9px] uppercase tracking-[.14em] text-[#866f5d]"><span>ESSAYS 214</span><span>FIELD NOTES 68</span></div>
    </div>
  );
}
