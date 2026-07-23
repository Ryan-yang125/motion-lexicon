import {
  canonicalIdByEntryId,
  canonicalMotionCatalog
} from "./motion-catalog";
import type { LocalizedText } from "./types";

export type GlossaryTerm = {
  id: string;
  categoryId: string;
  section: string;
  name: LocalizedText;
  definition: LocalizedText;
  canonicalId: string;
  canonical: boolean;
  alias: boolean;
  distinction?: LocalizedText;
};

type GlossaryEntryInput = Omit<
  GlossaryTerm,
  "canonicalId" | "canonical" | "alias" | "distinction"
>;

const localized = (zh: string, en: string): LocalizedText => ({ zh, en });

function term(
  id: string,
  categoryId: string,
  section: string,
  enName: string,
  zhName: string,
  enDefinition: string,
  zhDefinition: string
): GlossaryEntryInput {
  return {
    id,
    categoryId,
    section,
    name: localized(zhName, enName),
    definition: localized(zhDefinition, enDefinition)
  };
}

const entrances = "Entrances & Exits — how elements appear and disappear";
const sequencing = "Sequencing & Timing — coordinating multiple elements or moments";
const transforms = "Movement & Transforms — changing an element's position, size, or angle";
const stateTransitions = "Transitions Between States — connecting one state, view, or element to another";
const scroll = "Scroll — motion tied to scrolling or navigating between views";
const feedback = "Feedback & Interaction — responding to the user's actions";
const easing = "Easing — how speed changes over an animation";
const springs = "Spring Animations — physics-based motion as an alternative to fixed-duration easing";
const loops = "Looping & Ambient Motion — animations that run on their own";
const effects = "Polish & Effects — the small touches that separate good from great";
const performance = "Performance — what keeps motion smooth instead of stuttering";
const principles = "Principles to Know — concepts that guide when and how to animate";

