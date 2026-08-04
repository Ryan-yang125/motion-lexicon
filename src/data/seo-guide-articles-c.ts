import type {
  SeoGuideArticleDiagramNode,
  SeoGuideArticleText,
  SeoGuideLongArticle
} from "./seo-guide-articles-b";
import type { SeoGuideId } from "./seo-guide-ids";

/**
 * Long-form editorial source for scenario guides 03–04.
 * It follows the shared renderer contract from seo-guide-articles-b.ts. Each
 * diagram uses a 960 × 540 canvas; connectors reference node ids directly.
 */
type SeoGuideArticleC = Omit<SeoGuideLongArticle, "guideId"> & {
  guideId: Extract<SeoGuideId, "css-motion-jank" | "spring-or-ease-out">;
};

const text = (zh: string, en: string): SeoGuideArticleText => ({ zh, en });

const node = (
  id: string,
  zh: string,
  en: string,
  zhDetail: string,
  enDetail: string,
  x: number,
  y: number,
  width: number,
  height: number,
  tone: SeoGuideArticleDiagramNode["tone"]
): SeoGuideArticleDiagramNode => ({
  id,
  label: text(zh, en),
  detail: text(zhDetail, enDetail),
  x,
  y,
  width,
  height,
  tone
});

const jankRuntimeExample = `<section class="filter-demo">
  <label>
    Filter projects
    <input type="search" data-filter-input placeholder="Type a project name">
  </label>
  <p role="status" aria-live="polite" data-result-count></p>
  <ul class="result-list" data-result-list></ul>
</section>

<style>
.filter-demo { display: grid; gap: 12px; max-width: 32rem; }
.result-list { display: grid; gap: 8px; padding: 0; list-style: none; }
.result-card { opacity: 1; transform: translateY(0); transition: opacity 160ms ease-out, transform 160ms ease-out; }
.result-card[data-motion="enter"] { opacity: 0; transform: translateY(8px); }
.result-card[data-motion="leave"] { opacity: 0; pointer-events: none; transform: scale(.985); }
@media (prefers-reduced-motion: reduce) {
  .result-card { transition-duration: 1ms; }
}
</style>

<script>
const input = document.querySelector("[data-filter-input]");
const resultList = document.querySelector("[data-result-list]");
const resultCount = document.querySelector("[data-result-count]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const projects = ["Alpha dashboard", "Beta settings", "Gamma archive", "Delta reports"];
let renderFrame = 0;
let leaveTimer = 0;

function matchingProjects(query) {
  const normalizedQuery = query.trim().toLowerCase();
  return projects.filter((project) => project.toLowerCase().includes(normalizedQuery));
}

function updateResultCount(results) {
  resultCount.textContent = results.length + " project" + (results.length === 1 ? "" : "s") + " shown.";
}

function createResultCard(project) {
  const item = document.createElement("li");
  item.className = "result-card";
  item.dataset.motion = "enter";
  item.textContent = project;
  return item;
}

function commitResults(results) {
  resultList.replaceChildren(...results.map(createResultCard));
  renderFrame = window.requestAnimationFrame(() => {
    resultList.querySelectorAll("[data-motion='enter']").forEach((card) => {
      card.removeAttribute("data-motion");
    });
  });
}

function applyLatestQuery(query) {
  window.cancelAnimationFrame(renderFrame);
  window.clearTimeout(leaveTimer);
  const results = matchingProjects(query);
  updateResultCount(results);
  const currentCards = Array.from(resultList.children);

  if (reducedMotion.matches || currentCards.length === 0) {
    commitResults(results);
    return;
  }

  currentCards.forEach((card) => {
    card.dataset.motion = "leave";
  });
  leaveTimer = window.setTimeout(() => commitResults(results), 160);
}

input.addEventListener("input", () => applyLatestQuery(input.value));
applyLatestQuery("");
</script>`;

