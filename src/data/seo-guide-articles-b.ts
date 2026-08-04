import type { SeoGuideId } from "./seo-guide-ids";

/**
 * Long-form editorial source for scenario guides 05–08.
 * The renderer can turn `diagrams` directly into SVG cards: coordinates use a
 * 960 × 540 canvas and connectors join node ids.
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
  guideId: SeoGuideId;
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

const deletionInteractionRuntimeExample = `<section class="delete-demo">
  <ul data-project-list>
    <li class="project-row" data-project-row data-project-id="alpha" data-state="ready">
      <span>Project Alpha</span>
      <button type="button" data-delete>Delete</button>
    </li>
  </ul>
  <div data-project-undo hidden>
    <span>Project deleted.</span>
    <button type="button" data-undo>Undo</button>
  </div>
  <p role="status" aria-live="polite" data-delete-status>Project Alpha is available.</p>
</section>

<style>
.delete-demo { display: grid; gap: 12px; max-width: 28rem; }
.project-row { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
@media (prefers-reduced-motion: no-preference) {
  .project-row { transition: opacity 180ms ease, transform 180ms ease; }
  .project-row[data-state="leaving"] { opacity: 0; transform: translateX(8px); }
}
</style>

<script>
const row = document.querySelector("[data-project-row]");
const list = document.querySelector("[data-project-list]");
const deleteButton = row.querySelector("[data-delete]");
const undoRegion = document.querySelector("[data-project-undo]");
const undoButton = undoRegion.querySelector("[data-undo]");
const status = document.querySelector("[data-delete-status]");
const projectId = row.dataset.projectId;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let leaveTimer = 0;
let onLeaveEnd = null;

function waitForServer() {
  return new Promise((resolve) => window.setTimeout(resolve, 160));
}

async function deleteProject(id) {
  await waitForServer();
}

async function restoreProject(id) {
  await waitForServer();
}

function clearLeaving() {
  window.clearTimeout(leaveTimer);
  leaveTimer = 0;
  if (onLeaveEnd) row.removeEventListener("transitionend", onLeaveEnd);
  onLeaveEnd = null;
}

function removeAfterExit() {
  const finishRemoval = () => {
    clearLeaving();
    if (row.isConnected) row.remove();
  };

  if (reducedMotion.matches) {
    finishRemoval();
    return;
  }

  onLeaveEnd = (event) => {
    if (event.target !== row || event.propertyName !== "opacity") return;
    finishRemoval();
  };
  row.addEventListener("transitionend", onLeaveEnd);
  leaveTimer = window.setTimeout(finishRemoval, 220);
}

async function removeProject() {
  if (deleteButton.disabled) return;

  row.dataset.state = "deleting";
  deleteButton.disabled = true;
  status.textContent = "Deleting Project Alpha.";

  try {
    await deleteProject(projectId);
    row.dataset.state = "leaving";
    undoRegion.hidden = false;
    undoButton.disabled = false;
    status.textContent = "Project deleted. Undo is available.";
    undoButton.focus();
    removeAfterExit();
  } catch {
    row.dataset.state = "ready";
    deleteButton.disabled = false;
    status.textContent = "Project deletion failed. Try again.";
    deleteButton.focus();
  }
}

async function restoreProjectRow() {
  if (undoButton.disabled) return;

  clearLeaving();
  undoButton.disabled = true;
  status.textContent = "Restoring Project Alpha.";

  try {
    await restoreProject(projectId);
    if (!row.isConnected) list.append(row);
    row.dataset.state = "ready";
    deleteButton.disabled = false;
    undoButton.disabled = false;
    undoRegion.hidden = true;
    status.textContent = "Project restored.";
    deleteButton.focus();
  } catch {
    undoButton.disabled = false;
    status.textContent = "Project restoration failed. Try again.";
    undoButton.focus();
  }
}

deleteButton.addEventListener("click", removeProject);
undoButton.addEventListener("click", restoreProjectRow);
</script>`;

export const seoGuideArticlesB = [
  {
    guideId: "reduced-motion",
    standfirst: text(
      "减弱动效的目标是让用户更容易读懂界面：保留因果、焦点和完成结果，再把大幅移动、持续循环和意外跳动降到合适强度。它是一条完整交互路径，需要和默认路径一起设计、一起验收。",
      "Reduced motion makes an interface easier to read: retain cause, focus, and completed outcomes, then lower large travel, continuous loops, and surprising movement to an appropriate intensity. It is a complete interaction path that deserves the same design and review as the default path."
    ),
    sections: [
      {
        id: "meaning",
        title: text("先定义必须保留的意义", "Define the meaning that must remain"),
        paragraphs: [
          text(
            "很多团队把减弱动效理解成把所有 transition 设为零。这样虽然减少了移动，却常常顺带拿走了界面的解释能力：用户点击保存后，不再知道请求是否已经收到；切换工作区后，焦点突然换了位置；删除一项后，列表少了一行，却没有告诉人发生了什么。减弱动效真正要保护的是信息，而不是某一段 CSS 的时长。先写下每个动作需要传递的答案：是谁触发的、系统正在处理什么、结果落在哪里、接下来还能做什么。",
            "Many teams treat reduced motion as setting every transition to zero. That lowers movement, yet it can also remove the interface’s explanation: after Save, people no longer know whether the request was received; after switching workspaces, focus appears somewhere new; after deletion, a row disappears without explaining the change. Reduced motion protects information rather than the duration of one CSS rule. Start by writing the answers every action must communicate: who triggered it, what the system is processing, where the result lands, and what can happen next."
          ),
          text(
            "把这份答案转成状态表，会比从动画属性开始更可靠。以文件上传为例，默认路径可以有进度填充、短暂旋转和新文件行的进入；低动态路径仍要有“上传中”“已完成”、文件名、可用状态和失败后的重试入口。用户得到的是同一份结果，只是路径不再依赖大范围位移。状态文字、颜色、边框、图标、焦点和层级都能承担信号，其中至少两个应在每个关键状态同时出现，避免只依赖一种感官线索。",
            "Turn those answers into a state table before choosing properties. A file upload can use progress fill, a short spinner, and an entering file row on the default path; the low-motion path still needs Uploading, Complete, the filename, availability, and a retry action after failure. The outcome stays the same while the route no longer depends on broad travel. State copy, color, boundaries, icons, focus, and hierarchy can all carry the signal. Use at least two of them at each critical state so no single sensory cue bears the whole meaning."
          )
        ]
      },
      {
        id: "inventory",
        title: text("盘点移动，再选择替代表达", "Inventory movement, then choose replacements"),
        paragraphs: [
          text(
            "审查页面时，把动作按感知负担分成四类：跨屏或跨容器的位移、尺寸快速变化、持续循环、由滚动或手势驱动的跟随。第一类最容易造成空间失衡，适合缩短距离、改为原位淡化或用稳定边界标出变化；第二类可以保留极小的缩放，但应避免从很小尺寸突然放大；第三类常可停在一个可读的静态状态；第四类要保留用户手势和内容位置，让控制感一直在用户手里。分类让方案具有一致性，页面也更容易维护。",
            "During review, group movement by perceptual load: travel across a screen or container, rapid size changes, continuous loops, and movement driven by scroll or direct manipulation. The first category can lose spatial balance, so shorten distance, fade in place, or use a stable boundary to mark the change. The second can retain very small scale changes while avoiding a sudden expansion from a tiny size. The third often settles into a readable static state. The fourth should preserve the person’s gesture and content position so control remains in their hands. Grouping creates consistency and makes the page easier to maintain."
          ),
          text(
            "替代方案需要匹配原动作的职责。一个抽屉原先从右侧滑入，是为了说明它来自哪里并暂时覆盖主内容；低动态版本可以直接显示抽屉、保持触发按钮的 pressed 状态，并把键盘焦点移到抽屉标题。一个成功 toast 原先从底部升起，是为了让结果被看见；低动态版本可在触发按钮附近更新“已保存”，再在状态区保留一条静态确认。这样做不会让低动态界面变得沉默，它只是把解释从移动转移到更稳定的视觉和语义线索上。",
            "A replacement should match the job of the original motion. A drawer may slide in from the right to explain its origin and its temporary coverage of main content; the low-motion version can reveal it directly, preserve the trigger’s pressed state, and move keyboard focus to the drawer title. A success toast may rise from the bottom to make a result noticeable; the low-motion version can update Saved beside the trigger and retain a static confirmation in the status area. The interface remains expressive because explanation moves from travel to stable visual and semantic cues."
          )
        ]
      },
      {
        id: "implementation",
        title: text("把偏好写进组件契约", "Put the preference into the component contract"),
        paragraphs: [
          text(
            "`prefers-reduced-motion` 应该在组件层定义，而不是等到页面末尾再用一条全局覆盖规则收尾。组件契约要说明默认状态、低动态状态、两条路径共同保留的文案和 aria 状态，以及用户在运行时修改系统偏好时如何更新。对可重复使用的 Pack，这份契约还应明确哪些值允许主题或产品覆盖，例如入口距离、是否显示装饰性旋转、成功状态停留多久。把规则放在数据与组件附近，才能避免新页面悄悄回到只会移动的旧习惯。",
            "Define `prefers-reduced-motion` at the component level instead of adding one global override at the end of a page. The component contract should state the default state, the low-motion state, the copy and aria states shared by both paths, and the response when a person changes the system preference at runtime. For reusable Packs, it should also identify values a theme or product may override: entrance distance, whether decorative rotation appears, and how long a success state stays visible. Keeping rules close to data and components prevents new pages from drifting back to a movement-only habit."
          ),
          text(
            "实现时优先使用同一个状态源。按钮从“保存”变为“保存中”再变为“已保存”，默认版本可以在状态变化周围加入 transform 和 opacity；低动态版本沿用相同的 `data-state`、相同的文字和相同的可访问性通知，只替换视觉过渡。这样测试覆盖的是一个业务流程，而不是两套互不相干的组件。也要尊重手动设置：如果产品提供“减少动效”开关，它的优先级、存储方式和与系统偏好的关系应被写清楚，避免用户每次访问都要重新选择。",
            "Use one state source in implementation. A button moves from Save to Saving to Saved; the default version can add transform and opacity around those state changes, while the low-motion version keeps the same `data-state`, copy, and accessibility announcement and replaces only the visual transition. Tests then cover one business flow rather than two unrelated components. Respect manual settings as well: if the product offers a Reduce motion control, document its priority, storage, and relationship to the system preference so people do not have to choose again on every visit."
          )
        ]
      },
      {
        id: "interaction",
        title: text("让焦点、滚动和输入保持连续", "Keep focus, scroll, and input continuous"),
        paragraphs: [
          text(
            "低动态模式常常暴露出默认路径里被动画掩盖的问题。弹窗出现得更直接时，焦点是否已经进入弹窗？列表不再滑动时，新增项是否仍然在阅读位置附近？筛选结果立刻替换时，屏幕阅读器能否知道结果数量发生了变化？这些问题决定交互是否完整。每当移除一段视觉运动，都要补查焦点管理、滚动位置、状态区域和键盘返回路径。减弱动效能够成为一面镜子，帮助团队发现原先依赖视觉缓冲掩盖的断点。",
            "Low-motion mode often exposes issues that the default path hides with animation. When a dialog appears directly, has focus already entered it? When a list no longer slides, does a new item still appear near the reading position? When filtered results replace immediately, can a screen reader learn that the count changed? These questions determine whether the interaction is complete. Whenever visual movement is removed, recheck focus management, scroll position, status regions, and the keyboard return path. Reduced motion becomes a useful mirror for breaks previously hidden by visual buffering."
          ),
          text(
            "同样的原则适用于触摸和拖拽。减少动效并不意味着禁用直接操控；用户拖动滑块、排序任务或拖拽时间线时，内容仍应跟随手势，只是惯性、回弹和装饰性残影可以更克制。要确保松手后的结果在同一位置被确认，并让撤销或恢复入口稳定可见。对于自动播放的轮播、背景浮动和闪烁加载骨架，默认关闭或改为手动触发通常更合适，因为这些动作没有用户输入作为锚点。",
            "The same principle applies to touch and drag. Reducing motion does not disable direct manipulation; when someone drags a slider, sorts tasks, or scrubs a timeline, content should still follow the gesture while inertia, bounce, and decorative trails become more restrained. Confirm the result in the same place after release and keep undo or recovery actions steadily visible. Autoplay carousels, background floating, and flashing loading skeletons are usually better disabled by default or changed to manual replay because they lack a user action as an anchor."
          )
        ]
      },
      {
        id: "review",
        title: text("把减弱动效作为发布标准验收", "Review reduced motion as a shipping criterion"),
        paragraphs: [
          text(
            "验收不应只在浏览器开发工具里勾选一次偏好。把系统偏好切换、产品内开关、键盘操作、触屏操作和窄屏布局放在同一张测试清单中。测试者需要能够回答：我是否看得出提交已经开始？我是否知道失败发生在哪里？我是否还能撤销？我是否能在没有连续运动的情况下理解列表、工作区和层级变化？把回答记录下来，下一次同类组件就能直接复用。",
            "Review should go beyond toggling a browser preference once. Put system-preference changes, an in-product control, keyboard operation, touch operation, and narrow layouts on the same test checklist. A reviewer should be able to answer: Can I tell that submission started? Do I know where failure happened? Can I still undo? Can I understand list, workspace, and hierarchy changes without continuous movement? Record the answers so the next component of the same class can reuse them."
          ),
          text(
            "最后再衡量节奏。减弱动效不等于所有东西同时瞬移：一组信息仍可按语义顺序出现，状态仍可在极短时间内交接，焦点仍可被引导。关键是任何时间差都服务于阅读顺序，而不是制造戏剧性。把装饰性时间归零或降到极短，把任务完成、错误定位和内容更新的时间保留在可感知范围。这样无论用户选择哪条路径，产品都保持同一套逻辑和同一份尊重。",
            "Measure rhythm last. Reduced motion does not require every element to appear at the exact same instant: information can still arrive in semantic order, states can hand off over a very short interval, and focus can still be guided. Each delay should serve reading order rather than drama. Reduce decorative time to zero or near zero while keeping task completion, error location, and content updates perceptible. Both paths then preserve the same logic and the same respect for the person using the product."
          )
        ]
      }
    ],
    checklistTitle: text("减弱动效发布清单", "Reduced-motion shipping checklist"),
    checklist: [
      { id: "signals", label: text("每个关键状态至少保留两种信号", "Retain at least two signals for every critical state"), detail: text("组合文案、图标、边界、颜色和焦点，不把结果交给单一动画。", "Combine copy, icon, boundary, color, and focus instead of assigning the result to one animation.") },
      { id: "preference", label: text("系统偏好与产品开关都能即时生效", "System preference and product control update immediately"), detail: text("运行时修改偏好后，当前组件应切换到对应状态。", "When the preference changes at runtime, the current component should switch to the matching treatment.") },
      { id: "focus", label: text("直接出现的层级仍有正确焦点", "Directly appearing layers still receive correct focus"), detail: text("抽屉、弹窗和展开内容需要可预测的键盘路径。", "Drawers, dialogs, and disclosure content need a predictable keyboard path.") },
      { id: "input", label: text("直接操控仍然跟随手势", "Direct manipulation still follows the gesture"), detail: text("保留拖拽、滑动和排序的因果关系，收敛惯性与装饰性轨迹。", "Keep the causal link in drag, swipe, and reorder while reducing inertia and decorative trails.") },
      { id: "review", label: text("默认路径与低动态路径都通过同一业务验收", "Default and low-motion paths pass the same business review"), detail: text("成功、失败、撤销和恢复都要被独立检查。", "Success, failure, undo, and recovery all receive independent checks.") }
    ],
    caseStudy: {
      title: text("案例：保存确认在两条路径中保持同一结果", "Case: one save confirmation, two paths, one outcome"),
      context: text("编辑器点击保存后，需要立刻确认输入、展示进行中状态，并在完成后更新页面状态。", "An editor needs to acknowledge Save immediately, show progress, and update page state on completion."),
      code: `[data-save-state="saving"] { opacity: .72; }\n[data-save-state="saved"] { color: var(--success); }\n\n@keyframes settle-in {\n  from { opacity: 0; transform: scale(.88); }\n  70% { transform: scale(1.04); }\n  to { opacity: 1; transform: scale(1); }\n}\n\n@media (prefers-reduced-motion: no-preference) {\n  [data-save-state] { transition: transform 120ms ease, opacity 160ms ease; }\n  [data-save-state="saving"] { transform: scale(.98); }\n  [data-save-state="saved"] .save-icon { animation: settle-in 180ms cubic-bezier(.23, 1, .32, 1); }\n}`,
      explanation: text("业务状态、按钮文案和 status 区域在两条路径中完全一致。媒体查询只增加默认路径的缩放与图标进入，因此低动态版本仍能表达“收到、处理中、已完成”。", "Business state, button copy, and the status region stay identical on both paths. The media query adds scale and icon entrance only to the default path, so the low-motion version still communicates received, processing, and complete.")
    },
    diagrams: [
      {
        id: "signal-preservation",
        title: text("图解一：从移动信号转为稳定信号", "Diagram 1: move from travel signals to stable signals"),
        alt: text("保存动作从点击、处理中到已保存，低动态路径保留文案、图标和状态色。", "A save action moves from press to processing to saved; the low-motion path retains copy, icon, and status color."),
        viewBox: "0 0 960 540",
        nodes: [
          node("press", "点击保存", "Press Save", "输入已收到", "Input received", 70, 205, 190, 110, "ink"),
          node("processing", "保存中", "Saving", "文案 + 状态图标", "Copy + status icon", 385, 205, 190, 110, "accent"),
          node("saved", "已保存", "Saved", "结果 + 时间标记", "Result + time marker", 700, 205, 190, 110, "success")
        ],
        connectors: [
          { from: "press", to: "processing", label: text("保留状态变化", "Retain state change") },
          { from: "processing", to: "saved", label: text("减少装饰性位移", "Reduce decorative travel") }
        ]
      },
      {
        id: "motion-inventory",
        title: text("图解二：动作盘点与替代策略", "Diagram 2: motion inventory and replacement strategy"),
        alt: text("四类动作分别对应短距离、稳定边界、静态状态和保留手势的替代策略。", "Four motion classes map to short travel, stable boundaries, static states, and preserved gestures."),
        viewBox: "0 0 960 540",
        nodes: [
          node("travel", "跨容器位移", "Cross-container travel", "缩短距离", "Shorten distance", 70, 100, 290, 95, "warning"),
          node("scale", "快速缩放", "Rapid scale", "保留边界", "Keep boundary", 600, 100, 290, 95, "surface"),
          node("loop", "持续循环", "Continuous loop", "停在静态状态", "Settle to static state", 70, 345, 290, 95, "surface"),
          node("gesture", "手势跟随", "Gesture following", "保留直接操控", "Preserve manipulation", 600, 345, 290, 95, "accent")
        ],
        connectors: []
      },
      {
        id: "review-loop",
        title: text("图解三：低动态验收循环", "Diagram 3: low-motion review loop"),
        alt: text("状态表、默认路径、低动态路径、键盘和触屏验收形成循环。", "A state table, default path, low-motion path, keyboard, and touch review form a loop."),
        viewBox: "0 0 960 540",
        nodes: [
          node("states", "状态表", "State table", "必须保留的信息", "Meaning to retain", 385, 55, 190, 90, "ink"),
          node("default", "默认路径", "Default path", "视觉节奏", "Visual rhythm", 650, 220, 190, 90, "accent"),
          node("reduced", "低动态路径", "Low-motion path", "稳定线索", "Stable cues", 385, 385, 190, 90, "success"),
          node("input", "键盘与触屏", "Keyboard and touch", "焦点与手势", "Focus and gesture", 120, 220, 190, 90, "surface")
        ],
        connectors: [
          { from: "states", to: "default" },
          { from: "default", to: "reduced" },
          { from: "reduced", to: "input" },
          { from: "input", to: "states" }
        ]
      }
    ]
  },
  {
    guideId: "form-validation-delete-permission",
    standfirst: text(
      "表单校验、删除确认和权限变更都在处理边界。动效要把风险、影响范围、进行中状态和恢复路径安排在用户做决定的位置，让人能看见后果，也能继续完成任务。",
      "Form validation, deletion confirmation, and permission changes all handle boundaries. Motion should place risk, scope, progress, and recovery where people make the decision, so consequences remain visible and work can continue."
    ),
    sections: [
      {
        id: "risk-map",
        title: text("先画出风险和可恢复性的地图", "Map risk and reversibility first"),
        paragraphs: [
          text(
            "把高风险交互都做成同一种弹窗，往往会让重要程度变得模糊。表单中的邮箱格式错误需要快速、贴近输入的帮助；移除团队成员需要说明对象、影响和是否可以恢复；把链接从“受邀成员”改为“任何人可访问”需要让人看见范围扩大到了哪里。先按后果而不是控件类型分组：可立即修正、可撤销、需要明确承诺、会影响他人的设置。每一组决定反馈的位置、速度和文字强度。",
            "Making every high-risk interaction the same modal often blurs importance. An invalid email needs fast help beside the field; removing a team member needs the object, impact, and recovery option; changing a link from invited members to anyone needs to show where access expands. Group by consequence rather than control type: immediately correctable, reversible, explicitly committed, and settings that affect other people. Each group determines the location, pace, and language of feedback."
          ),
          text(
            "风险地图也能阻止过度表演。轻微的输入错误不需要整张页面震动，真正的删除确认也不该只靠红色和一次闪烁。界面应把注意力导向下一步：字段错误让焦点和帮助文本回到具体输入；删除确认让目标名称、影响数量和撤销策略同时可读；权限变更让旧规则、新规则和受影响对象并列出现。动效的节奏随风险提高而更有停顿，信息的证据也随风险提高而更完整。",
            "A risk map also prevents over-performance. A small input error does not need the whole page to shake, and a genuine deletion confirmation should not rely on red alone and one flash. Direct attention to the next step: field errors return focus and help text to the input; deletion confirmation makes the target name, impact count, and undo policy readable together; permission changes place old rule, new rule, and affected objects side by side. As risk rises, motion earns a clearer pause and information earns fuller evidence."
          )
        ]
      },
      {
        id: "validation",
        title: text("表单校验贴着输入发生", "Make validation happen beside the input"),
        paragraphs: [
          text(
            "好的行内校验从用户行为开始，而不是从错误状态开始。用户输入、离开字段、点击提交，三个时机需要不同策略。输入过程中优先给格式和要求的前瞻提示；离开字段时可以确认完整性；提交时再集中处理遗漏项，并把焦点带到第一个需要处理的地方。这样用户不会在每敲一个字符时被打断，也不会在提交后面对一串没有顺序的红字。每条提示都应说明问题、修正方式和修正后的预期。",
            "Good inline validation begins with user behavior rather than the error state. Typing, leaving a field, and submitting require different strategies. While typing, offer anticipatory format and requirement guidance; on blur, confirm completeness; on submit, gather missing items and move focus to the first one that needs action. People are then neither interrupted on every character nor left with an unordered wall of red copy after submission. Each message should state the problem, the correction, and the expected result."
          ),
          text(
            "动效只需帮助定位。字段边界可以在 120 到 180 毫秒内改变，错误图标和说明可在原位置显现，输入光标保持可编辑。一次极短的横向提醒适合提交后的单个错误，连续晃动会让错误本身变得比修正方案更抢眼。多个错误同时出现时，用清晰的文档顺序、错误摘要和逐项焦点导航代替逐个动画。低动态路径保留边界、说明和焦点，把额外位移移除。",
            "Motion only needs to help locate the issue. A field boundary can change over 120 to 180 milliseconds, an error icon and explanation can appear in place, and the input remains editable. One very short horizontal cue can suit a single post-submit error; repeated shaking makes the error more prominent than the correction. When several errors appear together, use clear document order, an error summary, and stepwise focus navigation instead of animating every field. The low-motion path keeps boundary, explanation, and focus while removing extra travel."
          )
        ]
      },
      {
        id: "deletion",
        title: text("删除需要对象、承诺和恢复", "Deletion needs object, commitment, and recovery"),
        paragraphs: [
          text(
            "删除流程的第一责任是确认对象。确认层里应出现项目名称、相关数量、不可恢复的内容和保留内容；当对象的名称相近时，还可补充头像、缩略图或路径。用户按下删除后，原列表里的项目可以进入处理中状态，避免看起来像点击无效。服务器确认后，再让项目离开列表，并在原位置或邻近位置留下撤销入口。整个过程讲的是同一件事，不同区域的状态要同步，而不是各自播放一段漂亮动画。",
            "The first responsibility of a deletion flow is confirming the object. The confirmation layer should show the item name, related count, irreversible content, and content that remains; similar names can be disambiguated with an avatar, thumbnail, or path. After Delete is pressed, the original list item can enter a processing state so the click never looks ignored. After the server confirms, let the item leave the list and retain an Undo action in or near the original position. The flow describes one event, so states across regions should stay synchronized rather than each playing an attractive animation."
          ),
          text(
            "按住确认适合代价高、误触概率高的操作，因为它把承诺变成一段可见的时间。进度填充要始终贴着手指或指针的来源，松开后立即取消，不要留下模糊的半完成状态。它不能取代文本说明：用户仍要知道删掉的是谁、能否恢复、多久后彻底清除。对于可撤销的归档或移除，撤销窗口应该稳定地停留足够久，并在窗口关闭前让用户完成其他任务；不要用短暂浮层逼迫用户立刻做决定。",
            "Hold-to-confirm suits actions with high cost and a high chance of accidental activation because it turns commitment into visible time. Progress fill should stay attached to the finger or pointer origin and cancel immediately on release, leaving no ambiguous half-complete state. It does not replace textual explanation: people still need to know what is removed, whether recovery is possible, and when permanent removal happens. For reversible archive or remove actions, the undo window should remain stable long enough for people to continue other work; a fleeting overlay should not force an immediate decision."
          )
        ]
      },
      {
        id: "permissions",
        title: text("权限变化要展示范围，而非只更新标签", "Show permission scope instead of updating one label"),
        paragraphs: [
          text(
            "权限设置的困难来自不可见的受影响对象。把“仅受邀成员”改为“拥有链接的任何人”时，界面需要同时说明访问者、可见内容、链接行为和保存后的结果。选择控件附近可以立即更新解释文案，确认保存时则把最终规则放到页面状态区，并更新成员或共享列表中的相关标记。用户看到的是一条可追踪的规则变化，而不是一个孤立的下拉框选择。",
            "Permission settings are difficult because affected objects are often invisible. When a rule changes from invited members only to anyone with the link, the interface needs to explain visitors, visible content, link behavior, and the result after saving. Copy near the choice can update immediately; on confirmation, place the final rule in the page status area and update related markers in members or sharing lists. People see a traceable rule change rather than an isolated dropdown choice."
          ),
          text(
            "权限的视觉层级应当和影响范围一致。只影响当前文档的角色调整可以在原处确认；影响整个工作区、公开链接或外部邀请的选择，应当获得更明确的总结和可回退路径。颜色可以帮助区分状态，完整句子负责说明谁会受到影响。对于实时协作产品，还要处理并发：当其他管理员同时修改规则时，页面需要说明本地选择是否仍有效、保存会覆盖什么、以及怎样重新载入最新状态。动效在这里负责让冲突和更新被看见，绝不掩盖它们。",
            "Permission hierarchy should match scope. A role adjustment that affects one document can confirm in place; a choice affecting a workspace, public link, or external invitations deserves a clearer summary and a route back. Color helps distinguish states while complete sentences explain who is affected. Collaborative products must also handle concurrency: if another administrator changes the rule, explain whether the local choice remains valid, what saving would overwrite, and how to reload the latest state. Motion makes conflict and update visible; it should never hide either one."
          )
        ]
      },
      {
        id: "review",
        title: text("用失败路径验收边界交互", "Review boundary interactions through failure paths"),
        paragraphs: [
          text(
            "真正的验收从失败开始。让校验接口返回延迟和错误，观察用户是否知道当前字段仍可编辑；让删除请求失败，确认对象没有提前消失且错误落在原操作附近；让权限保存发生冲突，检查页面是否保留了用户选择并给出明确下一步。再加入网络离线、键盘操作、窄屏和低动态偏好。每一种异常都验证同一个原则：风险越高，界面越要把原因、当前状态和恢复动作留在同一上下文里。",
            "Real review begins with failure. Return delay and error from validation services and observe whether people know the field is still editable; fail a deletion request and confirm the object has not vanished early and the error lands near the original action; create a permission-save conflict and check that the page retains the person’s choice and offers a clear next step. Add offline networking, keyboard operation, narrow screens, and low-motion preference. Every exception tests one principle: as risk rises, the interface keeps cause, current state, and recovery action in the same context."
          ),
          text(
            "团队也应记录哪些反馈是“承诺前”、哪些是“承诺中”、哪些是“承诺后”。承诺前的提示帮助理解后果；承诺中的反馈防止重复操作；承诺后的结果负责恢复任务节奏。这个分层能让设计、产品和工程对同一个交互使用相同语言，并减少把警告、加载和成功信息堆在一个组件里的冲动。当一个页面的边界操作都能被这样描述，动效规范就已经接近可复用的产品规则。",
            "Teams should record which feedback happens before commitment, during commitment, and after commitment. Before-commitment guidance explains consequences; during-commitment feedback prevents duplicate work; after-commitment result restores task rhythm. This framing gives design, product, and engineering a shared language and reduces the urge to pile warning, loading, and success into one component. When every boundary interaction on a page can be described this way, the motion spec is close to a reusable product rule."
          )
        ]
      }
    ],
    checklistTitle: text("高风险交互发布清单", "High-risk interaction shipping checklist"),
    checklist: [
      { id: "object", label: text("确认层明确对象与影响", "Confirmation names the object and impact"), detail: text("名称、数量、范围和可恢复性同时可读。", "Name, count, scope, and recoverability are readable together.") },
      { id: "field", label: text("错误贴着字段并保留编辑焦点", "Errors stay beside the field and retain editing focus"), detail: text("提示解释问题、修正方式和预期结果。", "The message explains the issue, correction, and expected result.") },
      { id: "pending", label: text("处理中状态阻止重复承诺", "Processing state prevents duplicate commitment"), detail: text("按钮、原对象和状态区同步说明进行中。", "Button, original object, and status region communicate progress together.") },
      { id: "recovery", label: text("失败和撤销入口留在原上下文", "Failure and undo stay in the original context"), detail: text("用户无需重新寻找对象或回忆刚才做了什么。", "People do not have to relocate the object or remember what they just did.") },
      { id: "scope", label: text("权限变化展示受影响范围", "Permission changes show affected scope"), detail: text("旧规则、新规则和受影响成员或内容可被比较。", "Old rule, new rule, and affected people or content can be compared.") }
    ],
    caseStudy: {
      title: text("案例：删除项目后保留可恢复的任务节奏", "Case: preserve task rhythm after deleting a project"),
      context: text("项目列表中的删除动作需要确认对象、等待服务器、更新列表并给出撤销机会。", "A project-list deletion must confirm the object, await the server, update the list, and offer an undo opportunity."),
      code: deletionInteractionRuntimeExample,
      explanation: text("列表项只有在服务端确认后才离开。两条路径都保留状态文字和撤销入口；默认路径额外加入极短的离开反馈，低动态路径直接更新结果。", "The list row leaves only after server confirmation. Both paths retain status copy and Undo; the default path adds a very short exit cue while the low-motion path updates the result directly.")
    },
    diagrams: [
      {
        id: "risk-map",
        title: text("图解一：按后果安排反馈", "Diagram 1: assign feedback by consequence"),
        alt: text("四种后果从可立即修正到影响他人，分别对应字段提示、撤销、明确确认和范围摘要。", "Four consequences range from immediate correction to affecting others, mapping to field help, undo, explicit confirmation, and scope summary."),
        viewBox: "0 0 960 540",
        nodes: [
          node("correct", "可立即修正", "Immediately correctable", "字段提示", "Field help", 55, 220, 190, 100, "surface"),
          node("undo", "可撤销", "Reversible", "原位撤销", "Undo in place", 275, 220, 190, 100, "accent"),
          node("commit", "需要承诺", "Requires commitment", "对象 + 后果", "Object + consequence", 495, 220, 190, 100, "warning"),
          node("others", "影响他人", "Affects others", "范围摘要", "Scope summary", 715, 220, 190, 100, "ink")
        ],
        connectors: [
          { from: "correct", to: "undo", label: text("风险上升", "Risk rises") },
          { from: "undo", to: "commit" },
          { from: "commit", to: "others" }
        ]
      },
      {
        id: "commitment-timeline",
        title: text("图解二：承诺前、中、后的反馈", "Diagram 2: feedback before, during, and after commitment"),
        alt: text("删除动作依次展示后果说明、处理中状态和删除结果与撤销入口。", "A deletion shows consequence guidance, processing state, then result and undo."),
        viewBox: "0 0 960 540",
        nodes: [
          node("before", "承诺前", "Before commitment", "名称、影响、选择", "Name, impact, choice", 80, 205, 210, 110, "warning"),
          node("during", "承诺中", "During commitment", "处理中、防重复", "Processing, prevent repeats", 375, 205, 210, 110, "accent"),
          node("after", "承诺后", "After commitment", "结果、撤销、继续", "Result, undo, continue", 670, 205, 210, 110, "success")
        ],
        connectors: [{ from: "before", to: "during" }, { from: "during", to: "after" }]
      },
      {
        id: "permission-scope",
        title: text("图解三：权限变化的范围证据", "Diagram 3: evidence for a permission scope change"),
        alt: text("旧规则、新规则、受影响对象和保存结果组成可比较的权限变化说明。", "Old rule, new rule, affected objects, and saved result create a comparable permission-change explanation."),
        viewBox: "0 0 960 540",
        nodes: [
          node("old", "旧规则", "Old rule", "仅受邀成员", "Invited members only", 80, 90, 300, 105, "surface"),
          node("new", "新规则", "New rule", "拥有链接的任何人", "Anyone with the link", 580, 90, 300, 105, "warning"),
          node("affected", "受影响对象", "Affected objects", "成员、链接、可见内容", "Members, links, visible content", 330, 250, 300, 105, "ink"),
          node("saved", "保存结果", "Saved result", "状态区中的最终规则", "Final rule in status area", 330, 400, 300, 80, "success")
        ],
        connectors: [{ from: "old", to: "affected" }, { from: "new", to: "affected" }, { from: "affected", to: "saved" }]
      }
    ]
  },
  {
    guideId: "from-brief-to-spec",
    standfirst: text(
      "一句“自然一点”可以成为讨论的起点，不能成为交付标准。可实现的动效规格把感觉翻译为对象、状态、触发、空间、时间、可打断性和低动态规则，让设计判断能被开发、测试和后续迭代共同使用。",
      "A line such as “make it feel more natural” can start a conversation; it cannot be a delivery standard. A buildable motion spec translates feeling into object, state, trigger, space, time, interruptibility, and low-motion rules so design judgment can be shared by implementation, testing, and later iteration."
    ),
    sections: [
      {
        id: "brief",
        title: text("把形容词变成可观察的事件", "Turn adjectives into observable events"),
        paragraphs: [
          text(
            "“高级”“有重量”“丝滑”描述的是感受，却没有说明界面里发生了什么。规格工作的第一步是追问可观察的事件：谁触发了变化，哪个对象改变，用户在变化前后分别能看见什么，结果需要被理解多久。比如“卡片出来时有一个动作再慢慢停下来”，可以拆成卡片从触发器附近进入、先快速到达、末段减速、最终边界与标题保持清晰。这样团队讨论的是状态和节奏，不会停留在每个人心里不同的审美词。",
            "Words such as polished, weighty, and smooth describe feeling without describing what happens in an interface. The first step of a spec is to ask for observable events: who triggers the change, which object changes, what people can see before and after, and how long the result needs to be understood. “A card arrives with an action and gradually stops” can become a card entering near its trigger, arriving quickly, decelerating near the end, and retaining a clear boundary and title. The team then discusses states and rhythm instead of private interpretations of aesthetic words."
          ),
          text(
            "用前后状态命名也能识别缺失信息。一个发布按钮常常至少有草稿、发布中、已发布、发布失败四种状态；如果需求只写“点击后播一个成功动画”，它遗漏了等待、失败和重复点击。把状态列成表后，每一行都有可见文案、允许操作、无障碍通知和视觉线索。规格因此从一个效果说明变成一份小型行为契约，开发可以据此搭建状态机，测试也能据此设计断言。",
            "Naming before and after states also reveals missing information. A publish button commonly has at least Draft, Publishing, Published, and Publish failed; a request that says only “play a success animation after click” misses waiting, failure, and repeat activation. Once states sit in a table, each row has visible copy, allowed actions, accessibility announcement, and visual cue. The spec becomes a compact behavior contract: engineering can build a state machine from it and testing can write assertions from it."
          )
        ]
      },
      {
        id: "state",
        title: text("先写状态图，再写关键节拍", "Write the state graph before key beats"),
        paragraphs: [
          text(
            "状态图回答“允许从哪里到哪里”，节拍表回答“在什么时间让什么被看见”。两者分开能避免一个常见问题：看起来很顺的时间线无法处理用户中途点击、网络变慢或请求失败。先画出合法转换，例如 Draft → Publishing → Published，Publishing 也可以回到 Failed；再为每条转换写关键节拍，例如 0ms 锁定按钮并确认输入、80ms 显示处理中、服务端返回后切换最终状态。节拍只描述需要被感知的节点，避免把每一帧都写进文档。",
            "A state graph answers which transitions are allowed; a beat plan answers what becomes visible when. Keeping them separate prevents a common failure: a lovely timeline that cannot handle a second click, a slow network, or a failed request. Draw legal transitions first, such as Draft to Publishing to Published, with Publishing also able to move to Failed. Then write key beats for each transition: at 0ms lock the button and acknowledge input, at 80ms show processing, and after the server returns switch the final state. Beats describe perceptible nodes rather than documenting every frame."
          ),
          text(
            "节拍的数量应随信息复杂度增加，而非随装饰欲增加。保存确认可能只需要“按下—处理中—已保存”三个节点；审批请求需要额外展示审批人队列，因为用户要理解系统正在等待谁。对于多个元素，明确谁先变化、谁跟随、谁保持静止。静止经常是重要的设计选择：它给用户提供锚点，让新增内容、结果数字或状态标签有地方可以被比较。一个好的规格会写出应当保持不动的内容。",
            "The number of beats should increase with information complexity, not decorative ambition. Save confirmation may need only Pressed, Saving, and Saved; an approval request needs the approver queue because people must understand whom the system is awaiting. For several elements, state who changes first, who follows, and who stays still. Stillness is often an important design choice: it gives an anchor against which a new row, result number, or status label can be compared. A good spec explicitly names what should remain still."
          )
        ]
      },
      {
        id: "space-time",
        title: text("用空间和时间描述感觉", "Describe feeling through space and time"),
        paragraphs: [
          text(
            "空间规格至少包括来源、目的地、距离和层级。来源告诉用户变化为何发生在这里；目的地告诉用户结果属于哪里；距离决定动作是否会抢走注意力；层级决定覆盖、推开还是并列。把“从左边滑进来”换成“从当前筛选器下方进入结果区域，位移不超过 16px，结果计数保持原位”，开发就能判断使用 transform、插入新行还是替换现有内容，设计也能判断动作是否仍遵循界面结构。",
            "A spatial spec includes origin, destination, distance, and hierarchy. Origin tells people why change occurs here; destination tells them where the result belongs; distance determines whether motion steals attention; hierarchy decides whether content overlays, pushes, or sits beside other content. Replace “slide in from the left” with “enter the result region beneath the active filter, travel no more than 16px, and keep the result count in place.” Engineering can then choose transform, inserting a row, or replacing existing content, while design can judge whether the action still follows interface structure."
          ),
          text(
            "时间规格要同时写时长和关系。单个数值如 240ms 只能说明一段变化有多长，不能说明按钮和状态标签是否同步、列表是否在结果落定后再出现、失败是否应打断进行中提示。写成“按钮反馈 120ms；状态文案在 80ms 后出现；成功结果在请求完成时切换；后续记录延迟 60ms”会更清晰。再补上曲线的职责：ease-out 用于明确落点，spring 用于连续输入或可中断对象。曲线名称只是实现选择，用户感知到的是抵达、停顿和衔接。",
            "A time spec needs both duration and relationships. A lone value such as 240ms says how long one change lasts, while saying nothing about whether a button and status label synchronize, whether a list appears after the result settles, or whether failure interrupts processing. “Button feedback: 120ms; status copy appears after 80ms; success switches when the request completes; follow-up record delays 60ms” is clearer. Add the job of the curve: ease-out supports a definite arrival, while spring supports continuous input or interruptible objects. Curve names are implementation choices; people perceive arrival, pause, and continuity."
          )
        ]
      },
      {
        id: "failure",
        title: text("把中断、失败和低动态写进同一份规格", "Put interruption, failure, and low motion in the same spec"),
        paragraphs: [
          text(
            "动效规格常在成功路径结束，这会让真正上线后的边界情况临时拼凑。每个进行中状态都要回答：用户再次点击会怎样，离开页面会怎样，网络超时会怎样，返回的数据过期会怎样。对于可取消请求，取消后的视觉状态应回到一个明确起点；对于不可取消请求，按钮和文案要说明正在完成什么。失败状态必须保留原始输入或可恢复上下文，避免用户既看见失败又失去之前填的内容。",
            "Motion specs often end at the success path, forcing edge cases to be improvised after launch. Every in-progress state should answer: What happens on another click? On leaving the page? On timeout? When returned data is stale? For cancelable work, the visual state should return to a clear starting point; for noncancelable work, button and copy should explain what is completing. A failure state must retain the original input or recoverable context so people do not see failure and lose their previous work at the same time."
          ),
          text(
            "低动态规则同样属于状态定义。写“减少动效”不够，需要说明哪些信号保留、哪些位移缩短、哪些循环停止、焦点如何管理。对发布流程而言，低动态版本仍然保留按钮状态、发布结果和记录插入，只移除沿路径移动和装饰性旋转。把这条规则写进每个关键转换，研发就不会把它视为发布前的附加修补。它也会让默认路径更清楚，因为团队被迫说明每一段动画实际在传递什么。",
            "Low-motion rules also belong in state definitions. “Reduce motion” is too vague; state which signals remain, which travel shortens, which loops stop, and how focus is managed. In a publishing flow, the low-motion version still retains button state, publishing result, and record insertion while removing travel along a path and decorative rotation. Put that rule on every key transition so it never becomes a last-minute patch. It also clarifies the default path because the team must state what every animation actually communicates."
          )
        ]
      },
      {
        id: "handoff",
        title: text("让规格成为可交接、可测试的资产", "Make the spec an asset for handoff and testing"),
        paragraphs: [
          text(
            "一份可交接的规格应让没有参与讨论的人也能复现判断。开头写场景、目标用户和成功标准；中间给出状态图、节拍、空间关系和参数范围；结尾列出失败、撤销、低动态和验收方法。附上一个静态图或可交互原型会帮助沟通，但图本身无法替代文字，因为测试需要知道何时断言、开发需要知道数据何时更新、内容设计需要知道文案如何变化。文字、图解和代码片段共同构成一个可追溯的决定。",
            "A handoff-ready spec lets someone who missed the conversation reproduce the judgment. Start with scenario, audience, and success criteria; give state graph, beats, spatial relationships, and parameter ranges in the middle; close with failure, undo, low-motion behavior, and review methods. A static diagram or interactive prototype helps communication, yet an image cannot replace words: tests need to know when to assert, engineering needs to know when data updates, and content design needs to know how copy changes. Text, diagram, and code fragment together create a traceable decision."
          ),
          text(
            "验收语句要可观察。与其写“感觉顺滑”，可以写“点击发布后 120ms 内出现进行中状态；完成后按钮、状态标记和时间线记录在同一轮状态更新中变为已发布；低动态模式没有超过 1px 的装饰性位移；失败时标题、正文和重试入口仍保留”。这样的标准既允许设计保有判断空间，也能让自动化测试和人工评审围绕同一组事实工作。规格因此会反哺内容库：每一份经过验证的场景都可能成为新的 Product Moment。",
            "Acceptance statements should be observable. Instead of “feel smooth,” write: “Within 120ms of Publish, show an in-progress state; when complete, button, status marker, and timeline record become Published in the same state update; low-motion mode uses no decorative travel over 1px; on failure, title, body copy, and retry remain.” Such standards preserve room for design judgment while giving automation and human review the same facts. The spec then feeds the content library: every verified scenario can become a future Product Moment."
          )
        ]
      }
    ],
    checklistTitle: text("动效规格交接清单", "Motion-spec handoff checklist"),
    checklist: [
      { id: "goal", label: text("写清场景、用户与要理解的结果", "State scenario, audience, and result to understand"), detail: text("先让动效服务任务，再讨论视觉性格。", "Let motion serve the task before discussing visual character.") },
      { id: "states", label: text("列出前后状态与合法转换", "List before/after states and legal transitions"), detail: text("包含等待、失败、撤销和重复输入。", "Include waiting, failure, undo, and repeat input.") },
      { id: "beats", label: text("写出关键节拍与同步关系", "Write key beats and synchronization"), detail: text("说明谁先变化、谁保持静止、何时更新数据。", "State who changes first, who stays still, and when data updates.") },
      { id: "space", label: text("标注来源、目的地、距离与层级", "Mark origin, destination, distance, and hierarchy"), detail: text("让空间关系能直接映射到实现方式。", "Make spatial relationships map directly to implementation.") },
      { id: "review", label: text("给出低动态和可观察验收语句", "Provide low-motion rules and observable acceptance"), detail: text("交接后任何人都能验证结果。", "Anyone can verify the result after handoff.") }
    ],
    caseStudy: {
      title: text("案例：把“卡片出来再慢慢停下来”写成规格", "Case: turn “the card arrives and gradually stops” into a spec"),
      context: text("筛选结果出现时，产品希望新卡片有进入感，同时不抢走用户对结果数量的阅读。", "When filtered results appear, the product wants the new card to feel introduced without stealing attention from the result count."),
      code: `Trigger: filter value changes after input settles\nStates: previous results → updating → filtered results\nSpace: new cards enter from the result region, translateY(12px) maximum\nBeats: 0ms update count; 40ms reveal first visible row; 60ms stagger only the next two rows\nCurve: cubic-bezier(.23, 1, .32, 1)\nReduced motion: update count and rows in place; no travel; preserve live-region announcement`,
      explanation: text("规格把“慢慢停下来”落实为 12px 上限、明确曲线、有限的三行节拍和原位低动态路径。结果数量保持原位，因此用户始终有稳定锚点。", "The spec turns “gradually stops” into a 12px cap, named curve, limited three-row beat plan, and in-place low-motion path. The result count stays fixed, giving people a stable anchor throughout.")
    },
    diagrams: [
      {
        id: "brief-to-event",
        title: text("图解一：从感受词到可观察事件", "Diagram 1: from feeling words to observable events"),
        alt: text("“自然一点”经过对象、状态、空间和时间四个问题，形成可实现的规格。", "“Make it feel natural” passes through object, state, space, and time questions to become a buildable spec."),
        viewBox: "0 0 960 540",
        nodes: [
          node("brief", "自然一点", "Make it natural", "感受词", "Feeling word", 55, 215, 180, 100, "warning"),
          node("object", "哪个对象", "Which object", "卡片、按钮、记录", "Card, button, record", 285, 215, 180, 100, "surface"),
          node("states", "哪些状态", "Which states", "前后与失败", "Before, after, failure", 515, 215, 180, 100, "accent"),
          node("spec", "动效规格", "Motion spec", "空间、时间、低动态", "Space, time, low motion", 745, 215, 180, 100, "success")
        ],
        connectors: [{ from: "brief", to: "object" }, { from: "object", to: "states" }, { from: "states", to: "spec" }]
      },
      {
        id: "state-and-beats",
        title: text("图解二：状态图与节拍表分工", "Diagram 2: state graph and beat plan have distinct jobs"),
        alt: text("状态图显示草稿、发布中、已发布和失败；节拍表显示输入确认、进行中和结果出现的时间。", "A state graph shows draft, publishing, published, and failed; a beat plan shows input acknowledgement, processing, and result timing."),
        viewBox: "0 0 960 540",
        nodes: [
          node("draft", "草稿", "Draft", "可编辑", "Editable", 90, 210, 150, 90, "surface"),
          node("publishing", "发布中", "Publishing", "锁定重复提交", "Prevent repeats", 335, 210, 170, 90, "accent"),
          node("published", "已发布", "Published", "结果落定", "Result settled", 690, 110, 170, 90, "success"),
          node("failed", "发布失败", "Publish failed", "保留重试", "Keep retry", 690, 330, 170, 90, "warning")
        ],
        connectors: [{ from: "draft", to: "publishing", label: text("0ms", "0ms") }, { from: "publishing", to: "published", label: text("请求完成", "Request complete") }, { from: "publishing", to: "failed", label: text("失败", "Failure") }]
      },
      {
        id: "handoff-asset",
        title: text("图解三：可交接规格的组成", "Diagram 3: parts of a handoff-ready spec"),
        alt: text("场景、状态、空间与时间、失败与低动态、验收五部分组成可交接的动效规格。", "Scenario, states, space and time, failure and low motion, and review form a handoff-ready motion spec."),
        viewBox: "0 0 960 540",
        nodes: [
          node("scenario", "场景与目标", "Scenario and goal", "为什么需要变化", "Why change is needed", 375, 60, 210, 85, "ink"),
          node("behavior", "状态与节拍", "States and beats", "允许的转换", "Allowed transitions", 665, 190, 210, 85, "accent"),
          node("space", "空间与时间", "Space and time", "来源、距离、关系", "Origin, distance, relation", 555, 375, 210, 85, "surface"),
          node("edges", "失败与低动态", "Failure and low motion", "中断与恢复", "Interrupt and recover", 195, 375, 210, 85, "warning"),
          node("review", "验收", "Review", "可观察断言", "Observable assertions", 85, 190, 210, 85, "success")
        ],
        connectors: [{ from: "scenario", to: "behavior" }, { from: "behavior", to: "space" }, { from: "space", to: "edges" }, { from: "edges", to: "review" }, { from: "review", to: "scenario" }]
      }
    ]
  },
  {
    guideId: "pack-or-primitive",
    standfirst: text(
      "Product Moment 和 Motion Primitive 是两种平级的设计入口。前者交付一段真实产品交互，后者交付一个可复用行为和它的边界。选择起点取决于问题的完整度、现有界面的约束和你需要保留多少设计控制力。",
      "Product Moments and Motion Primitives are two peer design entry points. The former delivers a real product interaction; the latter delivers a reusable behavior and its boundaries. Choose a starting point from the completeness of the problem, existing interface constraints, and how much design control you need to retain."
    ),
    sections: [
      {
        id: "two-levels",
        title: text("理解两种入口各自解决什么", "Understand what each entry point solves"),
        paragraphs: [
          text(
            "Motion Primitive 解决一个清楚的行为问题，例如淡入、滑入、交错、缓动、按压反馈或减弱动效。它适合团队已经知道对象、状态和界面结构，只需要为某个局部变化选择合适规则的时刻。Primitive 的价值在于边界清楚：它告诉你什么时候适合用、参数如何调整、会和哪些相近动作混淆、如何在低动态模式下保持意义。它让局部决定可被复用，也让设计系统拥有共同语言。",
            "A Motion Primitive solves one clear behavior problem: fade, slide, stagger, easing, press feedback, or reduced motion. It suits moments when a team already knows the object, state, and interface structure and needs a rule for one local change. Its value is clear boundaries: when it fits, how to tune parameters, which neighboring behaviors it can be confused with, and how low-motion mode retains meaning. It makes local decisions reusable and gives a design system a shared language."
          ),
          text(
            "Product Moment 解决一个完整场景，例如保存确认、删除确认、筛选结果、权限变更或审批请求。它把触发器、等待、结果、关联对象和恢复路径组织成一段可运行的交互。Moment 的价值在于让人先看到整体：保存不只是一条 press feedback，还是按钮、状态标记、内容状态和可能的失败提示共同构成的结果。它适合需求已经带有多个状态和多个参与对象，团队希望快速拥有一个经过推敲的骨架。",
            "A Product Moment solves a complete scenario: save confirmation, deletion confirmation, filtered results, permission change, or approval request. It organizes trigger, waiting, result, related objects, and recovery into one working interaction. Its value is seeing the whole: saving is more than press feedback; it is the joint result of button, status marker, content state, and possible failure guidance. It suits requirements with several states and actors when a team wants a considered skeleton quickly."
          )
        ]
      },
      {
        id: "choose",
        title: text("按问题完整度选择起点", "Choose the starting point by problem completeness"),
        paragraphs: [
          text(
            "先问问题能否用一句状态转换说清。若答案是“按钮变为已保存”“一张卡片从当前位置进入”“数字在原位更新”，从 Primitive 开始通常更有效，因为你需要的主要是一个局部规则。若答案包含“用户提交后等待服务端、页面顶部状态改变、列表新增记录、失败后能重试”，它已经是一个 Moment。此时从完整场景开始能帮助团队发现遗漏的状态，再回到其中的基础动效做细调。",
            "Ask whether the problem can be explained as one state transition. If the answer is “the button becomes Saved,” “a card enters from its current context,” or “a number updates in place,” start with a Primitive because the main need is a local rule. If the answer includes “after submission, wait for the server, change top-of-page status, add a list record, and allow retry after failure,” it is already a Moment. Starting from the complete scenario helps reveal missing states, then you can refine the primitives inside it."
          ),
          text(
            "再问是否已有可靠的产品结构。一个成熟的设置页可能已经有清楚的字段、保存栏和状态区，团队只需为错误或确认加上局部反馈；一个新工作流则往往缺少状态区、恢复路径和信息层级，直接选择 Pack 会更快得到可讨论的整体。选择 Pack 并不意味着照搬视觉。把它当作交互的状态模板，保留业务对象、品牌语言和现有导航结构；选择 Primitive 也不意味着只做一个孤立效果，它仍要回到页面里验证焦点、空间关系和可访问性。",
            "Then ask whether a reliable product structure already exists. A mature settings page may already have clear fields, save bar, and status area, so the team only needs local error or confirmation feedback. A new workflow often lacks status area, recovery path, and information hierarchy, making a Pack a faster whole to discuss. Choosing a Pack does not mean copying its visual style. Treat it as an interaction state template while retaining business objects, brand language, and existing navigation. Choosing a Primitive does not mean creating an isolated effect; it still returns to the page to validate focus, spatial relationship, and accessibility."
          )
        ]
      },
      {
        id: "adapt",
        title: text("从 Pack 拆出基础规则，再把规则装回界面", "Extract primitives from a Pack, then fit them back into the interface"),
        paragraphs: [
          text(
            "采用 Pack 的高效方式是先保留它的状态序列，再逐项检查其中的基础动作。以保存确认举例：输入反馈告诉用户点击已收到，状态文本切换告诉用户正在保存或已保存，短暂的加载循环只在等待期间出现，顶部状态标记和文档内容在完成时同步更新。团队可以保留这条因果链，同时把 press 的力度、文本切换的速度、状态标记的位置换成自己的设计系统。Pack 提供的是结构，Primitive 提供的是每个结构节点的精确控制。",
            "An efficient way to adopt a Pack is to retain its state sequence and inspect the primitive actions inside it. Take save confirmation: input feedback says the click was received, state-copy change says Saving or Saved, a brief loading loop appears only while waiting, and top status marker and document content update together on completion. A team can keep that causal chain while changing press strength, copy-switch speed, and status-marker position to fit its own design system. The Pack provides structure; Primitives provide precise control at each structural node."
          ),
          text(
            "反向使用也很重要。当团队从一个 Primitive 开始，例如只想给筛选后的卡片增加淡入，应该顺手问：结果数量是否也要更新？旧卡片如何离开？用户是否需要知道筛选条件仍然生效？如果回答引入了多个对象和连续状态，就值得打开 Filter results 这样的 Moment 作为检查表。这个来回过程让组件库和产品瞬间互相供给：基础规则避免 Pack 变成黑盒，真实场景避免 Primitive 漂在脱离业务的演示里。",
            "The reverse use matters as well. When a team starts from one Primitive, such as adding a fade to filtered cards, ask immediately: Should result count update too? How do old cards leave? Does the person need to know the filter remains active? If answers introduce several objects and sequential states, open a Moment such as Filter results as a checklist. This back-and-forth lets the libraries feed each other: basic rules keep Packs from becoming black boxes, while real scenarios keep Primitives from floating in a demo detached from product work."
          )
        ]
      },
      {
        id: "control",
        title: text("用控制范围决定定制深度", "Use control scope to decide customization depth"),
        paragraphs: [
          text(
            "定制可以分成三层。第一层是换内容：名称、颜色、文案、数据与品牌语气改变，交互状态保持；第二层是换规则：时长、曲线、出现顺序、撤销窗口与低动态策略改变；第三层是换结构：触发器、参与对象、状态图和恢复路径改变。第一层通常直接采用 Pack 最省力，第二层需要回到关联 Primitives 做精调，第三层更适合从场景规格重新开始。提前说清处在哪一层，能避免“只改一点”最后变成重写整套交互。",
            "Customization has three levels. First, change content: names, color, copy, data, and brand voice change while interaction states remain. Second, change rules: duration, curve, reveal order, undo window, and low-motion strategy change. Third, change structure: trigger, actors, state graph, and recovery path change. The first level usually adopts a Pack efficiently, the second returns to related Primitives for tuning, and the third is better served by a new scene spec. Naming the level early prevents “just a small change” from turning into a full interaction rewrite."
          ),
          text(
            "控制范围还包括技术边界。若产品只能使用原生 HTML、CSS 和少量 JavaScript，应选择能在这些约束内稳定运行的 Pack，并确认代码的状态源和事件绑定容易迁移；若组件本身是现有设计系统的一部分，Primitive 的 CSS 变量、参数范围和无障碍规则可能更适合直接嵌入。无论从哪里开始，最终都要保留可复制的实现说明、浏览器兼容性判断和 `prefers-reduced-motion` 路径。可移植性本身就是设计质量的一部分。",
            "Control scope also includes technical boundaries. When a product can use only native HTML, CSS, and a small amount of JavaScript, choose a Pack that runs reliably within those constraints and confirm its state source and event bindings migrate cleanly. When a component belongs to an existing design system, a Primitive’s CSS variables, parameter ranges, and accessibility rules may embed more directly. Whatever the starting point, retain copy-ready implementation guidance, browser-compatibility judgment, and a `prefers-reduced-motion` path. Portability itself is part of design quality."
          )
        ]
      },
      {
        id: "workflow",
        title: text("建立两条目录之间的工作流", "Build a workflow between the two directories"),
        paragraphs: [
          text(
            "实际工作中可以采用一个简单循环：先用一句话描述产品场景；判断它是局部行为还是完整流程；从对应目录打开一个参考；把参考中的状态、参数和限制写入当前项目；在真实界面里预览；把经过验证的改动回馈为新的 Pack 候选或 Primitive 说明。这个循环让内容库持续贴近真实问题，也避免团队把目录当成一次性灵感板。每次复用都留下新的判断证据。",
            "In practice, use a simple loop: describe the product scene in one sentence; decide whether it is a local behavior or a complete flow; open a reference from the matching directory; bring its states, parameters, and boundaries into the current project; preview in the real interface; feed the verified change back as a Pack candidate or Primitive note. The loop keeps the library close to real problems and prevents it from becoming a one-time inspiration board. Every reuse leaves new evidence for future judgment."
          ),
          text(
            "评审时同时看两件事：这段交互是否帮助用户理解当前任务，这条基础规则是否还能在别处复用。前一个问题保护产品语义，后一个问题保护系统质量。若一个 Pack 被多次拆出同样的基础动作，那个动作应当获得更完整的 Primitive 文档；若多个 Primitive 总是被同一种业务场景组合，那个场景应当晋升为 Pack。这样网站的信息架构会随真实使用演化，用户也会逐渐看到一套既有审美又能落地的动效语言。",
            "During review, look at two things together: Does this interaction help people understand the current task, and can this basic rule be reused elsewhere? The first protects product semantics; the second protects system quality. If a Pack repeatedly yields the same basic action, that action deserves fuller Primitive documentation. If several Primitives repeatedly combine in one business scenario, that scenario deserves promotion to a Pack. The site’s information architecture then evolves with real use, and people gradually encounter a motion language with both taste and practical delivery."
          )
        ]
      }
    ],
    checklistTitle: text("选择入口清单", "Entry-point selection checklist"),
    checklist: [
      { id: "scope", label: text("用一句话判断问题范围", "Use one sentence to judge problem scope"), detail: text("单一状态变化优先看 Primitive；多状态流程优先看 Pack。", "A single state change points to a Primitive; a multi-state flow points to a Pack.") },
      { id: "structure", label: text("检查现有页面是否已有可靠结构", "Check whether the page already has reliable structure"), detail: text("已有状态区和导航时更容易嵌入基础规则。", "Existing status areas and navigation make a Primitive easier to embed.") },
      { id: "custom", label: text("明确内容、规则或结构哪一层需要改", "Name whether content, rules, or structure changes"), detail: text("不同层级对应不同的复用起点与改造成本。", "Each level maps to a different reuse point and adaptation cost.") },
      { id: "bridge", label: text("从 Pack 追溯关联基础动效", "Trace a Pack back to its related Primitives"), detail: text("保留整体状态链，同时获得局部参数控制。", "Keep the overall state chain while gaining local parameter control.") },
      { id: "contribute", label: text("把重复出现的真实模式回馈目录", "Feed recurring real patterns back into the directories"), detail: text("反复组合的 Primitive 可形成 Pack，反复拆出的动作可扩展 Primitive。", "Repeated Primitive combinations can form a Pack; repeatedly extracted actions can expand a Primitive.") }
    ],
    caseStudy: {
      title: text("案例：筛选结果该从 Pack 还是 Primitive 开始", "Case: should filtered results start from a Pack or a Primitive?"),
      context: text("团队最初只想让筛选后的卡片淡入，随后发现用户还要追踪筛选条件、命中数量、旧内容离开和新内容到达。", "The team initially wants filtered cards to fade in, then discovers people also need to track criteria, result count, old content leaving, and new content arriving."),
      code: `Scenario: status filter changes in a resource library\nStart: Filter results Pack\nKeep: active filter, result count, stable list container, empty state\nTune primitives: crossfade for replacement; stagger for first three new rows; duration 160–220ms\nReduced motion: update count and rows in place, retain live-region result announcement`,
      explanation: text("需求包含多个对象和连续状态，因此从 Filter results Pack 开始更完整。团队随后只调整其中的 crossfade、stagger 和 duration，而无需重新发明筛选语义。", "The requirement contains several objects and sequential states, so Filter results Pack provides the more complete start. The team then tunes crossfade, stagger, and duration without reinventing filtering semantics.")
    },
    diagrams: [
      {
        id: "two-entry-points",
        title: text("图解一：两条平级入口", "Diagram 1: two peer entry points"),
        alt: text("产品场景可以进入 Product Moment 或 Motion Primitive，两条路径都回到真实界面验证。", "A product scene can enter through a Product Moment or Motion Primitive; both paths return to validation in the real interface."),
        viewBox: "0 0 960 540",
        nodes: [
          node("scene", "产品场景", "Product scene", "一句真实需求", "One real request", 365, 55, 230, 90, "ink"),
          node("pack", "Product Moment", "Product Moment", "完整状态流程", "Complete state flow", 120, 230, 260, 105, "accent"),
          node("primitive", "Motion Primitive", "Motion Primitive", "一个行为与边界", "One behavior and boundary", 580, 230, 260, 105, "surface"),
          node("interface", "真实界面验证", "Validate in product", "任务、性能、低动态", "Task, speed, low motion", 365, 415, 230, 80, "success")
        ],
        connectors: [{ from: "scene", to: "pack" }, { from: "scene", to: "primitive" }, { from: "pack", to: "interface" }, { from: "primitive", to: "interface" }]
      },
      {
        id: "selection-matrix",
        title: text("图解二：按问题完整度选择", "Diagram 2: choose by problem completeness"),
        alt: text("单一局部行为指向 Motion Primitive，多对象多状态流程指向 Product Moment。", "One local behavior points to a Motion Primitive; a multi-actor, multi-state flow points to a Product Moment."),
        viewBox: "0 0 960 540",
        nodes: [
          node("local", "单一对象", "One object", "按钮、卡片、数字", "Button, card, number", 85, 100, 250, 95, "surface"),
          node("primitive", "Motion Primitive", "Motion Primitive", "局部规则", "Local rule", 85, 345, 250, 95, "accent"),
          node("flow", "多个对象与状态", "Multiple actors and states", "等待、结果、恢复", "Wait, result, recovery", 625, 100, 250, 95, "ink"),
          node("pack", "Product Moment", "Product Moment", "完整交互骨架", "Complete interaction skeleton", 625, 345, 250, 95, "success")
        ],
        connectors: [{ from: "local", to: "primitive", label: text("局部变化", "Local change") }, { from: "flow", to: "pack", label: text("完整流程", "Complete flow") }]
      },
      {
        id: "feedback-loop",
        title: text("图解三：内容库随真实使用演化", "Diagram 3: the library evolves with real use"),
        alt: text("真实项目验证后，重复组合的基础动效升级为产品瞬间，重复拆出的动作升级为基础动效文档。", "After real-project validation, repeated primitive combinations become Product Moments and repeated extracted actions gain Primitive documentation."),
        viewBox: "0 0 960 540",
        nodes: [
          node("project", "真实项目", "Real project", "场景与约束", "Scene and constraints", 385, 55, 190, 90, "ink"),
          node("moment", "产品瞬间", "Product Moment", "验证完整流程", "Validate complete flow", 650, 220, 190, 90, "success"),
          node("primitive", "基础动效", "Motion Primitive", "提炼局部规则", "Extract local rule", 385, 385, 190, 90, "accent"),
          node("evidence", "复用证据", "Reuse evidence", "反馈与评审", "Feedback and review", 120, 220, 190, 90, "surface")
        ],
        connectors: [{ from: "project", to: "moment" }, { from: "moment", to: "primitive" }, { from: "primitive", to: "evidence" }, { from: "evidence", to: "project" }]
      }
    ]
  }
] as const satisfies readonly SeoGuideLongArticle[];

export const seoGuideArticlesBById = new Map(
  seoGuideArticlesB.map((article) => [article.guideId, article])
);
