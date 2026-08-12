import type { Locale, LocalizedText } from "./types";

export type RegistryBlock = {
  id: string;
  exportName: string;
  name: LocalizedText;
  description: LocalizedText;
  primitiveIds: readonly string[];
  dependencies: readonly string[];
  signature: LocalizedText;
};

const block = (
  id: string,
  exportName: string,
  zhName: string,
  enName: string,
  zhDescription: string,
  enDescription: string,
  primitiveIds: readonly string[],
  zhSignature: string,
  enSignature: string,
): RegistryBlock => ({
  id,
  exportName,
  name: { zh: zhName, en: enName },
  description: { zh: zhDescription, en: enDescription },
  primitiveIds,
  dependencies: ["motion"],
  signature: { zh: zhSignature, en: enSignature },
});

export const registryBlocks: readonly RegistryBlock[] = [
  block(
    "agent-workspace",
    "AgentWorkspaceBlock",
    "Agent 产品工作台",
    "Agent workspace",
    "把任务、思考、工具执行、人工审批与证据组织成一个连续的 Agent 产品页面。",
    "Organizes missions, thinking, tool execution, human approval, and evidence into one continuous agent product page.",
    ["stagger", "direction-aware-transition", "crossfade"],
    "任务从需求进入，经由可见执行轨和人工审批，最终收束为带证据的完成状态。",
    "A mission moves from request through visible execution and human approval into evidence-backed completion.",
  ),
  block(
    "product-landing",
    "ProductLandingBlock",
    "产品发布页",
    "Product landing",
    "用一个连续的发布工作台连接产品定位、协作审阅与上线行动。",
    "Connects positioning, collaborative review, and launch action through one continuous release workspace.",
    ["direction-aware-transition", "crossfade", "stagger"],
    "发布阶段切换时，内容与进度在同一工作台内连续交接。",
    "Release stages hand content and progress forward inside one stable workspace.",
  ),
  block(
    "analytics-dashboard",
    "AnalyticsDashboardBlock",
    "数据分析台",
    "Analytics dashboard",
    "通过稳定的指标、趋势和渠道结构完成时间范围分析。",
    "Explores time ranges through stable metrics, trends, and channel structure.",
    ["number-ticker", "morph", "crossfade"],
    "时间范围变化会同步更新指标、趋势线与渠道贡献。",
    "A range change updates metrics, trend geometry, and channel contribution together.",
  ),
  block(
    "project-dashboard",
    "ProjectDashboardBlock",
    "项目执行台",
    "Project dashboard",
    "把里程碑、当前任务和团队活动组织成一个可推进的项目工作区。",
    "Organizes milestones, current work, and team activity into one actionable project workspace.",
    ["morph", "stagger", "line-drawing"],
    "任务完成后会进入下一阶段，并同步推进里程碑进度。",
    "Completing work advances the next task and the milestone progress in one transition.",
  ),
  block(
    "support-inbox",
    "SupportInboxBlock",
    "客户支持收件箱",
    "Support inbox",
    "在队列、对话与客户上下文之间维持清楚的处理路径。",
    "Maintains a clear handling path across queue, conversation, and customer context.",
    ["direction-aware-transition", "crossfade", "stagger"],
    "会话选择、回复发送与队列状态共享同一处理上下文。",
    "Conversation selection, reply delivery, and queue state share one handling context.",
  ),
];

export function getRegistryBlock(id: string) {
  return registryBlocks.find((entry) => entry.id === id);
}

export function registryBlockName(id: string, locale: Locale) {
  return getRegistryBlock(id)?.name[locale] ?? id;
}

export const registryBlockInstallCommand = (id: string) =>
  `npx shadcn@latest add https://motion-lexicon.pages.dev/r/${id}.json`;
