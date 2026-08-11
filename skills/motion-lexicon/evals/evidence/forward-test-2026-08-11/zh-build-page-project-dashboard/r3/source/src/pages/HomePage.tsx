import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "../components/motion-lexicon/loading-button";
import { Button } from "../components/ui/Button";

type Project = {
  id: number;
  name: string;
  owner: string;
  status: "健康" | "关注" | "有风险";
  progress: number;
  milestone: string;
  fresh?: boolean;
};

const initialProjects: Project[] = [
  { id: 1, name: "Atlas 重构", owner: "林可", status: "健康", progress: 76, milestone: "4 月 26 日 · Beta 验收" },
  { id: 2, name: "客户门户 2.0", owner: "张扬", status: "关注", progress: 58, milestone: "5 月 03 日 · 设计冻结" },
  { id: 3, name: "数据治理一期", owner: "孟然", status: "有风险", progress: 34, milestone: "4 月 19 日 · 等待决策" },
];

const risks = [
  { project: "数据治理一期", detail: "数据口径待确认", owner: "孟然", due: "今天", tone: "critical" },
  { project: "客户门户 2.0", detail: "移动端测试资源不足", owner: "张扬", due: "明天", tone: "watch" },
  { project: "Atlas 重构", detail: "支付接口变更待评审", owner: "林可", due: "4 月 18 日", tone: "neutral" },
];

const activities = [
  ["林可", "完成了 Atlas 重构的 Beta 需求走查", "18 分钟前", "LK"],
  ["孟然", "将数据口径问题标记为待决策", "1 小时前", "MR"],
  ["张扬", "更新了客户门户 2.0 的测试计划", "3 小时前", "ZY"],
  ["周宁", "创建了本周项目健康度快照", "昨天", "ZN"],
] as const;

function StatusDot({ status }: { status: Project["status"] }) {
  return <span className={`status status--${status === "健康" ? "healthy" : status === "关注" ? "watch" : "risk"}`}>{status}</span>;
}

