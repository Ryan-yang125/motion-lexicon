import type { ComponentSceneFamily } from "./component-registry";
import type { Locale, LocalizedText } from "./types";

export type RegistryBlock = {
  id: string;
  exportName: string;
  name: LocalizedText;
  description: LocalizedText;
  primitiveIds: readonly string[];
  dependencies: readonly string[];
  componentIds: readonly string[];
  sceneFamily: ComponentSceneFamily;
  primaryState: LocalizedText;
  signature: LocalizedText;
};

type BlockInput = {
  id: string;
  exportName: string;
  name: LocalizedText;
  description: LocalizedText;
  primitiveIds: readonly string[];
  componentIds: readonly string[];
  sceneFamily: ComponentSceneFamily;
  primaryState: LocalizedText;
  signature: LocalizedText;
};

const block = (entry: BlockInput): RegistryBlock => ({
  ...entry,
  dependencies: ["motion"]
});

export const registryBlocks: readonly RegistryBlock[] = [
  block({
    id: "agent-workspace",
    exportName: "AgentWorkspaceBlock",
    name: { zh: "Agent 产品工作台", en: "Agent workspace" },
    description: { zh: "把任务、思考、工具执行、人工审批与证据组织成一个连续的 Agent 产品页面。", en: "Organizes missions, thinking, tool execution, human approval, and evidence into one continuous agent product page." },
    primitiveIds: ["stagger", "direction-aware-transition", "crossfade"],
    componentIds: ["inline-edit", "metric-ticker", "prompt-composer"],
    sceneFamily: "product-mono",
    primaryState: { zh: "包含执行轨与审批节点的 Agent 工作台", en: "Agent workspace with execution rail and approval nodes" },
    signature: { zh: "任务从需求进入，经由可见执行轨和人工审批，最终收束为带证据的完成状态。", en: "A mission moves from request through visible execution and human approval into evidence-backed completion." }
  }),
  block({
    id: "product-landing",
    exportName: "ProductLandingBlock",
    name: { zh: "产品发布页", en: "Product landing" },
    description: { zh: "用一个连续的发布工作台连接产品定位、协作审阅与上线行动。", en: "Connects positioning, collaborative review, and launch action through one continuous release workspace." },
    primitiveIds: ["direction-aware-transition", "crossfade", "stagger"],
    componentIds: ["cinematic-hero", "media-carousel", "split-text-reveal"],
    sceneFamily: "editorial-warm",
    primaryState: { zh: "产品定位与发布阶段工作台", en: "Positioning and release-stage workspace" },
    signature: { zh: "发布阶段切换时，内容与进度在同一工作台内连续交接。", en: "Release stages hand content and progress forward inside one stable workspace." }
  }),
  block({
    id: "analytics-dashboard",
    exportName: "AnalyticsDashboardBlock",
    name: { zh: "数据分析台", en: "Analytics dashboard" },
    description: { zh: "通过稳定的指标、趋势和渠道结构完成时间范围分析。", en: "Explores time ranges through stable metrics, trends, and channel structure." },
    primitiveIds: ["number-ticker", "morph", "crossfade"],
    componentIds: ["animated-chart", "metric-ticker", "segmented-control"],
    sceneFamily: "product-mono",
    primaryState: { zh: "带指标与趋势对比的数据面板", en: "Data dashboard with metrics and trend comparison" },
    signature: { zh: "时间范围变化会同步更新指标、趋势线与渠道贡献。", en: "A range change updates metrics, trend geometry, and channel contribution together." }
  }),
  block({
    id: "project-dashboard",
    exportName: "ProjectDashboardBlock",
    name: { zh: "项目执行台", en: "Project dashboard" },
    description: { zh: "把里程碑、当前任务和团队活动组织成一个可推进的项目工作区。", en: "Organizes milestones, current work, and team activity into one actionable project workspace." },
    primitiveIds: ["morph", "stagger", "line-drawing"],
    componentIds: ["inline-edit", "kanban-board", "loading-button"],
    sceneFamily: "product-mono",
    primaryState: { zh: "可推进的项目里程碑与任务面板", en: "Actionable project milestones and task dashboard" },
    signature: { zh: "任务完成后会进入下一阶段，并同步推进里程碑进度。", en: "Completing work advances the next task and the milestone progress in one transition." }
  }),
  block({
    id: "support-inbox",
    exportName: "SupportInboxBlock",
    name: { zh: "客户支持收件箱", en: "Support inbox" },
    description: { zh: "在队列、对话与客户上下文之间维持清楚的处理路径。", en: "Maintains a clear handling path across queue, conversation, and customer context." },
    primitiveIds: ["direction-aware-transition", "crossfade", "stagger"],
    componentIds: ["drawer", "inline-edit", "loading-button", "metric-ticker"],
    sceneFamily: "product-mono",
    primaryState: { zh: "队列、对话与客户上下文并列的支持工作台", en: "Support workspace with queue, conversation, and customer context" },
    signature: { zh: "会话选择、回复发送与队列状态共享同一处理上下文。", en: "Conversation selection, reply delivery, and queue state share one handling context." }
  }),
  block({
    id: "creative-portfolio",
    exportName: "CreativePortfolioBlock",
    name: { zh: "创意作品集", en: "Creative portfolio" },
    description: { zh: "通过作品、材质研究和案例叙事呈现独立创意实践。", en: "Presents an independent creative practice through work, material studies, and case-story transitions." },
    primitiveIds: ["reveal", "morph", "crossfade"],
    componentIds: ["dither-reveal-card", "image-lightbox", "media-carousel", "scroll-media-expansion", "text-morph"],
    sceneFamily: "editorial-warm",
    primaryState: { zh: "温暖材质中的精选项目与案例入口", en: "Selected work and case-study entry points in a warm material setting" },
    signature: { zh: "作品在材质显影、聚焦查看和案例轮播之间连续展开。", en: "Work moves continuously between material reveal, focused viewing, and case-study browsing." }
  }),
  block({
    id: "commerce-storefront",
    exportName: "CommerceStorefrontBlock",
    name: { zh: "商业店铺", en: "Commerce storefront" },
    description: { zh: "将产品叙事、细节浏览、批量定价和购物车确认组织为完整购买路径。", en: "Organizes product story, detail browsing, volume pricing, and cart confirmation into a complete purchase path." },
    primitiveIds: ["morph", "number-ticker", "scroll-reveal"],
    componentIds: ["add-to-cart-morph", "animated-combobox", "cinematic-hero", "media-carousel", "pricing-calculator"],
    sceneFamily: "editorial-warm",
    primaryState: { zh: "主产品、材质详情与可确认购买面板", en: "Hero product, material details, and a confirmable purchase panel" },
    signature: { zh: "商品浏览、价格配置和购物车状态在一条购买路径中收束。", en: "Product browsing, price configuration, and cart state resolve along one purchase path." }
  }),
  block({
    id: "developer-docs",
    exportName: "DeveloperDocsBlock",
    name: { zh: "开发者文档", en: "Developer docs" },
    description: { zh: "把安装、代码比较、命令检索和预览结果组织成可导航的开发者文档。", en: "Organizes installation, code comparison, command search, and preview output into navigable developer documentation." },
    primitiveIds: ["direction-aware-transition", "crossfade", "text-morph"],
    componentIds: ["code-comparison", "command-palette", "mega-menu", "split-text-reveal"],
    sceneFamily: "product-mono",
    primaryState: { zh: "可导航的安装与 API 文档工作台", en: "Navigable installation and API documentation workspace" },
    signature: { zh: "导航、命令搜索和内容章节在稳定文档框架内交接。", en: "Navigation, command search, and content sections hand off inside a stable documentation frame." }
  }),
  block({
    id: "media-editorial",
    exportName: "MediaEditorialBlock",
    name: { zh: "媒体编辑特辑", en: "Media editorial" },
    description: { zh: "以章节、焦点画廊和滚动叙事浏览完整的视觉报道。", en: "Browses a complete visual feature through chapters, focus galleries, and scroll-led storytelling." },
    primitiveIds: ["scroll-driven-animation", "parallax", "crossfade"],
    componentIds: ["cinematic-hero", "focus-gallery", "kinetic-heading", "scroll-story"],
    sceneFamily: "editorial-warm",
    primaryState: { zh: "带章节导航的视觉报道首屏", en: "Visual feature lead with chapter navigation" },
    signature: { zh: "章节导航把电影式主视觉、画廊焦点和滚动故事连接为同一篇报道。", en: "Chapter navigation connects a cinematic lead, gallery focus, and scroll story into one feature." }
  }),
  block({
    id: "onboarding-flow",
    exportName: "OnboardingFlowBlock",
    name: { zh: "引导流程", en: "Onboarding flow" },
    description: { zh: "以账户设置、文件导入和完成清单组织首个工作区的成功路径。", en: "Organizes account setup, file import, and completion checklist into a successful first-workspace path." },
    primitiveIds: ["morph", "stagger", "press-tap-feedback"],
    componentIds: ["drawer", "file-dropzone", "multi-step-form", "onboarding-checklist", "progress-bar", "tabs"],
    sceneFamily: "product-mono",
    primaryState: { zh: "进行中的账户设置与导入步骤", en: "In-progress account setup and import steps" },
    signature: { zh: "表单、导入和清单完成度连续推进到首个成功状态。", en: "Form, import, and checklist completion progress continuously toward the first successful state." }
  })
];

export function getRegistryBlock(id: string) {
  return registryBlocks.find((entry) => entry.id === id);
}

export function registryBlockName(id: string, locale: Locale) {
  return getRegistryBlock(id)?.name[locale] ?? id;
}

export const registryBlockInstallCommand = (id: string) =>
  `npx shadcn@latest add https://motion-lexicon.pages.dev/r/${id}.json`;
