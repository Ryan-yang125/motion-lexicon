import { BeforeAfterSliderPrimitive } from "@/registry/primitives/before-after-slider";
import { PrimitiveDemoSurface, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

function Comparison({ locale, polished }: { locale: "zh" | "en"; polished?: boolean }) {
  return <div className={`size-full p-4 ${polished ? "bg-[#D8D2C8] dark:bg-[#34312D]" : "bg-stone-100 dark:bg-[#252522]"}`}><div className={`mx-auto h-full max-w-[260px] border p-3 ${polished ? "rounded-[12px] border-white/55 bg-white/80 shadow-[0_10px_20px_-16px_rgba(28,25,23,0.5)] dark:border-white/[0.1] dark:bg-black/15" : "rounded-[3px] border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900"}`}><span className={`block size-7 ${polished ? "rounded-[8px] bg-[#55745D]" : "bg-stone-300"}`} /><strong className="mt-4 block text-[11px]">{textFor(locale, "产品更新", "Product update")}</strong><i className={`mt-2 block h-1.5 w-4/5 ${polished ? "rounded-full bg-stone-300" : "bg-stone-200"}`} /><i className={`mt-1.5 block h-1.5 w-1/2 ${polished ? "rounded-full bg-stone-200" : "bg-stone-200"}`} /></div></div>;
}

export function BeforeAfterSliderDemo({ locale, values, compact }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "设计对比", "Design comparison")} meta="drag" compact={compact}>
      <BeforeAfterSliderPrimitive before={<Comparison locale={locale} />} after={<Comparison locale={locale} polished />} initialPosition={numberValue(values, "position", 50)} duration={numberValue(values, "duration", 180) / 1000} beforeLabel={textFor(locale, "调整前", "Before")} afterLabel={textFor(locale, "调整后", "After")} className="h-full rounded-[10px]" />
    </PrimitiveDemoSurface>
  );
}
