import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Seo } from "../components/Seo";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "../components/icons";
import { getRegistryBlock, registryBlockInstallCommand } from "../data/block-registry";
import { getCanonicalRecipe } from "../data/recipes";
import { pathFor, siteUrl, text } from "../data/site";
import type { Locale } from "../data/types";
import { CopyButton } from "../registry/components/copy-button";
import { SegmentedControl } from "../registry/components/segmented-control";
import { RegistryPreview } from "../registry/preview-map";
import { useRegistrySource } from "../registry/use-registry-source";

type BlockViewport = "desktop" | "tablet" | "mobile";

export function BlockPage({ locale, blockId }: { locale: Locale; blockId: string }) {
  const entry = getRegistryBlock(blockId);
  const [view, setView] = useState("preview");
  const [viewport, setViewport] = useState<BlockViewport>("desktop");
  const [fullScreen, setFullScreen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fullScreenTriggerRef = useRef<HTMLButtonElement>(null);
  const sourceState = useRegistrySource(entry?.id ?? null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (fullScreen && !dialog.open) dialog.showModal();
    if (!fullScreen && dialog.open) dialog.close();
  }, [fullScreen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      setFullScreen(false);
      requestAnimationFrame(() => fullScreenTriggerRef.current?.focus({ preventScroll: true }));
    };
    const onClose = () => setFullScreen(false);
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
    };
  }, []);

  if (!entry) return null;

  const copy = locale === "zh" ? zhCopy : enCopy;
  const description = text(entry.description, locale);
  const install = registryBlockInstallCommand(entry.id);
  const registryUrl = `${siteUrl}/r/${entry.id}.json`;
  const related = entry.primitiveIds.map((id) => getCanonicalRecipe(id)).filter((recipe): recipe is NonNullable<typeof recipe> => Boolean(recipe));
  const requestSource = () => void sourceState.ensureLoaded().catch(() => undefined);
  const selectView = (nextView: string) => {
    setView(nextView);
    if (nextView === "code") requestSource();
  };

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh" ? `${text(entry.name, locale)} React 页面 Block | Motion Lexicon` : `${text(entry.name, locale)} React Page Block | Motion Lexicon`}
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
          license: "https://opensource.org/license/mit",
        }]}
      />

      <article className="component-detail-page block-detail-page">
        <header className="component-detail-header">
          <Link to="/$locale/components/" params={{ locale }} className="component-back-link">
            <ArrowLeftIcon size={14} aria-hidden="true" />
            {copy.back}
          </Link>
          <div className="component-detail-title-row">
            <div>
              <code>registry:block · {entry.id}</code>
              <h1>{text(entry.name, locale)}</h1>
              <p>{description}</p>
            </div>
            <CopyButton
              value={sourceState.source}
              label={copy.copyCode}
              copiedLabel={copy.copied}
              errorLabel={copy.failed}
              onIntent={requestSource}
              resolveValue={sourceState.ensureLoaded}
              className="component-primary-copy"
            />
          </div>
          <ul className="component-quality-list" aria-label={copy.capabilities}>
            {copy.access.map((item) => <li key={item}><CheckIcon size={13} aria-hidden="true" />{item}</li>)}
          </ul>
        </header>

        <section className="component-workbench block-workbench" aria-label={text(entry.name, locale)}>
          <div className="component-workbench-toolbar block-workbench-toolbar">
            <SegmentedControl
              value={view}
              onValueChange={selectView}
              label={copy.viewLabel}
              options={[{ value: "preview", label: copy.preview }, { value: "code", label: copy.code }]}
            />
            {view === "preview" ? (
              <div className="block-toolbar-actions">
                <SegmentedControl
                  value={viewport}
                  onValueChange={(value) => setViewport(value as BlockViewport)}
                  label={copy.viewportLabel}
                  options={[{ value: "desktop", label: copy.desktop }, { value: "tablet", label: copy.tablet }, { value: "mobile", label: copy.mobile }]}
                />
                <button ref={fullScreenTriggerRef} className="primitive-replay-button block-fullscreen-button" type="button" onClick={() => setFullScreen(true)}>{copy.fullScreen}</button>
              </div>
            ) : (
              <CopyButton value={sourceState.source} label={copy.copyCode} copiedLabel={copy.copied} errorLabel={copy.failed} onIntent={requestSource} resolveValue={sourceState.ensureLoaded} />
            )}
          </div>

          {view === "preview" ? (
            <div className="component-detail-stage block-detail-stage" data-block-viewport={viewport}>
              <div className="block-viewport-frame">
                <RegistryPreview id={entry.id} locale={locale} />
              </div>
            </div>
          ) : sourceState.status === "ready" ? (
            <pre className="component-source block-source"><code>{sourceState.source}</code></pre>
          ) : sourceState.status === "error" ? (
            <div className="component-source registry-source-state" role="alert"><span>{copy.loadCodeFailed}</span><button className="primitive-replay-button" type="button" onClick={sourceState.retry}>{copy.retry}</button></div>
          ) : (
            <pre className="component-source registry-source-state" aria-busy="true"><code>{copy.loadingCode}</code></pre>
          )}
        </section>

        <section className="component-install-panel" aria-labelledby="block-install-title">
          <div><span>{copy.install}</span><code id="block-install-title">{install}</code></div>
          <CopyButton value={install} label={copy.copyCommand} copiedLabel={copy.copied} errorLabel={copy.failed} />
        </section>

        <section className="component-related" data-seo-section="behavior" aria-labelledby="block-behavior-title">
          <h2 id="block-behavior-title">{copy.behavior}</h2>
          <p>{text(entry.signature, locale)}</p>
        </section>

        <section className="component-related" data-seo-section="foundations" aria-labelledby="block-foundations-title">
          <h2 id="block-foundations-title">{copy.foundations}</h2>
          <div>
            {related.map((recipe) => <Link key={recipe.id} to="/$locale/primitives/$primitiveId/" params={{ locale, primitiveId: recipe.id }}><span>{text(recipe.name, locale)}</span><ArrowRightIcon size={14} aria-hidden="true" /></Link>)}
          </div>
        </section>

        <section className="component-related" data-seo-section="runtime" aria-labelledby="block-runtime-title">
          <h2 id="block-runtime-title">{copy.runtime}</h2>
          <dl className="primitive-guidance-list">
            <div><dt>{copy.registryType}</dt><dd>registry:block</dd></div>
            <div><dt>{copy.dependencies}</dt><dd>{entry.dependencies.join(", ")}</dd></div>
            <div><dt>{copy.delivery}</dt><dd>{copy.deliveryValue}</dd></div>
          </dl>
          <a href={`/r/${entry.id}.json`}>{copy.registrySource}</a>
        </section>
      </article>

      <dialog ref={dialogRef} className="block-preview-dialog" aria-label={`${text(entry.name, locale)} ${copy.fullScreen}`}>
        <div className="block-preview-dialog-toolbar"><strong>{text(entry.name, locale)}</strong><button className="primitive-replay-button" type="button" onClick={() => { setFullScreen(false); requestAnimationFrame(() => fullScreenTriggerRef.current?.focus({ preventScroll: true })); }}>{copy.close}</button></div>
        <div className="block-preview-dialog-body"><RegistryPreview id={entry.id} locale={locale} /></div>
      </dialog>
    </>
  );
}

