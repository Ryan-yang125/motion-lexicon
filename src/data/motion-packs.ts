import { canonicalMotionCatalog } from "./motion-catalog";
import type { LocalizedText } from "./types";

/**
 * Motion Lexicon V2.0 keeps one collection around recognisable product moments.
 * A pack owns the complete portable implementation a visitor can preview,
 * copy, and adapt inside their own interface.
 */
export type MotionPackGroupId = "feedback" | "choice" | "change" | "workflow";

export type MotionPackKind =
  | "save-confirmation"
  | "publish-release"
  | "share-link"
  | "card-selection"
  | "workspace-switch"
  | "template-choice"
  | "layer-insertion"
  | "archive-undo"
  | "filter-results"
  | "inline-validation"
  | "command-menu"
  | "details-disclosure"
  | "notification-triage"
  | "progress-steps"
  | "member-invite"
  | "media-scrub"
  | "upload-complete"
  | "sync-recovery"
  | "delete-confirmation"
  | "assignee-picker"
  | "permission-change"
  | "search-suggestions"
  | "kanban-move"
  | "cart-update"
  | "comment-reply"
  | "approval-request"
  | "checkout-payment"
  | "scheduled-publish";

export type MotionPackGroup = {
  id: MotionPackGroupId;
  name: LocalizedText;
  description: LocalizedText;
};

export type MotionPackSource = {
  html: string;
  css: string;
  js: string;
};

/**
 * The contribution a canonical motion primitive makes inside a product moment.
 * Packs can carry several roles, which keeps the relationship deliberately
 * many-to-many while preserving equal standing for both collections.
 */
export type MotionFoundationRole =
  | "input-feedback"
  | "state-change"
  | "entrance"
  | "exit-recovery"
  | "spatial-continuity"
  | "sequence"
  | "disclosure"
  | "continuous-input"
  | "timing"
  | "motion-preference";

export type MotionPackFoundation = {
  foundationId: string;
  role: MotionFoundationRole;
  roleLabel: LocalizedText;
  note: LocalizedText;
};

export type MotionPackFoundationLink = {
  pack: MotionPack;
  foundation: MotionPackFoundation;
};

export type MotionPack = {
  id: MotionPackKind;
  kind: MotionPackKind;
  groupId: MotionPackGroupId;
  name: LocalizedText;
  shortDescription: LocalizedText;
  scene: LocalizedText;
  useCase: LocalizedText;
  prompt: LocalizedText;
  guidance: {
    trigger: LocalizedText;
    outcome: LocalizedText;
    reducedMotion: LocalizedText;
  };
  keywords: string[];
  timing: string;
  stateLabels: readonly LocalizedText[];
  foundations: readonly MotionPackFoundation[];
  source: MotionPackSource;
};

type MotionPackCore = Omit<MotionPack, "foundations" | "stateLabels">;

const text = (zh: string, en: string): LocalizedText => ({ zh, en });

const foundationRoleLabels: Readonly<Record<MotionFoundationRole, LocalizedText>> = {
  "input-feedback": text("输入反馈", "Input feedback"),
  "state-change": text("状态变化", "State change"),
  entrance: text("进入", "Entrance"),
  "exit-recovery": text("离开与恢复", "Exit and recovery"),
  "spatial-continuity": text("空间连续性", "Spatial continuity"),
  sequence: text("顺序编排", "Sequencing"),
  disclosure: text("展开与收起", "Disclosure"),
  "continuous-input": text("连续输入", "Continuous input"),
  timing: text("节奏与时长", "Timing"),
  "motion-preference": text("减弱动效", "Reduced motion")
};

const foundation = (
  foundationId: string,
  role: MotionFoundationRole,
  zh: string,
  en: string
): MotionPackFoundation => ({
  foundationId,
  role,
  roleLabel: foundationRoleLabels[role],
  note: text(zh, en)
});

const states = (zh: readonly string[], en: readonly string[]): readonly LocalizedText[] =>
  zh.map((label, index) => text(label, en[index] ?? label));

const stateLabelsByMotionPackId: Readonly<Record<MotionPackKind, readonly LocalizedText[]>> = {
  "save-confirmation": states(["编辑中", "保存中", "已保存"], ["Editing", "Saving", "Saved"]),
  "publish-release": states(["草稿", "发布中", "已发布"], ["Draft", "Publishing", "Published"]),
  "share-link": states(["准备分享", "链接已复制", "已发送"], ["Ready", "Link copied", "Sent"]),
  "card-selection": states(["未选中", "聚焦", "已选中"], ["Idle", "Focused", "Selected"]),
  "workspace-switch": states(["当前工作区", "切换中", "已切换"], ["Current", "Switching", "Switched"]),
  "template-choice": states(["浏览模板", "选择模板", "已应用"], ["Browsing", "Choosing", "Applied"]),
  "layer-insertion": states(["当前图层", "插入中", "已加入"], ["Current layer", "Inserting", "Added"]),
  "archive-undo": states(["可见", "已归档", "已恢复"], ["Visible", "Archived", "Restored"]),
  "filter-results": states(["全部", "筛选中", "结果已更新"], ["All", "Filtering", "Results updated"]),
  "inline-validation": states(["输入中", "校验中", "可继续"], ["Typing", "Validating", "Ready"]),
  "command-menu": states(["唤起", "浏览命令", "已执行"], ["Open", "Browsing", "Run"]),
  "details-disclosure": states(["收起", "展开", "已查看"], ["Closed", "Open", "Read"]),
  "notification-triage": states(["未处理", "已归档", "下一项"], ["Unread", "Archived", "Next"]),
  "progress-steps": states(["开始", "进行中", "完成"], ["Start", "In progress", "Complete"]),
  "member-invite": states(["填写邀请", "已发送", "已加入"], ["Composing", "Sent", "Joined"]),
  "media-scrub": states(["播放", "拖动位置", "继续播放"], ["Playing", "Scrubbing", "Playing"]),
  "upload-complete": states(["待上传", "上传中", "已完成"], ["Ready", "Uploading", "Complete"]),
  "sync-recovery": states(["离线", "同步中", "已恢复"], ["Offline", "Syncing", "Recovered"]),
  "delete-confirmation": states(["待确认", "删除中", "已移除"], ["Confirm", "Deleting", "Removed"]),
  "assignee-picker": states(["未分配", "选择成员", "已分配"], ["Unassigned", "Choosing", "Assigned"]),
  "permission-change": states(["查看权限", "保存中", "已更新"], ["Reviewing", "Saving", "Updated"]),
  "search-suggestions": states(["输入", "候选出现", "已打开"], ["Typing", "Suggestions", "Opened"]),
  "kanban-move": states(["原列", "拖动", "已移动"], ["Source", "Dragging", "Moved"]),
  "cart-update": states(["当前购物车", "数量更新", "金额已更新"], ["Cart", "Updating", "Total updated"]),
  "comment-reply": states(["撰写", "发送中", "已回复"], ["Composing", "Sending", "Replied"]),
  "approval-request": states(["草稿", "发送中", "等待审批"], ["Draft", "Sending", "Awaiting approval"]),
  "checkout-payment": states(["订单确认", "付款中", "已完成"], ["Review", "Paying", "Complete"]),
  "scheduled-publish": states(["草稿", "已安排", "已发布"], ["Draft", "Scheduled", "Published"])
};

const source = (html: string, css: string, js: string): MotionPackSource => ({
  html: html.trim(),
  css: `${css.trim()}

@media (prefers-reduced-motion: reduce) {
  [data-motion-pack] *,
  [data-motion-pack] *::before,
  [data-motion-pack] *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}`,
  js: js.trim()
});

export const motionPackGroups: readonly MotionPackGroup[] = [
  {
    id: "feedback",
    name: text("完成反馈", "Feedback"),
    description: text("让一次已发生的操作被立刻看见。", "Make a completed action immediately legible.")
  },
  {
    id: "choice",
    name: text("选择决策", "Choice"),
    description: text("让焦点、偏好和下一步保持清楚。", "Keep focus, preference, and the next step clear.")
  },
  {
    id: "change",
    name: text("内容变化", "Change"),
    description: text("让新增、移除和筛选保留空间关系。", "Preserve spatial context through additions, removals, and filters.")
  },
  {
    id: "workflow",
    name: text("工作流表面", "Workflow"),
    description: text("让连续任务的状态与进度始终可读。", "Keep state and progress readable across multi-step work.")
  }
];

