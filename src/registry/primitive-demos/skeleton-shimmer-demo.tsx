import { SkeletonShimmerPrimitive } from "@/registry/primitives/skeleton-shimmer";
import { PrimitiveDemoSurface, ProductPanel, numberValue, textFor, type PrimitiveDemoProps } from "./_shared";

export function SkeletonShimmerDemo({ locale, values, compact }: PrimitiveDemoProps) {
  return (
    <PrimitiveDemoSurface label={textFor(locale, "项目载入", "Loading project")} meta="skeleton" compact={compact}>
      <div className="grid h-full place-items-center"><ProductPanel className="w-full max-w-[330px] space-y-2 p-3">{[0, 1, 2].map((row) => <SkeletonShimmerPrimitive key={row} duration={numberValue(values, "duration", 1400) / 1000} intensity={numberValue(values, "intensity", 14) / 100} className="flex min-h-11 items-center gap-3 rounded-[9px] bg-stone-50 px-2.5 dark:bg-white/[0.035]" label={textFor(locale, "正在载入项目", "Loading project")}><span className="size-7 rounded-[8px] bg-stone-200 dark:bg-white/[0.08]" /><span className="grid flex-1 gap-1.5"><i className="h-1.5 w-2/3 rounded-full bg-stone-200 dark:bg-white/[0.08]" /><i className="h-1 w-1/3 rounded-full bg-stone-100 dark:bg-white/[0.05]" /></span></SkeletonShimmerPrimitive>)}</ProductPanel></div>
    </PrimitiveDemoSurface>
  );
}
