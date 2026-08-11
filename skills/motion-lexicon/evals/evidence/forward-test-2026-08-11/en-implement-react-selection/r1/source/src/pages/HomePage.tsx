import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";

type Project = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Planning" | "Review";
  progress: number;
  due: string;
  members: string[];
  accent: string;
};

const projects: Project[] = [
  {
    id: "northstar",
    name: "Northstar",
    description: "A calmer, more confident workspace for everyday planning.",
    status: "Active",
    progress: 72,
    due: "Sep 18",
    members: ["AL", "MK", "JT"],
    accent: "#635bff",
  },
  {
    id: "horizon",
    name: "Horizon",
    description: "Bringing release signals, quality checks, and owners into view.",
    status: "Planning",
    progress: 28,
    due: "Oct 02",
    members: ["DB", "SR", "NV"],
    accent: "#d97706",
  },
  {
    id: "fable",
    name: "Fable",
    description: "A reusable visual language for product education and launch.",
    status: "Review",
    progress: 91,
    due: "Aug 29",
    members: ["EC", "AP", "LK"],
    accent: "#0f9b78",
  },
];

export function HomePage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null;

  const closeInspector = (returnFocus = true) => {
    const selectedId = selectedProjectId;
    setSelectedProjectId(null);

    if (returnFocus && selectedId) {
      requestAnimationFrame(() => cardRefs.current.get(selectedId)?.focus());
    }
  };

  useEffect(() => {
    if (!selectedProjectId) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeInspector();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) closeButtonRef.current?.focus();
  }, [selectedProjectId]);

  return (
    <main className="workspace" data-state={selectedProject ? "inspecting" : "browsing"}>
      <header className="workspace__header">
        <div>
          <p className="eyebrow">VANTAGE / PROJECTS</p>
          <h1>Make progress visible.</h1>
          <p className="workspace__lede">Select a project to inspect its current trajectory.</p>
        </div>
        <Button
          className="theme-toggle"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          Toggle theme
        </Button>
      </header>

      <div className="workspace__layout">
        <section className="project-list" aria-labelledby="projects-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">IN FLIGHT</p>
              <h2 id="projects-heading">Your projects</h2>
            </div>
            <span className="project-count">{projects.length} active</span>
          </div>

          <div className="project-grid">
            {projects.map((project) => {
              const isSelected = project.id === selectedProjectId;
              return (
                <button
                  key={project.id}
                  ref={(node) => {
                    if (node) cardRefs.current.set(project.id, node);
                    else cardRefs.current.delete(project.id);
                  }}
                  className="project-card"
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Inspect ${project.name}`}
                  data-selected={isSelected}
                  style={{ "--project-accent": project.accent } as React.CSSProperties}
                  onClick={() => setSelectedProjectId(project.id)}
                >
                  <span className="project-card__topline">
                    <span className={`status-dot status-dot--${project.status.toLowerCase()}`} />
                    {project.status}
                    <span className="project-card__arrow" aria-hidden="true">↗</span>
                  </span>
                  <strong>{project.name}</strong>
                  <span className="project-card__description">{project.description}</span>
                  <span className="project-card__footer">
                    <span className="avatar-stack" aria-label={`${project.members.length} team members`}>
                      {project.members.map((member) => <span key={member}>{member}</span>)}
                    </span>
                    <span>{project.progress}% complete</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside
          className="inspector"
          aria-labelledby="inspector-title"
          aria-hidden={!selectedProject}
          data-state={selectedProject ? "open" : "closed"}
        >
          <div className="inspector__empty" aria-hidden={Boolean(selectedProject)}>
            <span className="inspector__glyph">+</span>
            <p>Select a project</p>
            <span>Details will appear here.</span>
          </div>

          {selectedProject && (
            <div className="inspector__content">
              <div className="inspector__topline">
                <span className="eyebrow">PROJECT INSPECTOR</span>
                <Button
                  ref={closeButtonRef}
                  className="inspector__close"
                  type="button"
                  onClick={() => closeInspector()}
                  aria-label={`Close ${selectedProject.name} inspector`}
                >
                  <span aria-hidden="true">×</span>
                </Button>
              </div>
              <div className="inspector__title-row">
                <span className="project-mark" style={{ background: selectedProject.accent }} aria-hidden="true" />
                <div>
                  <h2 id="inspector-title">{selectedProject.name}</h2>
                  <p>{selectedProject.description}</p>
                </div>
              </div>

              <div className="progress-block">
                <div className="progress-block__label"><span>Momentum</span><strong>{selectedProject.progress}%</strong></div>
                <div className="progress-track" aria-label={`${selectedProject.progress}% complete`}>
                  <span style={{ width: `${selectedProject.progress}%`, background: selectedProject.accent }} />
                </div>
              </div>

              <dl className="project-facts">
                <div><dt>Status</dt><dd><span className={`status-dot status-dot--${selectedProject.status.toLowerCase()}`} />{selectedProject.status}</dd></div>
                <div><dt>Next milestone</dt><dd>Product review</dd></div>
                <div><dt>Target date</dt><dd>{selectedProject.due}</dd></div>
                <div><dt>Team</dt><dd><span className="avatar-stack">{selectedProject.members.map((member) => <span key={member}>{member}</span>)}</span></dd></div>
              </dl>

              <p className="escape-hint"><kbd>Esc</kbd> to return to projects</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
