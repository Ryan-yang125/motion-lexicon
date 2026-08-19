"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { OnboardingChecklist } from "@/registry/components/onboarding-checklist";

export function OnboardingChecklistDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <OnboardingChecklist title={demoValue(locale, "准备好发布", "Ready to publish")} items={[
    { id: "identity", title: demoValue(locale, "添加项目名称", "Add project name"), detail: demoValue(locale, "让团队快速找到它", "Make it easy to find"), complete: true },
    { id: "invite", title: demoValue(locale, "邀请一位协作者", "Invite a collaborator"), detail: demoValue(locale, "共同审阅下一步", "Review the next step together") },
    { id: "first", title: demoValue(locale, "创建第一份内容", "Create the first item"), detail: demoValue(locale, "从一个清晰的起点开始", "Begin with one clear starting point") },
  ]} />;
}
