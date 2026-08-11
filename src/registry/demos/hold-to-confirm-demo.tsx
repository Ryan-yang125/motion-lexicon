"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { HoldToConfirm } from "@/registry/components/hold-to-confirm";

export function HoldToConfirmDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("hold-to-confirm", locale)} className="flex justify-center">
      <HoldToConfirm
        onConfirm={() => {}}
        confirmLabel={demoValue(locale, "工作区已删除", "Workspace deleted")}
        hint={locale === "zh" ? "按住 1.8 秒确认；提前松开会取消操作。" : undefined}
      >
        {demoValue(locale, "按住删除工作区", "Hold to delete workspace")}
      </HoldToConfirm>
    </div>
  );
}