/** Motion Lexicon maintains these 91 original, implementation-oriented definitions. */
const glossaryEntries: readonly GlossaryEntryInput[] = [
  term("fade-in-fade-out", "entrances", entrances, "Fade in / Fade out", "淡入 / 淡出", "An opacity transition brings an element into view or carries it out without changing its geometry.", "元素通过改变不透明度出现或消失。"),
  term("slide-in", "entrances", entrances, "Slide in", "滑入", "A positional transition moves content from beyond an edge into its resting location.", "元素从屏幕外沿左、右、上或下方滑入。"),
  term("scale-in", "entrances", entrances, "Scale in", "缩放入场", "An appearing element expands from a reduced scale to its final dimensions, commonly while opacity rises.", "元素出现时从较小尺寸放大到完整尺寸，通常与淡入搭配。"),
  term("pop-in", "entrances", entrances, "Pop in", "弹入", "An entrance crosses the final scale briefly, then settles back to create a compact spring-like accent.", "元素出现时略微越过最终状态，再像回弹一样落到位。"),
  term("reveal", "entrances", entrances, "Reveal", "揭示", "A moving clipping boundary or mask exposes content progressively.", "内容逐步显露，通常通过动画化裁切路径或遮罩实现。"),
  term("enter-exit", "entrances", entrances, "Enter / Exit", "进入 / 离开", "Lifecycle motion communicates when an element joins or leaves the rendered interface.", "元素被添加到屏幕或从屏幕移除时播放的动画。"),

  term("keyframes", "sequencing", sequencing, "Keyframes", "关键帧", "Named timeline checkpoints assign property values at selected offsets; interpolation determines the states between them.", "动画中预先定义的节点（如 0%、50%、100%），浏览器会补全节点之间的画面。"),
  term("interpolation-tween", "sequencing", sequencing, "Interpolation / Tween", "插值 / 补间", "A renderer calculates intermediate property values between defined states to produce continuous change.", "生成起始值与结束值之间的所有中间帧，让运动保持连续。"),
  term("stagger", "sequencing", sequencing, "Stagger", "交错动画", "Related items start at offset times, turning one transition into a readable sequence.", "让多个项目依次播放动画，并在相邻项目之间加入短延迟，形成级联节奏。"),
  term("orchestration", "sequencing", sequencing, "Orchestration", "动效编排", "A coordinated timeline orders multiple motions so their starts, overlaps, and finishes express one event.", "有意识地安排多段动画的时间关系，让它们呈现为一个协调的整体动作。"),
  term("delay", "sequencing", sequencing, "Delay", "延迟", "The delay is the interval between a trigger and the first active frame.", "动画开始前等待的时间。"),
  term("duration", "sequencing", sequencing, "Duration", "时长", "Duration measures the elapsed time from an animation's start state to its end state.", "一段动画完成所需的时间。"),
  term("fill-mode", "sequencing", sequencing, "Fill mode", "填充模式", "A fill mode selects which keyframe styles apply outside the active animation interval.", "控制元素在动画开始前或结束后是否保留首帧或末帧样式，例如 forwards。"),
  term("stepped-animation", "sequencing", sequencing, "Stepped animation", "步进动画", "Progress advances through fixed discrete states instead of continuously interpolated values.", "被划分为若干离散步骤的动画，例如倒计时器。"),

  term("translate", "transforms", transforms, "Translate", "位移", "A transform shifts visual coordinates horizontally, vertically, or both while leaving layout flow unchanged.", "沿 X 轴或 Y 轴移动元素。"),
  term("scale", "transforms", transforms, "Scale", "缩放", "A transform multiplies an element's rendered width and height around a chosen origin.", "放大或缩小元素。"),
  term("rotate", "transforms", transforms, "Rotate", "旋转", "A transform changes an element's angular orientation around its transform origin.", "让元素围绕一个点旋转。"),
  term("skew", "transforms", transforms, "Skew", "倾斜", "A shear transform offsets one axis in proportion to the other, producing a slanted silhouette.", "沿 X 轴或 Y 轴倾斜元素，使其从矩形形态产生切变。"),
  term("3d-tilt-flip", "transforms", transforms, "3D tilt / Flip", "3D 倾斜 / 翻转", "Rotation around the X or Y axis creates a plane-turning effect within a perspective scene.", "在三维空间中通过 rotateX 或 rotateY 旋转，增加纵深感。"),
  term("perspective", "transforms", transforms, "Perspective", "透视", "Perspective sets the viewer-to-plane distance used to project three-dimensional transforms; shorter distances amplify depth.", "控制 3D 效果的强弱；较小的值会夸大纵深，像观察者距离更近。"),
  term("transform-origin", "transforms", transforms, "Transform origin", "变换原点", "The transform origin defines the local pivot from which scaling and rotation are calculated.", "缩放展开或旋转所围绕的锚点。"),
  term("origin-aware-animation", "transforms", transforms, "Origin-aware animation", "基于触发源的动画", "Entrance geometry begins at the control or location that triggered the new surface, preserving their spatial relationship.", "元素从触发它的控件位置展开，例如弹出层从打开它的按钮处生长，而非沿用 CSS 默认的自身中心。"),

  term("crossfade", "state-transitions", stateTransitions, "Crossfade", "交叉淡入淡出", "Two overlapping states exchange opacity over the same interval, handing visual focus from one to the other.", "一个元素淡出的同时，另一个元素在同一位置淡入。"),
  term("continuity-transition", "state-transitions", stateTransitions, "Continuity transition", "连续性过渡", "A transition preserves recognizable geometry or position across states so viewers can follow the change.", "通过视觉连接变化前后的状态来帮助用户保持方位感，例如让同一个矩形放大或缩小。"),
  term("morph", "state-transitions", stateTransitions, "Morph", "形变", "Interpolated geometry reshapes one visual form into another across a continuous transition.", "一个形状平滑地变成另一个形状，例如灵动岛。"),
  term("shared-element-transition", "state-transitions", stateTransitions, "Shared element transition", "共享元素过渡", "A persistent visual object changes position, size, or styling while connecting two layouts.", "同一个元素从一个位置移动并变换到另一个位置，例如缩略图展开成卡片。"),
  term("layout-animation", "state-transitions", stateTransitions, "Layout animation", "布局动画", "Changes in measured position or dimensions are animated between layout snapshots.", "元素尺寸或位置变化时，以动画移动到新状态，而非瞬间跳变。"),
  term("accordion-collapse", "state-transitions", stateTransitions, "Accordion / Collapse", "手风琴 / 折叠", "A disclosure region animates its visible extent while content is opened or closed.", "一个区域平滑地展开或收起高度，以显示或隐藏内容。"),
  term("direction-aware-transition", "state-transitions", stateTransitions, "Direction-aware transition", "方向感过渡", "Navigation motion uses the route direction to choose opposing travel paths for forward and reverse actions.", "前进时内容沿一个方向滑动，返回时沿相反方向滑动，让导航具备方向感。"),

  term("scroll-reveal", "scroll", scroll, "Scroll reveal", "滚动揭示", "Viewport entry triggers a one-time opacity or position transition for newly visible content.", "元素进入视口时淡入或滑动到位。"),
  term("scroll-driven-animation", "scroll", scroll, "Scroll-driven animation", "滚动驱动动画", "Scroll progress supplies the animation timeline, mapping page movement to visual state.", "动画进度与滚动位置直接绑定。"),
  term("parallax", "scroll", scroll, "Parallax", "视差", "Layers respond to the same scroll input at different displacement rates, creating apparent depth.", "滚动时背景与前景以不同速度移动，从而营造纵深感。"),
  term("page-transition", "scroll", scroll, "Page transition", "页面过渡", "Route navigation is accompanied by coordinated exit and entrance states for page-level content.", "从一个页面或路由导航到另一个页面或路由时播放的动画。"),
  term("view-transition", "scroll", scroll, "View transition", "视图过渡", "The browser captures old and new render states, then animates their snapshots and designated shared elements.", "浏览器在两个状态或页面之间进行形变过渡，并连接共享元素。"),

  term("hover-effect", "feedback", feedback, "Hover effect", "悬停效果", "Pointer hover updates a control's visual state to signal availability or affordance.", "光标移到元素上方时产生的视觉变化。"),
  term("press-tap-feedback", "feedback", feedback, "Press / Tap feedback", "按压 / 轻触反馈", "A brief response during pointer or touch activation makes a control acknowledge contact.", "元素被点击时轻微缩小，让操作具有实体触感。"),
  term("hold-to-confirm", "feedback", feedback, "Hold to confirm", "长按确认", "A timed progress indicator advances while continuous press input is maintained and completes at a threshold.", "用户持续按住按钮时逐步填满的进度效果。"),
  term("drag", "feedback", feedback, "Drag", "拖拽", "Pointer movement directly updates an object's position from grab until release.", "抓住元素并移动它，释放时通常带有动量。"),
  term("drag-to-reorder", "feedback", feedback, "Drag to reorder", "拖拽排序", "Dragging an item changes its list position while surrounding items animate toward their prospective slots.", "拖动列表项来重新排序，其他项目会移动并让出位置。"),
  term("swipe-to-dismiss", "feedback", feedback, "Swipe to dismiss", "滑动关闭", "A directional drag removes a surface after distance or velocity crosses a dismissal threshold.", "把元素拖出屏幕以关闭它，例如抽屉或提示消息。"),
  term("rubber-banding", "feedback", feedback, "Rubber-banding", "橡皮筋回弹", "Movement beyond a boundary is attenuated, then restored toward the valid range after release.", "拖过边界时出现阻力并回弹，类似 iOS 的过度滚动手感。"),
  term("shake-wiggle", "feedback", feedback, "Shake / Wiggle", "摇晃 / 抖动", "A rapid alternating displacement flags invalid input or a rejected action.", "快速左右抖动，用来提示错误或输入被拒绝。"),
  term("ripple", "feedback", feedback, "Ripple", "涟漪", "A radial wave expands from the activation coordinates to mark where contact occurred.", "圆形从轻触点向外扩散，用来确认按压操作。"),

  term("easing", "easing", easing, "Easing", "缓动", "An easing function maps linear timeline progress to a changing rate of property interpolation.", "动画加速或减速的速率变化方式。"),
  term("ease-out", "easing", easing, "Ease-out", "缓出", "Progress advances quickly after activation and decelerates near completion, giving responsive UI motion a controlled arrival.", "开始快、结束慢，适合作为大多数 UI 动效和用户响应动作的默认选择。"),
  term("ease-in", "easing", easing, "Ease-in", "缓入", "Progress accelerates from a gentle start toward a faster finish, fitting departures that should gather speed.", "开始慢、结束快，通常应谨慎使用，因为容易显得迟缓。"),
  term("ease-in-out", "easing", easing, "Ease-in-out", "缓入缓出", "Progress accelerates through the middle and decelerates at both ends, supporting visible point-to-point travel.", "速度由慢到快再到慢，适合屏幕上已有元素从 A 点移动到 B 点。"),
  term("linear", "easing", easing, "Linear", "线性", "Timeline progress and property progress remain proportional, producing a constant rate suitable for continuous indicators.", "保持恒定速度；UI 动效应避免使用，仅保留给加载旋转器或跑马灯。"),
  term("cubic-bezier", "easing", easing, "Cubic-bezier", "三次贝塞尔", "Four control points describe a cubic Bézier timing curve for custom acceleration and deceleration.", "由开发者定义的自定义缓动曲线，用于精确控制速度变化。"),
  term("asymmetric-easing", "easing", easing, "Asymmetric easing", "非对称缓动", "Different acceleration and deceleration shapes give the entrance and arrival distinct timing characteristics.", "加速与减速速率不同的曲线，通常比对称曲线更有生命力。"),

  term("spring", "springs", springs, "Spring", "弹簧", "A simulated oscillator approaches a target according to stiffness, damping, mass, and current velocity.", "由张力、质量和阻尼等物理参数驱动的运动，不依赖固定时长。"),
  term("stiffness-tension", "springs", springs, "Stiffness / Tension", "刚度 / 张力", "Stiffness determines the restoring force applied for a given distance from the spring's target.", "弹簧拉向目标的力度，数值越高，响应越干脆。"),
  term("damping", "springs", springs, "Damping", "阻尼", "Damping removes energy from a spring over time, controlling oscillation and settlement.", "弹簧稳定下来的速度；阻尼越低，回弹和振荡越明显。"),
  term("mass", "springs", springs, "Mass", "质量", "Mass sets inertia in the spring equation, influencing acceleration and the perceived weight of motion.", "动画元素呈现出的重量；质量越大，运动越慢、越沉。"),
  term("bounce", "springs", springs, "Bounce", "弹跳", "A spring crosses its target one or more times before its oscillation converges.", "弹簧越过目标后再稳定下来，为动作增加活泼感。"),
  term("perceptual-duration", "springs", springs, "Perceptual duration", "感知时长", "The perceived duration ends when remaining spring movement falls below a visually meaningful threshold.", "弹簧在感知上完成所需的时长，尽管底层仍在进行微小的收敛。"),
  term("momentum", "springs", springs, "Momentum", "动量", "Stored velocity continues to influence motion after direct manipulation ends.", "保留速度并继续前进的运动，常见于拖拽释放或动画中断之后。"),
  term("velocity", "springs", springs, "Velocity", "速度", "Velocity records both speed and direction, allowing a new transition to inherit current movement.", "元素移动的快慢与方向；弹簧会在中断时把它带入下一段动画，使被快速甩动的元素保留速度。"),
  term("interruptible-animation", "springs", springs, "Interruptible animation", "可打断动画", "An in-progress transition accepts a new target while retaining continuity of position and velocity.", "动画可以在运行途中平滑地改变目标，无需等待当前动作完成。"),

  term("marquee", "loops", loops, "Marquee", "跑马灯", "A content track translates continuously and wraps to create an uninterrupted scrolling strip.", "文字或内容持续循环滚动。"),
  term("loop", "loops", loops, "Loop", "循环", "A timeline restarts according to a finite iteration count or continues indefinitely.", "按指定次数或无限重复播放的动画。"),
  term("alternate", "loops", loops, "Alternate (yoyo)", "往返循环", "Successive iterations reverse playback direction so each endpoint becomes the next starting point.", "每轮先正向播放再反向播放的循环，避免直接跳回起点。"),
  term("orbit", "loops", loops, "Orbit", "环绕", "An element follows a closed path around a center or companion object.", "一个元素沿连续路径围绕另一个元素旋转。"),
  term("pulse", "loops", loops, "Pulse", "脉冲", "A low-amplitude cycle of scale, opacity, or color periodically emphasizes an element.", "通过轻柔重复的缩放或透明度变化吸引注意。"),
  term("float", "loops", loops, "Float", "漂浮", "A slow repeating translation produces a light hovering impression around a stable resting point.", "轻柔、持续的上下漂移，让静态元素显得有生命力且轻盈。"),
  term("idle-animation", "loops", loops, "Idle animation", "空闲动效", "Low-intensity ambient motion gives a waiting element activity without requiring input.", "元素静置并等待交互时播放的细微运动。"),

  term("blur", "polish-effects", effects, "Blur", "模糊", "A blur filter blends neighboring pixels to soften edges, depth layers, or transitional artifacts.", "用于柔化元素或掩盖细小瑕疵的模糊滤镜。"),
  term("clip-path", "polish-effects", effects, "Clip-path", "裁切路径", "A geometric clipping region controls which portion of an element is painted.", "把元素裁切成指定形状，可用于揭示、遮罩和前后对比滑杆。"),
  term("mask", "polish-effects", effects, "Mask", "遮罩", "An alpha or luminance image modulates visibility, allowing gradients and soft-edged reveals.", "使用形状或渐变隐藏、揭示元素的部分区域；它类似裁切路径，同时支持柔和、可渐隐的边缘。"),
  term("before-after-slider", "polish-effects", effects, "Before / after slider", "前后对比滑杆", "A draggable boundary changes the visible share of two aligned layers for direct comparison.", "通过可拖动分割线在两张叠放图片之间擦拭切换，以便对比。"),
  term("line-drawing", "polish-effects", effects, "Line drawing", "线条绘制", "Animating SVG stroke dash values reveals a path progressively along its length.", "SVG 路径像被一支隐形画笔描摹一样自行绘制出来。"),
  term("text-morph", "polish-effects", effects, "Text morph", "文字形变", "Characters or glyph shapes transition between text states to focus attention on updated content.", "文字变化时逐字符播放动画，把注意力引向新值。"),
  term("skeleton-shimmer", "polish-effects", effects, "Skeleton / Shimmer", "骨架屏 / 微光", "A placeholder layout uses a moving highlight to communicate that content is still loading.", "内容加载期间显示的占位结构，表面带有移动的微光。"),
  term("number-ticker", "polish-effects", effects, "Number ticker", "数字滚动", "Numeric glyphs translate or interpolate until the display reaches an updated value.", "数字滚动或递增到目标值。"),
  term("tabular-numbers", "polish-effects", effects, "Tabular numbers", "等宽数字", "Tabular numeral glyphs share a fixed advance width, keeping changing values spatially stable.", "使用固定宽度的数字，使数值变化时不会左右跳动；它对数字滚动、计时器和计数器非常重要。"),
  term("typewriter", "polish-effects", effects, "Typewriter", "打字机", "A text sequence reveals characters at timed intervals to simulate incremental entry.", "文字像正在输入一样逐字符出现。"),

  term("frame-rate", "performance", performance, "Frame rate (FPS)", "帧率（FPS）", "Frame rate counts rendered frames per second; matching the display refresh cadence produces the smoothest result.", "每秒绘制的帧数；60fps 是流畅运动的基线，新款显示器可达到 120fps。"),
  term("jank", "performance", performance, "Jank", "卡顿", "Jank is a perceptible break in motion caused by irregular frame timing or delayed main-thread work.", "浏览器无法跟上动画并发生掉帧时出现的可见停顿。"),
  term("dropped-frame", "performance", performance, "Dropped frame", "丢帧", "A dropped frame occurs when rendering misses a display deadline and the previous image remains visible for another refresh.", "浏览器未能在截止时间前绘制的一帧，会让运动出现轻微顿挫。"),
  term("compositing", "performance", performance, "Compositing", "合成", "Compositing assembles painted layers into the final frame and can update transforms or opacity without repeating layout.", "让 GPU 在独立图层上移动元素或改变其透明度，无需重新执行布局或绘制。"),
  term("will-change", "performance", performance, "will-change", "will-change", "The will-change property warns the browser about an upcoming property change so it can prepare relevant rendering resources.", "一种 CSS 提示，用来告知浏览器元素即将播放动画，使浏览器可以提前把它提升到独立图层。"),
  term("layout-thrashing", "performance", performance, "Layout thrashing", "布局抖动", "Repeated interleaving of layout reads and writes forces synchronous recalculation and consumes the frame budget.", "动画化 width、height、top 或 left 等属性，迫使浏览器逐帧重新计算布局并引发卡顿。"),

  term("purposeful-animation", "principles", principles, "Purposeful animation", "有目的的动效", "Purposeful motion communicates hierarchy, causality, feedback, or spatial relationships in support of a user task.", "动效应承担明确功能，例如帮助定位、提供反馈或展示关系，而非只作装饰。"),
  term("anticipation", "principles", principles, "Anticipation", "预备动作", "A brief preparatory movement establishes direction and energy before the primary action.", "动作开始前先向相反方向进行一小段蓄力，用来预示即将发生的运动。"),
  term("follow-through", "principles", principles, "Follow-through", "跟随动作", "Secondary parts continue and settle after the main body reaches its destination, reinforcing weight and flexibility.", "主运动停止后，元素的部分结构继续移动并稍后稳定，从而增加重量感。"),
  term("squash-and-stretch", "principles", principles, "Squash & stretch", "挤压与拉伸", "Temporary deformation links shape to force, speed, or impact while preserving recognizable volume.", "在元素运动时改变其形状，用来表现重量、速度和弹性。"),
  term("perceived-performance", "principles", principles, "Perceived performance", "感知性能", "Motion and progressive feedback reduce uncertainty during waiting, changing how fast the interface feels.", "恰当的动画可以让界面在实际速度未变化时显得更快。"),
  term("frequency-of-use", "principles", principles, "Frequency of use", "使用频率", "Exposure frequency sets an animation's acceptable emphasis and length; repeated motion benefits from greater restraint.", "用户看到一段动画的频率越高，它就应越短、越克制。"),
  term("spatial-consistency", "principles", principles, "Spatial consistency", "空间一致性", "Objects retain coherent position, direction, and identity across states so changes remain easy to trace.", "让元素在不同状态之间保持身份与空间位置的连续，使用户始终知道内容去了哪里。"),
  term("hardware-acceleration", "principles", principles, "Hardware acceleration", "硬件加速", "Hardware acceleration uses compositor and GPU resources for eligible visual updates, helping frames meet display deadlines.", "动画化 transform 和 opacity，让 GPU 保持运动流畅。"),
  term("reduced-motion", "principles", principles, "Reduced motion", "减弱动效", "Reduced-motion behavior honors the user preference with stable spatial states and concise essential feedback.", "尊重用户的 prefers-reduced-motion 设置，降低或移除动态效果。")
];

