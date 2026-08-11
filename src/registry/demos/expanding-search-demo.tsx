"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { ExpandingSearch } from "@/registry/components/expanding-search";

export function ExpandingSearchDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("expanding-search", locale)} className="flex justify-center">
      <ExpandingSearch className="max-w-[240px]" label={demoValue(locale, "搜索", "Search")} placeholder={demoValue(locale, "搜索项目", "Search projects")} clearLabel={demoValue(locale, "清除搜索", "Clear search")} formatResults={locale === "zh" ? (count, query) => `${query} 有 ${count} 条结果` : undefined} />
    </div>
  );
}
