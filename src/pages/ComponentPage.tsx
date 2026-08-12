import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CopyButton } from "../registry/components/copy-button";
import { SegmentedControl } from "../registry/components/segmented-control";
import { RegistryPreview } from "../registry/preview-map";
import { useRegistrySource } from "../registry/use-registry-source";
import {
  getRegistryComponent,
  registryComponentDependencies,
  registryComponentEngines,
  registryComponentRuntimeCost,
  registryComponentSignature,
  registryInstallCommand
} from "../data/component-registry";
import { getCanonicalRecipe } from "../data/recipes";
import { pathFor, siteUrl, text } from "../data/site";
import type { Locale } from "../data/types";
import { Seo } from "../components/Seo";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../components/icons";
import { buildAgentBrief } from "../data/agent-brief";

export function ComponentPage({ locale, componentId }: { locale: Locale; componentId: string }) {
  const entry = getRegistryComponent(componentId);
  const [view, setView] = useState("preview");
  const sourceState = useRegistrySource(entry?.id ?? null);

  if (!entry) {
    return <ComponentsFallback locale={locale} />;
  }

  const copy = locale === "zh"
    ? {
        back: "全部组件",
        preview: "预览",
        code: "代码",
        copyCode: "复制代码",
        copyAgent: "复制给 Agent",
        copied: "已复制",
        failed: "复制失败",
        loadingCode: "正在载入源码…",
        loadCodeFailed: "源码载入失败",
        retry: "重试",
        install: "安装",
        access: ["键盘可用", "支持减弱动效", "TypeScript"],
        behavior: "组件行为",
        events: "适用事件",
        foundations: "基础动效",
        runtime: "运行信息",
        engine: "动效引擎",
        runtimeCost: "运行成本",
        dependencies: "依赖",
        registrySource: "打开公开 Registry JSON",
        eventCopy: {
          agent: "适合 Agent 思考、工具执行、审批、回答、任务协作与上下文交接。",
          actions: "适合点击、提交、复制与高风险确认等直接操作。",
          overlays: "适合打开、定位和关闭浮层，以及键盘焦点切换。",
          inputs: "适合输入、校验、选择与字段状态变化。",
          navigation: "适合视图切换、分页、层级导航与当前位置变化。",
          data: "适合排序、筛选、更新与数据状态变化。",
          feedback: "适合等待、成功、失败与进度反馈。",
          media: "适合浏览、聚焦、滚动与拖拽媒体内容。",
          visual: "适合品牌展示、空间探索与高信息量视觉叙事。"
        },
        cost: { light: "轻量", medium: "中等", heavy: "较高" }
      }
    : {
        back: "All components",
        preview: "Preview",
        code: "Code",
        copyCode: "Copy code",
        copyAgent: "Copy for Agent",
        copied: "Copied",
        failed: "Copy failed",
        loadingCode: "Loading source…",
        loadCodeFailed: "Source failed to load",
        retry: "Retry",
        install: "Install",
        access: ["Keyboard ready", "Reduced motion", "TypeScript"],
        behavior: "Component behavior",
        events: "Suitable events",
        foundations: "Motion foundations",
        runtime: "Runtime information",
        engine: "Motion engine",
        runtimeCost: "Runtime cost",
        dependencies: "Dependencies",
        registrySource: "Open public Registry JSON",
        eventCopy: {
          agent: "Use for agent reasoning, tool execution, approval, answers, task collaboration, and context handoff.",
          actions: "Use for direct actions such as clicks, submissions, copying, and high-risk confirmation.",
          overlays: "Use for opening, positioning, and closing overlays, including keyboard focus transitions.",
          inputs: "Use for input, validation, selection, and field-state changes.",
          navigation: "Use for view changes, pagination, hierarchy navigation, and current-location updates.",
          data: "Use for sorting, filtering, updates, and data-state changes.",
          feedback: "Use for pending, success, failure, and progress feedback.",
          media: "Use for browsing, focusing, scrolling, and dragging media.",
          visual: "Use for brand presentation, spatial exploration, and information-rich visual storytelling."
        },
        cost: { light: "Light", medium: "Medium", heavy: "Heavy" }
      };

  const related = entry.primitiveIds
    .map((id) => getCanonicalRecipe(id))
    .filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe));
  const install = registryInstallCommand(entry.id);
  const description = text(entry.description, locale);
  const signature = text(registryComponentSignature(entry), locale);
  const engines = registryComponentEngines(entry);
  const runtimeCost = registryComponentRuntimeCost(entry);
  const dependencies = registryComponentDependencies(entry);
  const registryUrl = `${siteUrl}/r/${entry.id}.json`;
  const previewUrl = `${siteUrl}${pathFor(locale, ["components", entry.id])}`;
  const agentBrief = buildAgentBrief({ locale, kind: "component", id: entry.id, name: text(entry.name, locale), description, behavior: signature, previewUrl, registryUrl });
  const requestSource = () => {
    void sourceState.ensureLoaded().catch(() => undefined);
  };
  const selectView = (nextView: string) => {
    setView(nextView);
    if (nextView === "code") requestSource();
  };

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh"
          ? `${text(entry.name, locale)} React 组件 | Motion Lexicon`
          : `${text(entry.name, locale)} React Motion Component | Motion Lexicon`}
        description={description}
        path={pathFor(locale, ["components", entry.id])}
        image={`/og/components/${entry.id}-${locale}.png`}
        structuredData={[{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: text(entry.name, locale),
          description,
          url: registryUrl,
          inLanguage: locale === "zh" ? "zh-CN" : "en",
          codeRepository: "https://github.com/Ryan-yang125/motion-lexicon",
          programmingLanguage: ["TypeScript", "React"],
          runtimePlatform: "Web browser",
          license: "https://opensource.org/license/mit"
        }]}
      />

      <article className="component-detail-page">
        <header className="component-detail-header">
          <Link to="/$locale/components/" params={{ locale }} className="component-back-link">
            <ArrowLeftIcon size={14} aria-hidden="true" />
            {copy.back}
          </Link>
          <div className="component-detail-title-row">
            <div>
              <code>{entry.id}</code>
              <h1>{text(entry.name, locale)}</h1>
              <p>{description}</p>
            </div>
            <div className="component-detail-actions">
              <CopyButton value={agentBrief} label={copy.copyAgent} copiedLabel={copy.copied} errorLabel={copy.failed} className="component-primary-copy agent-brief-copy" />
              <CopyButton value={sourceState.source} label={copy.copyCode} copiedLabel={copy.copied} errorLabel={copy.failed} onIntent={requestSource} resolveValue={sourceState.ensureLoaded} className="component-primary-copy" />
            </div>
          </div>
          <ul className="component-quality-list" aria-label={locale === "zh" ? "组件能力" : "Component capabilities"}>
            {copy.access.map((item) => <li key={item}><CheckIcon size={13} aria-hidden="true" />{item}</li>)}
          </ul>
        </header>

        <section className="component-workbench" aria-label={text(entry.name, locale)}>
          <div className="component-workbench-toolbar">
            <SegmentedControl
              value={view}
              onValueChange={selectView}
              label={locale === "zh" ? "组件视图" : "Component view"}
              options={[
                { value: "preview", label: copy.preview },
                { value: "code", label: copy.code }
              ]}
            />
            {view === "code" ? (
              <CopyButton value={sourceState.source} label={copy.copyCode} copiedLabel={copy.copied} errorLabel={copy.failed} onIntent={requestSource} resolveValue={sourceState.ensureLoaded} />
            ) : null}
          </div>
          {view === "preview" ? (
            <div className="component-detail-stage">
              <RegistryPreview id={entry.id} locale={locale} />
            </div>
          ) : sourceState.status === "ready" ? (
            <pre className="component-source"><code>{sourceState.source}</code></pre>
          ) : sourceState.status === "error" ? (
            <div className="component-source registry-source-state" role="alert">
              <span>{copy.loadCodeFailed}</span>
              <button className="primitive-replay-button" type="button" onClick={sourceState.retry}>{copy.retry}</button>
            </div>
          ) : (
            <pre className="component-source registry-source-state" aria-busy="true"><code>{copy.loadingCode}</code></pre>
          )}
        </section>

        <section className="component-install-panel" aria-labelledby="component-install-title">
          <div>
            <span>{copy.install}</span>
            <code id="component-install-title">{install}</code>
          </div>
          <CopyButton value={install} label={locale === "zh" ? "复制命令" : "Copy command"} copiedLabel={copy.copied} errorLabel={copy.failed} />
        </section>

        <section className="component-related" data-seo-section="behavior" aria-labelledby="component-behavior-title">
          <h2 id="component-behavior-title">{copy.behavior}</h2>
          <p>{signature === description ? description : `${signature} ${description}`}</p>
        </section>

        <section className="component-related" data-seo-section="events" aria-labelledby="component-events-title">
          <h2 id="component-events-title">{copy.events}</h2>
          <p>{copy.eventCopy[entry.category]}</p>
        </section>

        {related.length > 0 ? (
          <section className="component-related" data-seo-section="foundations" aria-labelledby="component-related-title">
            <h2 id="component-related-title">{copy.foundations}</h2>
            <div>
              {related.map((recipe) => (
                <Link key={recipe.id} to="/$locale/primitives/$primitiveId/" params={{ locale, primitiveId: recipe.id }}>
                  <span>{text(recipe.name, locale)}</span>
                  <ArrowRightIcon size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="component-related" data-seo-section="runtime" aria-labelledby="component-runtime-title">
          <h2 id="component-runtime-title">{copy.runtime}</h2>
          <dl className="primitive-guidance-list">
            <div><dt>{copy.engine}</dt><dd>{engines.join(", ")}</dd></div>
            <div><dt>{copy.runtimeCost}</dt><dd>{copy.cost[runtimeCost]}</dd></div>
            <div><dt>{copy.dependencies}</dt><dd>{dependencies.length > 0 ? dependencies.join(", ") : locale === "zh" ? "无" : "None"}</dd></div>
          </dl>
          <a href={`/r/${entry.id}.json`}>{copy.registrySource}</a>
        </section>
      </article>
    </>
  );
}

function ComponentsFallback({ locale }: { locale: Locale }) {
  return (
    <div className="empty-route">
      <h1>{locale === "zh" ? "没有这个组件" : "Component not found"}</h1>
      <Link to="/$locale/components/" params={{ locale }}>{locale === "zh" ? "返回组件库" : "Back to components"}</Link>
    </div>
  );
}
