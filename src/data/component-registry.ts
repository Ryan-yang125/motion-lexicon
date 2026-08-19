import type { Locale, LocalizedText } from "./types";

export type ComponentCategory =
  | "agent-ui"
  | "actions"
  | "overlays-surfaces"
  | "forms-input"
  | "navigation"
  | "data-commerce"
  | "feedback"
  | "cards-media"
  | "visual-ambient"
  | "hero-story"
  | "text-type";

export type ComponentEngine = "css" | "motion" | "gsap" | "three" | "webgl";
export type ComponentRuntimeCost = "light" | "medium" | "heavy";
export type ComponentSceneFamily = "product-mono" | "editorial-warm" | "spatial-dark";
export type ComponentMotionRole = "snap" | "ui" | "gentle" | "lively" | "ambient";
export type ComponentAssetProvenance = "self-contained" | "local-asset" | "generated";

export type RegistryComponent = {
  id: string;
  exportName: string;
  category: ComponentCategory;
  name: LocalizedText;
  description: LocalizedText;
  primitiveIds: readonly string[];
  dependencies: readonly string[];
  devDependencies?: readonly string[];
  engines: readonly ComponentEngine[];
  runtimeCost: ComponentRuntimeCost;
  signature: LocalizedText;
  featured?: boolean;
  sceneFamily: ComponentSceneFamily;
  motionRole: ComponentMotionRole;
  primaryState: LocalizedText;
  assetProvenance: ComponentAssetProvenance;
};

export const componentCategories: ReadonlyArray<{
  id: ComponentCategory;
  name: LocalizedText;
}> = [
  { id: "agent-ui", name: { zh: "Agent 产品", en: "Agent UI" } },
  { id: "actions", name: { zh: "操作", en: "Actions" } },
  { id: "overlays-surfaces", name: { zh: "浮层与界面", en: "Overlays & Surfaces" } },
  { id: "forms-input", name: { zh: "表单与输入", en: "Forms & Input" } },
  { id: "navigation", name: { zh: "导航", en: "Navigation" } },
  { id: "data-commerce", name: { zh: "数据与商业", en: "Data & Commerce" } },
  { id: "feedback", name: { zh: "反馈", en: "Feedback" } },
  { id: "cards-media", name: { zh: "卡片与媒体", en: "Cards & Media" } },
  { id: "visual-ambient", name: { zh: "视觉与环境", en: "Visual & Ambient" } },
  { id: "hero-story", name: { zh: "主视觉与叙事", en: "Hero & Story" } },
  { id: "text-type", name: { zh: "文字与排版", en: "Text & Type" } }
];

type ComponentV6Metadata = {
  sceneFamily: ComponentSceneFamily;
  motionRole: ComponentMotionRole;
  primaryState: LocalizedText;
  assetProvenance: ComponentAssetProvenance;
  dependencies?: readonly string[];
  engines?: readonly ComponentEngine[];
  runtimeCost?: ComponentRuntimeCost;
  signature?: LocalizedText;
};

const flagshipComponentIds = new Set([
  "scroll-media-expansion",
  "shader-hero",
  "device-scroll-reveal",
  "expandable-card",
  "animated-testimonials",
  "image-trail",
  "scroll-story",
  "procedural-product-viewer",
  "dither-reveal-card",
  "network-globe",
  "image-lightbox",
  "spotlight-bento"
]);

