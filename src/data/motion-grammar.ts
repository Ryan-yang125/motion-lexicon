import type { Locale, LocalizedText } from "./types";

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

export type MotionSkillModeId = "build-page" | "recommend" | "compose" | "implement" | "review" | "contribute";

export type MotionBlueprintActor = {
  id: string;
  role: "trigger" | "hero" | "status" | "record" | "environment";
  label: LocalizedText;
  responsibility: LocalizedText;
};

export type MotionBlueprintBeat = {
  at: string;
  actorId: string;
  purpose: LocalizedText;
  primitiveIds: readonly string[];
  from: LocalizedText;
  to: LocalizedText;
  durationMs: number;
  easing: "arrive" | "leave" | "feedback" | "linear" | "spring";
};

export type MotionBlueprintContract = {
  version: "2.0";
  locale: Locale;
  intent: {
    productGoal: string;
    userIntent: string;
    feeling: string;
  };
  scope: {
    surface: string;
    framework: string;
    input: readonly ("pointer" | "keyboard" | "touch" | "programmatic")[];
  };
  stateGraph: {
    initial: string;
    states: readonly {
      id: string;
      label: string;
      role: "initial" | "engaged" | "pending" | "success" | "failure" | "recovery" | "terminal";
    }[];
    transitions: readonly {
      event: string;
      from: string;
      to: string;
      interrupt: "replace" | "reverse" | "settle" | "queue";
    }[];
  };
  actors: readonly {
    id: string;
    role: "primary" | "supporting";
    kind: "trigger" | "hero" | "status" | "record" | "environment";
    element: string;
  }[];
  beats: readonly {
    id: string;
    at: number | string;
    actor: string;
    purpose: "orient" | "confirm" | "preserve-continuity" | "reveal" | "recover";
    primitive: string;
    from: string;
    to: string;
    durationMs: number;
    easing: "arrive" | "leave" | "feedback" | "linear" | "spring";
    properties: readonly ("transform" | "opacity" | "color" | "clip" | "progress")[];
  }[];
  accessibility: {
    reducedMotion: string;
    focus: string;
    aria: string;
    keyboard: string;
  };
  delivery: {
    formats: readonly ("prompt" | "html" | "css" | "js" | "react" | "vue" | "svelte")[];
    integration: string;
  };
  provenance: {
    status: "draft" | "candidate" | "published";
    foundations: readonly string[];
    moments: readonly string[];
    confidence: "high" | "medium" | "exploratory";
    evidence?: string;
  };
};

export type MotionBlueprint = {
  id: string;
  status: "candidate" | "published";
  title: LocalizedText;
  brief: LocalizedText;
  scene: LocalizedText;
  stateGraph: readonly {
    id: string;
    label: LocalizedText;
    meaning: LocalizedText;
  }[];
  actors: readonly MotionBlueprintActor[];
  beats: readonly MotionBlueprintBeat[];
  accessibility: {
    keyboard: LocalizedText;
    reducedMotion: LocalizedText;
    liveRegion: LocalizedText;
  };
  delivery: {
    format: readonly ("react" | "html" | "css" | "js")[];
    implementation: LocalizedText;
  };
  provenance: {
    source: LocalizedText;
    relatedMoments: readonly string[];
    relatedPrimitives: readonly string[];
  };
  contract: MotionBlueprintContract;
};