const motionPackCores: MotionPackCore[] = [
  {
    id: "save-confirmation",
    kind: "save-confirmation",
    groupId: "feedback",
    name: text("保存确认", "Save confirmation"),
    shortDescription: text("一次提交后，按钮、状态标记和文档状态一起抵达结果。", "A submission lands across the action, status marker, and document state together."),
    scene: text("产品更新编辑器中的一条已保存状态。", "A saved state inside a product-update editor."),
    useCase: text("编辑器、设置页、表单提交和草稿保存。", "Editors, settings, form submission, and draft saving."),
    prompt: text(
      "实现一个保存确认：点击“保存更新”后立即给出轻微按压反馈，按钮在 180ms 内变为“已保存”，顶部状态标记同步切换。使用 transform 和 opacity，并提供减弱动效版本。",
      "Build a save confirmation: pressing Save update gives immediate tactile feedback, changes to Saved within 180ms, and updates the status marker in sync. Use transform and opacity with a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("点击保存后立刻给出轻微按压反馈。", "Give a slight press response immediately after Save is clicked."),
      outcome: text("按钮和顶部状态标记在同一节奏内变为已保存。", "The action and top status marker reach Saved in the same cadence."),
      reducedMotion: text("保留状态文本与颜色切换，移除旋转与位移。", "Keep text and color state changes while removing spin and travel.")
    },
    keywords: ["保存", "已保存", "提交", "完成", "按钮反馈", "草稿", "save", "saved", "submit", "draft"],
    timing: "180ms · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-save-confirmation" data-motion-pack="save-confirmation" aria-label="Save update">
  <div class="ml-save-card" data-state="draft">
    <div class="ml-save-topline"><span>Release notes</span><span class="ml-save-dot"></span></div>
    <div class="ml-save-copy"><strong>New motion defaults</strong><span>Ready for review</span></div>
    <div class="ml-save-footer">
      <span class="ml-save-status" data-save-status role="status">Draft changes</span>
      <button type="button" data-save-action><span aria-hidden="true">✓</span><span data-save-label>Save update</span></button>
    </div>
  </div>
</section>`,
      String.raw`.ml-save-confirmation { color: #292929; font: 500 14px/1.35 Inter, system-ui, sans-serif; }
.ml-save-card { width: min(100%, 380px); margin: 0 auto; padding: 18px; border: 1px solid #dededc; border-radius: 16px; background: #fff; box-shadow: 0 14px 30px rgb(25 25 25 / 7%); }
.ml-save-topline, .ml-save-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; }.ml-save-topline { color: #5d5d5d; font-size: 12px; }
.ml-save-dot { width: 8px; height: 8px; border-radius: 999px; background: #e3a33a; transition: background 180ms ease; }.ml-save-copy { display: grid; gap: 4px; margin: 28px 0; }.ml-save-copy span { color: #9e9e9e; font-size: 13px; }
.ml-save-status { color: #9e9e9e; font-size: 12px; transition: color 180ms ease, transform 180ms cubic-bezier(.23,1,.32,1); }.ml-save-confirmation button { display: inline-flex; min-height: 36px; align-items: center; gap: 7px; border: 0; border-radius: 999px; padding: 0 14px; color: #fff; background: #292929; cursor: pointer; font: inherit; transition: transform 120ms ease, background 180ms ease; }.ml-save-confirmation button:active { transform: scale(.96); }.ml-save-confirmation button:disabled { cursor: wait; }
.ml-save-card[data-state="saving"] button { background: #5d5d5d; }.ml-save-card[data-state="saved"] .ml-save-dot { background: #2d8c5f; }.ml-save-card[data-state="saved"] .ml-save-status { color: #2d8c5f; transform: translateY(-1px); }.ml-save-card[data-state="saved"] button { background: #2d8c5f; }.ml-save-card[data-state="saving"] button > span:first-child { animation: ml-save-spin 700ms linear infinite; } @keyframes ml-save-spin { to { transform: rotate(1turn); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="save-confirmation"]');
  if (!root) return;
  const card = root.querySelector('.ml-save-card'); const button = root.querySelector('[data-save-action]');
  const label = root.querySelector('[data-save-label]'); const status = root.querySelector('[data-save-status]');
  button.addEventListener('click', () => {
    if (card.dataset.state === 'saving') return;
    card.dataset.state = 'saving'; button.disabled = true; label.textContent = 'Saving'; status.textContent = 'Saving changes';
    window.setTimeout(() => { card.dataset.state = 'saved'; button.disabled = false; label.textContent = 'Saved'; status.textContent = 'Saved just now'; }, 540);
  });
})();`
    )
  },
  {
    id: "publish-release",
    kind: "publish-release",
    groupId: "feedback",
    name: text("发布版本", "Publish release"),
    shortDescription: text("把一项准备完成的更新，收束成一次有明确落点的发布。", "Resolve a ready update into a release with a clear landing point."),
    scene: text("发布产品更新时的版本面板。", "A version panel while publishing a product update."),
    useCase: text("发布文章、上线版本、提交审批和发送公告。", "Publishing articles, shipping releases, submitting approvals, and sending announcements."),
    prompt: text(
      "实现一个版本发布动作：用户点击“发布版本”后，按钮短暂显示进行中，发布卡片变为已上线状态，并在时间线里留下“刚刚发布”的记录。动作集中在 240ms 内完成。",
      "Build a release publish action: after Publish release, briefly show progress, turn the release card live, and leave a Just published entry in the timeline. Complete the motion within 240ms."
    ),
    guidance: {
      trigger: text("点击发布后先明确动作已被接收。", "Make it clear that Publish has been received before the release lands."),
      outcome: text("当前版本状态与时间线记录连续更新。", "Update the current version state and timeline record as one sequence."),
      reducedMotion: text("保留状态和记录的内容变化，取消进入位移。", "Keep state and record changes while removing entrance travel.")
    },
    keywords: ["发布", "上线", "版本", "发布完成", "时间线", "公告", "publish", "release", "ship", "live"],
    timing: "240ms + 60ms follow-through · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-publish-release" data-motion-pack="publish-release" aria-label="Publish release">
  <div class="ml-release-card" data-state="ready">
    <div class="ml-release-head"><span class="ml-release-version">v1.1</span><span class="ml-release-state" data-release-state>Ready</span></div>
    <strong>Quiet Product Motion</strong><p>16 product moments are ready to ship.</p>
    <button type="button" data-publish-action><span data-publish-label>Publish release</span><span aria-hidden="true">→</span></button>
    <ol class="ml-release-history" data-release-history><li><i></i><span>Notes approved</span></li></ol>
  </div>
</section>`,
      String.raw`.ml-publish-release { color: #292929; font: 500 14px/1.4 Inter, system-ui, sans-serif; }.ml-release-card { width: min(100%, 400px); margin: 0 auto; padding: 20px; border: 1px solid #dededc; border-radius: 16px; background: linear-gradient(145deg,#fff,#fafaf8); box-shadow: 0 16px 34px rgb(25 25 25 / 7%); }.ml-release-head, .ml-release-history li { display: flex; align-items: center; justify-content: space-between; gap: 12px; }.ml-release-version { padding: 4px 8px; border-radius: 999px; color: #5d5d5d; background: #f0f0ee; font: 600 12px ui-monospace, monospace; }.ml-release-state { color: #9e9e9e; font-size: 12px; }.ml-release-card > strong { display: block; margin-top: 22px; font-size: 17px; letter-spacing: -.2px; }.ml-release-card > p { margin: 5px 0 18px; color: #5d5d5d; font-size: 13px; }.ml-publish-release button { display: inline-flex; width: 100%; min-height: 40px; align-items: center; justify-content: space-between; border: 0; border-radius: 999px; padding: 0 15px; color: #fff; background: #292929; cursor: pointer; font: inherit; transition: transform 120ms ease, background 180ms ease; }.ml-publish-release button:active { transform: scale(.98); }.ml-release-history { display: grid; gap: 9px; margin: 18px 0 0; padding: 0; list-style: none; color: #9e9e9e; font-size: 12px; }.ml-release-history li { justify-content: flex-start; }.ml-release-history i { width: 7px; height: 7px; border-radius: 99px; background: #c8c8c5; }.ml-release-history li.is-new { animation: ml-release-enter 240ms cubic-bezier(.16,1,.3,1) both; color: #2d8c5f; }.ml-release-history li.is-new i { background: #2d8c5f; }.ml-release-card[data-state="live"] .ml-release-state { color: #2d8c5f; }.ml-release-card[data-state="live"] button { background: #2d8c5f; } @keyframes ml-release-enter { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="publish-release"]');
  if (!root) return;
  const card = root.querySelector('.ml-release-card'); const button = root.querySelector('[data-publish-action]');
  const state = root.querySelector('[data-release-state]'); const label = root.querySelector('[data-publish-label]'); const history = root.querySelector('[data-release-history]');
  button.addEventListener('click', () => {
    if (card.dataset.state !== 'ready') return;
    card.dataset.state = 'publishing'; button.disabled = true; label.textContent = 'Publishing'; state.textContent = 'Preparing release';
    window.setTimeout(() => { card.dataset.state = 'live'; button.disabled = false; label.textContent = 'Release is live'; state.textContent = 'Live'; history.insertAdjacentHTML('beforeend', '<li class="is-new"><i></i><span>Published just now</span></li>'); }, 620);
  });
})();`
    )
  },
  {
    id: "share-link",
    kind: "share-link",
    groupId: "feedback",
    name: text("复制分享链接", "Copy share link"),
    shortDescription: text("复制成功通过按钮与短提示共同确认，提示轻量离开。", "Copy success is confirmed through the action and a light, temporary cue."),
    scene: text("项目设置中的公开预览链接。", "A public preview link in project settings."),
    useCase: text("分享链接、邀请链接、嵌入代码和 API Token。", "Share links, invitation links, embed snippets, and API tokens."),
    prompt: text(
      "实现一个复制链接反馈：点击后复制链接，按钮从链接图标变成对勾，旁边出现一条短提示并在约 1.6 秒后自然恢复。保持按钮宽度稳定。",
      "Build copy-link feedback: copy the link on click, morph the link icon to a check, show a short nearby cue, and restore naturally after about 1.6 seconds. Keep the button width stable."
    ),
    guidance: {
      trigger: text("复制后在原按钮上显示对勾。", "Show a check on the original action after copying."),
      outcome: text("一条短提示确认结果，再恢复为可复制。", "A short cue confirms the result, then returns the control to copy-ready."),
      reducedMotion: text("保留文案与颜色变化，提示直接出现与消失。", "Keep text and color changes; let the cue appear and leave directly.")
    },
    keywords: ["复制", "链接", "分享", "已复制", "剪贴板", "Token", "copy", "link", "share", "copied"],
    timing: "160ms + 1.6s confirmation window · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-share-link" data-motion-pack="share-link" aria-label="Share link">
  <div class="ml-share-card"><span class="ml-share-label">Public preview</span><div class="ml-share-row"><code>motion.site/p/quiet-v1</code><button type="button" data-copy-link aria-live="polite"><span data-copy-icon aria-hidden="true">⧉</span><span data-copy-label>Copy link</span></button></div><span class="ml-share-toast" role="status">Link copied</span></div>
</section>`,
      String.raw`.ml-share-link { color: #292929; font: 500 14px/1.35 Inter, system-ui, sans-serif; }.ml-share-card { position: relative; width: min(100%, 390px); margin: 0 auto; padding: 18px; border: 1px solid #dededc; border-radius: 16px; background: #fff; }.ml-share-label { color: #5d5d5d; font-size: 12px; }.ml-share-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; }.ml-share-row code { overflow: hidden; color: #292929; text-overflow: ellipsis; white-space: nowrap; font: 13px ui-monospace, SFMono-Regular, monospace; }.ml-share-link button { display: inline-flex; flex: 0 0 auto; min-height: 34px; min-width: 112px; align-items: center; justify-content: center; gap: 7px; border: 1px solid #d5d5d3; border-radius: 999px; padding: 0 12px; color: #292929; background: #fff; cursor: pointer; font: inherit; transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 120ms ease; }.ml-share-link button:active { transform: scale(.97); }.ml-share-link[data-copied="true"] button { border-color: #cce5d6; color: #206848; background: #f0faf4; }.ml-share-toast { position: absolute; right: 18px; bottom: -30px; padding: 5px 8px; border-radius: 8px; color: #fff; background: #292929; font-size: 12px; opacity: 0; pointer-events: none; transform: translateY(-4px); transition: opacity 160ms ease, transform 160ms cubic-bezier(.23,1,.32,1); }.ml-share-link[data-copied="true"] .ml-share-toast { opacity: 1; transform: translateY(0); }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="share-link"]');
  if (!root) return;
  const button = root.querySelector('[data-copy-link]'); const icon = root.querySelector('[data-copy-icon]'); const label = root.querySelector('[data-copy-label]'); let restoreTimer;
  button.addEventListener('click', async () => {
    try { await navigator.clipboard?.writeText('https://motion.site/p/quiet-v1'); } catch (_) { /* the visual result remains useful */ }
    window.clearTimeout(restoreTimer); root.dataset.copied = 'true'; icon.textContent = '✓'; label.textContent = 'Copied';
    restoreTimer = window.setTimeout(() => { delete root.dataset.copied; icon.textContent = '⧉'; label.textContent = 'Copy link'; }, 1600);
  });
})();`
    )
  },
  {
    id: "card-selection",
    kind: "card-selection",
    groupId: "choice",
    name: text("卡片选择", "Card selection"),
    shortDescription: text("用户选中一个布局后，边界、勾选和选择摘要同步表达结果。", "After selecting a layout, its boundary, checkmark, and selection summary express the result together."),
    scene: text("新建项目时选择一个内容布局。", "Choosing a content layout for a new project."),
    useCase: text("选择版式、套餐、封面、主题或工作方式。", "Choosing layouts, plans, covers, themes, or ways of working."),
    prompt: text(
      "实现一个三选一卡片选择器：点击任一卡片后，将选中态移到新卡片，勾选出现，底部摘要切换为当前选择。位移只表达焦点移动，保持布局稳定。",
      "Build a three-option card selector: clicking a card moves selection to it, reveals a checkmark, and updates the current-choice summary. Use travel only to communicate focus while keeping layout stable."
    ),
    guidance: {
      trigger: text("点击任一选项后，把焦点移到被选卡片。", "Move focus to the chosen card after any option is clicked."),
      outcome: text("边界、勾选与选择摘要同步表达当前方向。", "Boundary, checkmark, and summary show the active direction together."),
      reducedMotion: text("直接更新选中边界和勾选，不使用位移。", "Update the selection boundary and check directly without travel.")
    },
    keywords: ["卡片选择", "单选", "布局", "选中态", "套餐", "模板", "card selection", "radio", "layout", "plan"],
    timing: "200ms · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-card-selection" data-motion-pack="card-selection" aria-label="Choose a layout">
  <div class="ml-layout-options" role="radiogroup" aria-label="Layout">
    <button type="button" role="radio" aria-checked="true" data-layout="Focus"><span class="ml-layout-preview focus"><i></i><i></i></span><span>Focus</span><b>✓</b></button>
    <button type="button" role="radio" aria-checked="false" data-layout="Split"><span class="ml-layout-preview split"><i></i><i></i></span><span>Split</span><b>✓</b></button>
    <button type="button" role="radio" aria-checked="false" data-layout="Stack"><span class="ml-layout-preview stack"><i></i><i></i></span><span>Stack</span><b>✓</b></button>
  </div><p class="ml-layout-summary" aria-live="polite">Selected <strong data-layout-summary>Focus</strong><span aria-hidden="true">→</span></p>
</section>`,
      String.raw`.ml-card-selection { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-layout-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; }.ml-layout-options button { display: grid; min-height: 128px; gap: 10px; align-content: space-between; border: 1px solid #dededc; border-radius: 14px; padding: 11px; color: #5d5d5d; background: #fff; cursor: pointer; font: inherit; text-align: left; transition: border-color 200ms ease, box-shadow 200ms ease, color 200ms ease, transform 200ms cubic-bezier(.23,1,.32,1); }.ml-layout-options button:hover { transform: translateY(-2px); }.ml-layout-options button[aria-checked="true"] { border-color: #292929; color: #292929; box-shadow: 0 8px 18px rgb(25 25 25 / 8%); }.ml-layout-options b { justify-self: end; display: grid; width: 19px; height: 19px; place-items: center; border-radius: 999px; color: #fff; background: #292929; font-size: 11px; opacity: 0; transform: scale(.72); transition: opacity 160ms ease, transform 160ms cubic-bezier(.23,1,.32,1); }.ml-layout-options button[aria-checked="true"] b { opacity: 1; transform: scale(1); }.ml-layout-preview { display: grid; min-height: 64px; gap: 5px; padding: 7px; border-radius: 8px; background: #f2f2f0; }.ml-layout-preview i { display: block; border-radius: 3px; background: #c5c5c2; }.ml-layout-preview.focus { grid-template-columns: 1fr; }.ml-layout-preview.focus i:first-child { min-height: 37px; }.ml-layout-preview.split { grid-template-columns: 1fr 1fr; }.ml-layout-preview.stack { grid-template-rows: 1fr 1fr; }.ml-layout-summary { display: flex; align-items: center; justify-content: space-between; margin: 11px 0 0; padding: 11px 12px; border-radius: 10px; color: #5d5d5d; background: #f4f4f2; }.ml-layout-summary strong { color: #292929; } @media (max-width: 420px) { .ml-layout-options { gap: 6px; }.ml-layout-options button { min-height: 112px; padding: 8px; } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="card-selection"]');
  if (!root) return;
  const options = [...root.querySelectorAll('[role="radio"]')]; const summary = root.querySelector('[data-layout-summary]');
  options.forEach((option) => option.addEventListener('click', () => { options.forEach((item) => item.setAttribute('aria-checked', String(item === option))); summary.textContent = option.dataset.layout; }));
})();`
    )
  },
  {
    id: "workspace-switch",
    kind: "workspace-switch",
    groupId: "choice",
    name: text("工作区切换", "Workspace switch"),
    shortDescription: text("切换上下文时，让活动标签与内容表面保持一条连续的焦点路径。", "When switching context, keep the active tab and content surface on one continuous focus path."),
    scene: text("项目工作区里的设计、撰写和评审视图。", "Design, writing, and review views inside a project workspace."),
    useCase: text("工作区、项目模块、文档视图和详情子页面。", "Workspaces, project modules, document views, and nested detail pages."),
    prompt: text(
      "实现一个工作区切换器：点击标签后，活动底板平滑移到新标签，内容区在极短的淡入和上移里替换。保留键盘 tab 语义与减弱动效版本。",
      "Build a workspace switcher: clicking a tab moves the active pill to it, while the content surface swaps with a very short fade and upward settle. Keep tab semantics and a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("标签本身承担切换的起点与焦点位置。", "The tab itself carries both the switch origin and focus location."),
      outcome: text("活动底板先到达，内容随后在相同上下文中换页。", "The active pill lands first, then content changes within the same context."),
      reducedMotion: text("直接更新标签与内容，保留键盘焦点。", "Update tab and content directly while retaining keyboard focus.")
    },
    keywords: ["工作区", "标签", "切换", "视图", "导航", "workspace", "tabs", "switch", "view", "navigation"],
    timing: "180ms tab · 160ms content · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-workspace-switch" data-motion-pack="workspace-switch" data-active="design" aria-label="Workspace views">
  <div class="ml-workspace-tabs" role="tablist" aria-label="Workspace">
    <button type="button" role="tab" aria-selected="true" data-workspace-tab="design">Design</button>
    <button type="button" role="tab" aria-selected="false" data-workspace-tab="write">Writing</button>
    <button type="button" role="tab" aria-selected="false" data-workspace-tab="review">Review</button>
  </div>
  <div class="ml-workspace-surface" aria-live="polite"><span data-workspace-eyebrow>CANVAS</span><strong data-workspace-title>Homepage direction</strong><p data-workspace-copy>Three reviewed frames are ready to share.</p><span class="ml-workspace-count" data-workspace-count>03</span></div>
</section>`,
      String.raw`.ml-workspace-switch { width: min(100%, 410px); margin: 0 auto; color: #292929; font: 500 13px/1.4 Inter, system-ui, sans-serif; }.ml-workspace-tabs { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; padding: 3px; border: 1px solid #dededc; border-radius: 10px; background: #f4f4f2; }.ml-workspace-tabs::before { position: absolute; inset: 3px auto 3px 3px; width: calc((100% - 6px) / 3); border-radius: 7px; background: #fff; box-shadow: 0 1px 3px rgb(25 25 25 / 10%); content: ""; transition: transform 180ms cubic-bezier(.23,1,.32,1); }.ml-workspace-switch[data-active="write"] .ml-workspace-tabs::before { transform: translateX(100%); }.ml-workspace-switch[data-active="review"] .ml-workspace-tabs::before { transform: translateX(200%); }.ml-workspace-tabs button { position: relative; z-index: 1; min-height: 34px; border: 0; border-radius: 7px; color: #7a7a78; background: transparent; cursor: pointer; font: inherit; }.ml-workspace-tabs button[aria-selected="true"] { color: #292929; }.ml-workspace-surface { position: relative; display: grid; min-height: 154px; align-content: end; gap: 6px; margin-top: 12px; overflow: hidden; border: 1px solid #dededc; border-radius: 16px; padding: 19px; background: linear-gradient(145deg,#fff,#f5f5f3); }.ml-workspace-surface > span:first-child { color: #9e9e9e; font: 600 11px ui-monospace, monospace; letter-spacing: .08em; }.ml-workspace-surface strong { font-size: 17px; letter-spacing: -.2px; }.ml-workspace-surface p { max-width: 250px; margin: 0; color: #5d5d5d; }.ml-workspace-count { position: absolute; top: 18px; right: 18px; display: grid; width: 35px; height: 35px; place-items: center; border-radius: 50%; color: #292929; background: #e8e8e5; font: 600 12px ui-monospace, monospace; }.ml-workspace-surface.is-changing > * { animation: ml-workspace-content 160ms cubic-bezier(.23,1,.32,1) both; } @keyframes ml-workspace-content { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="workspace-switch"]');
  if (!root) return;
  const presets = { design: ['CANVAS', 'Homepage direction', 'Three reviewed frames are ready to share.', '03'], write: ['DRAFT', 'Release notes', 'A short opening is ready for editing.', '12'], review: ['REVIEW', 'Comments resolved', 'Everything is clear for the next handoff.', '08'] };
  const tabs = [...root.querySelectorAll('[data-workspace-tab]')]; const surface = root.querySelector('.ml-workspace-surface');
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const id = tab.dataset.workspaceTab; const values = presets[id]; root.dataset.active = id;
    tabs.forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
    surface.classList.remove('is-changing'); void surface.offsetWidth; surface.classList.add('is-changing');
    root.querySelector('[data-workspace-eyebrow]').textContent = values[0]; root.querySelector('[data-workspace-title]').textContent = values[1]; root.querySelector('[data-workspace-copy]').textContent = values[2]; root.querySelector('[data-workspace-count]').textContent = values[3];
  }));
})();`
    )
  },
  {
    id: "template-choice",
    kind: "template-choice",
    groupId: "choice",
    name: text("模板选择", "Template choice"),
    shortDescription: text("在一组可视模板中确定方向，并把下一步操作稳定地接在选择之后。", "Choose direction from visual templates, then attach the next action steadily to that choice."),
    scene: text("创建新页面时选择一个起始模板。", "Choosing a starting template when creating a new page."),
    useCase: text("创建项目、选封面、挑邮件模板和生成报告。", "Creating projects, choosing covers, selecting email templates, and generating reports."),
    prompt: text(
      "实现一个模板选择器：三张模板卡片可切换，选中的模板呈现清晰边界和角标，下方主按钮同步带出当前模板名。动作轻、短，并支持重复选择。",
      "Build a template chooser: three cards can switch, the chosen card has a clear boundary and corner mark, and the main action below adopts the active template name. Keep the motion light, short, and repeatable."
    ),
    guidance: {
      trigger: text("点击模板时先更新可视选择，再更新下一步动作。", "Update the visual choice first, then update the next action."),
      outcome: text("主按钮直接说明即将从哪个模板开始。", "The primary action directly states which template will start the flow."),
      reducedMotion: text("保留边界、角标和按钮文案更新。", "Keep boundary, corner mark, and action-label updates.")
    },
    keywords: ["模板", "选择", "创建", "封面", "选项", "template", "chooser", "create", "cover", "option"],
    timing: "200ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-template-choice" data-motion-pack="template-choice" aria-label="Choose a template">
  <div class="ml-template-grid" role="radiogroup" aria-label="Templates">
    <button type="button" role="radio" aria-checked="true" data-template="Brief"><span class="ml-template-art brief"><i></i><i></i><i></i></span><strong>Brief</strong><em>✓</em></button>
    <button type="button" role="radio" aria-checked="false" data-template="Gallery"><span class="ml-template-art gallery"><i></i><i></i><i></i></span><strong>Gallery</strong><em>✓</em></button>
    <button type="button" role="radio" aria-checked="false" data-template="Roadmap"><span class="ml-template-art roadmap"><i></i><i></i><i></i></span><strong>Roadmap</strong><em>✓</em></button>
  </div><button class="ml-template-cta" type="button" data-template-cta>Use Brief <span aria-hidden="true">→</span></button>
</section>`,
      String.raw`.ml-template-choice { width: min(100%, 420px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-template-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 9px; }.ml-template-grid > button { position: relative; display: grid; gap: 9px; border: 1px solid #dededc; border-radius: 14px; padding: 8px; color: #5d5d5d; background: #fff; cursor: pointer; font: inherit; text-align: left; transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms cubic-bezier(.16,1,.3,1); }.ml-template-grid > button:hover { transform: translateY(-2px); }.ml-template-grid > button[aria-checked="true"] { border-color: #292929; box-shadow: 0 9px 20px rgb(25 25 25 / 8%); color: #292929; }.ml-template-grid em { position: absolute; top: 7px; right: 7px; display: grid; width: 18px; height: 18px; place-items: center; border-radius: 50%; color: #fff; background: #292929; font: 700 11px/1 Inter, sans-serif; font-style: normal; opacity: 0; transform: scale(.65); transition: opacity 160ms ease, transform 160ms cubic-bezier(.16,1,.3,1); }.ml-template-grid > button[aria-checked="true"] em { opacity: 1; transform: scale(1); }.ml-template-art { display: grid; min-height: 74px; gap: 4px; padding: 6px; border-radius: 8px; background: #f0f0ed; }.ml-template-art i { display: block; border-radius: 3px; background: #c8c8c5; }.ml-template-art.brief i:first-child { min-height: 30px; }.ml-template-art.gallery { grid-template-columns: repeat(2,1fr); }.ml-template-art.gallery i:first-child { grid-row: span 2; }.ml-template-art.roadmap { grid-template-columns: 11px 1fr; }.ml-template-art.roadmap i:nth-child(odd) { border-radius: 99px; }.ml-template-cta { display: flex; width: 100%; min-height: 40px; align-items: center; justify-content: space-between; margin-top: 12px; border: 0; border-radius: 999px; padding: 0 15px; color: #fff; background: #292929; cursor: pointer; font: inherit; transition: transform 120ms ease; }.ml-template-cta:active { transform: scale(.98); }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="template-choice"]');
  if (!root) return;
  const choices = [...root.querySelectorAll('[role="radio"]')]; const action = root.querySelector('[data-template-cta]');
  choices.forEach((choice) => choice.addEventListener('click', () => { choices.forEach((item) => item.setAttribute('aria-checked', String(item === choice))); action.innerHTML = 'Use ' + choice.dataset.template + ' <span aria-hidden="true">→</span>'; }));
})();`
    )
  },
  {
    id: "layer-insertion",
    kind: "layer-insertion",
    groupId: "change",
    name: text("图层插入", "Layer insertion"),
    shortDescription: text("新内容先占住正确位置，再用极小的位移显露出来。", "New content reserves its correct position, then reveals itself with very small travel."),
    scene: text("设计工具中新增一个标题或强调图层。", "Adding a title or accent layer inside a design tool."),
    useCase: text("列表新增、评论插入、图层面板和待办创建。", "Adding list items, inserting comments, layer panels, and creating tasks."),
    prompt: text(
      "实现一个图层插入动作：点击“添加图层”后，新行先进入最终布局位置，再在 220ms 内从轻微下方和低透明度出现。已有行保持稳定。",
      "Build a layer insertion action: after Add layer, the new row first occupies its final layout position, then appears from slight downward travel and low opacity over 220ms. Existing rows remain stable."
    ),
    guidance: {
      trigger: text("新增动作应立刻在当前列表区域被看见。", "Make the addition visible immediately inside the current list area."),
      outcome: text("新行进入准确位置，已有内容避免被大幅推开。", "The new row enters its exact position while existing content avoids large displacement."),
      reducedMotion: text("新行直接出现，并维持项目顺序。", "Show the new row directly while preserving item order.")
    },
    keywords: ["新增", "插入", "图层", "列表", "添加", "insert", "add", "layer", "list", "new item"],
    timing: "220ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-layer-insertion" data-motion-pack="layer-insertion" aria-label="Layer insertion">
  <div class="ml-layer-window"><div class="ml-layer-bar"><strong>Layers</strong><button type="button" data-add-layer>＋ Add layer</button></div><ul data-layer-list><li><i></i><strong>Title</strong><small>Fade in</small></li><li><i></i><strong>Meta</strong><small>Delay 40ms</small></li></ul></div>
</section>`,
      String.raw`.ml-layer-insertion { width: min(100%, 400px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-layer-window { overflow: hidden; border: 1px solid #dededc; border-radius: 16px; background: #fff; }.ml-layer-bar { display: flex; min-height: 48px; align-items: center; justify-content: space-between; padding: 0 13px; border-bottom: 1px solid #ebebe8; }.ml-layer-bar button { min-height: 30px; border: 0; border-radius: 8px; padding: 0 8px; color: #292929; background: #f0f0ed; cursor: pointer; font: inherit; }.ml-layer-bar button:active { transform: scale(.97); }.ml-layer-insertion ul { display: grid; gap: 5px; margin: 0; padding: 11px; list-style: none; }.ml-layer-insertion li { display: grid; grid-template-columns: 13px 1fr auto; align-items: center; gap: 8px; min-height: 39px; border-radius: 9px; padding: 0 10px; background: #f7f7f5; }.ml-layer-insertion li > i { width: 11px; height: 11px; border-radius: 3px; background: #c6c6c2; }.ml-layer-insertion li small { color: #9e9e9e; font-size: 11px; }.ml-layer-insertion li.is-entering { animation: ml-layer-enter 220ms cubic-bezier(.16,1,.3,1) both; } @keyframes ml-layer-enter { from { opacity: 0; transform: translateY(8px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="layer-insertion"]');
  if (!root) return;
  const list = root.querySelector('[data-layer-list]'); const button = root.querySelector('[data-add-layer]'); let count = 2;
  button.addEventListener('click', () => { count += 1; const item = document.createElement('li'); item.className = 'is-entering'; item.innerHTML = '<i></i><strong>' + (count % 2 ? 'Accent' : 'Thumbnail') + '</strong><small>' + (count % 2 ? 'Scale 96%' : 'Slide up') + '</small>'; list.append(item); });
})();`
    )
  },
  {
    id: "archive-undo",
    kind: "archive-undo",
    groupId: "change",
    name: text("归档撤销", "Archive undo"),
    shortDescription: text("项目离开后，撤销入口从同一上下文接住用户。", "After an item leaves, an undo affordance catches the user in the same context."),
    scene: text("任务列表中把一条评审移到归档。", "Moving a review task to archive from a task list."),
    useCase: text("归档、删除、移除成员、完成待办和取消订阅。", "Archiving, deleting, removing members, completing tasks, and unsubscribing."),
    prompt: text(
      "实现一个归档撤销：点击归档后，任务卡片在 200ms 内缩小淡出，底部出现带撤销按钮的短提示。点击撤销后，原卡片从相同位置恢复。",
      "Build archive undo: after Archive, fade and scale the task card out within 200ms, then reveal a short toast with Undo. Clicking Undo restores the original card at the same location."
    ),
    guidance: {
      trigger: text("离开动作的开始位置保留在用户正在看的列表里。", "Keep the departure origin inside the list the person is viewing."),
      outcome: text("撤销入口贴近刚刚发生的结果，并能恢复原项目。", "Place Undo near the just-completed result and restore the original item."),
      reducedMotion: text("卡片直接隐藏或恢复，撤销提示保持可见。", "Hide or restore the card directly while keeping Undo available.")
    },
    keywords: ["归档", "撤销", "删除", "恢复", "toast", "archive", "undo", "delete", "restore", "forgiveness"],
    timing: "200ms exit + 180ms restore · cubic-bezier(0.4, 0, 1, 1)",
    source: source(
      String.raw`<section class="ml-archive-undo" data-motion-pack="archive-undo" aria-label="Archive task">
  <div class="ml-archive-row" data-archive-row><span class="ml-archive-check">✓</span><div><strong>Motion review</strong><small>4 changes ready</small></div><button type="button" data-archive-action>Archive</button></div>
  <div class="ml-archive-toast" data-archive-toast role="status"><span>Moved to archive</span><button type="button" data-undo-action>Undo</button></div>
</section>`,
      String.raw`.ml-archive-undo { width: min(100%, 405px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-archive-row { display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 10px; border: 1px solid #dededc; border-radius: 14px; padding: 13px; background: #fff; transition: opacity 200ms ease, transform 200ms cubic-bezier(.4,0,1,1), max-height 200ms ease, margin 200ms ease; }.ml-archive-row.is-archived { max-height: 0; margin: 0; padding-top: 0; padding-bottom: 0; overflow: hidden; border-width: 0; opacity: 0; transform: scale(.97) translateY(-5px); }.ml-archive-check { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 50%; color: #2d8c5f; background: #eff9f2; }.ml-archive-row small { display: block; margin-top: 2px; color: #9e9e9e; }.ml-archive-undo button { min-height: 32px; border: 0; border-radius: 999px; padding: 0 11px; color: #292929; background: #f0f0ed; cursor: pointer; font: inherit; }.ml-archive-toast { display: flex; align-items: center; justify-content: space-between; margin-top: 9px; border-radius: 11px; padding: 10px 12px; color: #fff; background: #292929; opacity: 0; pointer-events: none; transform: translateY(-6px); transition: opacity 180ms ease, transform 180ms cubic-bezier(.23,1,.32,1); }.ml-archive-toast button { color: #292929; background: #fff; }.ml-archive-undo[data-archived="true"] .ml-archive-toast { opacity: 1; pointer-events: auto; transform: translateY(0); }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="archive-undo"]');
  if (!root) return;
  const row = root.querySelector('[data-archive-row]'); const archive = root.querySelector('[data-archive-action]'); const undo = root.querySelector('[data-undo-action]');
  archive.addEventListener('click', () => { row.classList.add('is-archived'); root.dataset.archived = 'true'; });
  undo.addEventListener('click', () => { row.classList.remove('is-archived'); delete root.dataset.archived; });
})();`
    )
  },
  {
    id: "filter-results",
    kind: "filter-results",
    groupId: "change",
    name: text("筛选结果", "Filter results"),
    shortDescription: text("筛选条件变化时，让结果数量和可见项目一起更新。", "When a filter changes, update the result count and visible items together."),
    scene: text("资源库中按状态过滤设计文件。", "Filtering design files by status in a resource library."),
    useCase: text("搜索结果、内容列表、订单、任务和标签页。", "Search results, content lists, orders, tasks, and tag views."),
    prompt: text(
      "实现一个筛选结果切换：点击筛选条件后，活动筛选清晰移动，符合条件的卡片在 180ms 内淡入上移，不符合条件的卡片淡出，顶部结果数量同步更新。",
      "Build a filter-results switch: after a filter is clicked, clearly move the active filter, fade qualifying cards in with slight upward travel over 180ms, fade non-matches out, and update the count in sync."
    ),
    guidance: {
      trigger: text("筛选条件本身需要持续可见，帮助用户理解当前范围。", "Keep the filter itself continuously visible so people understand the active scope."),
      outcome: text("结果数量、活动条件和网格内容在同一个事件内更新。", "Update count, active condition, and grid content as one event."),
      reducedMotion: text("直接替换可见结果，同时保留数量和选中筛选。", "Replace visible results directly while retaining count and active filter.")
    },
    keywords: ["筛选", "结果", "搜索", "标签", "列表", "filter", "results", "search", "tag", "list"],
    timing: "180ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-filter-results" data-motion-pack="filter-results" data-filter="all" aria-label="Filter library">
  <div class="ml-filter-head"><div class="ml-filter-tabs" role="group" aria-label="Filter"><button type="button" aria-pressed="true" data-filter-option="all">All</button><button type="button" aria-pressed="false" data-filter-option="review">Review</button><button type="button" aria-pressed="false" data-filter-option="draft">Draft</button></div><span data-filter-count>4 results</span></div>
  <ul class="ml-filter-grid" data-filter-grid><li data-kind="review"><i></i><strong>Homepage</strong><small>Review</small></li><li data-kind="draft"><i></i><strong>Release notes</strong><small>Draft</small></li><li data-kind="review"><i></i><strong>Pricing page</strong><small>Review</small></li><li data-kind="draft"><i></i><strong>Onboarding</strong><small>Draft</small></li></ul>
</section>`,
      String.raw`.ml-filter-results { width: min(100%, 420px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-filter-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; color: #9e9e9e; font-size: 12px; }.ml-filter-tabs { display: inline-flex; gap: 3px; padding: 3px; border-radius: 9px; background: #eaeae7; }.ml-filter-tabs button { min-height: 29px; border: 0; border-radius: 6px; padding: 0 9px; color: #6e6e6b; background: transparent; cursor: pointer; font: inherit; transition: color 180ms ease, background 180ms ease, box-shadow 180ms ease; }.ml-filter-tabs button[aria-pressed="true"] { color: #292929; background: #fff; box-shadow: 0 1px 3px rgb(25 25 25 / 10%); }.ml-filter-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }.ml-filter-grid li { display: grid; gap: 7px; min-height: 96px; border: 1px solid #dededc; border-radius: 13px; padding: 10px; background: #fff; transition: opacity 180ms ease, transform 180ms cubic-bezier(.16,1,.3,1); }.ml-filter-grid li.is-hidden { display: none; }.ml-filter-grid li.is-entering { animation: ml-filter-enter 180ms cubic-bezier(.16,1,.3,1) both; }.ml-filter-grid i { display: block; width: 25px; height: 18px; border-radius: 5px; background: #d1d1ce; }.ml-filter-grid small { color: #9e9e9e; } @keyframes ml-filter-enter { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="filter-results"]');
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-filter-option]')]; const cards = [...root.querySelectorAll('[data-kind]')]; const count = root.querySelector('[data-filter-count]');
  buttons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filterOption; root.dataset.filter = filter; buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button))); let visible = 0;
    cards.forEach((card) => { const show = filter === 'all' || card.dataset.kind === filter; card.classList.toggle('is-hidden', !show); if (show) { visible += 1; card.classList.remove('is-entering'); void card.offsetWidth; card.classList.add('is-entering'); } });
    count.textContent = visible + (visible === 1 ? ' result' : ' results');
  }));
})();`
    )
  },
  {
    id: "inline-validation",
    kind: "inline-validation",
    groupId: "feedback",
    name: text("行内校验", "Inline validation"),
    shortDescription: text("输入时提供贴近字段的方向，让用户持续停留在当前任务上。", "Offer direction close to the field while people stay in the current task."),
    scene: text("邀请协作者时填写电子邮箱。", "Entering an email address while inviting a collaborator."),
    useCase: text("表单字段、账户设置、付款信息和邀请流程。", "Form fields, account settings, payment information, and invite flows."),
    prompt: text(
      "实现一个行内邮箱校验：用户输入后，根据邮箱格式切换输入框边界、辅助文字和状态图标。有效状态快速抵达，错误信息保持简洁并位于字段附近。",
      "Build inline email validation: after input, switch the field boundary, helper copy, and status icon based on email format. Let valid state land quickly; keep error copy concise and near the field."
    ),
    guidance: {
      trigger: text("在用户完成一段可判断的输入后更新状态。", "Update state after the person completes an input that can be evaluated."),
      outcome: text("边界、图标与辅助说明指向同一个明确结论。", "Boundary, icon, and helper copy point to one clear conclusion."),
      reducedMotion: text("保留颜色、图标和文字的状态变化。", "Keep the state changes in color, icon, and text.")
    },
    keywords: ["表单", "校验", "错误", "输入", "邮箱", "form", "validation", "error", "input", "email"],
    timing: "140ms · ease-out",
    source: source(
      String.raw`<section class="ml-inline-validation" data-motion-pack="inline-validation" data-state="idle" aria-label="Email validation">
  <label for="ml-validation-email">Invite email</label>
  <div class="ml-validation-field"><input id="ml-validation-email" type="email" autocomplete="email" placeholder="name@company.com" data-validation-input aria-describedby="ml-validation-help"><span data-validation-icon aria-hidden="true">•</span></div>
  <p id="ml-validation-help" data-validation-help aria-live="polite">Use a work email to keep this project private.</p>
</section>`,
      String.raw`.ml-inline-validation { width: min(100%, 380px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-inline-validation label { display: block; margin-bottom: 7px; }.ml-validation-field { position: relative; }.ml-validation-field input { box-sizing: border-box; width: 100%; min-height: 42px; border: 1px solid #cfcfcd; border-radius: 10px; padding: 0 38px 0 12px; outline: none; color: #292929; background: #fff; font: inherit; transition: border-color 140ms ease, box-shadow 140ms ease; }.ml-validation-field input:focus { border-color: #292929; box-shadow: 0 0 0 3px rgb(41 41 41 / 8%); }.ml-validation-field span { position: absolute; top: 50%; right: 13px; color: #9e9e9e; transform: translateY(-50%) scale(.8); transition: color 140ms ease, transform 140ms cubic-bezier(.23,1,.32,1); }.ml-inline-validation p { min-height: 18px; margin: 7px 0 0; color: #9e9e9e; font-size: 12px; }.ml-inline-validation[data-state="valid"] input { border-color: #55a879; box-shadow: 0 0 0 3px rgb(85 168 121 / 10%); }.ml-inline-validation[data-state="valid"] span, .ml-inline-validation[data-state="valid"] p { color: #2d8c5f; }.ml-inline-validation[data-state="valid"] span { transform: translateY(-50%) scale(1); }.ml-inline-validation[data-state="invalid"] input { border-color: #c65b5b; box-shadow: 0 0 0 3px rgb(198 91 91 / 9%); }.ml-inline-validation[data-state="invalid"] span, .ml-inline-validation[data-state="invalid"] p { color: #b54747; }.ml-inline-validation[data-state="invalid"] span { transform: translateY(-50%) scale(1); }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="inline-validation"]');
  if (!root) return;
  const input = root.querySelector('[data-validation-input]'); const help = root.querySelector('[data-validation-help]'); const icon = root.querySelector('[data-validation-icon]');
  input.addEventListener('input', () => { const value = input.value.trim(); if (!value) { root.dataset.state = 'idle'; icon.textContent = '•'; help.textContent = 'Use a work email to keep this project private.'; return; } const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); root.dataset.state = valid ? 'valid' : 'invalid'; icon.textContent = valid ? '✓' : '!'; help.textContent = valid ? 'Email looks ready to invite.' : 'Enter a complete email address.'; });
})();`
    )
  },
  {
    id: "command-menu",
    kind: "command-menu",
    groupId: "choice",
    name: text("命令菜单", "Command menu"),
    shortDescription: text("在一个紧凑表面里筛选动作，并为键盘和指针提供相同的焦点反馈。", "Filter actions inside a compact surface with equal focus feedback for keyboard and pointer."),
    scene: text("文档工作区中快速跳转到一个常用动作。", "Jumping quickly to a common action from a document workspace."),
    useCase: text("快速操作、全局搜索、文件跳转和创建入口。", "Quick actions, global search, file jumping, and creation entry points."),
    prompt: text(
      "实现一个命令菜单：按下按钮或 Cmd/Ctrl+K 打开面板，输入时筛选命令，方向键移动高亮，Enter 执行当前项，Esc 关闭。进入和离开保持 160ms 的短节奏。",
      "Build a command menu: open it with the button or Cmd/Ctrl+K, filter commands while typing, move highlight with arrow keys, run the active item with Enter, and close with Escape. Keep entrance and exit to a short 160ms cadence."
    ),
    guidance: {
      trigger: text("从原按钮打开，键盘焦点立即进入搜索框。", "Open from the original action and move keyboard focus into search immediately."),
      outcome: text("高亮项始终表达下一次 Enter 会执行什么。", "The highlighted row always communicates what Enter will run next."),
      reducedMotion: text("面板直接出现与关闭，保持焦点管理和键盘操作。", "Open and close the panel directly while retaining focus management and keyboard controls.")
    },
    keywords: ["命令菜单", "快捷操作", "搜索", "键盘", "Cmd K", "command menu", "quick action", "search", "keyboard", "cmd k"],
    timing: "160ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-command-menu" data-motion-pack="command-menu" data-open="false" aria-label="Command menu">
  <button class="ml-command-trigger" type="button" data-command-trigger><span>⌘</span> Find a command <kbd>⌘ K</kbd></button>
  <div class="ml-command-popover" data-command-popover hidden><input type="search" placeholder="Search actions" data-command-input aria-label="Search commands"><ul data-command-list><li data-command="Create page" data-index="0" class="is-active"><span>＋</span>Create page<kbd>↵</kbd></li><li data-command="Open library" data-index="1"><span>◫</span>Open library<kbd>↵</kbd></li><li data-command="Share project" data-index="2"><span>↗</span>Share project<kbd>↵</kbd></li></ul><p data-command-status role="status"></p></div>
</section>`,
      String.raw`.ml-command-menu { position: relative; width: min(100%, 400px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-command-trigger { display: flex; width: 100%; min-height: 42px; align-items: center; gap: 9px; border: 1px solid #d8d8d5; border-radius: 10px; padding: 0 12px; color: #5d5d5d; background: #fff; cursor: pointer; font: inherit; text-align: left; }.ml-command-trigger > span { color: #292929; font-size: 17px; }.ml-command-trigger kbd, .ml-command-popover kbd { margin-left: auto; color: #9e9e9e; font: 11px ui-monospace, monospace; }.ml-command-popover { position: absolute; z-index: 1; width: 100%; box-sizing: border-box; margin-top: 7px; overflow: hidden; border: 1px solid #d8d8d5; border-radius: 13px; padding: 7px; background: #fff; box-shadow: 0 15px 30px rgb(25 25 25 / 12%); transform-origin: top center; }.ml-command-menu[data-open="true"] .ml-command-popover { animation: ml-command-open 160ms cubic-bezier(.16,1,.3,1) both; }.ml-command-popover input { box-sizing: border-box; width: 100%; min-height: 35px; border: 0; border-bottom: 1px solid #ecece9; outline: 0; padding: 0 7px 7px; color: #292929; background: transparent; font: inherit; }.ml-command-popover ul { display: grid; gap: 2px; margin: 6px 0; padding: 0; list-style: none; }.ml-command-popover li { display: flex; min-height: 36px; align-items: center; gap: 8px; border-radius: 8px; padding: 0 8px; color: #5d5d5d; cursor: pointer; }.ml-command-popover li span { color: #9e9e9e; }.ml-command-popover li.is-active { color: #292929; background: #f0f0ed; }.ml-command-popover li[hidden] { display: none; }.ml-command-popover p { min-height: 16px; margin: 3px 7px 0; color: #2d8c5f; font-size: 12px; } @keyframes ml-command-open { from { opacity: 0; transform: translateY(-5px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="command-menu"]');
  if (!root) return;
  const trigger = root.querySelector('[data-command-trigger]'); const popover = root.querySelector('[data-command-popover]'); const input = root.querySelector('[data-command-input]'); const rows = [...root.querySelectorAll('[data-command]')]; const status = root.querySelector('[data-command-status]'); let active = 0;
  const open = () => { root.dataset.open = 'true'; popover.hidden = false; input.focus(); };
  const close = () => { root.dataset.open = 'false'; popover.hidden = true; trigger.focus(); };
  const setActive = (index) => { const available = rows.filter((row) => !row.hidden); active = Math.max(0, Math.min(index, available.length - 1)); available.forEach((row, rowIndex) => row.classList.toggle('is-active', rowIndex === active)); };
  trigger.addEventListener('click', open); document.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); } });
  input.addEventListener('input', () => { const term = input.value.toLowerCase(); rows.forEach((row) => { row.hidden = !row.dataset.command.toLowerCase().includes(term); }); setActive(0); });
  input.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); if (event.key === 'ArrowDown') { event.preventDefault(); setActive(active + 1); } if (event.key === 'ArrowUp') { event.preventDefault(); setActive(active - 1); } if (event.key === 'Enter') { const row = rows.filter((item) => !item.hidden)[active]; status.textContent = row.dataset.command + ' selected'; } });
})();`
    )
  },
  {
    id: "details-disclosure",
    kind: "details-disclosure",
    groupId: "change",
    name: text("详情展开", "Details disclosure"),
    shortDescription: text("让被收起的信息在原有位置打开，内容与触发器保持清晰关联。", "Open collapsed information in place while preserving a clear relationship with its trigger."),
    scene: text("发布前检查清单中的一项展开说明。", "An expanded explanation in a pre-publish checklist."),
    useCase: text("设置说明、FAQ、检查项、表格详情和高级参数。", "Settings explanations, FAQs, checklists, table details, and advanced parameters."),
    prompt: text(
      "实现一个详情展开：点击标题行后，箭头旋转，内容区通过高度和透明度在 220ms 内展开；再次点击平稳收起。避免让页面其余部分发生突兀跳动。",
      "Build a details disclosure: after clicking the title row, rotate the arrow and expand content through height and opacity over 220ms; click again to settle closed. Keep surrounding layout from jumping abruptly."
    ),
    guidance: {
      trigger: text("标题行始终是完整可点击的触发面。", "The title row remains one complete clickable trigger surface."),
      outcome: text("箭头、可见内容和辅助说明同步表达展开状态。", "Arrow, visible content, and helper copy express expanded state together."),
      reducedMotion: text("直接展开或收起内容，保留 aria-expanded 状态。", "Open or close content directly while retaining aria-expanded state.")
    },
    keywords: ["展开", "收起", "详情", "折叠", "FAQ", "disclosure", "expand", "collapse", "details", "accordion"],
    timing: "220ms · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-details-disclosure" data-motion-pack="details-disclosure" data-expanded="false" aria-label="Release checks">
  <button type="button" aria-expanded="false" data-disclosure-trigger><span><strong>Release checklist</strong><small>3 checks before publishing</small></span><b aria-hidden="true">⌄</b></button>
  <div class="ml-disclosure-panel" data-disclosure-panel><div><p>Confirm the title, share image, and redirect rules before this version goes live.</p><a href="#release-notes">Open release notes →</a></div></div>
</section>`,
      String.raw`.ml-details-disclosure { width: min(100%, 410px); margin: 0 auto; overflow: hidden; border: 1px solid #dededc; border-radius: 14px; color: #292929; background: #fff; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-details-disclosure > button { display: flex; width: 100%; min-height: 58px; align-items: center; justify-content: space-between; border: 0; padding: 0 14px; color: inherit; background: transparent; cursor: pointer; font: inherit; text-align: left; }.ml-details-disclosure strong, .ml-details-disclosure small { display: block; }.ml-details-disclosure small { margin-top: 3px; color: #9e9e9e; }.ml-details-disclosure b { color: #5d5d5d; font-size: 17px; transition: transform 220ms cubic-bezier(.23,1,.32,1); }.ml-disclosure-panel { display: grid; grid-template-rows: 0fr; border-top: 1px solid transparent; transition: grid-template-rows 220ms cubic-bezier(.23,1,.32,1), border-color 220ms ease; }.ml-disclosure-panel > div { min-height: 0; overflow: hidden; }.ml-disclosure-panel p { margin: 0; padding: 13px 14px 6px; color: #5d5d5d; }.ml-disclosure-panel a { display: inline-block; margin: 0 14px 14px; color: #292929; font-size: 12px; }.ml-details-disclosure[data-expanded="true"] b { transform: rotate(180deg); }.ml-details-disclosure[data-expanded="true"] .ml-disclosure-panel { grid-template-rows: 1fr; border-color: #ecece9; }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="details-disclosure"]');
  if (!root) return;
  const trigger = root.querySelector('[data-disclosure-trigger]');
  trigger.addEventListener('click', () => { const expanded = root.dataset.expanded === 'true'; root.dataset.expanded = String(!expanded); trigger.setAttribute('aria-expanded', String(!expanded)); });
})();`
    )
  },
  {
    id: "notification-triage",
    kind: "notification-triage",
    groupId: "workflow",
    name: text("通知处理", "Notification triage"),
    shortDescription: text("处理一条提醒后，让已完成感和下一条待处理内容自然接续。", "After handling a notification, let completion and the next pending item follow naturally."),
    scene: text("项目收件箱里清理两条待处理的更新。", "Clearing two pending updates from a project inbox."),
    useCase: text("通知中心、评论收件箱、审批队列和客服工单。", "Notification centers, comment inboxes, approval queues, and support tickets."),
    prompt: text(
      "实现一个通知处理动作：点击“标记已读”后，当前通知降低层级并离开队列，下一条通知轻微上移接替；当全部处理完成时，用短暂的“已清空”状态确认。",
      "Build a notification-triage action: after Mark read, lower the current notification's hierarchy and remove it from the queue, then let the next item rise slightly into place; when all are handled, confirm with a brief All clear state."
    ),
    guidance: {
      trigger: text("处理入口贴着当前通知，减少视线来回移动。", "Keep the handling action next to the current notification to reduce eye travel."),
      outcome: text("队列自然向上补位，剩余数量同步变化。", "Let the queue fill upward naturally while the remaining count changes in sync."),
      reducedMotion: text("直接移除已处理项并更新数量。", "Remove the handled item directly and update the count.")
    },
    keywords: ["通知", "已读", "收件箱", "处理", "队列", "notification", "read", "inbox", "triage", "queue"],
    timing: "180ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-notification-triage" data-motion-pack="notification-triage" aria-label="Notification triage">
  <div class="ml-triage-head"><span>Inbox</span><strong data-triage-count>2 to review</strong></div>
  <ol data-triage-list><li><span class="ml-triage-avatar">M</span><div><strong>Mei left a review</strong><small>Homepage direction · now</small></div><button type="button" data-triage-action>Mark read</button></li><li><span class="ml-triage-avatar">J</span><div><strong>Jules shared a file</strong><small>Research board · 3m</small></div><button type="button" data-triage-action>Mark read</button></li></ol>
  <p data-triage-empty role="status">All clear</p>
</section>`,
      String.raw`.ml-notification-triage { width: min(100%, 420px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-triage-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px; color: #5d5d5d; }.ml-triage-head strong { color: #9e9e9e; font-size: 12px; }.ml-notification-triage ol { display: grid; gap: 7px; margin: 0; padding: 0; list-style: none; }.ml-notification-triage li { display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 9px; border: 1px solid #dededc; border-radius: 13px; padding: 10px; background: #fff; transition: opacity 180ms ease, transform 180ms cubic-bezier(.16,1,.3,1), max-height 180ms ease, padding 180ms ease, border-width 180ms ease; }.ml-notification-triage li.is-done { max-height: 0; overflow: hidden; border-width: 0; padding-top: 0; padding-bottom: 0; opacity: 0; transform: translateX(10px); }.ml-triage-avatar { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 9px; color: #fff; background: #5f75d8; font-size: 12px; }.ml-notification-triage small { display: block; margin-top: 2px; color: #9e9e9e; }.ml-notification-triage button { min-height: 29px; border: 0; border-radius: 8px; padding: 0 8px; color: #5d5d5d; background: #f0f0ed; cursor: pointer; font: inherit; font-size: 12px; }.ml-notification-triage p { margin: 10px 0 0; border-radius: 10px; padding: 10px; color: #2d8c5f; background: #eff9f2; opacity: 0; transform: translateY(-5px); transition: opacity 180ms ease, transform 180ms cubic-bezier(.16,1,.3,1); }.ml-notification-triage[data-empty="true"] p { opacity: 1; transform: translateY(0); }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="notification-triage"]');
  if (!root) return;
  const list = root.querySelector('[data-triage-list]'); const count = root.querySelector('[data-triage-count]');
  list.addEventListener('click', (event) => { const button = event.target.closest('[data-triage-action]'); if (!button) return; const row = button.closest('li'); row.classList.add('is-done'); const left = [...list.children].filter((item) => !item.classList.contains('is-done')).length; count.textContent = left ? left + ' to review' : '0 to review'; if (!left) root.dataset.empty = 'true'; });
})();`
    )
  },
  {
    id: "progress-steps",
    kind: "progress-steps",
    groupId: "workflow",
    name: text("进度步骤", "Progress steps"),
    shortDescription: text("在连续任务中，让已完成、当前步骤和下一步形成清晰节奏。", "Across a multi-step task, make completed, current, and next steps form a clear cadence."),
    scene: text("设置公开页面时依次完成内容、分享和发布。", "Completing content, sharing, and publishing while setting up a public page."),
    useCase: text("引导流程、结账、发布向导、导入和申请表。", "Onboarding, checkout, publish wizards, imports, and application forms."),
    prompt: text(
      "实现一个三步进度流程：继续后，当前步骤变为完成，连接线延伸到下一步，右侧说明切换为新任务。使用 240ms 的顺序动作，避免同时让全部元素运动。",
      "Build a three-step progress flow: on Continue, complete the current step, extend the connector to the next, and switch the task on the right. Use a 240ms ordered sequence and avoid moving every element at once."
    ),
    guidance: {
      trigger: text("主按钮只推进一个明确的下一步。", "The primary action advances one explicit next step."),
      outcome: text("完成标记先到位，连接线和新步骤随后接续。", "The completion mark lands first, followed by connector and next step."),
      reducedMotion: text("直接更新步骤状态与进度文本。", "Update step state and progress text directly.")
    },
    keywords: ["进度", "步骤", "向导", "流程", "引导", "progress", "steps", "wizard", "flow", "onboarding"],
    timing: "240ms staged · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-progress-steps" data-motion-pack="progress-steps" data-step="0" aria-label="Publish steps">
  <div class="ml-step-track" aria-label="Progress"><span class="is-current"><i>1</i>Content</span><b></b><span><i>2</i>Share</span><b></b><span><i>3</i>Publish</span></div>
  <div class="ml-step-card"><span data-step-label>Step 1 of 3</span><strong data-step-title>Write the page title</strong><p data-step-copy>Give this page a clear name before sharing it.</p><button type="button" data-step-next>Continue <span aria-hidden="true">→</span></button></div>
</section>`,
      String.raw`.ml-progress-steps { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-step-track { display: grid; grid-template-columns: auto 1fr auto 1fr auto; align-items: center; gap: 7px; margin: 0 5px 13px; color: #9e9e9e; font-size: 12px; }.ml-step-track span { display: grid; justify-items: center; gap: 4px; }.ml-step-track i { display: grid; width: 22px; height: 22px; place-items: center; border: 1px solid #d0d0cd; border-radius: 50%; color: #7d7d7a; background: #fff; font: 11px ui-monospace, monospace; font-style: normal; transition: color 180ms ease, border-color 180ms ease, background 180ms ease, transform 180ms cubic-bezier(.23,1,.32,1); }.ml-step-track b { height: 1px; background: #d8d8d5; transform-origin: left; transition: background 200ms ease, transform 200ms cubic-bezier(.23,1,.32,1); }.ml-step-track .is-current, .ml-step-track .is-complete { color: #292929; }.ml-step-track .is-current i { border-color: #292929; transform: scale(1.08); }.ml-step-track .is-complete i { border-color: #2d8c5f; color: #fff; background: #2d8c5f; }.ml-step-track b.is-complete { background: #2d8c5f; transform: scaleX(1); }.ml-step-card { display: grid; gap: 6px; border: 1px solid #dededc; border-radius: 16px; padding: 17px; background: #fff; }.ml-step-card > span { color: #9e9e9e; font-size: 12px; }.ml-step-card strong { font-size: 16px; letter-spacing: -.2px; }.ml-step-card p { min-height: 36px; margin: 0; color: #5d5d5d; }.ml-step-card button { display: flex; min-height: 38px; align-items: center; justify-content: space-between; margin-top: 9px; border: 0; border-radius: 999px; padding: 0 14px; color: #fff; background: #292929; cursor: pointer; font: inherit; }.ml-step-card.is-changing > * { animation: ml-step-copy 180ms cubic-bezier(.23,1,.32,1) both; } @keyframes ml-step-copy { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="progress-steps"]');
  if (!root) return;
  const content = [['Step 1 of 3', 'Write the page title', 'Give this page a clear name before sharing it.', 'Continue'], ['Step 2 of 3', 'Choose who can view it', 'Set sharing before this page becomes public.', 'Continue'], ['Step 3 of 3', 'Publish your page', 'Everything is ready for a final review.', 'Publish']];
  const button = root.querySelector('[data-step-next]'); const card = root.querySelector('.ml-step-card'); const steps = [...root.querySelectorAll('.ml-step-track span')]; const links = [...root.querySelectorAll('.ml-step-track b')]; let step = 0;
  button.addEventListener('click', () => { if (step === 2) { button.textContent = 'Published ✓'; button.disabled = true; return; } steps[step].className = 'is-complete'; links[step].className = 'is-complete'; step += 1; steps[step].className = 'is-current'; const next = content[step]; card.classList.remove('is-changing'); void card.offsetWidth; card.classList.add('is-changing'); root.querySelector('[data-step-label]').textContent = next[0]; root.querySelector('[data-step-title]').textContent = next[1]; root.querySelector('[data-step-copy]').textContent = next[2]; button.innerHTML = next[3] + ' <span aria-hidden="true">→</span>'; });
})();`
    )
  },
  {
    id: "member-invite",
    kind: "member-invite",
    groupId: "workflow",
    name: text("成员邀请", "Member invite"),
    shortDescription: text("发送邀请后，让输入表单自然转化为一个可追踪的待加入成员。", "After an invite is sent, turn the form naturally into a trackable pending member."),
    scene: text("在项目设置中邀请新的设计协作者。", "Inviting a new design collaborator from project settings."),
    useCase: text("团队邀请、共享文档、项目权限和审批分配。", "Team invitations, shared documents, project permissions, and approval assignment."),
    prompt: text(
      "实现一个成员邀请表单：填写邮箱并发送后，按钮进入短暂发送状态，表单下方插入一个带角色和待接受状态的成员行。保留输入校验与再次邀请能力。",
      "Build a member-invite form: after entering an email and sending, let the action briefly enter a sending state, then insert a member row with role and pending status below. Keep input validation and the ability to invite again."
    ),
    guidance: {
      trigger: text("发送入口需要解释邀请的对象和角色。", "The send action should make the invitee and role understandable."),
      outcome: text("新成员以待接受状态进入团队列表，形成可追踪的后续。", "The new member enters the team list as pending, creating a traceable next step."),
      reducedMotion: text("直接插入成员行，保留待接受文字。", "Insert the member row directly and retain pending copy.")
    },
    keywords: ["邀请", "成员", "团队", "权限", "角色", "invite", "member", "team", "permission", "role"],
    timing: "220ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-member-invite" data-motion-pack="member-invite" aria-label="Invite member">
  <div class="ml-invite-fields"><input type="email" placeholder="name@company.com" data-invite-email aria-label="Member email"><select data-invite-role aria-label="Member role"><option>Editor</option><option>Viewer</option></select><button type="button" data-invite-action>Invite</button></div>
  <ul data-invite-list><li><span class="ml-invite-avatar">R</span><div><strong>Rui Yang</strong><small>Owner</small></div><em>Active</em></li></ul><p data-invite-status role="status"></p>
</section>`,
      String.raw`.ml-member-invite { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-invite-fields { display: grid; grid-template-columns: minmax(0,1fr) 92px auto; gap: 7px; }.ml-invite-fields input, .ml-invite-fields select { box-sizing: border-box; min-width: 0; min-height: 38px; border: 1px solid #d0d0cd; border-radius: 9px; padding: 0 10px; color: #292929; background: #fff; font: inherit; }.ml-invite-fields input:focus { outline: 2px solid rgb(41 41 41 / 14%); outline-offset: 1px; }.ml-invite-fields button { min-height: 38px; border: 0; border-radius: 999px; padding: 0 13px; color: #fff; background: #292929; cursor: pointer; font: inherit; }.ml-member-invite ul { display: grid; gap: 7px; margin: 12px 0 0; padding: 0; list-style: none; }.ml-member-invite li { display: grid; grid-template-columns: 28px 1fr auto; align-items: center; gap: 9px; min-height: 42px; border-radius: 11px; padding: 5px 9px; background: #f5f5f3; }.ml-member-invite li.is-new { animation: ml-invite-enter 220ms cubic-bezier(.16,1,.3,1) both; }.ml-invite-avatar { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 50%; color: #fff; background: #7b7b78; font-size: 11px; }.ml-member-invite small { display: block; margin-top: 2px; color: #9e9e9e; }.ml-member-invite em { color: #5d5d5d; font-size: 12px; font-style: normal; }.ml-member-invite li.is-new em { color: #a8781f; }.ml-member-invite p { min-height: 16px; margin: 6px 0 0; color: #b54747; font-size: 12px; } @keyframes ml-invite-enter { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: translateY(0); } } @media (max-width: 420px) { .ml-invite-fields { grid-template-columns: 1fr auto; }.ml-invite-fields select { grid-row: 2; }.ml-invite-fields button { grid-row: 2; } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="member-invite"]');
  if (!root) return;
  const email = root.querySelector('[data-invite-email]'); const role = root.querySelector('[data-invite-role]'); const button = root.querySelector('[data-invite-action]'); const list = root.querySelector('[data-invite-list]'); const status = root.querySelector('[data-invite-status]');
  button.addEventListener('click', () => { const value = email.value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { status.textContent = 'Enter a complete email address.'; email.focus(); return; } button.disabled = true; button.textContent = 'Sending'; status.textContent = ''; window.setTimeout(() => { const item = document.createElement('li'); item.className = 'is-new'; item.innerHTML = '<span class="ml-invite-avatar">' + value.charAt(0).toUpperCase() + '</span><div><strong>' + value + '</strong><small>' + role.value + '</small></div><em>Pending</em>'; list.append(item); email.value = ''; button.disabled = false; button.textContent = 'Invite'; }, 460); });
})();`
    )
  },
  {
    id: "media-scrub",
    kind: "media-scrub",
    groupId: "workflow",
    name: text("媒体拖动", "Media scrub"),
    shortDescription: text("拖动时间线时，让画面帧、时间标记和进度轨道保持同步。", "While scrubbing a timeline, keep frame, time marker, and progress track in sync."),
    scene: text("在视频编辑器里精确预览一个镜头片段。", "Precisely previewing a shot inside a video editor."),
    useCase: text("视频播放器、音频剪辑、图像前后帧和时间轴编辑。", "Video players, audio editing, before-and-after frames, and timeline editing."),
    prompt: text(
      "实现一个媒体拖动预览：用户拖动原生 range 时间线时，画面中的播放头、时间文字与进度填充连续更新。拖动停止后保持当前帧，避免额外的装饰性循环。",
      "Build a media-scrub preview: while a user drags a native range timeline, continuously update the playhead, time label, and progress fill in the frame. Keep the current frame after dragging and avoid decorative looping."
    ),
    guidance: {
      trigger: text("拖动中始终用同一条时间线表达当前位置。", "Use the same timeline to communicate current position throughout dragging."),
      outcome: text("画面、时间和轨道的更新必须来自同一个进度值。", "Frame, time, and track must update from the same progress value."),
      reducedMotion: text("保持拖动与内容同步，省略画面内部的过渡。", "Keep drag and content in sync while omitting transitions inside the frame.")
    },
    keywords: ["视频", "时间线", "拖动", "播放头", "预览", "media", "timeline", "scrub", "playhead", "preview"],
    timing: "Continuous input · linear",
    source: source(
      String.raw`<section class="ml-media-scrub" data-motion-pack="media-scrub" style="--progress: 31%" aria-label="Media scrub">
  <div class="ml-scrub-frame" data-scrub-frame><span class="ml-scrub-chip">Motion reel</span><strong data-scrub-title>Frame 08</strong><i class="ml-scrub-playhead" aria-hidden="true"></i></div>
  <div class="ml-scrub-controls"><input type="range" min="0" max="100" value="31" data-scrub-input aria-label="Timeline position"><div><span data-scrub-time>00:08</span><span>00:26</span></div></div>
</section>`,
      String.raw`.ml-media-scrub { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }.ml-scrub-frame { position: relative; display: grid; min-height: 165px; align-content: end; overflow: hidden; border-radius: 16px; padding: 17px; color: #fff; background: linear-gradient(135deg,#24272f 0%,#5262aa var(--progress),#d8b56a 100%); }.ml-scrub-frame::before { position: absolute; top: 0; bottom: 0; left: var(--progress); width: 1px; background: rgb(255 255 255 / 72%); box-shadow: 0 0 0 3px rgb(255 255 255 / 12%); content: ""; }.ml-scrub-chip { position: absolute; top: 13px; left: 13px; border-radius: 999px; padding: 4px 7px; background: rgb(0 0 0 / 22%); font-size: 11px; }.ml-scrub-frame strong { position: relative; z-index: 1; font-size: 20px; letter-spacing: -.4px; }.ml-scrub-playhead { position: absolute; top: 47%; left: calc(var(--progress) - 8px); width: 16px; height: 16px; border: 2px solid #fff; border-radius: 50%; background: #292929; transform: translate(-50%,-50%); }.ml-scrub-controls { margin-top: 12px; }.ml-scrub-controls input { width: 100%; accent-color: #292929; cursor: ew-resize; }.ml-scrub-controls div { display: flex; justify-content: space-between; margin-top: 4px; color: #9e9e9e; font: 12px ui-monospace, monospace; }.ml-scrub-controls div span:first-child { color: #292929; }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="media-scrub"]');
  if (!root) return;
  const input = root.querySelector('[data-scrub-input]'); const title = root.querySelector('[data-scrub-title]'); const time = root.querySelector('[data-scrub-time]');
  input.addEventListener('input', () => { const value = Number(input.value); root.style.setProperty('--progress', value + '%'); const seconds = Math.round(value * 26 / 100); title.textContent = 'Frame ' + String(seconds).padStart(2, '0'); time.textContent = '00:' + String(seconds).padStart(2, '0'); });
})();`
    )
  },
  {
    id: "upload-complete",
    kind: "upload-complete",
    groupId: "feedback",
    name: text("文件上传完成", "Upload complete"),
    shortDescription: text("文件抵达后，用进度、可用状态和新资产行交代结果。", "When a file lands, use progress, availability, and a new asset row to explain the result."),
    scene: text("在素材库里上传一张产品封面。", "Uploading a product cover in an asset library."),
    useCase: text("媒体上传、附件提交、导入文件和批量处理。", "Media uploads, attachments, file imports, and batch processing."),
    prompt: text(
      "实现一个文件上传完成反馈：点击上传后，进度条在短时间内到达完成，状态由“上传中”切换为“可用”，并插入一条带文件名和大小的资产记录。使用 transform、opacity 和短时长，并提供减弱动效版本。",
      "Build upload-complete feedback: after Upload, let progress finish quickly, switch the state from Uploading to Available, and insert an asset record with filename and size. Use transform, opacity, short timing, and a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("上传动作开始时，先明确文件正在处理中。", "When upload starts, make it clear that the file is being processed."),
      outcome: text("进度、可用状态和资产列表在一次连续流程中更新。", "Progress, availability, and the asset list update as one continuous flow."),
      reducedMotion: text("保留进度数值、状态文字和资产记录，省略进入位移。", "Keep progress value, state copy, and the asset record while omitting entrance travel.")
    },
    keywords: ["上传", "文件", "素材", "完成", "进度", "upload", "file", "asset", "complete", "progress"],
    timing: "220ms + 320ms completion · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-upload-complete" data-motion-pack="upload-complete" data-state="ready" style="--upload-progress: 0%" aria-label="Upload complete">
  <div class="ml-upload-head"><div><span>Cover image</span><strong data-upload-state>Ready to upload</strong></div><button type="button" data-upload-action>Upload file</button></div>
  <div class="ml-upload-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-upload-progress><i></i></div>
  <ul class="ml-upload-assets" data-upload-assets><li><span class="ml-upload-icon">□</span><div><strong>brand-guide.pdf</strong><small>2.4 MB · Available</small></div></li></ul>
</section>`,
      String.raw`[data-motion-pack="upload-complete"] { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="upload-complete"] .ml-upload-head { display: flex; align-items: center; justify-content: space-between; gap: 14px; }
[data-motion-pack="upload-complete"] .ml-upload-head span, [data-motion-pack="upload-complete"] small { display: block; color: #9e9e9e; font-size: 12px; }
[data-motion-pack="upload-complete"] .ml-upload-head strong { display: block; margin-top: 3px; font-size: 15px; letter-spacing: -.15px; }
[data-motion-pack="upload-complete"] button { min-height: 36px; border: 0; border-radius: 999px; padding: 0 13px; color: #fff; background: #292929; cursor: pointer; font: inherit; transition: transform 120ms ease, background 160ms ease; }
[data-motion-pack="upload-complete"] button:active { transform: scale(.97); } [data-motion-pack="upload-complete"] button:disabled { cursor: wait; background: #5d5d5d; }
[data-motion-pack="upload-complete"] .ml-upload-track { height: 7px; overflow: hidden; margin: 18px 0 12px; border-radius: 999px; background: #ebebe9; }
[data-motion-pack="upload-complete"] .ml-upload-track i { display: block; width: var(--upload-progress); height: 100%; border-radius: inherit; background: #292929; transition: width 320ms cubic-bezier(.16,1,.3,1), background 160ms ease; }
[data-motion-pack="upload-complete"][data-state="complete"] .ml-upload-track i { background: #2d8c5f; }
[data-motion-pack="upload-complete"] .ml-upload-assets { display: grid; gap: 7px; margin: 0; padding: 0; list-style: none; }
[data-motion-pack="upload-complete"] .ml-upload-assets li { display: grid; grid-template-columns: 28px 1fr; align-items: center; gap: 9px; min-height: 44px; border-radius: 11px; padding: 6px 9px; background: #f5f5f3; }
[data-motion-pack="upload-complete"] .ml-upload-assets li.is-new { animation: ml-upload-enter 220ms cubic-bezier(.16,1,.3,1) both; }
[data-motion-pack="upload-complete"] .ml-upload-icon { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 8px; color: #fff; background: #5d5d5d; font-size: 16px; }
[data-motion-pack="upload-complete"][data-state="complete"] .ml-upload-icon { background: #2d8c5f; }
@keyframes ml-upload-enter { from { opacity: 0; transform: translateY(6px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="upload-complete"]');
  if (!root) return;
  const action = root.querySelector('[data-upload-action]');
  const state = root.querySelector('[data-upload-state]');
  const track = root.querySelector('[data-upload-progress]');
  const assets = root.querySelector('[data-upload-assets]');
  action.addEventListener('click', () => {
    if (root.dataset.state === 'uploading') return;
    root.dataset.state = 'uploading'; action.disabled = true; action.textContent = 'Uploading'; state.textContent = 'Uploading cover.png';
    root.style.setProperty('--upload-progress', '72%'); track.setAttribute('aria-valuenow', '72');
    window.setTimeout(() => {
      root.dataset.state = 'complete'; root.style.setProperty('--upload-progress', '100%'); track.setAttribute('aria-valuenow', '100');
      state.textContent = 'Cover available'; action.disabled = false; action.textContent = 'Upload another';
      assets.insertAdjacentHTML('beforeend', '<li class="is-new"><span class="ml-upload-icon">✓</span><div><strong>cover.png</strong><small>1.8 MB · Available</small></div></li>');
    }, 420);
  });
})();`
    )
  },
  {
    id: "sync-recovery",
    kind: "sync-recovery",
    groupId: "feedback",
    name: text("同步恢复", "Sync recovery"),
    shortDescription: text("网络恢复后，把本地改动、同步过程和完成结果连成一条清楚的状态线。", "When connectivity returns, connect local edits, syncing progress, and completion through one clear state line."),
    scene: text("离线编辑的项目重新连接到工作区。", "Reconnecting an offline-edited project to its workspace."),
    useCase: text("离线草稿、云端同步、协作工具和自动保存。", "Offline drafts, cloud sync, collaboration tools, and autosave."),
    prompt: text(
      "实现一个同步恢复反馈：网络恢复后，状态从“3 个本地改动”切换为“正在同步”，短暂显示旋转同步图标，随后变为“全部已同步”。保留本地改动数量，并提供减弱动效版本。",
      "Build sync-recovery feedback: when connectivity returns, move from 3 local edits to Syncing, briefly show a rotating sync icon, then land on All synced. Retain the local-change count and provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("恢复连接时先保留本地改动的可见证据。", "When connection returns, keep visible evidence of the local edits first."),
      outcome: text("同步状态在原位置推进到全部已同步。", "The sync state advances in place to All synced."),
      reducedMotion: text("保留状态文字和图标结果，省略旋转。", "Keep state copy and icon outcome while omitting rotation.")
    },
    keywords: ["同步", "离线", "恢复", "连接", "本地改动", "sync", "offline", "recovery", "connection", "local changes"],
    timing: "180ms + 420ms sync window · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-sync-recovery" data-motion-pack="sync-recovery" data-state="offline" aria-label="Sync recovery">
  <div class="ml-sync-status"><span class="ml-sync-icon" data-sync-icon aria-hidden="true">↻</span><div><strong data-sync-title>3 local edits</strong><small data-sync-copy>Waiting for connection</small></div><button type="button" data-sync-action>Reconnect</button></div>
  <div class="ml-sync-note" role="status" data-sync-note>Changes stay on this device.</div>
</section>`,
      String.raw`[data-motion-pack="sync-recovery"] { width: min(100%, 420px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="sync-recovery"] .ml-sync-status { display: grid; grid-template-columns: 36px 1fr auto; align-items: center; gap: 10px; border: 1px solid #dededc; border-radius: 16px; padding: 13px; background: #fff; }
[data-motion-pack="sync-recovery"] .ml-sync-icon { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; color: #8f651f; background: #fff5de; font-size: 20px; }
[data-motion-pack="sync-recovery"] strong, [data-motion-pack="sync-recovery"] small { display: block; } [data-motion-pack="sync-recovery"] small { margin-top: 2px; color: #9e9e9e; font-size: 12px; }
[data-motion-pack="sync-recovery"] button { min-height: 34px; border: 1px solid #d7d7d4; border-radius: 999px; padding: 0 12px; color: #292929; background: #fff; cursor: pointer; font: inherit; }
[data-motion-pack="sync-recovery"] .ml-sync-note { margin: 8px 5px 0; color: #5d5d5d; font-size: 12px; }
[data-motion-pack="sync-recovery"][data-state="syncing"] .ml-sync-icon { animation: ml-sync-spin 620ms linear infinite; color: #4262b5; background: #edf2ff; }
[data-motion-pack="sync-recovery"][data-state="synced"] .ml-sync-icon { color: #fff; background: #2d8c5f; } [data-motion-pack="sync-recovery"][data-state="synced"] button { color: #2d8c5f; border-color: #cce5d6; }
@keyframes ml-sync-spin { to { transform: rotate(1turn); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="sync-recovery"]');
  if (!root) return;
  const action = root.querySelector('[data-sync-action]');
  const icon = root.querySelector('[data-sync-icon]');
  const title = root.querySelector('[data-sync-title]');
  const copy = root.querySelector('[data-sync-copy]');
  const note = root.querySelector('[data-sync-note]');
  action.addEventListener('click', () => {
    if (root.dataset.state === 'syncing') return;
    root.dataset.state = 'syncing'; action.disabled = true; action.textContent = 'Syncing'; title.textContent = 'Syncing 3 edits'; copy.textContent = 'Connection restored'; note.textContent = 'Keeping your changes visible while they sync.';
    window.setTimeout(() => {
      root.dataset.state = 'synced'; icon.textContent = '✓'; title.textContent = 'All synced'; copy.textContent = 'Workspace is current'; note.textContent = '3 local edits are now available to collaborators.'; action.disabled = false; action.textContent = 'Synced';
    }, 520);
  });
})();`
    )
  },
  {
    id: "delete-confirmation",
    kind: "delete-confirmation",
    groupId: "feedback",
    name: text("删除确认", "Delete confirmation"),
    shortDescription: text("高风险操作通过明确对象、按住进度和完成反馈保持可控。", "A high-risk action stays controllable through a clear target, hold progress, and completion feedback."),
    scene: text("从工作区永久移除一个测试项目。", "Permanently removing a test project from a workspace."),
    useCase: text("删除项目、撤销访问、清空数据和不可逆设置。", "Deleting projects, revoking access, clearing data, and irreversible settings."),
    prompt: text(
      "实现一个删除确认：明确展示将被删除的对象，用户按住“按住删除”约 600ms 后才完成删除。按住时显示进度填充，完成后保留可访问的结果文字和撤销入口。提供减弱动效版本。",
      "Build a delete confirmation: clearly show the target, require holding Hold to delete for about 600ms, show progress fill while held, then retain accessible completion copy and an Undo entry. Provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("先让用户确认对象与不可逆后果。", "First let the user confirm the target and irreversible consequence."),
      outcome: text("按住进度说明确认正在发生，完成后给出明确结果。", "Hold progress shows that confirmation is underway, then provides a clear result."),
      reducedMotion: text("保留按住时长、结果文字和撤销入口，省略填充动画。", "Keep hold duration, result copy, and Undo while omitting fill animation.")
    },
    keywords: ["删除", "确认", "按住", "危险操作", "撤销", "delete", "confirmation", "hold", "destructive", "undo"],
    timing: "600ms hold · linear",
    source: source(
      String.raw`<section class="ml-delete-confirmation" data-motion-pack="delete-confirmation" data-state="ready" aria-label="Delete confirmation">
  <div class="ml-delete-copy"><span>Permanent action</span><strong>Delete “Motion tests”?</strong><p data-delete-status>This removes the project and 12 drafts.</p></div>
  <div class="ml-delete-actions"><button type="button" data-delete-action aria-describedby="delete-help"><i aria-hidden="true"></i><span data-delete-label>Hold to delete</span></button><button type="button" data-delete-undo hidden>Undo</button></div>
  <small id="delete-help">Hold for 0.6 seconds to confirm.</small>
</section>`,
      String.raw`[data-motion-pack="delete-confirmation"] { width: min(100%, 420px); margin: 0 auto; color: #292929; font: 500 13px/1.4 Inter, system-ui, sans-serif; }
[data-motion-pack="delete-confirmation"] .ml-delete-copy { border: 1px solid #ead7d5; border-radius: 16px; padding: 15px; background: #fffafa; }
[data-motion-pack="delete-confirmation"] .ml-delete-copy > span { color: #b54747; font-size: 12px; } [data-motion-pack="delete-confirmation"] strong { display: block; margin-top: 5px; font-size: 16px; letter-spacing: -.15px; }
[data-motion-pack="delete-confirmation"] p { margin: 5px 0 0; color: #5d5d5d; } [data-motion-pack="delete-confirmation"] .ml-delete-actions { display: flex; gap: 8px; margin-top: 11px; }
[data-motion-pack="delete-confirmation"] [data-delete-action] { position: relative; isolation: isolate; overflow: hidden; min-height: 38px; border: 0; border-radius: 999px; padding: 0 15px; color: #fff; background: #b54747; cursor: pointer; font: inherit; }
[data-motion-pack="delete-confirmation"] [data-delete-action] i { position: absolute; z-index: -1; inset: 0 auto 0 0; width: 0; background: rgb(0 0 0 / 20%); transition: width 600ms linear; }
[data-motion-pack="delete-confirmation"][data-state="holding"] [data-delete-action] i { width: 100%; } [data-motion-pack="delete-confirmation"][data-state="deleted"] [data-delete-action] { background: #5d5d5d; cursor: default; }
[data-motion-pack="delete-confirmation"] [data-delete-undo] { min-height: 38px; border: 1px solid #d7d7d4; border-radius: 999px; padding: 0 14px; color: #292929; background: #fff; cursor: pointer; font: inherit; }
[data-motion-pack="delete-confirmation"] small { display: block; margin: 7px 3px 0; color: #9e9e9e; font-size: 12px; }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="delete-confirmation"]');
  if (!root) return;
  const action = root.querySelector('[data-delete-action]');
  const label = root.querySelector('[data-delete-label]');
  const status = root.querySelector('[data-delete-status]');
  const undo = root.querySelector('[data-delete-undo]');
  let timer;
  const clearHold = () => { if (root.dataset.state === 'holding') root.dataset.state = 'ready'; window.clearTimeout(timer); };
  const complete = () => { root.dataset.state = 'deleted'; action.disabled = true; label.textContent = 'Deleted'; status.textContent = 'Motion tests was deleted.'; undo.hidden = false; };
  const beginHold = () => { if (root.dataset.state !== 'ready') return; root.dataset.state = 'holding'; timer = window.setTimeout(complete, 600); };
  action.addEventListener('pointerdown', beginHold); action.addEventListener('pointerup', clearHold); action.addEventListener('pointerleave', clearHold); action.addEventListener('pointercancel', clearHold);
  action.addEventListener('keydown', (event) => { if (event.key === ' ' || event.key === 'Enter') beginHold(); }); action.addEventListener('keyup', clearHold);
  undo.addEventListener('click', () => { root.dataset.state = 'ready'; action.disabled = false; label.textContent = 'Hold to delete'; status.textContent = 'Deletion was undone.'; undo.hidden = true; });
})();`
    )
  },
  {
    id: "assignee-picker",
    kind: "assignee-picker",
    groupId: "choice",
    name: text("负责人选择", "Assignee picker"),
    shortDescription: text("从候选成员中选择负责人时，让触发器、当前人选和候选列表保持同一上下文。", "When choosing an owner from candidates, keep the trigger, current person, and candidate list in one context."),
    scene: text("为一条待完成的设计任务选择负责人。", "Choosing an owner for a pending design task."),
    useCase: text("任务分配、审阅人选择、支持工单和日程安排。", "Task assignment, reviewer choice, support tickets, and scheduling."),
    prompt: text(
      "实现一个负责人选择器：点击当前负责人后在触发器下方展开候选成员，选择一人后替换头像、姓名和状态，并自动收起列表。让选择结果在原位置更新，并提供减弱动效版本。",
      "Build an assignee picker: clicking the current assignee opens candidate members below the trigger; selecting one replaces avatar, name, and status, then closes the list. Update the result in place and provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("当前负责人要始终可见，并能解释选择入口的作用。", "The current assignee should stay visible and explain the purpose of the selection entry."),
      outcome: text("候选列表关闭后，任务顶部保留新负责人的身份与状态。", "After the candidate list closes, the task header retains the new owner identity and status."),
      reducedMotion: text("直接更新负责人文字与头像，保留展开语义。", "Update assignee copy and avatar directly while retaining disclosure semantics.")
    },
    keywords: ["负责人", "分配", "成员", "任务", "选择", "assignee", "assign", "member", "task", "picker"],
    timing: "180ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-assignee-picker" data-motion-pack="assignee-picker" data-open="false" aria-label="Assignee picker">
  <div class="ml-assignee-task"><span>Design review</span><strong>Refine upload flow</strong></div>
  <button type="button" class="ml-assignee-current" data-assignee-trigger aria-expanded="false"><span class="ml-assignee-avatar" data-assignee-avatar>R</span><span><small>Assignee</small><strong data-assignee-name>Rui Yang</strong></span><span aria-hidden="true">⌄</span></button>
  <div class="ml-assignee-menu" data-assignee-menu hidden role="listbox" aria-label="Choose assignee">
    <button type="button" role="option" data-assignee-option data-name="Mina Park" data-initial="M">Mina Park <small>Design</small></button>
    <button type="button" role="option" data-assignee-option data-name="Noah Lee" data-initial="N">Noah Lee <small>Engineering</small></button>
    <button type="button" role="option" data-assignee-option data-name="Rui Yang" data-initial="R">Rui Yang <small>Product</small></button>
  </div>
</section>`,
      String.raw`[data-motion-pack="assignee-picker"] { position: relative; width: min(100%, 390px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="assignee-picker"] .ml-assignee-task { display: grid; gap: 4px; margin-bottom: 11px; } [data-motion-pack="assignee-picker"] .ml-assignee-task span, [data-motion-pack="assignee-picker"] small { color: #9e9e9e; font-size: 12px; }
[data-motion-pack="assignee-picker"] .ml-assignee-current { display: grid; width: 100%; grid-template-columns: 32px 1fr auto; align-items: center; gap: 9px; border: 1px solid #d9d9d6; border-radius: 12px; padding: 8px; color: #292929; background: #fff; cursor: pointer; text-align: left; font: inherit; }
[data-motion-pack="assignee-picker"] .ml-assignee-current strong, [data-motion-pack="assignee-picker"] .ml-assignee-current small { display: block; } [data-motion-pack="assignee-picker"] .ml-assignee-current strong { margin-top: 2px; }
[data-motion-pack="assignee-picker"] .ml-assignee-avatar { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; color: #fff; background: #5569c8; font-size: 12px; transition: transform 180ms cubic-bezier(.16,1,.3,1), background 180ms ease; }
[data-motion-pack="assignee-picker"][data-open="true"] .ml-assignee-avatar { transform: scale(1.06); } [data-motion-pack="assignee-picker"] .ml-assignee-menu { display: grid; gap: 4px; margin-top: 6px; border: 1px solid #dededc; border-radius: 12px; padding: 5px; background: #fff; box-shadow: 0 12px 22px rgb(25 25 25 / 8%); }
[data-motion-pack="assignee-picker"] .ml-assignee-menu:not([hidden]) { animation: ml-assignee-menu 180ms cubic-bezier(.16,1,.3,1) both; } [data-motion-pack="assignee-picker"] .ml-assignee-menu button { display: flex; align-items: center; justify-content: space-between; min-height: 36px; border: 0; border-radius: 8px; padding: 0 9px; color: #292929; background: transparent; cursor: pointer; text-align: left; font: inherit; }
[data-motion-pack="assignee-picker"] .ml-assignee-menu button:hover, [data-motion-pack="assignee-picker"] .ml-assignee-menu button:focus-visible { outline: 0; background: #f2f2f0; } @keyframes ml-assignee-menu { from { opacity: 0; transform: translateY(-4px) scale(.99); } to { opacity: 1; transform: translateY(0) scale(1); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="assignee-picker"]');
  if (!root) return;
  const trigger = root.querySelector('[data-assignee-trigger]');
  const menu = root.querySelector('[data-assignee-menu]');
  const avatar = root.querySelector('[data-assignee-avatar]');
  const name = root.querySelector('[data-assignee-name]');
  trigger.addEventListener('click', () => { const open = root.dataset.open !== 'true'; root.dataset.open = String(open); trigger.setAttribute('aria-expanded', String(open)); menu.hidden = !open; });
  root.querySelectorAll('[data-assignee-option]').forEach((option) => option.addEventListener('click', () => {
    name.textContent = option.dataset.name; avatar.textContent = option.dataset.initial; root.dataset.open = 'false'; trigger.setAttribute('aria-expanded', 'false'); menu.hidden = true;
  }));
})();`
    )
  },
  {
    id: "permission-change",
    kind: "permission-change",
    groupId: "choice",
    name: text("权限变更", "Permission change"),
    shortDescription: text("切换访问范围时，用当前规则、选项说明和保存结果减少误解。", "When access scope changes, use the current rule, option explanation, and saved result to reduce ambiguity."),
    scene: text("为一个公开预览页面设置访问权限。", "Setting access permissions for a public preview page."),
    useCase: text("共享文档、项目链接、团队空间和审批材料。", "Shared documents, project links, team spaces, and approval material."),
    prompt: text(
      "实现一个权限变更选择：用户在“仅受邀成员”和“持有链接的任何人”之间选择，选择后更新说明文字，点击保存后显示已更新状态。保持选项文字完整可读，并提供减弱动效版本。",
      "Build a permission-change choice: let users choose between Invited members only and Anyone with the link, update the explanation after selection, and show an Updated state after saving. Keep option copy fully readable and provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("每个权限选项都要说明可访问的人群。", "Each permission option should state who can access the content."),
      outcome: text("保存后用当前规则和更新时间确认新的范围。", "After saving, use the active rule and updated time to confirm the new scope."),
      reducedMotion: text("保留选中图标、说明和保存结果，省略缩放。", "Keep selected icon, explanation, and save result while omitting scale.")
    },
    keywords: ["权限", "访问", "分享", "链接", "成员", "permission", "access", "share", "link", "members"],
    timing: "160ms · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-permission-change" data-motion-pack="permission-change" data-choice="invite" aria-label="Permission change">
  <div class="ml-permission-head"><div><span>Preview access</span><strong data-permission-title>Invited members only</strong></div><span data-permission-state>Saved</span></div>
  <div class="ml-permission-options" role="radiogroup" aria-label="Access scope">
    <button type="button" role="radio" aria-checked="true" data-permission-option data-value="invite"><i aria-hidden="true">✓</i><span><strong>Invited members only</strong><small>People you add can open this preview.</small></span></button>
    <button type="button" role="radio" aria-checked="false" data-permission-option data-value="link"><i aria-hidden="true">✓</i><span><strong>Anyone with the link</strong><small>Anyone with this URL can view the preview.</small></span></button>
  </div>
  <button type="button" class="ml-permission-save" data-permission-save>Save access</button>
</section>`,
      String.raw`[data-motion-pack="permission-change"] { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="permission-change"] .ml-permission-head { display: flex; align-items: end; justify-content: space-between; gap: 12px; margin-bottom: 10px; } [data-motion-pack="permission-change"] .ml-permission-head span, [data-motion-pack="permission-change"] small { display: block; color: #9e9e9e; font-size: 12px; }
[data-motion-pack="permission-change"] .ml-permission-head strong { display: block; margin-top: 3px; font-size: 15px; } [data-motion-pack="permission-change"] [data-permission-state] { color: #2d8c5f; }
[data-motion-pack="permission-change"] .ml-permission-options { display: grid; gap: 6px; } [data-motion-pack="permission-change"] [data-permission-option] { display: grid; grid-template-columns: 21px minmax(0,1fr); align-items: center; gap: 9px; border: 1px solid #dededc; border-radius: 12px; padding: 10px; color: #292929; background: #fff; cursor: pointer; text-align: left; font: inherit; }
[data-motion-pack="permission-change"] [data-permission-option] i { display: grid; width: 18px; height: 18px; place-items: center; border: 1px solid #c9c9c6; border-radius: 50%; color: transparent; font-size: 11px; font-style: normal; transition: color 160ms ease, background 160ms ease, transform 160ms cubic-bezier(.23,1,.32,1); }
[data-motion-pack="permission-change"] [data-permission-option][aria-checked="true"] { border-color: #9eabdf; background: #f6f8ff; } [data-motion-pack="permission-change"] [data-permission-option][aria-checked="true"] i { color: #fff; background: #4262b5; transform: scale(1.06); }
[data-motion-pack="permission-change"] [data-permission-option] strong { display: block; } [data-motion-pack="permission-change"] [data-permission-option] small { margin-top: 3px; color: #5d5d5d; }
[data-motion-pack="permission-change"] .ml-permission-save { width: 100%; min-height: 38px; margin-top: 10px; border: 0; border-radius: 999px; color: #fff; background: #292929; cursor: pointer; font: inherit; }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="permission-change"]');
  if (!root) return;
  const title = root.querySelector('[data-permission-title]');
  const state = root.querySelector('[data-permission-state]');
  const save = root.querySelector('[data-permission-save]');
  let current = 'invite';
  root.querySelectorAll('[data-permission-option]').forEach((option) => option.addEventListener('click', () => {
    current = option.dataset.value; root.querySelectorAll('[data-permission-option]').forEach((item) => item.setAttribute('aria-checked', String(item === option)));
    title.textContent = current === 'link' ? 'Anyone with the link' : 'Invited members only'; state.textContent = 'Unsaved';
  }));
  save.addEventListener('click', () => { save.disabled = true; save.textContent = 'Saving'; window.setTimeout(() => { state.textContent = 'Updated now'; save.disabled = false; save.textContent = 'Save access'; }, 260); });
})();`
    )
  },
  {
    id: "search-suggestions",
    kind: "search-suggestions",
    groupId: "choice",
    name: text("搜索建议", "Search suggestions"),
    shortDescription: text("输入查询时，让建议、结果数量和已选条目紧贴当前词语变化。", "While a query is entered, let suggestions, result count, and chosen item follow the current terms closely."),
    scene: text("在素材库中查找一份设计规范。", "Finding a design guideline in an asset library."),
    useCase: text("全局搜索、命令面板、客户查找和知识库检索。", "Global search, command menus, customer lookup, and knowledge-base retrieval."),
    prompt: text(
      "实现一个搜索建议表面：输入关键词后，展示匹配建议和结果数量；选择一项后，把它填回输入框并显示已打开状态。建议列表只做短透明度与小位移进入，并提供减弱动效版本。",
      "Build a search-suggestions surface: after typing a query, show matching suggestions and a result count; choosing one fills it back into the field and shows an opened state. Suggestions use only brief opacity and small-travel entrance with a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("搜索词变化时，让结果数量和候选项来自同一个查询。", "When the query changes, derive count and candidates from the same query."),
      outcome: text("选择一条建议后，在输入框附近确认打开的内容。", "After choosing a suggestion, confirm the opened content near the field."),
      reducedMotion: text("建议列表直接更新，保留焦点与结果文字。", "Update the suggestion list directly while retaining focus and result copy.")
    },
    keywords: ["搜索", "建议", "结果", "输入", "命令", "search", "suggestions", "results", "query", "command"],
    timing: "140ms · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-search-suggestions" data-motion-pack="search-suggestions" aria-label="Search suggestions">
  <label>Search library <input type="search" value="motion" data-search-input aria-label="Search library"></label>
  <div class="ml-search-meta"><span data-search-count>3 suggestions</span><span data-search-opened role="status"></span></div>
  <ul data-search-list role="listbox"><li><button type="button" data-search-option>Motion foundations <small>Guide</small></button></li><li><button type="button" data-search-option>Motion system <small>Project</small></button></li><li><button type="button" data-search-option>Motion review <small>Checklist</small></button></li></ul>
</section>`,
      String.raw`[data-motion-pack="search-suggestions"] { width: min(100%, 420px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="search-suggestions"] label { display: grid; gap: 6px; color: #5d5d5d; font-size: 12px; } [data-motion-pack="search-suggestions"] input { min-height: 40px; border: 1px solid #d5d5d2; border-radius: 10px; padding: 0 11px; color: #292929; background: #fff; font: 500 14px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="search-suggestions"] input:focus { outline: 2px solid rgb(66 98 181 / 18%); outline-offset: 1px; } [data-motion-pack="search-suggestions"] .ml-search-meta { display: flex; justify-content: space-between; gap: 10px; margin: 7px 3px; color: #9e9e9e; font-size: 12px; }
[data-motion-pack="search-suggestions"] [data-search-opened] { color: #2d8c5f; } [data-motion-pack="search-suggestions"] ul { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; }
[data-motion-pack="search-suggestions"] li { animation: ml-search-row 140ms cubic-bezier(.16,1,.3,1) both; } [data-motion-pack="search-suggestions"] li:nth-child(2) { animation-delay: 20ms; } [data-motion-pack="search-suggestions"] li:nth-child(3) { animation-delay: 40ms; }
[data-motion-pack="search-suggestions"] li[hidden] { display: none; } [data-motion-pack="search-suggestions"] li button { display: flex; width: 100%; align-items: center; justify-content: space-between; min-height: 36px; border: 0; border-radius: 8px; padding: 0 9px; color: #292929; background: #f5f5f3; cursor: pointer; text-align: left; font: inherit; }
[data-motion-pack="search-suggestions"] li button:hover, [data-motion-pack="search-suggestions"] li button:focus-visible { outline: 0; background: #ececea; } [data-motion-pack="search-suggestions"] small { color: #9e9e9e; font-size: 12px; } @keyframes ml-search-row { from { opacity: 0; transform: translateY(-3px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="search-suggestions"]');
  if (!root) return;
  const input = root.querySelector('[data-search-input]');
  const count = root.querySelector('[data-search-count]');
  const opened = root.querySelector('[data-search-opened]');
  const rows = [...root.querySelectorAll('[data-search-list] li')];
  const update = () => { const query = input.value.trim().toLowerCase(); const visible = rows.filter((row) => { const match = row.textContent.toLowerCase().includes(query); row.hidden = !match; return match; }); count.textContent = visible.length + (visible.length === 1 ? ' suggestion' : ' suggestions'); };
  input.addEventListener('input', update); root.querySelectorAll('[data-search-option]').forEach((option) => option.addEventListener('click', () => { input.value = option.textContent.trim().replace(/(Guide|Project|Checklist)$/, '').trim(); opened.textContent = 'Opened'; update(); }));
})();`
    )
  },
  {
    id: "kanban-move",
    kind: "kanban-move",
    groupId: "change",
    name: text("看板移动", "Kanban move"),
    shortDescription: text("任务跨列移动时，让拾取、目标列和完成计数共同说明它的新位置。", "When a task crosses columns, let pickup, target column, and completion count explain its new location together."),
    scene: text("把一项设计任务从“待处理”移到“进行中”。", "Moving a design task from To do to In progress."),
    useCase: text("项目看板、工单状态、招聘流程和内容排期。", "Project boards, ticket state, hiring pipelines, and content scheduling."),
    prompt: text(
      "实现一个看板移动：任务卡可以拖到相邻列，也可以通过按钮移动。拖动时强调拾取状态，落下后任务进入目标列并更新列计数。保持两列布局稳定，并提供减弱动效版本。",
      "Build a Kanban move: a task can be dragged to the adjacent column or moved with a button. Emphasize pickup while dragging; after drop, place the task in the target column and update column counts. Keep both columns stable and provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("拖动开始后，清楚表达当前被拾取的任务。", "Once dragging begins, clearly identify the task being picked up."),
      outcome: text("落点列和列计数一起确认任务的新位置。", "The destination column and its count jointly confirm the task's new position."),
      reducedMotion: text("保留移动结果和计数变化，省略拖动时的透明度与缩放。", "Keep the moved result and count changes while omitting drag opacity and scale.")
    },
    keywords: ["看板", "拖动", "移动", "任务", "列", "kanban", "drag", "move", "task", "board"],
    timing: "180ms settle · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-kanban-move" data-motion-pack="kanban-move" aria-label="Kanban move">
  <div class="ml-kanban-board"><section data-kanban-column="todo"><header><span>To do</span><b data-kanban-count="todo">1</b></header><div class="ml-kanban-list" data-kanban-list="todo"><article draggable="true" data-kanban-card><strong>Refine upload flow</strong><small>Design · Today</small></article></div></section><section data-kanban-column="progress"><header><span>In progress</span><b data-kanban-count="progress">0</b></header><div class="ml-kanban-list" data-kanban-list="progress"></div></section></div>
  <button type="button" data-kanban-move>Move to In progress <span aria-hidden="true">→</span></button>
</section>`,
      String.raw`[data-motion-pack="kanban-move"] { width: min(100%, 460px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="kanban-move"] .ml-kanban-board { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; } [data-motion-pack="kanban-move"] [data-kanban-column] { min-height: 126px; border: 1px solid #dededc; border-radius: 14px; padding: 9px; background: #f7f7f5; }
[data-motion-pack="kanban-move"] header { display: flex; align-items: center; justify-content: space-between; color: #5d5d5d; font-size: 12px; } [data-motion-pack="kanban-move"] header b { display: grid; width: 20px; height: 20px; place-items: center; border-radius: 50%; color: #5d5d5d; background: #ececea; font-size: 11px; }
[data-motion-pack="kanban-move"] .ml-kanban-list { display: grid; min-height: 82px; align-content: start; gap: 6px; margin-top: 8px; border-radius: 9px; transition: background 140ms ease; } [data-motion-pack="kanban-move"] .ml-kanban-list.is-over { background: #edf2ff; }
[data-motion-pack="kanban-move"] article { display: grid; gap: 4px; border: 1px solid #dcdcd9; border-radius: 10px; padding: 10px; background: #fff; box-shadow: 0 3px 8px rgb(25 25 25 / 5%); cursor: grab; transition: opacity 120ms ease, transform 180ms cubic-bezier(.16,1,.3,1); }
[data-motion-pack="kanban-move"] article.is-dragging { opacity: .45; transform: scale(.97); } [data-motion-pack="kanban-move"] article.is-moved { animation: ml-kanban-land 180ms cubic-bezier(.16,1,.3,1) both; } [data-motion-pack="kanban-move"] small { color: #9e9e9e; font-size: 12px; }
[data-motion-pack="kanban-move"] [data-kanban-move] { display: flex; width: 100%; min-height: 38px; align-items: center; justify-content: space-between; margin-top: 10px; border: 0; border-radius: 999px; padding: 0 14px; color: #fff; background: #292929; cursor: pointer; font: inherit; } @keyframes ml-kanban-land { from { opacity: 0; transform: translateY(7px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="kanban-move"]');
  if (!root) return;
  const card = root.querySelector('[data-kanban-card]');
  const lists = [...root.querySelectorAll('[data-kanban-list]')];
  const action = root.querySelector('[data-kanban-move]');
  let location = 'todo';
  const update = (next) => {
    location = next; const list = root.querySelector('[data-kanban-list="' + next + '"]'); list.append(card); card.classList.remove('is-moved'); void card.offsetWidth; card.classList.add('is-moved');
    root.querySelector('[data-kanban-count="todo"]').textContent = next === 'todo' ? '1' : '0'; root.querySelector('[data-kanban-count="progress"]').textContent = next === 'progress' ? '1' : '0';
    action.innerHTML = next === 'todo' ? 'Move to In progress <span aria-hidden="true">→</span>' : 'Move back to To do <span aria-hidden="true">←</span>';
  };
  card.addEventListener('dragstart', () => card.classList.add('is-dragging')); card.addEventListener('dragend', () => { card.classList.remove('is-dragging'); lists.forEach((list) => list.classList.remove('is-over')); });
  lists.forEach((list) => { list.addEventListener('dragover', (event) => { event.preventDefault(); list.classList.add('is-over'); }); list.addEventListener('dragleave', () => list.classList.remove('is-over')); list.addEventListener('drop', (event) => { event.preventDefault(); list.classList.remove('is-over'); update(list.dataset.kanbanList); }); });
  action.addEventListener('click', () => update(location === 'todo' ? 'progress' : 'todo'));
})();`
    )
  },
  {
    id: "cart-update",
    kind: "cart-update",
    groupId: "change",
    name: text("购物车更新", "Cart update"),
    shortDescription: text("调整数量后，把商品行、件数和小计同步为一个即时的购买状态。", "After quantity changes, synchronize the item row, item count, and subtotal into one immediate purchase state."),
    scene: text("在结账前调整一件团队模板的数量。", "Adjusting the quantity of a team template before checkout."),
    useCase: text("购物车、订阅席位、订单编辑和配件数量。", "Carts, subscription seats, order edits, and accessory quantity."),
    prompt: text(
      "实现一个购物车更新：点击加减按钮后，数量、小计和购物车件数同时更新。让数值在原位置短促变化，按钮保留按压反馈，避免页面整体跳动，并提供减弱动效版本。",
      "Build a cart update: clicking plus or minus updates quantity, subtotal, and cart count together. Let numbers change briefly in place, retain press feedback on buttons, avoid whole-page movement, and provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("数量操作必须在商品行内立即确认。", "Quantity actions must confirm immediately inside the item row."),
      outcome: text("数量、件数和小计都来自同一个数量值。", "Quantity, item count, and subtotal all derive from one quantity value."),
      reducedMotion: text("保留数值变化与禁用状态，省略数字缩放。", "Keep number changes and disabled state while omitting digit scale.")
    },
    keywords: ["购物车", "数量", "小计", "订单", "席位", "cart", "quantity", "subtotal", "order", "seats"],
    timing: "140ms · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-cart-update" data-motion-pack="cart-update" aria-label="Cart update">
  <div class="ml-cart-line"><div class="ml-cart-thumb" aria-hidden="true"></div><div><strong>Motion review template</strong><small>$18 per seat</small></div><div class="ml-cart-quantity"><button type="button" data-cart-minus aria-label="Decrease quantity">−</button><output data-cart-quantity>2</output><button type="button" data-cart-plus aria-label="Increase quantity">+</button></div></div>
  <div class="ml-cart-total"><span><span data-cart-count>2</span> seats</span><strong data-cart-subtotal>$36</strong></div>
</section>`,
      String.raw`[data-motion-pack="cart-update"] { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="cart-update"] .ml-cart-line { display: grid; grid-template-columns: 42px minmax(0,1fr) auto; align-items: center; gap: 10px; border: 1px solid #dededc; border-radius: 16px; padding: 11px; background: #fff; }
[data-motion-pack="cart-update"] .ml-cart-thumb { width: 42px; height: 42px; border-radius: 10px; background: linear-gradient(135deg,#6b7fd2,#dce3ff); } [data-motion-pack="cart-update"] strong, [data-motion-pack="cart-update"] small { display: block; } [data-motion-pack="cart-update"] small { margin-top: 3px; color: #9e9e9e; font-size: 12px; }
[data-motion-pack="cart-update"] .ml-cart-quantity { display: inline-grid; grid-template-columns: 30px 28px 30px; align-items: center; border: 1px solid #d8d8d5; border-radius: 999px; overflow: hidden; } [data-motion-pack="cart-update"] .ml-cart-quantity button { height: 30px; border: 0; color: #292929; background: #fff; cursor: pointer; font: inherit; }
[data-motion-pack="cart-update"] .ml-cart-quantity button:active { background: #f0f0ee; transform: scale(.94); } [data-motion-pack="cart-update"] output { text-align: center; font-variant-numeric: tabular-nums; } [data-motion-pack="cart-update"] output.is-changing, [data-motion-pack="cart-update"] [data-cart-subtotal].is-changing { animation: ml-cart-number 140ms cubic-bezier(.23,1,.32,1) both; }
[data-motion-pack="cart-update"] .ml-cart-total { display: flex; align-items: center; justify-content: space-between; margin: 10px 4px 0; color: #5d5d5d; } [data-motion-pack="cart-update"] .ml-cart-total strong { color: #292929; font-size: 16px; font-variant-numeric: tabular-nums; } @keyframes ml-cart-number { from { opacity: .45; transform: translateY(3px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="cart-update"]');
  if (!root) return;
  const quantity = root.querySelector('[data-cart-quantity]');
  const count = root.querySelector('[data-cart-count]');
  const subtotal = root.querySelector('[data-cart-subtotal]');
  let value = 2;
  const update = (next) => { value = Math.max(1, next); quantity.textContent = String(value); count.textContent = String(value); subtotal.textContent = '$' + String(value * 18); [quantity, subtotal].forEach((node) => { node.classList.remove('is-changing'); void node.offsetWidth; node.classList.add('is-changing'); }); };
  root.querySelector('[data-cart-minus]').addEventListener('click', () => update(value - 1)); root.querySelector('[data-cart-plus]').addEventListener('click', () => update(value + 1));
})();`
    )
  },
  {
    id: "comment-reply",
    kind: "comment-reply",
    groupId: "change",
    name: text("评论回复", "Comment reply"),
    shortDescription: text("提交回复后，让输入区收束为一条带身份和时间的讨论记录。", "After a reply is submitted, let the input area resolve into a discussion record with identity and time."),
    scene: text("在设计评审中回复一条关于按钮节奏的评论。", "Replying to a comment about button cadence in a design review."),
    useCase: text("评论线程、代码审阅、客服回复和团队讨论。", "Comment threads, code review, support replies, and team discussion."),
    prompt: text(
      "实现一个评论回复：用户输入后点击回复，按钮短暂进入发送状态，评论线程底部插入带头像、姓名和“刚刚”时间的回复。保留输入焦点与后续继续回复能力，并提供减弱动效版本。",
      "Build a comment reply: after input and Reply, briefly enter a sending state, then insert a reply with avatar, name, and Just now at the bottom of the thread. Retain input focus and the ability to continue replying, with a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("回复提交前，让发送按钮清楚表达当前动作。", "Before submission, let the send action clearly express the current action."),
      outcome: text("新回复进入同一线程，并带出可追踪的身份与时间。", "The new reply enters the same thread with traceable identity and time."),
      reducedMotion: text("直接插入回复并更新状态文字，保留阅读顺序。", "Insert the reply directly and update status copy while retaining reading order.")
    },
    keywords: ["评论", "回复", "讨论", "线程", "发送", "comment", "reply", "discussion", "thread", "send"],
    timing: "180ms + 220ms send · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-comment-reply" data-motion-pack="comment-reply" aria-label="Comment reply">
  <ol data-reply-thread><li><span class="ml-reply-avatar">M</span><div><strong>Mina Park <small>2m</small></strong><p>Could the save state land a little sooner?</p></div></li></ol>
  <div class="ml-reply-compose"><textarea data-reply-input rows="2" aria-label="Reply" placeholder="Write a reply">I’ll tighten the final settle.</textarea><button type="button" data-reply-action>Reply</button></div><p data-reply-status role="status"></p>
</section>`,
      String.raw`[data-motion-pack="comment-reply"] { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.4 Inter, system-ui, sans-serif; }
[data-motion-pack="comment-reply"] ol { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; } [data-motion-pack="comment-reply"] li { display: grid; grid-template-columns: 29px minmax(0,1fr); gap: 8px; }
[data-motion-pack="comment-reply"] li.is-new { animation: ml-reply-enter 180ms cubic-bezier(.16,1,.3,1) both; } [data-motion-pack="comment-reply"] .ml-reply-avatar { display: grid; width: 29px; height: 29px; place-items: center; border-radius: 50%; color: #fff; background: #7d8fd8; font-size: 11px; }
[data-motion-pack="comment-reply"] strong { display: block; } [data-motion-pack="comment-reply"] small { margin-left: 4px; color: #9e9e9e; font-size: 11px; font-weight: 500; } [data-motion-pack="comment-reply"] p { margin: 3px 0 0; color: #5d5d5d; }
[data-motion-pack="comment-reply"] .ml-reply-compose { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 8px; margin-top: 12px; } [data-motion-pack="comment-reply"] textarea { resize: vertical; min-height: 50px; border: 1px solid #d7d7d4; border-radius: 10px; padding: 8px 9px; color: #292929; font: inherit; }
[data-motion-pack="comment-reply"] textarea:focus { outline: 2px solid rgb(66 98 181 / 18%); outline-offset: 1px; } [data-motion-pack="comment-reply"] button { align-self: end; min-height: 36px; border: 0; border-radius: 999px; padding: 0 14px; color: #fff; background: #292929; cursor: pointer; font: inherit; } [data-motion-pack="comment-reply"] [data-reply-status] { min-height: 16px; margin: 5px 2px 0; color: #b54747; font-size: 12px; }
@keyframes ml-reply-enter { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="comment-reply"]');
  if (!root) return;
  const input = root.querySelector('[data-reply-input]');
  const action = root.querySelector('[data-reply-action]');
  const thread = root.querySelector('[data-reply-thread]');
  const status = root.querySelector('[data-reply-status]');
  action.addEventListener('click', () => {
    const value = input.value.trim(); if (!value) { status.textContent = 'Write a reply before sending.'; input.focus(); return; }
    action.disabled = true; action.textContent = 'Sending'; status.textContent = '';
    window.setTimeout(() => { thread.insertAdjacentHTML('beforeend', '<li class="is-new"><span class="ml-reply-avatar">R</span><div><strong>Rui Yang <small>Just now</small></strong><p></p></div></li>'); thread.lastElementChild.querySelector('p').textContent = value; input.value = ''; action.disabled = false; action.textContent = 'Reply'; input.focus(); }, 280);
  });
})();`
    )
  },
  {
    id: "approval-request",
    kind: "approval-request",
    groupId: "workflow",
    name: text("请求审批", "Approval request"),
    shortDescription: text("发起审批时，让提交动作、审批人队列和当前等待状态形成连续工作流。", "When approval is requested, connect submission, the approver queue, and the current waiting state into one workflow."),
    scene: text("把一份发布说明提交给两位审批人。", "Submitting release notes to two approvers."),
    useCase: text("设计评审、内容发布、采购申请和访问请求。", "Design review, content publishing, purchase requests, and access requests."),
    prompt: text(
      "实现一个请求审批：点击“请求审批”后，按钮进入短暂提交状态，审批人列表依次变为“等待回复”，顶部状态切换为“已发送给 2 位审批人”。动作只编排关键状态，并提供减弱动效版本。",
      "Build an approval request: after Request approval, briefly show submission, let approver rows become Awaiting response in sequence, and change the top state to Sent to 2 approvers. Sequence only the key states and provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("发起动作要明确审批范围和参与人数量。", "The request action should make approval scope and participant count clear."),
      outcome: text("审批人行按小间隔进入等待状态，顶部汇总同步更新。", "Approver rows enter awaiting state at short intervals while the summary updates."),
      reducedMotion: text("直接更新所有审批状态与汇总文字。", "Update all approval states and summary copy directly.")
    },
    keywords: ["审批", "请求", "评审", "等待", "状态", "approval", "request", "review", "awaiting", "workflow"],
    timing: "200ms + 70ms stagger · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-approval-request" data-motion-pack="approval-request" data-state="draft" aria-label="Approval request">
  <div class="ml-approval-head"><div><span>Release notes</span><strong data-approval-summary>Draft · 2 approvers</strong></div><span data-approval-state>Ready</span></div>
  <ul data-approval-list><li><span class="ml-approval-avatar">M</span><div><strong>Mina Park</strong><small>Design</small></div><em>Not requested</em></li><li><span class="ml-approval-avatar">N</span><div><strong>Noah Lee</strong><small>Engineering</small></div><em>Not requested</em></li></ul>
  <button type="button" data-approval-action>Request approval <span aria-hidden="true">→</span></button>
</section>`,
      String.raw`[data-motion-pack="approval-request"] { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="approval-request"] .ml-approval-head { display: flex; align-items: end; justify-content: space-between; gap: 12px; margin-bottom: 10px; } [data-motion-pack="approval-request"] .ml-approval-head span, [data-motion-pack="approval-request"] small { display: block; color: #9e9e9e; font-size: 12px; }
[data-motion-pack="approval-request"] .ml-approval-head strong { display: block; margin-top: 3px; font-size: 15px; } [data-motion-pack="approval-request"] [data-approval-state] { color: #5d5d5d; }
[data-motion-pack="approval-request"] ul { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; } [data-motion-pack="approval-request"] li { display: grid; grid-template-columns: 28px minmax(0,1fr) auto; align-items: center; gap: 8px; border-radius: 10px; padding: 7px 9px; background: #f5f5f3; }
[data-motion-pack="approval-request"] li.is-requested { animation: ml-approval-row 200ms cubic-bezier(.16,1,.3,1) both; } [data-motion-pack="approval-request"] .ml-approval-avatar { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 50%; color: #fff; background: #6679cf; font-size: 11px; }
[data-motion-pack="approval-request"] li strong { display: block; } [data-motion-pack="approval-request"] em { color: #7f651f; font-size: 12px; font-style: normal; } [data-motion-pack="approval-request"] li.is-requested em { color: #4262b5; }
[data-motion-pack="approval-request"] button { display: flex; width: 100%; min-height: 38px; align-items: center; justify-content: space-between; margin-top: 10px; border: 0; border-radius: 999px; padding: 0 14px; color: #fff; background: #292929; cursor: pointer; font: inherit; } [data-motion-pack="approval-request"] button:disabled { background: #5d5d5d; cursor: wait; }
@keyframes ml-approval-row { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="approval-request"]');
  if (!root) return;
  const action = root.querySelector('[data-approval-action]');
  const summary = root.querySelector('[data-approval-summary]');
  const state = root.querySelector('[data-approval-state]');
  const rows = [...root.querySelectorAll('[data-approval-list] li')];
  action.addEventListener('click', () => {
    if (root.dataset.state !== 'draft') return;
    root.dataset.state = 'requesting'; action.disabled = true; action.textContent = 'Sending request'; state.textContent = 'Sending';
    rows.forEach((row, index) => window.setTimeout(() => { row.classList.add('is-requested'); row.querySelector('em').textContent = 'Awaiting response'; }, 170 + index * 70));
    window.setTimeout(() => { root.dataset.state = 'requested'; summary.textContent = 'Sent · 2 approvers'; state.textContent = 'Awaiting'; action.disabled = false; action.textContent = 'Request sent'; }, 390);
  });
})();`
    )
  },
  {
    id: "checkout-payment",
    kind: "checkout-payment",
    groupId: "workflow",
    name: text("支付结账", "Checkout payment"),
    shortDescription: text("付款提交后，用处理中状态和收据结果缩短支付流程的不确定感。", "After payment is submitted, use a processing state and receipt result to reduce uncertainty in checkout."),
    scene: text("为团队购买一份动效评审模板。", "Buying a motion-review template for a team."),
    useCase: text("单次购买、订阅升级、发票支付和订单确认。", "One-time purchases, subscription upgrades, invoice payments, and order confirmation."),
    prompt: text(
      "实现一个支付结账：点击“支付 36 美元”后，按钮显示处理中，订单摘要保持可见；完成后切换为付款成功并展示订单编号。等待过程只使用短循环图标和状态文字，并提供减弱动效版本。",
      "Build checkout payment: after Pay $36, show processing while the order summary stays visible; on completion, switch to Payment successful and show an order number. Use only a brief looping icon and state copy while waiting, with a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("支付开始时保留金额和订单内容，避免用户失去上下文。", "When payment starts, retain price and order contents so the user keeps context."),
      outcome: text("成功结果包含金额、订单号和后续可查看的收据。", "The success result includes amount, order number, and a receipt that can be viewed next."),
      reducedMotion: text("保留处理中和成功文字，省略旋转图标。", "Keep processing and success copy while omitting icon rotation.")
    },
    keywords: ["支付", "结账", "订单", "收据", "处理中", "payment", "checkout", "order", "receipt", "processing"],
    timing: "180ms + 480ms payment window · cubic-bezier(0.23, 1, 0.32, 1)",
    source: source(
      String.raw`<section class="ml-checkout-payment" data-motion-pack="checkout-payment" data-state="ready" aria-label="Checkout payment">
  <div class="ml-payment-order"><div><span>Motion review template</span><small>2 team seats</small></div><strong>$36</strong></div>
  <div class="ml-payment-result" role="status"><span class="ml-payment-icon" data-payment-icon aria-hidden="true">◌</span><span data-payment-copy>Ready to pay securely</span></div>
  <button type="button" data-payment-action><span data-payment-label>Pay $36</span><span aria-hidden="true">→</span></button>
</section>`,
      String.raw`[data-motion-pack="checkout-payment"] { width: min(100%, 400px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="checkout-payment"] .ml-payment-order { display: flex; align-items: center; justify-content: space-between; gap: 14px; border: 1px solid #dededc; border-radius: 16px 16px 10px 10px; padding: 15px; background: #fff; } [data-motion-pack="checkout-payment"] .ml-payment-order span, [data-motion-pack="checkout-payment"] small { display: block; }
[data-motion-pack="checkout-payment"] small { margin-top: 3px; color: #9e9e9e; font-size: 12px; } [data-motion-pack="checkout-payment"] .ml-payment-order strong { font-size: 17px; font-variant-numeric: tabular-nums; }
[data-motion-pack="checkout-payment"] .ml-payment-result { display: flex; align-items: center; gap: 7px; padding: 10px 12px; border: 1px solid #dededc; border-top: 0; border-radius: 0 0 10px 10px; color: #5d5d5d; font-size: 12px; }
[data-motion-pack="checkout-payment"] .ml-payment-icon { display: grid; width: 17px; height: 17px; place-items: center; border-radius: 50%; color: #4262b5; font-size: 17px; } [data-motion-pack="checkout-payment"][data-state="processing"] .ml-payment-icon { animation: ml-payment-spin 620ms linear infinite; }
[data-motion-pack="checkout-payment"][data-state="success"] .ml-payment-icon { color: #2d8c5f; } [data-motion-pack="checkout-payment"][data-state="success"] .ml-payment-result { color: #2d8c5f; border-color: #cce5d6; background: #f5fbf7; }
[data-motion-pack="checkout-payment"] button { display: flex; width: 100%; min-height: 40px; align-items: center; justify-content: space-between; margin-top: 10px; border: 0; border-radius: 999px; padding: 0 15px; color: #fff; background: #292929; cursor: pointer; font: inherit; } [data-motion-pack="checkout-payment"] button:disabled { background: #5d5d5d; cursor: wait; } @keyframes ml-payment-spin { to { transform: rotate(1turn); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="checkout-payment"]');
  if (!root) return;
  const action = root.querySelector('[data-payment-action]');
  const label = root.querySelector('[data-payment-label]');
  const icon = root.querySelector('[data-payment-icon]');
  const copy = root.querySelector('[data-payment-copy]');
  action.addEventListener('click', () => {
    if (root.dataset.state !== 'ready') return;
    root.dataset.state = 'processing'; action.disabled = true; label.textContent = 'Processing payment'; copy.textContent = 'Confirming your payment';
    window.setTimeout(() => { root.dataset.state = 'success'; action.disabled = false; label.textContent = 'View receipt'; icon.textContent = '✓'; copy.textContent = 'Payment successful · Order #ML-2048'; }, 560);
  });
})();`
    )
  },
  {
    id: "scheduled-publish",
    kind: "scheduled-publish",
    groupId: "workflow",
    name: text("定时发布", "Scheduled publish"),
    shortDescription: text("为未来发布设置时间后，让发布时间、队列记录和可编辑状态彼此一致。", "After scheduling a future release, keep publish time, queue record, and editable state consistent."),
    scene: text("为一篇产品更新安排下周一上午发布。", "Scheduling a product update for Monday morning."),
    useCase: text("内容发布、邮件发送、社交媒体排期和报告生成。", "Content publishing, email sends, social scheduling, and report generation."),
    prompt: text(
      "实现一个定时发布：用户选择日期和时间后点击“安排发布”，按钮短暂确认，页面顶部切换为已安排状态，下面插入一条带发布时间的队列记录。让新增记录在小位移中进入，并提供减弱动效版本。",
      "Build scheduled publish: after choosing date and time and clicking Schedule publish, briefly acknowledge the action, switch the top state to Scheduled, and insert a queue record with publish time below. Let the new record enter with small travel and provide a reduced-motion treatment."
    ),
    guidance: {
      trigger: text("安排前要让用户看见明确的日期、时间和时区。", "Before scheduling, let users see an explicit date, time, and timezone."),
      outcome: text("状态和队列记录使用同一个发布时间，方便后续编辑。", "Status and queue record use the same publish time for easy follow-up editing."),
      reducedMotion: text("直接插入队列记录，保留发布时间和编辑入口。", "Insert the queue record directly while retaining publish time and edit entry.")
    },
    keywords: ["定时", "发布", "排期", "时间", "队列", "scheduled", "publish", "schedule", "time", "queue"],
    timing: "200ms + 180ms record · cubic-bezier(0.16, 1, 0.3, 1)",
    source: source(
      String.raw`<section class="ml-scheduled-publish" data-motion-pack="scheduled-publish" data-state="draft" aria-label="Scheduled publish">
  <div class="ml-schedule-head"><div><span>Product update</span><strong data-schedule-title>Choose a publish time</strong></div><span data-schedule-state>Draft</span></div>
  <div class="ml-schedule-inputs"><label>Date <input type="date" value="2026-08-03" data-schedule-date></label><label>Time <input type="time" value="09:30" data-schedule-time></label></div>
  <button type="button" data-schedule-action>Schedule publish <span aria-hidden="true">→</span></button>
  <ol data-schedule-list aria-label="Publish queue"></ol>
</section>`,
      String.raw`[data-motion-pack="scheduled-publish"] { width: min(100%, 430px); margin: 0 auto; color: #292929; font: 500 13px/1.35 Inter, system-ui, sans-serif; }
[data-motion-pack="scheduled-publish"] .ml-schedule-head { display: flex; align-items: end; justify-content: space-between; gap: 12px; margin-bottom: 11px; } [data-motion-pack="scheduled-publish"] .ml-schedule-head span { display: block; color: #9e9e9e; font-size: 12px; } [data-motion-pack="scheduled-publish"] .ml-schedule-head strong { display: block; margin-top: 3px; font-size: 15px; }
[data-motion-pack="scheduled-publish"] [data-schedule-state] { color: #5d5d5d; } [data-motion-pack="scheduled-publish"][data-state="scheduled"] [data-schedule-state] { color: #2d8c5f; }
[data-motion-pack="scheduled-publish"] .ml-schedule-inputs { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; } [data-motion-pack="scheduled-publish"] label { display: grid; gap: 5px; color: #5d5d5d; font-size: 12px; }
[data-motion-pack="scheduled-publish"] input { box-sizing: border-box; min-width: 0; min-height: 37px; border: 1px solid #d7d7d4; border-radius: 9px; padding: 0 8px; color: #292929; background: #fff; font: inherit; }
[data-motion-pack="scheduled-publish"] button { display: flex; width: 100%; min-height: 38px; align-items: center; justify-content: space-between; margin-top: 10px; border: 0; border-radius: 999px; padding: 0 14px; color: #fff; background: #292929; cursor: pointer; font: inherit; } [data-motion-pack="scheduled-publish"] button:disabled { background: #5d5d5d; cursor: wait; }
[data-motion-pack="scheduled-publish"] ol { display: grid; gap: 6px; margin: 10px 0 0; padding: 0; list-style: none; } [data-motion-pack="scheduled-publish"] li { display: grid; grid-template-columns: 21px minmax(0,1fr) auto; align-items: center; gap: 8px; border-radius: 10px; padding: 8px; background: #f3f7f4; color: #2d8c5f; }
[data-motion-pack="scheduled-publish"] li.is-new { animation: ml-schedule-enter 180ms cubic-bezier(.16,1,.3,1) both; } [data-motion-pack="scheduled-publish"] li i { display: grid; width: 21px; height: 21px; place-items: center; border-radius: 50%; color: #fff; background: #2d8c5f; font-size: 11px; font-style: normal; } [data-motion-pack="scheduled-publish"] li small { color: #5d5d5d; font-size: 12px; } @keyframes ml-schedule-enter { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`,
      String.raw`(() => {
  const root = document.querySelector('[data-motion-pack="scheduled-publish"]');
  if (!root) return;
  const date = root.querySelector('[data-schedule-date]');
  const time = root.querySelector('[data-schedule-time]');
  const action = root.querySelector('[data-schedule-action]');
  const title = root.querySelector('[data-schedule-title]');
  const state = root.querySelector('[data-schedule-state]');
  const list = root.querySelector('[data-schedule-list]');
  action.addEventListener('click', () => {
    const when = date.value + ' · ' + time.value + ' UTC'; action.disabled = true; action.textContent = 'Scheduling'; state.textContent = 'Saving';
    window.setTimeout(() => { root.dataset.state = 'scheduled'; title.textContent = 'Scheduled for ' + when; state.textContent = 'Scheduled'; action.disabled = false; action.textContent = 'Edit schedule'; list.innerHTML = '<li class="is-new"><i>✓</i><span>Product update</span><small>' + when + '</small></li>'; }, 320);
  });
})();`
    )
  }
];

/**
 * Each link describes a primitive already present in the 44-item canonical
 * catalog. The localized note explains the primitive's concrete contribution
 * within this specific product moment.
 */
const foundationsByMotionPackId: Readonly<
  Record<MotionPackKind, readonly MotionPackFoundation[]>
> = {
  "save-confirmation": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "保存按钮先确认这次点击已被接收。",
      "The save action acknowledges the click before the result arrives."
    ),
    foundation(
      "text-morph",
      "state-change",
      "保存中与已保存的文案在原位置更新。",
      "Saving and Saved update in the same label position."
    ),
    foundation(
      "perceived-performance",
      "state-change",
      "同步状态标记让短暂等待始终可读。",
      "The synchronous state marker keeps the brief wait legible."
    ),
    foundation(
      "duration",
      "timing",
      "按下、保存中和已保存使用短时长，保持反馈紧凑可感知。",
      "Press, saving, and saved use short durations that keep feedback compact and perceptible."
    ),
    foundation(
      "loop",
      "timing",
      "保存中的图标短暂循环，并在结果抵达后停止。",
      "The saving icon loops briefly and stops once the result arrives."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "低动态偏好保留状态文字与颜色结果。",
      "Reduced motion retains the state copy and color result."
    )
  ],
  "publish-release": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "发布按钮先给出动作已接收的反馈。",
      "The Publish action first acknowledges that the request was received."
    ),
    foundation(
      "stagger",
      "sequence",
      "发布状态落定后，时间线记录随后补上。",
      "The timeline record follows after the release state lands."
    ),
    foundation(
      "text-morph",
      "state-change",
      "版本标签与按钮文案同步切到已上线。",
      "The version label and action copy switch to Live together."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效时保留发布结果和时间线记录。",
      "Reduced motion retains the release result and timeline record."
    )
  ],
  "share-link": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "复制动作在原按钮上立刻得到确认。",
      "The copy action is confirmed directly on its original control."
    ),
    foundation(
      "text-morph",
      "state-change",
      "链接图标和按钮文案切换为已复制。",
      "The link icon and button copy switch to Copied."
    ),
    foundation(
      "fade-in-fade-out",
      "entrance",
      "短提示出现后自然离开，不打断后续操作。",
      "A short cue appears and leaves without interrupting the next action."
    )
  ],
  "card-selection": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "每个候选卡片先响应点击，再更新选择。",
      "Each candidate card responds to the click before selection updates."
    ),
    foundation(
      "scale-in",
      "state-change",
      "选中勾选以短促缩放抵达，强调当前决定。",
      "The selected check scales in briefly to emphasize the current decision."
    ),
    foundation(
      "easing",
      "timing",
      "边界和勾选用同一条曲线收束选择状态。",
      "Boundary and check settle the selected state with one easing curve."
    )
  ],
  "workspace-switch": [
    foundation(
      "morph",
      "spatial-continuity",
      "活动底板沿同一标签轨道移动，保留焦点来源。",
      "The active pill moves along one tab track to preserve focus origin."
    ),
    foundation(
      "fade-in-fade-out",
      "state-change",
      "内容表面用极短透明度变化完成视图替换。",
      "The content surface uses a brief opacity change to swap views."
    ),
    foundation(
      "page-transition",
      "spatial-continuity",
      "标签切换维持原工作区上下文中的连续感。",
      "The tab switch maintains continuity within the existing workspace context."
    )
  ],
  "template-choice": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "模板卡片用轻微按压确认选择输入。",
      "Template cards use a light press response to acknowledge selection input."
    ),
    foundation(
      "scale-in",
      "state-change",
      "角标以小幅缩放出现，明确当前模板。",
      "The corner mark scales in slightly to identify the active template."
    ),
    foundation(
      "text-morph",
      "state-change",
      "主按钮在原位置带出当前模板名称。",
      "The primary action adopts the active template name in place."
    ),
    foundation(
      "hover-effect",
      "input-feedback",
      "候选模板在悬停时明确可交互性，点击后保持当前选择。",
      "Candidate templates signal interactivity on hover and retain the current choice after selection."
    )
  ],
  "layer-insertion": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "添加图层按钮先确认这次新增动作。",
      "The Add layer action first acknowledges the insertion request."
    ),
    foundation(
      "slide-in",
      "entrance",
      "新行从极小的下方位移进入最终位置。",
      "The new row enters its final position with very small upward travel."
    ),
    foundation(
      "scale-in",
      "entrance",
      "轻微缩放让新增内容有清晰落点。",
      "A slight scale gives the inserted content a clear landing."
    )
  ],
  "archive-undo": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "归档按钮立即确认移除动作。",
      "The Archive action immediately acknowledges the removal request."
    ),
    foundation(
      "fade-in-fade-out",
      "exit-recovery",
      "任务离开列表时淡出，撤销后回到同一位置。",
      "The task fades out of the list and returns to the same place on Undo."
    ),
    foundation(
      "scale-in",
      "exit-recovery",
      "缩放压低离开动作的视觉重量。",
      "Scale reduces the visual weight of the departure."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效版本保留撤销入口与恢复结果。",
      "The reduced-motion version retains Undo and the restored result."
    )
  ],
  "filter-results": [
    foundation(
      "fade-in-fade-out",
      "state-change",
      "符合条件的卡片以短透明度变化进入结果网格。",
      "Matching cards enter the result grid through a short opacity change."
    ),
    foundation(
      "translate",
      "entrance",
      "新结果从很小的上移距离抵达，保留稳定布局。",
      "New results settle from a very small upward distance while layout stays stable."
    ),
    foundation(
      "text-morph",
      "state-change",
      "结果数量在原位置随筛选范围更新。",
      "The result count updates in place with the active filter scope."
    )
  ],
  "inline-validation": [
    foundation(
      "text-morph",
      "state-change",
      "字段旁的辅助文字随输入结果直接更新。",
      "The nearby helper copy updates directly with the input result."
    ),
    foundation(
      "easing",
      "timing",
      "边界、图标和文字以同一短节奏抵达有效或错误状态。",
      "Boundary, icon, and copy reach valid or invalid state on one short cadence."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "低动态版本保留颜色、图标与说明变化。",
      "The low-motion treatment keeps color, icon, and explanatory changes."
    )
  ],
  "command-menu": [
    foundation(
      "slide-in",
      "entrance",
      "命令面板从触发器下方以很短的位移进入。",
      "The command panel enters below its trigger with very short travel."
    ),
    foundation(
      "scale-in",
      "entrance",
      "轻微缩放帮助紧凑面板落在触发器上下文中。",
      "A slight scale helps the compact panel land in the trigger context."
    ),
    foundation(
      "text-morph",
      "state-change",
      "键盘筛选后，当前高亮项持续表达下一次执行结果。",
      "After keyboard filtering, the active row keeps the next execution clear."
    )
  ],
  "details-disclosure": [
    foundation(
      "accordion-collapse",
      "disclosure",
      "内容高度、箭头和展开状态由同一个触发器协调。",
      "Content height, arrow, and expanded state are coordinated by one trigger."
    ),
    foundation(
      "origin-aware-animation",
      "spatial-continuity",
      "内容从标题行所在的位置打开，保持来源可读。",
      "Content opens from the title row so its origin remains legible."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效时仍保留展开状态与可访问语义。",
      "Reduced motion retains expanded state and accessible semantics."
    )
  ],
  "notification-triage": [
    foundation(
      "fade-in-fade-out",
      "exit-recovery",
      "已处理通知降低层级后离开队列。",
      "A handled notification leaves the queue after its hierarchy recedes."
    ),
    foundation(
      "translate",
      "spatial-continuity",
      "下一条通知轻微补位，维持队列的空间关系。",
      "The next notification fills the space with slight travel to preserve queue context."
    ),
    foundation(
      "text-morph",
      "state-change",
      "剩余待处理数量与队列在原位置同步更新。",
      "The remaining count updates in place with the queue."
    )
  ],
  "progress-steps": [
    foundation(
      "stagger",
      "sequence",
      "完成标记、连接线和下一步按明确顺序推进。",
      "Completion mark, connector, and next step advance in a clear order."
    ),
    foundation(
      "line-drawing",
      "sequence",
      "连接线延展，把步骤之间的进展关系画出来。",
      "The extending connector draws the progress relationship between steps."
    ),
    foundation(
      "text-morph",
      "state-change",
      "右侧任务说明随当前步骤在原位置更新。",
      "The task copy updates in place with the current step."
    ),
    foundation(
      "purposeful-animation",
      "sequence",
      "每一步动作只交代完成、关系和下一步。",
      "Each movement communicates completion, relationship, and the next step."
    )
  ],
  "member-invite": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "发送邀请先确认动作已开始。",
      "The Invite action first confirms that sending has begun."
    ),
    foundation(
      "slide-in",
      "entrance",
      "待加入成员行从列表下方轻量进入。",
      "The pending member row enters lightly from below the list."
    ),
    foundation(
      "text-morph",
      "state-change",
      "按钮文案和成员状态共同表达待接受结果。",
      "Action copy and member status jointly express the pending result."
    )
  ],
  "media-scrub": [
    foundation(
      "translate",
      "continuous-input",
      "播放头的位置由拖动值连续驱动。",
      "The playhead position is driven continuously by the drag value."
    ),
    foundation(
      "easing",
      "timing",
      "拖动采用线性响应，让时间与手势保持一一对应。",
      "Scrubbing responds linearly so time stays one-to-one with the gesture."
    ),
    foundation(
      "frame-rate",
      "continuous-input",
      "连续预览需要保持稳定帧率，避免播放头与画面脱节。",
      "Continuous preview needs stable frame rate so the playhead stays aligned with the frame."
    ),
    foundation(
      "compositing",
      "continuous-input",
      "位置变化优先交给合成友好的属性处理。",
      "Position changes favor compositor-friendly properties."
    )
  ],
  "upload-complete": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "上传按钮在文件处理开始时立即确认输入。",
      "The upload action immediately acknowledges input when file processing starts."
    ),
    foundation(
      "perceived-performance",
      "state-change",
      "进度轨道和处理中状态让短暂等待始终可读。",
      "The progress track and processing state keep the brief wait legible."
    ),
    foundation(
      "text-morph",
      "state-change",
      "上传状态在同一位置从准备切换为可用。",
      "Upload state changes from ready to available in the same location."
    ),
    foundation(
      "scale-in",
      "entrance",
      "新资产行通过轻微缩放和上移抵达列表。",
      "The new asset row lands in the list with slight scale and upward travel."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效时保留进度、可用状态和新资产记录。",
      "Reduced motion retains progress, availability, and the new asset record."
    )
  ],
  "sync-recovery": [
    foundation(
      "text-morph",
      "state-change",
      "本地改动、同步中和全部已同步在原位置更新。",
      "Local edits, Syncing, and All synced update in place."
    ),
    foundation(
      "loop",
      "timing",
      "同步图标只在连接恢复的短窗口内旋转。",
      "The sync icon rotates only during the brief recovery window."
    ),
    foundation(
      "perceived-performance",
      "state-change",
      "持续可见的本地改动数量减轻同步中的不确定感。",
      "The continuously visible local-edit count reduces uncertainty during sync."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效保留同步文字和完成图标，省略旋转。",
      "Reduced motion keeps sync copy and the completion icon while omitting rotation."
    )
  ],
  "delete-confirmation": [
    foundation(
      "hold-to-confirm",
      "input-feedback",
      "按住进度把高风险动作变成可取消的明确确认。",
      "Hold progress turns a high-risk action into deliberate, cancellable confirmation."
    ),
    foundation(
      "duration",
      "timing",
      "固定的 600ms 按住时长表达确认门槛。",
      "A fixed 600ms hold duration communicates the confirmation threshold."
    ),
    foundation(
      "text-morph",
      "state-change",
      "删除前后状态文字在同一说明区更新。",
      "Before-and-after deletion copy updates in the same explanatory area."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效保留按住时长、删除结果和撤销入口。",
      "Reduced motion retains hold duration, deletion result, and Undo."
    )
  ],
  "assignee-picker": [
    foundation(
      "accordion-collapse",
      "disclosure",
      "负责人触发器协调候选列表的展开与收起。",
      "The assignee trigger coordinates expansion and collapse of the candidate list."
    ),
    foundation(
      "origin-aware-animation",
      "spatial-continuity",
      "候选列表从当前负责人下方打开，保留选择来源。",
      "The candidate list opens below the current assignee to preserve selection origin."
    ),
    foundation(
      "text-morph",
      "state-change",
      "负责人姓名在原触发器中替换为新成员。",
      "The assignee name is replaced by the new member in the original trigger."
    ),
    foundation(
      "scale-in",
      "state-change",
      "当前头像的小幅缩放强调刚完成的分配。",
      "A slight avatar scale emphasizes the completed assignment."
    )
  ],
  "permission-change": [
    foundation(
      "scale-in",
      "state-change",
      "选中图标用轻微缩放确认当前访问规则。",
      "The selected icon uses slight scale to confirm the current access rule."
    ),
    foundation(
      "text-morph",
      "state-change",
      "顶部权限摘要随选项在原位置更新。",
      "The top permission summary updates in place with the selected option."
    ),
    foundation(
      "easing",
      "timing",
      "边界与选中图标共享短促的收束曲线。",
      "Boundary and selected icon share a short settling curve."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效保留选中状态、说明和保存结果。",
      "Reduced motion retains selection, explanatory copy, and saved result."
    )
  ],
  "search-suggestions": [
    foundation(
      "slide-in",
      "entrance",
      "建议行以很小的向下位移抵达输入框下方。",
      "Suggestion rows settle below the field with very small downward travel."
    ),
    foundation(
      "stagger",
      "sequence",
      "可见建议以短间隔进入，维持阅读顺序。",
      "Visible suggestions enter at short intervals to preserve reading order."
    ),
    foundation(
      "text-morph",
      "state-change",
      "结果数量由当前查询实时更新。",
      "The result count updates from the current query in real time."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效时建议直接更新，保留焦点和结果文字。",
      "With reduced motion, suggestions update directly while focus and result copy remain."
    )
  ],
  "kanban-move": [
    foundation(
      "drag-to-reorder",
      "input-feedback",
      "拖动中的卡片和目标列明确表达拾取与落点。",
      "The dragged card and destination column clearly express pickup and drop."
    ),
    foundation(
      "translate",
      "spatial-continuity",
      "任务落入相邻列时使用小位移保留空间关系。",
      "The task uses small travel when it lands in the adjacent column to retain spatial context."
    ),
    foundation(
      "scale-in",
      "state-change",
      "落点卡片的小幅缩放强调任务已进入新状态。",
      "A slight scale at the destination emphasizes that the task reached its new state."
    ),
    foundation(
      "compositing",
      "continuous-input",
      "拖动与落点优先使用 transform 和 opacity，减少布局成本。",
      "Drag and landing favor transform and opacity to reduce layout cost."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效保留列、计数和任务位置变化。",
      "Reduced motion retains column, count, and task-position changes."
    )
  ],
  "cart-update": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "加减按钮在每次数量操作时给出立即按压反馈。",
      "Increment and decrement controls give immediate press feedback for every quantity action."
    ),
    foundation(
      "number-ticker",
      "state-change",
      "数量、席位数和小计使用稳定数字共同更新。",
      "Quantity, seat count, and subtotal update together with stable figures."
    ),
    foundation(
      "text-morph",
      "state-change",
      "小计在同一阅读位置切换到新的金额。",
      "Subtotal switches to the new amount in the same reading position."
    ),
    foundation(
      "easing",
      "timing",
      "短促曲线让数字变化快速抵达并收束。",
      "A short curve lets number changes arrive and settle quickly."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效保留数量、金额和最小数量限制。",
      "Reduced motion retains quantity, amount, and the minimum-quantity constraint."
    )
  ],
  "comment-reply": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "回复按钮在发送开始时确认这次提交。",
      "The Reply action confirms the submission when sending begins."
    ),
    foundation(
      "slide-in",
      "entrance",
      "新回复从线程底部以极小位移进入阅读顺序。",
      "The new reply enters the reading order from the thread bottom with very small travel."
    ),
    foundation(
      "text-morph",
      "state-change",
      "按钮文案在回复与发送中之间原位切换。",
      "The action copy switches in place between Reply and Sending."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效时直接插入回复，保留身份和时间。",
      "Reduced motion inserts the reply directly while retaining identity and time."
    )
  ],
  "approval-request": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "请求审批按钮先确认提交已经开始。",
      "The approval-request action first confirms that submission has started."
    ),
    foundation(
      "stagger",
      "sequence",
      "审批人行以短间隔进入等待回复状态。",
      "Approver rows enter Awaiting response at short intervals."
    ),
    foundation(
      "text-morph",
      "state-change",
      "顶部汇总与每位审批人的状态在原位置更新。",
      "The top summary and each approver's state update in place."
    ),
    foundation(
      "purposeful-animation",
      "sequence",
      "整段流程只交代提交、审批范围和等待结果。",
      "The sequence communicates only submission, approval scope, and waiting result."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效时同时更新审批行与汇总状态。",
      "With reduced motion, approval rows and summary state update together."
    )
  ],
  "checkout-payment": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "支付按钮在请求开始时确认点击已接收。",
      "The payment action acknowledges the click when the request starts."
    ),
    foundation(
      "perceived-performance",
      "state-change",
      "订单摘要持续可见，处理中状态降低付款等待的不确定感。",
      "The order summary stays visible while processing state reduces uncertainty during payment."
    ),
    foundation(
      "loop",
      "timing",
      "处理中图标仅在支付窗口内短暂旋转。",
      "The processing icon rotates only briefly during the payment window."
    ),
    foundation(
      "text-morph",
      "state-change",
      "支付按钮和结果文字切换到收据状态。",
      "Payment action and result copy switch to the receipt state."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效保留处理中和付款成功的文字结果。",
      "Reduced motion retains processing and payment-success copy."
    )
  ],
  "scheduled-publish": [
    foundation(
      "press-tap-feedback",
      "input-feedback",
      "安排发布按钮先确认提交日程的动作。",
      "The schedule action first confirms the scheduling request."
    ),
    foundation(
      "text-morph",
      "state-change",
      "页面顶部状态使用所选日期和时间更新为已安排。",
      "The top state updates to Scheduled using the selected date and time."
    ),
    foundation(
      "slide-in",
      "entrance",
      "新的队列记录从极小下方位移进入。",
      "The new queue record enters from very small upward travel."
    ),
    foundation(
      "reduced-motion",
      "motion-preference",
      "减弱动效时直接插入队列记录，保留编辑入口。",
      "Reduced motion inserts the queue record directly while retaining the edit entry."
    )
  ]
};

