import type {
  LocalizedText,
  MotionFamily,
  MotionRecipe,
  MotionSurfaceType
} from "./types";

export type CanonicalMotionMetadata = {
  id: string;
  representativeEntryId: string;
  categoryId: string;
  surfaceType: MotionSurfaceType;
  family: MotionFamily;
  aliases: readonly string[];
  canonicalPath: string;
  summary: LocalizedText;
};

export type ResolvedMotionCatalogMetadata = CanonicalMotionMetadata & {
  canonicalId: string;
  canonical: boolean;
};

function item(
  id: string,
  categoryId: string,
  surfaceType: MotionSurfaceType,
  family: MotionFamily,
  aliases: readonly string[],
  zh: string,
  en: string
): CanonicalMotionMetadata {
  return {
    id,
    representativeEntryId: id,
    categoryId,
    surfaceType,
    family,
    aliases,
    canonicalPath: `/${categoryId}/${id}`,
    summary: { zh, en }
  };
}

/**
 * The public catalog: 31 copy-ready components, 9 focused playgrounds, and
 * 4 review guides. The 47 legacy glossary routes below remain addressable and
 * resolve to one of these canonical destinations.
 */
export const canonicalMotionCatalog: readonly CanonicalMotionMetadata[] = [
  item("fade-in-fade-out", "entrances", "component", "entrance", [], "用透明度建立或移除元素，适合低干扰的内容出现与消失。", "Introduce or remove an element with opacity for low-distraction state changes."),
  item("slide-in", "entrances", "component", "entrance", ["enter-exit"], "沿明确方向引入内容，让新元素与界面空间关系保持清楚。", "Bring content in from a clear direction so its spatial relationship stays legible."),
  item("scale-in", "entrances", "component", "entrance", ["pop-in"], "从接近最终尺寸的位置放大元素，并可切换为带轻微过冲的 Pop in。", "Scale from near the final size, with an optional slight overshoot for Pop in."),
  item("reveal", "entrances", "component", "entrance", [], "通过裁切与轻微位移逐步展示内容，适合标题、媒体和分段内容。", "Reveal content with clipping and slight travel for headings, media, and sections."),

  item("stagger", "sequencing", "component", "timeline", [], "让列表项按短间隔依次进入，表达顺序并保持整体节奏。", "Introduce list items at short intervals to communicate order and rhythm."),
  item("keyframes", "sequencing", "playground", "timeline", ["interpolation-tween", "orchestration", "fill-mode", "stepped-animation"], "编排多阶段关键帧、插值、步进与结束状态。", "Compose multi-stage keyframes, interpolation, stepped motion, and fill behavior."),
  item("duration", "sequencing", "playground", "timeline", ["delay"], "比较时长与延迟对响应速度、节奏和可感知等待的影响。", "Compare how duration and delay affect response, rhythm, and perceived waiting."),

  item("translate", "transforms", "playground", "transform", ["scale", "rotate", "skew", "perspective", "transform-origin"], "组合位移、缩放、旋转、倾斜、透视和变换原点。", "Combine translation, scale, rotation, skew, perspective, and transform origin."),
  item("3d-tilt-flip", "transforms", "component", "transform", [], "用受控透视和旋转展示卡片正反面或悬停深度。", "Use controlled perspective and rotation for card flips or hover depth."),
  item("origin-aware-animation", "transforms", "component", "transform", [], "让展开或缩放从触发点发生，保持动作来源的空间连续性。", "Expand or scale from the trigger point to preserve spatial continuity."),

  item("crossfade", "state-transitions", "component", "state", [], "用重叠淡入淡出切换等尺寸状态，减少视觉跳变。", "Crossfade overlapping, similarly sized states to reduce visual jumps."),
  item("morph", "state-transitions", "component", "state", ["continuity-transition", "shared-element-transition", "layout-animation"], "在共享元素的前后布局之间建立连续形变。", "Create continuous transformation between before and after layouts of a shared element."),
  item("accordion-collapse", "state-transitions", "component", "state", [], "同步高度、透明度与图标状态，清晰表达内容展开和收起。", "Coordinate height, opacity, and icon state for clear disclosure transitions."),
  item("direction-aware-transition", "state-transitions", "component", "state", [], "根据导航方向匹配进入和离开方向，维持前后关系。", "Match enter and exit directions to navigation order and preserve context."),

  item("scroll-reveal", "scroll", "component", "scroll", [], "内容进入视口时触发一次轻量展示，并支持减少动态偏好。", "Reveal content once as it enters the viewport with a reduced-motion fallback."),
  item("scroll-driven-animation", "scroll", "playground", "scroll", [], "把动画进度绑定到滚动区间，调节起止位置与运动幅度。", "Bind animation progress to a scroll range and tune its start, end, and travel."),
  item("parallax", "scroll", "component", "scroll", [], "让前后景以克制的速度差移动，建立轻量层次感。", "Move foreground and background at restrained relative speeds to create depth."),
  item("page-transition", "scroll", "component", "scroll", ["view-transition"], "在页面或视图切换时保持内容连续，并为旧浏览器提供降级。", "Preserve continuity across page or view changes with a safe fallback."),

  item("hover-effect", "feedback", "component", "feedback", [], "在指针悬停时强化可交互性，同时保持布局稳定。", "Reinforce interactivity on pointer hover while keeping layout stable."),
  item("press-tap-feedback", "feedback", "component", "feedback", [], "在按下瞬间提供短促缩放和明暗反馈，确认输入已被接收。", "Confirm input immediately with a brief scale and contrast response."),
  item("hold-to-confirm", "feedback", "component", "feedback", [], "用可取消的进度反馈表达长按确认，降低误触风险。", "Show cancellable progress during hold-to-confirm interactions to reduce mistakes."),
  item("drag-to-reorder", "feedback", "component", "feedback", ["drag"], "在拖拽排序时保持拾取、占位和落点状态清楚。", "Keep pickup, placeholder, and drop states clear while reordering."),
  item("swipe-to-dismiss", "feedback", "component", "feedback", ["rubber-banding"], "让滑动距离映射到位移与透明度，并在阈值前提供阻尼。", "Map swipe distance to travel and opacity with resistance before the threshold."),
  item("shake-wiggle", "feedback", "component", "feedback", [], "用一次短促横向摆动提示错误或需要关注的输入。", "Use one brief horizontal shake for errors or inputs that need attention."),
  item("ripple", "feedback", "component", "feedback", [], "从输入坐标扩散轻量波纹，提供明确的触点反馈。", "Expand a restrained ripple from the input coordinate for precise touch feedback."),

  item("easing", "easing", "playground", "easing", ["ease-out", "ease-in", "ease-in-out", "linear", "cubic-bezier", "asymmetric-easing"], "比较常用缓动曲线和自定义贝塞尔曲线的速度变化。", "Compare common easing curves and custom cubic-bezier velocity profiles."),
  item("spring", "springs", "playground", "spring", ["stiffness-tension", "damping", "mass", "bounce", "perceptual-duration", "momentum", "velocity", "interruptible-animation"], "通过刚度、阻尼、质量和初速度调节真实的弹簧响应。", "Tune a physical spring response with stiffness, damping, mass, and initial velocity."),

  item("loop", "loops", "playground", "loop", ["alternate"], "比较循环方向、次数、暂停和节奏，避免持续动态干扰阅读。", "Compare loop direction, count, pauses, and rhythm while controlling distraction."),
  item("marquee", "loops", "component", "loop", [], "让超出容器的信息连续滚动，并在悬停或聚焦时暂停。", "Continuously scroll overflowing content and pause it on hover or focus."),
  item("orbit", "loops", "component", "loop", [], "让装饰节点围绕中心缓慢运行，适合低频状态展示。", "Move a decorative node slowly around a center for low-frequency status displays."),
  item("idle-animation", "loops", "component", "loop", ["pulse", "float"], "用低幅度呼吸或漂浮提示元素仍处于可用、等待或活跃状态。", "Use subtle breathing or floating motion for available, waiting, or active states."),

  item("blur", "polish-effects", "component", "effect", ["clip-path", "mask"], "结合模糊、透明度与遮罩柔和地揭示媒体或内容层。", "Reveal media or content layers with coordinated blur, opacity, and masking."),
  item("before-after-slider", "polish-effects", "component", "effect", [], "用可拖动分割线比较同一画面的前后状态。", "Compare before and after states of the same visual with a draggable divider."),
  item("line-drawing", "polish-effects", "component", "effect", [], "通过描边偏移逐步绘制图标、路径或解释性连线。", "Draw icons, paths, or explanatory connectors with stroke offset animation."),
  item("text-morph", "polish-effects", "component", "effect", [], "在长度接近的短文本之间进行平滑替换，保留阅读位置。", "Transition between similarly sized short labels while preserving reading position."),
  item("skeleton-shimmer", "polish-effects", "component", "effect", [], "在内容加载期间用低对比扫光表达进行中状态。", "Communicate loading progress with a low-contrast shimmer across placeholders."),
  item("number-ticker", "polish-effects", "component", "effect", ["tabular-numbers"], "使用等宽数字与垂直滚动稳定展示数值变化。", "Show changing values with tabular figures and stable vertical digit movement."),
  item("typewriter", "polish-effects", "component", "effect", [], "按字符逐步显示短文本，并为辅助技术保留完整内容。", "Reveal short text character by character while preserving complete accessible text."),

  item("frame-rate", "performance", "guide", "performance", ["jank", "dropped-frame"], "检查帧率、主线程长任务和掉帧，定位动态卡顿。", "Inspect frame rate, long main-thread tasks, and dropped frames to diagnose jank."),
  item("compositing", "performance", "playground", "performance", ["will-change", "layout-thrashing", "hardware-acceleration"], "比较合成友好属性、硬件加速提示与布局触发属性的渲染成本。", "Compare compositor-friendly properties, hardware-acceleration hints, and layout-triggering properties."),

  item("purposeful-animation", "principles", "guide", "principle", ["frequency-of-use", "spatial-consistency"], "审核每段动效的目的、出现频率和空间规则，保持一致体验。", "Review the purpose, frequency, and spatial rules of motion for a consistent experience."),
  item("anticipation", "principles", "playground", "principle", ["follow-through", "squash-and-stretch"], "调节预备、跟随与形变幅度，理解物理感对反馈的影响。", "Tune anticipation, follow-through, and deformation to understand physical feedback."),
  item("perceived-performance", "principles", "guide", "principle", [], "通过即时状态、骨架和连续反馈缩短用户感受到的等待。", "Reduce perceived waiting with immediate state changes, skeletons, and continuous feedback."),
  item("reduced-motion", "principles", "guide", "principle", [], "为移动、缩放、循环和视差提供等价的低动态表达。", "Provide equivalent low-motion treatments for travel, scaling, loops, and parallax.")
];

