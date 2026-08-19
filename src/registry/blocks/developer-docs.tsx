"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { CodeComparison } from "@/registry/components/code-comparison";
import {
  CommandPalette,
  type CommandItem,
} from "@/registry/components/command-palette";
import { MegaMenu } from "@/registry/components/mega-menu";
import { SplitTextReveal } from "@/registry/components/split-text-reveal";

type Locale = "zh" | "en";
export type DeveloperDocsBlockProps = { locale?: Locale; className?: string };

const installCode = `npx shadcn@latest add \n  https://motionlexicon.com/r/code-comparison.json`;
const manualCode = `import { CodeComparison } from "@/components/code-comparison";\n\nexport function Review() {\n  return <CodeComparison items={changes} />;\n}`;

export function DeveloperDocsBlock({
  locale = "en",
  className = "",
}: DeveloperDocsBlockProps) {
  const reduced = useReducedMotion() === true;
  const [commandOpen, setCommandOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [section, setSection] = useState("overview");
  const c = locale === "zh" ? zh : en;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        event.stopPropagation();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);
  const commands: CommandItem[] = c.commands.map((label, index) => ({
    id: `command-${index}`,
    label,
    hint: c.commandHints[index],
    shortcut: index === 0 ? ["⌘", "K"] : undefined,
  }));
  const selectCommand = (item: CommandItem) => {
    setSection(
      item.id === "command-1"
        ? "install"
        : item.id === "command-2"
          ? "api"
          : "overview",
    );
    setCommandOpen(false);
  };
  const navigation = [
    {
      id: "docs",
      label: c.docs,
      preview: (
        <div className="grid size-24 place-items-center rounded-xl bg-[#dbe7ff] text-[24px] text-[#2457d6]">
          ⌘
        </div>
      ),
      links: [
        {
          id: "intro",
          label: c.intro,
          description: c.introBody,
          onSelect: () => setSection("overview"),
        },
        {
          id: "install",
          label: c.install,
          description: c.installBody,
          onSelect: () => setSection("install"),
        },
      ],
    },
    {
      id: "reference",
      label: c.reference,
      preview: (
        <div className="grid size-24 place-items-center rounded-xl bg-[#dff1e7] text-[24px] text-[#18724c]">
          {}
        </div>
      ),
      links: [
        {
          id: "api",
          label: c.api,
          description: c.apiBody,
          onSelect: () => setSection("api"),
        },
        {
          id: "examples",
          label: c.examples,
          description: c.examplesBody,
          onSelect: () => setSection("examples"),
        },
      ],
    },
  ];
  return (
    <section
      data-page-block="developer-docs"
      className={`relative w-full overflow-hidden rounded-[18px] border border-neutral-200 bg-[#f6f7f9] text-neutral-950 shadow-[0_24px_60px_-45px_rgba(15,23,42,.4)] dark:border-white/10 dark:bg-[#111318] dark:text-neutral-50 ${className}`}
    >
      <header className="flex min-h-16 items-center gap-3 border-b border-neutral-200 bg-white px-4 sm:px-6 dark:border-white/10 dark:bg-[#181b21]">
        <a
          href="#docs-overview"
          className="flex min-h-11 items-center gap-2 font-semibold tracking-[-.03em] outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-neutral-950 text-[11px] text-white dark:bg-white dark:text-neutral-950">
            ML
          </span>
          Motion Lexicon
        </a>
        <nav
          className="ml-auto hidden items-center gap-1 md:flex"
          aria-label={c.navigation}
        >
          {[c.docs, c.components, c.guides].map((item) => (
            <a
              key={item}
              href="#docs-overview"
              className="min-h-11 rounded-lg px-3 py-3 text-[11px] text-neutral-500 hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-white/5"
            >
              {item}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="min-h-11 rounded-lg border border-neutral-200 bg-neutral-50 px-3 font-mono text-[10px] text-neutral-500 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-white/5"
        >
          {c.search}
          <span className="ml-3 text-neutral-400">⌘K</span>
        </button>
      </header>
      <div className="grid min-h-[720px] lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="hidden border-r border-neutral-200 bg-white p-3 lg:block dark:border-white/10 dark:bg-[#181b21]">
          <p className="px-3 py-3 font-mono text-[9px] uppercase tracking-[.16em] text-neutral-400">
            {c.onThisPage}
          </p>
          {["overview", "install", "api", "examples"].map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`min-h-11 w-full rounded-lg px-3 text-left text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${section === id ? "bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-white/5"}`}
            >
              {c.sections[id as keyof typeof c.sections]}
            </button>
          ))}
        </aside>
        <div
          id="docs-overview"
          className="min-w-0 px-5 py-10 sm:px-8 lg:px-12"
        >
          <div className="mx-auto max-w-4xl">
            <MegaMenu
              sections={navigation}
              label={c.navigation}
              className="mb-10"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={section}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-blue-600">
                  {c.sections[section as keyof typeof c.sections]}
                </p>
                <SplitTextReveal
                  text={
                    section === "install"
                      ? c.installTitle
                      : section === "api"
                        ? c.apiTitle
                        : c.title
                  }
                  mode="word"
                  label={c.title}
                  className="mt-4 text-[clamp(32px,5vw,52px)] font-semibold leading-[.95] tracking-[-.06em]"
                />
                <p className="mt-6 max-w-2xl text-[14px] leading-6 text-neutral-600 dark:text-neutral-300">
                  {section === "install"
                    ? c.installLead
                    : section === "api"
                      ? c.apiLead
                      : c.lead}
                </p>
                {section === "overview" ? (
                  <div className="mt-9 grid gap-3 sm:grid-cols-3">
                    {c.principles.map((item, index) => (
                      <article
                        key={item.title}
                        className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-[#181b21]"
                      >
                        <span className="font-mono text-[9px] text-blue-600">
                          0{index + 1}
                        </span>
                        <h2 className="mt-6 text-[14px] font-medium">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-[11px] leading-5 text-neutral-500">
                          {item.body}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : null}
                {section === "install" ? (
                  <div className="mt-8 overflow-hidden rounded-xl bg-[#101218] p-4 text-[#dce8ff]">
                    <div className="flex justify-between gap-3 font-mono text-[9px] text-white/45">
                      <span>TERMINAL</span>
                      <button
                        type="button"
                        onClick={() => setCopied(true)}
                        className="min-h-11 rounded-lg px-2 text-[#bcd2ff] outline-none focus-visible:ring-2 focus-visible:ring-[#9cc5ff]"
                      >
                        {copied ? c.copied : c.copy}
                      </button>
                    </div>
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-6">
                      <code>{installCode}</code>
                    </pre>
                  </div>
                ) : null}
                {section === "api" || section === "examples" ? (
                  <CodeComparison
                    label={c.comparison}
                    items={[
                      {
                        id: "registry",
                        label: c.registry,
                        meta: "01",
                        code: installCode,
                        description: c.registryBody,
                        preview: (
                          <div className="grid size-full place-items-center bg-[#18325f] p-6 text-center text-white">
                            <span className="font-mono text-[10px] tracking-[.16em]">
                              REGISTRY READY
                            </span>
                            <strong className="mt-3 text-[25px] tracking-[-.05em]">
                              {c.previewOne}
                            </strong>
                          </div>
                        ),
                      },
                      {
                        id: "manual",
                        label: c.manual,
                        meta: "02",
                        code: manualCode,
                        description: c.manualBody,
                        preview: (
                          <div className="grid size-full place-items-center bg-[#235a4c] p-6 text-center text-white">
                            <span className="font-mono text-[10px] tracking-[.16em]">
                              SOURCE CONTROL
                            </span>
                            <strong className="mt-3 text-[25px] tracking-[-.05em]">
                              {c.previewTwo}
                            </strong>
                          </div>
                        ),
                      },
                    ]}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {commandOpen ? (
          <div
            className="absolute inset-0 z-20 grid place-items-start bg-neutral-950/25 p-4 pt-20 backdrop-blur-sm"
            role="presentation"
            onMouseDown={() => setCommandOpen(false)}
          >
            <div
              className="w-full max-w-[520px]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <CommandPalette
                open
                items={commands}
                onSelect={selectCommand}
                onDismiss={() => setCommandOpen(false)}
                label={c.search}
                placeholder={c.search}
              />
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

const en = {
  navigation: "Documentation navigation",
  docs: "Docs",
  components: "Components",
  guides: "Guides",
  search: "Search docs",
  onThisPage: "On this page",
  intro: "Introduction",
  introBody: "Start with the component contract.",
  install: "Install",
  installBody: "Add a component through the Registry.",
  reference: "Reference",
  api: "API",
  apiBody: "Focused props and stable states.",
  examples: "Examples",
  examplesBody: "Compare source approaches.",
  title: "Motion that holds up in product.",
  lead: "Copy-ready components with an intentional primary frame, a focused API, and motion that continues to make sense when it stops.",
  installTitle: "Install the source you previewed.",
  installLead:
    "The Registry command installs the exact implementation, dependency list, and local source file used in this preview.",
  apiTitle: "Choose the integration that fits your stack.",
  apiLead:
    "Every recipe stays legible as a local component. Compare the quickest installation path with a direct source import.",
  sections: {
    overview: "Overview",
    install: "Install",
    api: "API reference",
    examples: "Examples",
  },
  principles: [
    {
      title: "Primary state",
      body: "Every preview is useful before it moves.",
    },
    {
      title: "Focused props",
      body: "Useful defaults with a compact public surface.",
    },
    {
      title: "Graceful motion",
      body: "Keyboard and reduced-motion behavior are first class.",
    },
  ],
  copy: "Copy command",
  copied: "Copied",
  comparison: "Two ways to install",
  registry: "Registry",
  registryBody: "Use one command to add the exact public artifact.",
  manual: "Source import",
  manualBody: "Keep the implementation beside the rest of your product.",
  previewOne: "Ready in one command.",
  previewTwo: "Made to stay editable.",
  commands: ["Open overview", "Open installation", "Open API reference"],
  commandHints: ["Start here", "Registry command", "Props and examples"],
};
const zh: typeof en = {
  navigation: "文档导航",
  docs: "文档",
  components: "组件",
  guides: "指南",
  search: "搜索文档",
  onThisPage: "本页内容",
  intro: "简介",
  introBody: "从组件契约开始。",
  install: "安装",
  installBody: "通过 Registry 添加组件。",
  reference: "参考",
  api: "API",
  apiBody: "聚焦的属性与稳定状态。",
  examples: "示例",
  examplesBody: "比较源码方案。",
  title: "经得起产品考验的动效。",
  lead: "可直接复制的组件拥有有意图的首帧、聚焦的 API，以及在暂停后仍然成立的动效。",
  installTitle: "安装你正在预览的源码。",
  installLead: "Registry 命令会安装这个预览使用的实现、依赖清单和本地源码。",
  apiTitle: "选择适合当前技术栈的集成方式。",
  apiLead:
    "每个配方都能作为本地组件清晰阅读。比较最快的安装路径和直接源码导入。",
  sections: {
    overview: "概览",
    install: "安装",
    api: "API 参考",
    examples: "示例",
  },
  principles: [
    { title: "首要状态", body: "每个预览在运动前也有明确价值。" },
    { title: "聚焦属性", body: "有用的默认值配合紧凑公开接口。" },
    { title: "优雅动效", body: "键盘与减弱动效都是一等能力。" },
  ],
  copy: "复制命令",
  copied: "已复制",
  comparison: "两种安装方式",
  registry: "Registry",
  registryBody: "用一条命令添加完全一致的公开制品。",
  manual: "源码导入",
  manualBody: "把实现放在产品其他代码旁边维护。",
  previewOne: "一条命令即可准备好。",
  previewTwo: "始终保持可编辑。",
  commands: ["打开概览", "打开安装", "打开 API 参考"],
  commandHints: ["从这里开始", "Registry 命令", "属性与示例"],
};