const canonicalFoundationIds = new Set(
  canonicalMotionCatalog.map((foundation) => foundation.id)
);

for (const pack of motionPackCores) {
  const foundations = foundationsByMotionPackId[pack.id];
  if (!foundations?.length) {
    throw new Error(`Missing motion foundations for pack: ${pack.id}`);
  }
  for (const link of foundations) {
    if (!canonicalFoundationIds.has(link.foundationId)) {
      throw new Error(
        `Unknown canonical motion foundation "${link.foundationId}" for pack: ${pack.id}`
      );
    }
  }
}

export const motionPacks: MotionPack[] = motionPackCores.map((pack) => ({
  ...pack,
  stateLabels: stateLabelsByMotionPackId[pack.id],
  foundations: foundationsByMotionPackId[pack.id]
}));

const motionPackById = new Map<MotionPackKind, MotionPack>(
  motionPacks.map((pack) => [pack.id, pack])
);

const motionPackGroupById = new Map<MotionPackGroupId, MotionPackGroup>(
  motionPackGroups.map((group) => [group.id, group])
);

const motionPackFoundationLinksById = new Map<
  string,
  readonly MotionPackFoundationLink[]
>();

for (const pack of motionPacks) {
  for (const foundation of pack.foundations) {
    const links = motionPackFoundationLinksById.get(foundation.foundationId) ?? [];
    motionPackFoundationLinksById.set(
      foundation.foundationId,
      Object.freeze([...links, { pack, foundation }])
    );
  }
}

