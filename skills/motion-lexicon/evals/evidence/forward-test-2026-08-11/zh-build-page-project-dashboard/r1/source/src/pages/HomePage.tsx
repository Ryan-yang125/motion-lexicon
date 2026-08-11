import { useState } from "react";
import { ActivityFeed, type ActivityItem } from "../components/motion-lexicon/activity-feed";
import { LoadingButton } from "../components/motion-lexicon/loading-button";
import { Button } from "../components/ui/Button";

type Project = {
  id: string;
  name: string;
  owner: string;
  progress: number;
  health: "健康" | "关注" | "风险";
  due: string;
  isNew?: boolean;
};

const initialProjects: Project[] = [
  { id: "atlas", name: "Atlas 企业版", owner: "林哲", progress: 78, health: "健康", due: "9 月 18 日" },
  { id: "relay", name: "Relay 自动化", owner: "周雨", progress: 56, health: "关注", due: "9 月 12 日" },
  { id: "mobile", name: "移动端改版", owner: "许宁", progress: 34, health: "风险", due: "9 月 08 日" },
  { id: "insight", name: "Insight 报表", owner: "顾言", progress: 82, health: "健康", due: "9 月 26 日" },
];

const initialActivity: ActivityItem[] = [
  { id: "activity-1", title: "移动端改版已标记为风险", description: "依赖的埋点方案尚未确认", time: "09:20", group: "今天", unread: true, tone: "warning" },
  { id: "activity-2", title: "Atlas 企业版完成验收", description: "客户验收清单已同步", time: "昨天 16:42", group: "昨天", tone: "success" },
  { id: "activity-3", title: "Relay 自动化更新了里程碑", description: "首批工作流进入联调", time: "昨天 10:08", group: "昨天", tone: "neutral" },
];

function AddIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 4.2v11.6M4.2 10h11.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function ThemeIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M15.7 12.3A6.3 6.3 0 0 1 7.7 4.3 6.3 6.3 0 1 0 15.7 12.3Z" stroke="currentColor" strokeWidth="1.55" strokeLinejoin="round" /></svg>;
}

