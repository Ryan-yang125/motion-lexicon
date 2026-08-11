type Scene = {
  id: string;
  index: string;
  context: string;
  title: string;
  description: string;
  idleLabel: string;
  pendingLabel: string;
  nextLabel: string;
  idleStatus: string;
  pendingStatus: string;
  readyStatus: string;
  repeatStatus: string;
  cancelStatus: string;
  openedStatus: string;
  placeholder: string;
  result: string;
  delay: string;
  retryLabel?: string;
  recoveringLabel?: string;
  failureStatus?: string;
  recoveringStatus?: string;
  failFirst?: string;
};

const scenes: Scene[] = [
  {
    id: "analytics",
    index: "01",
    context: "Analytics",
    title: "Export to inspection",
    description: "The export control becomes the route into the finished report.",
    idleLabel: "Generate report",
    pendingLabel: "Generating report…",
    nextLabel: "Open report",
    idleStatus: "Ready to generate the weekly acquisition report.",
    pendingStatus: "Generating the weekly acquisition report…",
    readyStatus: "Report generated. Open report is now available.",
    repeatStatus: "Report generation is already in progress.",
    cancelStatus: "Report generation cancelled. Ready to try again.",
    openedStatus: "Weekly acquisition report opened.",
    placeholder: "Report output will appear here.",
    result: "Weekly acquisition · 18 pages · generated just now",
    delay: "520",
  },
  {
    id: "member",
    index: "02",
    context: "Team access",
    title: "Invite to member record",
    description: "The send action becomes the entry point to the invited member.",
    idleLabel: "Send invitation",
    pendingLabel: "Sending invitation…",
    nextLabel: "View member",
    idleStatus: "Ready to invite Maya to the launch workspace.",
    pendingStatus: "Sending Maya’s workspace invitation…",
    readyStatus: "Invitation sent. View member is now available.",
    repeatStatus: "Maya’s invitation is already being sent.",
    cancelStatus: "Invitation cancelled. Ready to try again.",
    openedStatus: "Maya’s member profile opened.",
    placeholder: "Member details will appear here.",
    result: "Maya Chen · Editor · Invitation sent just now",
    delay: "620",
  },
  {
    id: "backup",
    index: "03",
    context: "Infrastructure",
    title: "Backup to review",
    description: "Failure stays recoverable; success hands the control to inspection.",
    idleLabel: "Create backup",
    pendingLabel: "Creating backup…",
    retryLabel: "Retry backup",
    recoveringLabel: "Retrying backup…",
    nextLabel: "Review backup",
    idleStatus: "Ready to create a restore point before deployment.",
    pendingStatus: "Creating a restore point…",
    failureStatus: "Backup interrupted. Retry backup is available.",
    recoveringStatus: "Retry accepted. Preparing a new backup request.",
    readyStatus: "Backup created. Review backup is now available.",
    repeatStatus: "Backup creation is already in progress.",
    cancelStatus: "Backup creation cancelled. Ready to try again.",
    openedStatus: "Backup restore point opened for review.",
    placeholder: "Backup details will appear here.",
    result: "Restore point #1842 · Verified · 2.8 GB",
    failFirst: "true",
    delay: "540",
  },
];

function CandidateScene({ scene }: { scene: Scene }) {
  const statusId = `${scene.id}-status`;
  const titleId = `${scene.id}-title`;

  return (
    <section
      className="sah-scene"
      data-status-action
      data-state="idle"
      data-idle-label={scene.idleLabel}
      data-pending-label={scene.pendingLabel}
      data-retry-label={scene.retryLabel}
      data-recovering-label={scene.recoveringLabel}
      data-next-label={scene.nextLabel}
      data-idle-status={scene.idleStatus}
      data-pending-status={scene.pendingStatus}
      data-failure-status={scene.failureStatus}
      data-recovering-status={scene.recoveringStatus}
      data-ready-status={scene.readyStatus}
      data-repeat-status={scene.repeatStatus}
      data-cancel-status={scene.cancelStatus}
      data-opened-status={scene.openedStatus}
      data-result={scene.result}
      data-fail-first={scene.failFirst}
      data-delay={scene.delay}
      aria-labelledby={titleId}
    >
      <header className="sah-scene__header">
        <p className="sah-scene__index">{scene.index} · {scene.context}</p>
        <h2 className="sah-scene__title" id={titleId}>{scene.title}</h2>
        <p className="sah-scene__copy">{scene.description}</p>
      </header>

      <div className="sah-well" data-result-well>
        <p className="sah-result" data-result>{scene.placeholder}</p>
      </div>

      <div className="sah-control-reserve">
        <button className="sah-action" type="button" data-action aria-describedby={statusId}>
          <span className="sah-icon-stage" aria-hidden="true"><span className="sah-operation-mark" /></span>
          <span className="sah-label-stage" aria-hidden="true">
            <span className="sah-label sah-label--operation" data-operation-label>{scene.idleLabel}</span>
            <span className="sah-label sah-label--next" data-next-label>{scene.nextLabel}</span>
          </span>
          <span className="sah-arrow" aria-hidden="true">→</span>
        </button>
      </div>

      <p className="sah-status" id={statusId} data-status aria-live="polite" aria-atomic="true" />
    </section>
  );
}

export function HomePage() {
  useEffect(() => {
    const moduleUrl = "/candidates/status-action-handoff/status-action-handoff.js";
    void import(/* @vite-ignore */ moduleUrl).then((module) => {
      module.initStatusActionHandoffs(document);
    });
  }, []);

  return (
    <main className="sah-page">
      <header className="sah-intro">
        <div>
          <p className="sah-eyebrow">Primitive candidate · status-action-handoff</p>
          <h1 className="sah-title">Done becomes<br />what’s next.</h1>
        </div>
        <p className="sah-lede">A completed operation hands the same stable control forward as the next useful action. Three contexts, one persistent behavioral contract.</p>
      </header>

      <div className="sah-grid">
        {scenes.map((scene) => <CandidateScene key={scene.id} scene={scene} />)}
      </div>

      <p className="sah-footnote">Focus stays on the persistent control. Press Escape while an operation is pending to cancel it.</p>
    </main>
  );
}
import { useEffect } from "react";
