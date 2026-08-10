import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "../components/icons";
import { Seo } from "../components/Seo";
import { componentCategories, registryComponents } from "../data/component-registry";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { RegistryPreview } from "../registry/preview-map";

export function ComponentsPage({ locale }: { locale: Locale }) {
  const copy = locale === "zh"
    ? {
        title: "可直接复制的 React 动效组件",
        description: "48 个适用于真实产品与网站界面的 React 动效组件，覆盖 Motion、GSAP、Three.js 与 WebGL。",
        count: "48 个组件",
        open: "查看组件"
      }
    : {
        title: "Copy-ready React motion components",
        description: "48 React motion components for real products and websites, spanning Motion, GSAP, Three.js, and WebGL.",
        count: "48 components",
        open: "Open component"
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
                      <RegistryPreview id={entry.id} deferred />
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
