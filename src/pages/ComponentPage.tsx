import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CopyButton } from "../registry/components/copy-button";
import { SegmentedControl } from "../registry/components/segmented-control";
import { RegistryPreview } from "../registry/preview-map";
import { useRegistrySource } from "../registry/use-registry-source";
import { getRegistryComponent, registryInstallCommand } from "../data/component-registry";
import { getCanonicalRecipe } from "../data/recipes";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { Seo } from "../components/Seo";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../components/icons";

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
        copied: "已复制",
        failed: "复制失败",
        loadingCode: "正在载入源码…",
        loadCodeFailed: "源码载入失败",
        retry: "重试",
        install: "安装",
        access: ["键盘可用", "支持减弱动效", "TypeScript"],
        foundations: "相关原子动效"
      }
    : {
        back: "All components",
        preview: "Preview",
        code: "Code",
        copyCode: "Copy code",
        copied: "Copied",
        failed: "Copy failed",
        loadingCode: "Loading source…",
        loadCodeFailed: "Source failed to load",
        retry: "Retry",
        install: "Install",
        access: ["Keyboard ready", "Reduced motion", "TypeScript"],
        foundations: "Related primitives"
      };

  const related = entry.primitiveIds
    .map((id) => getCanonicalRecipe(id))
    .filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe));
  const install = registryInstallCommand(entry.id);

  return (
    <>
      <Seo
        locale={locale}
        title={`${text(entry.name, locale)} — Motion Lexicon`}
        description={text(entry.description, locale)}
        path={pathFor(locale, ["components", entry.id])}
        image={`/og-components-${locale}.png`}
        structuredData={[{
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: text(entry.name, locale),
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
              <p>{text(entry.description, locale)}</p>
            </div>
            <CopyButton
              value={sourceState.source}
              label={copy.copyCode}
              copiedLabel={copy.copied}
              errorLabel={copy.failed}
              disabled={sourceState.status !== "ready"}
              className="component-primary-copy"
            />
          </div>
          <ul className="component-quality-list" aria-label={locale === "zh" ? "组件能力" : "Component capabilities"}>
            {copy.access.map((item) => <li key={item}><CheckIcon size={13} aria-hidden="true" />{item}</li>)}
          </ul>
        </header>

        <section className="component-workbench" aria-label={text(entry.name, locale)}>
          <div className="component-workbench-toolbar">
            <SegmentedControl
              value={view}
              onValueChange={setView}
              label={locale === "zh" ? "组件视图" : "Component view"}
              options={[
                { value: "preview", label: copy.preview },
                { value: "code", label: copy.code }
              ]}
            />
            {view === "code" ? (
              <CopyButton value={sourceState.source} label={copy.copyCode} copiedLabel={copy.copied} errorLabel={copy.failed} disabled={sourceState.status !== "ready"} />
            ) : null}
          </div>
          {view === "preview" ? (
            <div className="component-detail-stage">
              <RegistryPreview id={entry.id} />
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

        {related.length > 0 ? (
          <section className="component-related" aria-labelledby="component-related-title">
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