const springAndEaseRuntimeExample = `<section class="curve-demo">
  <label>
    Drawer position
    <input type="range" min="-240" max="0" value="-240" data-drawer-range>
  </label>
  <button type="button" data-drawer-toggle>Open drawer</button>
  <div class="drawer-stage">
    <aside class="drawer" data-drawer aria-label="Settings drawer">Settings stay attached to the drag position.</aside>
  </div>
  <button type="button" data-save>Save settings</button>
  <p class="save-status" data-save-status data-state="idle" role="status" aria-live="polite">Ready to save.</p>
</section>

<style>
.curve-demo { display: grid; gap: 12px; max-width: 32rem; }
.drawer-stage { overflow: hidden; min-height: 4rem; border: 1px solid currentColor; }
.drawer { width: 14rem; min-height: 4rem; padding: 12px; background: Canvas; }
.save-status { opacity: 0; transform: translateY(6px); transition: opacity 160ms ease-out, transform 160ms ease-out; }
.save-status[data-state="saving"], .save-status[data-state="saved"] { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .save-status { transition-duration: 1ms; }
}
</style>

<script>
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const drawer = document.querySelector("[data-drawer]");
const drawerRange = document.querySelector("[data-drawer-range]");
const drawerToggle = document.querySelector("[data-drawer-toggle]");
const saveButton = document.querySelector("[data-save]");
const saveStatus = document.querySelector("[data-save-status]");
let drawerPosition = -240;
let releaseVelocity = 0;
let lastInputTime = performance.now();
let cancelDrawerSpring = () => {};

function springTo(element, from, target, releaseVelocity = 0) {
  let position = from;
  let velocity = releaseVelocity;
  let previous = performance.now();
  let frame = 0;
  let finished = false;
  const stiffness = 340;
  const damping = 34;
  function onReducedMotionChange(event) {
    if (event.matches) finish();
  }
  const finish = () => {
    if (finished) return;
    finished = true;
    window.cancelAnimationFrame(frame);
    element.style.transform = "translateX(" + target + "px)";
    reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
  };

  if (reducedMotionQuery.matches) {
    finish();
    return () => {};
  }

  reducedMotionQuery.addEventListener("change", onReducedMotionChange);
  const tick = (now) => {
    if (finished) return;
    const dt = Math.min((now - previous) / 1000, 0.032);
    previous = now;
    velocity += (-stiffness * (position - target) - damping * velocity) * dt;
    position += velocity * dt;
    element.style.transform = "translateX(" + position + "px)";
    if (Math.abs(velocity) < 0.1 && Math.abs(position - target) < 0.1) {
      finish();
      return;
    }
    frame = window.requestAnimationFrame(tick);
  };

  frame = window.requestAnimationFrame(tick);
  return () => finish();
}

function setDrawerPosition(position) {
  drawerPosition = Math.max(-240, Math.min(0, position));
  drawer.style.transform = "translateX(" + drawerPosition + "px)";
}

function settleDrawer(target = drawerPosition > -120 ? 0 : -240) {
  cancelDrawerSpring();
  drawerRange.value = String(target);
  drawerToggle.textContent = target === 0 ? "Close drawer" : "Open drawer";
  cancelDrawerSpring = springTo(drawer, drawerPosition, target, releaseVelocity);
  drawerPosition = target;
}

drawerRange.addEventListener("input", () => {
  cancelDrawerSpring();
  const now = performance.now();
  const nextPosition = Number(drawerRange.value);
  releaseVelocity = (nextPosition - drawerPosition) / Math.max((now - lastInputTime) / 1000, 0.016);
  lastInputTime = now;
  setDrawerPosition(nextPosition);
});
drawerRange.addEventListener("change", settleDrawer);
drawerToggle.addEventListener("click", () => {
  const target = drawerPosition === 0 ? -240 : 0;
  releaseVelocity = target === 0 ? 420 : -420;
  settleDrawer(target);
});

async function saveSettings() {
  if (saveButton.disabled) return;
  saveButton.disabled = true;
  saveStatus.dataset.state = "saving";
  saveStatus.textContent = "Saving settings.";
  await new Promise((resolve) => window.setTimeout(resolve, 160));
  saveStatus.dataset.state = "saved";
  saveStatus.textContent = "Settings saved.";
  saveButton.disabled = false;
}

saveButton.addEventListener("click", saveSettings);
setDrawerPosition(drawerPosition);
</script>`;

