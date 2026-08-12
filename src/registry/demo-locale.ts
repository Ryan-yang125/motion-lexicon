import type { Locale, LocalizedText } from "../data/types";

export const demoIds = [
  "agent-thinking-trace", "streaming-answer", "tool-call-stack", "approval-flow",
  "agent-task-queue", "prompt-composer", "context-sources", "diff-review",
  "agent-recommendation", "multi-agent-handoff", "agent-status-orbit",
  "copy-button", "loading-button", "hold-to-confirm", "long-press",
  "command-palette", "context-menu", "drawer", "dropdown", "modal", "popover",
  "expanding-search", "floating-label", "inline-validation", "otp-input",
  "password-strength", "slider-detents", "tag-input", "accordion", "hide-on-scroll",
  "pagination", "segmented-control", "tabs", "filter-grid", "reorder-list",
  "sortable-table", "progress-bar", "task-steps", "value-flash", "magnetic-action",
  "radial-actions", "theme-reveal", "mega-menu", "floating-dock", "voice-capture",
  "toast-stack", "upload-queue", "skeleton-reveal", "activity-feed", "integration-map",
  "cursor-lens", "media-carousel", "image-lightbox", "scroll-story",
  "procedural-product-viewer", "dither-reveal-card", "network-globe",
  "kinetic-logo-exchange", "spotlight-bento"
] as const;

export type DemoId = (typeof demoIds)[number];
export type DemoLocaleProps = { locale?: Locale };

export const demoLabels = {
  "agent-thinking-trace": { zh: "Agent 思考轨迹演示", en: "Agent thinking trace demo" },
  "streaming-answer": { zh: "流式回答演示", en: "Streaming answer demo" },
  "tool-call-stack": { zh: "工具调用堆栈演示", en: "Tool call stack demo" },
  "approval-flow": { zh: "人工审批流程演示", en: "Human approval flow demo" },
  "agent-task-queue": { zh: "Agent 任务队列演示", en: "Agent task queue demo" },
  "prompt-composer": { zh: "Agent 提示词编辑器演示", en: "Agent prompt composer demo" },
  "context-sources": { zh: "上下文来源卡演示", en: "Context sources demo" },
  "diff-review": { zh: "修改对比评审演示", en: "Diff review demo" },
  "agent-recommendation": { zh: "Agent 建议卡演示", en: "Agent recommendation demo" },
  "multi-agent-handoff": { zh: "多 Agent 交接演示", en: "Multi-agent handoff demo" },
  "agent-status-orbit": { zh: "Agent 状态轨道演示", en: "Agent status orbit demo" },
  "copy-button": { zh: "复制按钮演示", en: "Copy button demo" },
  "loading-button": { zh: "加载按钮演示", en: "Loading button demo" },
  "hold-to-confirm": { zh: "长按确认演示", en: "Hold to confirm demo" },
  "long-press": { zh: "长按操作演示", en: "Long press demo" },
  "command-palette": { zh: "命令面板演示", en: "Command palette demo" },
  "context-menu": { zh: "上下文菜单演示", en: "Context menu demo" },
  "drawer": { zh: "抽屉演示", en: "Drawer demo" },
  "dropdown": { zh: "下拉选择演示", en: "Dropdown demo" },
  "modal": { zh: "模态框演示", en: "Modal demo" },
  "popover": { zh: "气泡浮层演示", en: "Popover demo" },
  "expanding-search": { zh: "展开搜索演示", en: "Expanding search demo" },
  "floating-label": { zh: "浮动标签输入框演示", en: "Floating label demo" },
  "inline-validation": { zh: "行内校验演示", en: "Inline validation demo" },
  "otp-input": { zh: "验证码输入演示", en: "OTP input demo" },
  "password-strength": { zh: "密码强度演示", en: "Password strength demo" },
  "slider-detents": { zh: "刻度滑块演示", en: "Slider detents demo" },
  "tag-input": { zh: "标签输入演示", en: "Tag input demo" },
  "accordion": { zh: "折叠面板演示", en: "Accordion demo" },
  "hide-on-scroll": { zh: "滚动隐藏栏演示", en: "Hide on scroll demo" },
  "pagination": { zh: "分页演示", en: "Pagination demo" },
  "segmented-control": { zh: "分段控制演示", en: "Segmented control demo" },
  "tabs": { zh: "标签页演示", en: "Tabs demo" },
  "filter-grid": { zh: "筛选网格演示", en: "Filter grid demo" },
  "reorder-list": { zh: "拖拽排序列表演示", en: "Reorder list demo" },
  "sortable-table": { zh: "可排序表格演示", en: "Sortable table demo" },
  "progress-bar": { zh: "进度条演示", en: "Progress bar demo" },
  "task-steps": { zh: "任务步骤演示", en: "Task steps demo" },
  "value-flash": { zh: "数值变化演示", en: "Value flash demo" },
  "magnetic-action": { zh: "磁吸主按钮演示", en: "Magnetic action demo" },
  "radial-actions": { zh: "放射快捷操作演示", en: "Radial actions demo" },
  "theme-reveal": { zh: "主题揭幕演示", en: "Theme reveal demo" },
  "mega-menu": { zh: "大型导航菜单演示", en: "Mega menu demo" },
  "floating-dock": { zh: "浮动程序坞演示", en: "Floating dock demo" },
  "voice-capture": { zh: "语音输入器演示", en: "Voice capture demo" },
  "toast-stack": { zh: "通知堆栈演示", en: "Toast stack demo" },
  "upload-queue": { zh: "文件上传队列演示", en: "Upload queue demo" },
  "skeleton-reveal": { zh: "内容成形加载演示", en: "Skeleton reveal demo" },
  "activity-feed": { zh: "实时动态流演示", en: "Activity feed demo" },
  "integration-map": { zh: "集成关系图演示", en: "Integration map demo" },
  "cursor-lens": { zh: "局部对比镜演示", en: "Cursor lens demo" },
  "media-carousel": { zh: "惯性媒体轮播演示", en: "Media carousel demo" },
  "image-lightbox": { zh: "连续画廊灯箱演示", en: "Gallery lightbox demo" },
  "scroll-story": { zh: "滚动产品叙事演示", en: "Scroll story demo" },
  "procedural-product-viewer": { zh: "三维产品查看器演示", en: "3D product viewer demo" },
  "dither-reveal-card": { zh: "抖动显影卡演示", en: "Dither reveal card demo" },
  "network-globe": { zh: "交互网络地球演示", en: "Network globe demo" },
  "kinetic-logo-exchange": { zh: "动态品牌墙演示", en: "Kinetic logo exchange demo" },
  "spotlight-bento": { zh: "联动聚光矩阵演示", en: "Spotlight bento demo" }
} satisfies Record<DemoId, LocalizedText>;

export function demoText(id: DemoId, locale: Locale = "en") {
  return demoLabels[id][locale];
}

export function demoValue(locale: Locale = "en", zh: string, en: string) {
  return locale === "zh" ? zh : en;
}