const baselineComponentMetadata = {
  "agent-thinking-trace": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "当前推理阶段与证据轨", en: "Active reasoning phase on an evidence rail" }, assetProvenance: "self-contained" },
  "streaming-answer": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "已完成回答与可展开来源", en: "Resolved answer with expandable sources" }, assetProvenance: "self-contained" },
  "tool-call-stack": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "展开的工具执行记录", en: "Expanded tool execution record" }, assetProvenance: "self-contained" },
  "approval-flow": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "待确认的建议、证据与备选方案", en: "Approval-ready recommendation with evidence and alternatives" }, assetProvenance: "self-contained" },
  "task-progress": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "执行中的任务进度轨", en: "Active task progress rail" }, assetProvenance: "self-contained" },
  "prompt-composer": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带来源标签的聚焦提示输入器", en: "Focused prompt composer with source chips" }, assetProvenance: "self-contained" },
  "context-sources": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "展开的检索来源与相关度", en: "Expanded retrieved source with relevance" }, assetProvenance: "self-contained" },
  "diff-review": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带逐项决策的字段差异", en: "Field diff with per-change decisions" }, assetProvenance: "self-contained" },
  "multi-agent-handoff": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "当前负责人之间的任务交接", en: "Task handoff between current owners" }, assetProvenance: "self-contained" },
  "copy-button": { sceneFamily: "product-mono", motionRole: "snap", primaryState: { zh: "复制完成后的确认按钮", en: "Copy action in its confirmed state" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "按钮文案原位切换为复制完成", en: "Button label resolves in place to copied" } },
  "loading-button": { sceneFamily: "product-mono", motionRole: "snap", primaryState: { zh: "带进度反馈的提交按钮", en: "Submit button with in-place progress feedback" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "等待、成功与失败在同一按钮内交接", en: "Pending, success, and failure hand off inside one button" } },
  "hold-action": { sceneFamily: "product-mono", motionRole: "snap", primaryState: { zh: "正在填充的长按确认按钮", en: "Hold-to-confirm button with active fill" }, assetProvenance: "self-contained" },
  "command-palette": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带键盘焦点的命令搜索结果", en: "Command results with active keyboard focus" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "搜索结果与键盘焦点在面板内连续移动", en: "Search results and keyboard focus move continuously inside the palette" } },
  "context-menu": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "锚定在触发点的上下文菜单", en: "Context menu anchored to its trigger" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "菜单从触发坐标展开并避开视口边缘", en: "Menu opens from the trigger coordinate and avoids viewport edges" } },
  "drawer": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "已打开的侧边操作面板", en: "Open side panel for a focused task" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "抽屉、遮罩与焦点作为同一层级进出", en: "Drawer, backdrop, and focus enter and leave as one layer" } },
  "dropdown": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "展开并高亮当前选项的选择器", en: "Expanded selector with the current option highlighted" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "高亮沿选项列表连续落位", en: "The highlight settles continuously across options" } },
  "modal": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带明确确认动作的模态窗口", en: "Modal with a clear confirmation action" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "对话框、遮罩与焦点范围共同切换", en: "Dialog, backdrop, and focus scope transition together" } },
  "popover": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "贴近触发点的辅助信息浮层", en: "Supporting popover positioned at its trigger" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "浮层依据触发点和可用空间确定展开原点", en: "Popover derives its reveal origin from the trigger and available space" } },
  "expanding-search": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "展开并聚焦的工具栏搜索框", en: "Expanded toolbar search field with focus" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "工具栏动作连续扩展为可输入搜索框", en: "Toolbar action expands continuously into an input field" } },
  "inline-validation": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "输入旁的明确校验结果", en: "Clear validation result beside the input" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "等待、错误与通过反馈紧贴字段切换", en: "Pending, error, and success feedback transitions beside the field" } },
  "otp-input": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "完整验证码与确认状态", en: "Completed OTP entry with confirmation state" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "输入、粘贴和校验反馈保持同一节奏", en: "Typing, paste, and validation feedback share one rhythm" } },
  "password-strength": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "显示规则通过度的密码字段", en: "Password field showing rule completion" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "规则状态与强度指示同步更新", en: "Rule status and strength indicator update together" } },
  "slider-detents": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "吸附在语义刻度上的滑块", en: "Slider settled on a semantic detent" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "连续拖动在语义刻度处吸附", en: "Continuous drag settles at meaningful detents" } },
  "tag-input": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带已选标签的输入字段", en: "Input field with selected tags" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "标签新增、移除与拒绝反馈在输入位置完成", en: "Tag add, remove, and reject feedback resolves at the input" } },
  "accordion": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "展开的内容分组", en: "Expanded content group" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "内容高度和展开状态在同一位置连续交接", en: "Content height and disclosure state hand off in place" } },
  "hide-on-scroll": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "阅读时收起的顶部工具栏", en: "Top toolbar settled into its reading state" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "工具栏随滚动方向收起并在反向滚动时恢复", en: "Toolbar yields to scroll direction and returns on reversal" } },
  "segmented-control": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "共享高亮落在当前分段", en: "Shared highlight settled on the current segment" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "一个共享高亮在选项间连续滑动", en: "One shared highlight moves continuously between options" } },
  "tabs": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "激活标签与对应内容面板", en: "Active tab with its corresponding panel" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "指示器、方向和内容面板协同切换", en: "Indicator, direction, and content panel change together" } },
  "filter-grid": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "筛选后的紧凑结果网格", en: "Compact result grid after filtering" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "结果在保留空间关系的同时重新排列", en: "Results rearrange while preserving spatial relationships" } },
  "reorder-list": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "显示明确落点的排序列表", en: "Reorderable list with a clear drop position" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "指针和键盘排序共享同一落点反馈", en: "Pointer and keyboard reordering share one drop-position signal" } },
  "sortable-table": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "按当前字段排序的数据表", en: "Data table sorted by its active field" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "排序变化通过表行位置与方向表达", en: "Sorting is expressed through row position and direction" } },
  "progress-bar": { sceneFamily: "product-mono", motionRole: "lively", primaryState: { zh: "处于确定进度的任务条", en: "Task bar at a determinate progress value" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "等待、推进和完成在一条进度轨内完成", en: "Pending, progress, and completion resolve along one bar" } },
  "value-flash": { sceneFamily: "product-mono", motionRole: "lively", primaryState: { zh: "带方向提示的更新数值", en: "Updated value with directional feedback" }, assetProvenance: "self-contained", dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "数值变化通过方向和短暂色彩获得解释", en: "Value change is explained through direction and brief color" } },
  "magnetic-action": { sceneFamily: "product-mono", motionRole: "snap", primaryState: { zh: "响应邻近指针的主操作", en: "Primary action responding to a nearby pointer" }, assetProvenance: "self-contained" },
  "theme-reveal": { sceneFamily: "product-mono", motionRole: "lively", primaryState: { zh: "主题切换后的稳定界面", en: "Stable interface after a theme transition" }, assetProvenance: "self-contained" },
  "mega-menu": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带当前高亮的大型导航面板", en: "Expanded navigation panel with active highlight" }, assetProvenance: "self-contained" },
  "floating-dock": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带焦点图标的浮动程序坞", en: "Floating dock with a focused destination" }, assetProvenance: "self-contained" },
  "voice-capture": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "显示声级的录音输入器", en: "Voice input showing the current level" }, assetProvenance: "self-contained" },
  "toast-stack": { sceneFamily: "product-mono", motionRole: "lively", primaryState: { zh: "展开的通知队列", en: "Expanded notification queue" }, assetProvenance: "self-contained" },
  "upload-queue": { sceneFamily: "product-mono", motionRole: "lively", primaryState: { zh: "逐项推进的上传队列", en: "Upload queue advancing item by item" }, assetProvenance: "self-contained" },
  "skeleton-reveal": { sceneFamily: "product-mono", motionRole: "gentle", primaryState: { zh: "骨架与真实内容交接的阅读面", en: "Reading surface handing off from skeleton to content" }, assetProvenance: "self-contained" },
  "activity-feed": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带未读边界的实时动态流", en: "Live activity feed with an unread boundary" }, assetProvenance: "self-contained" },
  "integration-map": { sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带活跃路径的系统集成拓扑", en: "Integration topology with active paths" }, assetProvenance: "self-contained" },
  "cursor-lens": { sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "落在媒体细节上的对比镜", en: "Comparison lens settled on media detail" }, assetProvenance: "self-contained" },
  "media-carousel": { sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "居中聚焦的媒体轮播卡", en: "Media carousel with a centered focal card" }, assetProvenance: "self-contained" },
  "image-lightbox": { sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "带缩略图上下文的沉浸式画廊", en: "Immersive gallery with thumbnail context" }, assetProvenance: "self-contained" },
  "scroll-story": { sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "章节进度与产品场景同步的叙事面", en: "Story scene synchronized with chapter progress" }, assetProvenance: "self-contained" },
  "procedural-product-viewer": { sceneFamily: "spatial-dark", motionRole: "gentle", primaryState: { zh: "可拖拽检查的深色三维产品", en: "Dark 3D product ready for drag inspection" }, assetProvenance: "self-contained" },
  "dither-reveal-card": { sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "静止的 WebGL 抖动显影卡", en: "Still WebGL dither-reveal card" }, assetProvenance: "self-contained" },
  "network-globe": { sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "聚焦节点的深色网络地球", en: "Dark network globe focused on a selected node" }, assetProvenance: "self-contained" },
  "kinetic-logo-exchange": { sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "停在当前选择的动态品牌队列", en: "Kinetic brand queue settled on its selection" }, assetProvenance: "self-contained" },
  "spotlight-bento": { sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "聚光停在当前卡片的联动矩阵", en: "Connected bento with the spotlight on its active tile" }, assetProvenance: "self-contained" }
} satisfies Record<string, ComponentV6Metadata>;

function baselineMetadataFor(id: string): ComponentV6Metadata {
  const metadata = baselineComponentMetadata[id as keyof typeof baselineComponentMetadata];
  if (!metadata) throw new Error(`Missing explicit V6 metadata for baseline component: ${id}`);
  return metadata;
}

const createComponent = (
  id: string,
  exportName: string,
  category: ComponentCategory,
  zhName: string,
  enName: string,
  zhDescription: string,
  enDescription: string,
  primitiveIds: readonly string[],
  v6: ComponentV6Metadata,
  featured = false,
  dependencies?: readonly string[],
  engines?: readonly ComponentEngine[],
  runtimeCost?: ComponentRuntimeCost,
  signature?: LocalizedText,
  devDependencies?: readonly string[]
): RegistryComponent => {
  const resolvedDependencies = dependencies ?? v6.dependencies;
  const resolvedEngines = engines ?? v6.engines;
  const resolvedRuntimeCost = runtimeCost ?? v6.runtimeCost;
  const resolvedSignature = signature ?? v6.signature;
  if (!resolvedDependencies || !resolvedEngines || !resolvedRuntimeCost || !resolvedSignature) {
    throw new Error(`Missing explicit runtime metadata for component: ${id}`);
  }
  return {
    id,
    exportName,
    category,
    name: { zh: zhName, en: enName },
    description: { zh: zhDescription, en: enDescription },
    primitiveIds,
    dependencies: resolvedDependencies,
    devDependencies,
    engines: resolvedEngines,
    runtimeCost: resolvedRuntimeCost,
    signature: resolvedSignature,
    featured: featured && flagshipComponentIds.has(id),
    sceneFamily: v6.sceneFamily,
    motionRole: v6.motionRole,
    primaryState: v6.primaryState,
    assetProvenance: v6.assetProvenance
  };
};

const component = (
  id: string,
  exportName: string,
  category: ComponentCategory,
  zhName: string,
  enName: string,
  zhDescription: string,
  enDescription: string,
  primitiveIds: readonly string[],
  featured = false,
  dependencies?: readonly string[],
  engines?: readonly ComponentEngine[],
  runtimeCost?: ComponentRuntimeCost,
  signature?: LocalizedText,
  devDependencies?: readonly string[]
) => createComponent(id, exportName, category, zhName, enName, zhDescription, enDescription, primitiveIds, baselineMetadataFor(id), featured, dependencies, engines, runtimeCost, signature, devDependencies);

type V6ComponentInput = {
  id: string;
  exportName: string;
  category: ComponentCategory;
  name: LocalizedText;
  description: LocalizedText;
  primitiveIds: readonly string[];
  dependencies: readonly string[];
  engines: readonly ComponentEngine[];
  runtimeCost: ComponentRuntimeCost;
  signature: LocalizedText;
  featured?: boolean;
  sceneFamily: ComponentSceneFamily;
  motionRole: ComponentMotionRole;
  primaryState: LocalizedText;
  assetProvenance: ComponentAssetProvenance;
  devDependencies?: readonly string[];
};

