"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { MagneticAction } from "@/registry/components/magnetic-action";

export function MagneticActionDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("magnetic-action", locale)} className="relative grid w-full max-w-[420px] place-items-center overflow-hidden rounded-[16px] bg-[#315d5b] px-6 py-12 text-[#fff3dd]">
      <div aria-hidden className="absolute left-6 top-6 size-20 rounded-full border border-white/25" />
      <div aria-hidden className="absolute bottom-5 right-7 h-px w-24 bg-[#f5c270]/65" />
      <MagneticAction onClick={() => undefined}>
        {demoValue(locale, "创建项目", "Start a project")}
        <span aria-hidden>↗</span>
      </MagneticAction>
    </div>
  );
}
