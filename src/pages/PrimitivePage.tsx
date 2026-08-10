import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, RotateCcwIcon } from "../components/icons";
import { ParameterControls } from "../components/ParameterControls";
import { Seo } from "../components/Seo";
import { Disclosure } from "../components/interior/disclosure";
import { getGlossaryTermsForCanonical } from "../data/glossary";
import { getMotionGuidance } from "../data/motion-guidance";
import {
  getPrimitiveRegistryEntry,
  primitiveInstallCommand,
  primitiveSurfaceLabel
} from "../data/primitive-registry";
import { catalogRecipes } from "../data/recipes";
import { registryComponents } from "../data/component-registry";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { useRecipeParams } from "../lib/useRecipeParams";
import { PrimitivePreview } from "../registry/primitive-preview-map";
import { useRegistrySource } from "../registry/use-registry-source";
import { CopyButton } from "../registry/components/copy-button";
import { SegmentedControl } from "../registry/components/segmented-control";

export function PrimitivePage({ locale, primitiveId }: { locale: Locale; primitiveId: string }) {
  const recipe = catalogRecipes.find((entry) => entry.id === primitiveId);
  if (!recipe) return <PrimitiveFallback locale={locale} />;
  return <PrimitiveDetail locale={locale} recipeId={recipe.id} />;
}

