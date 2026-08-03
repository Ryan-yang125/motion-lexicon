import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, CircleDotDashed, Code2 } from "../components/icons";
import { Seo } from "../components/Seo";
import { motionBlueprintExample } from "../data/motion-grammar";
import { pathFor } from "../data/site";
import type { Locale } from "../data/types";

type LabCopy = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  statusDetail: string;
  criteria: string;
  scene: string;
  trigger: string;
  actors: string;
  beats: string;
  accessibility: string;
  implementation: string;
  director: string;
  back: string;
  candidate: string;
  review: string;
  ready: string;
};

const copy: Record<Locale, LabCopy> = {
  zh: {
    eyebrow: "Motion Blueprint candidates",
    title: "候选库",
    description: "这里收集来自真实项目的动效蓝图。每一份候选都保留场景、状态、节奏和实现检查，公开前再完成复用验证。",
    status: "已发布参考",
    statusDetail: "等待场景复用验证",
    criteria: "发布前检查",
    scene: "场景",
    trigger: "触发",
    actors: "参与元素",
    beats: "节奏",
    accessibility: "可访问性",
    implementation: "实现",
    director: "Motion Director",
    back: "返回 Motion Director",
    candidate: "发送审批请求",
    review: "候选审查",
    ready: "可发布条件"
  },
  en: {
    eyebrow: "Motion Blueprint candidates",
    title: "Candidate library",
    description: "This space collects Motion Blueprints from real product work. Each candidate keeps its scene, states, beats, and implementation checks while reuse is validated before publication.",
    status: "Published reference",
    statusDetail: "Awaiting reuse validation",
    criteria: "Publication checks",
    scene: "Scene",
    trigger: "Trigger",
    actors: "Actors",
    beats: "Beats",
    accessibility: "Accessibility",
    implementation: "Implementation",
    director: "Motion Director",
    back: "Back to Motion Director",
    candidate: "Send an approval request",
    review: "Candidate review",
    ready: "Release conditions"
  }
};

const candidates = {
  zh: [
    { id: "01", title: "发布更新后的状态确认", detail: "结果停留在记录中，按钮只承担本次操作。", status: "实现中" },
    { id: "02", title: "成员权限变更", detail: "新角色抵达后，原权限的离开路径保持可追溯。", status: "场景验证" },
    { id: "03", title: "筛选结果重组", detail: "已有项目稳定，新结果在预留位置中进入。", status: "复用检查" }
  ],
  en: [
    { id: "01", title: "Status confirmation after publishing an update", detail: "The outcome remains in the record while the button carries this one action.", status: "Implementing" },
    { id: "02", title: "Member permission change", detail: "The new role arrives while the old permission keeps a traceable exit path.", status: "Scene validation" },
    { id: "03", title: "Filter result reorganization", detail: "Existing items stay stable as new results enter a reserved position.", status: "Reuse review" }
  ]
};

export function MotionBlueprintLabPage({ locale }: { locale: Locale }) {
  const labels = copy[locale];

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh" ? "Motion Blueprint 候选库 | Motion Lexicon" : "Motion Blueprint candidates | Motion Lexicon"}
        description={labels.description}
        path={pathFor(locale, ["lab", "motion-blueprints"])}
        noindex
      />
      <div className="motion-blueprint-lab">
        <section className="blueprint-lab-intro" aria-labelledby="blueprint-lab-title">
          <div>
            <span className="director-eyebrow">{labels.eyebrow}</span>
            <h1 id="blueprint-lab-title">{labels.title}</h1>
            <p>{labels.description}</p>
          </div>
          <Link className="blueprint-lab-back" to="/$locale/director/" params={{ locale }}>
            {labels.back}
            <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </section>

        <section className="blueprint-lab-layout" aria-label={labels.candidate}>
          <article className="blueprint-lab-primary">
            <div className="blueprint-lab-primary-top">
              <span className="blueprint-lab-id">blueprint.release-published</span>
              <span className="blueprint-lab-status"><CircleDotDashed aria-hidden="true" size={13} /> {labels.status}</span>
            </div>
            <h2>{motionBlueprintExample.title[locale]}</h2>
            <p>{motionBlueprintExample.brief[locale]}</p>
            <dl className="blueprint-lab-spec">
              <div><dt>{labels.scene}</dt><dd>{motionBlueprintExample.scene[locale]}</dd></div>
              <div><dt>{labels.trigger}</dt><dd>{motionBlueprintExample.actors.find((actor) => actor.role === "trigger")?.label[locale]}</dd></div>
              <div><dt>{labels.actors}</dt><dd>{motionBlueprintExample.actors.map((actor) => actor.label[locale]).join(locale === "zh" ? "、" : " · ")}</dd></div>
              <div><dt>{labels.beats}</dt><dd>{motionBlueprintExample.beats.map((beat) => beat.at).join(" / ")}</dd></div>
              <div><dt>{labels.accessibility}</dt><dd>{motionBlueprintExample.accessibility.reducedMotion[locale]}</dd></div>
              <div><dt>{labels.implementation}</dt><dd>{motionBlueprintExample.delivery.format.join(" · ").toUpperCase()}</dd></div>
            </dl>
          </article>

          <aside className="blueprint-lab-review" aria-labelledby="blueprint-review-title">
            <div className="blueprint-lab-review-head">
              <span className="director-eyebrow">{labels.review}</span>
            </div>
            <h2 id="blueprint-review-title">{labels.ready}</h2>
            <ul>
              <li><CheckCircle2 aria-hidden="true" size={15} /> {locale === "zh" ? "状态变化有明确结果" : "The state change has a clear outcome"}</li>
              <li><CheckCircle2 aria-hidden="true" size={15} /> {locale === "zh" ? "参与元素各自承担语义" : "Each actor has a semantic role"}</li>
              <li><CheckCircle2 aria-hidden="true" size={15} /> {locale === "zh" ? "减弱动效保留信息" : "Reduced motion preserves information"}</li>
              <li className="is-pending"><Code2 aria-hidden="true" size={15} /> {locale === "zh" ? "在第二个产品场景中复用" : "Reuse in a second product scene"}</li>
            </ul>
          </aside>
        </section>

        <section className="blueprint-lab-list" aria-labelledby="blueprint-list-title">
          <div className="director-section-head">
            <div>
              <span className="director-eyebrow">{labels.statusDetail}</span>
              <h2 id="blueprint-list-title">{labels.criteria}</h2>
            </div>
          </div>
          <div className="blueprint-lab-cards">
            {candidates[locale].map((candidate) => (
              <article className="blueprint-lab-card" key={candidate.id}>
                <span>{candidate.id}</span>
                <h3>{candidate.title}</h3>
                <p>{candidate.detail}</p>
                <small>{candidate.status}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