export const motionSkillModes = [
  {
    id: "build-page" as const,
    title: text("构建页面", "Build Page"),
    description: text("把产品任务、页面层级和已发布组件组合成完整 React 页面。", "Combine a product job, page hierarchy, and published components into a complete React page."),
    deliverable: text("页面计划、完整实现与验收记录", "Page plan, complete implementation, and acceptance evidence")
  },
  {
    id: "recommend" as const,
    title: text("推荐", "Recommend"),
    description: text("把一句产品需求收敛为一组有理由的动效候选。", "Turn a product brief into a reasoned set of motion candidates."),
    deliverable: text("候选、适用场景与取舍", "Candidates, fit, and tradeoffs")
  },
  {
    id: "compose" as const,
    title: text("编排", "Compose"),
    description: text("用状态图、角色和节拍组织一段完整产品瞬间。", "Use states, actors, and beats to organise one complete product moment."),
    deliverable: text("Motion Blueprint", "Motion Blueprint")
  },
  {
    id: "implement" as const,
    title: text("实现", "Implement"),
    description: text("产出贴合现有界面的可复制实现，并按场景选择 Motion、GSAP、Three.js、WebGL 或 CSS。", "Produce a copy-ready implementation that fits the interface, choosing Motion, GSAP, Three.js, WebGL, or CSS for the scene."),
    deliverable: text("可接入实现", "Integration-ready implementation")
  },
  {
    id: "review" as const,
    title: text("评审", "Review"),
    description: text("检查状态含义、节奏、可中断性、性能和减弱动效。", "Check state meaning, timing, interruption, performance, and reduced motion."),
    deliverable: text("按优先级排序的修改清单", "Prioritised revision list")
  },
  {
    id: "contribute" as const,
    title: text("贡献", "Contribute"),
    description: text("把成熟方案整理为可验证候选，进入公开内容的审核流程。", "Turn a mature solution into a verifiable candidate for the public-content review flow."),
    deliverable: text("候选规范与验证记录", "Candidate specification and validation record")
  }
] as const;

export const motionGrammar = {
  version: "4.4.0",
  name: "Motion Grammar",
  promise: text(
    "让每个产品变化都有清楚的起点、过程和结果，并保持产品界面的克制感。",
    "Give every product change a clear start, process, and outcome while preserving a calm interface."
  ),
  collections: {
    primitives: {
      count: 44,
      title: text("动效基础", "Motion Primitives"),
      purpose: text("构成动作的底层语言。", "The foundational language used to build motion.")
    },
    components: {
      count: 59,
      title: text("组件", "Components"),
      purpose: text("把多个原子动效编排成可安装的 React 产品交互。", "Installable React interactions composed from motion primitives.")
    }
  },
  material: {
    bezel: text("页面基底承接环境与留白。", "The page bezel carries environment and breathing room."),
    panel: text("抬升面板承接当前任务和可操作内容。", "A raised panel carries the active task and actionable content."),
    well: text("内凹区域承接输入、预览、代码和局部状态。", "A recessed well carries input, preview, code, and local state."),
    rule: text("使用材质关系表达层级，让边框只负责必要的分隔。", "Use material relationships to express hierarchy and reserve borders for essential separation.")
  },
  timing: {
    arrive: {
      curve: "cubic-bezier(0.23, 1, 0.32, 1)",
      rangeMs: [180, 280] as const,
      guidance: text("内容抵达时保持短促、方向明确的位移与淡入。", "Arriving content uses short, directional travel with an opacity cue.")
    },
    leave: {
      curve: "cubic-bezier(0.23, 1, 0.32, 1)",
      rangeMs: [110, 180] as const,
      guidance: text("离场节奏略快，让焦点尽快回到下一状态。", "Leaving motion resolves slightly faster so focus returns to the next state quickly.")
    },
    feedback: {
      rangeMs: [100, 160] as const,
      guidance: text("按压、选择和数值确认保持紧凑，服务于输入反馈。", "Press, selection, and value confirmation stay compact and serve input feedback.")
    },
    linear: {
      curve: "linear",
      rangeMs: [160, 600] as const,
      guidance: text("进度与连续数值变化使用匀速节奏，避免伪造完成感。", "Progress and continuous value changes use a linear rhythm without implying a result that has not arrived.")
    },
    spring: {
      curve: "cubic-bezier(0.34, 1.28, 0.64, 1)",
      rangeMs: [180, 320] as const,
      guidance: text("弹性只服务于直接操控后的落点确认，避免用于普通状态提示。", "Spring motion is reserved for settling after direct manipulation, keeping routine state feedback restrained.")
    }
  },
  invariants: [
    text("每个状态都预留空间，内容变化不推挤相邻界面。", "Every state reserves space so a change does not shove adjacent UI."),
    text("动效由用户事件或真实系统进度触发。", "Motion is triggered by a user event or real system progress."),
    text("每一段交互都允许中断、重复触发或恢复。", "Every interaction can be interrupted, repeated, or recovered."),
    text("减弱动效保留状态信息与操作路径。", "Reduced motion preserves state information and the action path."),
    text("键盘、指针和触摸获得同等的状态反馈。", "Keyboard, pointer, and touch receive equivalent state feedback."),
    text("优先使用 transform 与 opacity，避免布局属性参与关键帧。", "Prefer transform and opacity, keeping layout properties out of keyframes.")
  ],
  composition: {
    primaryActorLimit: 1,
    auxiliaryActorLimit: 2,
    stages: ["brief", "state graph", "actors", "beats", "accessibility", "delivery", "provenance"] as const,
    rule: text("一个瞬间聚焦一个主要视觉角色，辅助角色只负责建立因果和空间关系。", "One moment focuses on one primary visual actor; auxiliary actors establish cause and spatial context.")
  },
  implementation: {
    preferredDelivery: ["react", "html", "css", "js"] as const,
    rule: text("按动效需求选择最小可行引擎，组件保持独立、可复制并与状态图同源。", "Choose the smallest capable engine for the motion, keeping every component independent, copy-ready, and aligned with its state graph.")
  }
} as const;

