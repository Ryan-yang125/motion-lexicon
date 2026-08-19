"use client";

import { demoValue, type DemoLocaleProps } from "../demo-locale";
import { AnimatedCombobox } from "@/registry/components/animated-combobox";

export function AnimatedComboboxDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return <div className="min-h-[240px] rounded-[18px] bg-[#f0eee9] p-5"><AnimatedCombobox label={demoValue(locale, "选择项目", "Choose a project")} placeholder={demoValue(locale, "搜索项目", "Search projects")} options={[
    { id: "atelier", label: demoValue(locale, "春季工作室", "Spring atelier"), detail: demoValue(locale, "今天更新", "Updated today") },
    { id: "edition", label: demoValue(locale, "第六期刊物", "Edition six"), detail: demoValue(locale, "8 位协作者", "8 collaborators") },
    { id: "coast", label: demoValue(locale, "海岸研究", "Coastal study"), detail: demoValue(locale, "上周更新", "Updated last week") },
  ]} /></div>;
}
