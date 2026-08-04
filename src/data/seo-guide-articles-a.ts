import type { SeoGuideId } from "./seo-guide-ids";

/**
 * Long-form editorial source for scenario guides 01–04.
 * The shape deliberately matches seo-guide-articles-b.ts so one renderer can
 * render every guide. Diagram coordinates use a 960 × 540 canvas.
 */
export type SeoGuideArticleText = {
  zh: string;
  en: string;
};

export type SeoGuideArticleSection = {
  id: string;
  title: SeoGuideArticleText;
  paragraphs: readonly [SeoGuideArticleText, SeoGuideArticleText, ...SeoGuideArticleText[]];
};

export type SeoGuideArticleChecklistItem = {
  id: string;
  label: SeoGuideArticleText;
  detail: SeoGuideArticleText;
};

export type SeoGuideArticleCase = {
  title: SeoGuideArticleText;
  context: SeoGuideArticleText;
  code: string;
  explanation: SeoGuideArticleText;
};

export type SeoGuideArticleDiagramNode = {
  id: string;
  label: SeoGuideArticleText;
  detail: SeoGuideArticleText;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: "ink" | "accent" | "success" | "warning" | "surface";
};

export type SeoGuideArticleDiagramConnector = {
  from: string;
  to: string;
  label?: SeoGuideArticleText;
};

export type SeoGuideArticleDiagram = {
  id: string;
  title: SeoGuideArticleText;
  alt: SeoGuideArticleText;
  viewBox: "0 0 960 540";
  nodes: readonly SeoGuideArticleDiagramNode[];
  connectors: readonly SeoGuideArticleDiagramConnector[];
};

