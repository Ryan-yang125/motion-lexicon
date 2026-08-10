import type { Locale, LocalizedText } from "./types";

export type ComponentCategory =
  | "actions"
  | "overlays"
  | "inputs"
  | "navigation"
  | "data"
  | "feedback";

export type RegistryComponent = {
  id: string;
  exportName: string;
  category: ComponentCategory;
  name: LocalizedText;
  description: LocalizedText;
  primitiveIds: readonly string[];
  featured?: boolean;
};

export const componentCategories: ReadonlyArray<{
  id: ComponentCategory;
  name: LocalizedText;
}> = [
  { id: "actions", name: { zh: "操作", en: "Actions" } },
  { id: "overlays", name: { zh: "浮层", en: "Overlays" } },
  { id: "inputs", name: { zh: "输入", en: "Inputs" } },
  { id: "navigation", name: { zh: "导航", en: "Navigation" } },
  { id: "data", name: { zh: "数据", en: "Data" } },
  { id: "feedback", name: { zh: "反馈", en: "Feedback" } }
];

const component = (
  id: string,
  exportName: string,
  category: ComponentCategory,
  zhName: string,
  enName: string,
  zhDescription: string,
  enDescription: string,
  primitiveIds: readonly string[],
  featured = false
): RegistryComponent => ({
  id,
  exportName,
  category,
  name: { zh: zhName, en: enName },
  description: { zh: zhDescription, en: enDescription },
  primitiveIds,
  featured
});