export const seoGuideArticlesC = [
  {
    guideId: "css-motion-jank",
    standfirst: text(
      "CSS 动效卡顿需要回到用户正在完成的任务：找出哪一次输入、哪一帧和哪一段渲染工作打断了反馈链，再用可复现的证据收窄属性、脚本和视觉层的成本。",
      "CSS motion jank becomes tractable when it returns to the task a person is trying to complete: identify the input, frame, and rendering work that breaks the feedback chain, then use repeatable evidence to narrow the cost of properties, scripting, and visual layers."
    ),
    sections: [
      {
        id: "reproduce-the-moment",
        title: text("从一个真实瞬间建立复现", "Build a reproduction around one real moment"),
        paragraphs: [
          text(
            "“页面有点卡”很难直接变成修复任务。先把它缩成一个用户能重复完成的动作：在 300 条结果里输入筛选词、滚动到第六屏后展开详情、拖动时间线上的手柄，或在网络较慢时点击保存。记录起点、可见结果、设备尺寸、数据量、网络状态和连续操作次数。随后让同一位测试者连续做三到五轮，分别标出输入后迟迟没有响应、运动途中突然停顿、还是结束后内容才跳到新位置。每一种现象都对应不同的调查入口，因此这份记录应成为性能讨论的共同起点。",
            "A report that the page feels slow is difficult to turn into a repair task. Shrink it into one action a person can repeat: type a filter into a list of 300 results, open detail after scrolling to the sixth viewport, drag a timeline handle, or press Save on a slower connection. Record the starting state, visible result, viewport, data volume, network condition, and number of consecutive actions. Ask the same reviewer to repeat the action three to five times, then mark whether input receives a late response, travel pauses in the middle, or content jumps only after motion ends. Each symptom opens a different investigation, so this record becomes the shared starting point for performance work."
          ),
          text(
            "复现还要保护上下文。许多问题只会在字体刚加载、图片尺寸尚未稳定、搜索结果持续变化、后台标签页切回前台或低电量模式出现。把这些条件写进步骤，才能区分偶然抖动和稳定回归。对于高频路径，准备一个固定种子数据集和一个小型录像尤其有价值：录像告诉团队用户在哪一刻失去节奏，数据集让开发者每次都在相同压力下检查。性能工作由此有了可比较的前后状态，修复可通过实际操作验证，桌面机器上的主观感觉只作补充。",
            "A reproduction also needs to preserve context. Many issues appear only while fonts are arriving, image dimensions are still settling, search results keep changing, a background tab returns to the foreground, or a device enters a lower-power condition. Put those conditions in the steps so an occasional hitch can be separated from a stable regression. For high-frequency paths, keep a fixed seeded data set and a small visual capture. The capture shows the instant where rhythm is lost, while the data set gives engineering the same pressure on every check. Performance work then has comparable before-and-after states, and a repair can be verified through the actual interaction instead of a subjective impression on one desktop machine."
          )
        ]
      },
      {
        id: "read-the-frame",
        title: text("用一帧的渲染路径定位成本", "Locate cost through a frame’s rendering path"),
        paragraphs: [
          text(
            "浏览器把一帧画出来时，通常要经过事件处理和脚本、样式计算、布局、绘制与合成。性能录制的第一步是把视觉录像和时间线对齐：卡片停止的那一帧，主线程上是否出现很长的脚本块？样式和布局是否连续重复？是否有大面积绘制、图片解码或第三方脚本占住了时间？先读总览里的掉帧区间和长任务，再钻进对应调用栈，效率高于从火焰图开头逐行猜测。团队需要的结论应当具体到“这次滚动在同一帧读了十次尺寸并写了十次位置”，这样下一步才有明确的改动目标。",
            "When a browser draws a frame, it commonly moves through event handling and scripting, style calculation, layout, paint, and compositing. Start a performance recording by aligning the visual capture with the timeline. On the frame where a card pauses, is there a long script block on the main thread? Are style and layout repeating? Is a broad paint, image decode, or third-party script holding time? Read dropped-frame spans and long tasks in the overview before entering the matching call stack; this is faster than guessing line by line from the start of a flame chart. The useful conclusion is concrete: for example, this scroll reads ten sizes and writes ten positions in one frame. That gives the next change a clear target."
          ),
          text(
            "帧预算需要根据屏幕刷新率和设备余量理解。60Hz 显示器约每 16.7ms 交付一帧，120Hz 的间隔更短；手机的温度、电量、后台活动和 GPU 能力还会压缩可用时间。预算并不要求把每个动作做得完全相同，它要求关键输入始终能得到及时回应。滚动、拖拽、连续输入和媒体拖动属于持续输入，应该优先保护；列表首次进入、装饰性光晕和大面积背景变化可以让出资源。用普通笔记本与常用手机各录一次，再加上较大数据量的场景，能够让“高性能桌面上看起来顺畅”的结论接受现实检验。",
            "Frame budget must be understood through refresh rate and device margin. A 60 Hz display delivers a frame about every 16.7 ms, a 120 Hz display leaves less time, and a phone’s temperature, battery, background activity, and GPU capacity can narrow the room further. A budget does not require every action to look identical. It protects prompt response for important input. Scrolling, dragging, continuous typing, and media scrubbing involve ongoing input and deserve priority. Initial list entrance, decorative glows, and broad background changes can yield resources. Record once on an ordinary laptop, once on a common phone, and once with a larger data set; that lets a smooth-on-desktop conclusion meet real operating conditions."
          )
        ]
      },
      {
        id: "choose-properties",
        title: text("让属性选择服务于视觉职责", "Let property choice serve the visual job"),
        paragraphs: [
          text(
            "属性选择决定每一帧需要重新计算到哪里。按钮按下、提示进入、卡片轻微移动和淡入淡出通常只是在表达反馈、方向或层级，`transform` 与 `opacity` 能很好地承担这些任务，并且常常便于浏览器在合成阶段处理。内容展开、真实文本换行、网格列数变化和图片比例变化则表达了真实布局，尺寸与布局的更新具有业务意义。两类任务都值得实现，只需要明确边界：把轻反馈放到合成友好的属性上，把真实结构变化限制在尽可能小的容器里，并避免把每一帧都变成一次全页重算。",
            "Property choice determines how far the browser must recalculate on each frame. A button press, an entering notice, a small card move, and a fade usually express feedback, direction, or hierarchy. `transform` and `opacity` serve those jobs well and often allow the browser to handle them in compositing. Expanding content, real text wrapping, changing grid columns, and changing image ratio express actual layout, so size and layout updates carry product meaning. Both categories deserve implementation. The useful boundary is clear: put light feedback on compositor-friendly properties, constrain real structural change to the smallest practical container, and avoid turning every frame into a whole-page recalculation."
          ),
          text(
            "布局抖动常来自读写交错。代码先读取元素的 `offsetHeight`，立刻写入 `style.height`，又读取另一个元素的位置，会迫使浏览器提前结算尚未完成的工作。把读取集中在一个阶段，把写入集中到下一帧，或把计算后的值交给 CSS 自定义属性，都能降低这种往返。`will-change` 也应只在即将发生的少量动效上短暂使用；给长列表的每个卡片长期提升图层会增加内存、合成和滚动压力。性能优化的质量取决于取舍是否贴合任务，样式表也应保持简洁、明确的规则。",
            "Layout thrash often comes from alternating reads and writes. Code reads an element’s `offsetHeight`, writes `style.height` immediately, then reads another element’s position; that can force the browser to settle unfinished work early. Gather reads in one phase, gather writes in the next frame, or hand a calculated value to a CSS custom property to reduce the back-and-forth. `will-change` also belongs on the small number of motions about to occur and for a short time. Permanently promoting every card in a long list adds memory, compositing, and scrolling pressure. The quality of a performance repair comes from tradeoffs that fit the task, not from filling a style sheet with a fixed recipe."
          )
        ]
      },
      {
        id: "protect-continuous-input",
        title: text("连续输入优先保持因果关系", "Keep continuous input causally connected"),
        paragraphs: [
          text(
            "用户连续输入筛选词时，每个键盘事件都可能触发状态更新、搜索、列表重排和进入离开动效。如果每次更新都等待上一段 400ms 动画结束，界面会形成视觉队列，输入与结果逐渐脱节。更合适的策略是保留当前最新意图：新查询到来时取消旧的装饰性过渡，立即更新结果数量与活跃条件，再让少量新增项以短促方式出现。对于滚动和拖拽，位置跟随用户手势本身是核心反馈，惯性、阴影、模糊和尾迹属于次级效果，可以按设备能力与偏好收敛。这样用户始终看得出自己的输入正在控制什么。",
            "When someone types a filter continuously, every key event may trigger state change, search, list reorder, and entrance or exit motion. If each update waits for a previous 400 ms animation to finish, the interface builds a visual queue and input gradually loses its connection to results. A better strategy keeps the latest intent. When a new query arrives, cancel the old decorative transition, update the result count and active criteria immediately, then let only a small number of new items appear briefly. During scrolling and dragging, position following the hand is core feedback. Inertia, shadows, blur, and trails are secondary effects that can narrow with device capability and preference. People can then see what their input is controlling at every moment."
          ),
          text(
            "把昂贵工作移出高频回调同样重要。滚动监听中可以收集可见范围和方向，再用 `requestAnimationFrame` 在下一帧写入视觉状态；搜索可以防抖真正昂贵的远程或本地计算，同时让输入框和结果计数立即回应；拖拽可以把数据提交放在松手后，把显示位置保持在轻量状态里。这里的目标是形成一条稳定的优先级：手势和文字输入先得到确认，关键内容随后更新，装饰性细节在还有余量时才加入。性能和体验在这一点上是同一件事，因为两者都在保护用户的控制感。",
            "Moving expensive work out of high-frequency callbacks matters as well. A scroll listener can collect visible range and direction, then write visual state on the next frame with `requestAnimationFrame`. Search can debounce truly expensive local or remote computation while the input and result count respond immediately. Dragging can commit data after release while keeping display position in a lightweight state. The goal is a stable priority order: gesture and typed input receive acknowledgement first, important content updates next, and decorative detail joins only when margin remains. Performance and experience are the same concern here because both protect the person’s sense of control."
          )
        ]
      },
      {
        id: "ship-a-baseline",
        title: text("用基线和验收守住下一次改动", "Use baselines and acceptance to protect the next change"),
        paragraphs: [
          text(
            "一次修复只有在下一次功能迭代后仍然成立，才真正提升了产品。为高频组件保留一份轻量基线：固定数据集、复现步骤、设备和屏幕尺寸、十到二十秒的录像，以及一次性能录制中值得关注的区间。基线可以覆盖移动端筛选、桌面拖拽、打开大型详情和网络较慢的保存。它无需成为昂贵的实验室体系，却能让代码评审和回归测试有共同参照。新增动画、图片资源或第三方组件时，团队可以快速问出它影响的是哪条基线、是否占用了连续输入的余量。",
            "A repair improves the product only when it still holds after the next feature iteration. Keep a lightweight baseline for high-frequency components: a fixed data set, reproduction steps, device and viewport, a ten-to-twenty-second capture, and the noteworthy span in one performance recording. A baseline can cover mobile filtering, desktop dragging, opening a large detail view, and saving on a slower connection. It does not need to become an expensive lab system. It gives code review and regression work a shared reference. When a new animation, image asset, or third-party component arrives, the team can quickly ask which baseline it affects and whether it consumes margin reserved for continuous input."
          ),
          text(
            "验收语言也应描述用户能完成什么。与其只写“保持 60fps”，可以写成：输入筛选词后结果数量立即改变；在指定数量的卡片中滚动时，主操作始终可点击；抽屉打开期间焦点与内容稳定；开启减弱动效后，状态仍完整可读。再为这些目标补充技术证据，例如长任务阈值、录制中的连续掉帧区间、布局读写次数或可接受的视觉层数。产品目标和技术指标并列，能避免为了数字牺牲反馈，也能避免为了效果忽略成本。每次发布前做一次短复查，性能便会从偶发救火变成组件契约的一部分。",
            "Acceptance language should also describe what a person can accomplish. Instead of writing only keep 60 fps, write that the result count changes immediately after typing a filter, the primary action remains usable while scrolling a specified number of cards, focus and content remain stable during drawer opening, and state stays fully legible with reduced motion enabled. Then add technical evidence for those goals: a long-task threshold, a dropped-frame span in recording, number of layout reads and writes, or an acceptable number of visual layers. Product goals beside technical signals prevent a metric from sacrificing feedback and prevent a visual effect from ignoring cost. A short review before each release makes performance part of the component contract."
          )
        ]
      }
    ],
    checklistTitle: text("CSS 动效性能发布清单", "CSS motion performance shipping checklist"),
    checklist: [
      {
        id: "reproduction",
        label: text("固定条件下可以稳定复现", "The issue reproduces under fixed conditions"),
        detail: text("记录设备、视口、数据量、网络、起点和连续操作次数。", "Record device, viewport, data volume, network, starting state, and repeated actions.")
      },
      {
        id: "evidence",
        label: text("录像与性能时间线对齐", "Visual capture aligns with the performance timeline"),
        detail: text("将可见停顿对应到长脚本、布局、绘制或资源解码的证据。", "Match the visible pause to evidence from scripting, layout, paint, or resource decoding.")
      },
      {
        id: "properties",
        label: text("轻反馈使用合适的渲染路径", "Light feedback uses an appropriate rendering path"),
        detail: text("将位移和淡化放在 transform 与 opacity，把真实结构变化限制在局部容器。", "Use transform and opacity for travel and fades, then constrain real structural change to a local container.")
      },
      {
        id: "input",
        label: text("最新输入始终拥有优先级", "The latest input always has priority"),
        detail: text("连续搜索、滚动和拖拽会取消过期装饰性过渡，并及时更新关键状态。", "Continuous search, scrolling, and dragging cancel stale decorative transitions and update essential state promptly.")
      },
      {
        id: "baseline",
        label: text("常用设备和减弱动效路径已回归", "Common devices and the reduced-motion path have regressed"),
        detail: text("用固定数据集检查普通笔记本、手机、大列表和系统偏好切换。", "Use a fixed data set to check an ordinary laptop, phone, large list, and system-preference change.")
      }
    ],
    caseStudy: {
      title: text("案例：筛选卡片在连续输入中保持轻量", "Case: filter cards stay lightweight during continuous input"),
      context: text("结果列表会在用户持续输入时更新。卡片只承担短促的进入与离开反馈，真实排序由数据更新完成，旧过渡可以被最新查询中断。", "A result list updates while someone keeps typing. Cards carry only short entrance and exit feedback, real order comes from data updates, and an old transition can yield to the latest query."),
      code: jankRuntimeExample,
      explanation: text("代码先取消过期的装饰性过渡，再同步更新数量和结果。进入与离开只改动透明度和 transform，列表的真实顺序仍由数据和布局决定；减弱动效路径沿用同一状态，只将过渡收敛到极短时间。", "The code first cancels stale decorative transitions, then updates count and results together. Entrance and exit change only opacity and transform while data and layout retain ownership of real order. The reduced-motion path uses the same state and compresses the transition to a very short interval.")
    },
    diagrams: [
      {
        id: "frame-work-path",
        title: text("图解一：一帧中的工作路径", "Diagram 1: work across one frame"),
        alt: text("输入、脚本、样式与布局、绘制和合成依次连接，布局与绘制以警示色提示需要缩小范围。", "Input, script, style and layout, paint, and compositing connect in sequence; layout and paint use warning color to show work that needs a narrower scope."),
        viewBox: "0 0 960 540",
        nodes: [
          node("input", "输入", "Input", "手势与键盘事件", "Gesture and keyboard event", 35, 205, 145, 110, "surface"),
          node("script", "脚本", "Script", "状态与计算", "State and computation", 215, 205, 145, 110, "accent"),
          node("layout", "样式与布局", "Style and layout", "控制读写往返", "Control read/write thrash", 395, 205, 145, 110, "warning"),
          node("paint", "绘制", "Paint", "限制大面积效果", "Limit broad effects", 575, 205, 145, 110, "warning"),
          node("composite", "合成", "Composite", "轻反馈优先落点", "Preferred home for light feedback", 755, 205, 145, 110, "success")
        ],
        connectors: [
          { from: "input", to: "script" },
          { from: "script", to: "layout" },
          { from: "layout", to: "paint" },
          { from: "paint", to: "composite" }
        ]
      },
      {
        id: "property-decision",
        title: text("图解二：按视觉职责选择属性", "Diagram 2: choose properties by visual job"),
        alt: text("轻反馈和真实结构变化从视觉职责出发，分别连接到合成友好属性和局部布局更新。", "Light feedback and real structural change begin with visual jobs, then connect to compositor-friendly properties and localized layout updates."),
        viewBox: "0 0 960 540",
        nodes: [
          node("feedback", "轻反馈", "Light feedback", "按下、提示、微移", "Press, notice, small travel", 80, 115, 255, 105, "success"),
          node("compositor", "合成属性", "Compositor properties", "transform · opacity", "transform · opacity", 80, 325, 255, 105, "accent"),
          node("structure", "真实结构", "Real structure", "展开、文本、网格", "Disclosure, text, grid", 625, 115, 255, 105, "surface"),
          node("localized", "局部布局", "Localized layout", "限制影响范围", "Constrain affected scope", 625, 325, 255, 105, "warning")
        ],
        connectors: [
          { from: "feedback", to: "compositor", label: text("短促反馈", "Short feedback") },
          { from: "structure", to: "localized", label: text("真实变化", "Real change") }
        ]
      },
      {
        id: "jank-review-loop",
        title: text("图解三：卡顿排查与回归闭环", "Diagram 3: jank diagnosis and regression loop"),
        alt: text("复现、录制、定位、修改、回归形成循环；回归发现问题时回到复现步骤。", "Reproduce, record, locate, change, and regress form a loop; a regression issue returns to reproduction."),
        viewBox: "0 0 960 540",
        nodes: [
          node("reproduce", "复现", "Reproduce", "固定真实操作", "Fix a real interaction", 385, 45, 190, 90, "ink"),
          node("record", "录制", "Record", "对齐录像与时间线", "Align capture and timeline", 650, 205, 190, 90, "accent"),
          node("locate", "定位", "Locate", "识别工作与属性", "Identify work and properties", 520, 385, 190, 90, "warning"),
          node("change", "修改", "Change", "缩小成本或时长", "Narrow cost or duration", 250, 385, 190, 90, "success"),
          node("regress", "回归", "Regress", "检查基线设备", "Check baseline devices", 120, 205, 190, 90, "surface")
        ],
        connectors: [
          { from: "reproduce", to: "record" },
          { from: "record", to: "locate" },
          { from: "locate", to: "change" },
          { from: "change", to: "regress" },
          { from: "regress", to: "reproduce", label: text("继续验证", "Verify again") }
        ]
      }
    ]
  },
  {
    guideId: "spring-or-ease-out",
    standfirst: text(
      "Spring 与 ease-out 的选择从动作语义开始：直接操控、可中断的对象需要连续速度与受力感；明确的确认、进入和结果交接需要可预测的抵达。用同一状态比较两种节奏，界面会更容易读懂。",
      "The choice between spring and ease-out begins with the action’s meaning. Directly manipulated, interruptible objects benefit from continuous velocity and a sense of force. Clear confirmation, entrance, and result handoff benefit from a predictable arrival. Compare both rhythms on the same state and the interface becomes easier to read."
    ),
    sections: [
      {
        id: "start-with-meaning",
        title: text("先判断动作在解释什么", "Decide what the action is explaining"),
        paragraphs: [
          text(
            "曲线名称很容易把讨论带到审美偏好，用户真正感受到的是对象怎样回应自己的输入。先给动作写一句职责：侧栏跟随拖拽后回到停靠位，卡片被选中后表达当前焦点，保存按钮确认请求已收到，菜单在触发按钮附近抵达可读位置。职责不同，速度曲线承担的意义也不同。持续受手势影响、可能被再次抓住、方向可能反转的对象，需要保留当前位置和速度之间的连续关系；一次性确认、短暂进入、需要马上让出注意力的结果，则需要清晰而克制的终点。这个判断比先问“用哪条贝塞尔曲线”更可靠。",
            "Curve names can pull discussion toward visual preference, while people actually feel how an object answers their input. Write one responsibility for the action first: a sidebar returns to its dock after following a drag, a card communicates current focus after selection, a Save button confirms that work was received, or a menu arrives near its trigger in a readable position. Different responsibilities give speed curves different meaning. An object continuously affected by a gesture, likely to be grabbed again, or likely to reverse direction benefits from continuity between current position and velocity. A one-time confirmation, brief entrance, or result that should quickly release attention benefits from a clear restrained endpoint. This judgment is more reliable than asking for a Bézier curve first."
          ),
          text(
            "状态身份是第二个判断点。同一个抽屉从关闭到打开，用户能追踪到同一块内容在移动，因此可以使用带有重量感的收束。保存前后的按钮虽然占据同一位置，语义已经从“可执行”变成“处理中”再变成“完成”，重点是读清文字和结果，过冲会分散注意力。列表排序中的卡片既有身份连续性，也有大量信息需要阅读，适合让真实位置先稳定，再给很小的强调。把对象身份、用户输入和最终阅读目标列在设计说明里，设计、产品和工程就能用同一份理由选择曲线。",
            "State identity is a second decision point. The same drawer moves from closed to open, so people can track one piece of content in space and it can settle with a sense of weight. A button before and after Save occupies the same place, yet its meaning changes from available to working to complete. Reading its copy and outcome is the priority, and overshoot can compete for attention. Cards in a reordered list retain identity while a large amount of information needs reading, so let real position stabilize first and add only a very small emphasis. Put object identity, user input, and final reading goal in the design note. Design, product, and engineering can then choose a curve from the same reasons."
          )
        ]
      },
      {
        id: "use-spring-for-continuity",
        title: text("弹簧为连续输入保留速度", "Use springs to retain velocity across continuous input"),
        paragraphs: [
          text(
            "弹簧适合把对象看作正在被推动的实体。拖拽卡片、拉开抽屉、调整底部面板、拖动媒体进度和移动画布元素时，用户的手势已经提供了方向、距离和速度。松手后，弹簧可以把这些信息带入目标位置，让对象自然收束；下一次触摸或鼠标输入到来时，又可以从当前速度接手。这个连续性让人感觉界面持续响应自己，每次输入都从当前状态自然延续。弹簧需要服务操控感，因此目标位置、速度传递和取消机制应与手势状态放在同一个组件契约里。",
            "A spring works well when an object is understood as something being pushed. Dragging a card, pulling open a drawer, adjusting a bottom panel, scrubbing media, and moving a canvas element already provide direction, distance, and velocity through the person’s gesture. After release, a spring can carry that information toward a target so the object settles naturally. When the next touch or pointer input arrives, it can take over from the current velocity. That continuity makes the interface feel responsive to the person instead of restarting from a prerecorded segment on every interaction. A spring serves control, so target position, velocity transfer, and cancellation belong in the same component contract as gesture state."
          ),
          text(
            "调参可以从三项关系开始理解。刚度决定目标拉回对象的力度，数值提高时抵达更快；阻尼决定速度如何被吸收，数值提高时回弹更快收束；质量影响同一外力下的响应节奏。先固定位移和目标，再一次只改一个维度，观察对象是否仍然显得可控。导航抽屉通常需要较高阻尼和紧凑收束，避免遮挡内容时反复摆动；可拖拽卡片可以允许一小段柔和回弹，用来确认落点。参数的好坏取决于动作的后果、出现频率和屏幕密度，每个组件都应保存自己的合理区间，供团队以动作语义为依据维护。",
            "Parameter tuning can begin with three relationships. Stiffness decides how strongly the target pulls the object back, so a higher value reaches the destination faster. Damping decides how velocity is absorbed, so a higher value settles rebound sooner. Mass shapes response rhythm under the same force. Fix travel and target first, then change one dimension at a time and observe whether the object still feels controllable. A navigation drawer usually needs higher damping and a compact settle so it does not keep moving while covering content. A draggable card can allow one soft small rebound to confirm the drop. Good parameters depend on consequence, frequency, and screen density, so each component should keep a reasonable range instead of copying one global set of numbers."
          )
        ]
      },
      {
        id: "use-ease-out-for-arrival",
        title: text("Ease-out 让明确结果迅速抵达", "Use ease-out for a quick, clear arrival"),
        paragraphs: [
          text(
            "ease-out 的价值在于开始阶段有足够速度，抵达前逐渐放慢，让用户先看到变化已经发生，再有时间读清最终状态。它适合菜单、提示、轻量卡片进入、复制确认、保存结果和按钮按压恢复。这些动作通常有清楚的起点与终点，也很少需要继承上一段手势速度。把持续时间控制在内容与任务需要的范围内，视觉就会显得果断：按钮反馈常在 100 到 180ms 内收住，局部状态交接可以略长，复杂层级的进入再根据阅读量增加。每一段时间都应帮助用户读到结果或找到下一步。",
            "The value of ease-out is useful speed at the beginning followed by a gradual slowdown before arrival. People first see that change has happened, then have time to read the final state. It suits menus, notices, light card entrances, copy confirmation, save outcomes, and a button recovering from press. These actions usually have a clear start and end and rarely need to inherit velocity from a previous gesture. Keep duration within the needs of content and task and the visual response feels decisive. Button feedback often settles within 100 to 180 ms, local state handoff can run a little longer, and a complex layer entrance can grow with reading load. Every part of the time should help someone read a result or find the next step."
          ),
          text(
            "一段 ease-out 动画也需要保护空间关系。菜单从触发按钮附近出现时，起始透明度、很小的位移和稳定的最终边界足以说明来源；成功提示在保存按钮旁边淡入时，文字、状态色和图标共同表达完成。过大的缩放、旋转和多次弹跳会让一个简单结果变得比内容本身更醒目。将曲线应用到 opacity 与 transform 上，可以保持布局稳定，也让减弱动效模式容易缩短或直接交接。ease-out 在这里是一种信息排序工具：先确认动作，再呈现结果，最后让用户回到下一次操作。",
            "An ease-out animation also needs to protect spatial relationship. When a menu appears near its trigger, starting opacity, very small travel, and a stable final boundary are enough to explain origin. When a success notice fades beside Save, copy, state color, and icon express completion together. Large scale, rotation, and repeated bouncing can make a simple result more prominent than the content itself. Applying the curve to opacity and transform keeps layout stable and makes reduced-motion mode easy to shorten or hand off directly. Ease-out acts as an information-ordering tool here: acknowledge the action, present the outcome, then return the person to the next operation."
          )
        ]
      },
      {
        id: "design-for-interruption",
        title: text("中断、反向与连点决定实现方式", "Interruption, reversal, and repeated input determine implementation"),
        paragraphs: [
          text(
            "曲线选择离不开中断策略。用户可能在抽屉打开到一半时再次拖回去，在排序动画尚未结束时移动另一张卡片，或在保存结果出现前再次编辑字段。组件需要知道新输入到来后保留什么：当前视觉位置、当前速度、目标状态、焦点和可访问性文案。直接操控的 spring 应立即取消旧目标并接住当前值；一次性 ease-out 反馈可以被新状态替换，让旧结果淡出或直接结束。无论采用哪条路径，状态源都应优先于计时器，避免过期回调在用户已经改变意图后重新覆盖界面。",
            "Curve choice depends on interruption strategy. A person may pull a drawer back while it is halfway open, move another card while reorder motion is still settling, or edit a field again before a save outcome appears. The component needs to know what remains when new input arrives: current visual position, current velocity, target state, focus, and accessibility copy. A directly manipulated spring should cancel its old target immediately and take over from the current value. A one-time ease-out response can yield to new state so the old outcome fades or finishes directly. In every path, state source should lead timers, preventing a stale callback from repainting an interface after intent has changed."
          ),
          text(
            "浏览器与动画库的 API 也会影响交接质量。CSS transition 很适合简洁、可预期的 ease-out 状态变化；Web Animations API 能提供取消、完成和播放状态，适合需要由状态机统一管理的短动作；物理 spring 则常需要每帧积分或库提供的速度模型。选择实现时，先检查组件是否要接收拖拽速度、是否需要在任何时刻反向、是否有多个对象共享同一状态。把取消函数、目标值和完成条件显式保留，测试才能覆盖快速连点、方向反转和路由切换。实现清楚后，曲线才会在真实使用中保持它原本的语义。",
            "Browser and animation-library APIs also shape handoff quality. CSS transition suits concise, predictable ease-out state changes. The Web Animations API provides cancellation, completion, and play state for short actions managed by a state machine. A physical spring commonly needs per-frame integration or a library velocity model. When choosing implementation, check whether the component receives drag velocity, reverses at any moment, or has multiple objects sharing one state. Keep cancellation functions, target values, and completion conditions explicit so tests can cover fast repeat presses, direction reversal, and route change. With implementation made clear, the curve retains its intended meaning in real use."
          )
        ]
      },
      {
        id: "compare-and-review",
        title: text("在同一状态上比较并完成验收", "Compare on the same state and complete review"),
        paragraphs: [
          text(
            "比较 spring 与 ease-out 时，应先锁定位移、对象尺寸、触发位置和最终状态，只改变速度模型。这样团队能观察到真正的差异：弹簧是否让连续操控更自然，ease-out 是否让结果更容易阅读。若同时改了距离、颜色、阴影和时长，讨论很快会失去因果关系。建议在组件文档中保留一个可切换的对照演示，并展示完整产品瞬间，例如拖开抽屉后选择导航项、保存后看到确认并继续编辑。原子动效的手感在流程里接受检验，才能判断它是否帮助用户理解当前动作。",
            "When comparing spring and ease-out, lock travel, object size, trigger position, and final state, then change only the velocity model. The team can then observe the real difference: does the spring make continuous control feel more natural, and does ease-out make the outcome easier to read? If distance, color, shadow, and duration change at the same time, discussion quickly loses causal connection. Keep a switchable comparison in component documentation and show a complete product moment, such as pulling open a drawer before selecting navigation or saving before seeing confirmation and continuing to edit. The feel of an atomic motion earns its place when the full flow tests whether it helps someone understand the current action."
          ),
          text(
            "验收还要覆盖减弱动效和可访问性。系统偏好开启后，侧栏仍然到达正确位置，焦点仍然进入可操作区域，保存状态仍然从“保存中”变成“已保存”；只需减少大幅位移、反复回弹和装饰性旋转。检查键盘触发、触摸拖拽、屏幕较窄时的遮挡、连续输入和页面离开时的取消。最后记录每个组件的选择理由：动作服务什么意义、允许几次回弹、最大时长、如何中断、低动态路径保留什么。这样的记录会让后续设计保持一致，也让用户在不同页面遇到可预测的动效语言。",
            "Review also covers reduced motion and accessibility. With the system preference enabled, a sidebar still reaches the correct position, focus still enters an operable region, and save state still moves from Saving to Saved. Reduce broad travel, repeated rebound, and decorative rotation. Check keyboard triggering, touch drag, overlap on narrow screens, continuous input, and cancellation during page exit. Finally record why each component chose its curve: what meaning the action serves, how much rebound it allows, its maximum duration, how it interrupts, and what the low-motion path retains. This record keeps future design consistent and gives people a predictable motion language across pages."
          )
        ]
      }
    ],
    checklistTitle: text("Spring 与 ease-out 选择清单", "Spring and ease-out selection checklist"),
    checklist: [
      {
        id: "meaning",
        label: text("先写清动作要解释的意义", "Write the meaning the action must explain"),
        detail: text("明确对象身份、用户输入、最终阅读目标和下一步操作。", "State object identity, user input, final reading goal, and the next action.")
      },
      {
        id: "continuity",
        label: text("直接操控保留位置与速度连续性", "Direct manipulation retains position and velocity continuity"),
        detail: text("拖拽、抽屉和画布对象拥有目标、取消和接管新输入的策略。", "Drags, drawers, and canvas objects have a strategy for target, cancellation, and new input takeover.")
      },
      {
        id: "arrival",
        label: text("明确结果使用紧凑抵达", "Clear outcomes use a compact arrival"),
        detail: text("菜单、保存和复制确认以短时 ease-out 支持阅读与继续操作。", "Menus, save, and copy confirmation use short ease-out to support reading and continued work.")
      },
      {
        id: "comparison",
        label: text("比较时只改变速度模型", "Change only the velocity model during comparison"),
        detail: text("锁定位移、尺寸、最终状态和触发位置，让差异可被直接观察。", "Lock travel, size, final state, and trigger position so the difference can be observed directly.")
      },
      {
        id: "review",
        label: text("中断与低动态路径已经验收", "Interruption and the low-motion path have been reviewed"),
        detail: text("覆盖快速连点、反向、键盘、触摸、路由离开与系统偏好切换。", "Cover repeat presses, reversal, keyboard, touch, route exit, and system-preference changes.")
      }
    ],
    caseStudy: {
      title: text("案例：抽屉用 spring 接住拖拽，保存提示用 ease-out 交接", "Case: a drawer uses spring after drag while save feedback uses ease-out"),
      context: text("抽屉在拖拽松手后要延续当前速度并收束到开合位置；保存提示只需要在原操作附近迅速清楚地抵达完成状态。", "After drag release, a drawer needs to retain current velocity and settle to open or closed; save feedback only needs a fast, clear completed state near the original action."),
      code: springAndEaseRuntimeExample,
      explanation: text("`springTo` 接收松手瞬间的 releaseVelocity，并把它作为积分器初始速度，因此新的拖拽、反向操作或路由离开都能立即接管旧动画。系统减弱动效偏好通过 change 事件立即落在目标位置，并在完成与取消时清理监听；保存提示使用短时 ease-out，文案和状态仍由同一业务状态驱动，方便用户读到完成结果后继续操作。", "`springTo` receives releaseVelocity from the instant of release and uses it as the integrator’s initial velocity, so a new drag, reversal, or route exit can take over immediately. A reduced-motion preference change lands at the target through its change event, with listeners cleaned up on completion and cancellation; save feedback uses a short ease-out while copy and state remain driven by the same business state, letting people read completion and continue their work.")
    },
    diagrams: [
      {
        id: "semantic-choice",
        title: text("图解一：从动作语义选择速度模型", "Diagram 1: choose a velocity model from action meaning"),
        alt: text("直接操控与一次性确认从动作语义分支，分别连接 spring 和 ease-out，并标出连续性与清晰抵达。", "Direct manipulation and one-time confirmation branch from action meaning to spring and ease-out, labeled with continuity and clear arrival."),
        viewBox: "0 0 960 540",
        nodes: [
          node("meaning", "动作语义", "Action meaning", "对象、输入、结果", "Object, input, outcome", 375, 55, 210, 95, "ink"),
          node("direct", "直接操控", "Direct manipulation", "拖拽、拉开、移动", "Drag, pull, move", 95, 250, 210, 105, "accent"),
          node("spring", "Spring", "Spring", "保留速度与可中断性", "Retain velocity and interruption", 95, 405, 210, 90, "success"),
          node("confirm", "一次性确认", "One-time confirmation", "保存、复制、菜单", "Save, copy, menu", 655, 250, 210, 105, "surface"),
          node("ease", "Ease-out", "Ease-out", "迅速清晰地抵达", "Arrive quickly and clearly", 655, 405, 210, 90, "warning")
        ],
        connectors: [
          { from: "meaning", to: "direct", label: text("持续输入", "Continuous input") },
          { from: "direct", to: "spring" },
          { from: "meaning", to: "confirm", label: text("明确结果", "Clear outcome") },
          { from: "confirm", to: "ease" }
        ]
      },
      {
        id: "spring-parameters",
        title: text("图解二：弹簧参数如何影响收束", "Diagram 2: how spring parameters shape settling"),
        alt: text("刚度、阻尼和质量连接到抵达速度、回弹收束和响应节奏，最终汇入可控的落点。", "Stiffness, damping, and mass connect to arrival speed, rebound settling, and response rhythm, then converge on a controllable landing."),
        viewBox: "0 0 960 540",
        nodes: [
          node("stiffness", "刚度", "Stiffness", "影响抵达速度", "Shapes arrival speed", 55, 115, 205, 95, "accent"),
          node("damping", "阻尼", "Damping", "影响回弹收束", "Shapes rebound settling", 375, 115, 205, 95, "warning"),
          node("mass", "质量", "Mass", "影响响应节奏", "Shapes response rhythm", 695, 115, 205, 95, "surface"),
          node("landing", "可控落点", "Controllable landing", "组件自己的合理范围", "A component-specific reasonable range", 375, 345, 210, 105, "success")
        ],
        connectors: [
          { from: "stiffness", to: "landing" },
          { from: "damping", to: "landing" },
          { from: "mass", to: "landing" }
        ]
      },
      {
        id: "interruption-contract",
        title: text("图解三：中断时保持同一状态契约", "Diagram 3: retain one state contract through interruption"),
        alt: text("手势输入、当前视觉值、目标状态和完成结果形成闭环；新输入会回到手势输入并取消旧目标。", "Gesture input, current visual value, target state, and completed outcome form a loop; new input returns to gesture input and cancels the old target."),
        viewBox: "0 0 960 540",
        nodes: [
          node("gesture", "手势输入", "Gesture input", "方向与速度", "Direction and velocity", 385, 45, 190, 90, "accent"),
          node("current", "当前视觉值", "Current visual value", "位置与焦点", "Position and focus", 650, 205, 190, 90, "surface"),
          node("target", "目标状态", "Target state", "打开、关闭、已保存", "Open, closed, saved", 520, 385, 190, 90, "ink"),
          node("complete", "完成结果", "Completed outcome", "可读与可继续操作", "Readable and actionable", 250, 385, 190, 90, "success"),
          node("cancel", "取消旧目标", "Cancel old target", "新意图即时接管", "New intent takes over", 120, 205, 190, 90, "warning")
        ],
        connectors: [
          { from: "gesture", to: "current" },
          { from: "current", to: "target" },
          { from: "target", to: "complete" },
          { from: "complete", to: "cancel", label: text("新输入", "New input") },
          { from: "cancel", to: "gesture" }
        ]
      }
    ]
  }
] as const satisfies readonly SeoGuideArticleC[];

export function getSeoGuideArticleC(id?: string | null): SeoGuideArticleC | undefined {
  return seoGuideArticlesC.find((article) => article.guideId === id);
}