export type SeoGuideLongArticle = {
  guideId: Extract<
    SeoGuideId,
    | "save-submit-publish-feedback"
    | "card-list-filter-continuity"
    | "css-motion-jank"
    | "spring-or-ease-out"
  >;
  standfirst: SeoGuideArticleText;
  sections: readonly [
    SeoGuideArticleSection,
    SeoGuideArticleSection,
    SeoGuideArticleSection,
    SeoGuideArticleSection,
    SeoGuideArticleSection
  ];
  checklistTitle: SeoGuideArticleText;
  checklist: readonly [
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem,
    SeoGuideArticleChecklistItem
  ];
  caseStudy: SeoGuideArticleCase;
  diagrams: readonly [SeoGuideArticleDiagram, SeoGuideArticleDiagram, SeoGuideArticleDiagram];
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

export const seoGuideArticlesA = [
  {
    guideId: "save-submit-publish-feedback",
    standfirst: text(
      "保存、提交和发布表面上都像一个按钮，实际承载着用户对结果、风险和等待的判断。完整反馈会让人清楚地知道：输入已经收到，系统正在处理，结果落在何处，出错时还能怎样继续。",
      "Save, submit, and publish can look like one button, yet each carries a judgment about result, risk, and waiting. Complete feedback makes four things clear: input was received, the system is working, the result lands somewhere visible, and there is a path forward when work fails."
    ),
    sections: [
      {
        id: "waiting",
        title: text("先分清三种等待", "Classify the three kinds of waiting"),
        paragraphs: [
          text(
            "一次保存可能在 150ms 内完成，用户只需要知道按下已经被接收；一次提交可能需要校验和网络往返；发布、上传和支付则常常跨过数秒。三种等待的界面语言不同。瞬时操作适合短促的按下反馈和状态替换；短等待需要把按钮从“可点”转成“进行中”；长等待要给出进度、可离开页面的说明，或至少告诉用户结果会在何处出现。把所有操作都处理成旋转图标，会把这些差异抹平。",
            "A save can finish in 150 ms, where acknowledgement is enough. A submit can include validation and a network round trip. Publish, upload, and payment often last several seconds. Each duration needs its own interface language. Instant work benefits from a brief press response and state swap; short waits need a button that clearly enters progress; long waits need progress, permission to leave, or a clear place where the result will appear. One generic spinner flattens important differences."
          ),
          text(
            "动效时长应当跟着系统事实走。按钮的按压反馈可以在 80–140ms 内结束，让输入与画面贴在一起；真正开始请求后，再把文案切成“保存中”或“正在发布”。如果请求已经结束，成功状态不必额外停留太久，通常 600–1200ms 足够让人确认，然后让界面回到可继续工作的状态。等待的核心是节奏：用户需要一条连续、可追踪的因果链。",
            "Motion duration should follow system facts. A button press can settle in 80–140 ms so input and response feel connected; when the request begins, switch the label to Saving or Publishing. Once work finishes, success usually needs only 600–1200 ms for confirmation before the interface returns to useful work. Waiting is a matter of rhythm: people need one continuous causal chain rather than a series of unrelated effects."
          )
        ]
      },
      {
        id: "proximity",
        title: text("让状态留在动作发生处", "Resolve the state where the action happened"),
        paragraphs: [
          text(
            "用户点击“保存”后，最自然的视线仍停在编辑器底部、表单末尾或工具栏里。成功提示优先在这一带出现：按钮文案变为“已保存”、旁边出现简短的状态、字段边界回到稳定颜色。全局 Toast 适合补充信息，例如“所有更改已同步”，却不应承担唯一的确认职责。提示离得越远，用户越要在页面上重新寻找刚刚发生的事。",
            "After someone clicks Save, attention remains near the editor footer, the end of a form, or the toolbar. Resolve success there first: change the button to Saved, add a short adjacent status, and return the field boundary to a settled color. A global toast can add context, such as All changes synced, yet should not be the only confirmation. The farther feedback sits from the action, the more people must search for what just happened."
          ),
          text(
            "原位置反馈也让失败更容易理解。网络错误可以让按钮恢复可点，同时保留“重试”入口；字段校验可以把焦点带回具体输入，用户可直接在原处修正；发布失败则应保留草稿和失败原因。这里的连续性比华丽更重要：同一个对象从可用、进行中到结果的变化，能让用户看见系统在处理自己的请求。crossfade、轻微透明度变化和稳定的布局足以承载这一层意义。",
            "In-place feedback also makes failure easier to understand. A network error can restore the button while keeping Retry nearby; field validation can return focus to the exact input instead of sending someone to the top of the page; a failed publish should retain the draft and expose the reason. Continuity matters more than spectacle: one object moving from available to working to resolved lets people see the system handling their request. A crossfade, slight opacity change, and stable layout are enough to carry that meaning."
          )
        ]
      },
      {
        id: "failure",
        title: text("把失败和重复操作纳入流程", "Include failure and duplicate actions in the flow"),
        paragraphs: [
          text(
            "反馈流程从来不只有成功路径。用户可能连续点击、请求超时、权限在提交时变化，或者离线后恢复网络。每一种情况都需要一个可预期的界面落点。进行中的主按钮应禁用重复提交，旁边保留取消或返回的路径；超时不要无声地把按钮变回原样，应该说明请求是否仍在处理；权限变化要提示新状态，并避免用户误以为内容已经成功发布。把这些边缘状态列在设计稿里，开发时就更容易写出一致的状态机。",
            "A feedback flow never has only a success path. People may click repeatedly, hit a timeout, lose permission during submission, or recover from offline work. Each case needs a predictable landing place in the UI. Disable duplicate submission on the primary action while keeping a path to cancel or return; do not silently restore a button after a timeout—explain whether work may still be running; surface a permission change so people do not assume content was published. Listing these edge states in the design makes a consistent state machine much easier to build."
          ),
          text(
            "可撤销操作值得单独安排。删除、归档和取消邀请常常会先从列表中离开，再在原位置附近给出“撤销”。这个动作可以有一小段离开动效，却要保留稳定的占位或计数变化，避免列表突然塌陷让用户以为点错了别处。撤销窗口结束后再完成最终移除。这样既能给人回头的机会，也能让列表的空间关系保持清楚。",
            "Reversible actions deserve their own treatment. Delete, archive, and cancel invite can leave a list first, then expose Undo near the original location. The exit can have a short motion, while a stable placeholder or count change prevents the list from collapsing so abruptly that people doubt what they clicked. Final removal happens after the undo window. This gives people a way back while keeping the list’s spatial relationship clear."
          )
        ]
      },
      {
        id: "next-step",
        title: text("发布后的页面也要接住用户", "Let the page receive the user after publish"),
        paragraphs: [
          text(
            "发布结束后，界面常常只显示“成功”，然后把用户留在一个已经失去下一步的页面。更完整的设计会明确接下来能做什么：打开已发布页面、复制链接、继续编辑、查看审核状态，或回到内容列表。动效可以帮助把注意力从发布按钮带到下一步入口，例如让结果卡片在原区域出现，让复制链接按钮随后可见。动作顺序要短，目标要近，用户才能顺着流程走下去。",
            "After publishing, interfaces often stop at Success and leave people on a page with no obvious next move. A complete design shows what follows: open the published page, copy the link, continue editing, check review status, or return to the content list. Motion can shift attention from the Publish button to that next action: reveal a result card in the same region, then make Copy link available. Keep the sequence short and the destination close so people can continue without reorienting."
          ),
          text(
            "真实产品瞬间比单一原子动效更有价值，原因就在这里。一个“发布成功”瞬间往往包含按下反馈、按钮状态、进度、结果卡片和下一步入口；它们共享同一套节奏和层级。先用 Pack 看完整状态流，再回到 press feedback、crossfade 和 duration 调整局部细节，会比从零拼几个漂亮动画更可靠。动效在这里服务的是信任感：用户能看懂，也能继续行动。",
            "This is why a real product moment is more useful than a lone atomic animation. A publish success moment often includes press feedback, button state, progress, a result card, and a next action; they share one rhythm and hierarchy. Start with a Pack to see the full state flow, then return to press feedback, crossfade, and duration to tune local details. That is more reliable than assembling a few attractive animations from scratch. Motion serves trust here: people can understand it and continue."
          )
        ]
      },
      {
        id: "contract",
        title: text("把反馈写成可验收的状态契约", "Write feedback as a testable state contract"),
        paragraphs: [
          text(
            "每个流程都值得拥有一张状态表：idle、working、complete、failed、undoable 分别显示什么文字、哪些控件可用、焦点在哪里、是否允许离开页面。动效附着在状态转换上，而不替代状态本身。这样做能让产品、设计和开发讨论同一件事，也让测试能够检查成功、失败、重试和撤销是否真实成立。数据状态是事实，动画只是让事实更容易被看见。",
            "Every flow benefits from a state table: what idle, working, complete, failed, and undoable show; which controls are available; where focus sits; and whether leaving the page is allowed. Motion attaches to state transitions rather than replacing state itself. This keeps product, design, and engineering discussing the same thing and lets tests check whether success, failure, retry, and undo truly work. Data state is the fact; animation simply makes the fact easier to see."
          ),
          text(
            "这份契约也需要覆盖减弱动效。默认路径可以让按钮轻微缩放、结果卡片淡入；低动态路径保留同样的“保存中”“已保存”、同样的按钮禁用和同样的下一步入口，只缩短或取消装饰性位移。无论用户使用键盘、触屏，还是开启系统减少动效偏好，核心反馈链都应该完整。把这一点作为发布前检查，动效才会真正成为产品可靠性的一部分。",
            "The contract also needs reduced motion. The default path can give a button slight scale and fade in a result card; the low-motion path keeps the same Saving and Saved copy, disabled button, and next action while shortening or removing decorative travel. Whether people use keyboard, touch, or a system reduced-motion preference, the core feedback chain should remain complete. Treat this as a pre-release check and motion becomes part of product reliability."
          )
        ]
      }
    ],
    checklistTitle: text("保存、提交与发布验收清单", "Save, submit, and publish checklist"),
    checklist: [
      { id: "acknowledge", label: text("点击后立刻有输入已被接收的信号", "Acknowledge input immediately after click"), detail: text("按压、文案或状态色应在约 140ms 内发生变化。", "Press, copy, or state color changes within roughly 140 ms.") },
      { id: "working", label: text("进行中状态阻止重复提交", "Working state prevents duplicate submission"), detail: text("保留必要的取消、返回或说明路径。", "Keep any necessary cancel, return, or explanatory path.") },
      { id: "proximity", label: text("结果和失败靠近原动作", "Results and failures remain close to the action"), detail: text("按钮、局部状态和全局通知各自承担清楚职责。", "Button, local state, and global notice each carry a clear responsibility.") },
      { id: "recovery", label: text("超时、失败和撤销都有明确落点", "Timeout, failure, and undo each have a clear landing place"), detail: text("草稿、错误原因和重试入口可被用户找到。", "Draft, error reason, and retry path remain findable.") },
      { id: "next", label: text("完成后能继续下一步", "Completion leads to a next step"), detail: text("发布后提供打开、复制、继续编辑或返回列表等路径。", "After publish, offer open, copy, continue editing, or return-to-list paths.") }
    ],
    caseStudy: {
      title: text("案例：文章发布在同一块界面内完成交接", "Case: article publishing hands off within one region"),
      context: text("发布按钮先进入进行中状态，成功后替换为结果卡片和打开文章入口。", "The publish button first enters progress, then resolves into a result card with an Open article action."),
      code: `<section class="publish-action" data-state="ready">
  <button class="publish-button" type="button" data-publish aria-describedby="publish-status">Publish article</button>
  <p id="publish-status" role="status" aria-live="polite" data-publish-status>Ready to publish.</p>
  <p>Requests sent: <output data-publish-submissions>0</output></p>
  <div class="publish-result" data-publish-result aria-hidden="true" inert>
    <strong>Article published.</strong>
    <a href="#published-article">Open published article</a>
  </div>
</section>

<style>
.publish-action { display: grid; gap: 12px; max-width: 28rem; }
.publish-button, .publish-result { transition: opacity 180ms ease-out, transform 180ms ease-out; }
.publish-result { opacity: 0; visibility: hidden; transform: translateY(6px); pointer-events: none; }
.publish-action[data-state="working"] .publish-button { opacity: .72; cursor: progress; }
.publish-action[data-state="complete"] .publish-button { opacity: 0; visibility: hidden; transform: scale(.98); pointer-events: none; }
.publish-action[data-state="complete"] .publish-result { opacity: 1; visibility: visible; transform: translateY(0); pointer-events: auto; }
@media (prefers-reduced-motion: reduce) {
  .publish-button, .publish-result { transition-duration: 1ms; }
}
</style>

<script>
const action = document.querySelector(".publish-action");
const publishButton = action.querySelector("[data-publish]");
const status = action.querySelector("[data-publish-status]");
const publishResult = action.querySelector("[data-publish-result]");
const publishedLink = publishResult.querySelector("a");
const requestCount = action.querySelector("[data-publish-submissions]");
let submissions = 0;

function publishRequest() {
  return new Promise((resolve) => window.setTimeout(resolve, 160));
}

async function publishArticle() {
  if (action.dataset.state !== "ready") return;

  action.dataset.state = "working";
  publishButton.disabled = true;
  status.textContent = "Publishing article.";
  submissions += 1;
  requestCount.textContent = String(submissions);

  try {
    await publishRequest();
    action.dataset.state = "complete";
    publishResult.inert = false;
    publishResult.setAttribute("aria-hidden", "false");
    status.textContent = "Article published. You can open it now.";
    publishedLink.focus();
  } catch {
    action.dataset.state = "ready";
    publishButton.disabled = false;
    status.textContent = "Publishing failed. Try again.";
  }
}

publishButton.addEventListener("click", publishArticle);
</script>`,
      explanation: text("状态写在父元素的 data-state 上，按钮和结果卡片共享同一个事实，不需要依赖延时器猜测请求何时结束。结果出现前和旧按钮完成后都用 visibility 退出焦点顺序，完成状态只暴露可继续操作的结果；透明度和轻微位移负责交接，减弱动效偏好下立即完成交接。", "State lives on the parent data-state, so button and result card share one fact instead of using a timer to guess when the request ends. Visibility keeps both the pending result and the completed action out of the focus order, exposing only the next usable result; opacity and short travel handle the handoff, and reduced motion resolves it immediately.")
    },
    diagrams: [
      {
        id: "publish-state-flow",
        title: text("图解一：一次发布的状态流", "Diagram 1: a publish state flow"),
        alt: text("可发布、发布中、已发布和需要处理四个状态，其中发布中分别通向成功和失败。", "Ready, publishing, published, and needs-attention states, with publishing branching to success and failure."),
        viewBox: "0 0 960 540",
        nodes: [
          node("idle", "可发布", "Ready", "按钮可用，说明风险", "Action available with risk context", 50, 205, 175, 110, "surface"),
          node("working", "发布中", "Publishing", "禁用重复提交，显示进度", "Prevent duplicates and show progress", 285, 205, 175, 110, "accent"),
          node("success", "已发布", "Published", "展示链接与下一步", "Expose link and next action", 610, 95, 175, 110, "success"),
          node("failure", "需要处理", "Needs attention", "保留草稿与重试入口", "Keep draft and retry path", 610, 335, 175, 110, "warning")
        ],
        connectors: [
          { from: "idle", to: "working", label: text("点击", "Click") },
          { from: "working", to: "success", label: text("请求完成", "Request resolves") },
          { from: "working", to: "failure", label: text("请求失败", "Request fails") },
          { from: "failure", to: "idle", label: text("修改或重试", "Edit or retry") }
        ]
      },
      {
        id: "feedback-proximity-map",
        title: text("图解二：反馈离操作多近", "Diagram 2: feedback proximity"),
        alt: text("发布按钮、同一区域的结果卡片和全局通知三层从近到远排列。", "Publish button, local result card, and global notice arranged from nearest to farthest."),
        viewBox: "0 0 960 540",
        nodes: [
          node("button", "按钮状态", "Button state", "第一确认层", "First confirmation layer", 80, 215, 200, 110, "ink"),
          node("local", "结果卡片", "Result card", "链接、撤销、失败原因", "Link, undo, or failure reason", 380, 215, 200, 110, "accent"),
          node("global", "全局通知", "Global notice", "同步、跨页面提示", "Sync or cross-page context", 680, 215, 200, 110, "surface")
        ],
        connectors: [
          { from: "button", to: "local", label: text("同一视线", "Same line of sight") },
          { from: "local", to: "global", label: text("补充上下文", "Add context") }
        ]
      },
      {
        id: "feedback-timeline",
        title: text("图解三：从按下到结果的节奏", "Diagram 3: rhythm from press to result"),
        alt: text("时间线从按下、输入已接收、请求期间到完成后的下一步。", "A timeline from press and acknowledgement through request duration to the next action after completion."),
        viewBox: "0 0 960 540",
        nodes: [
          node("zero", "0ms", "0 ms", "按下", "Pressed", 45, 205, 170, 110, "ink"),
          node("ack", "120ms", "120 ms", "输入已接收", "Input acknowledged", 265, 205, 170, 110, "accent"),
          node("wait", "请求期间", "During request", "发布中或进度", "Publishing or progress", 485, 205, 170, 110, "surface"),
          node("settle", "完成后 800ms", "800 ms after result", "结果与下一步", "Result and next action", 705, 205, 170, 110, "success")
        ],
        connectors: [
          { from: "zero", to: "ack" },
          { from: "ack", to: "wait" },
          { from: "wait", to: "settle" }
        ]
      }
    ]
  },
  {
    guideId: "card-list-filter-continuity",
    standfirst: text(
      "卡片、列表和筛选里的变化经常同时发生：项目进入、离开、重排、刷新和收缩。用户需要一条能追踪的因果链，知道自己操作的是谁、它去了哪里，以及为什么周围内容也随之变化。",
      "Cards, lists, and filters often change at once: items arrive, leave, reorder, refresh, and contract. People need a trackable causal chain that tells them what they acted on, where it went, and why surrounding content changed too."
    ),
    sections: [
      {
        id: "identity",
        title: text("先让用户认得出同一个对象", "Let people recognise the same object first"),
        paragraphs: [
          text(
            "连续性的起点是对象身份。一个卡片被选择、拖拽或筛选后，它的标题、缩略图、边界和相对位置应该尽量延续。即使尺寸要变化，也要让关键识别线索留在画面里。比如任务卡从看板进入详情页时，标题和主色块可以在新布局中继续出现；筛选后只剩三条结果时，保留激活的筛选条件和数量，用户便能把收缩后的列表与刚才的选择联系起来。",
            "Continuity starts with object identity. When a card is selected, dragged, or filtered, its title, thumbnail, boundary, and relative position should persist where possible. Even when size changes, keep main recognition cues on screen. When a task card opens into detail, its title and primary color can continue in the new layout; when filtering leaves three results, keep the active filter and count visible so people can connect the reduced list to the choice they just made."
          ),
          text(
            "身份线索也能帮助处理内容更新。来自实时协作、轮询刷新或后台同步的新项目，不要和用户刚操作的项目混成一团。新项目可以从列表边缘轻量进入，并用短暂的“新增”标记说明来源；被更新的项目可以只变化相关字段，避免整张卡片反复闪动。用户会把每一次变化归因到自己的动作、别人的动作或系统刷新，界面提供的线索越清楚，认知负担越低。",
            "Identity cues also help with updates. New items from collaboration, polling, or background sync should not blend into the item a person just touched. A new item can enter lightly from the list edge with a brief New marker that explains its source; an updated item can change only the relevant field instead of flashing the whole card. People attribute every change to their own action, someone else’s action, or a system refresh. Clearer cues reduce that burden."
          )
        ]
      },
      {
        id: "timeline",
        title: text("进入、移动和离开共用一条时间线", "Let entrance, movement, and exit share one timeline"),
        paragraphs: [
          text(
            "列表变化很容易显得乱，因为进入、离开和位置移动同时发生。处理的关键在于给它们一个共同的节奏。先让要离开的项目降低存在感，再让保留项目平移到新位置，最后让新增项目出现。它们并不需要逐帧串行，只要开始和结束有清楚的先后关系即可。对于十条以内的列表，120–220ms 往往能完成一次干净的重排；项目更多时，优先缩短单项延迟，避免最后一个项目很久以后才落位。",
            "List changes can feel chaotic because entrance, exit, and movement happen together. The key is a shared rhythm. Let departing items reduce their presence, move retained items to their new places, then reveal incoming items. They do not need frame-by-frame serialization; their starts and ends simply need a clear order. For lists under ten items, 120–220 ms often completes a clean reorder. With more items, shorten per-item delay so the final item does not settle much later than the first."
          ),
          text(
            "视觉上的移动应当真实反映数据变化。排序后卡片最好沿着它们实际要去的位置移动；如果采用 crossfade，保留旧位置和新位置的重叠时间，让眼睛有机会建立对应关系。列表容器本身保持稳定高度也很重要。大面积的高度跳动会让用户以为页面重新加载了，而非理解为内容发生了筛选。对小屏幕来说，连续性还意味着滚动位置可控：用户刚刚触碰的区域应尽可能留在视口附近。",
            "Visual movement should reflect the data change. After sorting, cards should travel toward the places they truly occupy; if using crossfade, overlap old and new positions long enough for the eye to establish correspondence. Keeping the container’s height stable matters too. Large height jumps can look like a page reload rather than a filtered result. On small screens, continuity also means controlling scroll position: keep the area a person just touched near the viewport whenever possible."
          )
        ]
      },
      {
        id: "filters",
        title: text("筛选要保留条件、数量和空状态", "Keep criteria, counts, and empty states through filtering"),
        paragraphs: [
          text(
            "筛选的动效承担解释责任。用户选择“已完成”或输入关键词后，列表会减少、排序会变化、统计数字也会更新。激活的筛选 chip、搜索词和结果数量应该先于或同时于列表变化出现，这样用户先知道规则，再看到结果。若只让卡片瞬间消失，页面会像发生了故障；若条件、数量和卡片同步更新，用户能理解这是一次受控的收缩。",
            "Filter motion carries an explanatory responsibility. When someone chooses Completed or enters a query, the list shrinks, ordering can change, and counts update. Show the active filter chip, query, and result count before or alongside the list change, so people see the rule before the result. If cards simply vanish, the page can resemble a fault; when criteria, count, and cards update together, the contraction reads as controlled."
          ),
          text(
            "空状态同样属于连续性。零结果也是列表的一种结果，它应接住刚才的筛选条件：显示“没有匹配‘预算’的项目”，提供清除筛选或换一个条件的入口。空状态进入时，一次淡入加上稳定的占位就足够。若筛选结果很快来回变化，避免每次都播放完整出入场；在输入框连续输入时，可以用更短的过渡，等用户停止输入后再让最终结果稳定下来。",
            "An empty state belongs to continuity as well. Zero results are not the end of the list; the state should receive the active criteria: say No projects match budget and offer Clear filters or another path. Its entrance does not need a large bounce—one fade with a stable placeholder is enough. When results change rapidly, avoid replaying a full entrance and exit every time. During continuous typing, use shorter transitions and let the final result settle once input pauses."
          )
        ]
      },
      {
        id: "source",
        title: text("刷新、排序和拖拽各自有不同信号", "Give refresh, sorting, and dragging distinct signals"),
        paragraphs: [
          text(
            "三种变化看起来都在移动卡片，实际含义完全不同。刷新告诉用户系统得到了新数据；排序表达一个新的比较规则；拖拽确认用户亲手改变了顺序。刷新适合轻量提示和局部更新，排序适合展示当前排序规则与整体重排，拖拽则需要拾取态、占位和落点。把它们做成同一种“卡片飞来飞去”，会让用户失去对原因的判断。",
            "Refresh, sorting, and dragging all move cards, yet they mean different things. Refresh says the system received new data; sorting expresses a new comparison rule; dragging confirms that a person directly changed order. Refresh benefits from a light cue and local update, sorting from showing the active rule and a whole-list reorder, and dragging from pickup, placeholder, and drop states. Treating all three as cards flying around removes the user’s ability to understand why change occurred."
          ),
          text(
            "实现时可以把“变化来源”作为状态的一部分。列表容器记录当前是 filter、sort、refresh 还是 drag；每种状态只触发自己需要的视觉规则。这样也利于测试：筛选时检查结果数量和焦点，排序时检查对象的最终顺序，拖拽时检查键盘与触屏路径。动效不再是覆盖在数据之上的装饰层，它成为状态变化的可见输出，和业务逻辑一起被验收。",
            "In implementation, make the source of change part of state. Let the list container know whether the current change is filter, sort, refresh, or drag, and let each mode trigger only its necessary visual rule. This also improves testing: verify result count and focus during filtering, final order during sorting, and keyboard and touch paths during dragging. Motion becomes visible output of state change, validated alongside business logic rather than treated as decoration floating above it."
          )
        ]
      },
      {
        id: "review",
        title: text("把连续性写进列表组件的验收", "Make continuity part of list-component acceptance"),
        paragraphs: [
          text(
            "列表组件可以把连续性写成一组明确规则：对象身份如何保留、容器高度在何种条件下变化、筛选条件和数量何时更新、移动距离和总时长的上限是多少、空状态承接哪些动作。这样新页面引用组件时，不会每次重新猜测动画该怎么做。设计评审关注的是用户是否能追踪，工程评审关注的是最终数据顺序和焦点，两个角度围绕的是同一份契约。",
            "A list component can turn continuity into explicit rules: how object identity persists, when container height may change, when criteria and counts update, the limit for travel and total duration, and which actions an empty state receives. New pages can then use the component without repeatedly guessing how animation should work. Design review asks whether people can track the change; engineering review checks final data order and focus. Both perspectives revolve around the same contract."
          ),
          text(
            "验收时要用真实规模的数据。三张卡片的漂亮位移，放到五十条搜索结果上可能变成拖延。测试一次连续输入、一次多条件筛选、一次排序和一次移动端滚动中的更新；同时开启减少动效偏好，确认规则、数量和焦点仍然清楚。好的连续性并不要求每个对象都演一段完整动画，它要求每次变化都有来处、有结果、有可以继续操作的空间。",
            "Review with realistic data scale. A beautiful move across three cards can turn into delay across fifty search results. Test continuous typing, multi-condition filtering, sorting, and an update while mobile scrolling; then enable reduced motion and confirm that rules, counts, and focus remain clear. Good continuity does not require every object to perform a full animation. It requires every change to have an origin, a result, and room for the next action."
          )
        ]
      }
    ],
    checklistTitle: text("列表连续性验收清单", "List continuity checklist"),
    checklist: [
      { id: "identity", label: text("被操作对象保留可辨认线索", "The acted-on object retains recognisable cues"), detail: text("标题、缩略图、色块或相对位置在新状态中继续出现。", "Title, thumbnail, color block, or relative position continues in the new state.") },
      { id: "rule", label: text("筛选规则和结果数量同步可见", "Filter rule and result count are visible together"), detail: text("先让人知道规则，再让列表收缩或重排。", "Show the rule before the list contracts or reorders.") },
      { id: "timing", label: text("离开、移动和进入共享短节奏", "Exit, movement, and entrance share a short rhythm"), detail: text("项目多时控制总时长，避免延迟排队。", "Cap total duration for larger sets and avoid delay queues.") },
      { id: "empty", label: text("空状态解释条件并给出下一步", "Empty state explains criteria and offers a next step"), detail: text("保留搜索词或筛选条件，并提供清除或替换入口。", "Retain query or criteria and offer clear or replacement actions.") },
      { id: "source", label: text("刷新、排序与拖拽可被区分", "Refresh, sort, and drag are distinguishable"), detail: text("每种来源使用自己的状态与验收路径。", "Each source uses its own state and acceptance path.") }
    ],
    caseStudy: {
      title: text("案例：项目筛选先更新数量，再收缩卡片", "Case: project filtering updates count before cards contract"),
      context: text("筛选条件和命中数量放在列表上方，保留项平移，离开项只降低透明度。", "Active criteria and match count sit above the list; retained items move while departing items only fade."),
      code: `.result-list { display: grid; gap: 12px; }
.result-card { transition: transform 180ms ease-out, opacity 140ms ease-out; }
.result-card[data-visibility="leaving"] { opacity: 0; transform: scale(.985); pointer-events: none; }
.result-meta[data-updating="true"] { color: var(--motion-ink); }
.result-empty { min-height: 160px; opacity: 0; visibility: hidden; transition: opacity 140ms ease-out; }
.result-list[data-empty="true"] + .result-empty { opacity: 1; visibility: visible; }
@media (prefers-reduced-motion: reduce) { .result-card, .result-empty { transition-duration: 1ms; } }`,
      explanation: text("离开项目不使用大位移，保留项目的真实位置移动更容易被看清。命中数量通过 data-updating 先变化，建立“规则已经生效”的线索；空状态预留高度，列表收缩后页面不会突然塌陷。", "Departing items avoid large travel so the real movement of retained items is easier to read. The match count changes first through data-updating, establishing that the rule has taken effect; the empty state reserves height so the page does not suddenly collapse.")
    },
    diagrams: [
      {
        id: "card-identity-map",
        title: text("图解一：卡片身份在状态间延续", "Diagram 1: card identity persists across states"),
        alt: text("同一张带标题和色块的卡片经历默认、选中、筛选后和详情四个位置。", "One card with a title and color block appears in default, selected, filtered, and detail positions."),
        viewBox: "0 0 960 540",
        nodes: [
          node("default", "默认卡片", "Default card", "标题、缩略图、位置", "Title, thumbnail, position", 55, 215, 185, 105, "surface"),
          node("selected", "已选中", "Selected", "边界与焦点增强", "Boundary and focus strengthen", 285, 215, 185, 105, "accent"),
          node("filtered", "筛选后", "After filter", "保留身份与新顺序", "Identity remains in new order", 515, 215, 185, 105, "ink"),
          node("detail", "详情状态", "Detail state", "同一标题继续出现", "The same title continues", 745, 215, 185, 105, "success")
        ],
        connectors: [
          { from: "default", to: "selected", label: text("选择", "Select") },
          { from: "selected", to: "filtered", label: text("筛选", "Filter") },
          { from: "selected", to: "detail", label: text("打开", "Open") }
        ]
      },
      {
        id: "list-change-timeline",
        title: text("图解二：列表更新的三段节奏", "Diagram 2: three beats of a list update"),
        alt: text("从 0 到 220 毫秒依次展示离开、重排和进入，三段有部分重叠。", "From 0 to 220 milliseconds, exit, reorder, and entrance appear in partially overlapping beats."),
        viewBox: "0 0 960 540",
        nodes: [
          node("exit", "0–100ms", "0–100 ms", "离开项降低存在感", "Departing items reduce presence", 70, 205, 230, 110, "warning"),
          node("move", "60–180ms", "60–180 ms", "保留项移向真实位置", "Retained items travel to real positions", 365, 205, 230, 110, "accent"),
          node("enter", "120–220ms", "120–220 ms", "新增项轻量进入", "New items enter lightly", 660, 205, 230, 110, "success")
        ],
        connectors: [
          { from: "exit", to: "move" },
          { from: "move", to: "enter" }
        ]
      },
      {
        id: "filter-explanation-flow",
        title: text("图解三：筛选如何解释结果", "Diagram 3: how a filter explains its result"),
        alt: text("筛选条件先影响结果数量，再分支到保留卡片或空状态，空状态提供清除入口。", "Criteria first affects result count, then branches to retained cards or empty state; the empty state offers Clear."),
        viewBox: "0 0 960 540",
        nodes: [
          node("criteria", "筛选条件", "Criteria", "已完成 · 本周", "Completed · This week", 60, 215, 180, 105, "accent"),
          node("count", "结果数量", "Result count", "规则已生效", "Rule has taken effect", 305, 215, 180, 105, "ink"),
          node("results", "保留卡片", "Retained cards", "移动到新位置", "Move to new positions", 610, 100, 180, 105, "success"),
          node("empty", "空状态", "Empty state", "解释条件与下一步", "Explain criteria and next step", 610, 340, 180, 105, "surface")
        ],
        connectors: [
          { from: "criteria", to: "count" },
          { from: "count", to: "results", label: text("有结果", "Matches") },
          { from: "count", to: "empty", label: text("零结果", "Zero matches") },
          { from: "empty", to: "criteria", label: text("清除", "Clear") }
        ]
      }
    ]
  }
] as const satisfies readonly SeoGuideLongArticle[];

export function getSeoGuideArticleA(id?: string | null): SeoGuideLongArticle | undefined {
  return seoGuideArticlesA.find((article) => article.guideId === id);
}
