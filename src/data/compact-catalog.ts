import { canonicalMotionCatalog } from "./motion-catalog";
import type { LocalizedText, MotionFamily, MotionSurfaceType } from "./types";

export type CompactCatalogEntry = {
  id: string;
  categoryId: string;
  family: MotionFamily;
  surfaceType: MotionSurfaceType;
  name: LocalizedText;
  shortDescription: LocalizedText;
};

const compactNames: Readonly<Record<string, LocalizedText>> = {
  "fade-in-fade-out": { zh: "淡入 / 淡出", en: "Fade in / Fade out" },
  "slide-in": { zh: "滑入", en: "Slide in" },
  "scale-in": { zh: "缩放入场", en: "Scale in" },
  reveal: { zh: "揭示", en: "Reveal" },
  stagger: { zh: "交错动画", en: "Stagger" },
  keyframes: { zh: "关键帧", en: "Keyframes" },
  duration: { zh: "时长", en: "Duration" },
  translate: { zh: "位移", en: "Translate" },
  "3d-tilt-flip": { zh: "3D 倾斜 / 翻转", en: "3D tilt / Flip" },
  "origin-aware-animation": { zh: "基于触发源的动画", en: "Origin-aware animation" },
  crossfade: { zh: "交叉淡入淡出", en: "Crossfade" },
  morph: { zh: "形变", en: "Morph" },
  "accordion-collapse": { zh: "手风琴 / 折叠", en: "Accordion / Collapse" },
  "direction-aware-transition": { zh: "方向感过渡", en: "Direction-aware transition" },
  "scroll-reveal": { zh: "滚动揭示", en: "Scroll reveal" },
  "scroll-driven-animation": { zh: "滚动驱动动画", en: "Scroll-driven animation" },
  parallax: { zh: "视差", en: "Parallax" },
  "page-transition": { zh: "页面过渡", en: "Page transition" },
  "hover-effect": { zh: "悬停效果", en: "Hover effect" },
  "press-tap-feedback": { zh: "按压 / 轻触反馈", en: "Press / Tap feedback" },
  "hold-to-confirm": { zh: "长按确认", en: "Hold to confirm" },
  "drag-to-reorder": { zh: "拖拽排序", en: "Drag to reorder" },
  "swipe-to-dismiss": { zh: "滑动关闭", en: "Swipe to dismiss" },
  "shake-wiggle": { zh: "摇晃 / 抖动", en: "Shake / Wiggle" },
  ripple: { zh: "涟漪", en: "Ripple" },
  easing: { zh: "缓动", en: "Easing" },
  spring: { zh: "弹簧", en: "Spring" },
  loop: { zh: "循环", en: "Loop" },
  marquee: { zh: "跑马灯", en: "Marquee" },
  orbit: { zh: "环绕", en: "Orbit" },
  "idle-animation": { zh: "空闲动效", en: "Idle animation" },
  blur: { zh: "模糊", en: "Blur" },
  "before-after-slider": { zh: "前后对比滑杆", en: "Before / after slider" },
  "line-drawing": { zh: "线条绘制", en: "Line drawing" },
  "text-morph": { zh: "文字形变", en: "Text morph" },
  "skeleton-shimmer": { zh: "骨架屏 / 微光", en: "Skeleton / Shimmer" },
  "number-ticker": { zh: "数字滚动", en: "Number ticker" },
  typewriter: { zh: "打字机", en: "Typewriter" },
  "frame-rate": { zh: "帧率（FPS）", en: "Frame rate (FPS)" },
  compositing: { zh: "合成", en: "Compositing" },
  "purposeful-animation": { zh: "有目的的动效", en: "Purposeful animation" },
  anticipation: { zh: "预备动作", en: "Anticipation" },
  "perceived-performance": { zh: "感知性能", en: "Perceived performance" },
  "reduced-motion": { zh: "减弱动效", en: "Reduced motion" }
};

/**
 * Lightweight discovery data for the landing page. Detailed parameters,
 * guidance, exports, and runtimes load only after a user opens the library.
 */
export const compactCatalogEntries: readonly CompactCatalogEntry[] =
  canonicalMotionCatalog.map((metadata) => {
    const name = compactNames[metadata.id];
    if (!name) {
      throw new Error(`Missing compact catalog name: ${metadata.id}`);
    }
    return {
      id: metadata.id,
      categoryId: metadata.categoryId,
      family: metadata.family,
      surfaceType: metadata.surfaceType,
      name,
      shortDescription: metadata.summary
    };
  });

const compactCatalogById = new Map(
  compactCatalogEntries.map((entry) => [entry.id, entry])
);

export function getCompactCatalogEntry(id: string) {
  return compactCatalogById.get(id);
}