/**
 * The portable contract shared with the Motion Lexicon Agent Skill's public JSON Schema.
 * The localized presentation model below makes this same decision readable on
 * the website without changing the underlying product state or motion plan.
 */
export const motionBlueprintContract: MotionBlueprintContract = {
  version: "2.0",
  locale: "en",
  intent: {
    productGoal: "Publish a completed update",
    userIntent: "Confirm that the request was received and show each approver's next state.",
    feeling: "Clear, grounded confirmation"
  },
  scope: {
    surface: "Release-note approval panel",
    framework: "HTML, CSS, and JavaScript",
    input: ["pointer", "keyboard", "touch"]
  },
  stateGraph: {
    initial: "ready",
    states: [
      { id: "ready", label: "Ready", role: "initial" },
      { id: "sending", label: "Sending", role: "pending" },
      { id: "awaiting", label: "Awaiting response", role: "success" },
      { id: "failed", label: "Retry available", role: "failure" }
    ],
    transitions: [
      { event: "SEND", from: "ready", to: "sending", interrupt: "settle" },
      { event: "RESOLVE", from: "sending", to: "awaiting", interrupt: "settle" },
      { event: "REJECT", from: "sending", to: "failed", interrupt: "settle" },
      { event: "RETRY", from: "failed", to: "sending", interrupt: "replace" }
    ]
  },
  actors: [
    { id: "send", role: "primary", kind: "trigger", element: "Send request button" },
    { id: "summary", role: "supporting", kind: "status", element: "Approval summary" },
    { id: "approvers", role: "supporting", kind: "record", element: "Approver records" }
  ],
  beats: [
    {
      id: "acknowledge-send",
      at: 0,
      actor: "send",
      purpose: "confirm",
      primitive: "press-tap-feedback",
      from: "Available",
      to: "Sending",
      durationMs: 140,
      easing: "feedback",
      properties: ["transform", "color"]
    },
    {
      id: "confirm-summary",
      at: 150,
      actor: "summary",
      purpose: "confirm",
      primitive: "crossfade",
      from: "Draft",
      to: "Sent · 2 approvers",
      durationMs: 180,
      easing: "arrive",
      properties: ["opacity", "color"]
    },
    {
      id: "reveal-approvers",
      at: 190,
      actor: "approvers",
      purpose: "reveal",
      primitive: "stagger",
      from: "Ready",
      to: "Awaiting response",
      durationMs: 220,
      easing: "arrive",
      properties: ["transform", "opacity"]
    }
  ],
  accessibility: {
    reducedMotion: "Switch the action, summary, and approver states directly without travel.",
    focus: "Keep focus on Send until the request resolves; expose Retry on failure.",
    aria: "Announce the approval summary with polite priority.",
    keyboard: "Enter and Space trigger Send; Escape preserves the current settled state."
  },
  delivery: {
    formats: ["html", "css", "js"],
    integration: "Drive data-state from the real request lifecycle and keep each visual result in the existing layout slot."
  },
  provenance: {
    status: "published",
    foundations: ["press-tap-feedback", "fade-in-fade-out", "crossfade", "stagger"],
    moments: ["approval-request"],
    confidence: "high",
    evidence: "Published Product Moment with a stable preview and reduced-motion treatment."
  }
};

