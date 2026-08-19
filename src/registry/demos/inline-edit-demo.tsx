"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { InlineEdit } from "@/registry/components/inline-edit";

export function InlineEditDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <InlineEdit label={demoValue(locale, "项目名称", "Project name")} value={demoValue(locale, "沿海读本", "Coastal reader")} onSave={() => new Promise<void>((resolve) => window.setTimeout(resolve, 360))} />;
}
