"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { MagneticAction } from "@/registry/components/magnetic-action";

export function MagneticActionDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("magnetic-action", locale)} className="relative grid w-full max-w-[420px] place-items-center overflow-hidden rounded-[10px] bg-[#ededed] px-6 py-12 dark:bg-[#202020]">
      <div aria-hidden className="absolute left-6 top-6 size-20 rounded-full border border-stone-900/10 dark:border-white/10" />
      <div aria-hidden className="absolute bottom-5 right-7 h-px w-24 bg-stone-900/15 dark:bg-white/15" />
      <MagneticAction onClick={() => undefined}>
        {demoValue(locale, "创建项目", "Start a project")}
        <span aria-hidden>↗</span>
      </MagneticAction>
    </div>
  );
}
