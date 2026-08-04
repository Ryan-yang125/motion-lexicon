import type { MotionPackKind } from "./motion-packs";
import type { LocalizedText } from "./types";
import type { SeoGuideId } from "./seo-guide-ids";

export type { SeoGuideId } from "./seo-guide-ids";

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

export type SeoGuideFoundationId =
  | "fade-in-fade-out"
  | "slide-in"
  | "scale-in"
  | "stagger"
  | "duration"
  | "morph"
  | "crossfade"
  | "direction-aware-transition"
  | "press-tap-feedback"
  | "hold-to-confirm"
  | "shake-wiggle"
  | "easing"
  | "spring"
  | "frame-rate"
  | "compositing"
  | "purposeful-animation"
  | "reduced-motion";

export type SeoGuideStep = {
  title: LocalizedText;
  copy: LocalizedText;
};

export type SeoGuide = {
  id: SeoGuideId;
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
  decision: LocalizedText;
  steps: readonly [SeoGuideStep, SeoGuideStep, SeoGuideStep];
  foundations: readonly SeoGuideFoundationId[];
  packs: readonly MotionPackKind[];
  relatedGuideIds: readonly [SeoGuideId, SeoGuideId];
};

export const seoGuides = [
  {
    id: "save-submit-publish-feedback",
    eyebrow: text("场景指南 01", "Scenario guide 01"),
    title: text("保存、提交和发布：让结果立刻可见", "Save, submit, and publish feedback"),
    description: text(
      "把点击后的等待、成功与失败编成清晰状态，让用户知道动作已经生效。",
      "Design save, submit, and publish feedback so every action has a clear start, progress, and result."
    ),
    intro: text(
      "保存动作通常很短，发布可能要等几秒。两种场景都需要先给出输入已被接收的信号，再用状态变化交代结果。",
      "Saving is often brief while publishing can take seconds. Both need an immediate acknowledgement, then a clear state change that explains the outcome."
    ),
    decision: text(
      "先判断操作是否可撤销、等待是否超过一秒，以及成功后界面会发生什么变化。",
      "Start with reversibility, whether waiting exceeds one second, and what visibly changes after success."
    ),
    steps: [
      {
        title: text("点击先有回应", "Acknowledge the click"),
        copy: text(
          "按下时给出短促反馈，同时锁定重复提交的入口。",
          "Give a brief press response and prevent accidental duplicate submission."
        )
      },
      {
        title: text("等待要说清楚", "Make waiting legible"),
        copy: text(
          "超过瞬时完成的操作，展示进行中的状态和可理解的文案。",
          "For work that outlasts an instant, show an in-progress state with plain language."
        )
      },
      {
        title: text("结果落在原位置", "Resolve in place"),
        copy: text(
          "成功、失败或可撤销入口都放在用户刚刚操作的位置附近。",
          "Place success, failure, or undo near the place where the action happened."
        )
      }
    ],
    foundations: ["press-tap-feedback", "crossfade", "duration"],
    packs: ["save-confirmation", "publish-release", "upload-complete"],
    relatedGuideIds: ["form-validation-delete-permission", "from-brief-to-spec"]
  },
  {
    id: "card-list-filter-continuity",
    eyebrow: text("场景指南 02", "Scenario guide 02"),
    title: text("卡片、列表与筛选：保住上下文", "Keep context through cards, lists, and filters"),
    description: text(
      "内容改变时保留空间关系，让用户看得出哪些项目移动、保留或离开。",
      "Keep cards, lists, and filters legible as content changes, so people can follow what moved, stayed, or left."
    ),
    intro: text(
      "筛选、排序和拖拽会同时改变内容与位置。好的连续性让视线跟得上变化，也让操作结果更可信。",
      "Filtering, sorting, and reordering change both content and position. Good continuity lets the eye follow the change and trust the result."
    ),
    decision: text(
      "先确认用户需要追踪的是单个对象、列表顺序，还是筛选后的整体结果。",
      "Decide whether people need to track one object, the order of a list, or the filtered result as a whole."
    ),
    steps: [
      {
        title: text("保留可辨认的锚点", "Keep a recognisable anchor"),
        copy: text(
          "让被操作的卡片保留身份和位置线索，避免突然消失后让人重新找。",
          "Keep identity and spatial cues on the acted-on card so people do not have to find it again."
        )
      },
      {
        title: text("顺序变化分批发生", "Sequence changes in batches"),
        copy: text(
          "列表更新用短间隔建立阅读顺序，数量多时控制总时长。",
          "Use short intervals to establish reading order, and cap the total time for larger lists."
        )
      },
      {
        title: text("筛选结果给出解释", "Explain the filtered result"),
        copy: text(
          "结果收缩时保留筛选条件和命中数量，让变化有原因可循。",
          "Keep the active criteria and result count visible as the result set contracts."
        )
      }
    ],
    foundations: ["morph", "stagger", "crossfade"],
    packs: ["card-selection", "filter-results", "kanban-move"],
    relatedGuideIds: ["pack-or-primitive", "css-motion-jank"]
  },
  {
    id: "css-motion-jank",
    eyebrow: text("场景指南 03", "Scenario guide 03"),
    title: text("CSS 动效卡顿：从帧到属性逐项排查", "Diagnose CSS motion jank"),
    description: text(
      "从帧耗时、布局、绘制和交互时长逐项检查，定位 CSS 动效为什么拖慢页面。",
      "Find CSS motion jank by checking frame work, layout cost, paint, and the actual duration of the interaction."
    ),
    intro: text(
      "卡顿很少只来自一条 transition。布局抖动、昂贵绘制、滚动中的事件和过长时长都会让动作显得迟钝。",
      "Jank rarely comes from one transition. Layout shifts, expensive paint, scroll work, and long durations can all make motion feel sluggish."
    ),
    decision: text(
      "先复现最明显的一次卡顿，再区分它发生在开始、运行中，还是结束后的页面更新。",
      "Reproduce the clearest case, then identify whether it happens on start, during travel, or when the UI settles."
    ),
    steps: [
      {
        title: text("先看帧时间", "Inspect frame time first"),
        copy: text(
          "用性能面板抓取一次交互，标出长任务和连续掉帧的区间。",
          "Record one interaction in a performance panel and mark long tasks and dropped-frame stretches."
        )
      },
      {
        title: text("收窄会触发布局的属性", "Narrow layout-triggering properties"),
        copy: text(
          "优先让 transform 和 opacity 承担视觉变化，把尺寸和位置重排留给必要场景。",
          "Let transform and opacity carry visual change where possible; reserve size and layout work for cases that need it."
        )
      },
      {
        title: text("把时长调回交互节奏", "Return duration to interaction rhythm"),
        copy: text(
          "短反馈常在 120–240ms 内完成；列表与状态切换按内容量增加，避免拖长每次操作。",
          "Brief feedback often settles in 120–240ms. Scale list and state changes with content, without stretching every action."
        )
      }
    ],
    foundations: ["frame-rate", "compositing", "duration"],
    packs: ["media-scrub", "filter-results", "upload-complete"],
    relatedGuideIds: ["reduced-motion", "spring-or-ease-out"]
  },
  {
    id: "spring-or-ease-out",
    eyebrow: text("场景指南 04", "Scenario guide 04"),
    title: text("Spring 还是 Ease-out：按动作的语义选", "Choose spring or ease-out by meaning"),
    description: text(
      "按动作语义、中断方式和收尾要求选择 spring 或 ease-out，让速度变化服务于界面含义。",
      "Choose spring or ease-out from the interaction’s meaning, interruption pattern, and need for a settled ending."
    ),
    intro: text(
      "两种曲线都能让界面停下来。区别在于，spring 会保留受力感和可中断性，ease-out 更适合明确、克制的到达。",
      "Both can bring an interface to rest. Springs retain force and interruption; ease-out suits a deliberate, restrained arrival."
    ),
    decision: text(
      "先问这是不是一个可被拖拽、打断或反向的对象；再判断它需要物理感还是清晰的终点。",
      "Ask whether the object can be dragged, interrupted, or reversed, then decide whether it needs physicality or a crisp endpoint."
    ),
    steps: [
      {
        title: text("连续输入用 spring", "Use spring for continuous input"),
        copy: text(
          "拖拽、抽屉和可直接操控的对象，需要速度能自然接上下一次输入。",
          "Drags, drawers, and directly manipulated objects benefit when velocity can carry into the next input."
        )
      },
      {
        title: text("明确反馈用 ease-out", "Use ease-out for clear feedback"),
        copy: text(
          "保存、复制和轻量进入需要迅速抵达结果，过冲容易抢走信息焦点。",
          "Saving, copying, and light entrances should arrive quickly; overshoot can pull focus from the information."
        )
      },
      {
        title: text("用同一状态做比较", "Compare the same state"),
        copy: text(
          "保持位移、尺寸和时长接近，只改曲线，才能看清速度感的差异。",
          "Hold travel, size, and duration close, then change only the curve to see the difference in velocity."
        )
      }
    ],
    foundations: ["spring", "easing", "scale-in"],
    packs: ["card-selection", "save-confirmation", "approval-request"],
    relatedGuideIds: ["from-brief-to-spec", "card-list-filter-continuity"]
  },
  {
    id: "reduced-motion",
    eyebrow: text("场景指南 05", "Scenario guide 05"),
    title: text("减弱动效：保留结果，减少位移", "Reduced motion without losing meaning"),
    description: text(
      "为位移、缩放和循环提供低动态表达，信息层级和操作结果仍然清楚。",
      "Offer low-motion treatments for travel, scale, and loops while keeping hierarchy and action outcomes clear."
    ),
    intro: text(
      "减弱动效关注的是移动强度。状态变化仍然要被看见，重点信息仍然要能被辨认。",
      "Reduced motion changes movement intensity. State changes still need to be seen and important information still needs to be recognised."
    ),
    decision: text(
      "先列出页面里的位移、缩放、视差和循环，再为每一类定义保留的信息信号。",
      "List travel, scale, parallax, and loops on the page, then define the signal each one must retain."
    ),
    steps: [
      {
        title: text("用透明度替代大幅移动", "Swap large travel for opacity"),
        copy: text(
          "进入与离开可以缩短位移，配合透明度和边界变化表达状态。",
          "Entrances and exits can reduce travel and use opacity or boundary changes to express state."
        )
      },
      {
        title: text("循环改成静态状态", "Turn loops into stable states"),
        copy: text(
          "持续旋转、浮动或扫光可以停在清晰的状态，必要时保留手动触发。",
          "Continuous rotation, floating, or shimmer can settle into a clear state, with manual replay when useful."
        )
      },
      {
        title: text("按偏好自动生效", "Respect the preference automatically"),
        copy: text(
          "通过 prefers-reduced-motion 切换低动态方案，并用键盘和触屏复查关键信号。",
          "Switch to the low-motion treatment through prefers-reduced-motion, then check key signals with keyboard and touch."
        )
      }
    ],
    foundations: ["reduced-motion", "fade-in-fade-out", "crossfade"],
    packs: ["details-disclosure", "notification-triage", "progress-steps"],
    relatedGuideIds: ["css-motion-jank", "form-validation-delete-permission"]
  },
  {
    id: "form-validation-delete-permission",
    eyebrow: text("场景指南 06", "Scenario guide 06"),
    title: text("表单、删除与权限：把边界讲清楚", "Validation, deletion, and permission boundaries"),
    description: text(
      "为校验、删除和权限变化安排恰当反馈，让风险、下一步和可恢复性都清楚。",
      "Give validation, deletion, and permission changes the right feedback so risk, next steps, and recovery stay clear."
    ),
    intro: text(
      "这些操作关乎后果。动效的职责是把风险和状态摆在眼前，帮助用户在关键时刻做出判断。",
      "These actions carry consequences. Motion should put risk and state in view so people can make a considered decision at the critical moment."
    ),
    decision: text(
      "先区分可撤销、需要确认和立即生效的动作，再决定反馈放在字段、对象还是全局层级。",
      "Separate reversible, confirm-required, and immediate actions, then decide whether feedback belongs to a field, object, or global layer."
    ),
    steps: [
      {
        title: text("校验贴着输入发生", "Validate beside the input"),
        copy: text(
          "错误信息、焦点和一次短促提示围绕具体字段出现，减少来回找原因。",
          "Place the message, focus, and a brief cue around the field so people can correct it without searching."
        )
      },
      {
        title: text("删除先解释后果", "Explain deletion before commitment"),
        copy: text(
          "确认层说明将要失去什么；可恢复时在原位置给出撤销入口。",
          "A confirmation layer states what will be lost; reversible actions expose undo where the change occurred."
        )
      },
      {
        title: text("权限变化标出影响范围", "Show the scope of a permission change"),
        copy: text(
          "成员、角色和可访问内容一起更新，避免只改一个标签却留下旧状态。",
          "Update members, roles, and accessible content together so a changed label does not leave stale state behind."
        )
      }
    ],
    foundations: ["shake-wiggle", "hold-to-confirm", "direction-aware-transition"],
    packs: ["inline-validation", "delete-confirmation", "permission-change"],
    relatedGuideIds: ["save-submit-publish-feedback", "reduced-motion"]
  },
  {
    id: "from-brief-to-spec",
    eyebrow: text("场景指南 07", "Scenario guide 07"),
    title: text("从模糊需求到动效规格", "Turn a vague motion brief into a spec"),
    description: text(
      "把“自然一点”这类感受拆成触发、对象、状态、时长和减弱动效规则，形成可实现的规格。",
      "Turn a vague motion brief into a buildable spec with trigger, object, states, timing, and reduced-motion rules."
    ),
    intro: text(
      "“高级一点”“有重量”能提供方向，却还不能直接交给开发。规格要把感觉落到可观察的变化上。",
      "“More polished” and “has weight” give direction. A buildable spec turns that feeling into observable change."
    ),
    decision: text(
      "先确认用户在什么时候看见变化、要理解什么结果，以及这段动效能否被打断。",
      "Clarify when people see the change, what result they need to understand, and whether the motion can be interrupted."
    ),
    steps: [
      {
        title: text("写出前后状态", "Name the before and after states"),
        copy: text(
          "用可见的界面状态取代抽象形容词，例如草稿、发布中、已发布。",
          "Replace abstract adjectives with visible states such as draft, publishing, and published."
        )
      },
      {
        title: text("选择空间和速度", "Choose space and speed"),
        copy: text(
          "说明对象从哪里来、停在哪里、走多远，以及曲线是否需要轻微回弹。",
          "State where the object starts, where it settles, how far it travels, and whether the curve needs a slight rebound."
        )
      },
      {
        title: text("补上失败与减弱方案", "Add failure and reduced-motion paths"),
        copy: text(
          "把失败、撤销和偏好减少动效的呈现写进同一份规格。",
          "Include failure, undo, and reduced-motion behaviour in the same specification."
        )
      }
    ],
    foundations: ["purposeful-animation", "duration", "easing"],
    packs: ["publish-release", "workspace-switch", "approval-request"],
    relatedGuideIds: ["spring-or-ease-out", "pack-or-primitive"]
  },
  {
    id: "pack-or-primitive",
    eyebrow: text("场景指南 08", "Scenario guide 08"),
    title: text("Pack 与基础动效：从哪里开始", "Choose a Pack or a motion primitive"),
    description: text(
      "按场景完整度和定制深度选择 Pack 或基础动效，既能快速落地，也能保留设计控制力。",
      "Choose a Pack or a motion primitive by scenario completeness and customization depth, balancing speed with design control."
    ),
    intro: text(
      "基础动效解决一个行为，Pack 把多个行为组织成真实产品瞬间。两者都可独立使用，也能互相拆解和组合。",
      "A primitive solves one behaviour. A Pack organizes several behaviours into a real product moment. Each can stand alone or be combined."
    ),
    decision: text(
      "当界面已经有清楚的状态流程时，从 Pack 开始；当你只需要解决一个局部行为时，从基础动效开始。",
      "Start with a Pack when the UI already has a clear state flow. Start with a primitive when you need to solve one local behaviour."
    ),
    steps: [
      {
        title: text("先看场景是否完整", "Check whether the scenario is complete"),
        copy: text(
          "保存、发布、删除这类含有多段状态的流程，可以直接借用 Pack 的结构。",
          "Flows such as saving, publishing, and deleting contain several states and can borrow a Pack’s structure."
        )
      },
      {
        title: text("再看需要改到多深", "Then assess customization depth"),
        copy: text(
          "只改进入方式或曲线时，直接打开对应基础动效会更轻。",
          "When only the entrance or curve changes, working from the relevant primitive stays lighter."
        )
      },
      {
        title: text("回到基础规则校验", "Validate against the underlying rules"),
        copy: text(
          "采用 Pack 后，仍检查时长、空间连续性和减弱动效，确保它适配你的界面。",
          "After adopting a Pack, still check timing, spatial continuity, and reduced motion so it fits your interface."
        )
      }
    ],
    foundations: ["purposeful-animation", "stagger", "morph"],
    packs: ["save-confirmation", "card-selection", "filter-results"],
    relatedGuideIds: ["card-list-filter-continuity", "from-brief-to-spec"]
  }
] as const satisfies readonly SeoGuide[];

const guideById = new Map<SeoGuideId, SeoGuide>(
  seoGuides.map((guide) => [guide.id, guide])
);

export function getSeoGuide(id?: string | null): SeoGuide | undefined {
  return id ? guideById.get(id as SeoGuideId) : undefined;
}
