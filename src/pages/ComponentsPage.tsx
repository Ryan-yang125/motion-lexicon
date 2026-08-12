import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "../components/icons";
import { Seo } from "../components/Seo";
import { registryBlocks } from "../data/block-registry";
import { componentCategories, registryComponents } from "../data/component-registry";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { RegistryPreview } from "../registry/preview-map";

export function ComponentsPage({ locale }: { locale: Locale }) {
  const copy = locale === "zh"
      ? {
        title: "可直接复制的 React 动效组件",
        description: "4 个完整页面 Block 与 48 个适用于真实产品和网站界面的 React 动效组件。",
        count: "4 个页面 Block · 48 个组件",
        open: "查看组件",
        blocks: "页面 Blocks",
        openBlock: "查看页面 Block"
      }
    : {
        title: "Copy-ready React motion components",
        description: "4 complete page blocks and 48 React motion components for real products and websites.",
        count: "4 page blocks · 48 components",
        open: "Open component",
        blocks: "Page Blocks",
        openBlock: "Open page block"
      };

  return (
    <>
      <Seo
        locale={locale}
        title={`${copy.title} — Motion Lexicon`}
        description={copy.description}
        path={pathFor(locale, ["components"])}
        image={`/og-components-${locale}.png`}
      />

      <div className="directory-page">
        <header className="directory-hero">
          <span className="directory-kicker">React · Motion · GSAP · Three.js · WebGL · shadcn registry</span>
          <h1>{copy.title}</h1>
          <div className="directory-hero-meta">
            <span>{copy.count}</span>
            <code>npx shadcn@latest add</code>
          </div>
        </header>

        <section className="component-directory-section" aria-labelledby="component-category-blocks">
          <header className="directory-section-heading">
            <h2 id="component-category-blocks">{copy.blocks}</h2>
            <span>{registryBlocks.length}</span>
          </header>
          <div className="component-card-grid block-card-grid">
            {registryBlocks.map((entry) => (
              <article className="component-card block-card" key={entry.id}>
                <div className="component-card-stage block-card-stage">
                  <RegistryPreview id={entry.id} locale={locale} deferred />
                </div>
                <Link
                  className="component-card-footer"
                  to="/$locale/components/$componentId/"
                  params={{ locale, componentId: entry.id }}
                  aria-label={`${copy.openBlock}: ${text(entry.name, locale)}`}
                >
                  <span>
                    <strong>{text(entry.name, locale)}</strong>
                    <code>{entry.id}</code>
                  </span>
                  <ArrowRightIcon size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        {componentCategories.map((category) => {
          const entries = registryComponents.filter((entry) => entry.category === category.id);
          return (
            <section className="component-directory-section" key={category.id} aria-labelledby={`component-category-${category.id}`}>
              <header className="directory-section-heading">
                <h2 id={`component-category-${category.id}`}>{text(category.name, locale)}</h2>
                <span>{entries.length}</span>
              </header>
              <div className="component-card-grid">
                {entries.map((entry) => (
                  <article className="component-card" key={entry.id}>
                    <div className="component-card-stage">
                      <RegistryPreview id={entry.id} locale={locale} deferred />
                    </div>
                    <Link
                      className="component-card-footer"
                      to="/$locale/components/$componentId/"
                      params={{ locale, componentId: entry.id }}
                      aria-label={`${copy.open}: ${text(entry.name, locale)}`}
                    >
                      <span>
                        <strong>{text(entry.name, locale)}</strong>
                        <code>{entry.id}</code>
                      </span>
                      <ArrowRightIcon size={15} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