const canonicalById = new Map(
  canonicalMotionCatalog.map((metadata) => [metadata.id, metadata])
);

export const canonicalIdByEntryId: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    canonicalMotionCatalog.flatMap((metadata) => [
      [metadata.id, metadata.id],
      ...metadata.aliases.map((alias) => [alias, metadata.id])
    ])
  )
);

export type AliasMetadata = {
  entryId: string;
  canonicalId: string;
  sourcePath: string;
  canonicalPath: string;
  query?: string;
};

const presetQueryByAlias: Readonly<Record<string, string>> = {
  "enter-exit": "direction=out",
  "pop-in": "scale=86&overshoot=true",
  "interpolation-tween": "mode=tween",
  "fill-mode": "fill=both",
  "stepped-animation": "mode=steps",
  delay: "delay=120",
  scale: "transform=scale",
  rotate: "transform=rotate",
  skew: "transform=skew",
  perspective: "transform=perspective",
  "transform-origin": "transform=rotate&origin=top",
  "continuity-transition": "mode=continuity",
  "shared-element-transition": "mode=shared",
  "layout-animation": "mode=layout",
  drag: "distance=48",
  "rubber-banding": "resistance=65",
  "ease-out": "ease=ease-out",
  "ease-in": "ease=ease-in",
  "ease-in-out": "ease=ease-in-out",
  linear: "ease=linear",
  "cubic-bezier": "ease=custom",
  "asymmetric-easing": "ease=asymmetric",
  alternate: "direction=alternate",
  pulse: "style=pulse",
  float: "style=float",
  "clip-path": "reveal=clip",
  mask: "reveal=mask"
};

