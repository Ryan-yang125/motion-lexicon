"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Locale = "zh" | "en";
type RunState = "ready" | "thinking" | "working" | "approval" | "complete";
export type AgentWorkspaceBlockProps = { locale?: Locale; className?: string };

const ease = [0.23, 1, 0.32, 1] as const;

export function AgentWorkspaceBlock({
  locale = "en",
  className = "",
}: AgentWorkspaceBlockProps) {
  const reduced = useReducedMotion();
  const copy = locale === "zh" ? zh : en;
  const [mission, setMission] = useState(0);
  const [state, setState] = useState<RunState>("ready");
  const [prompt, setPrompt] = useState("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  const run = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    setPrompt("");
    setState("thinking");
    const stages: Array<[RunState, number]> = [
      ["working", reduced ? 0 : 850],
      ["approval", reduced ? 0 : 2100],
    ];
    let elapsed = 0;
    stages.forEach(([next, wait]) => {
      elapsed += wait;
      timers.current.push(window.setTimeout(() => setState(next), elapsed));
    });
  };
  const active = copy.missions[mission];

  return (
    <section
      className={`min-h-[720px] w-full overflow-hidden rounded-[24px] border border-zinc-200 bg-[#f3f5f7] text-zinc-950 shadow-[0_30px_90px_-50px_rgba(24,24,27,.55)] dark:border-white/10 dark:bg-[#101216] dark:text-zinc-50 ${className}`}
      data-page-block="agent-workspace"
    >
      <header className="flex min-h-16 items-center gap-4 border-b border-zinc-900/10 bg-white/70 px-4 backdrop-blur sm:px-6 dark:border-white/10 dark:bg-white/[.035]">
        <a
          href="#relay-workspace"
          className="flex min-h-11 items-center gap-2.5 rounded-xl font-semibold tracking-[-.025em] outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff]"
        >
          <span className="grid size-8 place-items-center rounded-[11px] bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950">
            <svg
              viewBox="0 0 24 24"
              className="size-4 fill-none stroke-current"
              strokeWidth="1.7"
            >
              <path d="M5 17V7l7 4 7-4v10l-7 4-7-4Z" />
              <path d="m5 7 7-4 7 4M12 11v10" />
            </svg>
          </span>
          Relay
        </a>
        <span className="hidden h-5 w-px bg-zinc-200 sm:block dark:bg-white/10" />
        <span className="hidden text-[11px] text-zinc-500 sm:block dark:text-zinc-400">
          {copy.workspace}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${state === "complete" ? "bg-emerald-500" : state === "approval" ? "bg-amber-500" : "bg-[#4568ff]"}`}
          />
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {copy.state[state]}
          </span>
        </div>
      </header>
      <div
        className="grid min-h-[655px] lg:grid-cols-[180px_minmax(0,1fr)_238px]"
        id="relay-workspace"
      >
        <aside className="hidden border-r border-zinc-900/10 p-3 lg:flex lg:flex-col dark:border-white/10">
          <span className="px-3 py-3 font-mono text-[9px] uppercase tracking-[.14em] text-zinc-400">
            {copy.missionsLabel}
          </span>
          <nav className="grid gap-1">
            {copy.missions.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  setMission(index);
                  setState("ready");
                }}
                className={`min-h-11 rounded-xl px-3 text-left text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] ${mission === index ? "bg-white font-semibold shadow-sm dark:bg-white/8" : "text-zinc-500 hover:bg-white/55 dark:text-zinc-400 dark:hover:bg-white/5"}`}
              >
                <span
                  className={`mr-2 inline-block size-1.5 rounded-full ${mission === index ? "bg-[#4568ff]" : "bg-zinc-300 dark:bg-white/15"}`}
                />
                {item.short}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-zinc-900/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[.035]">
            <div className="flex -space-x-1.5">
              {["R", "D", "Q"].map((agent, index) => (
                <span
                  key={agent}
                  className={`grid size-7 place-items-center rounded-full border-2 border-white text-[8px] font-semibold text-white dark:border-[#15171b] ${["bg-[#4568ff]", "bg-amber-500", "bg-emerald-500"][index]}`}
                >
                  {agent}
                </span>
              ))}
            </div>
            <strong className="mt-3 block text-[10px]">{copy.team}</strong>
            <span className="text-[9px] text-zinc-400">{copy.teamMeta}</span>
          </div>
        </aside>
        <main className="min-w-0 p-4 sm:p-6">
          <div className="mx-auto flex max-w-[700px] flex-col gap-4">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#4568ff]">
                {active.kicker}
              </span>
              <h1 className="mt-2 text-[clamp(24px,4vw,38px)] font-semibold leading-none tracking-[-.045em]">
                {active.title}
              </h1>
              <p className="mt-3 max-w-xl text-[12px] leading-6 text-zinc-500 dark:text-zinc-400">
                {active.description}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_18px_50px_-38px_rgba(24,24,27,.5)] dark:border-white/10 dark:bg-[#17191d]">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-xl bg-zinc-950 text-[10px] font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
                  YR
                </span>
                <p className="text-[12px]">{active.request}</p>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mission}-${state}`}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0 : 0.3, ease }}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_18px_50px_-38px_rgba(24,24,27,.5)] dark:border-white/10 dark:bg-[#17191d]"
              >
                {state === "ready" ? (
                  <div className="grid min-h-[200px] place-items-center text-center">
                    <div>
                      <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-blue-50 text-[#4568ff] dark:bg-[#4568ff]/10">
                        ↗
                      </span>
                      <strong className="mt-4 block text-[13px]">
                        {copy.readyTitle}
                      </strong>
                      <p className="mt-1 text-[10px] text-zinc-400">
                        {copy.readyBody}
                      </p>
                      <button
                        type="button"
                        onClick={run}
                        className="mt-4 min-h-11 rounded-full bg-zinc-950 px-5 text-[10px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#4568ff] dark:bg-zinc-50 dark:text-zinc-950"
                      >
                        {copy.start}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="relative grid size-8 place-items-center rounded-xl bg-zinc-950 dark:bg-zinc-50">
                        <span className="size-1.5 rounded-full bg-[#4568ff]" />
                        {state !== "complete" ? (
                          <motion.i
                            className="absolute inset-0 rounded-xl border border-[#4568ff]/50"
                            animate={
                              reduced
                                ? undefined
                                : { scale: [1, 1.3], opacity: [0.5, 0] }
                            }
                            transition={{ duration: 1.4, repeat: Infinity }}
                          />
                        ) : null}
                      </span>
                      <div>
                        <strong className="block text-[12px]">
                          {copy.runTitle[state]}
                        </strong>
                        <span className="text-[9px] text-zinc-400">
                          {copy.runMeta[state]}
                        </span>
                      </div>
                    </div>
                    <ol className="mt-5 grid gap-3">
                      {active.steps.map((step, index) => {
                        const visible =
                          state === "complete" ||
                          (state === "approval" && index < 3) ||
                          (state === "working" && index < 2) ||
                          (state === "thinking" && index < 1);
                        const current =
                          (state === "thinking" && index === 0) ||
                          (state === "working" && index === 1) ||
                          (state === "approval" && index === 2);
                        return (
                          <li
                            key={step}
                            className="grid grid-cols-[20px_1fr] gap-3"
                          >
                            <span
                              className={`mt-0.5 grid size-5 place-items-center rounded-full border text-[8px] ${visible && !current ? "border-emerald-500 bg-emerald-500 text-white" : current ? "border-[#4568ff] text-[#4568ff]" : "border-zinc-200 text-zinc-300 dark:border-white/10"}`}
                            >
                              {visible && !current ? "✓" : index + 1}
                            </span>
                            <span
                              className={`text-[11px] ${visible ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-300 dark:text-zinc-600"}`}
                            >
                              {step}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                    {state === "approval" ? (
                      <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/5">
                        <span className="text-amber-600">!</span>
                        <span className="text-[10px] text-amber-800 dark:text-amber-200">
                          {copy.approval}
                        </span>
                        <button
                          type="button"
                          onClick={() => setState("complete")}
                          className="ml-auto min-h-11 rounded-full bg-amber-500 px-3 text-[9px] font-semibold text-white"
                        >
                          {copy.approve}
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (prompt.trim()) run();
              }}
              className="flex min-h-13 items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-sm focus-within:border-[#4568ff] dark:border-white/10 dark:bg-[#17191d]"
            >
              <button
                type="button"
                aria-label={copy.attach}
                className="grid size-11 shrink-0 place-items-center rounded-xl text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"
              >
                ＋
              </button>
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
                className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={!prompt.trim()}
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-zinc-950 text-white disabled:opacity-30 dark:bg-zinc-50 dark:text-zinc-950"
              >
                ↑
              </button>
            </form>
          </div>
        </main>
        <aside className="hidden border-l border-zinc-900/10 p-4 lg:block dark:border-white/10">
          <span className="font-mono text-[9px] uppercase tracking-[.14em] text-zinc-400">
            {copy.evidence}
          </span>
          <div className="mt-4 grid gap-2">
            {active.evidence.map((item, index) => (
              <div
                key={item}
                className="rounded-xl border border-zinc-900/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/[.035]"
              >
                <span className="font-mono text-[8px] text-zinc-400">
                  0{index + 1}
                </span>
                <strong className="mt-2 block text-[10px]">{item}</strong>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/8">
                  <motion.div
                    className="h-full rounded-full bg-[#4568ff]"
                    initial={{ width: 0 }}
                    animate={{ width: `${[92, 78, 64][index]}%` }}
                    transition={{
                      duration: reduced ? 0 : 0.7,
                      delay: index * 0.12,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

const en = {
  workspace: "Agent product workspace",
  missionsLabel: "Missions",
  team: "Interface team",
  teamMeta: "3 agents · 1 active",
  readyTitle: "Ready to run this mission",
  readyBody: "The agent will show its evidence as it works.",
  start: "Start mission",
  attach: "Add context",
  placeholder: "Ask Relay to continue…",
  evidence: "Evidence",
  approval: "The preview is ready. Publish it to the shared review URL?",
  approve: "Approve",
  state: {
    ready: "Ready",
    thinking: "Thinking",
    working: "Working",
    approval: "Needs approval",
    complete: "Complete",
  },
  runTitle: {
    ready: "Ready",
    thinking: "Reading the request",
    working: "Building the interface",
    approval: "Waiting for approval",
    complete: "Mission complete",
  },
  runMeta: {
    ready: "",
    thinking: "Comparing product context",
    working: "Editing and checking",
    approval: "One decision required",
    complete: "All evidence recorded",
  },
  missions: [
    {
      short: "Agent launch",
      kicker: "Interface mission",
      title: "Ship the agent UI collection",
      description:
        "Turn visible agent work into a product surface people can understand, trust, and want to reuse.",
      request:
        "Build a cohesive set of beautiful components for thinking, tools, approvals, and handoffs.",
      steps: [
        "Map the agent interaction states",
        "Build the component collection",
        "Publish a browser preview",
        "Record acceptance evidence",
      ],
      evidence: ["11 live components", "Reduced motion", "Registry source"],
    },
    {
      short: "Research brief",
      kicker: "Research mission",
      title: "Turn sources into a decision",
      description:
        "Keep retrieval, synthesis, citations, and the next action connected in one calm workspace.",
      request:
        "Compare the strongest AI interface patterns and recommend a visual direction.",
      steps: [
        "Collect primary references",
        "Group interaction patterns",
        "Write the recommendation",
        "Attach cited evidence",
      ],
      evidence: ["8 primary sources", "3 design paths", "Cited answer"],
    },
    {
      short: "Release review",
      kicker: "Review mission",
      title: "Close the release with proof",
      description:
        "Move checks, screenshots, approvals, and deployment into one visible completion path.",
      request:
        "Review the release, fix actionable defects, and return one production address.",
      steps: [
        "Run quality gates",
        "Inspect desktop and mobile",
        "Approve production deploy",
        "Verify the live artifact",
      ],
      evidence: ["197 unit tests", "34 browser checks", "Live artifact"],
    },
  ],
};
const zh = {
  workspace: "Agent 产品工作区",
  missionsLabel: "任务",
  team: "界面协作组",
  teamMeta: "3 个 Agent · 1 个执行中",
  readyTitle: "任务已经可以开始",
  readyBody: "Agent 会在执行过程中持续展示证据。",
  start: "开始任务",
  attach: "添加上下文",
  placeholder: "让 Relay 继续…",
  evidence: "执行证据",
  approval: "预览已经完成，是否发布到共享评审地址？",
  approve: "允许发布",
  state: {
    ready: "待开始",
    thinking: "思考中",
    working: "执行中",
    approval: "等待审批",
    complete: "已完成",
  },
  runTitle: {
    ready: "待开始",
    thinking: "正在读取需求",
    working: "正在构建界面",
    approval: "正在等待审批",
    complete: "任务完成",
  },
  runMeta: {
    ready: "",
    thinking: "比较产品上下文",
    working: "编辑并运行检查",
    approval: "需要一个明确决定",
    complete: "所有证据已经记录",
  },
  missions: [
    {
      short: "Agent 组件发布",
      kicker: "界面任务",
      title: "发布 Agent 组件组",
      description:
        "把 Agent 的执行过程转化为人能理解、信任并愿意复用的产品界面。",
      request: "为思考、工具、审批与交接设计一组统一且好看的组件。",
      steps: [
        "梳理 Agent 交互状态",
        "构建组件集合",
        "发布浏览器预览",
        "记录验收证据",
      ],
      evidence: ["11 个实时组件", "支持减弱动效", "Registry 源码"],
    },
    {
      short: "研究简报",
      kicker: "研究任务",
      title: "把来源转化为决策",
      description:
        "让检索、综合、引用与下一步行动在同一个安静工作区中连续发生。",
      request: "比较优秀的 AI 界面模式，并给出视觉方向建议。",
      steps: ["收集一手参考", "整理交互模式", "形成建议", "附上引用证据"],
      evidence: ["8 个一手来源", "3 个设计方向", "带引用的回答"],
    },
    {
      short: "发布验收",
      kicker: "验收任务",
      title: "用证据完成发布",
      description: "把检查、截图、审批与部署组织成一条清楚的完成路径。",
      request: "验收版本，处理可修复问题，最终只返回一个生产地址。",
      steps: ["运行质量门禁", "检查桌面和手机", "批准生产部署", "验证线上产物"],
      evidence: ["197 个单元测试", "34 个浏览器检查", "线上产物"],
    },
  ],
};
