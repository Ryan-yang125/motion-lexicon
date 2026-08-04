import type { MotionPackKind } from "./motion-packs";
import type { LocalizedText } from "./types";

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

export const finderGuide = {
  eyebrow: text("从真实问题开始", "Start with a real interface question"),
  title: text("常见产品瞬间", "Common product moments"),
  copy: text(
    "选一个问题，查看动效基础和可直接复用的产品瞬间。",
    "Choose a question to explore motion primitives and reusable product moments."
  ),
  steps: [
    {
      title: text("描述变化", "Describe the change"),
      copy: text("说清对象、动作和想让用户感到的结果。", "Name the object, action, and outcome you want people to feel.")
    },
    {
      title: text("比较候选", "Compare candidates"),
      copy: text("用一个主预览逐个查看相近动效。", "Use one active preview to inspect related motion choices one at a time.")
    },
    {
      title: text("带走实现", "Take the implementation"),
      copy: text("调好参数，再复制提示词或前端代码。", "Tune the parameters, then copy the prompt or frontend code.")
    }
  ],
  starters: [
    {
      question: text("卡片进来时，想先有一下切入感，再慢慢停下来。", "A card should arrive with a quick entry, then settle gradually."),
      query: text("卡片先切入进来，然后慢慢停下来", "A card enters quickly, then settles gradually"),
      compare: ["spring", "pop-in", "scale-in"],
      packs: ["card-selection", "command-menu"] as const
    },
    {
      question: text("同一个元素从列表打开到详情，位置和大小要连贯。", "The same element should move smoothly from a list into detail."),
      query: text("让同一个元素在两个页面之间连贯移动", "Keep the same element continuous between list and detail"),
      compare: ["shared-element-transition", "morph", "crossfade"],
      packs: ["workspace-switch", "filter-results"] as const
    },
    {
      question: text("一组列表项要依次出现，节奏清楚，又别拖太久。", "A list should enter in sequence with a clear rhythm that stays brisk."),
      query: text("让一组列表项依次出现，节奏清楚一点", "Let a list appear in sequence with a clear rhythm"),
      compare: ["stagger", "delay", "orchestration"],
      packs: ["progress-steps", "publish-release"] as const
    },
    {
      question: text("保存以后，用户要马上知道操作已收到，结果也要清楚。", "After saving, people should see immediate acknowledgement and a clear outcome."),
      query: text("保存按钮有反馈，状态清楚地变成已保存", "Show save feedback and a clear saved state"),
      compare: ["scale-in", "pop-in", "spring"],
      packs: ["save-confirmation", "share-link"] as const
    },
    {
      question: text("卡片展开成详情时，要让用户感觉它还是同一个对象。", "A card expanding into detail should still feel like the same object."),
      query: text("卡片展开到详情页，还是同一个元素", "Keep a card continuous as it expands into detail"),
      compare: ["shared-element-transition", "morph", "crossfade"],
      packs: ["template-choice", "workspace-switch"] as const
    },
    {
      question: text("一个发布流程里，按钮、状态和时间线要有明确先后。", "In a publishing flow, the action, status, and timeline need clear order."),
      query: text("发布后按钮状态和时间线按顺序变化", "Sequence action, status, and timeline after publishing"),
      compare: ["orchestration", "stagger", "delay"],
      packs: ["publish-release", "scheduled-publish"] as const
    }
  ] satisfies ReadonlyArray<{
    question: LocalizedText;
    query: LocalizedText;
    compare: readonly string[];
    packs: readonly MotionPackKind[];
  }>
} as const;