export function HomePage() {
  const [projects, setProjects] = useState(initialProjects);
  const [activity, setActivity] = useState(initialActivity);
  const [createdProject, setCreatedProject] = useState<string | null>(null);

  const createProject = () => new Promise<void>((resolve) => {
    window.setTimeout(() => {
      const number = projects.filter((project) => project.isNew).length + 1;
      const name = number === 1 ? "增长实验室" : `增长实验室 ${number}`;
      const project: Project = { id: `new-${Date.now()}`, name, owner: "你", progress: 0, health: "健康", due: "待排期", isNew: true };
      setProjects((current) => [project, ...current.map((item) => ({ ...item, isNew: false }))]);
      setActivity((current) => [{ id: `created-${Date.now()}`, title: `已新建项目：${name}`, description: "项目已加入总览，等待补充负责人和里程碑", time: "刚刚", group: "今天", unread: true, tone: "success" }, ...current.map((item) => ({ ...item, unread: false }))]);
      setCreatedProject(name);
      resolve();
    }, 620);
  });

  const toggleTheme = () => document.documentElement.classList.toggle("dark");
  const healthyCount = projects.filter((project) => project.health === "健康").length;

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>projects</span>
        </div>
        <div className="header-actions">
          <Button className="theme-button" onClick={toggleTheme} aria-label="切换深色主题" title="切换深色主题"><ThemeIcon /></Button>
          <LoadingButton onAction={createProject} pendingLabel="正在创建" successLabel="已创建" errorLabel="重试创建" resetAfter={1800} className="create-project-button">
            新建项目
          </LoadingButton>
        </div>
      </header>

      <section className="page-heading" aria-labelledby="overview-title">
        <div>
          <p className="eyebrow">项目组合 / 2026 年第三季度</p>
          <h1 id="overview-title">项目总览</h1>
          <p className="subtitle">把注意力留给需要推进的事情。</p>
        </div>
        <p className="updated-at">更新于今天 09:40</p>
      </section>

      <section className="overview-grid" aria-label="项目状态概览">
        <article className="health-card panel-card">
          <div className="section-label"><span>项目健康度</span><span className="live-dot">实时</span></div>
          <div className="health-content">
            <div><strong className="health-score">86</strong><span className="health-unit">/ 100</span></div>
            <div className="health-summary"><span className="health-arrow">↗</span><span>较上周 <strong>+4</strong></span></div>
          </div>
          <div className="health-meter" aria-label="健康度 86 / 100"><span style={{ width: "86%" }} /></div>
          <p className="card-footnote">{healthyCount} 个项目状态健康；建议优先处理 2 项风险。</p>
        </article>

        <article className="metric-card panel-card"><span className="metric-label">活跃项目</span><strong>{projects.length}</strong><span className="metric-detail">本周 +1</span></article>
        <article className="metric-card panel-card"><span className="metric-label">按期里程碑</span><strong>12<span className="metric-total">/ 15</span></strong><span className="metric-detail">80% 达成</span></article>
        <article className="metric-card panel-card"><span className="metric-label">待处理风险</span><strong className="risk-number">2</strong><span className="metric-detail risk-detail">需要关注</span></article>
      </section>

      <section className="dashboard-content">
        <div className="main-column">
          <section className="panel-card projects-panel" aria-labelledby="projects-title">
            <div className="section-heading">
              <div><p className="eyebrow">所有项目</p><h2 id="projects-title">当前工作</h2></div>
              <span className="project-count">{projects.length} 个项目</span>
            </div>
            {createdProject ? <p className="creation-notice" role="status"><span aria-hidden="true">✓</span><strong>{createdProject}</strong> 已创建，并已添加到列表顶部。</p> : null}
            <div className="project-table" role="list" aria-label="项目列表">
              <div className="table-header" aria-hidden="true"><span>项目</span><span>负责人</span><span>进度</span><span>截止时间</span><span>状态</span></div>
              {projects.map((project) => <article className={`project-row ${project.isNew ? "project-row-new" : ""}`} key={project.id} role="listitem">
                <div className="project-name"><span className="project-avatar">{project.name.slice(0, 1)}</span><div><strong>{project.name}</strong>{project.isNew ? <span className="new-project-badge">刚刚创建</span> : <span className="project-id">PRJ-{project.id.slice(0, 5).toUpperCase()}</span>}</div></div>
                <span className="project-owner">{project.owner}</span>
                <div className="progress-cell"><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div><span>{project.progress}%</span></div>
                <time className="project-due">{project.due}</time>
                <span className={`health-badge health-${project.health}`}>{project.health}</span>
              </article>)}
            </div>
          </section>
        </div>

        <aside className="side-column">
          <section className="panel-card risks-panel" aria-labelledby="risks-title">
            <div className="section-heading"><div><p className="eyebrow">需要处理</p><h2 id="risks-title">待处理风险</h2></div><span className="risk-count">2</span></div>
            <div className="risk-list">
              <article className="risk-item"><span className="risk-indicator high" aria-hidden="true" /><div><strong>移动端改版 · 埋点方案</strong><p>确认延后 2 天，影响本周的灰度计划。</p><span>负责人：许宁</span></div></article>
              <article className="risk-item"><span className="risk-indicator medium" aria-hidden="true" /><div><strong>Relay 自动化 · 数据权限</strong><p>仍在等待安全团队完成审批。</p><span>负责人：周雨</span></div></article>
            </div>
          </section>
          <section className="panel-card activity-panel" aria-labelledby="activity-title">
            <div className="section-heading"><div><p className="eyebrow">保持同步</p><h2 id="activity-title">最近活动</h2></div></div>
            <ActivityFeed items={activity} label="最近活动" unreadLabel="未读" unreadStartLabel="未读活动从这里开始" toneLabels={{ success: "已完成", warning: "需关注", error: "错误" }} />
          </section>
        </aside>
      </section>
    </main>
  );
}
