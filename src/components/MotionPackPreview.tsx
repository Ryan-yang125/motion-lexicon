import {
  Archive,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Command,
  Copy,
  FileText,
  Filter,
  Folder,
  Layers3,
  Link,
  Mail,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Share2,
  Sparkles,
  Undo2,
  UserPlus
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
  | "media-scrub";

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
  details: "查看详情"
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
  details: "View details"
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
  tone?: "soft" | "dark" | "blue" | "ghost";
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

function previewFor(kind: string, labels: Labels, compact: boolean) {
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
    case "save-confirmation":
    default: return <SaveConfirmation labels={labels} compact={compact} />;
  }
}

/**
 * A self-contained, CSS-first interactive renderer for the V1 Motion Pack gallery.
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
        {previewFor(kind, labels, compact)}
      </div>
    </PreviewFrame>
  );
}
