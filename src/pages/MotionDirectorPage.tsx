import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Code2,
  Compass,
  Layers3,
  Sparkles,
  WandSparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { Seo } from "../components/Seo";
import {
  motionBlueprintExample,
  motionDirectorModes,
  motionGrammar
} from "../data/motion-grammar";
import { pathFor } from "../data/site";
import type { Locale } from "../data/types";

type DirectorCopy = {
  eyebrow: string;
  title: string;
  description: string;
  openSkill: string;
  browseCandidates: string;
  sceneLabel: string;
  sceneTitle: string;
  sceneDescription: string;
  release: string;
  publishing: string;
  published: string;
  workflowEyebrow: string;
  workflowTitle: string;
  workflowDescription: string;
  blueprintEyebrow: string;
  blueprintTitle: string;
  blueprintDescription: string;
  candidateEyebrow: string;
  candidateTitle: string;
  candidateDescription: string;
  candidateAction: string;
  collectionsEyebrow: string;
  collectionsTitle: string;
  collectionsDescription: string;
  packs: string;
  packsDescription: string;
  primitives: string;
  primitivesDescription: string;
  stateGraph: string;
  actors: string;
  beats: string;
  reducedMotion: string;
  trigger: string;
  context: string;
  statusDraft: string;
  statusLive: string;
};

const copy: Record<Locale, DirectorCopy> = {
  zh: {
    eyebrow: "Motion Director · Agent Skill",
    title: "从产品场景出发，写出有判断的动效。",
    description: "把触发、状态与结果组织成一份 Motion Blueprint。Skill 可以给出方向、组合产品瞬间、生成实现，并审查已有动效。",
    openSkill: "查看 Agent Skill",
    browseCandidates: "浏览候选库",
    sceneLabel: "一个真实产品瞬间",
    sceneTitle: "发送审批请求，状态一起抵达。",
    sceneDescription: "主按钮、审批摘要和审批人记录共享同一份节奏，结果留在界面里。",
    release: "发送请求",
    publishing: "正在发送",
    published: "已发送",
    workflowEyebrow: "五种工作方式",
    workflowTitle: "给出场景，接住完整的动效决策。",
    workflowDescription: "从一句模糊描述到一段可交付的实现，每一步都保留前一步的理由。",
    blueprintEyebrow: "Motion Blueprint",
    blueprintTitle: "一份蓝图，连接选择与实现。",
    blueprintDescription: "它让产品状态、参与元素、节奏和减弱动效处在同一个交付物里。",
    candidateEyebrow: "候选内容",
    candidateTitle: "让真实项目继续扩充这套语言。",
    candidateDescription: "新的场景先进入候选库，经过实现、可访问性和场景复用检查后，再成为公开内容。",
    candidateAction: "打开候选库",
    collectionsEyebrow: "两条并列目录",
    collectionsTitle: "从素材出发，或从场景出发。",
    collectionsDescription: "产品瞬间与动效基础提供可预览的参考；Motion Director 把它们带回你的项目。",
    packs: "产品瞬间",
    packsDescription: "完整交互，直接观察状态如何变化。",
    primitives: "动效基础",
    primitivesDescription: "单一动作、参数与使用边界。",
    stateGraph: "状态图",
    actors: "参与元素",
    beats: "节奏",
    reducedMotion: "减弱动效",
    trigger: "触发",
    context: "向两位审批人发送请求",
    statusDraft: "草稿",
    statusLive: "已上线"
  },
  en: {
    eyebrow: "Motion Director · Agent Skill",
    title: "Start with the product scene. Make a considered motion decision.",
    description: "Turn a trigger, state, and outcome into one Motion Blueprint. The Skill can recommend a direction, compose a product moment, generate the implementation, and review existing motion.",
    openSkill: "View Agent Skill",
    browseCandidates: "Browse candidates",
    sceneLabel: "A real product moment",
    sceneTitle: "Send an approval request. Let the state arrive together.",
    sceneDescription: "The primary action, approval summary, and approver records share one rhythm, then leave the outcome in place.",
    release: "Send request",
    publishing: "Sending",
    published: "Sent",
    workflowEyebrow: "Five ways to work",
    workflowTitle: "Bring a scene. Keep the full motion decision connected.",
    workflowDescription: "From a loose description to a deliverable implementation, each step keeps the reason behind the previous one.",
    blueprintEyebrow: "Motion Blueprint",
    blueprintTitle: "One blueprint connects choice and implementation.",
    blueprintDescription: "Product states, participating elements, timing, and reduced motion live in the same deliverable.",
    candidateEyebrow: "Candidate content",
    candidateTitle: "Let real projects extend this language.",
    candidateDescription: "New scenes enter the candidate library first, then become public content after implementation, accessibility, and reuse checks.",
    candidateAction: "Open candidate library",
    collectionsEyebrow: "Two peer directories",
    collectionsTitle: "Start from a reference, or start from a scene.",
    collectionsDescription: "Product moments and motion primitives provide previewable references. Motion Director brings them back to your project.",
    packs: "Product moments",
    packsDescription: "Complete interactions with visible state change.",
    primitives: "Motion primitives",
    primitivesDescription: "One motion, its parameters, and its boundaries.",
    stateGraph: "State graph",
    actors: "Actors",
    beats: "Beats",
    reducedMotion: "Reduced motion",
    trigger: "Trigger",
    context: "Send a request to two approvers",
    statusDraft: "Draft",
    statusLive: "Live"
  }
};

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const skillUrl = `${repositoryUrl}/tree/main/skills/motion-lexicon`;

