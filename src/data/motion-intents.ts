import type { LocalizedText } from "./types";

export type LocalizedPhrases = Record<"zh" | "en", readonly string[]>;

export type MotionIntentVariant = {
  variantId: string;
  reason: LocalizedText;
  signals: LocalizedPhrases;
};

export type MotionIntentGroup = {
  id: string;
  name: LocalizedText;
  reason: LocalizedText;
  signals: LocalizedPhrases;
  variants: readonly MotionIntentVariant[];
};

const localized = (zh: string, en: string): LocalizedText => ({ zh, en });

/**
 * Curated ambiguity groups for the first Motion Finder release. The signal
 * lists intentionally contain words people use to describe what they see and
 * feel, while each variant keeps a precise glossary identity.
 */
export const motionIntentGroups: readonly MotionIntentGroup[] = [
  {
    id: "entrance-feel",
    name: localized("入场手感", "Entrance feel"),
    reason: localized(
      "这段描述关注元素出现时的尺寸变化、弹性与落点手感。",
      "This description focuses on scale, elasticity, and settling during an entrance."
    ),
    signals: {
      zh: ["出现", "入场", "弹出来", "弹出", "卡片", "按钮", "浮层", "放大", "缩放", "落到位"],
      en: ["appear", "entrance", "enter", "card", "button", "popover", "grow", "scale", "settle"]
    },
    variants: [
      {
        variantId: "scale-in",
        reason: localized(
          "缩放入场从较小尺寸直接抵达最终状态，适合克制、稳定的出现。",
          "Scale in grows directly to the final size, fitting a restrained and stable entrance."
        ),
        signals: {
          zh: ["缩放入场", "缩放", "放大", "克制", "稳定", "平稳", "直接停住", "轻微"],
          en: ["scale in", "scale", "grow", "restrained", "stable", "steady", "subtle", "direct"]
        }
      },
      {
        variantId: "pop-in",
        reason: localized(
          "弹入带一次轻微过冲和回落，适合紧凑、活泼的强调。",
          "Pop in adds one compact overshoot and settle, fitting a playful accent."
        ),
        signals: {
          zh: ["弹入", "弹一下", "回弹", "过冲", "活泼", "俏皮", "轻快", "弹出来"],
          en: ["pop in", "pop", "overshoot", "bounce", "playful", "lively", "snappy"]
        }
      },
      {
        variantId: "spring",
        reason: localized(
          "弹簧通过质量、刚度与阻尼表现重量、惯性和收敛过程。",
          "Spring uses mass, stiffness, and damping to express weight, inertia, and settlement."
        ),
        signals: {
          zh: ["弹簧", "有重量", "重量", "沉", "惯性", "物理", "阻尼", "收得住", "弹性", "自然"],
          en: ["spring", "springy", "weight", "heavy", "inertia", "physics", "damping", "settle", "elastic", "natural"]
        }
      }
    ]
  },
  {
    id: "state-continuity",
    name: localized("状态连续性", "State continuity"),
    reason: localized(
      "这段描述关注两个状态之间如何保持视觉关联。",
      "This description focuses on preserving a visual relationship between two states."
    ),
    signals: {
      zh: ["状态切换", "切换", "变成", "变化", "前后", "连续", "同一个元素", "页面", "详情", "展开"],
      en: ["state change", "switch", "turn into", "transform", "before and after", "continuity", "same element", "page", "detail", "expand"]
    },
    variants: [
      {
        variantId: "crossfade",
        reason: localized(
          "交叉淡入淡出让同一位置的两个状态交换透明度，适合结构接近的内容替换。",
          "Crossfade exchanges opacity between overlapping states, fitting similarly structured content."
        ),
        signals: {
          zh: ["交叉淡入淡出", "淡入淡出", "叠化", "同一位置", "透明度", "渐隐", "渐现"],
          en: ["crossfade", "cross fade", "fade", "same spot", "overlap", "opacity", "dissolve"]
        }
      },
      {
        variantId: "morph",
        reason: localized(
          "形变连续插值几何形状，适合一个轮廓平滑变成另一个轮廓。",
          "Morph interpolates geometry continuously, fitting one shape becoming another."
        ),
        signals: {
          zh: ["形变", "变形", "形状", "轮廓", "灵动岛", "一个变成另一个"],
          en: ["morph", "shape", "reshape", "geometry", "dynamic island", "one shape into another"]
        }
      },
      {
        variantId: "shared-element-transition",
        reason: localized(
          "共享元素过渡让同一个对象跨布局移动并改变尺寸，适合缩略图展开等空间连续场景。",
          "A shared element transition moves and resizes the same object across layouts, fitting thumbnail-to-detail flows."
        ),
        signals: {
          zh: ["共享元素", "同一个元素", "缩略图", "卡片展开", "跨页面", "跨布局", "移动并放大", "详情页", "空间连续"],
          en: ["shared element", "same element", "thumbnail", "card expands", "across pages", "across layouts", "moves and grows", "detail page", "spatial continuity"]
        }
      }
    ]
  },
  {
    id: "sequence-timing",
    name: localized("顺序与编排", "Sequence and timing"),
    reason: localized(
      "这段描述关注多个动作的开始时间、先后关系与整体节奏。",
      "This description focuses on start times, ordering, and the rhythm of multiple motions."
    ),
    signals: {
      zh: ["时间", "开始", "先后", "多个", "一组", "列表", "节奏", "顺序", "动画之间"],
      en: ["timing", "start", "order", "multiple", "group", "list", "rhythm", "sequence", "between animations"]
    },
    variants: [
      {
        variantId: "delay",
        reason: localized(
          "延迟控制单段动画在触发后等待多久再开始。",
          "Delay controls how long one animation waits after its trigger before starting."
        ),
        signals: {
          zh: ["延迟", "等一下", "晚一点", "稍后", "等待", "过一会", "触发后"],
          en: ["delay", "wait", "later", "after a pause", "after trigger", "hold before"]
        }
      },
      {
        variantId: "stagger",
        reason: localized(
          "交错动画让同组项目依次启动，适合列表和卡片形成清晰级联。",
          "Stagger starts related items in sequence, creating a readable cascade for lists and cards."
        ),
        signals: {
          zh: ["交错", "依次", "一个接一个", "逐个", "列表", "卡片组", "级联", "排队出现"],
          en: ["stagger", "one by one", "in sequence", "sequentially", "list", "card grid", "cascade"]
        }
      },
      {
        variantId: "orchestration",
        reason: localized(
          "动效编排协调多段动作的开始、重叠与结束，让它们共同表达一次事件。",
          "Orchestration coordinates the starts, overlaps, and finishes of multiple motions as one event."
        ),
        signals: {
          zh: ["动效编排", "编排", "多段", "协调", "整体动作", "先后配合", "重叠", "时间线", "一整套"],
          en: ["orchestration", "choreography", "multiple motions", "coordinate", "coordinated", "overlap", "timeline", "whole sequence"]
        }
      }
    ]
  }
];
