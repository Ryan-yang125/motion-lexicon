"use client";

import { MagneticAction } from "@/registry/components/magnetic-action";

export function MagneticActionDemo() {
  return (
    <div className="relative grid w-full max-w-[420px] place-items-center overflow-hidden rounded-[18px] bg-[#DDD7CD] px-6 py-12 dark:bg-[#292825]">
      <div aria-hidden className="absolute left-6 top-6 size-20 rounded-full border border-stone-900/10 dark:border-white/10" />
      <div aria-hidden className="absolute bottom-5 right-7 h-px w-24 bg-stone-900/15 dark:bg-white/15" />
      <MagneticAction onClick={() => undefined}>
        Start a project
        <span aria-hidden>↗</span>
      </MagneticAction>
    </div>
  );
}
