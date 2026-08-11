"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { Pagination } from "@/registry/components/pagination";

export function PaginationDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("pagination", locale)} className="grid w-full place-items-center">
      <Pagination count={12} defaultPage={1} label={demoValue(locale, "搜索结果", "Search results")} previousLabel={demoValue(locale, "上一页", "Previous page")} nextLabel={demoValue(locale, "下一页", "Next page")} pageLabel={locale === "zh" ? (page) => `第 ${page} 页` : undefined} statusLabel={locale === "zh" ? (page, count) => `第 ${page} 页，共 ${count} 页` : undefined} />
    </div>
  );
}