function PrimitiveDetail({ locale, recipeId }: { locale: Locale; recipeId: string }) {
  const recipe = catalogRecipes.find((entry) => entry.id === recipeId)!;
  const registryEntry = getPrimitiveRegistryEntry(recipe.id)!;
  const { values, updateValue, resetValues } = useRecipeParams(recipe);
  const [view, setView] = useState("preview");
  const [replayKey, setReplayKey] = useState(0);
  const sourceState = useRegistrySource(registryEntry.installable ? registryEntry.registryId : null);
  const install = registryEntry.installable ? primitiveInstallCommand(recipe.id) : "";
  const glossaryTerms = getGlossaryTermsForCanonical(recipe.canonicalId);
  const guidance = getMotionGuidance(recipe.canonicalId);
  const relatedComponents = registryComponents.filter((entry) =>
    entry.primitiveIds.some((id) => id === recipe.id || recipe.aliases.includes(id))
  );
  const relatedPrimitives = recipe.relatedEntries
    .map((id) => catalogRecipes.find((entry) => entry.id === id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const copy = locale === "zh"
    ? {
        back: "全部原子动效",
        preview: "预览",
        code: "代码",
        replay: "重播",
        copyCode: "复制代码",
        copied: "已复制",
        failed: "复制失败",
        loadingCode: "正在载入源码…",
        loadCodeFailed: "源码载入失败",
        retry: "重试",
        install: "安装",
        capabilities: ["React + Motion", "参数可调", "支持减弱动效"],
        guidance: "实现规则",
        vocabulary: "相关术语",
        components: "使用该动效的组件",
        related: "相关原子动效"
      }
    : {
        back: "All primitives",
        preview: "Preview",
        code: "Code",
        replay: "Replay",
        copyCode: "Copy code",
        copied: "Copied",
        failed: "Copy failed",
        loadingCode: "Loading source…",
        loadCodeFailed: "Source failed to load",
        retry: "Retry",
        install: "Install",
        capabilities: ["React + Motion", "Tunable props", "Reduced motion"],
        guidance: "Implementation rules",
        vocabulary: "Related vocabulary",
        components: "Components using this primitive",
        related: "Related primitives"
      };

  return (
    <>
      <Seo
        locale={locale}
        title={`${text(recipe.name, locale)} — Motion Lexicon`}
        description={text(recipe.shortDescription, locale)}
        path={pathFor(locale, ["primitives", recipe.id])}
        image={`/og-primitives-${locale}.png`}
        structuredData={[{
          "@context": "https://schema.org",
          "@type": registryEntry.installable ? "SoftwareSourceCode" : "TechArticle",
          name: text(recipe.name, locale),
          description: text(recipe.shortDescription, locale),
          ...(registryEntry.installable ? {
            codeRepository: "https://github.com/Ryan-yang125/motion-lexicon",
            programmingLanguage: ["TypeScript", "React"],
            license: "https://opensource.org/license/mit"
          } : {})
        }]}
      />

      <article className="primitive-detail-page component-detail-page">
        <header className="component-detail-header primitive-detail-header">
          <Link to="/$locale/primitives/" params={{ locale }} className="component-back-link">
            <ArrowLeftIcon size={14} aria-hidden="true" />
            {copy.back}
          </Link>
          <div className="component-detail-title-row">
            <div>
              <code>{recipe.id}</code>
              <h1>{text(recipe.name, locale)}</h1>
              <p>{text(recipe.shortDescription, locale)}</p>
            </div>
            {registryEntry.installable ? (
              <CopyButton value={sourceState.source} label={copy.copyCode} copiedLabel={copy.copied} errorLabel={copy.failed} disabled={sourceState.status !== "ready"} className="component-primary-copy" />
            ) : null}
          </div>
          <ul className="component-quality-list" aria-label={locale === "zh" ? "原子动效能力" : "Primitive capabilities"}>
            <li><span className="primitive-kind-dot" />{primitiveSurfaceLabel(recipe, locale)}</li>
            {registryEntry.installable ? copy.capabilities.map((item) => <li key={item}><CheckIcon size={13} aria-hidden="true" />{item}</li>) : null}
          </ul>
        </header>

        <section className="component-workbench primitive-workbench" aria-label={text(recipe.name, locale)}>
          <div className="component-workbench-toolbar">
            <SegmentedControl
              value={view}
              onValueChange={setView}
              label={locale === "zh" ? "原子动效视图" : "Primitive view"}
              options={registryEntry.installable ? [
                { value: "preview", label: copy.preview },
                { value: "code", label: copy.code }
              ] : [{ value: "preview", label: copy.preview }]}
            />
            {view === "preview" ? (
              <button className="primitive-replay-button" type="button" onClick={() => setReplayKey((key) => key + 1)}>
                <RotateCcwIcon size={14} aria-hidden="true" />{copy.replay}
              </button>
            ) : (
              <CopyButton value={sourceState.source} label={copy.copyCode} copiedLabel={copy.copied} errorLabel={copy.failed} disabled={sourceState.status !== "ready"} />
            )}
          </div>
          {view === "preview" ? (
            <div className={`primitive-workbench-body${registryEntry.installable && recipe.params.length > 0 ? " has-controls" : ""}`}>
              <div className="component-detail-stage primitive-detail-stage">
                <PrimitivePreview locale={locale} recipe={recipe} values={values} replayKey={replayKey} />
              </div>
              {registryEntry.installable && recipe.params.length > 0 ? (
                <aside className="primitive-control-panel">
                  <ParameterControls locale={locale} recipe={recipe} values={values} onChange={updateValue} onReset={resetValues} />
                </aside>
              ) : null}
            </div>
          ) : sourceState.status === "ready" ? (
            <pre className="component-source primitive-source"><code>{sourceState.source}</code></pre>
          ) : sourceState.status === "error" ? (
            <div className="component-source primitive-source registry-source-state" role="alert">
              <span>{copy.loadCodeFailed}</span>
              <button className="primitive-replay-button" type="button" onClick={sourceState.retry}>{copy.retry}</button>
            </div>
          ) : (
            <pre className="component-source primitive-source registry-source-state" aria-busy="true"><code>{copy.loadingCode}</code></pre>
          )}
        </section>

        {registryEntry.installable ? (
          <section className="component-install-panel" aria-labelledby="primitive-install-title">
            <div><span>{copy.install}</span><code id="primitive-install-title">{install}</code></div>
            <CopyButton value={install} label={locale === "zh" ? "复制命令" : "Copy command"} copiedLabel={copy.copied} errorLabel={copy.failed} />
          </section>
        ) : null}

        <section className="primitive-reference-grid">
          {guidance ? (
            <Disclosure className="primitive-reference-panel" summary={copy.guidance}>
              <dl className="primitive-guidance-list">
                {[
                  [locale === "zh" ? "目的" : "Purpose", guidance.purpose] as const,
                  [locale === "zh" ? "触发" : "Trigger", guidance.trigger] as const,
                  [locale === "zh" ? "可中断性" : "Interruptibility", guidance.interruptibility] as const,
                  [locale === "zh" ? "减弱动效" : "Reduced motion", guidance.reducedMotionStrategy] as const
                ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{text(value, locale)}</dd></div>)}
              </dl>
            </Disclosure>
          ) : null}
          <Disclosure className="primitive-reference-panel" summary={copy.vocabulary}>
            <div className="primitive-term-list">
              {glossaryTerms.map((term) => <div key={term.id}><code>{term.id}</code><strong>{text(term.name, locale)}</strong><p>{text(term.definition, locale)}</p></div>)}
            </div>
          </Disclosure>
        </section>

        {relatedComponents.length > 0 ? (
          <section className="component-related" aria-labelledby="primitive-components-title">
            <h2 id="primitive-components-title">{copy.components}</h2>
            <div>{relatedComponents.map((entry) => <Link key={entry.id} to="/$locale/components/$componentId/" params={{ locale, componentId: entry.id }}><span>{text(entry.name, locale)}</span><ArrowRightIcon size={14} aria-hidden="true" /></Link>)}</div>
          </section>
        ) : null}

        {relatedPrimitives.length > 0 ? (
          <section className="component-related" aria-labelledby="primitive-related-title">
            <h2 id="primitive-related-title">{copy.related}</h2>
            <div>{relatedPrimitives.map((entry) => <Link key={entry.id} to="/$locale/primitives/$primitiveId/" params={{ locale, primitiveId: entry.id }}><span>{text(entry.name, locale)}</span><ArrowRightIcon size={14} aria-hidden="true" /></Link>)}</div>
          </section>
        ) : null}
      </article>
    </>
  );
}

function PrimitiveFallback({ locale }: { locale: Locale }) {
  return (
    <div className="empty-route">
      <h1>{locale === "zh" ? "没有这个原子动效" : "Primitive not found"}</h1>
      <Link to="/$locale/primitives/" params={{ locale }}>{locale === "zh" ? "返回原子动效" : "Back to primitives"}</Link>
    </div>
  );
}
