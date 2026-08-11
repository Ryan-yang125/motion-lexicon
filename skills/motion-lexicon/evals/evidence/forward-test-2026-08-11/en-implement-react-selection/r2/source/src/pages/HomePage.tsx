import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";

type Project = {
  id: string;
  name: string;
  description: string;
  status: "On track" | "At risk" | "Planning";
  owner: string;
  updated: string;
  progress: number;
};

const projects: Project[] = [
  {
    id: "atlas",
    name: "Atlas mobile",
    description: "A calmer, faster field workflow for the Atlas team.",
    status: "On track",
    owner: "Maya Chen",
    updated: "Updated 12 min ago",
    progress: 78,
  },
  {
    id: "northstar",
    name: "Northstar",
    description: "Unifying customer health signals into one daily view.",
    status: "At risk",
    owner: "Diego Ramos",
    updated: "Updated yesterday",
    progress: 46,
  },
  {
    id: "lumen",
    name: "Lumen launch",
    description: "Preparing the release story, campaign, and onboarding.",
    status: "Planning",
    owner: "Samira Patel",
    updated: "Updated 3 days ago",
    progress: 24,
  },
];

export function HomePage() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const inspectorTitleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? projects[0];

  const closeInspector = (returnFocus = false) => {
    setInspectorOpen(false);
    if (returnFocus) {
      window.requestAnimationFrame(() => cardRefs.current[selectedProjectId]?.focus());
    }
  };

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setInspectorOpen(true);
  };

  useEffect(() => {
    if (!inspectorOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeInspector(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inspectorOpen, selectedProjectId]);

  useEffect(() => {
    if (inspectorOpen) inspectorTitleRef.current?.focus();
  }, [inspectorOpen, selectedProjectId]);

  return (
    <main className="workspace" data-state={inspectorOpen ? "inspecting" : "browsing"}>
      <header className="workspace__header">
        <div>
          <p className="eyebrow">Workspace / Projects</p>
          <h1>Active projects</h1>
          <p className="workspace__intro">Select a project to inspect its current delivery details.</p>
        </div>
        <Button onClick={() => document.documentElement.classList.toggle("dark")}>Toggle theme</Button>
      </header>

      <div className="project-layout">
        <section className="project-list" aria-label="Projects">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;
            return (
              <button
                className="project-card"
                data-selected={isSelected}
                type="button"
                key={project.id}
                aria-pressed={isSelected}
                aria-controls="project-inspector"
                ref={(node) => {
                  cardRefs.current[project.id] = node;
                }}
                onClick={() => selectProject(project.id)}
              >
                <span className="project-card__topline">
                  <span className={`status status--${project.status.replace(" ", "-").toLowerCase()}`}>
                    {project.status}
                  </span>
                  <span>{project.updated}</span>
                </span>
                <span className="project-card__name">{project.name}</span>
                <span className="project-card__description">{project.description}</span>
                <span className="project-card__footer">
                  <span>{project.owner}</span>
                  <span>{project.progress}% complete</span>
                </span>
              </button>
            );
          })}
        </section>

        <aside
          className="project-inspector"
          data-state={inspectorOpen ? "open" : "closed"}
          id="project-inspector"
          aria-hidden={!inspectorOpen}
          inert={!inspectorOpen}
          aria-labelledby="inspector-title"
        >
          <div className="project-inspector__content">
            <div className="project-inspector__header">
              <div>
                <p className="eyebrow">Project inspector</p>
                <h2 id="inspector-title" tabIndex={-1} ref={inspectorTitleRef}>
                  {selectedProject.name}
                </h2>
              </div>
              <Button aria-label="Close project inspector" onClick={() => closeInspector(true)}>
                <span aria-hidden="true">×</span>
              </Button>
            </div>

            <p className="project-inspector__description">{selectedProject.description}</p>
            <dl className="project-details">
              <div>
                <dt>Delivery health</dt>
                <dd>{selectedProject.status}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{selectedProject.owner}</dd>
              </div>
              <div>
                <dt>Progress</dt>
                <dd>{selectedProject.progress}%</dd>
              </div>
            </dl>
            <div className="project-progress" aria-label={`${selectedProject.progress}% complete`}>
              <span style={{ width: `${selectedProject.progress}%` }} />
            </div>
            <p className="project-inspector__hint">Press Escape to close and return to the selected project.</p>
          </div>
        </aside>
      </div>

      <p className="sr-only" aria-live="polite">
        {inspectorOpen ? `${selectedProject.name} inspector open.` : "Project inspector closed."}
      </p>
    </main>
  );
}
