"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type Locale = "zh" | "en";
type Range = "7d" | "30d" | "90d";

export type AnalyticsDashboardBlockProps = {
  locale?: Locale;
  className?: string;
};

const ease = [0.23, 1, 0.32, 1] as const;
const ranges: Range[] = ["7d", "30d", "90d"];

export function AnalyticsDashboardBlock({ locale = "en", className = "" }: AnalyticsDashboardBlockProps) {
  const reduced = useReducedMotion();
  const [range, setRange] = useState<Range>("30d");
  const copy = locale === "zh" ? zh : en;
  const snapshot = copy.snapshots[range];

  return (
    <section className={`min-h-[720px] w-full overflow-hidden rounded-[24px] border border-slate-200 bg-[#eef1f3] text-slate-950 shadow-[0_28px_80px_-48px_rgba(15,23,42,.42)] dark:border-white/10 dark:bg-[#121719] dark:text-slate-50 ${className}`} data-page-block="analytics-dashboard">
      <div className="grid min-h-[720px] md:grid-cols-[196px_minmax(0,1fr)]">
        <aside className="hidden border-r border-slate-900/10 bg-[#e7eaec] p-4 md:flex md:flex-col dark:border-white/10 dark:bg-[#171d20]">
          <a className="flex min-h-11 items-center gap-2.5 rounded-xl px-2 font-semibold tracking-[-0.02em] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" href="#northstar-dashboard">
            <span className="grid size-8 place-items-center rounded-[10px] bg-slate-950 text-white dark:bg-slate-50 dark:text-slate-950" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.7"><path d="M4 17 9 12l4 3 7-8" /><path d="M16 7h4v4" /></svg>
            </span>
            Northstar
          </a>
          <nav className="mt-8 grid gap-1 text-[12px]" aria-label={copy.navigation}>
            {copy.nav.map((item, index) => <a className={`flex min-h-11 items-center gap-2 rounded-xl px-3 ${index === 0 ? "bg-white font-semibold shadow-sm dark:bg-white/8" : "text-slate-500 hover:bg-white/60 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"}`} href={item.href} key={item.label}><i className={`size-1.5 rounded-full ${index === 0 ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`} />{item.label}</a>)}
          </nav>
          <div className="mt-auto rounded-2xl border border-slate-900/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
            <span className="font-mono text-[9px] uppercase tracking-[.12em] text-slate-400">{copy.pipeline}</span>
            <strong className="mt-2 block text-[12px]">{copy.healthy}</strong>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full w-[86%] rounded-full bg-emerald-500" /></div>
          </div>
        </aside>

        <main className="min-w-0" id="northstar-dashboard">
          <header className="flex min-h-16 items-center justify-between gap-4 border-b border-slate-900/10 bg-white/55 px-4 backdrop-blur sm:px-6 dark:border-white/10 dark:bg-white/[.025]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-950 text-[11px] font-bold text-white md:hidden dark:bg-slate-50 dark:text-slate-950">N</span>
              <div className="min-w-0"><strong className="block truncate text-[13px]">{copy.workspace}</strong><span className="text-[10px] text-slate-500 dark:text-slate-400">{copy.updated}</span></div>
            </div>
            <button className="min-h-11 rounded-full border border-slate-900/10 bg-white px-4 text-[12px] font-semibold shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-white/6" type="button">{copy.export}</button>
          </header>

          <div className="p-4 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><span className="font-mono text-[9px] uppercase tracking-[.14em] text-blue-600 dark:text-blue-400">{copy.eyebrow}</span><h1 className="mt-2 text-[clamp(26px,4vw,40px)] font-semibold tracking-[-.045em]">{copy.title}</h1></div>
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-900/5 p-1 dark:bg-white/7" role="tablist" aria-label={copy.rangeLabel}>
                {ranges.map((item) => <button aria-selected={range === item} className={`relative min-h-11 min-w-14 rounded-lg px-3 text-[11px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${range === item ? "text-slate-950 dark:text-white" : "text-slate-500"}`} key={item} onClick={() => setRange(item)} role="tab" type="button">{range === item ? <motion.span className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-white/9" layoutId="analytics-range" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 440, damping: 34 }} /> : null}<span className="relative">{copy.rangeNames[item]}</span></button>)}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={range} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduced ? 0 : -6 }} transition={{ duration: reduced ? 0 : .22, ease }}>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {snapshot.metrics.map((metric) => <article className="rounded-2xl border border-slate-900/10 bg-white p-4 shadow-[0_1px_1px_rgba(15,23,42,.04)] dark:border-white/10 dark:bg-white/5" key={metric.label}><span className="text-[10px] text-slate-500 dark:text-slate-400">{metric.label}</span><div className="mt-3 flex items-end justify-between gap-3"><strong className="text-[clamp(24px,3vw,34px)] tracking-[-.055em] tabular-nums">{metric.value}</strong><span className={`rounded-full px-2 py-1 font-mono text-[9px] ${metric.positive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"}`}>{metric.change}</span></div></article>)}
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(250px,.75fr)]">
                  <article className="min-w-0 rounded-2xl border border-slate-900/10 bg-white p-4 shadow-[0_1px_1px_rgba(15,23,42,.04)] dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-4"><div><span className="text-[10px] text-slate-500 dark:text-slate-400">{copy.traffic}</span><strong className="mt-1 block text-[13px]">{snapshot.trafficLabel}</strong></div><code className="font-mono text-[9px] text-slate-400">{snapshot.axis}</code></div>
                    <div className="relative mt-5 h-48 overflow-hidden rounded-xl bg-slate-50 dark:bg-black/10">
                      <div className="absolute inset-0 grid grid-rows-4">{[0, 1, 2, 3].map((line) => <i className="border-b border-slate-900/[.06] dark:border-white/[.06]" key={line} />)}</div>
                      <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 640 190" preserveAspectRatio="none" role="img" aria-label={copy.traffic}>
                        <defs><linearGradient id={`northstar-fill-${range}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2563eb" stopOpacity=".24" /><stop offset="1" stopColor="#2563eb" stopOpacity="0" /></linearGradient></defs>
                        <motion.path d={`${snapshot.path} L640 190 L0 190 Z`} fill={`url(#northstar-fill-${range})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .35 }} />
                        <motion.path d={snapshot.path} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: reduced ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : .65, ease }} />
                      </svg>
                    </div>
                  </article>

                  <article className="rounded-2xl border border-slate-900/10 bg-slate-950 p-4 text-white shadow-[0_1px_1px_rgba(15,23,42,.04)] dark:border-white/10 dark:bg-slate-50 dark:text-slate-950">
                    <span className="text-[10px] opacity-55">{copy.channels}</span>
                    <div className="mt-5 grid gap-4">
                      {snapshot.channels.map((channel, index) => <div key={channel.label}><div className="flex justify-between gap-3 text-[10px]"><span>{channel.label}</span><strong className="tabular-nums">{channel.value}%</strong></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15 dark:bg-slate-950/10"><motion.div className="h-full rounded-full bg-white dark:bg-slate-950" initial={{ width: 0 }} animate={{ width: `${channel.value}%` }} transition={{ delay: reduced ? 0 : index * .08, duration: reduced ? 0 : .45, ease }} /></div></div>)}
                    </div>
                  </article>
                </div>

                <article className="mt-3 overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-[0_1px_1px_rgba(15,23,42,.04)] dark:border-white/10 dark:bg-white/5">
                  <div className="flex min-h-12 items-center justify-between border-b border-slate-900/10 px-4 dark:border-white/10"><strong className="text-[12px]">{copy.segments}</strong><span className="font-mono text-[9px] text-slate-400">{copy.live}</span></div>
                  <div className="divide-y divide-slate-900/[.07] dark:divide-white/[.07]">
                    {snapshot.segments.map((segment) => <div className="grid min-h-12 grid-cols-[1fr_auto_auto] items-center gap-4 px-4 text-[10px]" key={segment.name}><strong className="truncate text-[11px]">{segment.name}</strong><span className="text-slate-500 dark:text-slate-400">{segment.users}</span><span className="min-w-12 text-right font-mono text-emerald-600 dark:text-emerald-400">{segment.rate}</span></div>)}
                  </div>
                </article>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </section>
  );
}

type Snapshot = {
  metrics: Array<{ label: string; value: string; change: string; positive: boolean }>;
  trafficLabel: string; axis: string; path: string;
  channels: Array<{ label: string; value: number }>;
  segments: Array<{ name: string; users: string; rate: string }>;
};

const baseSnapshots: Record<Range, Omit<Snapshot, "metrics" | "trafficLabel"> & { values: string[]; changes: string[]; traffic: string }> = {
  "7d": { values: ["18.4k", "4.8%", "$42.6k", "3m 18s"], changes: ["+8.2%", "+0.6%", "+5.1%", "-4.0%"], traffic: "Daily traffic", axis: "AUG 06 — AUG 12", path: "M0 150 C70 140 84 94 150 110 C222 128 244 56 312 72 C380 89 414 44 474 58 C535 72 570 28 640 34", channels: [{ label: "Organic", value: 46 }, { label: "Direct", value: 31 }, { label: "Partner", value: 15 }, { label: "Paid", value: 8 }], segments: [{ name: "Product teams", users: "8,420 users", rate: "+12.4%" }, { name: "Independent makers", users: "5,118 users", rate: "+7.8%" }, { name: "Agencies", users: "2,906 users", rate: "+4.1%" }] },
  "30d": { values: ["72.8k", "5.2%", "$168k", "3m 42s"], changes: ["+14.6%", "+0.9%", "+11.2%", "+6.3%"], traffic: "Monthly traffic", axis: "JUL 14 — AUG 12", path: "M0 158 C58 148 86 112 142 120 C212 132 240 70 304 84 C370 98 394 52 458 64 C524 77 566 34 640 42", channels: [{ label: "Organic", value: 52 }, { label: "Direct", value: 27 }, { label: "Partner", value: 13 }, { label: "Paid", value: 8 }], segments: [{ name: "Product teams", users: "31,840 users", rate: "+18.2%" }, { name: "Independent makers", users: "20,216 users", rate: "+12.5%" }, { name: "Agencies", users: "11,608 users", rate: "+8.4%" }] },
  "90d": { values: ["208k", "4.9%", "$486k", "3m 31s"], changes: ["+32.1%", "+1.4%", "+28.5%", "+9.8%"], traffic: "Quarterly traffic", axis: "MAY 15 — AUG 12", path: "M0 165 C54 152 104 136 152 142 C218 150 250 92 316 101 C376 109 410 66 474 76 C536 85 574 46 640 50", channels: [{ label: "Organic", value: 55 }, { label: "Direct", value: 24 }, { label: "Partner", value: 14 }, { label: "Paid", value: 7 }], segments: [{ name: "Product teams", users: "91,204 users", rate: "+38.7%" }, { name: "Independent makers", users: "58,466 users", rate: "+27.9%" }, { name: "Agencies", users: "34,882 users", rate: "+19.6%" }] },
};

function makeSnapshots(labels: string[], trafficLabels: Record<Range, string>): Record<Range, Snapshot> {
  return Object.fromEntries(ranges.map((range) => {
    const item = baseSnapshots[range];
    return [range, { metrics: item.values.map((value, index) => ({ label: labels[index], value, change: item.changes[index], positive: !item.changes[index].startsWith("-") })), trafficLabel: trafficLabels[range], axis: item.axis, path: item.path, channels: item.channels, segments: item.segments }];
  })) as Record<Range, Snapshot>;
}

const en = {
  navigation: "Analytics navigation", nav: [{ label: "Overview", href: "#northstar-dashboard" }, { label: "Funnels", href: "#northstar-dashboard" }, { label: "Retention", href: "#northstar-dashboard" }, { label: "Reports", href: "#northstar-dashboard" }],
  pipeline: "Data pipeline", healthy: "All sources healthy", workspace: "Atlas analytics", updated: "Updated 2 minutes ago", export: "Export report", eyebrow: "Workspace health", title: "Growth overview", rangeLabel: "Date range", rangeNames: { "7d": "7 days", "30d": "30 days", "90d": "90 days" }, traffic: "Traffic trend", channels: "Acquisition channels", segments: "Top segments", live: "LIVE DATA",
  snapshots: makeSnapshots(["Unique visitors", "Activation", "Revenue", "Session time"], { "7d": "Daily traffic", "30d": "Monthly traffic", "90d": "Quarterly traffic" }),
};

const zh = {
  navigation: "数据分析导航", nav: [{ label: "总览", href: "#northstar-dashboard" }, { label: "漏斗", href: "#northstar-dashboard" }, { label: "留存", href: "#northstar-dashboard" }, { label: "报告", href: "#northstar-dashboard" }],
  pipeline: "数据管道", healthy: "全部数据源正常", workspace: "Atlas 数据分析", updated: "2 分钟前更新", export: "导出报告", eyebrow: "工作区健康度", title: "增长总览", rangeLabel: "日期范围", rangeNames: { "7d": "7 天", "30d": "30 天", "90d": "90 天" }, traffic: "访问趋势", channels: "获客渠道", segments: "核心用户群", live: "实时数据",
  snapshots: makeSnapshots(["独立访客", "激活率", "收入", "会话时长"], { "7d": "每日访问趋势", "30d": "月度访问趋势", "90d": "季度访问趋势" }),
};