export const motionBlueprintExample: MotionBlueprint = {
  id: "approval-request",
  status: "published",
  title: text("发送审批请求", "Send an approval request"),
  brief: text(
    "用户点击发送后，操作区域先给出确认，再把两位审批人的状态更新到等待回复。",
    "After Send is pressed, acknowledge the action and update two approvers to Awaiting response."
  ),
  scene: text("发布前的审批列表", "A pre-publish approval list"),
  stateGraph: [
    { id: "ready", label: text("待发送", "Ready"), meaning: text("审批人已选择，操作可执行。", "Approvers are selected and the action is available.") },
    { id: "sending", label: text("发送中", "Sending"), meaning: text("请求已被接收，列表保持稳定。", "The request is accepted while the list stays stable.") },
    { id: "awaiting", label: text("等待回复", "Awaiting"), meaning: text("每位审批人都有清楚的后续状态。", "Each approver has a clear next state.") }
  ],
  actors: [
    { id: "send", role: "trigger", label: text("发送请求", "Send request"), responsibility: text("确认输入并锁定重复提交。", "Acknowledge input and prevent duplicate submission.") },
    { id: "summary", role: "status", label: text("审批摘要", "Approval summary"), responsibility: text("在原位呈现当前阶段。", "Present the current stage in place.") },
    { id: "approvers", role: "record", label: text("审批人列表", "Approver list"), responsibility: text("逐项确认后续动作。", "Confirm the next action row by row.") }
  ],
  beats: [
    {
      at: "0ms",
      actorId: "send",
      purpose: text("确认点击已经被接收。", "Acknowledge that the click was received."),
      primitiveIds: ["press-tap-feedback", "fade-in-fade-out"],
      from: text("可发送", "Available"),
      to: text("发送中", "Sending"),
      durationMs: 140,
      easing: "arrive"
    },
    {
      at: "150ms",
      actorId: "summary",
      purpose: text("更新当前阶段，保留原有位置。", "Update the current phase in its existing position."),
      primitiveIds: ["crossfade"],
      from: text("草稿", "Draft"),
      to: text("已发送 · 2 位审批人", "Sent · 2 approvers"),
      durationMs: 180,
      easing: "arrive"
    },
    {
      at: "190ms",
      actorId: "approvers",
      purpose: text("依次确认每位审批人的等待状态。", "Confirm each approver's awaiting state in sequence."),
      primitiveIds: ["stagger", "fade-in-fade-out"],
      from: text("待发送", "Ready"),
      to: text("等待回复", "Awaiting response"),
      durationMs: 220,
      easing: "arrive"
    }
  ],
  accessibility: {
    keyboard: text("Enter 与 Space 触发发送；焦点停留在操作按钮，状态通过文本更新可读。", "Enter and Space trigger Send; focus remains on the action and a text update communicates state."),
    reducedMotion: text("直接切换按钮、摘要和审批人状态，不使用位移。", "Switch the action, summary, and approver states directly without travel."),
    liveRegion: text("审批摘要以 polite 方式播报。", "The approval summary announces with polite priority.")
  },
  delivery: {
    format: ["html", "css", "js"],
    implementation: text("语义按钮驱动 data-state，CSS 负责局部状态过渡，JavaScript 只管理真实请求的生命周期。", "A semantic button drives data-state, CSS handles local state transitions, and JavaScript manages only the real request lifecycle.")
  },
  provenance: {
    source: text("已发布产品瞬间：审批请求。", "Published product moment: Approval request."),
    relatedMoments: ["approval-request"],
    relatedPrimitives: ["press-tap-feedback", "fade-in-fade-out", "crossfade", "stagger"]
  },
  contract: motionBlueprintContract
};

export const motionGrammarDataPath = "/data/v4/motion-grammar.json";