type BlueprintSceneProps = {
  labels: DirectorCopy;
};

function BlueprintScene({ labels }: BlueprintSceneProps) {
  const [state, setState] = useState<"ready" | "sending" | "awaiting">("ready");

  useEffect(() => {
    if (state !== "sending") return;
    const timer = window.setTimeout(() => setState("awaiting"), 460);
    return () => window.clearTimeout(timer);
  }, [state]);

  const actionLabel = state === "ready"
    ? labels.release
    : state === "sending"
      ? labels.publishing
      : labels.published;

  return (
    <div className="director-scene" data-state={state}>
      <div className="director-scene-window">
        <div className="director-scene-window-bar">
          <span>Release notes</span>
          <span className="director-scene-window-id">v2.0</span>
        </div>
        <div className="director-scene-body">
          <div className="director-scene-record">
            <span className="director-scene-record-icon" aria-hidden="true">
              <Sparkles size={17} strokeWidth={1.8} />
            </span>
            <span className="director-scene-record-copy">
              <strong>Motion Director</strong>
              <small>{labels.context}</small>
            </span>
            <span className="director-scene-record-status" aria-live="polite">
              <i aria-hidden="true" />
              {state === "awaiting" ? labels.statusLive : labels.statusDraft}
            </span>
          </div>
          <div className="director-scene-summary" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="director-scene-action-row">
            <span className="director-scene-feedback" aria-live="polite">
              <Check aria-hidden="true" size={14} strokeWidth={2.2} />
              {actionLabel}
            </span>
            <button
              className="director-scene-button"
              type="button"
              disabled={state === "sending"}
              aria-busy={state === "sending" || undefined}
              onClick={() => setState(state === "awaiting" ? "ready" : "sending")}
            >
              <span className="director-scene-button-icon" aria-hidden="true">
                {state === "awaiting" ? <Check size={14} strokeWidth={2.2} /> : <ArrowRight size={14} strokeWidth={2.1} />}
              </span>
              <span>{state === "awaiting" ? labels.release : actionLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const workflowIcons = {
  recommend: Compass,
  compose: Layers3,
  implement: Code2,
  review: ClipboardCheck,
  contribute: WandSparkles
} as const;

export function MotionDirectorPage({ locale }: { locale: Locale }) {
  const labels = copy[locale];

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh"
          ? "Motion Director | 用场景设计产品动效"
          : "Motion Director | Design product motion from the scene"}
        description={labels.description}
        path={pathFor(locale, ["director"])}
        structuredData={[{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Motion Director",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          isAccessibleForFree: true,
          description: labels.description
        }]}
      />
      <div className="motion-director-page">
        <section className="director-hero" aria-labelledby="director-title">
          <div className="director-hero-copy">
            <span className="director-eyebrow">{labels.eyebrow}</span>
            <h1 id="director-title">{labels.title}</h1>
            <p>{labels.description}</p>
            <div className="director-hero-actions">
              <a href={skillUrl} target="_blank" rel="noreferrer">
                {labels.openSkill}
                <ArrowRight aria-hidden="true" size={15} strokeWidth={2} />
              </a>
              <Link to="/$locale/lab/motion-blueprints/" params={{ locale }}>
                {labels.browseCandidates}
              </Link>
            </div>
          </div>
          <div className="director-hero-stage">
            <div className="director-stage-head">
              <span>{labels.sceneLabel}</span>
              <span>240ms · status</span>
            </div>
            <div className="director-stage-copy">
              <h2>{labels.sceneTitle}</h2>
              <p>{labels.sceneDescription}</p>
            </div>
            <BlueprintScene labels={labels} />
          </div>
        </section>

        <section className="director-workflow" aria-labelledby="director-workflow-title">
          <div className="director-section-head">
            <div>
            <span className="director-eyebrow">{labels.workflowEyebrow}</span>
              <h2 id="director-workflow-title">{labels.workflowTitle}</h2>
            </div>
            <p>{labels.workflowDescription}</p>
          </div>
          <div className="director-mode-grid">
            {motionDirectorModes.map((mode, index) => {
              const Icon = workflowIcons[mode.id as keyof typeof workflowIcons];
              return (
                <article className="director-mode-card" key={mode.id}>
                  <span className="director-mode-index">0{index + 1}</span>
                  <span className="director-mode-icon" aria-hidden="true"><Icon size={20} strokeWidth={1.75} /></span>
                  <h3>{mode.title[locale]}</h3>
                  <p>{mode.description[locale]}</p>
                  <small>{mode.deliverable[locale]}</small>
                </article>
              );
            })}
          </div>
        </section>

        <section className="director-blueprint" aria-labelledby="director-blueprint-title">
          <div className="director-blueprint-copy">
            <span className="director-eyebrow">{labels.blueprintEyebrow}</span>
            <h2 id="director-blueprint-title">{labels.blueprintTitle}</h2>
            <p>{labels.blueprintDescription}</p>
            <Link className="director-text-link" to="/$locale/lab/motion-blueprints/" params={{ locale }}>
              {labels.candidateAction}
              <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
          <div className="director-blueprint-sheet">
            <div className="director-blueprint-sheet-top">
              <span>{motionBlueprintExample.id}</span>
              <WandSparkles aria-hidden="true" size={16} strokeWidth={1.75} />
            </div>
            <dl className="director-blueprint-list">
              <div>
                <dt>{labels.trigger}</dt>
                <dd>{motionBlueprintExample.actors.find((actor) => actor.role === "trigger")?.label[locale] ?? labels.release}</dd>
              </div>
              <div>
                <dt>{labels.stateGraph}</dt>
                <dd>{motionBlueprintExample.stateGraph.map((state) => state.label[locale]).join(" → ")}</dd>
              </div>
              <div>
                <dt>{labels.actors}</dt>
                <dd>{motionBlueprintExample.actors.map((actor) => actor.label[locale]).join(" · ")}</dd>
              </div>
              <div>
                <dt>{labels.beats}</dt>
                <dd>{motionBlueprintExample.beats.map((beat) => beat.at).join(" / ")}</dd>
              </div>
              <div>
                <dt>{labels.reducedMotion}</dt>
                <dd>{motionBlueprintExample.accessibility.reducedMotion[locale]}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="director-candidates" aria-labelledby="director-candidates-title">
          <div className="director-candidate-card">
            <div>
              <span className="director-eyebrow">{labels.candidateEyebrow}</span>
              <h2 id="director-candidates-title">{labels.candidateTitle}</h2>
              <p>{labels.candidateDescription}</p>
            </div>
            <Link to="/$locale/lab/motion-blueprints/" params={{ locale }}>
              {labels.candidateAction}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </section>

        <section className="director-collections" aria-labelledby="director-collections-title">
          <div className="director-section-head">
            <div>
              <span className="director-eyebrow">{labels.collectionsEyebrow}</span>
              <h2 id="director-collections-title">{labels.collectionsTitle}</h2>
            </div>
            <p>{labels.collectionsDescription}</p>
          </div>
          <div className="director-collection-grid">
            <Link className="director-collection-card" to="/$locale/packs/" params={{ locale }}>
              <span className="director-collection-icon" aria-hidden="true"><Layers3 size={20} strokeWidth={1.75} /></span>
              <span>
                <strong>{labels.packs} · {motionGrammar.collections.moments.count}</strong>
                <small>{labels.packsDescription}</small>
              </span>
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
            <Link
              className="director-collection-card"
              to="/$locale/catalog/"
              params={{ locale }}
              search={{ surface: "components" }}
            >
              <span className="director-collection-icon" aria-hidden="true"><Compass size={20} strokeWidth={1.75} /></span>
              <span>
                <strong>{labels.primitives} · {motionGrammar.collections.primitives.count}</strong>
                <small>{labels.primitivesDescription}</small>
              </span>
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