const aliasDistinctions: Readonly<Record<string, LocalizedText>> = {
  "enter-exit": localized("进入 / 离开描述元素加入或移出界面时的生命周期动画；滑入只是其中一种带方向的实现。", "Enter / Exit names the lifecycle motion used when an element is added or removed; Slide in is one directional implementation."),
  "pop-in": localized("弹入会越过最终状态后回弹到位；缩放入场可以直接停在最终尺寸。", "Pop in overshoots and settles; Scale in can stop directly at its final size."),
  "interpolation-tween": localized("插值 / 补间负责生成两个值之间的中间帧；关键帧负责定义时间线上的状态节点。", "Interpolation / Tween generates frames between values; Keyframes defines state checkpoints on a timeline."),
  orchestration: localized("动效编排协调多段动画之间的时间关系；关键帧描述一段动画内部的状态。", "Orchestration coordinates timing across multiple animations; Keyframes describes states inside one animation."),
  "fill-mode": localized("填充模式控制动画有效区间外保留哪一帧的样式；关键帧定义有效区间内的状态。", "Fill mode controls which styles persist outside the active interval; Keyframes defines states inside it."),
  "stepped-animation": localized("步进动画在离散状态间跳变；常规关键帧通常会在状态之间连续插值。", "Stepped animation jumps between discrete states; regular keyframes usually interpolate continuously between states."),
  delay: localized("延迟是动画开始前的等待时间；时长是动画运行所花的时间。", "Delay is the wait before motion starts; Duration is the time the motion spends running."),
  scale: localized("缩放改变元素尺寸；位移改变元素位置。", "Scale changes an element's size; Translate changes its position."),
  rotate: localized("旋转改变元素围绕锚点的角度；位移改变元素位置。", "Rotate changes an element's angle around an anchor; Translate changes its position."),
  skew: localized("倾斜通过切变改变元素形状；位移沿坐标轴移动元素。", "Skew shears an element's shape; Translate moves it along an axis."),
  perspective: localized("透视控制 3D 投影的纵深强度；位移控制元素的空间位置。", "Perspective controls the depth of a 3D projection; Translate controls spatial position."),
  "transform-origin": localized("变换原点是缩放或旋转的锚点；纯位移不会因变换原点不同而改变轨迹。", "Transform origin anchors scale or rotation; a pure translation keeps the same path across origins."),
  "continuity-transition": localized("连续性过渡是一条保持前后关联的设计原则；形变是实现连续性的具体方式之一。", "Continuity transition is a principle for preserving before-and-after relationships; Morph is one technique that can create continuity."),
  "shared-element-transition": localized("共享元素过渡让同一元素跨布局移动并变换；形变强调一个形状变成另一个形状。", "Shared element transition moves and transforms the same element across layouts; Morph emphasizes one shape becoming another."),
  "layout-animation": localized("布局动画把尺寸或位置变化平滑化；形变改变元素的形状。", "Layout animation smooths size or position changes; Morph changes an element's shape."),
  "view-transition": localized("视图过渡指浏览器连接两个 DOM 状态或页面快照的机制；页面过渡涵盖更广泛的路由切换动画。", "View transition refers to the browser connecting DOM states or page snapshots; Page transition covers route-change animation more broadly."),
  drag: localized("拖拽是抓取并移动元素的通用手势；拖拽排序把该手势用于列表重排。", "Drag is the general gesture of grabbing and moving an element; Drag to reorder applies it to list ordering."),
  "rubber-banding": localized("橡皮筋回弹发生在拖过边界后，并带阻力返回；滑动关闭以越过阈值后移除元素为目标。", "Rubber-banding resists and returns after a boundary is crossed; Swipe to dismiss removes an element after a threshold."),
  "ease-out": localized("缓出是缓动的一种：开始快、结束慢，适合响应用户输入。", "Ease-out is an easing profile that starts fast and ends slowly, fitting user-triggered responses."),
  "ease-in": localized("缓入是缓动的一种：开始慢、结束快，容易让 UI 响应显得迟缓。", "Ease-in is an easing profile that starts slowly and ends fast, which can make UI response feel sluggish."),
  "ease-in-out": localized("缓入缓出两端较慢、中段较快，适合屏幕上已有元素的位移。", "Ease-in-out is slow at both ends and faster in the middle, fitting movement of elements already on screen."),
  linear: localized("线性缓动保持恒定速度，适合旋转器和跑马灯等连续运动。", "Linear easing keeps constant speed, fitting continuous motion such as spinners and marquees."),
  "cubic-bezier": localized("三次贝塞尔是自定义缓动曲线的表达方式，可精确控制加速与减速。", "Cubic-bezier expresses a custom easing curve for precise acceleration and deceleration control."),
  "asymmetric-easing": localized("非对称缓动使用不同的加速与减速速率；它属于自定义缓动策略。", "Asymmetric easing uses different acceleration and deceleration rates; it is a custom easing strategy."),
  "stiffness-tension": localized("刚度 / 张力决定弹簧拉向目标的力度，是弹簧模型的参数。", "Stiffness / Tension controls how strongly a spring pulls toward its target; it is a spring-model parameter."),
  damping: localized("阻尼决定弹簧消除振荡的速度；弹簧是包含阻尼在内的完整物理模型。", "Damping controls how quickly oscillation settles; Spring is the full physical model that includes damping."),
  mass: localized("质量决定元素呈现的重量与惯性；它与刚度、阻尼共同塑造弹簧响应。", "Mass controls perceived weight and inertia; it works with stiffness and damping to shape a spring response."),
  bounce: localized("弹跳是弹簧越过目标后回落的表现，通常由较低阻尼和合适刚度产生。", "Bounce is a spring overshooting and settling, commonly produced by lower damping with suitable stiffness."),
  "perceptual-duration": localized("感知时长描述用户觉得弹簧已经结束的时刻；它区别于固定 CSS 时长。", "Perceptual duration describes when a spring feels finished to the user; it differs from a fixed CSS duration."),
  momentum: localized("动量让动作在拖拽释放或中断后保留速度；弹簧可以接收并延续这份速度。", "Momentum preserves velocity after release or interruption; a spring can receive and carry that velocity."),
  velocity: localized("速度记录运动的快慢与方向；弹簧把它作为下一段响应的初始条件。", "Velocity records speed and direction; a spring can use it as the initial condition for the next response."),
  "interruptible-animation": localized("可打断动画描述运行中可平滑改向的交互能力；弹簧是实现这项能力的一种方式。", "Interruptible animation names the ability to retarget motion smoothly in flight; a spring is one way to implement it."),
  alternate: localized("往返循环每轮反向播放；循环也可以采用正向、反向或有限次数等其他策略。", "Alternate reverses direction each iteration; Loop also includes normal, reverse, finite, and infinite strategies."),
  pulse: localized("脉冲通过重复缩放或透明度变化吸引注意；空闲动效是包含脉冲在内的更宽泛类别。", "Pulse repeats scale or opacity changes to attract attention; Idle animation is the broader category that can include it."),
  float: localized("漂浮持续进行轻微上下位移；空闲动效也可以使用脉冲等其他低强度动作。", "Float uses continuous subtle vertical drift; Idle animation can also use pulse and other low-intensity motion."),
  "clip-path": localized("裁切路径使用清晰形状边界隐藏区域；模糊滤镜柔化像素，并不定义可见区域。", "Clip-path hides regions with a defined shape boundary; Blur softens pixels and does not define the visible region."),
  mask: localized("遮罩通过透明度或亮度控制可见区域并支持软边；模糊滤镜只负责柔化图像。", "Mask controls visible regions through alpha or luminance and supports soft edges; Blur only softens the image."),
  "tabular-numbers": localized("等宽数字是稳定数字宽度的排版特性；数字滚动是数值变化时播放的动画。", "Tabular numbers is a typographic feature that stabilizes digit width; Number ticker is the animation used when values change."),
  jank: localized("卡顿是用户看到的运动停顿；帧率是用于衡量绘制速度的指标。", "Jank is the visible stutter a user sees; Frame rate is the metric used to measure drawing speed."),
  "dropped-frame": localized("丢帧是一次未赶上绘制截止时间的事件；帧率汇总一段时间内的绘制频率。", "Dropped frame is one missed drawing deadline; Frame rate summarizes drawing frequency over time."),
  "will-change": localized("will-change 是浏览器优化提示；合成是浏览器把图层交给 GPU 处理的渲染阶段。", "will-change is an optimization hint; Compositing is the rendering stage that lets the GPU handle layers."),
  "layout-thrashing": localized("布局抖动由反复触发布局计算造成；合成友好的 transform 和 opacity 可以绕开这类工作。", "Layout thrashing comes from repeated layout calculation; compositor-friendly transform and opacity can avoid that work."),
  "frequency-of-use": localized("使用频率决定动效应多短、多克制；有目的的动效决定它承担什么功能。", "Frequency of use determines how short and subtle motion should be; Purposeful animation determines the function it serves."),
  "spatial-consistency": localized("空间一致性保持元素跨状态的身份与位置连续；有目的的动效为这种连续性提供理由。", "Spatial consistency preserves identity and position across states; Purposeful animation supplies the reason for that continuity."),
  "follow-through": localized("跟随动作发生在主运动停止之后；预备动作发生在主运动开始之前。", "Follow-through happens after the main motion stops; Anticipation happens before the main motion starts."),
  "squash-and-stretch": localized("挤压与拉伸通过形变表达重量和弹性；预备动作通过反向蓄力预示运动。", "Squash & stretch uses deformation to express weight and flexibility; Anticipation uses an opposite wind-up to preview motion."),
  "hardware-acceleration": localized("硬件加速描述利用 GPU 保持动画流畅的策略；合成是浏览器把独立图层交给 GPU 处理的渲染阶段。", "Hardware acceleration describes using the GPU to keep motion smooth; Compositing is the rendering stage that hands independent layers to the GPU.")
};

