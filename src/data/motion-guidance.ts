import type { LocalizedText } from "./types";

export type MotionGuidance = {
  canonicalId: string;
  purpose: LocalizedText;
  frequency: LocalizedText;
  trigger: LocalizedText;
  enterExit: LocalizedText;
  interruptibility: LocalizedText;
  gestureRules: LocalizedText;
  reducedMotionStrategy: LocalizedText;
  reviewNotes: readonly LocalizedText[];
};

type Pair = readonly [zh: string, en: string];

const localized = ([zh, en]: Pair): LocalizedText => ({ zh, en });

function guidance(
  canonicalId: string,
  purpose: Pair,
  frequency: Pair,
  trigger: Pair,
  enterExit: Pair,
  interruptibility: Pair,
  gestureRules: Pair,
  reducedMotionStrategy: Pair,
  reviewNotes: readonly Pair[]
): MotionGuidance {
  return {
    canonicalId,
    purpose: localized(purpose),
    frequency: localized(frequency),
    trigger: localized(trigger),
    enterExit: localized(enterExit),
    interruptibility: localized(interruptibility),
    gestureRules: localized(gestureRules),
    reducedMotionStrategy: localized(reducedMotionStrategy),
    reviewNotes: reviewNotes.map(localized)
  };
}

/** Every canonical workspace owns a complete review contract with no fallback. */
const motionGuidance: readonly MotionGuidance[] = [
  guidance(
    "fade-in-fade-out",
    ["低干扰地表达内容出现、消失或可见性变化。", "Communicate appearance, disappearance, or visibility changes with minimal distraction."],
    ["适合中高频状态变化；重复出现时将时长控制在 120–220ms。", "Suitable for medium- to high-frequency state changes; keep repeated uses around 120–220ms."],
    ["由内容挂载、异步完成、筛选结果变化或明确的显示状态触发。", "Trigger from mounting, async completion, filter-result changes, or an explicit visibility state."],
    ["进入从低透明度到完全可见；离开应在卸载前完成淡出。", "Enter from low opacity to fully visible; finish the exit fade before unmounting."],
    ["新状态到来时从当前透明度继续，避免先跳回起点。", "When state changes again, continue from the current opacity without resetting to the start."],
    ["无需手势控制；交互控件仍要立即更新可访问状态。", "No gesture control is required; interactive controls still update accessible state immediately."],
    ["保留一次 80–120ms 的短淡入淡出，重要信息同步使用静态对比。", "Keep a brief 80–120ms fade and pair important information with a static contrast change."],
    [
      ["确认淡出期间元素不会继续接收点击。", "Ensure the element stops receiving clicks while it fades out."],
      ["检查透明内容不会与背景形成难读的中间状态。", "Check that translucent intermediate states remain legible against the background."]
    ]
  ),
  guidance(
    "slide-in",
    ["通过移动方向解释内容来自哪里，以及它与现有布局的空间关系。", "Use direction to explain where content came from and how it relates spatially to the current layout."],
    ["适合低到中频的抽屉、面板和分层导航；高频反馈应改用更短的淡入。", "Use for low- to medium-frequency drawers, panels, and layered navigation; prefer shorter fades for frequent feedback."],
    ["由打开面板、添加内容或进入下一级导航触发，方向与信息来源一致。", "Trigger when opening a panel, adding content, or entering deeper navigation, with direction matching the source."],
    ["进入沿来源方向移动到位；离开沿相反路径返回，并保持退出目标明确。", "Enter from the source direction; exit along the reverse path with a clear destination."],
    ["反向操作应从当前位置接管并立刻改向，禁止等待上一段完成。", "A reversing action takes over at the current position and changes direction immediately."],
    ["拖拽式面板要让位移跟随指针，并在阈值后结算；按钮打开的面板保持点击与键盘等价。", "Gesture-driven panels follow the pointer and settle after a threshold; button-opened panels keep click and keyboard parity."],
    ["移除大幅位移，仅保留短淡入和清晰的层级边界。", "Remove large travel and keep a short fade with a clear layer boundary."],
    [
      ["检查进入方向与触发控件的位置关系。", "Check that the entry direction matches the trigger's position."],
      ["确保离场结束后焦点回到合理位置。", "Return focus to a sensible location after exit completes."]
    ]
  ),
  guidance(
    "scale-in",
    ["让浮层、徽标或轻量状态从接近最终尺寸的位置建立视觉存在。", "Establish overlays, badges, or compact states from a size close to their final form."],
    ["适合中频出现；频繁控件反馈将起始比例保持在 96% 以上。", "Suitable for medium-frequency appearances; keep frequent control feedback above a 96% start scale."],
    ["由浮层打开、状态确认或小型对象挂载触发，缩放原点贴近触发来源。", "Trigger on overlay opening, state confirmation, or compact object mounting, with origin near the trigger."],
    ["进入从 88–96% 放大并淡入；离开轻微缩小并淡出，避免缩到零。", "Enter from 88–96% with a fade; exit with a slight shrink and fade, keeping scale above zero."],
    ["再次触发时使用当前比例为起点，保证连续缩放。", "Use the current scale as the next starting point when retriggered."],
    ["该模式由状态触发；需要按压反馈时采用独立的 Press / Tap feedback。", "This pattern is state-triggered; use Press / Tap feedback for direct press response."],
    ["固定在最终尺寸，通过 80–120ms 透明度变化表达出现。", "Hold the final size and communicate appearance through an 80–120ms opacity change."],
    [
      ["核对 transform-origin 与触发来源。", "Verify that transform-origin matches the trigger source."],
      ["控制文字缩放幅度，避免字形闪烁或模糊。", "Limit text scaling to avoid glyph shimmer or blur."]
    ]
  ),
  guidance(
    "reveal",
    ["按明确边界逐步显露标题、媒体或分段内容，帮助用户理解阅读顺序。", "Uncover headings, media, or sections along a clear boundary to support reading order."],
    ["适合低频重点内容；列表和常驻正文避免逐项重复揭示。", "Reserve for low-frequency emphasis; avoid repeating it across lists or persistent body text."],
    ["由首屏进入、章节切换或媒体准备完成触发，揭示方向跟随内容结构。", "Trigger on initial view, section changes, or media readiness, with direction following content structure."],
    ["进入时裁切区域从小到完整；离开仅在信息确实被移除时反向收拢。", "Expand the clipped area on enter; reverse it on exit only when information is genuinely removed."],
    ["中断时保留当前裁切边界，并从该边界继续到新目标。", "Preserve the current clipping boundary on interruption and continue toward the new target."],
    ["无需拖拽；Before / after slider 才使用可手势控制的揭示边界。", "No drag is required; use Before / after slider for a gesture-controlled reveal boundary."],
    ["直接显示完整内容，最多保留短淡入；禁止隐藏延迟影响阅读。", "Show the complete content immediately with at most a short fade, avoiding delayed readability."],
    [
      ["确认裁切不会截断焦点轮廓。", "Ensure clipping never cuts off focus outlines."],
      ["检查文本在动画每一帧都保持可读。", "Keep text readable throughout every animation frame."]
    ]
  ),
  guidance(
    "stagger",
    ["通过短间隔依次引入同组项目，表达顺序、归属和整体节奏。", "Introduce grouped items at short intervals to communicate order, grouping, and rhythm."],
    ["适合低频列表首次出现；持续更新的列表应缩短间隔或同时更新。", "Use for a list's low-frequency first appearance; shorten or remove staggering for continuously updating lists."],
    ["由整组数据就绪或容器进入视口触发，项目顺序遵循阅读方向。", "Trigger when the group is ready or its container enters view, following reading order."],
    ["进入按顺序错开；离开通常整体淡出，确有层级含义时再反向错开。", "Stagger entrances in order; usually fade exits together and reverse-stagger only when hierarchy benefits."],
    ["数据变化时只动画新增或移动的项目，现有项目保持当前位置。", "On data changes, animate only added or moved items while existing items keep their position."],
    ["项目可点击时，第一项出现后即可操作；键盘顺序始终遵循 DOM。", "Make items operable as soon as they appear, and keep keyboard order aligned with the DOM."],
    ["取消项目间延迟，让整组内容同步短淡入或立即显示。", "Remove inter-item delay and show the group immediately or with one short shared fade."],
    [
      ["总时长包含最后一个项目的延迟，避免列表等待过久。", "Include the final item's delay in the total-duration review."],
      ["控制项目数量，超长列表仅动画首屏可见部分。", "For long lists, animate only the initially visible items."]
    ]
  ),
  guidance(
    "keyframes",
    ["定义多阶段状态、补间方式、步进节奏和动画结束后的样式。", "Define multi-stage states, interpolation behavior, stepped rhythm, and post-animation styles."],
    ["适合低频、具有阶段含义的动作；简单反馈优先使用单段 transition。", "Use for low-frequency motion with meaningful phases; simple feedback favors a single transition."],
    ["由明确状态变化或演示重播触发，每个关键帧承担可解释的阶段。", "Trigger from an explicit state change or replay action, with each keyframe representing a meaningful phase."],
    ["首帧对应进入前状态，末帧对应稳定状态；退出动画拥有独立且更短的时间线。", "Map the first frame to the pre-entry state and the last to the stable state; give exit its own shorter timeline."],
    ["中断后根据当前计算样式建立新时间线，避免强制跳到某个关键帧。", "On interruption, build the next timeline from current computed styles instead of snapping to a keyframe."],
    ["时间线本身无需手势；交互式进度控制要支持指针、触摸和键盘。", "The timeline itself needs no gesture; interactive progress controls support pointer, touch, and keyboard."],
    ["缩短为一次状态切换，移除预备、回弹和重复阶段。", "Collapse to one state change and remove anticipation, overshoot, and repeated phases."],
    [
      ["逐帧核对各阶段是否服务于理解。", "Review whether every phase improves understanding."],
      ["验证 fill-mode 不会留下不可交互的视觉状态。", "Verify that fill-mode never leaves an unusable visual state."]
    ]
  ),
  guidance(
    "duration",
    ["比较时长与延迟对响应速度、阅读节奏和可感知等待的影响。", "Compare how duration and delay affect responsiveness, reading rhythm, and perceived waiting."],
    ["每种高频交互都需要校准；低频展示动画可采用更宽松范围。", "Calibrate every frequent interaction; low-frequency presentation motion can use a broader range."],
    ["由控件状态变化触发，同一交互中的延迟只用于表达依赖关系。", "Trigger on control-state changes, using delay only to express dependency within the interaction."],
    ["进入通常比退出稍长；关闭、撤销和返回应快速响应。", "Entrances can run slightly longer than exits; closing, undoing, and returning respond quickly."],
    ["新输入立即取消等待，并从当前值过渡到最新目标。", "New input cancels pending delay immediately and transitions from the current value to the latest target."],
    ["连续调节时实时更新目标，释放手势后只执行必要的收敛。", "During continuous adjustment, update the target live and settle only as needed after release."],
    ["将非必要时长压缩到接近即时，延迟归零。", "Make nonessential transitions effectively immediate and remove delay."],
    [
      ["用真实操作频率评估时长，避免只看单次演示。", "Evaluate duration at real interaction frequency, beyond a single replay."],
      ["确认延迟不会让用户误以为输入失效。", "Ensure delay never makes input appear unresponsive."]
    ]
  ),
  guidance(
    "translate",
    ["在统一实验台中比较位移、缩放、旋转、倾斜、透视和变换原点。", "Compare translation, scale, rotation, skew, perspective, and transform origin in one controlled playground."],
    ["适合实现前的参数验证；生产界面只保留与当前状态关系有关的变换。", "Use during implementation tuning; production UI keeps only transforms that explain the state relationship."],
    ["由模式选择或状态变化触发，单次只突出一个主要变换维度。", "Trigger from mode selection or state change, emphasizing one primary transform dimension at a time."],
    ["进入从可解释的偏移状态回到 none；离开沿具有空间含义的方向退出。", "Enter from an explainable offset toward none; exit in a direction with spatial meaning."],
    ["切换变换模式时从当前矩阵继续，避免矩阵拆解造成跳变。", "Continue from the current transform matrix when switching modes to avoid decomposition jumps."],
    ["拖拽实验将位移与指针一一映射；缩放和旋转控件提供键盘步进。", "Map drag experiments directly to pointer travel, with keyboard steps for scale and rotation controls."],
    ["去除大幅位移、旋转和透视，仅保留状态颜色或短淡入。", "Remove large translation, rotation, and perspective, keeping a state-color change or short fade."],
    [
      ["确认变换不改变文档流和点击区域语义。", "Confirm transforms preserve document flow and hit-area semantics."],
      ["检查 transform-origin 在缩放和旋转模式中确实可见。", "Verify that transform-origin is visibly meaningful in scale and rotation modes."]
    ]
  ),
  guidance(
    "3d-tilt-flip",
    ["用受控透视展示卡片正反面或指针悬停产生的轻微深度。", "Use controlled perspective for card faces or subtle pointer-driven depth."],
    ["适合低频探索和重点卡片；高密度列表避免每张卡持续倾斜。", "Reserve for low-frequency exploration and featured cards; avoid continuous tilt across dense lists."],
    ["由明确翻面操作或精细指针悬停触发，触摸设备使用点击切换。", "Trigger from an explicit flip action or fine-pointer hover, with tap toggling on touch devices."],
    ["翻面过程中在 90° 附近切换可见面，退出时沿最短角度返回。", "Switch the visible face near 90° during the flip and return along the shortest angle on exit."],
    ["再次操作时从当前旋转角度改向，并保持正反面可见性同步。", "Retarget from the current angle and keep face visibility synchronized when operated again."],
    ["指针倾斜限制最大角度并在离开时归中；键盘只触发离散翻面。", "Cap pointer tilt and recenter on leave; keyboard interaction triggers a discrete flip."],
    ["使用即时正反面切换或短交叉淡化，关闭 3D 旋转和透视位移。", "Use an immediate face switch or short crossfade with 3D rotation and perspective travel removed."],
    [
      ["检查 backface-visibility 与阅读顺序。", "Check backface-visibility and reading order."],
      ["确保悬停倾斜不会移动按钮点击目标。", "Keep button hit targets stable during hover tilt."]
    ]
  ),
  guidance(
    "origin-aware-animation",
    ["让弹出层或展开内容从触发控件处生长，保持动作来源可追踪。", "Grow overlays or expanded content from their trigger so the motion source remains traceable."],
    ["适合中频菜单、气泡和局部展开；全屏页面切换使用更稳定的空间规则。", "Use for medium-frequency menus, popovers, and local expansion; full-screen transitions need a more stable spatial rule."],
    ["由具体触发控件打开内容时触发，并根据触发点与浮层位置计算原点。", "Trigger when a specific control opens content, deriving origin from trigger and overlay placement."],
    ["进入从触发点缩放并淡入；离开回到同一触发点，随后恢复焦点。", "Scale and fade in from the trigger; exit toward the same point and then restore focus."],
    ["浮层位置变化时平滑更新原点，关闭动作从当前几何状态开始。", "Update origin smoothly if placement changes, and begin closing from current geometry."],
    ["无需拖拽；触发控件必须支持键盘打开、Escape 关闭和正确焦点管理。", "No drag is required; the trigger supports keyboard opening, Escape closing, and correct focus management."],
    ["保持触发点与浮层的静态位置关联，使用短淡入淡出替代缩放位移。", "Preserve the static trigger-overlay relationship and replace scaling travel with a short fade."],
    [
      ["在四个边缘位置测试原点计算。", "Test origin calculation at all four viewport edges."],
      ["确认滚动或重排后关闭路径仍指向当前触发控件。", "Ensure the closing path still points to the current trigger after scroll or reflow."]
    ]
  ),
  guidance(
    "crossfade",
    ["在同一位置切换尺寸接近的状态，减少内容瞬间替换造成的跳变。", "Switch similarly sized states in the same location while reducing abrupt replacement."],
    ["适合中高频标签、图标和媒体状态；连续输入期间缩短重叠时间。", "Use for medium- to high-frequency labels, icons, and media states; shorten overlap during continuous input."],
    ["由选中项、内容版本或媒体状态变化触发，两个状态共享布局槽位。", "Trigger from selection, content version, or media-state changes, with both states sharing one layout slot."],
    ["旧状态淡出与新状态淡入部分重叠；离开元素在不可见后移除。", "Partially overlap old-state fade-out and new-state fade-in, removing the old element after it is hidden."],
    ["快速切换时从当前混合比例继续，只保留最新目标。", "On rapid changes, continue from the current blend ratio and retain only the latest target."],
    ["无需手势；滑块驱动的对比应使用 Before / after slider。", "No gesture is required; slider-driven comparison uses Before / after slider."],
    ["缩短到 80–120ms，或直接替换并保留稳定尺寸。", "Shorten to 80–120ms or switch immediately while preserving stable dimensions."],
    [
      ["确保重叠文字不会被辅助技术重复朗读。", "Prevent overlapping text from being announced twice by assistive technology."],
      ["检查两个状态的容器尺寸不会相互挤压。", "Keep both states from changing the shared container size."]
    ]
  ),
  guidance(
    "morph",
    ["让一个形状平滑变为另一个形状，并保持对象身份连续。", "Turn one shape smoothly into another while preserving object identity."],
    ["适合低频品牌符号、图标和高价值状态变化；常用控件保持更克制。", "Reserve for low-frequency brand marks, icons, and high-value state changes; keep common controls subtler."],
    ["由对象状态真正改变时触发，前后形状应具有可理解的对应关系。", "Trigger when the object's state genuinely changes, with understandable correspondence between shapes."],
    ["进入与离开共享同一几何对象和插值路径；复杂路径先统一节点数量。", "Use one geometric object and interpolation path across states, normalizing path points when needed."],
    ["中断时从当前插值形状转向新目标，避免回到任一端点。", "Retarget from the current interpolated shape instead of returning to an endpoint."],
    ["手势驱动形变要把进度连续映射到输入；离散控件提供键盘切换。", "Map gesture-driven morph progress continuously to input, with keyboard toggles for discrete controls."],
    ["使用静态状态替换或短交叉淡化，同时保持对象位置与尺寸连续。", "Use a static state replacement or short crossfade while preserving object position and size."],
    [
      ["明确区分形变、共享元素过渡和布局动画。", "Distinguish morphing from shared-element and layout transitions."],
      ["检查中间形状不会产生自相交或闪烁。", "Check intermediate shapes for self-intersection or flicker."]
    ]
  ),
  guidance(
    "accordion-collapse",
    ["在同一上下文中展开或收起补充内容，并让空间变化可预期。", "Expand or collapse supporting content in place with predictable spatial change."],
    ["适合中高频信息披露；用户反复使用时将时长保持在 180–260ms。", "Use for medium- to high-frequency disclosure, keeping repeated interactions around 180–260ms."],
    ["由标题按钮点击、轻触、Enter 或 Space 触发，aria-expanded 同步更新。", "Trigger from heading-button click, tap, Enter, or Space, updating aria-expanded in sync."],
    ["展开时高度和透明度同步增长；收起先弱化内容，再释放布局空间。", "Grow height and opacity together on expand; soften content before releasing layout space on collapse."],
    ["反向操作从当前高度立即改向，禁止等待完整展开或收起。", "Reverse immediately from the current height without waiting for expansion or collapse to finish."],
    ["点击目标覆盖整个标题行，移动端至少 44px；键盘焦点保持在触发按钮。", "Make the full heading row a target with at least 44px on mobile, keeping keyboard focus on the trigger."],
    ["立即切换内容可见性和布局高度，保留图标与 aria-expanded 的静态状态。", "Switch content visibility and layout height immediately while preserving icon and aria-expanded state."],
    [
      ["避免用 height:auto 无法插值的实现造成跳变。", "Avoid a non-interpolable height:auto implementation that snaps."],
      ["收起前处理内容内部焦点，防止焦点落入隐藏区域。", "Move focus out of content before it becomes hidden."]
    ]
  ),
  guidance(
    "direction-aware-transition",
    ["用相反方向表达前进与返回，维持导航序列和层级关系。", "Use opposite directions for forward and back navigation to preserve sequence and hierarchy."],
    ["适合中频步骤流、分页和历史导航；同级标签切换只在方向有意义时使用。", "Use for medium-frequency step flows, pagination, and history navigation; apply to peer tabs only when direction is meaningful."],
    ["由 next、previous、浏览器返回或有序索引变化触发。", "Trigger from next, previous, browser back, or ordered-index changes."],
    ["前进时新内容从前方进入、旧内容向后方退出；返回时完整反转。", "On forward navigation, new content enters from ahead as old content exits behind; reverse the mapping on back."],
    ["连续导航以当前进度接管，并只渲染当前位置与最新目标。", "Rapid navigation takes over at current progress and renders only the current and latest target."],
    ["滑动翻页时方向跟随手势；按钮与键盘导航沿用同一空间规则。", "Swipe pagination follows gesture direction; buttons and keyboard navigation use the same spatial rule."],
    ["改用短交叉淡化，同时保留前进、返回标签和焦点位置。", "Use a short crossfade while preserving forward/back labels and focus position."],
    [
      ["测试 RTL 语言中的前进方向。", "Test forward direction under RTL layouts."],
      ["确认视觉顺序、DOM 顺序和历史顺序一致。", "Align visual order, DOM order, and navigation history."]
    ]
  ),
  guidance(
    "scroll-reveal",
    ["在内容首次进入视口时提示新的阅读区块，并保持页面滚动连续。", "Signal a new reading section on first viewport entry while preserving scroll continuity."],
    ["每个内容块最多触发一次；长页面仅选择具有结构意义的节点。", "Trigger each section at most once and select only structurally meaningful nodes on long pages."],
    ["由 IntersectionObserver 达到阈值触发，页面加载时已可见内容立即呈现。", "Trigger from an IntersectionObserver threshold, showing initially visible content immediately."],
    ["进入采用短位移和淡入；滚出视口后保持稳定，避免反复隐藏。", "Enter with brief travel and fade, then remain stable after leaving the viewport."],
    ["快速滚动时直接完成当前揭示，避免队列堆积。", "Complete the current reveal during fast scrolling to avoid animation queues."],
    ["滚动本身保持原生；揭示动画不能劫持滚轮、触摸或键盘滚动。", "Keep scrolling native and never capture wheel, touch, or keyboard scroll input for the reveal."],
    ["内容进入视口时立即显示，或只保留一次极短淡入。", "Show content immediately on viewport entry or keep one very brief fade."],
    [
      ["禁用 JavaScript 时内容仍应可见。", "Keep content visible when JavaScript is unavailable."],
      ["避免首屏关键内容等待 observer 回调。", "Do not make critical above-the-fold content wait for an observer callback."]
    ]
  ),
  guidance(
    "scroll-driven-animation",
    ["把视觉进度连续绑定到滚动区间，用于解释位置、阶段或叙事进度。", "Bind visual progress continuously to a scroll range to explain position, phases, or narrative progress."],
    ["适合低频重点叙事和数据解释；常规正文保持原生静态阅读。", "Reserve for low-frequency featured narratives and data explanation; keep ordinary reading static."],
    ["由滚动位置持续驱动，并明确起点、终点和区间外的稳定状态。", "Drive continuously from scroll position with explicit start, end, and stable out-of-range states."],
    ["进入区间前固定首态，离开区间后固定末态；反向滚动精确回放。", "Hold the first state before the range and the last after it, replaying exactly during reverse scroll."],
    ["滚动输入天然可反向，渲染进度直接跟随当前位置。", "Scroll input is naturally reversible, with rendering tied directly to current progress."],
    ["保持原生滚动和触摸惯性；键盘、滚动条拖动与辅助技术得到同一结果。", "Preserve native scrolling and touch momentum, with keyboard, scrollbar drag, and assistive technology reaching the same result."],
    ["冻结在最能传达信息的静态帧，并提供文本化进度或说明。", "Freeze on the most informative static frame and provide textual progress or explanation."],
    [
      ["检查滚动区间在不同视口高度下仍合理。", "Test the scroll range across viewport heights."],
      ["避免逐帧触发布局和大面积绘制。", "Avoid per-frame layout work and large paint regions."]
    ]
  ),
  guidance(
    "parallax",
    ["用前后景的克制速度差建立层次，同时保持主体内容稳定可读。", "Create depth with restrained foreground-background speed differences while keeping primary content stable."],
    ["适合低频头图和展示区；长页面重复使用会增加视觉负担。", "Use sparingly in hero and showcase areas; repetition across long pages adds visual load."],
    ["由页面滚动持续驱动，运动幅度与容器可见区间绑定。", "Drive from page scroll, binding travel to the container's visible range."],
    ["进入视口前后保持连续位置，避免在观察阈值处突然启动。", "Maintain continuous position around viewport entry and avoid threshold-based jumps."],
    ["方向变化时直接跟随当前滚动位置，无需播放补偿动画。", "Follow current scroll position directly when direction changes, with no catch-up animation."],
    ["不接管滚动手势；背景层设置 pointer-events 规则，避免遮挡内容操作。", "Never capture scroll gestures, and set pointer-event rules so background layers do not block content."],
    ["所有层固定在信息最清晰的位置，移除速度差。", "Fix every layer at its clearest informational position and remove differential movement."],
    [
      ["控制速度比，主体文字保持接近页面滚动速度。", "Keep text near the page's scroll speed."],
      ["检查移动端地址栏变化不会放大位移。", "Test mobile browser chrome changes for exaggerated travel."]
    ]
  ),
  guidance(
    "page-transition",
    ["在页面或路由切换时维持上下文，并向用户解释新页面的层级来源。", "Preserve context across page or route changes and explain the new page's hierarchical source."],
    ["适合低到中频导航；主要任务路径保持简短且可跳过。", "Use for low- to medium-frequency navigation, keeping primary task paths brief and skippable."],
    ["由路由确认后触发，数据等待状态与视觉过渡分开管理。", "Trigger after route intent is confirmed, managing data waiting separately from visual transition."],
    ["旧页面快速退出，新页面在可交互内容就绪后进入；共享元素保持身份连续。", "Exit the old page quickly and enter the new page when interactive content is ready, preserving shared-element identity."],
    ["新导航立即取代旧目标，浏览器返回从当前过渡状态恢复。", "New navigation replaces the previous target immediately, and browser back resumes from current transition state."],
    ["滑动返回遵循平台手势；链接、键盘和历史导航保持同等可达。", "Respect platform swipe-back gestures while keeping links, keyboard, and history navigation equally reachable."],
    ["使用即时路由切换和短内容淡入，保留加载与焦点反馈。", "Use immediate routing with a short content fade while preserving loading and focus feedback."],
    [
      ["避免过渡遮罩延迟链接响应。", "Do not let transition overlays delay link response."],
      ["验证前进、后退、刷新和深链接路径。", "Verify forward, back, refresh, and deep-link paths."]
    ]
  ),
  guidance(
    "hover-effect",
    ["在精细指针悬停时强化可交互性，并保持布局和点击目标稳定。", "Reinforce interactivity on fine-pointer hover while keeping layout and hit targets stable."],
    ["适合高频控件，但幅度和时长需保持极小。", "Suitable for frequent controls when amplitude and duration remain very small."],
    ["仅在 hover:hover 且 pointer:fine 时由 pointerenter 触发。", "Trigger on pointerenter only when hover:hover and pointer:fine match."],
    ["悬停时进入强调态，指针离开时快速恢复；两端均保持内容位置稳定。", "Enter the emphasized state on hover and restore quickly on leave, keeping content position stable."],
    ["指针快速穿过时从当前样式返回，禁止排队播放。", "Return from current styles during rapid pointer movement without queuing animations."],
    ["触摸设备不模拟悬停；焦点可见状态提供等价提示。", "Touch devices do not emulate hover, and focus-visible provides equivalent affordance."],
    ["保留静态悬停和焦点颜色、边框或阴影变化，取消位移与缩放。", "Keep static hover and focus color, border, or shadow changes while removing travel and scale."],
    [
      ["确保 hover 不承担唯一信息。", "Keep hover from carrying unique information."],
      ["检查阴影和变换不会引发布局抖动。", "Ensure shadow and transform changes do not cause layout movement."]
    ]
  ),
  guidance(
    "press-tap-feedback",
    ["在按下瞬间确认输入已被接收，并赋予控件轻微实体感。", "Confirm input at press time and give the control a subtle physical response."],
    ["适合高频按钮和可点击卡片；反馈时长保持在 70–140ms。", "Use for frequent buttons and clickable cards, keeping feedback around 70–140ms."],
    ["由 pointerdown、touchstart、Space 或 Enter 的按下阶段触发。", "Trigger on pointerdown, touchstart, or the press phase of Space and Enter."],
    ["按下时轻微缩小并提高对比，释放或取消时立即回到稳定态。", "Scale down slightly and increase contrast on press, restoring immediately on release or cancel."],
    ["pointercancel、移出目标和重复按键都从当前比例恢复。", "Pointer cancel, target exit, and repeated key presses restore from the current scale."],
    ["视觉反馈跟随真实按压状态，不能延迟业务动作或扩大误触区域。", "Tie feedback to the real pressed state without delaying the action or expanding accidental hit areas."],
    ["取消缩放，仅保留即时颜色、边框或亮度反馈。", "Remove scaling and keep an immediate color, border, or luminance response."],
    [
      ["确保禁用控件没有按压动画。", "Ensure disabled controls have no press animation."],
      ["检查键盘按压与指针按压得到相同反馈。", "Match keyboard and pointer press feedback."]
    ]
  ),
  guidance(
    "hold-to-confirm",
    ["用可取消的持续进度确认高风险操作，降低误触概率。", "Confirm a high-risk action through cancellable sustained progress, reducing accidental activation."],
    ["仅用于低频且有后果的操作；日常按钮避免增加等待。", "Reserve for infrequent consequential actions and keep ordinary controls immediate."],
    ["按下并持续保持时开始，达到阈值后只提交一次。", "Begin on sustained press and submit exactly once when the threshold is reached."],
    ["进度从零连续填满；提前释放、移出或取消时平滑清空并回到待机。", "Fill progress continuously from zero, clearing and returning to idle on early release, exit, or cancel."],
    ["任何取消事件都立即停止计时，重新按下从零开始并提供明确状态。", "Every cancel event stops timing immediately; a new press restarts from zero with a clear state."],
    ["支持指针捕获、触摸取消和键盘长按；同时提供可访问的替代确认流程。", "Support pointer capture, touch cancellation, and keyboard holding, plus an accessible alternative confirmation flow."],
    ["保留静态进度或倒计时文本，移除填充运动，并允许常规二次确认。", "Use static progress or countdown text without filling motion, and allow a standard two-step confirmation."],
    [
      ["验证 pointercancel、窗口失焦和触摸滚动取消。", "Test pointercancel, window blur, and touch-scroll cancellation."],
      ["通过 aria-live 克制地宣布完成状态。", "Announce completion concisely through aria-live."]
    ]
  ),
  guidance(
    "drag-to-reorder",
    ["在列表重排过程中保持拾取对象、占位位置和最终落点清楚。", "Keep the picked item, placeholder, and final drop location clear during list reordering."],
    ["适合用户主动整理的中低频任务；自动排序场景无需拖拽。", "Use for user-driven low- to medium-frequency organization; automatic sorting needs no drag interaction."],
    ["由拖拽手柄的 pointerdown 或键盘拾取命令触发。", "Trigger from pointerdown on a drag handle or a keyboard pickup command."],
    ["拾取时元素升层，移动时邻项让位，放下后所有项目收敛到最终布局。", "Raise the item on pickup, shift neighbors during movement, and settle all items into final layout on drop."],
    ["拖拽可随时取消并返回原位；新目标位置实时替换旧占位。", "Allow cancellation back to the origin at any time, updating the placeholder live as the target changes."],
    ["设置专用手柄、触摸启动阈值、自动滚动边缘，并提供键盘移动与宣布位置。", "Provide a dedicated handle, touch activation threshold, edge auto-scroll, keyboard movement, and position announcements."],
    ["取消跟手移动动画，使用拾取状态、目标位置高亮和即时排序结果。", "Remove follow-pointer animation and use pickup state, target highlighting, and an immediate reorder result."],
    [
      ["测试长列表、滚动容器和跨组边界。", "Test long lists, scroll containers, and group boundaries."],
      ["确保排序结果持久化失败时可恢复。", "Restore the previous order if persistence fails."]
    ]
  ),
  guidance(
    "swipe-to-dismiss",
    ["把滑动距离映射到位移和透明度，让用户可预判关闭结果。", "Map swipe distance to travel and opacity so the dismissal outcome stays predictable."],
    ["适合中频通知、抽屉或单项操作；核心信息必须提供按钮替代。", "Use for medium-frequency notifications, drawers, or item actions, with a button alternative for essential content."],
    ["由水平或垂直拖拽超过启动阈值触发，并先锁定主轴。", "Trigger after drag crosses an activation threshold, locking to the primary axis first."],
    ["阈值前使用阻尼跟手，越过阈值后离场；未达到阈值则回弹原位。", "Track with resistance before the threshold, exit after crossing it, and spring back when the threshold is missed."],
    ["反向拖动立即改变进度；pointercancel 使用当前位置决定回弹。", "Reverse progress immediately with drag direction, using current position to settle after pointercancel."],
    ["避免与页面滚动轴冲突，设置 touch-action，并提供撤销或显式关闭按钮。", "Avoid conflicts with page scrolling through touch-action, and provide undo or an explicit close button."],
    ["使用静态关闭按钮与即时移除，保留撤销反馈；取消大幅滑出。", "Use a static close button and immediate removal with undo feedback, removing large off-screen travel."],
    [
      ["区分滑动关闭与橡皮筋回弹的交互目标。", "Distinguish dismissal from rubber-band boundary feedback."],
      ["测试慢拖、快甩、短距离和取消路径。", "Test slow drag, fast flick, short travel, and cancellation paths."]
    ]
  ),
  guidance(
    "shake-wiggle",
    ["用一次短促横向动作提示错误、拒绝或需要关注的输入。", "Use one brief horizontal motion to signal an error, rejection, or input needing attention."],
    ["仅在明确错误时低频使用；连续验证期间避免反复摇晃。", "Use infrequently for explicit errors and avoid repetition during continuous validation."],
    ["由提交失败或服务器拒绝触发，同时展示可读错误信息。", "Trigger on submission failure or server rejection while showing readable error text."],
    ["错误出现时完成 2–3 次衰减摆动，状态解除时不播放反向动画。", "Run 2–3 decaying oscillations when the error appears, with no reverse animation when cleared."],
    ["新输入立即停止摇晃；重复错误只在用户再次提交后触发。", "Stop shaking on new input and retrigger only after another submission."],
    ["无需手势；焦点移到错误摘要或首个无效字段，并保持键盘路径清楚。", "No gesture is required; move focus to an error summary or first invalid field with a clear keyboard path."],
    ["移除位移，使用错误边框、图标和文本；必要时保留一次短颜色脉冲。", "Remove travel and use error border, icon, and text, with at most one brief color pulse."],
    [
      ["摇晃不能替代错误文案。", "Never rely on shaking in place of error copy."],
      ["控制幅度，避免整页或大容器移动。", "Keep amplitude small and avoid moving a page or large container."]
    ]
  ),
  guidance(
    "ripple",
    ["从真实输入坐标扩散轻量涟漪，明确触点和按压确认。", "Expand a restrained ripple from the actual input coordinate to confirm the touch point."],
    ["适合中频、大面积触控目标；高密度桌面控件可采用更轻的按压反馈。", "Use for medium-frequency, larger touch targets; dense desktop controls can use lighter press feedback."],
    ["由 pointerdown 触发，圆心取相对控件的输入坐标。", "Trigger on pointerdown, positioning the center from coordinates relative to the control."],
    ["涟漪从触点扩散并淡出，完成后移除节点；控件本身保持稳定。", "Expand and fade from the touch point, removing the ripple node afterward while the control stays stable."],
    ["重复点击允许多个涟漪独立完成，并限制并发节点数量。", "Allow repeated presses to finish independently while capping concurrent ripple nodes."],
    ["键盘激活从控件中心产生等价反馈；涟漪层不得拦截指针事件。", "Keyboard activation uses the control center, and the ripple layer never intercepts pointer events."],
    ["取消扩散，保留即时背景色或描边变化。", "Remove expansion and keep an immediate background or outline change."],
    [
      ["在圆角和 overflow 裁切下检查边界。", "Check clipping against border radius and overflow."],
      ["确保涟漪对比足够可见且不会遮挡标签。", "Keep the ripple visible without obscuring the label."]
    ]
  ),
  guidance(
    "easing",
    ["比较速度曲线，帮助为响应动作、屏幕内移动和持续运动选择合适节奏。", "Compare velocity curves to choose an appropriate rhythm for responses, on-screen travel, and continuous motion."],
    ["每种交互模式在定稿前校准一次，设计系统内复用已批准曲线。", "Calibrate each interaction pattern before release and reuse approved curves through the design system."],
    ["由曲线选择或预览重播触发，所有选项共享相同距离和时长。", "Trigger from curve selection or replay with equal travel and duration across options."],
    ["响应用户的进入动作使用强缓出，屏幕内 A 到 B 移动使用缓入缓出。", "Use strong ease-out for user-triggered entrances and ease-in-out for on-screen A-to-B movement."],
    ["目标变化时从当前速度衔接；CSS transition 的中断效果需要真实操作验证。", "Carry current velocity into target changes and test interrupted CSS transitions through real interaction."],
    ["参数控件支持键盘步进，曲线图与运动结果同步更新。", "Support keyboard steps in controls and update the curve graph with the motion result."],
    ["保留极短状态过渡，移除明显加速、减速和长距离运动。", "Keep very short state transitions and remove pronounced acceleration, deceleration, and long travel."],
    [
      ["避免将 ease-in 用于即时 UI 响应。", "Avoid ease-in for immediate UI response."],
      ["线性曲线只用于旋转器、跑马灯等恒速运动。", "Reserve linear curves for constant-speed motion such as spinners and marquees."]
    ]
  ),
  guidance(
    "spring",
    ["通过刚度、阻尼、质量和初速度塑造可中断、保留速度的物理响应。", "Shape interruptible, velocity-preserving physical response through stiffness, damping, mass, and initial velocity."],
    ["适合中频手势结算和对象跟随；高频微反馈使用高阻尼、短感知时长。", "Use for medium-frequency gesture settling and object following; frequent micro-feedback needs high damping and short perceptual duration."],
    ["由拖拽释放、目标位置变化或状态切换触发，并传入当前速度。", "Trigger on drag release, target-position changes, or state transitions, passing current velocity."],
    ["从当前值向目标收敛；退出动作根据风险控制过冲，避免内容越界。", "Settle from current value toward the target, limiting exit overshoot so content stays within safe bounds."],
    ["新目标立即接管当前位移和速度，这是弹簧体验的核心要求。", "A new target immediately inherits current position and velocity, which is central to the spring experience."],
    ["手势速度以同一坐标系传入弹簧，取消时选择最近安全目标；键盘使用离散目标。", "Pass gesture velocity in the same coordinate space, settle to the nearest safe target on cancel, and use discrete keyboard targets."],
    ["采用高阻尼或即时到达，取消回弹和持续微振荡。", "Use high damping or immediate arrival, removing bounce and prolonged micro-oscillation."],
    [
      ["按感知结束时间评估，禁止只看物理模拟的理论尾部。", "Review perceptual completion rather than only the simulation's theoretical tail."],
      ["测试中途改向、快速甩动和低帧率设备。", "Test mid-flight retargeting, fast flicks, and low-frame-rate devices."]
    ]
  ),
  guidance(
    "loop",
    ["控制重复方向、次数和停顿，让循环传达活性或等待，同时限制干扰。", "Control repeat direction, count, and pauses so loops communicate activity or waiting with limited distraction."],
    ["仅在状态持续期间运行；普通内容避免永久循环。", "Run only while the underlying state persists and avoid permanent loops in ordinary content."],
    ["由加载、直播、演示或显式播放状态触发，离开视口时暂停。", "Trigger from loading, live, demo, or explicit play state, pausing when offscreen."],
    ["每轮结束在稳定帧停顿；状态结束时完成当前短阶段或立即收敛。", "Pause on a stable frame between iterations and settle promptly when the state ends."],
    ["暂停后从当前进度恢复；状态改变时取消旧循环并清理计时器。", "Resume from current progress after pause and cancel old loops with timer cleanup on state changes."],
    ["悬停、聚焦和用户控制可暂停；播放控件支持键盘和辅助技术。", "Allow hover, focus, and user controls to pause, with keyboard and assistive-technology support."],
    ["停止自动循环，显示代表性静态帧和明确状态文本。", "Stop automatic looping and show a representative static frame with explicit status text."],
    [
      ["验证页面隐藏和离屏时暂停。", "Pause when the page is hidden or the element is offscreen."],
      ["避免多个循环在同一视口竞争注意力。", "Prevent multiple loops from competing for attention in one viewport."]
    ]
  ),
  guidance(
    "marquee",
    ["在有限空间内连续展示超长信息流，并提供暂停阅读的能力。", "Present an overlong information stream in limited space while allowing users to pause and read."],
    ["适合低频品牌、合作方或实时状态带；正文信息保持静态可访问。", "Use sparingly for brands, partners, or live status strips while keeping core text statically accessible."],
    ["由内容溢出且组件处于播放状态触发，内容不足一屏时保持静止。", "Run only when content overflows and playback is active, remaining still when content fits."],
    ["副本无缝衔接形成连续轨道，停止时落在完整可读的位置。", "Join duplicated content into a seamless track and stop at a fully readable position."],
    ["悬停、聚焦或页面隐藏时暂停当前位置，恢复后继续。", "Pause at the current position on hover, focus, or page hide, and continue on resume."],
    ["用户可通过悬停、聚焦和按钮暂停；轨道内容的键盘顺序只保留一份。", "Let users pause through hover, focus, and a control while keeping one keyboard-accessible copy of track content."],
    ["停止滚动并换行或展示可横向浏览的静态列表。", "Stop scrolling and wrap content or provide a statically browsable horizontal list."],
    [
      ["隐藏重复副本，避免屏幕阅读器重复朗读。", "Hide duplicate copies from screen readers."],
      ["速度按文本长度和阅读时间校准。", "Calibrate speed against text length and reading time."]
    ]
  ),
  guidance(
    "orbit",
    ["让辅助节点围绕中心缓慢运行，用于表达持续活性、同步或环境状态。", "Move a secondary node slowly around a center to express ongoing activity, synchronization, or ambient status."],
    ["只用于低频环境状态，且同屏保持单一轨道焦点。", "Reserve for low-frequency ambient status with a single orbital focal point per view."],
    ["由持续状态启动，组件离屏、失焦或状态完成时暂停。", "Start from an ongoing state and pause when offscreen, unfocused, or complete."],
    ["从稳定轨道点进入并匀速运行，结束时减速停在有意义的位置。", "Enter from a stable orbital point, run steadily, and settle at a meaningful position on completion."],
    ["暂停和恢复保持当前角度，方向切换从当前位置连续进行。", "Pause and resume at the current angle, changing direction continuously from that point."],
    ["轨道通常不响应手势；需要控制时提供独立播放按钮。", "Orbit motion is usually non-gestural; provide a separate playback control when needed."],
    ["显示中心和轨道节点的静态关系，补充状态文字。", "Show a static center-node relationship with supporting status text."],
    [
      ["避免轨道节点穿过文字或操作控件。", "Keep orbital nodes away from text and controls."],
      ["验证无限动画在后台正确暂停。", "Verify that infinite animation pauses in the background."]
    ]
  ),
  guidance(
    "idle-animation",
    ["通过低幅度漂浮或脉冲提示元素处于可用、等待或活跃状态。", "Use low-amplitude float or pulse motion to indicate availability, waiting, or activity."],
    ["只在长时间静置时低频出现，用户开始操作后立即停止。", "Appear only after a meaningful idle period and stop immediately when the user interacts."],
    ["由空闲计时器或持续状态触发，页面隐藏和元素离屏时暂停。", "Trigger from an idle timer or ongoing state, pausing when hidden or offscreen."],
    ["从稳定状态渐入低幅度循环，退出时在最近的中性帧停止。", "Ease into a low-amplitude loop and stop on the nearest neutral frame."],
    ["输入到来时取消循环并平滑回到稳定值，避免与交互反馈叠加。", "Cancel on input and settle to a stable value without overlapping interaction feedback."],
    ["空闲动效不承担操作；真实控件仍提供明确点击、触摸和键盘反馈。", "Idle motion carries no action; real controls keep explicit click, touch, and keyboard feedback."],
    ["关闭自动漂浮和脉冲，使用静态状态标记。", "Disable automatic float and pulse motion and use a static status indicator."],
    [
      ["确认动效只在真正空闲后开始。", "Start only after the interface is genuinely idle."],
      ["控制振幅和对比，避免持续吸引注意。", "Limit amplitude and contrast to avoid persistent attention capture."]
    ]
  ),
  guidance(
    "blur",
    ["用模糊柔化媒体或过渡边缘，并掩盖加载或合成中的细小瑕疵。", "Use blur to soften media or transition edges and mask minor loading or compositing imperfections."],
    ["适合低频媒体揭示和背景层；正文与高频控件避免持续滤镜。", "Use for low-frequency media reveals and background layers, avoiding persistent filters on text and frequent controls."],
    ["由媒体就绪、层级切换或焦点变化触发，模糊半径保持克制。", "Trigger from media readiness, layer changes, or focus changes with a restrained blur radius."],
    ["进入时模糊快速归零并同步淡入；离开仅在层级关系明确时增加模糊。", "Resolve blur quickly to zero with a fade on enter, adding blur on exit only when hierarchy is clear."],
    ["状态改变时从当前滤镜值继续，并在完成后移除不必要的 filter。", "Continue from the current filter value on state changes and remove unnecessary filters after completion."],
    ["无需手势；可拖动遮罩和裁切比较归入专用交互模式。", "No gesture is required; draggable masks and clipping comparisons belong to dedicated interaction patterns."],
    ["直接显示清晰内容，仅保留静态层级和透明度变化。", "Show crisp content directly, preserving only static hierarchy and opacity changes."],
    [
      ["检查 filter 对大面积绘制和低端设备的成本。", "Measure filter cost on large paint areas and lower-end devices."],
      ["明确区分 Blur、Clip-path 与 Mask。", "Distinguish Blur, Clip-path, and Mask explicitly."]
    ]
  ),
  guidance(
    "before-after-slider",
    ["通过可拖动分割线比较同一画面的两个叠加状态。", "Compare two overlaid states of the same visual through a draggable divider."],
    ["适合用户主动探索的低频比较任务；默认位置应立即表达差异。", "Use for low-frequency, user-driven comparison with a default position that makes the difference immediately clear."],
    ["由拖动分割线、点击轨道或键盘方向键触发。", "Trigger from divider drag, track click, or keyboard arrow keys."],
    ["组件初始直接显示两个状态，拖动只改变裁切边界，不播放自动入场。", "Show both states immediately and let dragging change only the clipping boundary, with no automatic entrance."],
    ["输入中断时停在当前位置；新的指针或键盘输入从当前比例继续。", "Stop at the current position on interruption and continue from that ratio on new input."],
    ["使用指针捕获、44px 手柄、方向键步进和 Home/End；标签说明两侧含义。", "Use pointer capture, a 44px handle, arrow-key steps, Home/End, and labels describing both sides."],
    ["保留可操作分割线，取消位置补间；键盘和指针仍即时更新静态裁切。", "Keep the operable divider while removing position tweening; keyboard and pointer update the static clip immediately."],
    [
      ["两张图片保持相同尺寸、构图和替代文本策略。", "Keep both images aligned in size, composition, and alt-text strategy."],
      ["检查最小与最大位置仍可看清手柄。", "Keep the handle visible at minimum and maximum positions."]
    ]
  ),
  guidance(
    "line-drawing",
    ["沿 SVG 路径逐步绘制图标、流程线或解释性连接，强调结构形成过程。", "Draw an SVG path progressively to emphasize how an icon, flow, or explanatory connection forms."],
    ["适合低频品牌时刻和解释动画；高频图标直接显示完整形态。", "Reserve for low-frequency brand moments and explanations, showing frequent icons immediately."],
    ["由内容首次呈现或用户主动重播触发，路径顺序遵循视觉阅读方向。", "Trigger on first presentation or explicit replay, ordering paths by visual reading direction."],
    ["进入从完整 dash offset 绘制到零；离开通常淡出完整线条。", "Draw from full dash offset to zero on enter and usually fade the complete line on exit."],
    ["重播前先清晰重置，过程中被中断则保留当前可见路径。", "Reset clearly before replay and preserve the currently visible path if interrupted."],
    ["无需手势；重播按钮支持键盘，并为图形提供文本含义。", "No gesture is required; replay supports keyboard input and the graphic has a textual meaning."],
    ["直接显示完整路径，或使用一次极短淡入。", "Show the complete path immediately or with one very short fade."],
    [
      ["检查 pathLength 与 dasharray 在不同 SVG 下正确归一化。", "Normalize pathLength and dasharray across SVG assets."],
      ["保持线条绘制顺序与信息逻辑一致。", "Align drawing order with the information logic."]
    ]
  ),
  guidance(
    "text-morph",
    ["在长度接近的短文本值之间平滑替换，并把注意力引向变化内容。", "Transition smoothly between similarly sized short text values and direct attention to the change."],
    ["适合低到中频指标、状态词和短标签；正文段落直接替换。", "Use for low- to medium-frequency metrics, status words, and short labels, replacing body paragraphs directly."],
    ["由值变化触发，只动画发生变化的字符或词组。", "Trigger on value change and animate only the characters or phrase that changed."],
    ["旧字形弱化并让位，新字形在同一基线出现；容器宽度保持可预测。", "Soften and replace old glyphs as new glyphs appear on the same baseline, keeping container width predictable."],
    ["快速更新时合并中间值，只向最新文本收敛。", "Coalesce rapid updates and settle only on the latest text."],
    ["无需手势；实时值提供 aria-live 策略，避免逐字符播报。", "No gesture is required; use an aria-live strategy that avoids character-by-character announcements."],
    ["立即替换完整文本，使用静态高亮或一次短淡入提示变化。", "Replace the full text immediately and use static highlighting or one short fade to signal change."],
    [
      ["测试不同字数、CJK 字符和换行边界。", "Test varying lengths, CJK characters, and wrapping boundaries."],
      ["确保屏幕阅读器只接收最终值。", "Ensure screen readers receive only the final value."]
    ]
  ),
  guidance(
    "skeleton-shimmer",
    ["在内容加载期间维持布局，并用低对比扫光表达仍在进行。", "Preserve layout during loading and communicate ongoing work through a low-contrast shimmer."],
    ["只在预期等待超过短暂阈值时显示；快速请求直接呈现结果。", "Show only when expected waiting exceeds a brief threshold, rendering fast results directly."],
    ["由加载延迟阈值触发，真实内容就绪后立即停止。", "Trigger after a loading-delay threshold and stop as soon as real content is ready."],
    ["骨架静态占位先出现，扫光低速循环；内容进入采用短交叉淡化。", "Show static placeholders first, loop a slow shimmer, and crossfade briefly into real content."],
    ["请求取消或重试时更新状态，禁止叠加多个扫光计时器。", "Update state on cancel or retry without stacking shimmer timers."],
    ["骨架不接收操作；加载期间保留可用的取消、返回或重试控件。", "Skeletons are noninteractive while cancel, back, or retry controls remain available."],
    ["关闭扫光，保留静态骨架和明确的加载文本。", "Disable shimmer and keep a static skeleton with explicit loading text."],
    [
      ["骨架尺寸应接近真实内容，避免加载完成后布局跳动。", "Match skeleton dimensions to real content to prevent completion shifts."],
      ["页面隐藏和离屏时暂停扫光。", "Pause shimmer when hidden or offscreen."]
    ]
  ),
  guidance(
    "number-ticker",
    ["用稳定的等宽数字滚动或计数到新值，突出数值变化方向和幅度。", "Roll or count with stable tabular digits to emphasize the direction and magnitude of a value change."],
    ["适合低到中频指标更新；高速实时数据应批量更新或直接替换。", "Use for low- to medium-frequency metric updates; batch or replace high-rate live data directly."],
    ["由已确认的新数值触发，并根据增减方向选择滚动方向。", "Trigger from a confirmed new value, choosing roll direction from increase or decrease."],
    ["变化位数滚动到目标，未变化位保持稳定；初始加载直接显示完整值。", "Roll changed digits to their targets while unchanged digits remain stable, showing the full initial value immediately."],
    ["连续更新合并到最新值，并从当前显示数值和速度继续。", "Coalesce successive updates toward the latest value from the current displayed value and velocity."],
    ["无需手势；数值控件的增减按钮提供键盘和长按规则。", "No gesture is required; numeric increment controls provide keyboard and hold behavior separately."],
    ["立即替换数值，使用静态颜色或箭头标明增减。", "Replace the value immediately and indicate direction through static color or an arrow."],
    [
      ["启用 font-variant-numeric: tabular-nums。", "Enable font-variant-numeric: tabular-nums."],
      ["辅助技术只宣布最终值和变化含义。", "Announce only the final value and change meaning to assistive technology."]
    ]
  ),
  guidance(
    "typewriter",
    ["逐字符显露短文本，模拟输入过程并控制叙事节奏。", "Reveal short text character by character to simulate typing and pace a narrative moment."],
    ["只用于低频短句、演示或品牌时刻；说明文字和任务文本完整显示。", "Reserve for low-frequency short lines, demos, or brand moments, showing instructional and task text in full."],
    ["由用户主动播放或一次性场景进入触发，完整文本在 DOM 中始终可用。", "Trigger from explicit playback or one-time scene entry while keeping complete text available in the DOM."],
    ["字符按稳定节奏出现，标点可稍作停顿；离开时整体淡出。", "Reveal characters at a stable pace with optional punctuation pauses, and fade the whole line on exit."],
    ["重播先清晰重置；跳过操作立即显示完整文本。", "Reset clearly before replay and reveal the complete text immediately on skip."],
    ["提供跳过或立即显示控件，键盘可操作；打字光标不抢占焦点。", "Provide a keyboard-operable skip or reveal control, with the visual caret kept out of focus order."],
    ["直接显示完整文本，保留静态光标或移除光标闪烁。", "Show the complete text immediately and keep a static caret or remove caret blinking."],
    [
      ["屏幕阅读器读取完整句子，避免逐字符播报。", "Expose the complete sentence to screen readers instead of character announcements."],
      ["中文按字素簇切分，避免拆开 emoji 和组合字符。", "Segment by grapheme cluster so emoji and combined characters remain intact."]
    ]
  ),
  guidance(
    "frame-rate",
    ["通过帧率、长任务和掉帧定位运动卡顿，并建立可复现的性能基线。", "Diagnose motion jank through frame rate, long tasks, and dropped frames with a reproducible performance baseline."],
    ["在代表性设备、关键动效变更和发布前执行；高风险页面纳入持续监测。", "Run on representative devices, after key motion changes, and before release, with ongoing monitoring for high-risk pages."],
    ["由性能录制、自动基准或真实用户监测触发，覆盖冷启动和稳定状态。", "Trigger from performance recordings, automated benchmarks, or real-user monitoring across cold and steady states."],
    ["指标面板即时更新，不使用会干扰测量结果的装饰入场动画。", "Update metrics immediately without decorative entrance motion that contaminates measurements."],
    ["录制可随时停止并保留样本；重复测试使用同一脚本和设备条件。", "Allow recording to stop while preserving samples, and repeat tests with the same script and device conditions."],
    ["滚动、拖拽和点击测试使用一致手势轨迹，自动化与人工路径相互校验。", "Use consistent gesture paths for scroll, drag, and click tests, cross-checking automated and manual runs."],
    ["分别测试默认与 reduced-motion 模式，确认低动态路径也没有长任务。", "Measure default and reduced-motion modes separately, confirming the low-motion path also avoids long tasks."],
    [
      ["区分帧率、单次丢帧和可见卡顿。", "Distinguish frame rate, an individual dropped frame, and visible jank."],
      ["在 60Hz 与高刷新率设备上记录目标。", "Record targets on both 60Hz and high-refresh displays."]
    ]
  ),
  guidance(
    "compositing",
    ["比较合成友好属性与触发布局或绘制的属性，选择稳定的渲染路径。", "Compare compositor-friendly properties with layout- or paint-triggering properties to choose a stable rendering path."],
    ["在新动效实现、性能回归和复杂页面集成时检查。", "Review during new motion implementation, performance regressions, and integration into complex pages."],
    ["由属性选择或性能实验触发，同时记录主线程、布局、绘制和合成活动。", "Trigger from property selection or a performance experiment while recording main-thread, layout, paint, and compositing activity."],
    ["实验对象直接切换属性方案，指标变化保持可读，避免附加过渡污染结果。", "Switch property strategies directly and keep metric changes readable without extra transitions affecting results."],
    ["测试可中断并重置图层状态，will-change 只在需要前短暂启用。", "Allow tests to stop and reset layer state, enabling will-change only shortly before it is needed."],
    ["手势测试按同样距离和速度驱动两种方案，确保比较公平。", "Drive compared strategies with identical gesture distance and speed."],
    ["低动态模式仍优先 transform 和 opacity，并减少持续图层占用。", "Reduced-motion mode still favors transform and opacity while limiting persistent layer allocation."],
    [
      ["区分 Compositing、will-change 与 Layout thrashing。", "Distinguish Compositing, will-change, and Layout thrashing."],
      ["检查图层数量、内存和完成后的清理。", "Inspect layer count, memory use, and cleanup after completion."]
    ]
  ),
  guidance(
    "purposeful-animation",
    ["审核每段动效是否承担定位、反馈、关系解释或感知性能等明确功能。", "Review whether every motion pattern serves orientation, feedback, relationship explanation, or perceived performance."],
    ["设计评审、实现评审和发布前都执行；高频动作接受更严格的克制标准。", "Apply during design review, implementation review, and pre-release, with stricter restraint for frequent motion."],
    ["由新增动效、交互变更或用户反馈触发审查，并记录可验证目的。", "Trigger review from new motion, interaction changes, or user feedback, documenting a testable purpose."],
    ["进入与退出规则源于信息关系，删除无法解释来源或去向的位移。", "Derive enter and exit rules from information relationships and remove travel with no explainable source or destination."],
    ["要求高频交互可打断，低频叙事也要提供跳过或快速完成路径。", "Require frequent interactions to be interruptible and give low-frequency narratives a skip or fast-complete path."],
    ["手势动效必须跟手、可取消并有键盘替代；装饰动效不占用手势。", "Gesture motion follows input, supports cancellation, and has a keyboard alternative, while decorative motion consumes no gestures."],
    ["为每个目的提供等价低动态表达，功能和状态信息完整保留。", "Provide an equivalent low-motion expression for each purpose while preserving function and state information."],
    [
      ["记录目的、出现频率和空间规则。", "Document purpose, frequency, and spatial rules."],
      ["删除无法通过用户理解或反馈验证的装饰动作。", "Remove decorative motion with no user-understanding or feedback benefit."]
    ]
  ),
  guidance(
    "anticipation",
    ["通过反向预备、跟随收敛和适量形变表达动作方向、重量与弹性。", "Use opposite-direction anticipation, follow-through settling, and measured deformation to express direction, weight, and flexibility."],
    ["适合低频、具有物理意味的对象动作；高频 UI 反馈将预备阶段压到极短。", "Use for low-frequency object motion with physical meaning, compressing anticipation heavily for frequent UI feedback."],
    ["由用户主动发起的移动、投掷或状态切换触发，预备方向与主运动相反。", "Trigger from user-initiated movement, throwing, or state changes, with anticipation opposite the main travel."],
    ["进入先小幅蓄力再完成主运动，结束后用一次衰减跟随动作稳定。", "Wind up briefly before the main travel and settle with one decaying follow-through phase."],
    ["中断时取消剩余阶段并从当前位置与速度转向新目标。", "Cancel remaining phases on interruption and retarget from current position and velocity."],
    ["手势速度影响主运动，预备阶段不能阻止即时响应；键盘触发使用固定短预备。", "Let gesture velocity influence main travel without delaying response, using a fixed brief anticipation for keyboard triggers."],
    ["移除反向蓄力、过冲和形变，直接进入稳定目标或短淡入。", "Remove wind-up, overshoot, and deformation, moving directly to the stable target or using a short fade."],
    [
      ["分别辨析 Anticipation、Follow-through 与 Squash & stretch。", "Review Anticipation, Follow-through, and Squash & stretch as distinct concepts."],
      ["控制形变幅度，保持文字和图标可识别。", "Limit deformation so text and icons remain recognizable."]
    ]
  ),
  guidance(
    "perceived-performance",
    ["通过即时状态、稳定骨架和连续反馈缩短用户感受到的等待。", "Reduce perceived waiting through immediate state changes, stable skeletons, and continuous feedback."],
    ["用于所有可感知等待路径，并根据真实延迟选择反馈层级。", "Apply to every perceivable wait path, choosing feedback depth from actual latency."],
    ["输入确认后立即触发，随后按延迟阈值升级为进度、骨架或可取消状态。", "Trigger immediately after input, escalating to progress, skeleton, or cancellable state at latency thresholds."],
    ["先确认输入，再维持布局，最终内容就绪时平滑接管；失败状态快速显现。", "Confirm input first, preserve layout during waiting, and hand off smoothly to ready content, surfacing failures quickly."],
    ["用户取消、新请求和失败重试都更新同一状态机，清理旧反馈。", "Handle cancel, replacement requests, and retries through one state machine that cleans up stale feedback."],
    ["长任务提供取消与返回；按钮保持键盘操作，进度状态可被辅助技术理解。", "Long tasks provide cancel and back paths, with keyboard-operable controls and accessible progress state."],
    ["关闭循环扫光和大幅过渡，保留即时状态、静态骨架与进度文本。", "Disable looping shimmer and large transitions while preserving immediate state, static skeletons, and progress text."],
    [
      ["按真实延迟测量体验，避免用动画掩盖性能问题。", "Measure against real latency and keep motion from hiding performance problems."],
      ["区分确定进度、未知进度和瞬时等待。", "Distinguish determinate progress, indeterminate progress, and momentary waiting."]
    ]
  ),
  guidance(
    "reduced-motion",
    ["为移动、缩放、循环、视差和物理动效提供信息等价的低动态表达。", "Provide information-equivalent low-motion treatments for travel, scaling, loops, parallax, and physical motion."],
    ["每个动效模式都需评审，持续运动和大幅空间移动优先处理。", "Review every motion pattern, prioritizing continuous motion and large spatial travel."],
    ["由 prefers-reduced-motion 与产品内显式设置共同决定，并实时响应变化。", "Resolve from prefers-reduced-motion plus an explicit product setting, responding to changes live."],
    ["内容立即进入稳定位置，使用静态层级、颜色、文本或极短淡入表达状态。", "Place content at its stable position immediately and express state through static hierarchy, color, text, or a very short fade."],
    ["偏好切换时终止当前非必要动画并应用最终状态，保留任务进度。", "When preference changes, stop nonessential motion at its final state while preserving task progress."],
    ["手势功能继续可用，取消动量、回弹和自动跟随；键盘与按钮路径完整保留。", "Keep gesture functions available while removing momentum, bounce, and automatic following, with full keyboard and button paths."],
    ["形成逐模式策略：位移归零、缩放固定、循环停止、视差冻结、进度改用静态反馈。", "Define per-pattern treatment: zero travel, fixed scale, stopped loops, frozen parallax, and static progress feedback."],
    [
      ["分别审核 reduced motion 与硬件加速，两者关注点独立。", "Review reduced motion and hardware acceleration separately because they address different concerns."],
      ["在操作系统偏好和产品设置的所有组合下测试。", "Test every combination of operating-system preference and product setting."]
    ]
  )
];

export const motionGuidanceByCanonicalId: Readonly<Record<string, MotionGuidance>> =
  Object.freeze(Object.fromEntries(motionGuidance.map((entry) => [entry.canonicalId, entry])));

export function getMotionGuidance(canonicalId: string) {
  return motionGuidanceByCanonicalId[canonicalId];
}
