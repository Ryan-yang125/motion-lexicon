"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type Locale = "zh" | "en";
type Phase = "plan" | "review" | "ship";

export type ProductLandingBlockProps = {
  locale?: Locale;
  className?: string;
};

const ease = [0.23, 1, 0.32, 1] as const;

const phaseOrder: Phase[] = ["plan", "review", "ship"];

export function ProductLandingBlock({ locale = "en", className = "" }: ProductLandingBlockProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("plan");
  const [started, setStarted] = useState(false);
  const copy = locale === "zh" ? zh : en;
  const active = copy.phases[phase];
  const activeIndex = phaseOrder.indexOf(phase);

  return (
    <section
      className={`min-h-[720px] w-full overflow-hidden rounded-[10px] border border-neutral-200 bg-[#f5f5f5] text-neutral-950 dark:border-white/10 dark:bg-[#151515] dark:text-neutral-50 ${className}`}
      data-page-block="product-landing"
    >
      <header className="flex min-h-16 items-center justify-between gap-5 border-b border-neutral-900/10 px-5 sm:px-8 dark:border-white/10">
        <a className="flex min-h-11 items-center gap-2.5 rounded-lg font-semibold tracking-[-0.02em] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" href="#caldera-home">
          <span className="grid size-8 place-items-center rounded-[10px] bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.8"><path d="M5 17.5 12 5l7 12.5-7-3.2-7 3.2Z" /><path d="m8.8 15.8 3.2-5.5 3.2 5.5" /></svg>
          </span>
          Caldera
        </a>
        <nav className="hidden items-center gap-1 text-[13px] text-neutral-600 md:flex dark:text-neutral-300" aria-label={copy.navigation}>
          {copy.nav.map((item) => <a className="flex min-h-11 items-center rounded-lg px-3 hover:bg-white/70 hover:text-neutral-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-white/8 dark:hover:text-white" href={item.href} key={item.label}>{item.label}</a>)}
        </nav>
        <button className="min-h-11 rounded-lg bg-neutral-950 px-4 text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-neutral-50 dark:text-neutral-950" type="button" onClick={() => setStarted(true)}>
          {started ? copy.opened : copy.open}
        </button>
      </header>

      <div className="grid min-h-[655px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(280px,.82fr)_minmax(500px,1.18fr)] lg:px-12 lg:py-14">
        <div className="max-w-xl">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
            {copy.kicker}
          </span>
          <h1 className="mt-5 max-w-[10ch] text-[clamp(42px,6vw,64px)] font-semibold leading-[.98] tracking-[-0.035em]">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-neutral-600 dark:text-neutral-300">{copy.body}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <button className="min-h-12 rounded-lg bg-neutral-950 px-5 text-[13px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-neutral-50 dark:text-neutral-950" type="button" onClick={() => setStarted(true)}>
              {started ? copy.ready : copy.primary}
            </button>
            <a className="flex min-h-12 items-center rounded-lg border border-neutral-300 bg-white px-5 text-[13px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-white/15 dark:bg-transparent" href="#release-workspace">
              {copy.secondary}
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="flex -space-x-2" aria-hidden="true">
              {["bg-neutral-950", "bg-neutral-700", "bg-neutral-500"].map((tone, index) => <i className={`size-7 rounded-full border-2 border-[#f5f5f5] ${tone} dark:border-[#151515]`} key={index} />)}
            </span>
            {copy.proof}
          </div>
        </div>

        <div className="min-w-0" id="release-workspace">
          <div className="overflow-hidden rounded-[10px] border border-neutral-900/10 bg-white dark:border-white/10 dark:bg-[#202020]">
            <div className="flex min-h-12 items-center justify-between gap-4 border-b border-neutral-900/10 px-4 dark:border-white/10">
              <div className="flex items-center gap-2" aria-hidden="true"><i className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" /><i className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" /><i className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" /></div>
              <span className="text-[11px] font-semibold">{copy.workspace}</span>
              <code className="font-mono text-[9px] text-neutral-400">{active.release}</code>
            </div>

            <div className="grid grid-cols-3 gap-1 border-b border-neutral-900/10 bg-neutral-50 p-1.5 dark:border-white/10 dark:bg-black/10" role="tablist" aria-label={copy.phaseLabel}>
              {phaseOrder.map((item, index) => (
                <button
                  aria-selected={phase === item}
                  className={`relative min-h-11 overflow-hidden rounded-lg px-2 text-[11px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${phase === item ? "text-neutral-950 dark:text-white" : "text-neutral-400"}`}
                  key={item}
                  onClick={() => setPhase(item)}
                  role="tab"
                  type="button"
                >
                  {phase === item ? <motion.span className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-white/8" layoutId="product-landing-phase" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }} /> : null}
                  <span className="relative flex items-center justify-center gap-2"><i className={`size-1.5 rounded-full ${index <= activeIndex ? "bg-neutral-950 dark:bg-neutral-50" : "bg-neutral-300 dark:bg-neutral-600"}`} />{copy.phaseNames[item]}</span>
                </button>
              ))}
            </div>

            <div className="min-h-[430px] p-5 sm:p-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="grid gap-5"
                  exit={{ opacity: 0, x: reduced ? 0 : -12 }}
                  initial={{ opacity: 0, x: reduced ? 0 : 12 }}
                  key={phase}
                  transition={{ duration: reduced ? 0 : 0.24, ease }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{active.eyebrow}</span>
                      <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em]">{active.title}</h2>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-3 py-1.5 font-mono text-[9px] text-neutral-500 dark:bg-white/7 dark:text-neutral-300">{active.status}</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1.25fr_.75fr]">
                    <div className="rounded-[10px] border border-neutral-900/10 bg-neutral-50 p-4 dark:border-white/10 dark:bg-black/10">
                      <div className="flex items-center justify-between text-[10px] text-neutral-500"><span>{active.board}</span><span>{active.progress}%</span></div>
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10"><motion.div className="h-full rounded-full bg-neutral-950 dark:bg-neutral-50" animate={{ width: `${active.progress}%` }} transition={reduced ? { duration: 0 } : { duration: 0.45, ease }} /></div>
                      <div className="mt-5 grid gap-2">
                        {active.items.map((item, index) => (
                          <motion.div className="flex min-h-12 items-center justify-between gap-3 border-b border-neutral-200 px-1 last:border-b-0 dark:border-white/10" initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : index * 0.05 }} key={item.label}>
                            <span className="flex min-w-0 items-center gap-2 text-[11px] font-medium"><i className={`size-2 shrink-0 rounded-full ${item.done ? "bg-emerald-500" : "border border-neutral-300 dark:border-neutral-500"}`} /><span className="truncate">{item.label}</span></span>
                            <code className="font-mono text-[9px] text-neutral-400">{item.owner}</code>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="grid content-between gap-4 rounded-[10px] bg-neutral-950 p-4 text-white dark:bg-neutral-50 dark:text-neutral-950">
                      <div>
                        <span className="font-mono text-[9px] opacity-55">{active.signalLabel}</span>
                        <strong className="mt-3 block text-3xl tracking-[-0.05em]">{active.signal}</strong>
                      </div>
                      <div className="flex items-end gap-1" aria-label={active.signalLabel}>
                        {active.bars.map((height, index) => <motion.i className="w-full rounded-sm bg-white/25 dark:bg-neutral-950/20" animate={{ height }} transition={{ delay: reduced ? 0 : index * 0.035 }} key={`${phase}-${index}`} />)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const en = {
  navigation: "Product navigation",
  nav: [{ label: "Workflow", href: "#release-workspace" }, { label: "Customers", href: "#release-workspace" }, { label: "Changelog", href: "#release-workspace" }],
  open: "Open app", opened: "Workspace open", kicker: "Release operations · Spring 2026", title: "Bring every release into focus.",
  body: "Caldera gives product teams one calm place to shape the story, collect decisions, and carry a release across the line.",
  primary: "Plan a release", ready: "Release workspace ready", secondary: "See the workflow", proof: "Trusted by 64 focused product teams",
  workspace: "Atlas release", phaseLabel: "Release phase", phaseNames: { plan: "Plan", review: "Review", ship: "Ship" },
  phases: {
    plan: { release: "R-024", eyebrow: "01 · Direction", title: "Make the promise precise", status: "Planning", board: "Release brief", progress: 34, items: [{ label: "Position the release", owner: "AM", done: true }, { label: "Define launch moments", owner: "RK", done: true }, { label: "Confirm success signal", owner: "JL", done: false }], signalLabel: "Signal confidence", signal: "8.4", bars: [24, 34, 28, 48, 40, 58, 72, 64] },
    review: { release: "R-024", eyebrow: "02 · Review", title: "Resolve every decision", status: "3 open", board: "Review queue", progress: 68, items: [{ label: "Approve launch narrative", owner: "JL", done: true }, { label: "Review onboarding path", owner: "RK", done: true }, { label: "Close pricing question", owner: "AM", done: false }], signalLabel: "Review velocity", signal: "14h", bars: [32, 42, 54, 46, 68, 61, 78, 70] },
    ship: { release: "R-024", eyebrow: "03 · Launch", title: "Ship with a shared pulse", status: "Ready", board: "Launch sequence", progress: 92, items: [{ label: "Production checklist", owner: "RK", done: true }, { label: "Customer announcement", owner: "AM", done: true }, { label: "Open the release window", owner: "JL", done: false }], signalLabel: "Launch readiness", signal: "92%", bars: [38, 44, 50, 58, 64, 74, 82, 88] },
  } as Record<Phase, { release: string; eyebrow: string; title: string; status: string; board: string; progress: number; items: Array<{ label: string; owner: string; done: boolean }>; signalLabel: string; signal: string; bars: number[] }>,
};

const zh = {
  navigation: "产品导航",
  nav: [{ label: "工作流", href: "#release-workspace" }, { label: "客户", href: "#release-workspace" }, { label: "更新记录", href: "#release-workspace" }],
  open: "打开应用", opened: "工作区已打开", kicker: "发布运营 · 2026 春季", title: "让每次发布都清晰聚焦。",
  body: "Caldera 为产品团队提供一个安静的工作区，用来明确产品叙事、收拢决策并推动版本上线。",
  primary: "规划新版本", ready: "发布工作区已就绪", secondary: "查看工作流", proof: "64 个专注的产品团队正在使用",
  workspace: "Atlas 发布", phaseLabel: "发布阶段", phaseNames: { plan: "规划", review: "审阅", ship: "上线" },
  phases: {
    plan: { release: "R-024", eyebrow: "01 · 定位", title: "把产品承诺说清楚", status: "规划中", board: "发布简报", progress: 34, items: [{ label: "确定版本定位", owner: "安", done: true }, { label: "定义发布节点", owner: "任", done: true }, { label: "确认成功指标", owner: "林", done: false }], signalLabel: "方向信心", signal: "8.4", bars: [24, 34, 28, 48, 40, 58, 72, 64] },
    review: { release: "R-024", eyebrow: "02 · 审阅", title: "收敛每一个关键决策", status: "3 项待定", board: "审阅队列", progress: 68, items: [{ label: "批准发布叙事", owner: "林", done: true }, { label: "审阅引导路径", owner: "任", done: true }, { label: "确认定价问题", owner: "安", done: false }], signalLabel: "审阅速度", signal: "14h", bars: [32, 42, 54, 46, 68, 61, 78, 70] },
    ship: { release: "R-024", eyebrow: "03 · 上线", title: "让团队共享上线节奏", status: "已就绪", board: "上线流程", progress: 92, items: [{ label: "生产检查清单", owner: "任", done: true }, { label: "客户发布通知", owner: "安", done: true }, { label: "开启发布窗口", owner: "林", done: false }], signalLabel: "上线准备度", signal: "92%", bars: [38, 44, 50, 58, 64, 74, 82, 88] },
  } as typeof en.phases,
};
