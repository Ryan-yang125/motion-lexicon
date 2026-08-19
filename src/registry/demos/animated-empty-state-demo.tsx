"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { AnimatedEmptyState } from "@/registry/components/animated-empty-state";

export function AnimatedEmptyStateDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <AnimatedEmptyState title={demoValue(locale, "把第一个片段放进来。", "Add the first fragment.")} description={demoValue(locale, "新的内容会自然接入这个已预留好的工作表面。", "New content settles into a prepared working surface.")} actionLabel={demoValue(locale, "创建片段", "Create fragment")} onAction={() => new Promise<void>((resolve) => window.setTimeout(resolve, 420))} />;
}