const sourceCategoryByAlias: Readonly<Record<string, string>> = {
  "hardware-acceleration": "principles"
};

export const aliasMetadata: readonly AliasMetadata[] = canonicalMotionCatalog.flatMap(
  (metadata) =>
    metadata.aliases.map((entryId) => {
      const query = presetQueryByAlias[entryId];
      return {
        entryId,
        canonicalId: metadata.id,
        sourcePath: `/${sourceCategoryByAlias[entryId] ?? metadata.categoryId}/${entryId}`,
        canonicalPath: metadata.canonicalPath,
        ...(query ? { query } : {})
      };
    })
);

export function getCanonicalId(entryOrId: string | { id: string }) {
  const entryId = typeof entryOrId === "string" ? entryOrId : entryOrId.id;
  return canonicalIdByEntryId[entryId];
}

export function getMotionCatalogMeta(
  entryOrId: MotionRecipe
): ResolvedMotionCatalogMetadata;
export function getMotionCatalogMeta(
  entryOrId: string | { id: string }
): ResolvedMotionCatalogMetadata | undefined;
export function getMotionCatalogMeta(
  entryOrId: string | { id: string }
): ResolvedMotionCatalogMetadata | undefined {
  const entryId = typeof entryOrId === "string" ? entryOrId : entryOrId.id;
  const canonicalId = getCanonicalId(entryId);
  if (!canonicalId) {
    return undefined;
  }

  const metadata = canonicalById.get(canonicalId);
  if (!metadata) {
    return undefined;
  }

  return {
    ...metadata,
    canonicalId,
    canonical: entryId === canonicalId
  };
}

export function isCanonicalEntryId(entryOrId: string | { id: string }) {
  const entryId = typeof entryOrId === "string" ? entryOrId : entryOrId.id;
  return getCanonicalId(entryId) === entryId;
}