export const glossaryTerms: readonly GlossaryTerm[] = glossaryEntries.map((entry) => {
  const canonicalId = canonicalIdByEntryId[entry.id];
  if (!canonicalId) {
    throw new Error(`Glossary term has no canonical destination: ${entry.id}`);
  }
  const canonical = canonicalId === entry.id;
  const distinction = canonical ? undefined : aliasDistinctions[entry.id];
  if (!canonical && !distinction) {
    throw new Error(`Glossary alias has no distinction copy: ${entry.id}`);
  }
  return {
    ...entry,
    canonicalId,
    canonical,
    alias: !canonical,
    ...(distinction ? { distinction } : {})
  };
});

const glossaryById = new Map(glossaryTerms.map((entry) => [entry.id, entry]));

export function getGlossaryTerm(id: string) {
  return glossaryById.get(id);
}

export function getGlossaryTermsForCanonical(canonicalId: string) {
  const metadata = canonicalMotionCatalog.find((entry) => entry.id === canonicalId);
  if (!metadata) return [];
  return [metadata.id, ...metadata.aliases]
    .map((id) => glossaryById.get(id))
    .filter((entry): entry is GlossaryTerm => Boolean(entry));
}

export function getGlossaryAliasesForCanonical(canonicalId: string) {
  return getGlossaryTermsForCanonical(canonicalId).filter((entry) => entry.alias);
}
