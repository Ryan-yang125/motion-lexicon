"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

type Locale = "zh" | "en";

export type ProjectDashboardBlockProps = {
  locale?: Locale;
  className?: string;
};

const ease = [0.23, 1, 0.32, 1] as const;

export function ProjectDashboardBlock({ locale = "en", className = "" }: ProjectDashboardBlockProps) {
  const reduced = useReducedMotion();
  const copy = locale === "zh" ? zh : en;
  const [completed, setCompleted] = useState<string[]>([copy.tasks[0].id]);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const visibleTasks = useMemo(() => copy.tasks.filter((task) => filter === "all" || task.owner === copy.me), [copy, filter]);
  const progress = Math.round((completed.length / copy.tasks.length) * 100);
  const nextTask = copy.tasks.find((task) => !completed.includes(task.id));

  function completeNext() {
    if (!nextTask) {
      setCompleted([copy.tasks[0].id]);
      return;
    }
    setCompleted((current) => [...current, nextTask.id]);
  }

  return (
    <section className={`min-h-[720px] w-full overflow-hidden rounded-[24px] border border-zinc-200 bg-[#f0efec] text-zinc-950 shadow-[0_28px_80px_-48px_rgba(24,24,27,.45)] dark:border-white/10 dark:bg-[#151514] dark:text-zinc-50 ${className}`} data-page-block="project-dashboard">
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-zinc-900/10 bg-white/55 px-4 backdrop-blur sm:px-6 dark:border-white/10 dark:bg-white/[.025]">
        <a className="flex min-h-11 items-center gap-2.5 rounded-xl font-semibold tracking-[-.02em] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" href="#arc-project">
          <span className="grid size-8 place-items-center rounded-[10px] bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950" aria-hidden="true"><svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.8"><path d="M5 18V9l7-4 7 4v9l-7 3-7-3Z" /><path d="m5 9 7 4 7-4M12 13v8" /></svg></span>
          Arc
        </a>
        <div className="hidden min-w-0 flex-1 justify-center md:flex"><button className="flex min-h-11 w-full max-w-sm items-center gap-2 rounded-xl border border-zinc-900/10 bg-white px-3 text-left text-[11px] text-zinc-400 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-white/5" type="button"><span aria-hidden="true">⌕</span><span className="truncate">{copy.search}</span><kbd className="ml-auto font-mono text-[9px]">⌘ K</kbd></button></div>
        <button className="min-h-11 rounded-full bg-zinc-950 px-4 text-[12px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950" type="button" onClick={completeNext}>{nextTask ? copy.complete : copy.restart}</button>
      </header>

      <main className="grid min-h-[655px] gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.5fr)_300px]" id="arc-project">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><span className="font-mono text-[9px] uppercase tracking-[.14em] text-blue-600 dark:text-blue-400">{copy.eyebrow}</span><h1 className="mt-2 text-[clamp(28px,4vw,42px)] font-semibold tracking-[-.05em]">{copy.title}</h1></div>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-900/5 p-1 dark:bg-white/7" role="tablist" aria-label={copy.filterLabel}>
              {(["all", "mine"] as const).map((item) => <button aria-selected={filter === item} className={`relative min-h-11 min-w-20 rounded-lg px-3 text-[11px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${filter === item ? "text-zinc-950 dark:text-white" : "text-zinc-500"}`} key={item} onClick={() => setFilter(item)} role="tab" type="button">{filter === item ? <motion.span className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-white/9" layoutId="project-filter" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 440, damping: 34 }} /> : null}<span className="relative">{copy.filters[item]}</span></button>)}
            </div>
          </div>

          <article className="mt-5 overflow-hidden rounded-[20px] border border-zinc-900/10 bg-white shadow-[0_1px_1px_rgba(24,24,27,.04)] dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-5 border-b border-zinc-900/10 p-5 sm:grid-cols-[1fr_auto] sm:items-center dark:border-white/10">
              <div><span className="text-[10px] text-zinc-500 dark:text-zinc-400">{copy.milestone}</span><strong className="mt-2 block text-[18px] tracking-[-.03em]">{copy.milestoneName}</strong></div>
              <div className="min-w-48"><div className="flex justify-between text-[10px] text-zinc-500"><span>{copy.progress}</span><strong className="text-zinc-950 tabular-nums dark:text-white">{progress}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"><motion.div className="h-full rounded-full bg-blue-600" animate={{ width: `${progress}%` }} transition={reduced ? { duration: 0 } : { duration: .48, ease }} /></div></div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-3">
              {copy.columns.map((column) => {
                const tasks = visibleTasks.filter((task) => task.column === column.id);
                return <section className="min-w-0 rounded-2xl bg-zinc-50 p-3 dark:bg-black/10" aria-labelledby={`project-column-${column.id}`} key={column.id}>
                  <header className="flex min-h-9 items-center justify-between gap-2"><h2 className="text-[11px] font-semibold" id={`project-column-${column.id}`}>{column.label}</h2><span className="font-mono text-[9px] text-zinc-400">{tasks.length}</span></header>
                  <div className="mt-2 grid gap-2">
                    <AnimatePresence initial={false} mode="popLayout">
                      {tasks.map((task) => {
                        const done = completed.includes(task.id);
                        return <motion.article animate={{ opacity: 1, y: 0 }} className={`min-h-[104px] rounded-xl border p-3 shadow-[0_1px_0_rgba(24,24,27,.05)] ${done ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-400/8" : "border-zinc-900/10 bg-white dark:border-white/10 dark:bg-white/6"}`} initial={{ opacity: 0, y: reduced ? 0 : 8 }} key={task.id} layout transition={reduced ? { duration: 0 } : { duration: .22, ease }}>
                          <div className="flex items-start justify-between gap-2"><span className="rounded-md bg-zinc-100 px-1.5 py-1 font-mono text-[8px] text-zinc-500 dark:bg-white/8 dark:text-zinc-300">{task.code}</span>{done ? <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-[9px] text-white" aria-label={copy.done}>✓</span> : null}</div>
                          <strong className={`mt-3 block text-[11px] leading-4 ${done ? "text-emerald-900 dark:text-emerald-200" : ""}`}>{task.title}</strong>
                          <div className="mt-3 flex items-center justify-between gap-2 text-[9px] text-zinc-400"><span>{task.owner}</span><span>{task.date}</span></div>
                        </motion.article>;
                      })}
                    </AnimatePresence>
                    {tasks.length === 0 ? <div className="grid min-h-[104px] place-items-center rounded-xl border border-dashed border-zinc-900/10 text-[10px] text-zinc-400 dark:border-white/10">{copy.empty}</div> : null}
                  </div>
                </section>;
              })}
            </div>
          </article>
        </div>

        <aside className="grid content-start gap-3">
          <article className="rounded-[20px] border border-zinc-900/10 bg-zinc-950 p-5 text-white shadow-[0_1px_1px_rgba(24,24,27,.04)] dark:border-white/10 dark:bg-zinc-50 dark:text-zinc-950">
            <span className="font-mono text-[9px] uppercase tracking-[.13em] opacity-55">{copy.next}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={nextTask?.id ?? "complete"} initial={{ opacity: 0, x: reduced ? 0 : 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -8 }} transition={{ duration: reduced ? 0 : .22, ease }}>
                <strong className="mt-5 block text-[22px] leading-7 tracking-[-.04em]">{nextTask?.title ?? copy.allDone}</strong>
                <p className="mt-3 text-[11px] leading-5 opacity-65">{nextTask?.detail ?? copy.doneDetail}</p>
                <button className="mt-6 min-h-11 w-full rounded-full bg-white px-4 text-[11px] font-semibold text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:bg-zinc-950 dark:text-white" type="button" onClick={completeNext}>{nextTask ? copy.complete : copy.restart}</button>
              </motion.div>
            </AnimatePresence>
          </article>

          <article className="rounded-[20px] border border-zinc-900/10 bg-white p-4 shadow-[0_1px_1px_rgba(24,24,27,.04)] dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-3"><strong className="text-[12px]">{copy.activity}</strong><span className="size-2 rounded-full bg-emerald-500" /></div>
            <div className="mt-4 grid gap-4">
              {copy.activities.map((activity, index) => <div className="grid grid-cols-[28px_1fr] gap-3" key={activity.text}><span className={`grid size-7 place-items-center rounded-full text-[9px] font-bold ${activity.tone}`}>{activity.initial}</span><div className="min-w-0"><p className="m-0 text-[10px] leading-4 text-zinc-600 dark:text-zinc-300">{activity.text}</p><span className="mt-1 block font-mono text-[8px] text-zinc-400">{activity.time}</span></div>{index < copy.activities.length - 1 ? <i className="col-start-1 mx-auto h-2 w-px bg-zinc-200 dark:bg-white/10" /> : null}</div>)}
            </div>
          </article>
        </aside>
      </main>
    </section>
  );
}

const en = {
  search: "Search projects, tasks, and people", eyebrow: "Active project", title: "Northstar launch", complete: "Complete next task", restart: "Restart milestone", filterLabel: "Task filter", filters: { all: "All tasks", mine: "My tasks" },
  milestone: "Current milestone", milestoneName: "Public beta readiness", progress: "Milestone progress", done: "Complete", empty: "No tasks", me: "You",
  columns: [{ id: "todo", label: "Up next" }, { id: "active", label: "In progress" }, { id: "review", label: "Review" }],
  tasks: [
    { id: "task-1", code: "ARC-124", title: "Confirm onboarding entry points", owner: "Mina", date: "Aug 10", column: "review", detail: "Review the two onboarding paths and approve the public beta default." },
    { id: "task-2", code: "ARC-128", title: "Connect activation events", owner: "You", date: "Aug 12", column: "active", detail: "Map workspace creation and first invite to the activation model." },
    { id: "task-3", code: "ARC-131", title: "Publish beta release notes", owner: "You", date: "Aug 13", column: "todo", detail: "Turn the approved change list into the public beta release note." },
    { id: "task-4", code: "ARC-136", title: "Schedule customer briefing", owner: "Noah", date: "Aug 14", column: "todo", detail: "Prepare the customer briefing and invite the pilot cohort." },
    { id: "task-5", code: "ARC-140", title: "Run accessibility pass", owner: "Mina", date: "Aug 15", column: "review", detail: "Complete keyboard, focus, contrast, and reduced-motion acceptance." },
  ],
  next: "Next decision", allDone: "Milestone complete", doneDetail: "Every task in this milestone has an owner and a completed outcome.", activity: "Team activity",
  activities: [{ initial: "M", tone: "bg-[#d9b38c] text-[#5a321c]", text: "Mina moved onboarding into review", time: "8 MIN AGO" }, { initial: "N", tone: "bg-[#a9bfd3] text-[#24405a]", text: "Noah attached the customer brief", time: "22 MIN AGO" }, { initial: "Y", tone: "bg-[#b7caaa] text-[#304b27]", text: "You updated activation events", time: "41 MIN AGO" }],
};

const zh = {
  search: "搜索项目、任务和成员", eyebrow: "进行中的项目", title: "Northstar 发布", complete: "完成下一项任务", restart: "重新开始里程碑", filterLabel: "任务筛选", filters: { all: "全部任务", mine: "我的任务" },
  milestone: "当前里程碑", milestoneName: "公开测试准备", progress: "里程碑进度", done: "已完成", empty: "暂无任务", me: "我",
  columns: [{ id: "todo", label: "下一步" }, { id: "active", label: "进行中" }, { id: "review", label: "审阅" }],
  tasks: [
    { id: "task-1", code: "ARC-124", title: "确认新手引导入口", owner: "Mina", date: "8 月 10 日", column: "review", detail: "审阅两条新手引导路径，并确认公开测试默认方案。" },
    { id: "task-2", code: "ARC-128", title: "连接激活事件", owner: "我", date: "8 月 12 日", column: "active", detail: "把工作区创建与首次邀请连接到激活模型。" },
    { id: "task-3", code: "ARC-131", title: "发布测试版更新说明", owner: "我", date: "8 月 13 日", column: "todo", detail: "把已批准的变更清单整理成公开测试版更新说明。" },
    { id: "task-4", code: "ARC-136", title: "安排客户说明会", owner: "Noah", date: "8 月 14 日", column: "todo", detail: "准备客户说明会并邀请首批试用团队。" },
    { id: "task-5", code: "ARC-140", title: "完成无障碍验收", owner: "Mina", date: "8 月 15 日", column: "review", detail: "完成键盘、焦点、对比度和减弱动效验收。" },
  ],
  next: "下一项决策", allDone: "里程碑已完成", doneDetail: "这个里程碑中的每项任务都有负责人和明确结果。", activity: "团队动态",
  activities: [{ initial: "M", tone: "bg-[#d9b38c] text-[#5a321c]", text: "Mina 将新手引导移入审阅", time: "8 分钟前" }, { initial: "N", tone: "bg-[#a9bfd3] text-[#24405a]", text: "Noah 添加了客户简报", time: "22 分钟前" }, { initial: "我", tone: "bg-[#b7caaa] text-[#304b27]", text: "我更新了激活事件", time: "41 分钟前" }],
};
