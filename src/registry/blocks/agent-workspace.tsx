"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { InlineEdit } from "@/registry/components/inline-edit";
import { MetricTicker } from "@/registry/components/metric-ticker";
import { PromptComposer } from "@/registry/components/prompt-composer";

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
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  const run = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
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
      className={`min-h-[720px] w-full overflow-hidden rounded-[18px] border border-[#b8cbd1]/45 bg-[#edf3f2] text-neutral-950 shadow-[0_28px_60px_-42px_rgba(18,46,51,.46)] dark:border-white/10 dark:bg-[#151515] dark:text-neutral-50 ${className}`}
      data-page-block="agent-workspace"
    >
      <header className="flex min-h-14 items-center gap-3 border-b border-[#b8cbd1]/45 bg-[#f9fdfc] px-4 dark:border-white/10 dark:bg-[#1b1b1b]">
        <a
          href="#relay-workspace"
          className="flex min-h-11 items-center gap-2.5 rounded-lg font-semibold tracking-[-.02em] outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-neutral-950 text-white dark:bg-neutral-50 dark:text-neutral-950">
            <svg
              viewBox="0 0 24 24"
              className="size-3.5 fill-none stroke-current"
              strokeWidth="1.7"
            >
              <path d="M5 17V7l7 4 7-4v10l-7 4-7-4Z" />
              <path d="m5 7 7-4 7 4M12 11v10" />
            </svg>
          </span>
          Relay
        </a>
        <span className="hidden h-4 w-px bg-neutral-200 sm:block dark:bg-white/10" />
        <span className="hidden text-[11px] text-neutral-500 sm:block dark:text-neutral-400">
          {copy.workspace}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`size-1.5 rounded-full ${state === "complete" ? "bg-emerald-600" : state === "approval" ? "bg-amber-500" : state === "ready" ? "bg-neutral-300 dark:bg-neutral-600" : "bg-neutral-950 dark:bg-neutral-50"}`}
          />
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
            {copy.state[state]}
          </span>
        </div>
      </header>
      <div
        className="grid min-h-[664px] lg:grid-cols-[188px_minmax(0,1fr)_220px]"
        id="relay-workspace"
      >
        <aside className="hidden border-r border-neutral-200 bg-[#fafafa] p-3 lg:flex lg:flex-col dark:border-white/10 dark:bg-[#181818]">
          <span className="px-3 py-3 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
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
                className={`min-h-11 rounded-lg px-3 text-left text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${mission === index ? "bg-neutral-950 font-medium text-white dark:bg-neutral-50 dark:text-neutral-950" : "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/5"}`}
              >
                {item.short}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-neutral-200 px-3 pt-4 dark:border-white/10">
            <div className="flex -space-x-1">
              {["R", "D", "Q"].map((agent, index) => (
                <span
                  key={agent}
                  className={`grid size-7 place-items-center rounded-full border-2 border-[#fafafa] text-[8px] font-semibold text-white dark:border-[#181818] ${["bg-neutral-950", "bg-neutral-700", "bg-neutral-500"][index]}`}
                >
                  {agent}
                </span>
              ))}
            </div>
            <strong className="mt-3 block text-[10px]">{copy.team}</strong>
            <span className="text-[9px] text-neutral-400">{copy.teamMeta}</span>
          </div>
        </aside>
        <div className="flex min-w-0 flex-col bg-white dark:bg-[#1b1b1b]">
          <div className="border-b border-neutral-200 px-5 py-6 sm:px-7 dark:border-white/10">
            <code className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {active.kicker}
            </code>
            <h1 className="mt-2 max-w-[620px] text-[26px] font-semibold leading-[1.1] tracking-[-.03em]">
              {active.title}
            </h1>
            <p className="mt-3 max-w-[620px] text-[12px] leading-5 text-neutral-500 dark:text-neutral-400">
              {active.description}
            </p>
            <InlineEdit
              value={active.title}
              label={locale === "zh" ? "任务标题" : "Mission title"}
              className="mt-4 max-w-md"
            />
          </div>
          <div className="grid min-h-14 grid-cols-[74px_1fr] items-center border-b border-neutral-200 px-5 text-[11px] sm:px-7 dark:border-white/10">
            <span className="text-neutral-400">{copy.requestLabel}</span>
            <p className="m-0 text-neutral-700 dark:text-neutral-200">{active.request}</p>
          </div>
          <div className="flex flex-1 flex-col px-5 py-5 sm:px-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mission}-${state}`}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: reduced ? 0 : 0.3, ease }}
                className="min-h-[286px]"
              >
                {state === "ready" ? (
                  <div>
                    <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4 dark:border-white/10">
                      <div>
                        <strong className="block text-[13px]">{copy.readyTitle}</strong>
                        <span className="mt-1 block text-[10px] text-neutral-500 dark:text-neutral-400">{copy.readyBody}</span>
                      </div>
                      <button
                        type="button"
                        onClick={run}
                        className="min-h-11 shrink-0 rounded-lg bg-neutral-950 px-4 text-[10px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-neutral-50 dark:text-neutral-950"
                      >
                        {copy.start}
                      </button>
                    </div>
                    <ol>
                      {active.steps.map((step, index) => (
                        <li key={step} className="grid min-h-12 grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-neutral-100 text-[11px] last:border-b-0 dark:border-white/8">
                          <code className="text-[9px] text-neutral-400">0{index + 1}</code>
                          <span>{step}</span>
                          <span className="text-[9px] text-neutral-400">{copy.queued}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="relative grid size-8 place-items-center rounded-lg border border-neutral-300 dark:border-white/20">
                        <span className="size-1.5 rounded-full bg-neutral-950 dark:bg-neutral-50" />
                        {state !== "complete" ? (
                          <motion.i
                            className="absolute inset-0 rounded-lg border border-neutral-500/50"
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
                        <span className="text-[9px] text-neutral-400">
                          {copy.runMeta[state]}
                        </span>
                      </div>
                    </div>
                    <ol className="mt-4 border-t border-neutral-200 dark:border-white/10">
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
                            className="grid min-h-12 grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-neutral-100 dark:border-white/8"
                          >
                            <span
                              className={`grid size-5 place-items-center rounded-md border text-[8px] ${visible && !current ? "border-emerald-600 bg-emerald-600 text-white" : current ? "border-neutral-950 text-neutral-950 dark:border-neutral-50 dark:text-neutral-50" : "border-neutral-200 text-neutral-300 dark:border-white/10"}`}
                            >
                              {visible && !current ? "✓" : index + 1}
                            </span>
                            <span
                              className={`text-[11px] ${visible ? "text-neutral-700 dark:text-neutral-200" : "text-neutral-300 dark:text-neutral-600"}`}
                            >
                              {step}
                            </span>
                            <span className="text-[9px] text-neutral-400">{current ? copy.state[state] : visible ? copy.state.complete : copy.state.ready}</span>
                          </li>
                        );
                      })}
                    </ol>
                    {state === "approval" ? (
                      <div className="mt-4 flex items-center gap-3 border-t border-amber-300 pt-4 dark:border-amber-500/30">
                        <span className="text-amber-600">!</span>
                        <span className="text-[10px] text-amber-800 dark:text-amber-200">
                          {copy.approval}
                        </span>
                        <button
                          type="button"
                          onClick={() => setState("complete")}
                          className="ml-auto min-h-11 rounded-lg bg-neutral-950 px-3 text-[9px] font-semibold text-white dark:bg-neutral-50 dark:text-neutral-950"
                        >
                          {copy.approve}
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <PromptComposer
            className="m-4 mt-0 sm:mx-7"
            placeholder={copy.placeholder}
            sendLabel={copy.start}
            addSourcesLabel={copy.attach}
            sources={[{ id: "brief", label: active.kicker, type: "file", connected: true }]}
            onSubmit={() => run()}
          />
        </div>
        <aside className="hidden border-l border-neutral-200 bg-[#fafafa] p-4 lg:block dark:border-white/10 dark:bg-[#181818]">
          <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
            {copy.evidence}
          </span>
          <MetricTicker
            label={locale === "zh" ? "完成度" : "Mission completion"}
            value={state === "complete" ? 100 : state === "approval" ? 75 : state === "working" ? 50 : state === "thinking" ? 25 : 0}
            format={(value) => `${value}%`}
            delta={state === "complete" ? 100 : 0}
            period={locale === "zh" ? "当前任务" : "this mission"}
            className="mt-4"
          />
          <div className="mt-4 border-t border-neutral-200 dark:border-white/10">
            {active.evidence.map((item, index) => (
              <div
                key={item}
                className="grid min-h-[76px] grid-cols-[22px_1fr] content-center gap-2 border-b border-neutral-200 py-3 dark:border-white/10"
              >
                <span className="grid size-5 place-items-center rounded-md border border-neutral-300 text-[8px] text-neutral-500 dark:border-white/20">
                  {state === "complete" ? "✓" : index + 1}
                </span>
                <div>
                  <strong className="block text-[10px]">{item}</strong>
                  <span className="mt-1 block text-[8px] text-neutral-400">
                    {copy.evidenceState[index]}
                  </span>
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
  requestLabel: "Request",
  queued: "Queued",
  evidenceState: ["Verified", "Available", "Recorded"],
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
  requestLabel: "需求",
  queued: "待执行",
  evidenceState: ["已验证", "可使用", "已记录"],
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
