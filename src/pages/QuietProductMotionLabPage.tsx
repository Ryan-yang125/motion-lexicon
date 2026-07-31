import {
  Archive,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Layers3,
  Plus,
  RotateCcw,
  Undo2
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Seo } from "../components/Seo";
import { pathFor } from "../data/site";
import type { Locale } from "../data/types";
import "./quiet-product-motion-lab.css";

type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  reset: string;
  save: string;
  saved: string;
  saving: string;
  select: string;
  selected: string;
  add: string;
  archive: string;
  undo: string;
  archived: string;
  restored: string;
  active: string;
  preview: string;
};

const copy: Record<Locale, Copy> = {
  zh: {
    eyebrow: "V1 审美方向实验",
    title: "Quiet Product Motion",
    description: "四个真实产品瞬间：短、清晰、可重复触发，并且在动作完成后留下一条明确的状态变化。",
    reset: "重置全部",
    save: "保存更新",
    saved: "已保存",
    saving: "正在保存",
    select: "选择这个布局",
    selected: "当前选择",
    add: "添加图层",
    archive: "移到归档",
    undo: "撤销",
    archived: "已移到归档",
    restored: "已恢复",
    active: "已激活",
    preview: "交互预览"
  },
  en: {
    eyebrow: "V1 visual direction study",
    title: "Quiet Product Motion",
    description: "Four real product moments: short, clear, repeatable, and each leaves behind a meaningful state change.",
    reset: "Reset all",
    save: "Save update",
    saved: "Saved",
    saving: "Saving",
    select: "Choose this layout",
    selected: "Selected",
    add: "Add layer",
    archive: "Move to archive",
    undo: "Undo",
    archived: "Moved to archive",
    restored: "Restored",
    active: "Active",
    preview: "Interactive preview"
  }
};

function Spec({ children }: { children: string }) {
  return <span className="qpm-spec">{children}</span>;
}

function SaveConfirmation({ labels, resetKey }: { labels: Copy; resetKey: number }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    setState("idle");
  }, [resetKey]);

  useEffect(() => {
    if (state !== "saving") return;
    const timer = window.setTimeout(() => setState("saved"), 540);
    return () => window.clearTimeout(timer);
  }, [state]);

  const handleSave = () => {
    if (state === "saving") return;
    setState("saving");
  };

  return (
    <article className="qpm-study-card" data-motion-sample="save">
      <div className="qpm-study-head">
        <div>
          <span className="qpm-index">01</span>
          <h2>Completion</h2>
          <p>一次提交，按钮与状态同步抵达结果。</p>
        </div>
        <Spec>180ms · status</Spec>
      </div>
      <div className="qpm-stage qpm-save-stage">
        <div className="qpm-mini-window" data-state={state}>
          <div className="qpm-mini-window-top">
            <span>Release notes</span>
            <span className="qpm-draft-dot" aria-label="Draft" />
          </div>
          <div className="qpm-mini-window-body">
            <div className="qpm-mini-copy">
              <strong>New motion defaults</strong>
              <span>Ready for review</span>
            </div>
            <span className={`qpm-status-chip is-${state}`} aria-live="polite">
              {state === "saving" ? <Circle aria-hidden="true" size={12} /> : <CheckCircle2 aria-hidden="true" size={12} />}
              {state === "saving" ? labels.saving : state === "saved" ? labels.saved : "Draft"}
            </span>
          </div>
          <button
            className="qpm-action-button qpm-save-button"
            type="button"
            onClick={handleSave}
            aria-label={state === "saved" ? labels.saved : labels.save}
            aria-busy={state === "saving" || undefined}
            data-state={state}
          >
            <span className="qpm-save-icon" aria-hidden="true">
              <Check size={14} strokeWidth={2.35} />
            </span>
            <span>{state === "saving" ? labels.saving : state === "saved" ? labels.saved : labels.save}</span>
          </button>
        </div>
      </div>
      <p className="qpm-study-note">按下时给出触感，完成时用一条很短的状态转换确认结果。</p>
    </article>
  );
}

