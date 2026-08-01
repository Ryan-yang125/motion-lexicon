import {
  AlertTriangle,
  Archive,
  ArrowUpRight,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CloudOff,
  Command,
  Copy,
  CreditCard,
  FileText,
  Filter,
  Folder,
  GripVertical,
  Layers3,
  Link,
  Mail,
  MessageCircle,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  UserPlus,
  UserRoundCheck
} from "lucide-react";
import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from "react";

export type MotionPackPreviewKind =
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

export type MotionPackPreviewPack = {
  id: string;
  kind: MotionPackPreviewKind | string;
  name?: unknown;
  scene?: unknown;
};

type PreviewLocale = "zh" | "en";

export type MotionPackPreviewProps = {
  pack: MotionPackPreviewPack;
  compact?: boolean;
  locale?: PreviewLocale;
  className?: string;
};

type Labels = {
  live: string;
  save: string;
  saving: string;
  saved: string;
  publish: string;
  published: string;
  copy: string;
  copied: string;
  selected: string;
  add: string;
  archive: string;
  archived: string;
  undo: string;
  all: string;
  assigned: string;
  validate: string;
  valid: string;
  open: string;
  close: string;
  continue: string;
  complete: string;
  invite: string;
  invited: string;
  play: string;
  pause: string;
  reset: string;
  command: string;
  details: string;
  upload: string;
  uploading: string;
  uploaded: string;
  retry: string;
  syncing: string;
  synced: string;
  recover: string;
  delete: string;
  deleted: string;
  cancel: string;
  restore: string;
  assign: string;
  assignee: string;
  permissions: string;
  viewer: string;
  commenter: string;
  editor: string;
  suggestions: string;
  move: string;
  moved: string;
  cart: string;
  update: string;
  reply: string;
  replied: string;
  approve: string;
  approved: string;
  payment: string;
  pay: string;
  paid: string;
  schedule: string;
  scheduled: string;
};

const zh: Labels = {
  live: "实时预览",
  save: "保存",
  saving: "正在保存",
  saved: "已保存",
  publish: "发布更新",
  published: "已发布",
  copy: "复制链接",
  copied: "已复制",
  selected: "已选择",
  add: "添加图层",
  archive: "归档",
  archived: "已归档",
  undo: "撤销",
  all: "全部",
  assigned: "已分配",
  validate: "检查",
  valid: "格式正确",
  open: "打开",
  close: "关闭",
  continue: "继续",
  complete: "完成",
  invite: "邀请成员",
  invited: "已邀请",
  play: "播放",
  pause: "暂停",
  reset: "重播",
  command: "命令",
  details: "查看详情",
  upload: "上传",
  uploading: "上传中",
  uploaded: "已上传",
  retry: "重试",
  syncing: "正在同步",
  synced: "已同步",
  recover: "恢复同步",
  delete: "删除",
  deleted: "已删除",
  cancel: "取消",
  restore: "恢复",
  assign: "分配",
  assignee: "负责人",
  permissions: "权限",
  viewer: "查看者",
  commenter: "评论者",
  editor: "编辑者",
  suggestions: "建议",
  move: "移动",
  moved: "已移动",
  cart: "购物袋",
  update: "更新",
  reply: "回复",
  replied: "已回复",
  approve: "批准",
  approved: "已批准",
  payment: "付款",
  pay: "付款",
  paid: "已付款",
  schedule: "定时发布",
  scheduled: "已定时"
};

const en: Labels = {
  live: "Live preview",
  save: "Save",
  saving: "Saving",
  saved: "Saved",
  publish: "Publish update",
  published: "Published",
  copy: "Copy link",
  copied: "Copied",
  selected: "Selected",
  add: "Add layer",
  archive: "Archive",
  archived: "Archived",
  undo: "Undo",
  all: "All",
  assigned: "Assigned",
  validate: "Check",
  valid: "Looks good",
  open: "Open",
  close: "Close",
  continue: "Continue",
  complete: "Complete",
  invite: "Invite member",
  invited: "Invited",
  play: "Play",
  pause: "Pause",
  reset: "Replay",
  command: "Command",
  details: "View details",
  upload: "Upload",
  uploading: "Uploading",
  uploaded: "Uploaded",
  retry: "Retry",
  syncing: "Syncing",
  synced: "Synced",
  recover: "Recover sync",
  delete: "Delete",
  deleted: "Deleted",
  cancel: "Cancel",
  restore: "Restore",
  assign: "Assign",
  assignee: "Assignee",
  permissions: "Permissions",
  viewer: "Viewer",
  commenter: "Commenter",
  editor: "Editor",
  suggestions: "Suggestions",
  move: "Move",
  moved: "Moved",
  cart: "Cart",
  update: "Update",
  reply: "Reply",
  replied: "Replied",
  approve: "Approve",
  approved: "Approved",
  payment: "Payment",
  pay: "Pay",
  paid: "Paid",
  schedule: "Schedule",
  scheduled: "Scheduled"
};

function localizedValue(value: unknown, locale: PreviewLocale) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";

  const localized = (value as Record<string, unknown>)[locale]
    ?? (value as Record<string, unknown>)[locale === "zh" ? "en" : "zh"]
    ?? (value as Record<string, unknown>).label
    ?? (value as Record<string, unknown>).name;
  return typeof localized === "string" ? localized : "";
}

function packTitle(pack: MotionPackPreviewPack, locale: PreviewLocale) {
  return localizedValue(pack.name, locale) || localizedValue(pack.scene, locale) || pack.id;
}

function useTransientFlag() {
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const trigger = (duration = 1_200) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setActive(true);
    timerRef.current = window.setTimeout(() => {
      setActive(false);
      timerRef.current = null;
    }, duration);
  };

  return { active, trigger };
}

