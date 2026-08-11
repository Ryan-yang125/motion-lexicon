import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";

type Project = {
  id: string;
  name: string;
  code: string;
  status: "On track" | "At risk" | "Planning";
  owner: string;
  due: string;
  summary: string;
  progress: number;
  activity: string;
};

const projects: Project[] = [
  {
    id: "northstar",
    name: "Northstar onboarding",
    code: "PRJ-184",
    status: "On track",
    owner: "Maya Chen",
    due: "Sep 16",
    summary: "A guided first-run flow that gets new teams to their first shared project.",
    progress: 72,
    activity: "Research playback approved · 18 min ago",
  },
  {
    id: "atlas",
    name: "Atlas reporting",
    code: "PRJ-226",
    status: "At risk",
    owner: "Elliot Park",
    due: "Sep 28",
    summary: "Bring saved report views and scheduled exports into one dependable workspace.",
    progress: 48,
    activity: "Export reliability review added · 42 min ago",
  },
  {
    id: "relay",
    name: "Relay automations",
    code: "PRJ-241",
    status: "Planning",
    owner: "Jordan Lee",
    due: "Oct 09",
    summary: "Shape the first set of event-driven automation templates for account teams.",
    progress: 18,
    activity: "Scope workshop scheduled · Yesterday",
  },
  {
    id: "harbor",
    name: "Harbor permissions",
    code: "PRJ-198",
    status: "On track",
    owner: "Sofia Reyes",
    due: "Oct 14",
    summary: "Make roles and access decisions easier to review across growing workspaces.",
    progress: 64,
    activity: "Role matrix updated · Yesterday",
  },
];

export function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const selectedProject = projects.find((project) => project.id === selectedId) ?? null;

  const returnFocusToSelectedCard = () => {
    if (selectedId) cardRefs.current[selectedId]?.focus();
  };

  const closeInspector = () => {
    setSelectedId(null);
    window.requestAnimationFrame(returnFocusToSelectedCard);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedId) {
        event.preventDefault();
        closeInspector();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  return (
    <main className="project-app" data-state={selectedProject ? "inspecting" : "browsing"}>
      <header className="project-app__header">
        <div>
          <p className="eyebrow">Workspace / Active projects</p>
          <h1>Projects</h1>
          <p className="project-app__intro">Choose a project to inspect its current handoff.</p>
        </div>
        <Button
          className="theme-toggle"
          type="button"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          Toggle theme
        </Button>
      </header>

      <section className="project-layout" aria-label="Projects and inspector">
        <section className="project-list" aria-labelledby="project-list-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">4 active</p>
              <h2 id="project-list-title">Project directory</h2>
            </div>
            <p className="selection-hint" aria-live="polite">
              {selectedProject ? `${selectedProject.name} selected` : "Select a project"}
            </p>
          </div>

          <div className="project-grid">
            {projects.map((project) => {
              const selected = project.id === selectedId;
              return (
                <button
                  key={project.id}
                  ref={(node) => { cardRefs.current[project.id] = node; }}
                  className="project-card"
                  type="button"
                  aria-pressed={selected}
                  aria-controls="project-inspector"
                  onClick={() => setSelectedId(project.id)}
                >
                  <span className="project-card__topline">
                    <span className="project-code">{project.code}</span>
                    <span className={`status status--${project.status.toLowerCase().replace(" ", "-")}`}>
                      {project.status}
                    </span>
                  </span>
                  <span className="project-card__name">{project.name}</span>
                  <span className="project-card__meta">{project.owner} · Due {project.due}</span>
                  <span className="progress-track" aria-label={`${project.progress}% complete`}>
                    <span className="progress-track__value" style={{ width: `${project.progress}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside
          id="project-inspector"
          className="project-inspector"
          aria-labelledby="inspector-title"
          aria-hidden={!selectedProject}
          inert={!selectedProject}
          data-state={selectedProject ? "open" : "closed"}
        >
          <div className="project-inspector__content">
            {selectedProject ? (
              <>
                <div className="inspector-heading">
                  <div>
                    <p className="eyebrow">{selectedProject.code}</p>
                    <h2 id="inspector-title">{selectedProject.name}</h2>
                  </div>
                  <button className="icon-button" type="button" aria-label="Close inspector" onClick={closeInspector}>
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <p className="project-inspector__summary">{selectedProject.summary}</p>
                <dl className="project-facts">
                  <div><dt>Owner</dt><dd>{selectedProject.owner}</dd></div>
                  <div><dt>Target</dt><dd>{selectedProject.due}</dd></div>
                  <div><dt>Progress</dt><dd>{selectedProject.progress}% complete</dd></div>
                </dl>
                <div className="activity-note">
                  <p className="eyebrow">Latest activity</p>
                  <p>{selectedProject.activity}</p>
                </div>
                <Button type="button" className="open-project-button">Open project</Button>
                <p className="escape-hint"><kbd>Esc</kbd> closes the inspector</p>
              </>
            ) : (
              <div className="inspector-empty">
                <p className="eyebrow">Inspector</p>
                <h2 id="inspector-title">Project context</h2>
                <p>Select a card to review the project owner, timing, and latest activity.</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
