"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import {
  FilterGrid,
  type FilterDefinition,
} from "@/registry/components/filter-grid";

type Asset = {
  id: string;
  name: string;
  kind: "image" | "clip" | "doc";
  size: string;
};

const ASSETS: Asset[] = [
  { id: "a1", name: "hero-wide", kind: "image", size: "2.4 MB" },
  { id: "a2", name: "onboarding", kind: "clip", size: "18 MB" },
  { id: "a3", name: "brand-deck", kind: "doc", size: "840 KB" },
  { id: "a4", name: "swatches", kind: "image", size: "410 KB" },
  { id: "a5", name: "changelog", kind: "doc", size: "22 KB" },
  { id: "a6", name: "teaser-cut", kind: "clip", size: "31 MB" },
  { id: "a7", name: "grid-study", kind: "image", size: "1.1 MB" },
  { id: "a8", name: "contract-v4", kind: "doc", size: "96 KB" },
  { id: "a9", name: "still-frame", kind: "image", size: "3.0 MB" },
];

export function FilterGridDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const filters: FilterDefinition<Asset>[] = [
    { id: "all", label: demoValue(locale, "全部", "All"), match: () => true },
    { id: "image", label: demoValue(locale, "图片", "Images"), match: (asset) => asset.kind === "image" },
    { id: "clip", label: demoValue(locale, "视频", "Clips"), match: (asset) => asset.kind === "clip" },
    { id: "doc", label: demoValue(locale, "文档", "Docs"), match: (asset) => asset.kind === "doc" },
  ];
  return (
    <div role="group" aria-label={demoText("filter-grid", locale)} className="mx-auto w-full max-w-[440px] rounded-[18px] bg-[#efe8dc] p-3 dark:bg-[#211d1a]"><div className="mb-3 flex items-end justify-between px-1"><div><p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#866f5d]">Studio library</p><h3 className="mt-1 font-serif text-[22px] leading-none tracking-[-.04em] text-[#482e25] dark:text-[#f0dfce]">{demoValue(locale, "秋季素材", "Autumn selects")}</h3></div><span className="font-mono text-[9px] text-[#866f5d]">09 ITEMS</span></div>
      <FilterGrid
        label={demoValue(locale, "素材类型", "Asset type")}
        items={ASSETS}
        filters={filters}
        emptyLabel={demoValue(locale, "没有符合条件的素材", "Nothing matches this filter")}
        formatFilterCount={locale === "zh" ? (label, count, total) => `${label}，${count} / ${total}` : undefined}
        formatResultCount={locale === "zh" ? (label, count, total) => `${label}：显示 ${count} / ${total}` : undefined}
        getKey={(a) => a.id}
        columns={3}
        rowHeight={64}
        renderItem={(a) => (
          <div className="relative flex h-full flex-col justify-between overflow-hidden">
            <span aria-hidden className={`absolute -right-3 -top-4 size-12 rounded-full opacity-80 ${a.kind === "image" ? "bg-[#d69a55]" : a.kind === "clip" ? "bg-[#4976bd]" : "bg-[#70996f]"}`} />
            <p className="relative truncate text-[12.5px] font-medium text-ink">{a.name}</p>
            <p className="relative meta text-ink-3">{a.kind.toUpperCase()} · {a.size}</p>
          </div>
        )}
      />
    </div>
  );
}
