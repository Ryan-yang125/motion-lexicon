"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { MegaMenu } from "@/registry/components/mega-menu";

function Preview({ code, tone }: { code: string; tone: string }) {
  return <div className="relative grid size-24 place-items-center overflow-hidden rounded-[12px] bg-white/70 shadow-[0_20px_34px_-26px_rgba(28,25,23,.75)] dark:bg-white/10"><span className="absolute -right-5 -top-4 size-14 rounded-full bg-black/10" /><span className={`relative grid size-11 place-items-center rounded-[14px] text-[11px] font-semibold text-white ${tone}`}>{code}</span></div>;
}

export function MegaMenuDemo({ locale = "en" }: DemoLocaleProps = {}) {
  return (
    <div role="group" aria-label={demoText("mega-menu", locale)} className="flex min-h-[270px] w-full max-w-[440px] items-start rounded-[18px] bg-[#efe8dc] px-3 pt-5 dark:bg-[#211d1a]">
      <MegaMenu
        label={demoValue(locale, "产品导航", "Product navigation")}
        sections={[
          { id: "product", label: demoValue(locale, "产品", "Product"), preview: <Preview code="P" tone="bg-[#2457d6]" />, links: [{ id: "motion", label: demoValue(locale, "动效系统", "Motion system"), description: demoValue(locale, "组件与原子动效", "Components and primitives"), onSelect: () => undefined }, { id: "registry", label: demoValue(locale, "组件仓库", "Registry"), description: demoValue(locale, "一条命令安装", "Install with one command"), onSelect: () => undefined }] },
          { id: "solutions", label: demoValue(locale, "方案", "Solutions"), preview: <Preview code="S" tone="bg-[#bf6b31]" />, links: [{ id: "teams", label: demoValue(locale, "设计团队", "Design teams"), description: demoValue(locale, "共享动效语言", "Shared motion language"), onSelect: () => undefined }, { id: "agents", label: demoValue(locale, "AI 构建者", "AI builders"), description: demoValue(locale, "可直接交付的配方", "Production-ready recipes"), onSelect: () => undefined }] },
          { id: "resources", label: demoValue(locale, "资源", "Resources"), preview: <Preview code="R" tone="bg-[#3e7758]" />, links: [{ id: "guides", label: demoValue(locale, "场景指南", "Field guides"), description: demoValue(locale, "在场景中选择动效", "Motion decisions in context"), onSelect: () => undefined }, { id: "skill", label: "Agent Skill", description: demoValue(locale, "规划并编写动效", "Plan and write motion"), onSelect: () => undefined }] },
        ]}
      />
    </div>
  );
}
