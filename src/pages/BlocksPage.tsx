import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "../components/icons";
import { Seo } from "../components/Seo";
import { registryBlocks } from "../data/block-registry";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { RegistryPreview } from "../registry/preview-map";

export function BlocksPage({ locale }: { locale: Locale }) {
  const copy = locale === "zh"
    ? { title: "可组合的 React 页面 Blocks", description: "完整产品页面，用已发布组件验证布局、状态和动效如何一起工作。", count: `${registryBlocks.length} 个页面 Blocks`, open: "查看页面 Block", proof: "组合证明" }
    : { title: "Composable React Page Blocks", description: "Complete product pages that prove how layout, state, and motion work together.", count: `${registryBlocks.length} Page Blocks`, open: "Open page block", proof: "Composition proof" };

  return <>
    <Seo locale={locale} title={`${copy.title} — Motion Lexicon`} description={copy.description} path={pathFor(locale, ["blocks"])} image={`/og-components-${locale}.png`} />
    <div className="directory-page v6-blocks-page">
      <header className="directory-hero">
        <span className="directory-kicker">React · Motion · shadcn registry</span>
        <h1>{copy.title}</h1>
        <div className="directory-hero-meta"><span>{copy.count}</span><span>{copy.proof}</span><code>npx shadcn@latest add</code></div>
      </header>
      <section className="component-directory-section" aria-labelledby="page-blocks">
        <header className="directory-section-heading"><h2 id="page-blocks">{locale === "zh" ? "页面 Blocks" : "Page Blocks"}</h2><span>{registryBlocks.length}</span></header>
        <div className="component-card-grid block-card-grid v6-block-directory-grid">
          {registryBlocks.map((entry, index) => <article className={`component-card block-card v6-block-directory-card is-${index % 3}`} key={entry.id}>
            <div className="component-card-stage block-card-stage"><RegistryPreview id={entry.id} locale={locale} deferred /></div>
            <Link className="component-card-footer" to="/$locale/blocks/$blockId/" params={{ locale, blockId: entry.id }} aria-label={`${copy.open}: ${text(entry.name, locale)}`}><span><strong>{text(entry.name, locale)}</strong><code>{entry.id}</code></span><ArrowRightIcon size={15} aria-hidden="true" /></Link>
          </article>)}
        </div>
      </section>
    </div>
  </>;
}
