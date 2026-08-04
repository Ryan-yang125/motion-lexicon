import type { MotionPackKind } from "./motion-packs";
import type { LocalizedText } from "./types";

export type CategorySeoHub = {
  title: LocalizedText;
  description: LocalizedText;
  intro: LocalizedText;
  framework: ReadonlyArray<{ label: LocalizedText; copy: LocalizedText }>;
  pitfalls: readonly LocalizedText[];
  featuredPackIds: readonly MotionPackKind[];
  faqs: ReadonlyArray<{ question: LocalizedText; answer: LocalizedText }>;
};

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

const hubs: Readonly<Record<string, CategorySeoHub>> = {
  entrances: {
    title: text("入场与退场动效：淡入、滑入与揭示", "Entrance and exit motion: fade, slide, and reveal"),
    description: text("根据内容变化、空间方向与强调程度选择出现和离开的方式。", "Choose how content enters or leaves through change, direction, and emphasis."),
    intro: text("入场和退场负责交代界面里的新旧关系。动作越能说明内容从哪里来、下一步去哪里，用户越容易跟上状态。", "Entrance and exit motion explains what changed in an interface. Clear origin and destination make the next state easy to follow."),
    framework: [
      { label: text("变化幅度", "Amount of change"), copy: text("局部更新适合淡入；新增界面层级时，动作可以更明确。", "Use a fade for a local update; give a new interface layer a clearer arrival." ) },
      { label: text("空间方向", "Spatial direction"), copy: text("侧栏、抽屉和列表到详情等场景，让移动方向呼应内容来源。", "For drawers, sidebars, and list-to-detail flows, let direction reflect the content origin." ) },
      { label: text("强调程度", "Emphasis"), copy: text("关键结果可以用揭示或轻微缩放；常规内容保持安静。", "Use reveal or a small scale change for key outcomes; keep routine content quiet." ) }
    ],
    pitfalls: [
      text("同一组元素使用完全相同的位移，方向与层级会变得模糊。", "Giving every element the same travel can blur direction and hierarchy."),
      text("内容离开后没有为后续信息建立视觉落点，用户会失去上下文。", "When an element leaves without a visual landing point, people lose context for what follows.")
    ],
    featuredPackIds: ["layer-insertion", "command-menu", "archive-undo"],
    faqs: [
      { question: text("什么时候适合用滑入？", "When should I use a slide-in?"), answer: text("当内容的来源方向能帮助理解布局时，例如侧栏、抽屉或从列表进入详情。", "Use it when direction explains where content comes from, such as a drawer, sidebar, or list-to-detail flow.") },
      { question: text("淡入和揭示怎么选？", "How do I choose between fade and reveal?"), answer: text("结构保持稳定时用淡入；内容需要按顺序被看见时用揭示。", "Use fade for stable structure and reveal when content needs to unfold in sequence.") }
    ]
  },
  sequencing: {
    title: text("编排与时间：交错、延迟与动效节奏", "Sequencing and timing: stagger, delay, and rhythm"),
    description: text("用明确的先后关系把多段动作组织成一次完整事件。", "Use clear ordering to make several motions read as one event."),
    intro: text("一段产品动效经常包含按钮、状态和结果。编排决定用户先看见什么，也决定过程是否显得利落。", "A product motion often includes an action, state, and outcome. Sequencing sets what people see first and how brisk the flow feels."),
    framework: [
      { label: text("动作数量", "Number of actions"), copy: text("动作越多，越需要先确定主动作，再安排辅助反馈。", "With more actions, identify the primary action first and arrange supporting feedback around it." ) },
      { label: text("先后关系", "Order"), copy: text("先回应用户输入，再呈现进行中状态，最后落到结果。", "Acknowledge input first, show progress next, then land on the outcome." ) },
      { label: text("节奏", "Rhythm"), copy: text("间隔只要足够让顺序被看见；首个有效结果要尽快抵达。", "Use only enough interval to make order visible; bring the first useful result forward quickly." ) }
    ],
    pitfalls: [
      text("列表逐项进入过慢，会延后用户真正需要的内容。", "A slow item-by-item list delays the content people came for."),
      text("每一段动作同时争夺注意力，过程失去主次。", "When every action demands attention at once, the flow loses hierarchy.")
    ],
    featuredPackIds: ["publish-release", "progress-steps", "scheduled-publish"],
    faqs: [
      { question: text("交错动画的间隔从哪里开始？", "Where should stagger timing start?"), answer: text("从能看出顺序、又不拖慢第一项到达的最短间隔开始，再按列表密度微调。", "Start with the shortest interval that makes order visible without delaying the first useful item, then tune for list density.") },
      { question: text("延迟和交错有什么区别？", "What is the difference between delay and stagger?"), answer: text("延迟控制一段动作何时开始；交错控制一组相关动作彼此相隔多久。", "Delay sets when one motion starts. Stagger sets the interval between related motions.") }
    ]
  },
  transforms: {
    title: text("位移与变换动效：移动、缩放与旋转", "Movement and transforms: translate, scale, and rotate"),
    description: text("通过位置、尺寸和方向变化建立空间关系与操作反馈。", "Use position, scale, and direction to establish spatial relationships and feedback."),
    intro: text("位移、缩放和旋转让界面里的对象拥有方向感。它们适合表达对象从哪里来、焦点落在哪里，以及操作有没有被接收。", "Translate, scale, and rotate give interface objects a sense of direction. They can show origin, focus, and acknowledgement."),
    framework: [
      { label: text("操作来源", "Action origin"), copy: text("让对象从用户刚刚触发的位置附近开始变化，空间关系会更清楚。", "Start the change near the action source when possible so the spatial relationship remains clear." ) },
      { label: text("目标位置", "Destination"), copy: text("先明确对象抵达的位置，再决定位移、缩放还是两者结合。", "Establish the destination first, then choose translation, scale, or a restrained combination." ) },
      { label: text("变化幅度", "Travel amount"), copy: text("紧凑界面通常只需要让方向可见的最小变化。", "Compact interfaces usually need only the smallest change that makes direction visible." ) }
    ],
    pitfalls: [
      text("用很大的位移解释细小更新，会让界面显得迟缓。", "Large travel for a small update makes an interface feel slow."),
      text("缩放和位移同时过量，会让对象失去稳定的落点。", "Overdoing scale and translation together can remove a stable landing point.")
    ],
    featuredPackIds: ["kanban-move", "card-selection", "media-scrub"],
    faqs: [
      { question: text("位移应该多大？", "How far should an element move?"), answer: text("让用户看得出方向即可；紧凑界面通常只需要很小的移动距离。", "Move far enough to communicate direction. Compact interfaces usually need only a small distance.") },
      { question: text("什么时候该用缩放？", "When should I use scale?"), answer: text("当对象的层级或焦点发生变化时，缩放能帮助用户看见当前重点。", "Use scale when an object’s hierarchy or focus changes and the current priority should become clear.") }
    ]
  },
  "state-transitions": {
    title: text("状态过渡：让界面变化保持连续", "State transitions: keep interface changes continuous"),
    description: text("用淡化、形变与共享元素，让前后状态保持可追踪。", "Use fading, morphing, and shared elements to keep state changes traceable."),
    intro: text("状态过渡的任务是保留对象身份。前后界面发生变化时，用户仍然应该知道哪个内容变了、它去了哪里。", "State transitions preserve object identity. When an interface changes, people should still know what changed and where it went."),
    framework: [
      { label: text("对象身份", "Object identity"), copy: text("同一个对象跨状态移动时，优先保留它的连续轨迹。", "When the same object moves across states, preserve a continuous path." ) },
      { label: text("结构差异", "Structural difference"), copy: text("结构接近时适合交叉淡化；结构重组时用更明确的过渡。", "Use a crossfade for similar structure and a clearer transition for a larger reorganization." ) },
      { label: text("布局跨度", "Layout distance"), copy: text("跨区域或跨页面的变化，需要让起点和终点都能被识别。", "For movement across regions or pages, make both origin and destination recognizable." ) }
    ],
    pitfalls: [
      text("两个状态直接替换，会切断用户对变化过程的理解。", "Replacing one state with another outright breaks the sense of change."),
      text("把不同对象伪装成同一个对象过渡，会制造错误的因果关系。", "Treating different objects as one transition creates a false relationship.")
    ],
    featuredPackIds: ["workspace-switch", "filter-results", "archive-undo"],
    faqs: [
      { question: text("共享元素过渡适合什么场景？", "Where do shared element transitions work well?"), answer: text("适合缩略图打开详情、卡片展开和同一对象跨布局移动。", "They work well for thumbnail-to-detail, expanding cards, and the same object moving across layouts.") },
      { question: text("什么时候用交叉淡化？", "When should I use a crossfade?"), answer: text("前后结构接近、位置稳定时，交叉淡化能让内容更新保持安静。", "Use it when two states share structure and position and the update should stay quiet.") }
    ]
  },
  scroll: {
    title: text("滚动动效：内容进入视口与页面阅读节奏", "Scroll motion: viewport entry and reading rhythm"),
    description: text("让滚动补充层级和方向，同时保持阅读与操控的稳定。", "Use scroll to support hierarchy and direction while preserving stable reading and control."),
    intro: text("滚动已经提供了持续的运动。额外动效应当服务新层级、关键内容和页面方向，阅读主体保持稳定。", "Scroll already supplies continuous movement. Additional motion should serve new hierarchy, key content, and direction while reading stays steady."),
    framework: [
      { label: text("进入价值", "Arrival value"), copy: text("新分组和关键结论值得提示；普通段落保持静止更容易阅读。", "New groups and key conclusions can earn a cue; ordinary text is easier to read when steady." ) },
      { label: text("信息密度", "Information density"), copy: text("信息越密集，位移越短、频率越低。", "As density rises, shorten travel and lower frequency." ) },
      { label: text("持续滚动", "Continuous scroll"), copy: text("用户持续浏览时，避免重复触发强烈进入效果。", "During continuous browsing, avoid repeatedly triggering strong entrance effects." ) }
    ],
    pitfalls: [
      text("每次滚动都触发强动效，会干扰阅读节奏。", "Strong motion on every scroll event disrupts reading rhythm."),
      text("视差和大位移压过内容本身，页面方向感会变成负担。", "Parallax and large travel can overpower content and turn direction into a burden.")
    ],
    featuredPackIds: ["details-disclosure", "notification-triage", "search-suggestions"],
    faqs: [
      { question: text("内容进入视口都需要动效吗？", "Should every element animate into the viewport?"), answer: text("优先给新层级、关键结论和少量分组内容动效，阅读主体保持稳定。", "Reserve motion for new hierarchy, key conclusions, and a few groups. Keep the reading surface stable.") },
      { question: text("滚动动效如何照顾减弱动效偏好？", "How should scroll motion support reduced motion?"), answer: text("保留内容出现和顺序，减少位移、视差与重复循环。", "Keep content arrival and order while reducing travel, parallax, and repeated looping.") }
    ]
  },
  feedback: {
    title: text("交互反馈动效：点击、输入与操作结果", "Interaction feedback: press, input, and outcomes"),
    description: text("让用户看见输入已经被接收，以及结果何时抵达。", "Show that input has been received and make the outcome easy to read."),
    intro: text("反馈动效让一次输入拥有明确回声。按下、等待和完成分别需要被看见，用户才能持续做下一步。", "Feedback motion gives input a clear echo. Press, waiting, and completion each need to be legible before the next action."),
    framework: [
      { label: text("输入接收", "Input acknowledgement"), copy: text("点击和手势需要即时的可见回应。", "Presses and gestures need an immediate visible acknowledgement." ) },
      { label: text("等待状态", "Waiting state"), copy: text("工作需要时间时，给出简洁的进行中状态。", "When work takes time, provide a concise in-progress state." ) },
      { label: text("结果落点", "Outcome"), copy: text("成功、错误和下一步的表达应各自清楚。", "Success, error, and next-step states should each be distinct." ) }
    ],
    pitfalls: [
      text("反馈晚于用户预期，点击会显得没有被接收。", "Feedback that arrives late makes a press feel unreceived."),
      text("成功、错误和加载使用同一种表现，用户无法判断当前状态。", "Using one treatment for success, error, and loading makes the current state unclear.")
    ],
    featuredPackIds: ["save-confirmation", "inline-validation", "share-link"],
    faqs: [
      { question: text("点击后多久给反馈合适？", "How quickly should a press respond?"), answer: text("点击接收应当立刻可见；需要等待的操作随后给出清楚的进行中状态。", "Acknowledge the press immediately, then show a clear in-progress state when work takes time.") },
      { question: text("成功反馈应该停留多久？", "How long should success feedback remain?"), answer: text("让用户看清结果即可，随后回到可继续操作的界面。", "Keep it visible long enough to read, then return the interface to its next actionable state.") }
    ]
  },
  easing: {
    title: text("缓动曲线选择：让动效速度贴合界面意图", "Easing curves: choose motion speed for the interface"),
    description: text("用速度变化表达开始、抵达和停留的节奏。", "Use changing speed to shape starts, arrivals, and pauses."),
    intro: text("缓动决定动作的速度感。它能让抵达显得柔和、切换显得利落，也能让手势和界面保持直接对应。", "Easing shapes the feeling of speed. It can soften arrivals, sharpen switches, and keep gestures directly connected to the interface."),
    framework: [
      { label: text("动作方向", "Motion direction"), copy: text("进入和抵达通常需要减速；离开可以更干脆。", "Entering and arriving usually benefit from deceleration; leaving can be more direct." ) },
      { label: text("触感", "Feel"), copy: text("柔和曲线适合低干扰变化；清脆曲线适合明确的操作反馈。", "Use softer curves for low-distraction changes and crisper curves for clear feedback." ) },
      { label: text("手势关系", "Gesture relationship"), copy: text("拖拽、滚动和连续输入保持线性，更容易预测。", "Keep dragging, scrolling, and continuous input linear so they remain predictable." ) }
    ],
    pitfalls: [
      text("所有动作复用一条曲线，界面会失去节奏层次。", "Reusing one curve for every action removes rhythm and hierarchy."),
      text("拖拽和滚动使用非线性曲线，手势距离会和界面变化脱节。", "Nonlinear curves for drag and scroll disconnect gesture distance from interface movement.")
    ],
    featuredPackIds: ["card-selection", "inline-validation", "media-scrub"],
    faqs: [
      { question: text("ease-out 适合什么？", "When does ease-out work well?"), answer: text("适合元素抵达最终位置的动作，例如浮层、卡片和状态提示。", "It works well when an element arrives at its final position, such as a popover, card, or status cue.") },
      { question: text("为什么拖拽更适合线性响应？", "Why is linear motion better for dragging?"), answer: text("线性速度让手势距离和界面变化保持一一对应。", "Linear response keeps gesture distance and interface movement directly connected.") }
    ]
  },
  springs: {
    title: text("弹簧动效：用质量、阻尼与刚度表达重量", "Spring animation: express weight with mass, damping, and stiffness"),
    description: text("让物理式反应服务强调、重量感和可控的收束。", "Use physics-like response for emphasis, weight, and a controlled settle."),
    intro: text("弹簧的价值在于自然的加速和回弹。它适合少量需要强调的对象，让动作有重量，同时快速落到稳定状态。", "A spring is useful for its natural acceleration and rebound. Use it sparingly when an object needs emphasis, weight, and a quick stable landing."),
    framework: [
      { label: text("重量感", "Weight"), copy: text("需要像真实物体抵达时，弹簧比固定曲线更有说服力。", "When an object should feel like it arrives physically, a spring can be more convincing than a fixed curve." ) },
      { label: text("回弹次数", "Bounce"), copy: text("先控制回弹次数，再增加表现力；少量回弹已经足够。", "Control the number of rebounds before adding expression; a small amount is often enough." ) },
      { label: text("收束", "Settle"), copy: text("高频场景使用更高阻尼，让结果尽快稳定。", "For frequent actions, use higher damping so the result settles quickly." ) }
    ],
    pitfalls: [
      text("回弹持续太久，会压过内容本身的节奏。", "A rebound that lasts too long can overpower the content rhythm."),
      text("高频操作使用明显弹簧，会让界面显得沉重。", "A pronounced spring on high-frequency actions can make an interface feel heavy.")
    ],
    featuredPackIds: ["card-selection", "layer-insertion", "command-menu"],
    faqs: [
      { question: text("弹簧里的阻尼决定什么？", "What does damping control in a spring?"), answer: text("阻尼决定回弹如何收束；更高阻尼会更快稳定在落点。", "Damping controls how the response settles. Higher damping reaches stability sooner.") },
      { question: text("什么时候弹簧会显得过重？", "When does a spring feel too heavy?"), answer: text("高频操作、信息密集列表和需要快速确认的状态，适合更短、更克制的响应。", "High-frequency actions, dense lists, and quick confirmations benefit from shorter, more restrained response.") }
    ]
  },
  loops: {
    title: text("循环与环境动效：持续状态的轻量表达", "Looping and ambient motion: light expression for ongoing states"),
    description: text("用低干扰循环表达持续进行、等待或系统活跃。", "Use low-distraction loops for ongoing work, waiting, or system activity."),
    intro: text("循环动效为持续状态提供轻量提示。它应停留在注意力边缘，并在任务完成或停止时给出明确的结果。", "Looping motion can quietly signal an ongoing state. It should stay at the edge of attention and resolve clearly when work finishes or stops."),
    framework: [
      { label: text("状态持续", "State duration"), copy: text("只有状态持续时才需要循环，短暂反馈用一次性变化即可。", "Use a loop only while a state continues; a one-time change works for a brief acknowledgement." ) },
      { label: text("注意力", "Attention"), copy: text("用户需要持续关注时，动作可以稍明显；背景状态保持极轻。", "Use slightly stronger motion when attention is required; keep background states very light." ) },
      { label: text("结束条件", "Completion"), copy: text("设计完成、失败和暂停的明确落点。", "Design a clear landing point for completion, failure, and pause." ) }
    ],
    pitfalls: [
      text("装饰性循环长期占据注意力，会让界面疲劳。", "A decorative loop that runs constantly can exhaust attention."),
      text("循环没有结束条件，用户很难判断任务是否还在进行。", "A loop without a completion condition makes task status hard to judge.")
    ],
    featuredPackIds: ["upload-complete", "sync-recovery", "scheduled-publish"],
    faqs: [
      { question: text("循环动效应该一直播放吗？", "Should a loop run forever?"), answer: text("只在状态持续时播放，并给用户一个清楚的完成或停止结果。", "Run it while the state is ongoing, then provide a clear completion or stop state.") },
      { question: text("环境动效的强度如何控制？", "How strong should ambient motion be?"), answer: text("优先降低位移、对比和频率，让它留在注意力边缘。", "Lower travel, contrast, and frequency so it stays at the edge of attention.") }
    ]
  },
  "polish-effects": {
    title: text("界面润色动效：提示、遮罩与细节反馈", "Polish effects: cues, masks, and detail feedback"),
    description: text("用小幅变化强化层级、焦点和信息更新。", "Use small changes to reinforce hierarchy, focus, and information updates."),
    intro: text("润色效果处理的是细节的可见性。它们应该帮助用户发现焦点、理解更新或确认层级，而不是替代信息本身。", "Polish effects handle the visibility of details. They should help people find focus, understand an update, or confirm hierarchy without replacing information."),
    framework: [
      { label: text("注意焦点", "Attention focus"), copy: text("先确定用户当前需要看见什么，再选择一处轻微变化。", "Identify what someone needs to notice now, then use one restrained change." ) },
      { label: text("信息更新", "Information update"), copy: text("变化短促且可读，避免让效果本身盖过内容。", "Keep the change brief and readable so the effect does not overpower content." ) },
      { label: text("同屏数量", "On-screen count"), copy: text("同一时刻突出一个主变化，其余层级由排版和颜色维持。", "Highlight one primary change at a time and let layout and color hold the rest of the hierarchy." ) }
    ],
    pitfalls: [
      text("用效果替代信息层级，用户仍然找不到关键内容。", "Using an effect in place of hierarchy still leaves key content hard to find."),
      text("同屏出现多个高亮效果，会让注意力无处落下。", "Several highlight effects on one screen leave attention with nowhere to land.")
    ],
    featuredPackIds: ["search-suggestions", "notification-triage", "template-choice"],
    faqs: [
      { question: text("润色动效什么时候有价值？", "When does a polish effect add value?"), answer: text("当它帮助用户发现焦点、理解更新或确认层级时，就有明确价值。", "It earns its place when it helps someone find focus, understand an update, or confirm hierarchy.") },
      { question: text("如何避免效果太多？", "How do I avoid too many effects?"), answer: text("同一时刻只突出一个主要变化，其余信息使用排版和颜色维持层级。", "Highlight one primary change at a time, then use layout and color to hold the rest of the hierarchy.") }
    ]
  },
  performance: {
    title: text("动效性能：减少卡顿并保持输入响应", "Motion performance: reduce jank and keep input responsive"),
    description: text("从属性、图层、帧率和触发频率判断动画的实现成本。", "Evaluate animation cost through properties, layers, frame rate, and trigger frequency."),
    intro: text("流畅感来自稳定的帧时间和及时的输入响应。先减少布局与绘制压力，再处理视觉细节，动效的质量会更可靠。", "Smoothness comes from stable frame times and prompt input response. Reduce layout and paint pressure first, then refine visual details."),
    framework: [
      { label: text("属性", "Properties"), copy: text("优先使用 transform 和 opacity，减少布局与绘制压力。", "Prefer transform and opacity to reduce layout and paint pressure." ) },
      { label: text("触发频率", "Trigger frequency"), copy: text("滚动、拖拽和大列表中的重复动作需要格外克制。", "Repeated motion in scrolling, dragging, and large lists needs extra restraint." ) },
      { label: text("帧时间", "Frame time"), copy: text("先在连续输入场景检查掉帧，再定位重排与重绘。", "Check dropped frames in continuous-input scenarios before tracing layout and paint work." ) }
    ],
    pitfalls: [
      text("对布局属性做持续动画，会放大重排成本。", "Continuously animating layout properties magnifies reflow cost."),
      text("滚动和拖拽期间触发大量重绘，输入会变得迟钝。", "Heavy repaint work during scroll and drag makes input feel sluggish.")
    ],
    featuredPackIds: ["media-scrub", "filter-results", "kanban-move"],
    faqs: [
      { question: text("哪些 CSS 属性更适合动画？", "Which CSS properties work best for animation?"), answer: text("优先使用 transform 和 opacity，它们通常能减少布局与绘制压力。", "Prefer transform and opacity. They usually place less pressure on layout and painting.") },
      { question: text("如何发现动效导致的卡顿？", "How can I spot motion-related jank?"), answer: text("先检查滚动、拖拽和大列表中的掉帧，再定位频繁布局计算和重绘。", "Check scrolling, dragging, and large lists for dropped frames, then inspect repeated layout and paint work.") }
    ]
  },
  principles: {
    title: text("界面动效原则：目的、频率与减弱动效", "Interface motion principles: purpose, frequency, and reduced motion"),
    description: text("用目的、频率和可访问性决定一段动效是否值得存在。", "Use purpose, frequency, and accessibility to decide whether motion earns its place."),
    intro: text("动效是一种界面语言。每段动作都应该说明关系、结果或下一步，并让不同偏好的用户获得同样完整的信息。", "Motion is an interface language. Each action should clarify a relationship, outcome, or next step while keeping information complete for every preference."),
    framework: [
      { label: text("目的", "Purpose"), copy: text("先写清这段动作帮助用户理解什么。", "State what the motion helps someone understand before designing it." ) },
      { label: text("频率", "Frequency"), copy: text("高频路径使用更短、更安静的反馈。", "Use shorter, quieter feedback on high-frequency paths." ) },
      { label: text("减弱动效", "Reduced motion"), copy: text("保留状态、焦点和结果，把大位移与循环收束为静态或短促变化。", "Keep state, focus, and outcome while reducing large travel and loops to static or brief changes." ) }
    ],
    pitfalls: [
      text("每次状态变化都动画，用户会失去对重要变化的判断。", "Animating every state change makes important changes harder to distinguish."),
      text("减弱动效只关闭视觉效果，状态信息和完成结果会跟着消失。", "Removing only the visual effect in reduced motion can also remove state and completion cues.")
    ],
    featuredPackIds: ["delete-confirmation", "permission-change", "checkout-payment"],
    faqs: [
      { question: text("每个状态变化都要有动效吗？", "Should every state change animate?"), answer: text("为关系、结果和下一步服务的变化最值得动起来。", "Motion is most useful when it clarifies a relationship, outcome, or next step.") },
      { question: text("减弱动效模式保留什么？", "What should reduced-motion mode retain?"), answer: text("保留状态文字、层级变化、焦点和完成结果，让信息始终完整。", "Retain state copy, hierarchy changes, focus, and completed outcomes so information stays complete.") }
    ]
  }
};

export function getCategorySeoHub(categoryId: string) {
  return hubs[categoryId];
}