const v6Component = (entry: V6ComponentInput) => createComponent(
  entry.id,
  entry.exportName,
  entry.category,
  entry.name.zh,
  entry.name.en,
  entry.description.zh,
  entry.description.en,
  entry.primitiveIds,
  {
    sceneFamily: entry.sceneFamily,
    motionRole: entry.motionRole,
    primaryState: entry.primaryState,
    assetProvenance: entry.assetProvenance
  },
  entry.featured,
  entry.dependencies,
  entry.engines,
  entry.runtimeCost,
  entry.signature,
  entry.devDependencies
);

export const registryComponents: readonly RegistryComponent[] = [
  component("agent-thinking-trace", "AgentThinkingTrace", "agent-ui", "Agent 思考轨迹", "Agent thinking trace", "把推理阶段、当前焦点与耗时组织成一条可展开的证据轨。", "Organizes reasoning phases, current focus, and elapsed time into an expandable evidence trail.", ["stagger", "crossfade"], true, ["motion"], ["motion"], "light", { zh: "沿信号轨逐步显现的思考阶段", en: "Thinking stages revealed along a signal rail" }),
  component("streaming-answer", "StreamingAnswer", "agent-ui", "流式回答", "Streaming answer", "让生成文本、引用来源与追问建议在同一回答中逐步到位。", "Brings generated text, cited sources, and follow-up prompts into one progressive answer.", ["perceived-performance", "crossfade"], true, ["motion"], ["motion"], "light", { zh: "文字完成后接续展开来源与追问", en: "Sources and follow-ups resolve after the streamed answer" }),
  component("tool-call-stack", "ToolCallStack", "agent-ui", "工具调用堆栈", "Tool call stack", "把搜索、写入、命令和失败状态收拢成可检查的执行记录。", "Collects search, write, command, and failure states into an inspectable execution record.", ["accordion-collapse", "stagger"], true, ["motion"], ["motion"], "light", { zh: "执行记录按工具状态展开并归档", en: "Execution records expand and resolve by tool state" }),
  component("approval-flow", "ApprovalFlow", "agent-ui", "人工审批流程", "Human approval flow", "在 Agent 执行动作前承载推荐项、自定义指令与明确确认。", "Carries recommendations, custom instructions, and explicit confirmation before an agent acts.", ["crossfade", "press-tap-feedback"], true, ["motion"], ["motion"], "light", { zh: "选择结果原位收束为审批完成", en: "The selected path resolves in place into approval" }),
  component("task-progress", "TaskProgress", "agent-ui", "任务进度", "Task progress", "在紧凑与展开布局中呈现队列、执行、阻塞、失败、恢复和完成状态。", "Presents queued, active, blocked, failed, recovered, and complete work across compact and expanded layouts.", ["stagger", "perceived-performance"], true, ["motion"], ["motion"], "light", { zh: "任务状态沿同一条进度轨连续推进", en: "Task state advances continuously along one progress rail" }),
  component("prompt-composer", "PromptComposer", "agent-ui", "Agent 提示词编辑器", "Agent prompt composer", "把来源、附件、模型、语音与发送操作组织成一个清晰输入面。", "Combines sources, attachments, model choice, voice, and sending into one focused input surface.", ["origin-aware-animation", "morph"], true, ["motion"], ["motion"], "light", { zh: "来源菜单从输入器锚点展开", en: "The source menu reveals from the composer anchor" }),
  component("context-sources", "ContextSources", "agent-ui", "上下文来源卡", "Context sources", "展示 Agent 检索到的片段、来源与相关度，并支持局部展开。", "Presents retrieved chunks, provenance, and relevance with focused disclosure.", ["accordion-collapse", "morph"], false, ["motion"], ["motion"], "light", { zh: "选中来源跨栏展开为阅读状态", en: "A selected source expands across the reading surface" }),
  component("diff-review", "DiffReview", "agent-ui", "修改对比评审", "Diff review", "逐项接受或拒绝 Agent 提出的字段修改。", "Reviews agent-proposed field edits with explicit per-change decisions.", ["crossfade", "number-ticker"], true, ["motion"], ["motion"], "light", { zh: "差异决策直接落回表格行", en: "Diff decisions resolve directly inside each row" }),
  component("multi-agent-handoff", "MultiAgentHandoff", "agent-ui", "多 Agent 交接", "Multi-agent handoff", "让任务、产物和下一位负责人沿同一条交接轨连续移动。", "Moves task ownership, artifacts, and the next responsible agent along one continuous relay.", ["direction-aware-transition", "morph"], true, ["motion"], ["motion"], "light", { zh: "任务所有权沿 Agent 接力轨移动", en: "Task ownership travels along an agent relay rail" }),

  component("copy-button", "CopyButton", "actions", "复制按钮", "Copy button", "复制完成后原位切换状态，宽度保持稳定。", "Reports clipboard state in place without shifting nearby content.", ["press-tap-feedback", "text-morph"], true),
  component("loading-button", "LoadingButton", "actions", "加载按钮", "Loading button", "把等待、成功与失败收进同一个操作位置。", "Keeps pending, success, and error feedback inside one action.", ["press-tap-feedback", "crossfade"], true),
  component("hold-action", "HoldAction", "actions", "长按操作", "Hold action", "用可取消进度保护触控、指针和键盘触发的高风险操作。", "Protects high-risk actions with cancellable touch, pointer, and keyboard progress.", ["hold-to-confirm", "press-tap-feedback"], true, ["motion"], ["motion"], "light", { zh: "按住进度在原位完成或平滑回退", en: "Hold progress completes in place or returns smoothly" }),

  component("command-palette", "CommandPalette", "overlays-surfaces", "命令面板", "Command palette", "搜索、键盘导航与焦点管理完整配合。", "Combines search, keyboard navigation, and deliberate focus management.", ["crossfade", "stagger"], true),
  component("context-menu", "ContextMenu", "overlays-surfaces", "上下文菜单", "Context menu", "从触发坐标展开，并自动避开视口边缘。", "Opens from the trigger coordinate and stays inside the viewport.", ["origin-aware-animation", "scale-in"]),
  component("drawer", "Drawer", "overlays-surfaces", "抽屉", "Drawer", "支持焦点锁定、拖拽关闭与可中断弹簧。", "Includes focus containment, drag dismissal, and interruptible spring motion.", ["spring", "slide-in"], true),
  component("dropdown", "Dropdown", "overlays-surfaces", "下拉选择", "Dropdown", "选项高亮连续移动，键盘操作完整。", "Moves selection continuously with full keyboard behavior.", ["morph", "scale-in"]),
  component("modal", "Modal", "overlays-surfaces", "模态框", "Modal", "稳定处理焦点、遮罩、退出与异步确认。", "Handles focus, backdrop, exit, and async confirmation as one flow.", ["scale-in", "crossfade"]),
  component("popover", "Popover", "overlays-surfaces", "气泡浮层", "Popover", "根据触发点与空间方向确定展开原点。", "Derives its reveal origin from the trigger and available space.", ["origin-aware-animation", "scale-in"]),

  component("expanding-search", "ExpandingSearch", "forms-input", "展开搜索", "Expanding search", "从工具栏动作自然展开为完整搜索框。", "Expands from a toolbar action into a focused search field.", ["morph", "crossfade"], true),
  component("inline-validation", "InlineValidation", "forms-input", "行内校验", "Inline validation", "把等待、错误和通过状态放在输入旁边。", "Places pending, error, and success states next to the input.", ["crossfade", "shake-wiggle"], true),
  component("otp-input", "OtpInput", "forms-input", "验证码输入", "OTP input", "输入、粘贴、错误与成功反馈连续发生。", "Coordinates typing, paste, error, and success feedback.", ["shake-wiggle", "crossfade"]),
  component("password-strength", "PasswordStrength", "forms-input", "密码强度", "Password strength", "规则检查与强度变化保持清晰节奏。", "Makes rule checks and strength changes legible as one response.", ["stagger", "crossfade"]),
  component("slider-detents", "SliderDetents", "forms-input", "刻度滑块", "Slider detents", "拖动时吸附语义刻度，并保留连续值。", "Snaps to meaningful detents while preserving continuous input.", ["spring", "drag-to-reorder"]),
  component("tag-input", "TagInput", "forms-input", "标签输入", "Tag input", "新增、删除和拒绝状态都有明确反馈。", "Gives clear feedback for adding, removing, and rejecting tags.", ["scale-in", "shake-wiggle"]),

  component("accordion", "Accordion", "navigation", "折叠面板", "Accordion", "内容高度与开合状态保持连续。", "Keeps content height and disclosure state visually continuous.", ["accordion-collapse", "crossfade"], true),
  component("hide-on-scroll", "HideOnScroll", "navigation", "滚动隐藏栏", "Hide on scroll", "跟随滚动方向收起与恢复工具栏。", "Hides and restores a toolbar in response to scroll direction.", ["scroll-driven-animation", "slide-in"]),
  component("segmented-control", "SegmentedControl", "navigation", "分段控制", "Segmented control", "共享高亮在选项之间连续移动。", "Carries one shared highlight between options.", ["morph", "press-tap-feedback"]),
  component("tabs", "Tabs", "navigation", "标签页", "Tabs", "指示器、方向与内容切换保持一致。", "Coordinates the indicator, direction, and panel change.", ["direction-aware-transition", "morph"], true),

  component("filter-grid", "FilterGrid", "data-commerce", "筛选网格", "Filter grid", "筛选结果重新排列时维持空间连续性。", "Preserves spatial continuity as filtered results rearrange.", ["morph", "stagger"]),
  component("reorder-list", "ReorderList", "data-commerce", "拖拽排序列表", "Reorder list", "指针拖拽与键盘排序共享清晰落点。", "Provides clear drop position for pointer and keyboard reordering.", ["drag-to-reorder", "spring"], true),
  component("sortable-table", "SortableTable", "data-commerce", "可排序表格", "Sortable table", "排序变化通过行位置表达，数据保持可读。", "Explains sorting through row position while keeping data readable.", ["morph", "crossfade"]),

  component("progress-bar", "ProgressBar", "feedback", "进度条", "Progress bar", "支持等待、确定进度与完成三个阶段。", "Covers pending, determinate, and complete progress states.", ["perceived-performance", "crossfade"]),
  component("value-flash", "ValueFlash", "feedback", "数值变化", "Value flash", "用方向与短暂颜色反馈解释数值变化。", "Explains value changes with direction and brief color feedback.", ["number-ticker", "crossfade"], true),
  component("magnetic-action", "MagneticAction", "actions", "磁吸主按钮", "Magnetic action", "指针靠近时按钮轻量迎向触点，离开后自然回正。", "Lets a primary action lean toward a nearby pointer and settle cleanly on release.", ["hover-effect", "spring"], true, ["gsap"], ["gsap"], "light", { zh: "GSAP 快速追踪触点并回正", en: "GSAP pointer tracking with a clean return" }),
  component("theme-reveal", "ThemeReveal", "actions", "主题揭幕", "Theme reveal", "从切换触点扩散新主题，保持页面内容连续。", "Reveals a new theme outward from the exact toggle point.", ["page-transition", "reveal"], true, [], ["css"], "light", { zh: "View Transition 圆形裁切揭幕", en: "Circular View Transition theme reveal" }),

  component("mega-menu", "MegaMenu", "navigation", "大型导航菜单", "Mega menu", "高亮、面板和焦点路径共同维持导航上下文。", "Keeps highlight, panel, and focus movement in one continuous navigation path.", ["morph", "origin-aware-animation"], true, ["motion"], ["motion"], "light", { zh: "共享高亮驱动的大型菜单", en: "Mega menu driven by a shared highlight" }),
  component("floating-dock", "FloatingDock", "navigation", "浮动程序坞", "Floating dock", "图标随指针距离获得克制的弹性放大。", "Scales nearby destinations with restrained spring response to pointer distance.", ["spring", "hover-effect"], false, ["motion"], ["motion"], "light", { zh: "距离感知的弹性程序坞", en: "Distance-aware spring dock" }),

  component("voice-capture", "VoiceCapture", "forms-input", "语音输入器", "Voice capture", "录制、声级、暂停和完成在同一输入器中连续切换。", "Coordinates recording, levels, pause, and completion inside one input surface.", ["idle-animation", "morph"], true, ["motion"], ["motion"], "light", { zh: "响应声级的语音采集流程", en: "Voice capture flow with responsive levels" }),

  component("toast-stack", "ToastStack", "feedback", "通知堆栈", "Toast stack", "通知按层级进入、展开，并支持滑动或键盘关闭。", "Layers incoming notices into a stack that expands and dismisses by swipe or keyboard.", ["stagger", "swipe-to-dismiss"], true, ["motion"], ["motion"], "light", { zh: "可展开并滑动关闭的通知队列", en: "Expandable notification queue with swipe dismissal" }),
  component("upload-queue", "UploadQueue", "feedback", "文件上传队列", "Upload queue", "把文件接收、逐项进度、重试和完成收拢成一个流程。", "Turns file intake, per-item progress, retry, and completion into one compact flow.", ["perceived-performance", "stagger"], true, ["motion"], ["motion"], "light", { zh: "逐项推进并自动收拢的上传流程", en: "Per-file upload flow that resolves into completion" }),
  component("skeleton-reveal", "SkeletonReveal", "feedback", "内容成形加载", "Skeleton reveal", "骨架与真实内容共用稳定几何，载入后进行双层交接。", "Shares stable geometry between skeleton and content for a composed handoff.", ["skeleton-shimmer", "crossfade"], false, ["motion"], ["motion"], "light", { zh: "稳定几何上的骨架内容交接", en: "Skeleton-to-content handoff on stable geometry" }),

  component("activity-feed", "ActivityFeed", "data-commerce", "实时动态流", "Activity feed", "新动态插入、日期分组和未读位置保持连续。", "Preserves date groups and the unread boundary as live activity arrives.", ["stagger", "morph"], false, ["motion"], ["motion"], "light", { zh: "带未读边界的实时插入列表", en: "Live insertion feed with an unread boundary" }),
  component("integration-map", "IntegrationMap", "data-commerce", "集成关系图", "Integration map", "节点、连接路径与流动信号共同解释系统关系。", "Explains system relationships through nodes, routed links, and moving signals.", ["line-drawing", "stagger"], true, ["motion"], ["motion"], "medium", { zh: "SVG 路径连接的集成拓扑", en: "Integration topology connected by SVG paths" }),

  component("cursor-lens", "CursorLens", "cards-media", "局部对比镜", "Cursor lens", "通过可移动镜片局部比较同一媒体的两个状态。", "Compares two states of the same media through a movable detail lens.", ["before-after-slider", "spring"], true, ["motion"], ["motion"], "light", { zh: "指针与键盘可控的局部对比镜", en: "Pointer and keyboard controlled comparison lens" }),
  component("media-carousel", "MediaCarousel", "cards-media", "惯性媒体轮播", "Media carousel", "媒体卡片保留原生拖动惯性、吸附位置与键盘导航。", "Keeps native drag inertia, deliberate snap positions, and keyboard navigation across media cards.", ["drag-to-reorder", "parallax"], true, ["motion"], ["motion"], "light", { zh: "原生滚动惯性与吸附驱动的媒体轨道", en: "Media rail driven by native scroll inertia and snap" }),
  component("image-lightbox", "ImageLightbox", "cards-media", "连续画廊灯箱", "Gallery lightbox", "缩略图连续扩展为沉浸画面，并完整管理焦点与键盘浏览。", "Expands a thumbnail into an immersive gallery while managing focus and keyboard browsing.", ["morph", "scale-in"], true, ["motion"], ["motion"], "medium", { zh: "共享元素过渡连接缩略图与画廊", en: "Shared-element transition from thumbnail to gallery" }),
  component("scroll-story", "ScrollStory", "cards-media", "滚动产品叙事", "Scroll story", "将章节进度绑定到局部滚动，逐步改写产品画面。", "Binds local scroll progress to chapters that progressively reshape a product scene.", ["scroll-driven-animation", "stagger"], true, ["gsap"], ["gsap"], "medium", { zh: "ScrollTrigger 驱动的章节化产品场景", en: "Chaptered product scene driven by ScrollTrigger" }),
  component("procedural-product-viewer", "ProceduralProductViewer", "cards-media", "三维产品查看器", "3D product viewer", "程序化三维产品支持拖拽观察、惯性和回正。", "Presents a procedural 3D product with drag inspection, inertia, and recentering.", ["3d-tilt-flip", "spring"], true, ["motion", "three"], ["motion", "three"], "heavy", { zh: "可拖拽检查的 Three.js 产品模型", en: "Drag-inspectable Three.js product model" }, ["@types/three"]),

  component("dither-reveal-card", "DitherRevealCard", "visual-ambient", "抖动显影卡", "Dither reveal card", "像素抖动阈值随交互推进，让图像以材质感逐步显现。", "Advances a pixel-dither threshold so imagery develops with a tactile texture.", ["reveal", "hover-effect"], true, ["motion"], ["motion", "webgl"], "heavy", { zh: "原生 WebGL Bayer 阈值显影", en: "Native WebGL Bayer-threshold reveal" }),
  component("network-globe", "NetworkGlobe", "visual-ambient", "交互网络地球", "Network globe", "三维地球用节点、弧线和焦点切换展示全球连接。", "Maps global connections across a 3D globe with nodes, arcs, and selectable focus.", ["orbit", "line-drawing"], true, ["motion", "three"], ["motion", "three"], "heavy", { zh: "Three.js 节点弧线网络地球", en: "Three.js globe with routed network arcs" }, ["@types/three"]),
  component("kinetic-logo-exchange", "KineticLogoExchange", "visual-ambient", "动态品牌墙", "Kinetic logo exchange", "品牌标记在队列中换位、显影并自动停在当前选择。", "Reorders and reveals brand marks in a kinetic queue that yields to user selection.", ["morph", "blur"], false, ["motion"], ["motion"], "light", { zh: "布局交换与遮罩显影的品牌队列", en: "Brand queue with layout exchange and masked reveal" }),
  component("spotlight-bento", "SpotlightBento", "visual-ambient", "联动聚光矩阵", "Spotlight bento", "一个连续光场跨越多张卡片，强化矩阵之间的整体关系。", "Carries one continuous spotlight across multiple tiles to unify the bento surface.", ["hover-effect", "compositing"], true, ["motion"], ["motion"], "medium", { zh: "跨卡片共享坐标的连续光场", en: "Continuous spotlight sharing coordinates across tiles" }),

  v6Component({ id: "scroll-media-expansion", exportName: "ScrollMediaExpansion", category: "hero-story", name: { zh: "滚动媒体扩展", en: "Scroll media expansion" }, description: { zh: "让受限媒体卡在章节滚动中扩展为沉浸式主视觉。", en: "Expands contained media into an immersive hero through chapter scrolling." }, primitiveIds: ["scroll-driven-animation", "scale-in"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "媒体与视口逐步合并为一个连续画面", en: "Media and viewport resolve into one continuous frame" }, featured: true, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "全幅海岸媒体与章节轨", en: "Full-bleed coastal media with chapter rail" }, assetProvenance: "local-asset" }),
  v6Component({ id: "device-scroll-reveal", exportName: "DeviceScrollReveal", category: "hero-story", name: { zh: "设备滚动展示", en: "Device scroll reveal" }, description: { zh: "在设备框内同步推进产品屏幕、章节文案和产品状态。", en: "Advances product screens, chapter copy, and product state inside a device frame." }, primitiveIds: ["scroll-driven-animation", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "设备外框与屏幕内容一起推进", en: "Device chrome and screen content advance together" }, featured: true, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "设备框中的产品步骤", en: "Product step inside a device frame" }, assetProvenance: "self-contained" }),
  v6Component({ id: "cinematic-hero", exportName: "CinematicHero", category: "hero-story", name: { zh: "电影式主视觉", en: "Cinematic hero" }, description: { zh: "用图像、排版和行动按钮建立有节奏的品牌开场。", en: "Uses image, typography, and action to establish a paced brand opening." }, primitiveIds: ["scale-in", "reveal"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "大图、标题和行动按顺序抵达", en: "Media, title, and action arrive in deliberate sequence" }, featured: true, sceneFamily: "editorial-warm", motionRole: "lively", primaryState: { zh: "暖色图形与大标题", en: "Warm graphic field with display title" }, assetProvenance: "self-contained" }),
  v6Component({ id: "shader-hero", exportName: "ShaderHero", category: "hero-story", name: { zh: "着色器主视觉", en: "Shader hero" }, description: { zh: "以低功耗 WebGL 场域让指针在主视觉周围塑造氛围。", en: "Uses a low-power WebGL field that reshapes around pointer intent." }, primitiveIds: ["hover-effect", "idle-animation"], dependencies: ["motion"], engines: ["motion", "webgl"], runtimeCost: "heavy", signature: { zh: "指针在发光场域中改变波纹焦点", en: "Pointer input reshapes the focal wave field" }, featured: true, sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "静止的深色光场与清晰标题", en: "Still dark light field with legible heading" }, assetProvenance: "generated" }),
  v6Component({ id: "split-screen-reveal", exportName: "SplitScreenReveal", category: "hero-story", name: { zh: "分屏揭示", en: "Split screen reveal" }, description: { zh: "用可拖动边界连接两个产品状态或叙事视角。", en: "Connects two product states or story perspectives with a draggable boundary." }, primitiveIds: ["before-after-slider", "reveal"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "分界线成为两端叙事的过渡", en: "The split boundary becomes the narrative transition" }, sceneFamily: "editorial-warm", motionRole: "ui", primaryState: { zh: "两个并置画面与居中滑块", en: "Two juxtaposed scenes with centered slider" }, assetProvenance: "self-contained" }),
  v6Component({ id: "screenshot-stack", exportName: "ScreenshotStack", category: "hero-story", name: { zh: "截图层叠", en: "Screenshot stack" }, description: { zh: "用前后层次呈现多个产品界面，并维持当前焦点。", en: "Presents multiple product surfaces in depth while retaining the active focus." }, primitiveIds: ["morph", "scale-in"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "当前截图向前推进，其他截图保留上下文", en: "Active screenshot moves forward while context stays visible" }, featured: true, sceneFamily: "spatial-dark", motionRole: "gentle", primaryState: { zh: "深色空间中的产品截图堆栈", en: "Product screenshot stack in dark space" }, assetProvenance: "self-contained" }),
  v6Component({ id: "terminal-hero", exportName: "TerminalHero", category: "hero-story", name: { zh: "终端主视觉", en: "Terminal hero" }, description: { zh: "通过可逐步执行的命令展示开发者工作流和结果。", en: "Demonstrates a developer workflow and result through progressive commands." }, primitiveIds: ["typewriter", "perceived-performance"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "命令、输出和完成状态组成一个循环", en: "Command, output, and completion form one loop" }, sceneFamily: "spatial-dark", motionRole: "ui", primaryState: { zh: "等待执行的终端工作流", en: "Terminal workflow ready to run" }, assetProvenance: "self-contained" }),
  v6Component({ id: "product-orbit-hero", exportName: "ProductOrbitHero", category: "hero-story", name: { zh: "产品轨道主视觉", en: "Product orbit hero" }, description: { zh: "围绕中心产品对象布置能力，并让焦点与文案同步。", en: "Arranges capabilities around a central product object with synchronized focus copy." }, primitiveIds: ["orbit", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "轨道位置与能力说明同步切换", en: "Orbit position and capability copy change together" }, featured: true, sceneFamily: "spatial-dark", motionRole: "gentle", primaryState: { zh: "中心对象周围的能力轨道", en: "Capability orbit around a central object" }, assetProvenance: "self-contained" }),

  v6Component({ id: "expandable-card", exportName: "ExpandableCard", category: "cards-media", name: { zh: "展开卡片", en: "Expandable card" }, description: { zh: "让紧凑故事卡在原位展开为完整阅读表面。", en: "Expands a compact story card in place into a full reading surface." }, primitiveIds: ["morph", "scale-in"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "共享几何保留卡片的起点和上下文", en: "Shared geometry preserves the card origin and context" }, featured: true, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "温暖编辑图片卡片", en: "Warm editorial image card" }, assetProvenance: "local-asset" }),
  v6Component({ id: "focus-gallery", exportName: "FocusGallery", category: "cards-media", name: { zh: "焦点画廊", en: "Focus gallery" }, description: { zh: "让一张图片获得焦点，周围媒体同步退让。", en: "Lets one image gain focus while neighboring media yields." }, primitiveIds: ["morph", "parallax"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "焦点、裁切和说明一起变化", en: "Focus, crop, and caption change together" }, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "中心焦点图与两侧媒体", en: "Centered focus image with neighboring media" }, assetProvenance: "self-contained" }),
  v6Component({ id: "card-stack", exportName: "CardStack", category: "cards-media", name: { zh: "卡片堆栈", en: "Card stack" }, description: { zh: "在紧凑空间中逐张浏览叠放的记录或故事。", en: "Browses stacked records or stories in a compact space." }, primitiveIds: ["swipe-to-dismiss", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "当前卡片离开后露出下一层", en: "Current card exits to expose the next layer" }, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "可继续浏览的顶层卡片", en: "Top card ready for continued browsing" }, assetProvenance: "self-contained" }),
  v6Component({ id: "animated-testimonials", exportName: "AnimatedTestimonials", category: "cards-media", name: { zh: "动态客户证言", en: "Animated testimonials" }, description: { zh: "让人物、引语、归属和进度作为一个连续证据单元切换。", en: "Transitions portrait, quote, attribution, and progress as one evidence unit." }, primitiveIds: ["crossfade", "stagger"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "人物与引语以同一节奏交接", en: "Portrait and quote hand off in one rhythm" }, featured: true, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "人物照片与完整客户引语", en: "Portrait photography with complete customer quote" }, assetProvenance: "local-asset" }),
  v6Component({ id: "coverflow-gallery", exportName: "CoverflowGallery", category: "cards-media", name: { zh: "封面流画廊", en: "Coverflow gallery" }, description: { zh: "以深度、吸附和键盘浏览呈现媒体序列。", en: "Browses media with depth, snapping, and keyboard control." }, primitiveIds: ["parallax", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "当前媒体旋转进入稳定正面", en: "Active media rotates into a stable frontal position" }, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "正面媒体与两侧倾斜预览", en: "Frontal media with angled adjacent previews" }, assetProvenance: "self-contained" }),
  v6Component({ id: "image-trail", exportName: "ImageTrail", category: "cards-media", name: { zh: "图像轨迹", en: "Image trail" }, description: { zh: "沿指针或拖动路径生成并自动回收克制的图像碎片。", en: "Generates and retires restrained image fragments along pointer or drag paths." }, primitiveIds: ["hover-effect", "stagger"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "图像沿路径出现并干净退场", en: "Images appear along the path and retire cleanly" }, featured: true, sceneFamily: "editorial-warm", motionRole: "lively", primaryState: { zh: "森林主图上的静态轨迹首帧", en: "Forest lead image with still trail frame" }, assetProvenance: "local-asset" }),
  v6Component({ id: "pixelated-image", exportName: "PixelatedImage", category: "cards-media", name: { zh: "像素图像", en: "Pixelated image" }, description: { zh: "把图像分辨率作为可控的显影和切换材质。", en: "Uses image resolution as a controllable reveal and transition material." }, primitiveIds: ["reveal", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "像素结构逐步解析为完整图像", en: "Pixel structure resolves into a complete image" }, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "已解析的编辑图像", en: "Resolved editorial image" }, assetProvenance: "self-contained" }),
  v6Component({ id: "chromatic-image", exportName: "ChromaticImage", category: "cards-media", name: { zh: "色差图像", en: "Chromatic image" }, description: { zh: "在聚焦时为编辑图片增加可控的色彩通道位移。", en: "Adds controlled color-channel displacement to editorial media on focus." }, primitiveIds: ["hover-effect", "blur"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "色彩位移随焦点出现并平稳归位", en: "Color displacement follows focus and settles cleanly" }, sceneFamily: "editorial-warm", motionRole: "ui", primaryState: { zh: "静止的彩色编辑图像", en: "Still chromatic editorial image" }, assetProvenance: "self-contained" }),
  v6Component({ id: "code-comparison", exportName: "CodeComparison", category: "cards-media", name: { zh: "代码对比", en: "Code comparison" }, description: { zh: "把实现差异与渲染结果绑定在一个可切换的比较面。", en: "Binds implementation differences and rendered output inside one switchable comparison surface." }, primitiveIds: ["crossfade", "morph"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "选择差异同时更新代码和预览", en: "Selected difference updates code and preview together" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "代码与结果并排比较", en: "Side-by-side code and result comparison" }, assetProvenance: "self-contained" }),
  v6Component({ id: "before-after-comparison", exportName: "BeforeAfterComparison", category: "cards-media", name: { zh: "前后对比", en: "Before and after comparison" }, description: { zh: "用稳定边界比较两张完整图像状态。", en: "Compares two complete image states through a stable boundary." }, primitiveIds: ["before-after-slider", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "边界无布局跳动地揭示两种状态", en: "Stable boundary reveals both states without layout shift" }, sceneFamily: "editorial-warm", motionRole: "ui", primaryState: { zh: "居中对比边界", en: "Centered comparison boundary" }, assetProvenance: "self-contained" }),

  v6Component({ id: "split-text-reveal", exportName: "SplitTextReveal", category: "text-type", name: { zh: "分段文字揭示", en: "Split text reveal" }, description: { zh: "按词或字符揭示标题，并在静止状态保持完整可读。", en: "Reveals a heading by word or character while retaining complete static legibility." }, primitiveIds: ["reveal", "stagger"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "文字分段组装为稳定标题", en: "Text segments assemble into a stable heading" }, featured: true, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "完整显示的大型编辑标题", en: "Fully assembled editorial display heading" }, assetProvenance: "self-contained" }),
  v6Component({ id: "text-scramble", exportName: "TextScramble", category: "text-type", name: { zh: "文字扰动", en: "Text scramble" }, description: { zh: "让技术标签与状态通过字符替换快速落定。", en: "Transitions technical labels and status through quick character substitution." }, primitiveIds: ["typewriter", "text-morph"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "噪点字符快速收束为可读状态", en: "Noisy characters resolve quickly into readable state" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "稳定的技术状态输出", en: "Stable technical status output" }, assetProvenance: "self-contained" }),
  v6Component({ id: "text-morph", exportName: "TextMorph", category: "text-type", name: { zh: "文字变形", en: "Text morph" }, description: { zh: "在固定阅读节奏内切换相关短语，保持宽度稳定。", en: "Moves between related phrases within a fixed reading rhythm and stable width." }, primitiveIds: ["text-morph", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "短语交接时周围布局保持稳定", en: "Surrounding layout stays stable as phrases hand off" }, sceneFamily: "editorial-warm", motionRole: "ui", primaryState: { zh: "居中的短语状态", en: "Centered phrase state" }, assetProvenance: "self-contained" }),
  v6Component({ id: "text-loop", exportName: "TextLoop", category: "text-type", name: { zh: "文字循环", en: "Text loop" }, description: { zh: "在紧凑徽标或行内空间中循环可操作的短消息。", en: "Cycles compact, operable messages inside a badge or inline space." }, primitiveIds: ["loop", "slide-in"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "进入与离开方向解释消息顺序", en: "Entry and exit direction explains message sequence" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "静止的状态徽标", en: "Still status badge" }, assetProvenance: "self-contained" }),
  v6Component({ id: "scroll-velocity", exportName: "ScrollVelocity", category: "text-type", name: { zh: "滚动速度文字", en: "Scroll velocity" }, description: { zh: "让背景排版随页面速度短暂响应，停下时回到可读状态。", en: "Lets background typography respond briefly to page velocity and settle readable at rest." }, primitiveIds: ["scroll-driven-animation", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "速度影响文字位移，静止时回归基线", en: "Velocity shifts type while rest returns to baseline" }, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "可读的静止排版轨道", en: "Readable typography rail at rest" }, assetProvenance: "self-contained" }),
  v6Component({ id: "kinetic-heading", exportName: "KineticHeading", category: "text-type", name: { zh: "动态标题", en: "Kinetic heading" }, description: { zh: "用指针或键盘改变展示标题的字距、权重和张力。", en: "Changes display-heading spacing, weight, and tension through pointer or keyboard input." }, primitiveIds: ["hover-effect", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "标题作为一个整体响应输入张力", en: "Heading responds to input tension as one object" }, featured: true, sceneFamily: "editorial-warm", motionRole: "gentle", primaryState: { zh: "静止的绿色可变标题", en: "Still green variable heading" }, assetProvenance: "self-contained" }),

  v6Component({ id: "dynamic-toolbar", exportName: "DynamicToolbar", category: "overlays-surfaces", name: { zh: "动态工具栏", en: "Dynamic toolbar" }, description: { zh: "围绕当前任务展开紧凑操作，并在收起时保留主入口。", en: "Expands compact actions around the current task while retaining a clear primary entry." }, primitiveIds: ["morph", "press-tap-feedback"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "工具从紧凑主按钮周围展开", en: "Tools reorganize around a compact primary action" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "收起的圆形主工具", en: "Collapsed circular primary tool" }, assetProvenance: "self-contained" }),
  v6Component({ id: "resizable-sidebar", exportName: "ResizableSidebar", category: "overlays-surfaces", name: { zh: "可调整侧栏", en: "Resizable sidebar" }, description: { zh: "让产品侧栏在调整宽度或折叠时连续保留导航上下文。", en: "Preserves navigation context while a product sidebar resizes or collapses." }, primitiveIds: ["morph", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "标签、图标和内容宽度连续过渡", en: "Labels, icons, and content width transition continuously" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "展开的项目导航侧栏", en: "Expanded project navigation sidebar" }, assetProvenance: "self-contained" }),
  v6Component({ id: "notification-center", exportName: "NotificationCenter", category: "overlays-surfaces", name: { zh: "通知中心", en: "Notification center" }, description: { zh: "将瞬时通知扩展为可阅读、可处理的分组历史。", en: "Expands transient notices into a readable, actionable grouped history." }, primitiveIds: ["stagger", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "通知堆栈展开为阅读历史", en: "Notification stack expands into readable history" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "最近两条通知与未读计数", en: "Two recent notifications with unread count" }, assetProvenance: "self-contained" }),
  v6Component({ id: "mobile-bottom-sheet", exportName: "MobileBottomSheet", category: "overlays-surfaces", name: { zh: "移动底部面板", en: "Mobile bottom sheet" }, description: { zh: "以可拖拽、可聚焦的底部面板承载移动端操作和详情。", en: "Presents mobile actions and detail in a draggable, focus-managed bottom sheet." }, primitiveIds: ["slide-in", "spring"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "吸附、遮罩、焦点和关闭保持协调", en: "Snap, backdrop, focus, and dismissal stay coordinated" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "关闭状态下的操作入口", en: "Action trigger in closed state" }, assetProvenance: "self-contained" }),
  v6Component({ id: "page-transition-stack", exportName: "PageTransitionStack", category: "overlays-surfaces", name: { zh: "页面过渡堆栈", en: "Page transition stack" }, description: { zh: "通过前后页面的深度关系保留路由来源和目的地意义。", en: "Preserves route origin and destination meaning through layered page depth." }, primitiveIds: ["page-transition", "scale-in"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "离开页成为进入页的空间上下文", en: "Outgoing page becomes spatial context for incoming page" }, sceneFamily: "product-mono", motionRole: "gentle", primaryState: { zh: "前景页面与背景上下文", en: "Foreground page with background context" }, assetProvenance: "self-contained" }),
  v6Component({ id: "hover-preview", exportName: "HoverPreview", category: "overlays-surfaces", name: { zh: "悬停预览", en: "Hover preview" }, description: { zh: "在不离开当前位置的情况下预览目的地，并支持键盘和触控固定。", en: "Previews a destination without leaving place, with keyboard and touch pinning support." }, primitiveIds: ["hover-effect", "origin-aware-animation"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "预览从聚焦锚点旁出现", en: "Preview emerges beside the focused anchor" }, sceneFamily: "editorial-warm", motionRole: "ui", primaryState: { zh: "首个目的地的固定预览", en: "Pinned preview for first destination" }, assetProvenance: "local-asset" }),
  v6Component({ id: "workspace-switcher", exportName: "WorkspaceSwitcher", category: "overlays-surfaces", name: { zh: "工作区切换", en: "Workspace switcher" }, description: { zh: "在紧凑控制中管理工作区身份、最近状态和选择变化。", en: "Manages workspace identity, recent state, and selection changes in a compact control." }, primitiveIds: ["morph", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "身份标识和选择在同一控件中交接", en: "Identity and selection hand off inside one control" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "当前工作区切换按钮", en: "Current workspace switcher button" }, assetProvenance: "self-contained" }),

  v6Component({ id: "file-dropzone", exportName: "FileDropzone", category: "forms-input", name: { zh: "文件拖放区", en: "File dropzone" }, description: { zh: "通过拖放、选择器和粘贴接收文件，并给出明确的接收反馈。", en: "Accepts files through drag, picker, and paste with clear intake feedback." }, primitiveIds: ["scale-in", "perceived-performance"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "文件接收后交给可逆队列", en: "File intake hands off into a reversible queue" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "带浏览入口的文件接收区", en: "File intake surface with browse entry" }, assetProvenance: "self-contained" }),
  v6Component({ id: "multi-step-form", exportName: "MultiStepForm", category: "forms-input", name: { zh: "多步骤表单", en: "Multi-step form" }, description: { zh: "在短流程中维持步骤方向、校验、等待和已保存进度。", en: "Maintains step direction, validation, pending state, and saved progress in a short flow." }, primitiveIds: ["direction-aware-transition", "perceived-performance"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "步骤、校验和已保存状态连续呈现", en: "Steps, validation, and saved state stay continuous" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "第一步的已保留表单空间", en: "First-step form with reserved layout space" }, assetProvenance: "self-contained" }),
  v6Component({ id: "sign-in-flow", exportName: "SignInFlow", category: "forms-input", name: { zh: "登录流程", en: "Sign-in flow" }, description: { zh: "协调身份输入、等待、错误和成功，保留已填写内容。", en: "Coordinates identity input, pending, error, and success while retaining entered context." }, primitiveIds: ["crossfade", "shake-wiggle"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "登录卡在状态间保持同一几何", en: "Sign-in card keeps one geometry through states" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "完整的邮箱和密码登录卡", en: "Complete email and password sign-in card" }, assetProvenance: "self-contained" }),
  v6Component({ id: "onboarding-checklist", exportName: "OnboardingChecklist", category: "forms-input", name: { zh: "引导清单", en: "Onboarding checklist" }, description: { zh: "把设置任务转为有完成度和下一步提示的产品表面。", en: "Turns setup tasks into a product surface with progress and next-step clarity." }, primitiveIds: ["number-ticker", "press-tap-feedback"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "完成项推进整体进度", en: "Completed items advance the overall progress" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "部分完成的引导任务", en: "Partially complete onboarding tasks" }, assetProvenance: "self-contained" }),
  v6Component({ id: "date-range-picker", exportName: "DateRangePicker", category: "forms-input", name: { zh: "日期范围选择", en: "Date range picker" }, description: { zh: "在日历网格中区分悬停、暂定、确认范围和预设。", en: "Distinguishes hover, provisional, confirmed range, and presets inside a calendar grid." }, primitiveIds: ["before-after-slider", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "范围选择在日历空间中连续延展", en: "Range selection extends continuously through calendar space" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "已确认的周范围", en: "Confirmed weekly range" }, assetProvenance: "self-contained" }),
  v6Component({ id: "animated-combobox", exportName: "AnimatedCombobox", category: "forms-input", name: { zh: "动态组合框", en: "Animated combobox" }, description: { zh: "搜索和选择不断变化的结果集，同时保持键盘位置。", en: "Searches and selects a changing result set while preserving keyboard position." }, primitiveIds: ["crossfade", "stagger"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "高亮和结果排序保持焦点连续", en: "Highlight and result ordering preserve focus continuity" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "展开的项目搜索结果", en: "Expanded project search results" }, assetProvenance: "self-contained" }),
  v6Component({ id: "inline-edit", exportName: "InlineEdit", category: "forms-input", name: { zh: "就地编辑", en: "Inline edit" }, description: { zh: "在相同几何中处理阅读、编辑、保存、错误和提交状态。", en: "Handles read, edit, save, error, and commit states inside shared geometry." }, primitiveIds: ["morph", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "显示值原位变为可保存字段", en: "Displayed value becomes a savable field in place" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "可编辑的项目名称", en: "Editable project name" }, assetProvenance: "self-contained" }),
  v6Component({ id: "animated-empty-state", exportName: "AnimatedEmptyState", category: "forms-input", name: { zh: "动态空状态", en: "Animated empty state" }, description: { zh: "把有效空状态直接导向第一个明确操作和后续结果。", en: "Moves a valid empty state directly toward one clear first action and result." }, primitiveIds: ["scale-in", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "上下文、插画和行动作为一个序列到达", en: "Context, illustration, and action arrive as one sequence" }, sceneFamily: "editorial-warm", motionRole: "lively", primaryState: { zh: "有行动入口的空白工作面", en: "Empty working surface with clear action" }, assetProvenance: "self-contained" }),

  v6Component({ id: "metric-ticker", exportName: "MetricTicker", category: "data-commerce", name: { zh: "指标滚动数值", en: "Metric ticker" }, description: { zh: "把 KPI、涨跌方向和比较周期呈现为一次可读更新。", en: "Presents KPI, direction, and comparison period as one readable update." }, primitiveIds: ["number-ticker", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "数字、变化和周期一起更新", en: "Number, delta, and period update together" }, sceneFamily: "product-mono", motionRole: "lively", primaryState: { zh: "已结算的订阅指标", en: "Settled subscriber metric" }, assetProvenance: "self-contained" }),
  v6Component({ id: "animated-chart", exportName: "AnimatedChart", category: "data-commerce", name: { zh: "动态图表", en: "Animated chart" }, description: { zh: "比较数据范围与系列变化，保持标签和焦点稳定。", en: "Compares data ranges and series changes while keeping labels and focus stable." }, primitiveIds: ["line-drawing", "crossfade"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "图形变形时标签保持可读", en: "Geometry morphs while labels remain readable" }, sceneFamily: "product-mono", motionRole: "gentle", primaryState: { zh: "读者系列折线图", en: "Reader-series line chart" }, assetProvenance: "self-contained" }),
  v6Component({ id: "changelog-timeline", exportName: "ChangelogTimeline", category: "data-commerce", name: { zh: "更新日志时间线", en: "Changelog timeline" }, description: { zh: "以渐进焦点呈现产品或项目的历史记录。", en: "Presents product or project history with progressive focus." }, primitiveIds: ["crossfade", "stagger"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "当前条目连接日期、版本和详情", en: "Active entry connects date, version, and detail" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "当前版本的完整更新卡", en: "Complete update card for current release" }, assetProvenance: "self-contained" }),
  v6Component({ id: "kanban-board", exportName: "KanbanBoard", category: "data-commerce", name: { zh: "看板", en: "Kanban board" }, description: { zh: "让工作在列间移动，同时反馈落点、数量和周围卡片。", en: "Moves work across columns while responding through destination, count, and surrounding cards." }, primitiveIds: ["drag-to-reorder", "morph"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "落点列、计数和卡片同步响应", en: "Destination column, count, and cards respond together" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "三列发布看板", en: "Three-column release board" }, assetProvenance: "self-contained" }),
  v6Component({ id: "pricing-calculator", exportName: "PricingCalculator", category: "data-commerce", name: { zh: "价格计算器", en: "Pricing calculator" }, description: { zh: "通过数量、套餐和计费周期解释连续变化的价格。", en: "Explains changing price through quantity, tier, and billing interval." }, primitiveIds: ["number-ticker", "press-tap-feedback"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "light", signature: { zh: "控件、明细和总价一起更新", en: "Controls, breakdown, and total update together" }, sceneFamily: "product-mono", motionRole: "ui", primaryState: { zh: "年度工作室套餐明细", en: "Annual studio-plan breakdown" }, assetProvenance: "self-contained" }),
  v6Component({ id: "add-to-cart-morph", exportName: "AddToCartMorph", category: "data-commerce", name: { zh: "加入购物车变形", en: "Add-to-cart morph" }, description: { zh: "将产品选择连续连接到持久的购物车确认状态。", en: "Connects product selection continuously to a persistent cart confirmation state." }, primitiveIds: ["morph", "press-tap-feedback"], dependencies: ["motion"], engines: ["motion"], runtimeCost: "medium", signature: { zh: "选中商品收束为购物车确认", en: "Selected product resolves into cart confirmation" }, sceneFamily: "editorial-warm", motionRole: "lively", primaryState: { zh: "书籍商品与加入入口", en: "Book product with add entry" }, assetProvenance: "local-asset" }),

  v6Component({ id: "aurora-canvas", exportName: "AuroraCanvas", category: "visual-ambient", name: { zh: "极光画布", en: "Aurora canvas" }, description: { zh: "提供会在可见区域内缓慢呼吸的品牌环境光场。", en: "Provides a branded atmospheric field that breathes slowly while visible." }, primitiveIds: ["idle-animation", "compositing"], dependencies: ["motion"], engines: ["motion", "css"], runtimeCost: "medium", signature: { zh: "分层光色在画布中安静流动", en: "Layered color moves quietly across the canvas" }, featured: true, sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "静止的深色极光场", en: "Still dark aurora field" }, assetProvenance: "generated" }),
  v6Component({ id: "grid-distortion", exportName: "GridDistortion", category: "visual-ambient", name: { zh: "网格扭曲", en: "Grid distortion" }, description: { zh: "让网格或媒体表面围绕输入弯曲并平滑返回。", en: "Bends a grid or media surface around input and returns it smoothly." }, primitiveIds: ["hover-effect", "compositing"], dependencies: ["motion"], engines: ["motion", "css"], runtimeCost: "medium", signature: { zh: "场域围绕交互弯曲后回正", en: "Field bends around interaction and returns without snapping" }, sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "静止的紫色网格媒体", en: "Still violet grid media" }, assetProvenance: "self-contained" }),
  v6Component({ id: "fluid-glass-surface", exportName: "FluidGlassSurface", category: "visual-ambient", name: { zh: "流体玻璃表面", en: "Fluid glass surface" }, description: { zh: "为聚焦控制或产品媒体提供保持可读的折射玻璃表面。", en: "Creates a refractive glass surface for focused controls or media while preserving legibility." }, primitiveIds: ["hover-effect", "blur"], dependencies: ["motion"], engines: ["motion", "css"], runtimeCost: "medium", signature: { zh: "高光和折射跟随焦点并保持内容清晰", en: "Highlight and refraction follow focus while content stays clear" }, sceneFamily: "spatial-dark", motionRole: "ambient", primaryState: { zh: "静止的半透明玻璃表面", en: "Still translucent glass surface" }, assetProvenance: "self-contained" })
];

export function getRegistryComponent(id: string) {
  return registryComponents.find((entry) => entry.id === id);
}

export function registryComponentDependencies(entry: RegistryComponent) {
  return entry.dependencies;
}

export function registryComponentDevDependencies(entry: RegistryComponent) {
  return entry.devDependencies ?? [];
}

export function registryComponentEngines(entry: RegistryComponent): readonly ComponentEngine[] {
  return entry.engines;
}

export function registryComponentRuntimeCost(entry: RegistryComponent): ComponentRuntimeCost {
  return entry.runtimeCost;
}

export function registryComponentSignature(entry: RegistryComponent): LocalizedText {
  return entry.signature;
}

export function getComponentCategory(id: ComponentCategory) {
  return componentCategories.find((category) => category.id === id);
}

export function registryComponentName(id: string, locale: Locale) {
  return getRegistryComponent(id)?.name[locale] ?? id;
}

export const registryInstallCommand = (id: string) =>
  `npx shadcn@latest add https://motion-lexicon.pages.dev/r/${id}.json`;
