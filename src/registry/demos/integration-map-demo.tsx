"use client";

import { demoText, demoValue, type DemoLocaleProps } from "../demo-locale";

import { IntegrationMap } from "@/registry/components/integration-map";

const edges = [
  { from: "figma", to: "motion" },
  { from: "github", to: "motion" },
  { from: "motion", to: "web" },
  { from: "motion", to: "skill" },
];

export function IntegrationMapDemo({ locale = "en" }: DemoLocaleProps = {}) {
  const nodes = [
    { id: "figma", label: "Figma", meta: demoValue(locale, "设计", "Design"), x: 62, y: 52, tone: "clay" as const },
    { id: "github", label: "GitHub", meta: demoValue(locale, "源码", "Source"), x: 62, y: 164, tone: "neutral" as const },
    { id: "motion", label: "Motion", meta: demoValue(locale, "组件仓库", "Registry"), x: 220, y: 108, tone: "blue" as const },
    { id: "web", label: demoValue(locale, "网站", "Website"), meta: demoValue(locale, "预览", "Preview"), x: 378, y: 52, tone: "moss" as const },
    { id: "skill", label: "Agent Skill", meta: demoValue(locale, "生成", "Generate"), x: 378, y: 164, tone: "clay" as const },
  ];
  return (
    <div role="group" aria-label={demoText("integration-map", locale)} className="dark mx-auto flex h-[270px] w-full max-w-[440px] flex-col rounded-[18px] bg-[#0c1017] p-3 text-white"><div className="flex items-center justify-between px-2 pt-1 font-mono text-[9px] uppercase tracking-[.15em] text-white/45"><span>Control plane</span><span className="text-emerald-300">5 live</span></div>
      <IntegrationMap
        nodes={nodes}
        edges={edges}
        label={demoValue(locale, "集成关系图", "Integration map")}
        emptyLabel={demoValue(locale, "暂无集成", "No integrations available")}
        formatStatus={locale === "zh" ? (label) => `已突出显示${label}的连接` : undefined}
      />
    </div>
  );
}