const layouts = [
  { id: "focus", name: "Focus", className: "is-focus" },
  { id: "split", name: "Split", className: "is-split" },
  { id: "stack", name: "Stack", className: "is-stack" }
] as const;

function CardSelection({ labels, resetKey }: { labels: Copy; resetKey: number }) {
  const [selected, setSelected] = useState<(typeof layouts)[number]["id"]>("focus");
  const labelId = useId();

  useEffect(() => {
    setSelected("focus");
  }, [resetKey]);

  return (
    <article className="qpm-study-card" data-motion-sample="choice">
      <div className="qpm-study-head">
        <div>
          <span className="qpm-index">02</span>
          <h2>Choice</h2>
          <p>选择一个方向，焦点和说明一起移动。</p>
        </div>
        <Spec>200ms · selection</Spec>
      </div>
      <div className="qpm-stage qpm-choice-stage">
        <div className="qpm-layout-picker" role="radiogroup" aria-labelledby={labelId}>
          <span className="sr-only" id={labelId}>{labels.select}</span>
          <div className="qpm-layout-options">
            {layouts.map((layout) => {
              const isSelected = selected === layout.id;
              return (
                <button
                  className={`qpm-layout-option ${layout.className}${isSelected ? " is-selected" : ""}`}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  key={layout.id}
                  onClick={() => setSelected(layout.id)}
                >
                  <span className="qpm-layout-skeleton" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>{layout.name}</span>
                  <Check aria-hidden="true" size={14} strokeWidth={2.25} />
                </button>
              );
            })}
          </div>
          <div className="qpm-choice-result" aria-live="polite">
            <div>
              <span>{labels.selected}</span>
              <strong>{layouts.find((layout) => layout.id === selected)?.name}</strong>
            </div>
            <ChevronRight aria-hidden="true" size={16} />
          </div>
        </div>
      </div>
      <p className="qpm-study-note">选中态优先表达层级，位移只承担“焦点到这里了”的空间提示。</p>
    </article>
  );
}

type Layer = { id: number; name: string; detail: string };

const initialLayers: Layer[] = [
  { id: 1, name: "Title", detail: "Fade in" },
  { id: 2, name: "Meta", detail: "Delay 40ms" }
];