export function isMotionPackKind(value: string): value is MotionPackKind {
  return motionPackById.has(value as MotionPackKind);
}

export function getMotionPack(id?: string | null): MotionPack | undefined {
  return id ? motionPackById.get(id as MotionPackKind) : undefined;
}

/** Returns the canonical motion primitives that compose one product moment. */
export function getMotionPackFoundations(
  packOrId?: MotionPack | string | null
): readonly MotionPackFoundation[] {
  const pack =
    typeof packOrId === "string" ? getMotionPack(packOrId) : packOrId;
  return pack?.foundations ?? [];
}

/** Returns every product-moment link that uses one canonical motion primitive. */
export function getMotionPackFoundationLinks(
  foundationId?: string | null
): readonly MotionPackFoundationLink[] {
  return foundationId
    ? motionPackFoundationLinksById.get(foundationId) ?? []
    : [];
}

/** Returns product moments that use one canonical motion primitive. */
export function getMotionPacksForFoundation(
  foundationId?: string | null
): readonly MotionPack[] {
  return getMotionPackFoundationLinks(foundationId).map(({ pack }) => pack);
}

export function getMotionPackGroup(groupId?: string | null): MotionPackGroup | undefined {
  return groupId ? motionPackGroupById.get(groupId as MotionPackGroupId) : undefined;
}

/** Returns every pack when no group is supplied, which keeps gallery callers simple. */
export function getMotionPacksForGroup(groupId?: string): readonly MotionPack[] {
  if (!groupId) return motionPacks;
  return motionPacks.filter((pack) => pack.groupId === groupId);
}

export const motionPacksByGroup: Readonly<Record<MotionPackGroupId, readonly MotionPack[]>> = Object.freeze({
  feedback: getMotionPacksForGroup("feedback"),
  choice: getMotionPacksForGroup("choice"),
  change: getMotionPacksForGroup("change"),
  workflow: getMotionPacksForGroup("workflow")
});