function PreviewFrame({
  children,
  compact,
  title,
  label,
  kind,
  className
}: {
  children: ReactNode;
  compact: boolean;
  title: string;
  label: string;
  kind: string;
  className?: string;
}) {
  return (
    <section
      className={`motion-pack-preview${compact ? " is-compact" : ""}${className ? ` ${className}` : ""}`}
      data-motion-pack-kind={kind}
      aria-label={`${title} — ${label}`}
    >
      {!compact ? (
        <div className="motion-pack-preview__bar">
          <span className="motion-pack-preview__signal" aria-hidden="true" />
          <span>{label}</span>
          <span className="motion-pack-preview__bar-name">{title}</span>
        </div>
      ) : null}
      <div className="motion-pack-preview__surface motion-pack-scene">{children}</div>
    </section>
  );
}

function TinyButton({
  children,
  label,
  onClick,
  tone = "soft",
  disabled = false
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "soft" | "dark" | "blue" | "ghost" | "danger";
  disabled?: boolean;
}) {
  return (
    <button
      className={`motion-pack-preview__button is-${tone}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {children}
    </button>
  );
}

function SaveConfirmation({ labels, compact }: { labels: Labels; compact: boolean }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const save = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setState("saving");
    timerRef.current = window.setTimeout(() => {
      setState("saved");
      timerRef.current = null;
    }, 460);
  };

  return (
    <div className="mpp-window mpp-save" data-state={state}>
      <div className="mpp-topline"><span>Release notes</span><span className="mpp-draft-dot" /></div>
      <div className="mpp-row mpp-save__body">
        <div><strong>Motion defaults</strong><small>Ready for review</small></div>
        <span className="mpp-status" aria-live="polite">
          {state === "saved" ? <Check aria-hidden="true" size={12} /> : null}
          {state === "saving" ? labels.saving : state === "saved" ? labels.saved : "Draft"}
        </span>
      </div>
      <TinyButton label={state === "saved" ? labels.saved : labels.save} onClick={save} tone="dark">
        {state === "saved" ? <Check aria-hidden="true" size={14} /> : <FileText aria-hidden="true" size={14} />}
        <span>{state === "saving" ? labels.saving : state === "saved" ? labels.saved : labels.save}</span>
      </TinyButton>
      {!compact ? <span className="mpp-screen-reader-status" aria-live="polite">{state === "saved" ? labels.saved : ""}</span> : null}
    </div>
  );
}

function PublishRelease({ labels }: { labels: Labels }) {
  const [published, setPublished] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const publish = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setPublished(true);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
      timerRef.current = null;
    }, 380);
  };

  return (
    <div className="mpp-window mpp-publish" data-published={published || undefined}>
      <div className="mpp-row mpp-publish__headline"><span className="mpp-release-mark"><Sparkles aria-hidden="true" size={14} /></span><div><strong>Version 1.0</strong><small>Public release</small></div></div>
      <div className="mpp-publish__timeline"><i /><i /><i className={published ? "is-complete" : ""} /></div>
      <div className="mpp-row mpp-publish__actions">
        <TinyButton label={published ? labels.published : labels.publish} onClick={publish} tone="dark">
          {published ? <Check aria-hidden="true" size={14} /> : <Send aria-hidden="true" size={14} />}
          <span>{published ? labels.published : labels.publish}</span>
        </TinyButton>
        <TinyButton label={labels.open} onClick={() => setOpen((current) => !current)} tone="ghost" disabled={!published}>
          <ArrowUpRight aria-hidden="true" size={14} />
        </TinyButton>
      </div>
      <span className={`mpp-publish__toast${open ? " is-visible" : ""}`} role="status" aria-live="polite">Live at /v1</span>
    </div>
  );
}

function ShareLink({ labels }: { labels: Labels }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const copy = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setCopied(true);
    timerRef.current = window.setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 1_450);
  };

  return (
    <div className="mpp-window mpp-share" data-copied={copied || undefined}>
      <div className="mpp-share__icon"><Share2 aria-hidden="true" size={16} /></div>
      <strong>Share prototype</strong>
      <p>Anyone with the link can view.</p>
      <div className="mpp-share__url"><Link aria-hidden="true" size={13} /><span>motion.run/p/quiet</span></div>
      <TinyButton label={copied ? labels.copied : labels.copy} onClick={copy} tone={copied ? "blue" : "dark"}>
        {copied ? <Check aria-hidden="true" size={14} /> : <Copy aria-hidden="true" size={14} />}
        <span>{copied ? labels.copied : labels.copy}</span>
      </TinyButton>
      <span className="mpp-screen-reader-status" aria-live="polite">{copied ? labels.copied : ""}</span>
    </div>
  );
}

function CardSelection({ labels }: { labels: Labels }) {
  const choices = ["Quiet", "Editorial", "Playful"];
  const [choice, setChoice] = useState(0);
  const labelId = useId();

  return (
    <div className="mpp-choice">
      <div className="mpp-row"><div><strong>Layout direction</strong><small>{labels.selected}: {choices[choice]}</small></div><span className="mpp-count">3</span></div>
      <div className="mpp-choice__cards" role="radiogroup" aria-labelledby={labelId}>
        <span className="sr-only" id={labelId}>Select a layout direction</span>
        {choices.map((item, index) => (
          <button
            type="button"
            role="radio"
            aria-checked={choice === index}
            aria-label={`${item}${choice === index ? `, ${labels.selected}` : ""}`}
            className={`mpp-choice__card is-${index}${choice === index ? " is-selected" : ""}`}
            key={item}
            onClick={() => setChoice(index)}
          >
            <span className="mpp-choice__sketch" aria-hidden="true"><i /><i /><i /></span>
            <span>{item}</span>
            <Check aria-hidden="true" size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkspaceSwitch({ labels }: { labels: Labels }) {
  const spaces = ["Design", "Build", "Review"];
  const [active, setActive] = useState(0);

  return (
    <div className="mpp-window mpp-workspace">
      <div className="mpp-workspace__switch" role="tablist" aria-label="Workspace">
        {spaces.map((space, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={active === index}
            className={active === index ? "is-active" : ""}
            key={space}
            onClick={() => setActive(index)}
          >{space}</button>
        ))}
      </div>
      <div className="mpp-workspace__content" data-active={active}>
        <div className="mpp-workspace__sidebar"><span /><span /><span className="is-active" /></div>
        <div className="mpp-workspace__pane">
          <span className="mpp-mini-label">{spaces[active]} space</span>
          <strong>{active === 0 ? "Design system" : active === 1 ? "Motion packs" : "Ready to ship"}</strong>
          <div className="mpp-workspace__lines"><i /><i /><i /></div>
        </div>
      </div>
      <span className="mpp-screen-reader-status" aria-live="polite">{spaces[active]} {labels.selected}</span>
    </div>
  );
}

function TemplateChoice({ labels }: { labels: Labels }) {
  const [choice, setChoice] = useState(0);
  const templates = ["Launch", "Brief", "Weekly"];

  return (
    <div className="mpp-template">
      <div className="mpp-row"><div><strong>Choose a starting point</strong><small>Templates with structure</small></div><Folder aria-hidden="true" size={16} /></div>
      <div className="mpp-template__grid">
        {templates.map((template, index) => (
          <button
            type="button"
            key={template}
            className={`${choice === index ? "is-selected" : ""} is-${index}`}
            onClick={() => setChoice(index)}
            aria-pressed={choice === index}
          >
            <span className="mpp-template__sheet" aria-hidden="true"><i /><i /><i /></span>
            <span>{template}</span>
            {choice === index ? <Check aria-hidden="true" size={13} /> : null}
          </button>
        ))}
      </div>
      <div className="mpp-template__result" aria-live="polite"><CheckCircle2 aria-hidden="true" size={14} /> {templates[choice]} {labels.selected.toLowerCase()}</div>
    </div>
  );
}

function LayerInsertion({ labels }: { labels: Labels }) {
  const [layers, setLayers] = useState(["Background", "Title"]);
  const [entering, setEntering] = useState<string | null>(null);

  const addLayer = () => {
    const next = layers.length % 2 ? "Accent" : "Image";
    const id = `${next}-${layers.length}`;
    setEntering(id);
    setLayers((current) => [...current, id]);
    window.requestAnimationFrame(() => setEntering(null));
  };

  return (
    <div className="mpp-window mpp-layers">
      <div className="mpp-row mpp-layers__top"><span><Layers3 aria-hidden="true" size={14} /> Layers</span><TinyButton label={labels.add} onClick={addLayer} tone="ghost"><Plus aria-hidden="true" size={14} /></TinyButton></div>
      <ul aria-live="polite">
        {layers.map((layer, index) => (
          <li className={entering === layer ? "is-entering" : ""} key={layer}>
            <span className={`mpp-layer-color is-${index % 3}`} aria-hidden="true" />
            <strong>{layer.replace(/-\d+$/, "")}</strong>
            <small>{index === 0 ? "base" : index === 1 ? "fade" : "enter"}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArchiveUndo({ labels }: { labels: Labels }) {
  const [archived, setArchived] = useState(false);
  const [restored, setRestored] = useState(false);

  const archive = () => {
    setArchived(true);
    setRestored(false);
  };
  const undo = () => {
    setArchived(false);
    setRestored(true);
  };

  return (
    <div className="mpp-archive" data-archived={archived || undefined}>
      <div className="mpp-task-card">
        <span className="mpp-task-card__icon"><FileText aria-hidden="true" size={14} /></span>
        <div><strong>Motion review</strong><small>4 changes ready</small></div>
        <TinyButton label={labels.archive} onClick={archive} tone="ghost" disabled={archived}><Archive aria-hidden="true" size={14} /></TinyButton>
      </div>
      <div className="mpp-undo" role="status" aria-live="polite">
        <span><Archive aria-hidden="true" size={14} /> {labels.archived}</span>
        <TinyButton label={labels.undo} onClick={undo} tone="soft"><Undo2 aria-hidden="true" size={14} /><span>{labels.undo}</span></TinyButton>
      </div>
      <span className="mpp-restore-note" aria-live="polite">{restored ? <><Check aria-hidden="true" size={13} /> Restored</> : null}</span>
    </div>
  );
}

function FilterResults({ labels }: { labels: Labels }) {
  const [filter, setFilter] = useState<"all" | "assigned">("all");
  const names = filter === "all" ? ["Homepage audit", "Motion glossary", "Release notes"] : ["Motion glossary", "Release notes"];

  return (
    <div className="mpp-window mpp-filter">
      <div className="mpp-row"><div><strong>Issues</strong><small>{names.length} visible</small></div><Filter aria-hidden="true" size={15} /></div>
      <div className="mpp-filter__tabs" role="tablist" aria-label="Filter results">
        <button type="button" role="tab" aria-selected={filter === "all"} className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>{labels.all}</button>
        <button type="button" role="tab" aria-selected={filter === "assigned"} className={filter === "assigned" ? "is-active" : ""} onClick={() => setFilter("assigned")}>{labels.assigned}</button>
      </div>
      <ul className="mpp-filter__list" aria-live="polite">
        {names.map((name, index) => <li key={name}><span className={`mpp-dot is-${index}`} /><span>{name}</span><ChevronRight aria-hidden="true" size={13} /></li>)}
      </ul>
    </div>
  );
}

function InlineValidation({ labels }: { labels: Labels }) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = value.includes("@") && value.includes(".");
  const hasFeedback = touched || value.length > 0;

  return (
    <form className={`mpp-validation${hasFeedback ? (valid ? " is-valid" : " is-invalid") : ""}`} onSubmit={(event) => { event.preventDefault(); setTouched(true); }}>
      <label htmlFor="mpp-email">Team email</label>
      <div className="mpp-validation__field">
        <Mail aria-hidden="true" size={14} />
        <input id="mpp-email" value={value} onChange={(event) => setValue(event.target.value)} onBlur={() => setTouched(true)} placeholder="you@company.com" aria-describedby="mpp-email-feedback" />
        {hasFeedback ? valid ? <CheckCircle2 aria-hidden="true" size={15} /> : <span className="mpp-validation__error" aria-hidden="true">!</span> : null}
      </div>
      <div className="mpp-row mpp-validation__feedback"><span id="mpp-email-feedback" aria-live="polite">{hasFeedback ? valid ? labels.valid : "Add a valid email" : "Invite someone to this workspace"}</span><TinyButton label={labels.validate} onClick={() => setTouched(true)} tone="ghost"><Check aria-hidden="true" size={14} /></TinyButton></div>
    </form>
  );
}

function CommandMenu({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState("");
  const actions = ["Create pack", "Open finder", "Share prototype"];
  const visible = actions.filter((action) => action.toLowerCase().includes(query.toLowerCase()));

  const choose = (action: string) => {
    setCompleted(action);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={`mpp-command${open ? " is-open" : ""}`}>
      <TinyButton label={open ? labels.close : labels.command} onClick={() => setOpen((current) => !current)} tone="dark"><Command aria-hidden="true" size={14} /><span>{labels.command} K</span></TinyButton>
      <div className="mpp-command__popover" role="dialog" aria-label={labels.command}>
        <div className="mpp-command__search"><Search aria-hidden="true" size={14} /><input autoFocus={open} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actions" /></div>
        <div className="mpp-command__label">Suggested</div>
        {visible.map((action, index) => <button type="button" key={action} onClick={() => choose(action)}><span className={`mpp-command__action-icon is-${index}`}><Plus aria-hidden="true" size={13} /></span><span>{action}</span><span>⌘{index + 1}</span></button>)}
      </div>
      <span className="mpp-command__result" aria-live="polite">{completed ? `${completed} ready` : ""}</span>
    </div>
  );
}

function DetailsDisclosure({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <div className={`mpp-disclosure${open ? " is-open" : ""}`}>
      <button type="button" aria-expanded={open} aria-controls={detailsId} onClick={() => setOpen((current) => !current)}>
        <span className="mpp-disclosure__mark"><Sparkles aria-hidden="true" size={14} /></span>
        <span><strong>Motion quality review</strong><small>Timing, interruption, reduced motion</small></span>
        <ChevronDown aria-hidden="true" size={16} />
      </button>
      <div id={detailsId} className="mpp-disclosure__body" aria-hidden={!open}>
        <span>240ms</span><span>transform</span><span>repeatable</span>
        <p>One clear action, one clear result.</p>
      </div>
      <span className="sr-only" aria-live="polite">{open ? labels.details : ""}</span>
    </div>
  );
}

function NotificationTriage({ labels }: { labels: Labels }) {
  const [read, setRead] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`mpp-notification${read ? " is-read" : ""}${expanded ? " is-expanded" : ""}`}>
      <button className="mpp-notification__row" type="button" onClick={() => setExpanded((current) => !current)} aria-expanded={expanded}>
        <span className="mpp-notification__avatar">M</span>
        <span><strong>Motion Lexicon</strong><small>New review request</small></span>
        <span className="mpp-notification__time">now</span>
        <i aria-label="Unread" />
      </button>
      <div className="mpp-notification__detail"><p>Three feedback notes are ready to review.</p><TinyButton label={read ? "Read" : "Mark as read"} onClick={() => setRead(true)} tone="soft"><Check aria-hidden="true" size={14} /><span>{read ? "Read" : "Mark read"}</span></TinyButton></div>
      <span className="sr-only" aria-live="polite">{read ? labels.complete : ""}</span>
    </div>
  );
}

function ProgressSteps({ labels }: { labels: Labels }) {
  const [step, setStep] = useState(1);
  const total = 3;
  const next = () => setStep((current) => current === total ? 1 : current + 1);

  return (
    <div className="mpp-progress">
      <div className="mpp-row"><div><strong>Publish checklist</strong><small>Step {step} of {total}</small></div><span className="mpp-progress__number">{Math.round((step / total) * 100)}%</span></div>
      <ol aria-label="Publish progress">
        {["Content", "Review", "Release"].map((name, index) => <li className={index + 1 <= step ? "is-done" : ""} key={name}><span>{index + 1 < step ? <Check aria-hidden="true" size={12} /> : index + 1}</span>{name}</li>)}
      </ol>
      <div className="mpp-progress__bar"><i style={{ transform: `scaleX(${step / total})` }} /></div>
      <TinyButton label={step === total ? labels.reset : labels.continue} onClick={next} tone="dark"><span>{step === total ? labels.reset : labels.continue}</span><ChevronRight aria-hidden="true" size={14} /></TinyButton>
    </div>
  );
}

function MemberInvite({ labels }: { labels: Labels }) {
  const [invited, setInvited] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="mpp-invite">
      <div className="mpp-row"><div><strong>Project members</strong><small>2 people have access</small></div><div className="mpp-avatars"><span>A</span><span>R</span><span>+</span></div></div>
      <TinyButton label={invited ? labels.invited : labels.invite} onClick={() => { setOpen(true); setInvited(true); }} tone={invited ? "blue" : "dark"}><UserPlus aria-hidden="true" size={14} /><span>{invited ? labels.invited : labels.invite}</span></TinyButton>
      <div className={`mpp-invite__popover${open ? " is-visible" : ""}`} role="status" aria-live="polite"><span className="mpp-invite__email"><Mail aria-hidden="true" size={13} /> hello@motion.run</span><CheckCircle2 aria-hidden="true" size={15} /></div>
    </div>
  );
}

function MediaScrub({ labels }: { labels: Labels }) {
  const [progress, setProgress] = useState(34);
  const [playing, setPlaying] = useState(false);
  const { active: isPressed, trigger } = useTransientFlag();

  const toggle = () => {
    setPlaying((current) => !current);
    trigger();
  };

  return (
    <div className={`mpp-media${playing ? " is-playing" : ""}${isPressed ? " is-pressed" : ""}`}>
      <div className="mpp-media__art"><div className="mpp-media__wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><span>Motion · 01</span></div>
      <div className="mpp-row"><div><strong>Arrival pattern</strong><small>00:{String(Math.round(progress / 4)).padStart(2, "0")} / 01:20</small></div><TinyButton label={playing ? labels.pause : labels.play} onClick={toggle} tone="dark">{playing ? <Pause aria-hidden="true" size={14} /> : <Play aria-hidden="true" size={14} />}</TinyButton></div>
      <input className="mpp-media__range" aria-label="Playback position" type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} style={{ "--mpp-progress": `${progress}%` } as CSSProperties} />
    </div>
  );
}

function localizedPackText(locale: PreviewLocale, zhText: string, enText: string) {
  return locale === "zh" ? zhText : enText;
}

function UploadComplete({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const [state, setState] = useState<"ready" | "uploading" | "complete">("ready");
  const timerRef = useRef<number | null>(null);
  const title = localizedPackText(locale, "文件上传完成", "Upload complete");

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const upload = () => {
    if (state === "uploading") return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setState("uploading");
    timerRef.current = window.setTimeout(() => {
      setState("complete");
      timerRef.current = null;
    }, 620);
  };

  const status = state === "complete" ? labels.uploaded : state === "uploading" ? labels.uploading : labels.upload;

  return (
    <div className="mpp-upload" data-state={state} aria-label={title}>
      <div className="mpp-upload__file">
        <span className="mpp-upload__file-icon"><FileText aria-hidden="true" size={15} /></span>
        <span><strong>{localizedPackText(locale, "发布清单.pdf", "Launch checklist.pdf")}</strong><small>2.4 MB</small></span>
        <span className="mpp-upload__status" aria-live="polite">{state === "complete" ? <Check aria-hidden="true" size={13} /> : null}{status}</span>
      </div>
      <div className="mpp-upload__track" aria-hidden="true"><i /></div>
      <TinyButton label={`${title}: ${status}`} onClick={upload} tone={state === "complete" ? "blue" : "dark"} disabled={state === "uploading"}>
        {state === "complete" ? <Check aria-hidden="true" size={14} /> : <Upload aria-hidden="true" size={14} />}
        <span>{status}</span>
      </TinyButton>
      <span className="mpp-screen-reader-status" aria-live="polite">{state === "complete" ? `${title}: ${labels.uploaded}` : ""}</span>
    </div>
  );
}

function SyncRecovery({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const [state, setState] = useState<"offline" | "syncing" | "synced">("offline");
  const timerRef = useRef<number | null>(null);
  const title = localizedPackText(locale, "同步恢复", "Sync recovery");

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const recover = () => {
    if (state === "syncing") return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setState("syncing");
    timerRef.current = window.setTimeout(() => {
      setState("synced");
      timerRef.current = null;
    }, 720);
  };

  const detail = state === "offline"
    ? localizedPackText(locale, "3 项更改等待同步", "3 changes waiting to sync")
    : state === "syncing"
      ? localizedPackText(locale, "正在恢复连接", "Restoring connection")
      : localizedPackText(locale, "全部更改已同步", "All changes are in sync");

  return (
    <div className="mpp-sync" data-state={state} aria-label={title}>
      <div className="mpp-sync__icon">{state === "synced" ? <CheckCircle2 aria-hidden="true" size={17} /> : state === "syncing" ? <RefreshCw aria-hidden="true" size={17} /> : <CloudOff aria-hidden="true" size={17} />}</div>
      <div className="mpp-sync__copy"><strong>{state === "synced" ? labels.synced : title}</strong><small>{detail}</small></div>
      <TinyButton label={state === "synced" ? labels.retry : labels.recover} onClick={recover} tone={state === "synced" ? "blue" : "dark"} disabled={state === "syncing"}>
        <RefreshCw aria-hidden="true" size={14} /><span>{state === "syncing" ? labels.syncing : state === "synced" ? labels.retry : labels.recover}</span>
      </TinyButton>
      <span className="mpp-screen-reader-status" aria-live="polite">{state === "synced" ? `${title}: ${labels.synced}` : ""}</span>
    </div>
  );
}

function DeleteConfirmation({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const [state, setState] = useState<"idle" | "confirming" | "deleted">("idle");
  const title = localizedPackText(locale, "删除确认", "Delete confirmation");

  return (
    <div className={`mpp-delete mpp-delete--${state}`} aria-label={title}>
      {state === "idle" ? (
        <div className="mpp-delete__item">
          <span className="mpp-delete__file"><FileText aria-hidden="true" size={15} /></span>
          <span><strong>{localizedPackText(locale, "旧版草稿", "Previous draft")}</strong><small>{localizedPackText(locale, "归档于昨天", "Archived yesterday")}</small></span>
          <TinyButton label={labels.delete} onClick={() => setState("confirming")} tone="ghost"><Trash2 aria-hidden="true" size={14} /></TinyButton>
        </div>
      ) : null}
      {state === "confirming" ? (
        <div className="mpp-delete__confirm" role="alert">
          <span><AlertTriangle aria-hidden="true" size={16} /></span>
          <div><strong>{localizedPackText(locale, "删除此草稿？", "Delete this draft?")}</strong><small>{localizedPackText(locale, "此操作可以恢复。", "You can restore it next.")}</small></div>
          <div className="mpp-delete__actions"><TinyButton label={labels.cancel} onClick={() => setState("idle")} tone="soft"><span>{labels.cancel}</span></TinyButton><TinyButton label={labels.delete} onClick={() => setState("deleted")} tone="danger"><span>{labels.delete}</span></TinyButton></div>
        </div>
      ) : null}
      {state === "deleted" ? (
        <div className="mpp-delete__result" role="status" aria-live="polite"><span><Check aria-hidden="true" size={14} />{labels.deleted}</span><TinyButton label={labels.restore} onClick={() => setState("idle")} tone="soft"><Undo2 aria-hidden="true" size={13} /><span>{labels.restore}</span></TinyButton></div>
      ) : null}
    </div>
  );
}

function AssigneePicker({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const choices = [
    { name: "Mina", initials: "M", tone: "blue" },
    { name: "Ryan", initials: "R", tone: "ink" },
    { name: "Ari", initials: "A", tone: "sand" }
  ];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const listId = useId();
  const title = localizedPackText(locale, "负责人选择", "Assignee picker");

  return (
    <div className={`mpp-assignee${open ? " is-open" : ""}`} aria-label={title}>
      <div className="mpp-row"><div><strong>{localizedPackText(locale, "设计审阅", "Design review")}</strong><small>{localizedPackText(locale, "选择一位负责人", "Choose an owner")}</small></div><UserRoundCheck aria-hidden="true" size={16} /></div>
      <button className="mpp-assignee__trigger" type="button" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((current) => !current)}>
        <span className={`mpp-assignee__avatar is-${choices[selected].tone}`}>{choices[selected].initials}</span><span>{choices[selected].name}</span><ChevronDown aria-hidden="true" size={14} />
      </button>
      <div className="mpp-assignee__menu" id={listId} role="listbox" aria-label={title}>
        {choices.map((choice, index) => <button type="button" role="option" aria-selected={selected === index} key={choice.name} onClick={() => { setSelected(index); setOpen(false); }}><span className={`mpp-assignee__avatar is-${choice.tone}`}>{choice.initials}</span><span>{choice.name}</span>{selected === index ? <Check aria-hidden="true" size={13} /> : null}</button>)}
      </div>
      <span className="mpp-screen-reader-status" aria-live="polite">{`${labels.assignee}: ${choices[selected].name}`}</span>
    </div>
  );
}

function PermissionChange({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const roles = [labels.viewer, labels.commenter, labels.editor];
  const descriptions = locale === "zh" ? ["可查看项目", "可评论与查看", "可编辑与发布"] : ["Can view the project", "Can comment and view", "Can edit and publish"];
  const [role, setRole] = useState(0);
  const title = localizedPackText(locale, "权限变更", "Permission change");

  return (
    <div className="mpp-permission" aria-label={title}>
      <div className="mpp-row"><div><strong>{labels.permissions}</strong><small>{localizedPackText(locale, "团队访问", "Team access")}</small></div><ShieldCheck aria-hidden="true" size={17} /></div>
      <div className="mpp-permission__roles" role="radiogroup" aria-label={title}>
        {roles.map((item, index) => <button type="button" role="radio" aria-checked={role === index} className={role === index ? "is-selected" : ""} key={item} onClick={() => setRole(index)}>{item}</button>)}
      </div>
      <div className="mpp-permission__summary" aria-live="polite"><CheckCircle2 aria-hidden="true" size={14} /><span><strong>{roles[role]}</strong><small>{descriptions[role]}</small></span></div>
    </div>
  );
}

function SearchSuggestions({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const suggestions = locale === "zh" ? ["保存确认", "产品瞬间", "动效基础"] : ["Save confirmation", "Product moments", "Motion primitives"];
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const title = localizedPackText(locale, "搜索建议", "Search suggestions");
  const visible = suggestions.filter((item) => item.toLocaleLowerCase().includes(query.toLocaleLowerCase())).slice(0, 3);

  return (
    <div className="mpp-search" aria-label={title}>
      <label className="mpp-search__field"><Search aria-hidden="true" size={15} /><input value={query} onChange={(event) => { setQuery(event.target.value); setSelected(""); }} placeholder={localizedPackText(locale, "搜索动效", "Search motion")} aria-label={title} /><kbd>⌘K</kbd></label>
      <div className="mpp-search__label">{labels.suggestions}</div>
      <div className="mpp-search__suggestions" role="listbox" aria-label={title}>
        {visible.map((item, index) => <button type="button" role="option" aria-selected={selected === item} key={item} onClick={() => { setQuery(item); setSelected(item); }}><span className={`mpp-search__dot is-${index}`} /><span>{item}</span><ChevronRight aria-hidden="true" size={13} /></button>)}
        {visible.length === 0 ? <span className="mpp-search__empty">{localizedPackText(locale, "没有匹配结果", "No matching results")}</span> : null}
      </div>
      <span className="mpp-screen-reader-status" aria-live="polite">{selected ? `${title}: ${selected}` : ""}</span>
    </div>
  );
}

function KanbanMove({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const columns = locale === "zh" ? ["待处理", "进行中", "已完成"] : ["Backlog", "In progress", "Done"];
  const [column, setColumn] = useState(1);
  const title = localizedPackText(locale, "看板移动", "Kanban move");
  const move = () => setColumn((current) => (current + 1) % columns.length);

  return (
    <div className="mpp-kanban" data-column={column} aria-label={title}>
      <div className="mpp-kanban__columns">
        {columns.map((name, index) => <div className="mpp-kanban__column" key={name}><span>{name}</span>{column === index ? <div className="mpp-kanban__card"><GripVertical aria-hidden="true" size={13} /><strong>{localizedPackText(locale, "检查动效", "Review motion")}</strong></div> : <i aria-hidden="true" />}</div>)}
      </div>
      <TinyButton label={labels.move} onClick={move} tone="dark"><span>{labels.move}</span><ChevronRight aria-hidden="true" size={14} /></TinyButton>
      <span className="mpp-screen-reader-status" aria-live="polite">{`${title}: ${labels.moved} ${columns[column]}`}</span>
    </div>
  );
}

function CartUpdate({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const [quantity, setQuantity] = useState(1);
  const { active: updated, trigger } = useTransientFlag();
  const title = localizedPackText(locale, "购物车更新", "Cart update");
  const minusLabel = localizedPackText(locale, "减少数量", "Decrease quantity");
  const plusLabel = localizedPackText(locale, "增加数量", "Increase quantity");

  return (
    <div className={`mpp-cart${updated ? " is-updated" : ""}`} aria-label={title}>
      <div className="mpp-cart__product"><span className="mpp-cart__cover" aria-hidden="true"><i /><i /><i /></span><span><strong>{localizedPackText(locale, "动效指南", "Motion guide")}</strong><small>$24.00</small></span><span className="mpp-cart__quantity"><button type="button" aria-label={minusLabel} onClick={() => setQuantity((current) => Math.max(1, current - 1))}>−</button><output aria-label={localizedPackText(locale, "数量", "Quantity")}>{quantity}</output><button type="button" aria-label={plusLabel} onClick={() => setQuantity((current) => Math.min(3, current + 1))}>+</button></span></div>
      <div className="mpp-cart__footer"><span><ShoppingBag aria-hidden="true" size={14} />{labels.cart}</span><strong>${(quantity * 24).toFixed(2)}</strong><TinyButton label={labels.update} onClick={trigger} tone="dark"><span>{updated ? <Check aria-hidden="true" size={14} /> : labels.update}</span></TinyButton></div>
      <span className="mpp-screen-reader-status" aria-live="polite">{updated ? `${title}: ${labels.update}` : ""}</span>
    </div>
  );
}

function CommentReply({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);
  const title = localizedPackText(locale, "评论回复", "Comment reply");

  const sendReply = () => {
    if (!reply.trim()) return;
    setSent(true);
    setOpen(false);
  };

  return (
    <div className={`mpp-comment${open ? " is-open" : ""}${sent ? " is-sent" : ""}`} aria-label={title}>
      <div className="mpp-comment__message"><span className="mpp-comment__avatar">M</span><span><strong>Mina</strong><small>{localizedPackText(locale, "这个切换很自然。", "This transition feels natural.")}</small></span><MessageCircle aria-hidden="true" size={15} /></div>
      {open ? <div className="mpp-comment__composer"><textarea value={reply} onChange={(event) => { setReply(event.target.value); setSent(false); }} placeholder={localizedPackText(locale, "写下回复", "Write a reply")} aria-label={title} rows={2} /><div><TinyButton label={labels.cancel} onClick={() => setOpen(false)} tone="ghost"><span>{labels.cancel}</span></TinyButton><TinyButton label={labels.reply} onClick={sendReply} tone="dark" disabled={!reply.trim()}><Send aria-hidden="true" size={13} /><span>{labels.reply}</span></TinyButton></div></div> : <TinyButton label={labels.reply} onClick={() => { setOpen(true); setSent(false); }} tone="soft"><MessageCircle aria-hidden="true" size={13} /><span>{labels.reply}</span></TinyButton>}
      <span className="mpp-screen-reader-status" aria-live="polite">{sent ? `${title}: ${labels.replied}` : ""}</span>
    </div>
  );
}

function ApprovalRequest({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const [approved, setApproved] = useState(false);
  const title = localizedPackText(locale, "请求审批", "Approval request");

  return (
    <div className={`mpp-approval${approved ? " is-approved" : ""}`} aria-label={title}>
      <span className="mpp-approval__icon">{approved ? <CheckCircle2 aria-hidden="true" size={17} /> : <FileText aria-hidden="true" size={17} />}</span>
      <div className="mpp-approval__copy"><strong>{approved ? labels.approved : localizedPackText(locale, "等待审批", "Awaiting approval")}</strong><small>{approved ? localizedPackText(locale, "已通知请求人", "Requester notified") : localizedPackText(locale, "发布说明 · 4 项更改", "Release notes · 4 changes")}</small></div>
      <TinyButton label={approved ? labels.approved : labels.approve} onClick={() => setApproved(true)} tone={approved ? "blue" : "dark"} disabled={approved}>{approved ? <Check aria-hidden="true" size={14} /> : <span>{labels.approve}</span>}</TinyButton>
      <span className="mpp-screen-reader-status" aria-live="polite">{approved ? `${title}: ${labels.approved}` : ""}</span>
    </div>
  );
}

function CheckoutPayment({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const [state, setState] = useState<"ready" | "paying" | "paid">("ready");
  const timerRef = useRef<number | null>(null);
  const title = localizedPackText(locale, "支付结账", "Checkout payment");

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const pay = () => {
    if (state === "paying") return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setState("paying");
    timerRef.current = window.setTimeout(() => {
      setState("paid");
      timerRef.current = null;
    }, 640);
  };

  return (
    <div className="mpp-checkout" data-state={state} aria-label={title}>
      <div className="mpp-checkout__card"><CreditCard aria-hidden="true" size={17} /><span>•••• 4242</span><i /></div>
      <div className="mpp-checkout__total"><span>{localizedPackText(locale, "订单合计", "Order total")}</span><strong>$48.00</strong></div>
      <TinyButton label={state === "paid" ? labels.paid : labels.pay} onClick={pay} tone={state === "paid" ? "blue" : "dark"} disabled={state === "paying"}>{state === "paid" ? <Check aria-hidden="true" size={14} /> : <CreditCard aria-hidden="true" size={14} />}<span>{state === "paying" ? localizedPackText(locale, "正在处理", "Processing") : state === "paid" ? labels.paid : `${labels.pay} $48`}</span></TinyButton>
      <span className="mpp-screen-reader-status" aria-live="polite">{state === "paid" ? `${title}: ${labels.paid}` : ""}</span>
    </div>
  );
}

function ScheduledPublish({ labels, locale }: { labels: Labels; locale: PreviewLocale }) {
  const choices = locale === "zh" ? ["今天 17:00", "明天 09:00"] : ["Today 17:00", "Tomorrow 09:00"];
  const [time, setTime] = useState(0);
  const [scheduled, setScheduled] = useState(false);
  const title = localizedPackText(locale, "定时发布", "Scheduled publish");

  return (
    <div className={`mpp-schedule${scheduled ? " is-scheduled" : ""}`} aria-label={title}>
      <div className="mpp-row"><div><strong>{scheduled ? labels.scheduled : title}</strong><small>{scheduled ? choices[time] : localizedPackText(locale, "选择发布时间", "Choose a publish time")}</small></div><CalendarClock aria-hidden="true" size={17} /></div>
      <div className="mpp-schedule__choices" role="radiogroup" aria-label={title}>{choices.map((choice, index) => <button type="button" role="radio" aria-checked={time === index} className={time === index ? "is-selected" : ""} key={choice} onClick={() => { setTime(index); setScheduled(false); }}>{choice}</button>)}</div>
      <TinyButton label={labels.schedule} onClick={() => setScheduled(true)} tone={scheduled ? "blue" : "dark"}>{scheduled ? <Check aria-hidden="true" size={14} /> : <Send aria-hidden="true" size={14} />}<span>{scheduled ? labels.scheduled : labels.schedule}</span></TinyButton>
      <span className="mpp-screen-reader-status" aria-live="polite">{scheduled ? `${title}: ${labels.scheduled} ${choices[time]}` : ""}</span>
    </div>
  );
}

function previewFor(kind: string, labels: Labels, compact: boolean, locale: PreviewLocale) {
  switch (kind) {
    case "publish-release": return <PublishRelease labels={labels} />;
    case "share-link": return <ShareLink labels={labels} />;
    case "card-selection": return <CardSelection labels={labels} />;
    case "workspace-switch": return <WorkspaceSwitch labels={labels} />;
    case "template-choice": return <TemplateChoice labels={labels} />;
    case "layer-insertion": return <LayerInsertion labels={labels} />;
    case "archive-undo": return <ArchiveUndo labels={labels} />;
    case "filter-results": return <FilterResults labels={labels} />;
    case "inline-validation": return <InlineValidation labels={labels} />;
    case "command-menu": return <CommandMenu labels={labels} />;
    case "details-disclosure": return <DetailsDisclosure labels={labels} />;
    case "notification-triage": return <NotificationTriage labels={labels} />;
    case "progress-steps": return <ProgressSteps labels={labels} />;
    case "member-invite": return <MemberInvite labels={labels} />;
    case "media-scrub": return <MediaScrub labels={labels} />;
    case "upload-complete": return <UploadComplete labels={labels} locale={locale} />;
    case "sync-recovery": return <SyncRecovery labels={labels} locale={locale} />;
    case "delete-confirmation": return <DeleteConfirmation labels={labels} locale={locale} />;
    case "assignee-picker": return <AssigneePicker labels={labels} locale={locale} />;
    case "permission-change": return <PermissionChange labels={labels} locale={locale} />;
    case "search-suggestions": return <SearchSuggestions labels={labels} locale={locale} />;
    case "kanban-move": return <KanbanMove labels={labels} locale={locale} />;
    case "cart-update": return <CartUpdate labels={labels} locale={locale} />;
    case "comment-reply": return <CommentReply labels={labels} locale={locale} />;
    case "approval-request": return <ApprovalRequest labels={labels} locale={locale} />;
    case "checkout-payment": return <CheckoutPayment labels={labels} locale={locale} />;
    case "scheduled-publish": return <ScheduledPublish labels={labels} locale={locale} />;
    case "save-confirmation":
    default: return <SaveConfirmation labels={labels} compact={compact} />;
  }
}

/**
 * A self-contained, CSS-first interactive renderer for the V2.0 product moments collection.
 * It deliberately owns the miniature product UI so each pack can have a real state
 * transition without inheriting the generic motion-demo shell from the vocabulary.
 */
export function MotionPackPreview({ pack, compact = false, locale = "zh", className }: MotionPackPreviewProps) {
  const labels = locale === "en" ? en : zh;
  const title = packTitle(pack, locale);
  const kind = pack.kind || "save-confirmation";

  return (
    <PreviewFrame compact={compact} title={title} label={labels.live} kind={kind} className={className}>
      <div className="motion-pack-preview__scene" key={`${pack.id}:${kind}`}>
        {previewFor(kind, labels, compact, locale)}
      </div>
    </PreviewFrame>
  );
}