function LayerInsertion({ labels, resetKey }: { labels: Copy; resetKey: number }) {
  const [layers, setLayers] = useState(initialLayers);
  const [entering, setEntering] = useState<number | null>(null);

  useEffect(() => {
    setLayers(initialLayers);
    setEntering(null);
  }, [resetKey]);

  useEffect(() => {
    if (entering === null) return;
    const frame = window.requestAnimationFrame(() => setEntering(null));
    return () => window.cancelAnimationFrame(frame);
  }, [entering]);

  const addLayer = () => {
    const nextId = Math.max(...layers.map((layer) => layer.id), 0) + 1;
    setEntering(nextId);
    setLayers((current) => [
      ...current,
      { id: nextId, name: nextId % 2 ? "Accent" : "Thumbnail", detail: nextId % 2 ? "Scale 96%" : "Slide up" }
    ]);
  };

  return (
    <article className="qpm-study-card" data-motion-sample="insertion">
      <div className="qpm-study-head">
        <div>
          <span className="qpm-index">03</span>
          <h2>Insertion</h2>
          <p>新内容加入时，列表保持已有项目的稳定。</p>
        </div>
        <Spec>220ms · layout</Spec>
      </div>
      <div className="qpm-stage qpm-layer-stage">
        <div className="qpm-layer-window">
          <div className="qpm-layer-toolbar">
            <span><Layers3 aria-hidden="true" size={14} /> Layers</span>
            <button className="qpm-add-button" type="button" onClick={addLayer}>
              <Plus aria-hidden="true" size={14} /> {labels.add}
            </button>
          </div>
          <ul className="qpm-layer-list" aria-live="polite">
            {layers.map((layer) => (
              <li className={entering === layer.id ? "is-entering" : ""} key={layer.id}>
                <span className="qpm-layer-symbol" aria-hidden="true" />
                <strong>{layer.name}</strong>
                <small>{layer.detail}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="qpm-study-note">新增项目先占住准确位置，再用很小的位移显露出来。</p>
    </article>
  );
}

function ArchiveUndo({ labels, resetKey }: { labels: Copy; resetKey: number }) {
  const [archived, setArchived] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    setArchived(false);
    setRestored(false);
  }, [resetKey]);

  const archive = () => {
    setRestored(false);
    setArchived(true);
  };

  const undo = () => {
    setArchived(false);
    setRestored(true);
  };

  return (
    <article className="qpm-study-card" data-motion-sample="forgiveness">
      <div className="qpm-study-head">
        <div>
          <span className="qpm-index">04</span>
          <h2>Forgiveness</h2>
          <p>一项操作离开后，撤销入口从它原来的位置接住用户。</p>
        </div>
        <Spec>240ms · undo</Spec>
      </div>
      <div className="qpm-stage qpm-archive-stage">
        <div className="qpm-task-card" data-archived={archived || undefined}>
          <span className="qpm-task-icon"><Check aria-hidden="true" size={14} /></span>
          <div>
            <strong>Motion review</strong>
            <span>4 changes ready</span>
          </div>
          <button className="qpm-archive-button" type="button" onClick={archive} disabled={archived}>
            <Archive aria-hidden="true" size={14} /> {labels.archive}
          </button>
        </div>
        <div className={`qpm-undo-toast${archived ? " is-visible" : ""}`} role="status" aria-live="polite">
          <span><Archive aria-hidden="true" size={14} /> {labels.archived}</span>
          <button type="button" onClick={undo}><Undo2 aria-hidden="true" size={14} /> {labels.undo}</button>
        </div>
        <span className={`qpm-restored-note${restored ? " is-visible" : ""}`} aria-live="polite">
          <CheckCircle2 aria-hidden="true" size={14} /> {labels.restored}
        </span>
      </div>
      <p className="qpm-study-note">动作保留可逆路径，用户始终能在当前上下文里恢复选择。</p>
    </article>
  );
}

export function QuietProductMotionLabPage({ locale }: { locale: Locale }) {
  const [resetKey, setResetKey] = useState(0);
  const labels = copy[locale];

  return (
    <>
      <Seo
        locale={locale}
        title={`${labels.title} Lab — Motion Lexicon`}
        description={labels.description}
        path={pathFor(locale, ["lab", "quiet-product-motion"])}
        noindex
      />
      <section className="qpm-lab" aria-labelledby="qpm-title" data-testid="quiet-product-motion-lab">
        <header className="qpm-intro">
          <div>
            <span className="qpm-eyebrow">{labels.eyebrow}</span>
            <h1 id="qpm-title">{labels.title}</h1>
            <p>{labels.description}</p>
          </div>
          <button className="qpm-reset" type="button" onClick={() => setResetKey((current) => current + 1)}>
            <RotateCcw aria-hidden="true" size={14} /> {labels.reset}
          </button>
        </header>

        <div className="qpm-principles" aria-label={labels.preview}>
          <span>Immediate feedback</span>
          <span>Stable endpoint</span>
          <span>Repeatable state</span>
          <span>CSS + HTML</span>
        </div>

        <div className="qpm-study-grid">
          <SaveConfirmation labels={labels} resetKey={resetKey} />
          <CardSelection labels={labels} resetKey={resetKey} />
          <LayerInsertion labels={labels} resetKey={resetKey} />
          <ArchiveUndo labels={labels} resetKey={resetKey} />
        </div>
      </section>
    </>
  );
}