export const registryComponents: readonly RegistryComponent[] = [
  component("copy-button", "CopyButton", "actions", "复制按钮", "Copy button", "复制完成后原位切换状态，宽度保持稳定。", "Reports clipboard state in place without shifting nearby content.", ["press-tap-feedback", "text-morph"], true),
  component("loading-button", "LoadingButton", "actions", "加载按钮", "Loading button", "把等待、成功与失败收进同一个操作位置。", "Keeps pending, success, and error feedback inside one action.", ["press-tap-feedback", "crossfade"], true),
  component("hold-to-confirm", "HoldToConfirm", "actions", "长按确认", "Hold to confirm", "用可取消进度保护高风险操作。", "Protects destructive actions with cancellable hold progress.", ["hold-to-confirm", "line-drawing"], true),
  component("long-press", "LongPressButton", "actions", "长按操作", "Long press", "兼顾触控、指针和键盘的长按手势。", "A long-press gesture that works across touch, pointer, and keyboard.", ["hold-to-confirm", "press-tap-feedback"]),

  component("command-palette", "CommandPalette", "overlays", "命令面板", "Command palette", "搜索、键盘导航与焦点管理完整配合。", "Combines search, keyboard navigation, and deliberate focus management.", ["crossfade", "stagger"], true),
  component("context-menu", "ContextMenu", "overlays", "上下文菜单", "Context menu", "从触发坐标展开，并自动避开视口边缘。", "Opens from the trigger coordinate and stays inside the viewport.", ["origin-aware-animation", "scale-in"]),
  component("drawer", "Drawer", "overlays", "抽屉", "Drawer", "支持焦点锁定、拖拽关闭与可中断弹簧。", "Includes focus containment, drag dismissal, and interruptible spring motion.", ["spring", "slide-in"], true),
  component("dropdown", "Dropdown", "overlays", "下拉选择", "Dropdown", "选项高亮连续移动，键盘操作完整。", "Moves selection continuously with full keyboard behavior.", ["morph", "scale-in"]),
  component("modal", "Modal", "overlays", "模态框", "Modal", "稳定处理焦点、遮罩、退出与异步确认。", "Handles focus, backdrop, exit, and async confirmation as one flow.", ["scale-in", "crossfade"]),
  component("popover", "Popover", "overlays", "气泡浮层", "Popover", "根据触发点与空间方向确定展开原点。", "Derives its reveal origin from the trigger and available space.", ["origin-aware-animation", "scale-in"]),

  component("expanding-search", "ExpandingSearch", "inputs", "展开搜索", "Expanding search", "从工具栏动作自然展开为完整搜索框。", "Expands from a toolbar action into a focused search field.", ["morph", "crossfade"], true),
  component("floating-label", "FloatingLabelInput", "inputs", "浮动标签输入框", "Floating label", "输入内容时保留字段标签与上下文。", "Keeps the field label and context visible while typing.", ["translate", "crossfade"]),
  component("inline-validation", "InlineValidation", "inputs", "行内校验", "Inline validation", "把等待、错误和通过状态放在输入旁边。", "Places pending, error, and success states next to the input.", ["crossfade", "shake-wiggle"], true),
  component("otp-input", "OtpInput", "inputs", "验证码输入", "OTP input", "输入、粘贴、错误与成功反馈连续发生。", "Coordinates typing, paste, error, and success feedback.", ["shake-wiggle", "crossfade"]),
  component("password-strength", "PasswordStrength", "inputs", "密码强度", "Password strength", "规则检查与强度变化保持清晰节奏。", "Makes rule checks and strength changes legible as one response.", ["stagger", "progress-bar"]),
  component("slider-detents", "SliderDetents", "inputs", "刻度滑块", "Slider detents", "拖动时吸附语义刻度，并保留连续值。", "Snaps to meaningful detents while preserving continuous input.", ["spring", "drag-to-reorder"]),
  component("tag-input", "TagInput", "inputs", "标签输入", "Tag input", "新增、删除和拒绝状态都有明确反馈。", "Gives clear feedback for adding, removing, and rejecting tags.", ["scale-in", "shake-wiggle"]),

  component("accordion", "Accordion", "navigation", "折叠面板", "Accordion", "内容高度与开合状态保持连续。", "Keeps content height and disclosure state visually continuous.", ["accordion-collapse", "crossfade"], true),
  component("hide-on-scroll", "HideOnScroll", "navigation", "滚动隐藏栏", "Hide on scroll", "跟随滚动方向收起与恢复工具栏。", "Hides and restores a toolbar in response to scroll direction.", ["scroll-driven-animation", "slide-in"]),
  component("pagination", "Pagination", "navigation", "分页", "Pagination", "页码范围切换时保持当前页位置清楚。", "Keeps the current page legible while the visible range changes.", ["morph", "crossfade"]),
  component("segmented-control", "SegmentedControl", "navigation", "分段控制", "Segmented control", "共享高亮在选项之间连续移动。", "Carries one shared highlight between options.", ["morph", "press-tap-feedback"]),
  component("tabs", "Tabs", "navigation", "标签页", "Tabs", "指示器、方向与内容切换保持一致。", "Coordinates the indicator, direction, and panel change.", ["direction-aware-transition", "morph"], true),

  component("filter-grid", "FilterGrid", "data", "筛选网格", "Filter grid", "筛选结果重新排列时维持空间连续性。", "Preserves spatial continuity as filtered results rearrange.", ["layout-animation", "stagger"]),
  component("reorder-list", "ReorderList", "data", "拖拽排序列表", "Reorder list", "指针拖拽与键盘排序共享清晰落点。", "Provides clear drop position for pointer and keyboard reordering.", ["drag-to-reorder", "spring"], true),
  component("sortable-table", "SortableTable", "data", "可排序表格", "Sortable table", "排序变化通过行位置表达，数据保持可读。", "Explains sorting through row position while keeping data readable.", ["layout-animation", "crossfade"]),

  component("progress-bar", "ProgressBar", "feedback", "进度条", "Progress bar", "支持等待、确定进度与完成三个阶段。", "Covers pending, determinate, and complete progress states.", ["perceived-performance", "crossfade"]),
  component("task-steps", "TaskSteps", "feedback", "任务步骤", "Task steps", "让排队、执行、完成与失败状态连成一条流程。", "Connects queued, active, complete, and failed states into one flow.", ["stagger", "line-drawing"]),
  component("value-flash", "ValueFlash", "feedback", "数值变化", "Value flash", "用方向与短暂颜色反馈解释数值变化。", "Explains value changes with direction and brief color feedback.", ["number-ticker", "crossfade"], true)
];

export function getRegistryComponent(id: string) {
  return registryComponents.find((entry) => entry.id === id);
}

export function getComponentCategory(id: ComponentCategory) {
  return componentCategories.find((category) => category.id === id);
}

export function registryComponentName(id: string, locale: Locale) {
  return getRegistryComponent(id)?.name[locale] ?? id;
}

export const registryInstallCommand = (id: string) =>
  `npx shadcn@latest add https://motion-lexicon.pages.dev/r/${id}.json`;

