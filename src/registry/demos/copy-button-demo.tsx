"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { CopyButton } from "@/registry/components/copy-button";

export function CopyButtonDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("copy-button", locale)} className="flex justify-center">
      <CopyButton value="npx interior add copy-button" label={demoValue(locale, "复制", "Copy")} copiedLabel={demoValue(locale, "已复制", "Copied")} errorLabel={demoValue(locale, "复制失败", "Failed")} />
    </div>
  );
}
