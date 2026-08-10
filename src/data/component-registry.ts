import type { Locale, LocalizedText } from "./types";

export type ComponentCategory =
  | "actions"
  | "overlays"
  | "inputs"
  | "navigation"
  | "data"
  | "feedback"
  | "media"
  | "visual";

export type ComponentEngine = "css" | "motion" | "gsap" | "three" | "webgl";
export type ComponentRuntimeCost = "light" | "medium" | "heavy";

export type RegistryComponent = {
  id: string;
  exportName: string;
  category: ComponentCategory;
  name: LocalizedText;
  description: LocalizedText;
  primitiveIds: readonly string[];
  dependencies?: readonly string[];
  devDependencies?: readonly string[];
  engines?: readonly ComponentEngine[];
  runtimeCost?: ComponentRuntimeCost;
  signature?: LocalizedText;
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
  { id: "feedback", name: { zh: "反馈", en: "Feedback" } },
  { id: "media", name: { zh: "媒体", en: "Media" } },
  { id: "visual", name: { zh: "视觉", en: "Visual" } }
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
  featured = false,
  dependencies?: readonly string[],
  engines?: readonly ComponentEngine[],
  runtimeCost?: ComponentRuntimeCost,
  signature?: LocalizedText,
  devDependencies?: readonly string[]
): RegistryComponent => ({
  id,
  exportName,
  category,
  name: { zh: zhName, en: enName },
  description: { zh: zhDescription, en: enDescription },
  primitiveIds,
  dependencies,
  devDependencies,
  engines,
  runtimeCost,
  signature,
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
  component("value-flash", "ValueFlash", "feedback", "数值变化", "Value flash", "用方向与短暂颜色反馈解释数值变化。", "Explains value changes with direction and brief color feedback.", ["number-ticker", "crossfade"], true),
  component("magnetic-action", "MagneticAction", "actions", "磁吸主按钮", "Magnetic action", "指针靠近时按钮轻量迎向触点，离开后自然回正。", "Lets a primary action lean toward a nearby pointer and settle cleanly on release.", ["hover-effect", "spring"], true, ["gsap"], ["gsap"], "light", { zh: "GSAP 快速追踪触点并回正", en: "GSAP pointer tracking with a clean return" }),
  component("radial-actions", "RadialActions", "actions", "放射快捷操作", "Radial actions", "围绕主操作展开一组方向清楚的快捷入口。", "Fans a compact set of shortcuts around one anchored action.", ["origin-aware-animation", "stagger"], false, ["motion"], ["motion"], "light", { zh: "以主按钮为原点的放射展开", en: "Radial reveal anchored to the primary action" }),
  component("theme-reveal", "ThemeReveal", "actions", "主题揭幕", "Theme reveal", "从切换触点扩散新主题，保持页面内容连续。", "Reveals a new theme outward from the exact toggle point.", ["page-transition", "reveal"], true, [], ["css"], "light", { zh: "View Transition 圆形裁切揭幕", en: "Circular View Transition theme reveal" }),

  component("mega-menu", "MegaMenu", "navigation", "大型导航菜单", "Mega menu", "高亮、面板和焦点路径共同维持导航上下文。", "Keeps highlight, panel, and focus movement in one continuous navigation path.", ["morph", "origin-aware-animation"], true, ["motion"], ["motion"], "light", { zh: "共享高亮驱动的大型菜单", en: "Mega menu driven by a shared highlight" }),
  component("floating-dock", "FloatingDock", "navigation", "浮动程序坞", "Floating dock", "图标随指针距离获得克制的弹性放大。", "Scales nearby destinations with restrained spring response to pointer distance.", ["spring", "hover-effect"], false, ["motion"], ["motion"], "light", { zh: "距离感知的弹性程序坞", en: "Distance-aware spring dock" }),

  component("voice-capture", "VoiceCapture", "inputs", "语音输入器", "Voice capture", "录制、声级、暂停和完成在同一输入器中连续切换。", "Coordinates recording, levels, pause, and completion inside one input surface.", ["idle-animation", "morph"], true, ["motion"], ["motion"], "light", { zh: "响应声级的语音采集流程", en: "Voice capture flow with responsive levels" }),

  component("toast-stack", "ToastStack", "feedback", "通知堆栈", "Toast stack", "通知按层级进入、展开，并支持滑动或键盘关闭。", "Layers incoming notices into a stack that expands and dismisses by swipe or keyboard.", ["stagger", "swipe-to-dismiss"], true, ["motion"], ["motion"], "light", { zh: "可展开并滑动关闭的通知队列", en: "Expandable notification queue with swipe dismissal" }),
  component("upload-queue", "UploadQueue", "feedback", "文件上传队列", "Upload queue", "把文件接收、逐项进度、重试和完成收拢成一个流程。", "Turns file intake, per-item progress, retry, and completion into one compact flow.", ["progress-bar", "stagger"], true, ["motion"], ["motion"], "light", { zh: "逐项推进并自动收拢的上传流程", en: "Per-file upload flow that resolves into completion" }),
  component("skeleton-reveal", "SkeletonReveal", "feedback", "内容成形加载", "Skeleton reveal", "骨架与真实内容共用稳定几何，载入后进行双层交接。", "Shares stable geometry between skeleton and content for a composed handoff.", ["skeleton-shimmer", "crossfade"], false, ["motion"], ["motion"], "light", { zh: "稳定几何上的骨架内容交接", en: "Skeleton-to-content handoff on stable geometry" }),

  component("activity-feed", "ActivityFeed", "data", "实时动态流", "Activity feed", "新动态插入、日期分组和未读位置保持连续。", "Preserves date groups and the unread boundary as live activity arrives.", ["stagger", "morph"], false, ["motion"], ["motion"], "light", { zh: "带未读边界的实时插入列表", en: "Live insertion feed with an unread boundary" }),
  component("integration-map", "IntegrationMap", "data", "集成关系图", "Integration map", "节点、连接路径与流动信号共同解释系统关系。", "Explains system relationships through nodes, routed links, and moving signals.", ["line-drawing", "stagger"], true, ["motion"], ["motion"], "medium", { zh: "SVG 路径连接的集成拓扑", en: "Integration topology connected by SVG paths" }),

  component("cursor-lens", "CursorLens", "media", "局部对比镜", "Cursor lens", "通过可移动镜片局部比较同一媒体的两个状态。", "Compares two states of the same media through a movable detail lens.", ["before-after-slider", "spring"], true, ["motion"], ["motion"], "light", { zh: "指针与键盘可控的局部对比镜", en: "Pointer and keyboard controlled comparison lens" }),
  component("media-carousel", "MediaCarousel", "media", "惯性媒体轮播", "Media carousel", "媒体卡片保留原生拖动惯性、吸附位置与键盘导航。", "Keeps native drag inertia, deliberate snap positions, and keyboard navigation across media cards.", ["drag-to-reorder", "parallax"], true, ["motion"], ["motion"], "light", { zh: "原生滚动惯性与吸附驱动的媒体轨道", en: "Media rail driven by native scroll inertia and snap" }),
  component("image-lightbox", "ImageLightbox", "media", "连续画廊灯箱", "Gallery lightbox", "缩略图连续扩展为沉浸画面，并完整管理焦点与键盘浏览。", "Expands a thumbnail into an immersive gallery while managing focus and keyboard browsing.", ["morph", "scale-in"], true, ["motion"], ["motion"], "medium", { zh: "共享元素过渡连接缩略图与画廊", en: "Shared-element transition from thumbnail to gallery" }),
  component("scroll-story", "ScrollStory", "media", "滚动产品叙事", "Scroll story", "将章节进度绑定到局部滚动，逐步改写产品画面。", "Binds local scroll progress to chapters that progressively reshape a product scene.", ["scroll-driven-animation", "stagger"], true, ["gsap"], ["gsap"], "medium", { zh: "ScrollTrigger 驱动的章节化产品场景", en: "Chaptered product scene driven by ScrollTrigger" }),
  component("procedural-product-viewer", "ProceduralProductViewer", "media", "三维产品查看器", "3D product viewer", "程序化三维产品支持拖拽观察、惯性和回正。", "Presents a procedural 3D product with drag inspection, inertia, and recentering.", ["3d-tilt-flip", "spring"], true, ["motion", "three"], ["motion", "three"], "heavy", { zh: "可拖拽检查的 Three.js 产品模型", en: "Drag-inspectable Three.js product model" }, ["@types/three"]),

  component("dither-reveal-card", "DitherRevealCard", "visual", "抖动显影卡", "Dither reveal card", "像素抖动阈值随交互推进，让图像以材质感逐步显现。", "Advances a pixel-dither threshold so imagery develops with a tactile texture.", ["reveal", "hover-effect"], true, ["motion"], ["motion", "webgl"], "heavy", { zh: "原生 WebGL Bayer 阈值显影", en: "Native WebGL Bayer-threshold reveal" }),
  component("network-globe", "NetworkGlobe", "visual", "交互网络地球", "Network globe", "三维地球用节点、弧线和焦点切换展示全球连接。", "Maps global connections across a 3D globe with nodes, arcs, and selectable focus.", ["orbit", "line-drawing"], true, ["motion", "three"], ["motion", "three"], "heavy", { zh: "Three.js 节点弧线网络地球", en: "Three.js globe with routed network arcs" }, ["@types/three"]),
  component("kinetic-logo-exchange", "KineticLogoExchange", "visual", "动态品牌墙", "Kinetic logo exchange", "品牌标记在队列中换位、显影并自动停在当前选择。", "Reorders and reveals brand marks in a kinetic queue that yields to user selection.", ["morph", "blur"], false, ["motion"], ["motion"], "light", { zh: "布局交换与遮罩显影的品牌队列", en: "Brand queue with layout exchange and masked reveal" }),
  component("spotlight-bento", "SpotlightBento", "visual", "联动聚光矩阵", "Spotlight bento", "一个连续光场跨越多张卡片，强化矩阵之间的整体关系。", "Carries one continuous spotlight across multiple tiles to unify the bento surface.", ["hover-effect", "compositing"], true, ["motion"], ["motion"], "medium", { zh: "跨卡片共享坐标的连续光场", en: "Continuous spotlight sharing coordinates across tiles" })
];

export function getRegistryComponent(id: string) {
  return registryComponents.find((entry) => entry.id === id);
}

export function registryComponentDependencies(entry: RegistryComponent) {
  return entry.dependencies ?? ["motion"];
}

export function registryComponentDevDependencies(entry: RegistryComponent) {
  return entry.devDependencies ?? [];
}

export function registryComponentEngines(entry: RegistryComponent): readonly ComponentEngine[] {
  if (entry.engines?.length) return entry.engines;
  const dependencies = registryComponentDependencies(entry);
  const inferred: ComponentEngine[] = [];
  if (dependencies.some((dependency) => dependency === "motion" || dependency.startsWith("motion@"))) inferred.push("motion");
  if (dependencies.some((dependency) => dependency === "gsap" || dependency.startsWith("gsap@"))) inferred.push("gsap");
  if (dependencies.some((dependency) => dependency === "three" || dependency.startsWith("three@"))) inferred.push("three");
  return inferred.length ? inferred : ["css"];
}

export function registryComponentRuntimeCost(entry: RegistryComponent): ComponentRuntimeCost {
  if (entry.runtimeCost) return entry.runtimeCost;
  const engines = registryComponentEngines(entry);
  return engines.includes("three") || engines.includes("webgl") ? "heavy" : "light";
}

export function registryComponentSignature(entry: RegistryComponent): LocalizedText {
  return entry.signature ?? entry.description;
}

export function getComponentCategory(id: ComponentCategory) {
  return componentCategories.find((category) => category.id === id);
}

export function registryComponentName(id: string, locale: Locale) {
  return getRegistryComponent(id)?.name[locale] ?? id;
}

export const registryInstallCommand = (id: string) =>
  `npx shadcn@latest add https://motion-lexicon.pages.dev/r/${id}.json`;