export function HomePage() {
  const [projects, setProjects] = useState(initialProjects);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [formError, setFormError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const openButton = useRef<HTMLButtonElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  const closeDialog = () => {
    setDialogOpen(false);
    setFormError("");
    window.setTimeout(() => openButton.current?.focus(), 30);
  };

  useEffect(() => {
    if (dialogOpen) window.setTimeout(() => nameInput.current?.focus(), 0);
  }, [dialogOpen]);

  const createProject = async () => {
    const name = projectName.trim();
    setFormError("");
    if (!name) {
      const message = "请输入项目名称。";
      setFormError(message);
      throw new Error(message);
    }
    if (projects.some((project) => project.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      const message = "已有同名项目，请换一个名称后重试。";
      setFormError(message);
      throw new Error(message);
    }
    await new Promise((resolve) => window.setTimeout(resolve, 620));
    setProjects((current) => [
      { id: Date.now(), name, owner: "我", status: "健康", progress: 0, milestone: "尚未设置下一个节点", fresh: true },
      ...current.map((project) => ({ ...project, fresh: false })),
    ]);
    setAnnouncement(`项目「${name}」已创建，已加入项目列表。`);
    setProjectName("");
    window.setTimeout(closeDialog, 820);
  };

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") { closeDialog(); return; }
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">项目空间 / 2026 Q2</p>
          <h1>项目总览</h1>
        </div>
        <div className="header-actions">
          <Button className="icon-button" aria-label="切换亮暗主题" aria-pressed={document.documentElement.classList.contains("dark")} onClick={() => document.documentElement.classList.toggle("dark")}>◐</Button>
          <Button ref={openButton} className="button button--primary" onClick={() => setDialogOpen(true)}>+ 新建项目</Button>
        </div>
      </header>

      <p className="page-intro">查看当前组合的状态，优先处理会影响交付节奏的事项。</p>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

      <section className="summary-grid" aria-label="项目健康度概览">
        <article className="health-card panel">
          <div className="section-label"><span>项目健康度</span><span className="trend">↑ 4.2%</span></div>
          <div className="score-line"><strong>82</strong><span>/ 100</span><span className="score-badge">良好</span></div>
          <div className="health-meter" aria-label="整体健康度 82 分"><span style={{ width: "82%" }} /></div>
          <p>本周总体向好，风险主要集中在数据依赖与测试资源。</p>
        </article>
        <article className="distribution-card panel">
          <div className="section-label"><span>项目分布</span><button className="text-action" type="button">查看报告</button></div>
          <div className="distribution-values"><div><strong>6</strong><span>健康</span></div><div><strong>2</strong><span>关注</span></div><div><strong>1</strong><span>风险</span></div></div>
          <div className="stacked-bar" aria-label="6 个健康，2 个关注，1 个风险"><span className="healthy" /><span className="watch" /><span className="risk" /></div>
        </article>
      </section>

      <section className="workspace-grid">
        <section className="project-area panel" aria-labelledby="projects-heading">
          <div className="section-heading"><div><p className="eyebrow">活跃项目</p><h2 id="projects-heading">正在推进</h2></div><span className="count-label">{projects.length} 个项目</span></div>
          <div className="project-list">
            {projects.map((project) => <article className={`project-row ${project.fresh ? "project-row--new" : ""}`} key={project.id}>
              <div className="project-main"><div className="project-title"><h3>{project.name}</h3>{project.fresh && <span className="new-badge">刚创建</span>}</div><p>{project.owner} · {project.milestone}</p></div>
              <StatusDot status={project.status} />
              <div className="progress-cell"><div><span>{project.progress}%</span><span>完成度</span></div><div className="row-progress" aria-label={`${project.name} 完成度 ${project.progress}%`}><span style={{ width: `${project.progress}%` }} /></div></div>
              <button className="row-action" type="button" aria-label={`打开 ${project.name}`}>查看</button>
            </article>)}
          </div>
        </section>

        <aside className="side-column">
          <section className="risk-card panel" aria-labelledby="risks-heading"><div className="section-heading"><div><p className="eyebrow">需要行动</p><h2 id="risks-heading">待处理风险</h2></div><span className="risk-count">3</span></div><div className="risk-list">{risks.map((risk) => <article className="risk-item" key={risk.detail}><span className={`risk-marker risk-marker--${risk.tone}`} /><div><h3>{risk.detail}</h3><p>{risk.project} · {risk.owner}</p></div><time>{risk.due}</time></article>)}</div><button className="text-action text-action--footer" type="button">查看全部风险 →</button></section>
          <section className="activity-card panel" aria-labelledby="activity-heading"><div className="section-heading"><div><p className="eyebrow">协作脉络</p><h2 id="activity-heading">最近活动</h2></div><button className="text-action" type="button">全部</button></div><ol className="activity-list">{activities.map(([person, action, time, initials]) => <li key={action}><span className="avatar" aria-hidden="true">{initials}</span><p><strong>{person}</strong>{action}<time>{time}</time></p></li>)}</ol></section>
        </aside>
      </section>

      {dialogOpen && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}><div className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description" onKeyDown={trapFocus}><button className="dialog-close" type="button" aria-label="关闭新建项目" onClick={closeDialog}>×</button><p className="eyebrow">创建新记录</p><h2 id="dialog-title">新建项目</h2><p id="dialog-description">创建后会直接出现在“正在推进”列表的顶部。</p><label htmlFor="project-name">项目名称</label><input ref={nameInput} id="project-name" value={projectName} onChange={(event) => { setProjectName(event.target.value); setFormError(""); }} aria-invalid={Boolean(formError)} aria-describedby={formError ? "project-error" : undefined} placeholder="例如：增长实验 Q3" /><p className="form-error" id="project-error" role="alert">{formError}</p><div className="dialog-actions"><Button className="button button--quiet" onClick={closeDialog}>取消</Button><LoadingButton className="min-h-[44px] min-w-[116px] border-0 !bg-[#4568ff] !text-white hover:!bg-[#3659ec] dark:!bg-[#93b0ff] dark:!text-[#141312]" onAction={createProject} pendingLabel="正在创建…" successLabel="已创建" errorLabel="请重试" onError={() => nameInput.current?.focus()}>创建项目</LoadingButton></div></div></div>}
    </main>
  );
}
