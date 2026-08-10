import { useState } from "react";
import { PageTransitionPrimitive, type PageTransitionDirection } from "@/registry/primitives/page-transition";
import { PrimitiveDemoSurface, ProductButton, ProductPanel, easingValue, numberValue, stringValue, textFor, type PrimitiveDemoProps } from "./_shared";

const pages = [
  { name: "Overview", tone: "bg-[#4568FF]" },
  { name: "Activity", tone: "bg-[#93664F]" },
  { name: "Files", tone: "bg-[#55745D]" },
];

export function PageTransitionDemo({ locale, values, compact }: PrimitiveDemoProps) {
  const [page, setPage] = useState(0);
  const current = pages[page];
  return (
    <PrimitiveDemoSurface label={textFor(locale, "项目空间", "Project space")} meta={current.name} compact={compact}>
      <ProductPanel className="flex h-full flex-col overflow-hidden">
        <nav className="flex min-h-9 items-center gap-1 border-b border-stone-100 px-2 dark:border-white/[0.08]">{pages.map((item, index) => <button className={`rounded-[6px] px-2 py-1 text-[9px] ${index === page ? "bg-stone-100 text-stone-800 dark:bg-white/[0.08] dark:text-stone-100" : "text-stone-400"}`} onClick={() => setPage(index)} key={item.name}>{item.name}</button>)}</nav>
        <div className="min-h-0 flex-1 overflow-hidden p-3"><PageTransitionPrimitive pageKey={page} direction={stringValue(values, "direction", "left") as PageTransitionDirection} distance={numberValue(values, "distance", 32)} duration={numberValue(values, "duration", 280) / 1000} easing={easingValue(values, "ease", "soft")} className="h-full"><div className={`h-full rounded-[10px] p-4 text-white ${current.tone}`}><span className="text-[9px] opacity-65">PROJECT / 04</span><strong className="mt-5 block text-[15px]">{current.name}</strong><p className="mt-1 text-[10px] opacity-70">{textFor(locale, "视图内容保持连续进入。", "The next view arrives with continuity.")}</p></div></PageTransitionPrimitive></div>
        {!compact ? <div className="hidden"><ProductButton>{textFor(locale, "下一页", "Next")}</ProductButton></div> : null}
      </ProductPanel>
    </PrimitiveDemoSurface>
  );
}
