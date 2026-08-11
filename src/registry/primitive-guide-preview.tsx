import type { Locale, MotionRecipe } from "@/data/types";
import { text } from "@/data/site";
import { PrimitiveDemoSurface, ProductPanel, StatusPill, textFor } from "./primitive-demos/_shared";

const guideSteps: Record<string, { zh: string[]; en: string[] }> = {
  "frame-rate": {
    zh: ["记录一帧", "定位长任务", "确认合成层"],
    en: ["Record a frame", "Find long tasks", "Verify compositing"],
  },
  "purposeful-animation": {
    zh: ["确认目的", "判断频率", "检查空间来源"],
    en: ["Name the purpose", "Judge frequency", "Check spatial origin"],
  },
  "perceived-performance": {
    zh: ["即时响应", "持续进度", "明确完成"],
    en: ["Respond now", "Show progress", "Signal completion"],
  },
  "reduced-motion": {
    zh: ["移除位移", "保留状态", "验证等价结果"],
    en: ["Remove travel", "Preserve state", "Verify equal outcome"],
  },
};

export function PrimitiveGuidePreview({ locale, recipe, compact = false }: { locale: Locale; recipe: MotionRecipe; compact?: boolean }) {
  const steps = guideSteps[recipe.id]?.[locale] ?? guideSteps["purposeful-animation"][locale];
  return (
    <PrimitiveDemoSurface label={text(recipe.name, locale)} meta={textFor(locale, "指南", "guide")} compact={compact}>
      <div className="grid h-full place-items-center">
        <ProductPanel className="w-full max-w-[340px] p-3">
          <div className="mb-3 flex items-center justify-between"><strong className="text-[11px]">{textFor(locale, "评审路径", "Review path")}</strong><StatusPill>{textFor(locale, `${steps.length} 步`, `${steps.length} steps`)}</StatusPill></div>
          <ol className="m-0 grid list-none gap-1.5 p-0">
            {steps.map((step, index) => <li className="flex min-h-9 items-center gap-2.5 rounded-[8px] bg-stone-50 px-2.5 dark:bg-white/[0.04]" key={step}><span className="grid size-5 place-items-center rounded-[6px] bg-white text-[9px] text-stone-400 shadow-sm dark:bg-white/[0.07]">{index + 1}</span><strong className="text-[10.5px] font-medium">{step}</strong></li>)}
          </ol>
        </ProductPanel>
      </div>
    </PrimitiveDemoSurface>
  );
}
