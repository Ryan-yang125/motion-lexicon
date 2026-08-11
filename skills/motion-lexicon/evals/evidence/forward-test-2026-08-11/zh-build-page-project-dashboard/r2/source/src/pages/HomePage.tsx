import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";

type Project = {
  id: number;
  name: string;
  owner: string;
  progress: number;
  health: "健康" | "需关注" | "有风险";
  due: string;
  isNew?: boolean;
};

const initialProjects: Project[] = [
  { id: 1, name: "客户门户改版", owner: "林澈", progress: 76, health: "健康", due: "6 月 28 日" },
  { id: 2, name: "国际化结算", owner: "周遥", progress: 48, health: "需关注", due: "7 月 12 日" },
  { id: 3, name: "数据治理一期", owner: "孟舟", progress: 31, health: "有风险", due: "7 月 19 日" },
];

const activities = [
  ["林澈", "完成了客户门户的验收范围确认", "18 分钟前"],
  ["周遥", "将结算项目的测试窗口调整至周四", "2 小时前"],
  ["孟舟", "新增了一项数据口径待确认风险", "昨天"],
];

export function HomePage() {
  const [projects, setProjects] = useState(initialProjects);
  const [isComposerOpen, setComposerOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [formError, setFormError] = useState("");
  const [requestState, setRequestState] = useState<"idle" | "pending" | "success" | "cancelled">("idle");
  const [isDark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const composerInput = useRef<HTMLInputElement>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const requestTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(requestTimer.current), []);

  useEffect(() => {
    if (isComposerOpen) window.requestAnimationFrame(() => composerInput.current?.focus());
  }, [isComposerOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isComposerOpen) {
        event.preventDefault();
        closeComposer();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isComposerOpen, requestState]);

  function openComposer() {
    setComposerOpen(true);
    setFormError("");
    setRequestState("idle");
  }

  function closeComposer() {
    if (requestState === "pending") {
      window.clearTimeout(requestTimer.current);
      setRequestState("cancelled");
      setComposerOpen(false);
      window.requestAnimationFrame(() => createButton.current?.focus());
      return;
    }
    setComposerOpen(false);
    setFormError("");
    window.requestAnimationFrame(() => createButton.current?.focus());
  }

  function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = projectName.trim();
    if (!name) {
      setFormError("请输入项目名称后再创建。");
      composerInput.current?.focus();
      return;
    }

    setFormError("");
    setRequestState("pending");
    requestTimer.current = window.setTimeout(() => {
      setProjects((current) => [
        {
          id: Date.now(),
          name,
          owner: "你",
          progress: 0,
          health: "健康",
          due: "尚未设置",
          isNew: true,
        },
        ...current.map((project) => ({ ...project, isNew: false })),
      ]);
      setProjectName("");
      setComposerOpen(false);
      setRequestState("success");
      window.requestAnimationFrame(() => createButton.current?.focus());
    }, 650);
  }

  function onComposerKeyDown(event: ReactKeyboardEvent<HTMLFormElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeComposer();
    }
  }

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    setDark((value) => !value);
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div className="brand-lockup" aria-label="Orbit 项目空间">
          <span className="brand-mark" aria-hidden="true">O</span>
          <span>orbit</span>
        </div>
        <div className="topbar-actions">
          <Button className="icon-button" onClick={toggleTheme} aria-label={isDark ? "切换为浅色主题" : "切换为深色主题"}>
            {isDark ? "☀" : "◐"}
          </Button>
          <Button ref={createButton} className="button button-primary" onClick={openComposer}>
            <span aria-hidden="true">＋</span> 新建项目
          </Button>
        </div>
      </header>

      <section className="page-heading" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">项目空间 / 2026 Q2</p>
          <h1 id="page-title">项目总览</h1>
          <p className="page-subtitle">把注意力放在需要推进的工作上。</p>
        </div>
        <p className="sync-status"><span className="sync-dot" /> 刚刚同步</p>
      </section>

      <section className="health-section" aria-labelledby="health-title">
        <div className="section-heading compact-heading">
          <div><p className="eyebrow">Portfolio health</p><h2 id="health-title">项目健康度</h2></div>
          <span className="health-summary"><strong>72</strong> / 100 <span>健康</span></span>
        </div>
        <div className="health-grid">
          <article className="health-hero">
            <div className="health-score"><strong>72</strong><span>整体健康分</span></div>
            <div className="score-track" role="img" aria-label="整体健康度 72 分，共 100 分"><span style={{ width: "72%" }} /></div>
            <p>大多数项目正按计划推进；优先处理 2 项阻塞，守住下一个交付窗口。</p>
          </article>
          <div className="health-stat"><span className="stat-icon success" aria-hidden="true">↗</span><strong>3</strong><span>进展健康</span></div>
          <div className="health-stat"><span className="stat-icon warning" aria-hidden="true">!</span><strong>2</strong><span>需要关注</span></div>
          <div className="health-stat"><span className="stat-icon risk" aria-hidden="true">×</span><strong>1</strong><span>存在风险</span></div>
        </div>
      </section>

      {isComposerOpen && (
        <section className="project-composer" aria-labelledby="composer-title">
          <div>
            <p className="eyebrow">New project</p>
            <h2 id="composer-title">创建一个新项目</h2>
          </div>
          <form onSubmit={createProject} onKeyDown={onComposerKeyDown} noValidate>
            <label htmlFor="project-name">项目名称</label>
            <div className="composer-controls">
              <input
                ref={composerInput}
                id="project-name"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? "project-name-error" : undefined}
                placeholder="例如：北极星增长计划"
                disabled={requestState === "pending"}
              />
              <Button className="button button-primary submit-project" type="submit" disabled={requestState === "pending"}>
                {requestState === "pending" ? "创建中…" : "创建项目"}
              </Button>
              <Button className="button button-quiet" type="button" onClick={closeComposer} disabled={requestState === "pending"}>取消</Button>
            </div>
            <p id="project-name-error" className="field-message" data-state={formError ? "error" : "idle"} role="alert">{formError}</p>
          </form>
        </section>
      )}

      <p className="sr-only" aria-live="polite">
        {requestState === "pending" ? "正在创建项目" : requestState === "success" ? "项目已创建，并已添加到项目列表顶部。" : requestState === "cancelled" ? "已取消创建项目。" : ""}
      </p>

      <div className="content-grid">
        <section className="projects-section panel" aria-labelledby="projects-title">
          <div className="section-heading">
            <div><p className="eyebrow">Active work</p><h2 id="projects-title">进行中的项目 <span>{projects.length}</span></h2></div>
            <button className="text-button" type="button">查看全部 <span aria-hidden="true">→</span></button>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className={`project-row${project.isNew ? " is-new" : ""}`} key={project.id}>
                <div className="project-main">
                  <div className={`status-orb ${statusClass(project.health)}`} aria-hidden="true" />
                  <div><div className="project-name">{project.name} {project.isNew && <span className="new-badge">已创建</span>}</div><p>{project.owner} · 截止 {project.due}</p></div>
                </div>
                <div className="project-progress"><span>{project.progress}%</span><div className="mini-track"><i style={{ width: `${project.progress}%` }} /></div></div>
                <span className={`health-badge ${statusClass(project.health)}`}>{project.health}</span>
              </article>
            ))}
          </div>
        </section>

        <aside className="side-stack">
          <section className="panel risk-section" aria-labelledby="risk-title">
            <div className="section-heading"><div><p className="eyebrow">Needs attention</p><h2 id="risk-title">待处理风险 <span className="count-badge">2</span></h2></div><button className="text-button" type="button">风险台账</button></div>
            <ol className="risk-list">
              <li><span className="risk-priority high">高</span><div><strong>数据口径尚未确认</strong><p>数据治理一期 · 影响 7 月交付</p></div><button className="chevron-button" type="button" aria-label="查看数据口径风险">›</button></li>
              <li><span className="risk-priority medium">中</span><div><strong>测试环境排期冲突</strong><p>国际化结算 · 等待平台组确认</p></div><button className="chevron-button" type="button" aria-label="查看测试环境风险">›</button></li>
            </ol>
          </section>

          <section className="panel activity-section" aria-labelledby="activity-title">
            <div className="section-heading"><div><p className="eyebrow">Latest signals</p><h2 id="activity-title">最近活动</h2></div></div>
            <ol className="activity-list">
              {activities.map(([person, action, time]) => <li key={action}><span className="avatar" aria-hidden="true">{person.slice(0, 1)}</span><p><strong>{person}</strong>{action}<time>{time}</time></p></li>)}
            </ol>
          </section>
        </aside>
      </div>
    </main>
  );
}

function statusClass(health: Project["health"]) {
  return health === "健康" ? "healthy" : health === "需关注" ? "watch" : "at-risk";
}
