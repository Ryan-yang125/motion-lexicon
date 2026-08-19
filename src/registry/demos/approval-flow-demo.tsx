"use client";

import { ApprovalFlow } from "@/registry/components/approval-flow";
import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

export function ApprovalFlowDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <div role="group" aria-label={demoText("approval-flow", locale)} className="mx-auto w-full max-w-[430px]"><ApprovalFlow eyebrow={demoValue(locale, "执行前确认", "Approval required")} question={demoValue(locale, "允许 Agent 发布新的组件预览吗？", "Allow the agent to publish the new component preview?")} evidenceLabel={demoValue(locale, "执行依据", "Evidence")} evidence={locale === "zh" ? ["视觉检查已完成", "Registry 输出可安装"] : ["Visual review is complete", "Registry output is installable"]} approveLabel={demoValue(locale, "允许发布", "Approve publish")} dismissLabel={demoValue(locale, "取消", "Dismiss")} customPlaceholder={demoValue(locale, "补充发布要求", "Add publish instructions")} approvedLabel={demoValue(locale, "已经允许发布", "Publish approved")} reviewAgainLabel={demoValue(locale, "重新查看", "Review again")} recommendedLabel={demoValue(locale, "推荐", "Recommended")} options={locale === "zh" ? [{ id: "preview", label: "仅发布预览环境", description: "生成可分享地址，不影响生产", recommended: true }, { id: "production", label: "发布到生产环境", description: "通过检查后立即上线" }] : [{ id: "preview", label: "Preview environment only", description: "Create a shareable URL without touching production", recommended: true }, { id: "production", label: "Publish to production", description: "Go live immediately after checks" }]} /></div>;
}