const enCopy = {
  back: "All components", preview: "Preview", code: "Code", copyCode: "Copy code", copied: "Copied", failed: "Copy failed", loadingCode: "Loading source…", loadCodeFailed: "Source failed to load", retry: "Retry",
  install: "Install page block", copyCommand: "Copy command", behavior: "Page behavior", foundations: "Motion foundations", runtime: "Delivery information", registryType: "Registry type", dependencies: "Dependencies", delivery: "Delivery", deliveryValue: "One self-contained React page file", registrySource: "Open public Registry JSON",
  capabilities: "Page block capabilities", access: ["Responsive page", "Keyboard ready", "Reduced motion", "TypeScript"], viewLabel: "Page block view", viewportLabel: "Preview viewport", desktop: "Desktop", tablet: "Tablet", mobile: "Mobile", fullScreen: "Full screen", close: "Close preview",
};

const zhCopy = {
  back: "全部组件", preview: "预览", code: "代码", copyCode: "复制代码", copied: "已复制", failed: "复制失败", loadingCode: "正在载入源码…", loadCodeFailed: "源码载入失败", retry: "重试",
  install: "安装页面 Block", copyCommand: "复制命令", behavior: "页面行为", foundations: "基础动效", runtime: "交付信息", registryType: "Registry 类型", dependencies: "依赖", delivery: "交付方式", deliveryValue: "一个自包含的 React 页面文件", registrySource: "打开公开 Registry JSON",
  capabilities: "页面 Block 能力", access: ["响应式页面", "键盘可用", "支持减弱动效", "TypeScript"], viewLabel: "页面 Block 视图", viewportLabel: "预览视口", desktop: "桌面", tablet: "平板", mobile: "手机", fullScreen: "全屏预览", close: "关闭预览",
};
