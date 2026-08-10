"use client";

import { IntegrationMap } from "@/registry/components/integration-map";

const nodes = [
  { id: "figma", label: "Figma", meta: "Design", x: 62, y: 52, tone: "clay" as const },
  { id: "github", label: "GitHub", meta: "Source", x: 62, y: 164, tone: "neutral" as const },
  { id: "motion", label: "Motion", meta: "Registry", x: 220, y: 108, tone: "blue" as const },
  { id: "web", label: "Website", meta: "Preview", x: 378, y: 52, tone: "moss" as const },
  { id: "skill", label: "Agent Skill", meta: "Generate", x: 378, y: 164, tone: "clay" as const },
];

const edges = [
  { from: "figma", to: "motion" },
  { from: "github", to: "motion" },
  { from: "motion", to: "web" },
  { from: "motion", to: "skill" },
];

export function IntegrationMapDemo() {
  return (
    <div className="mx-auto flex h-[250px] w-full max-w-[440px] items-center">
      <IntegrationMap nodes={nodes} edges={edges} />
    </div>
  );
}
