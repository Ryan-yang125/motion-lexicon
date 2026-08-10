"use client";

import { MegaMenu } from "@/registry/components/mega-menu";

function Preview({ code, tone }: { code: string; tone: string }) {
  return <div className="grid size-24 place-items-center rounded-[24px] bg-white/70 shadow-[0_20px_34px_-26px_rgba(28,25,23,.75)] dark:bg-white/10"><span className={`grid size-11 place-items-center rounded-[14px] text-[11px] font-semibold text-white ${tone}`}>{code}</span></div>;
}

export function MegaMenuDemo() {
  return (
    <div className="flex min-h-[250px] w-full max-w-[440px] items-start px-2 pt-5">
      <MegaMenu
        label="Product navigation"
        sections={[
          { id: "product", label: "Product", preview: <Preview code="P" tone="bg-[#4568FF]" />, links: [{ id: "motion", label: "Motion system", description: "Components and primitives", onSelect: () => undefined }, { id: "registry", label: "Registry", description: "Install with one command", onSelect: () => undefined }] },
          { id: "solutions", label: "Solutions", preview: <Preview code="S" tone="bg-[#55745D]" />, links: [{ id: "teams", label: "Design teams", description: "Shared motion language", onSelect: () => undefined }, { id: "agents", label: "AI builders", description: "Production-ready recipes", onSelect: () => undefined }] },
          { id: "resources", label: "Resources", preview: <Preview code="R" tone="bg-[#93664F]" />, links: [{ id: "guides", label: "Field guides", description: "Motion decisions in context", onSelect: () => undefined }, { id: "skill", label: "Agent Skill", description: "Plan and write motion", onSelect: () => undefined }] },
        ]}
      />
    </div>
  );
}
