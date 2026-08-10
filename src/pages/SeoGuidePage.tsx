import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "../components/icons";
import { SeoGuideDiagram } from "../components/SeoGuideDiagram";
import { Seo } from "../components/Seo";
import { registryComponents } from "../data/component-registry";
import { getCatalogRecipe } from "../data/recipes";
import { getSeoGuide } from "../data/seo-guides";
import { getSeoGuideArticle } from "../data/seo-guide-articles";
import { pathFor, siteUrl } from "../data/site";
import type { Locale } from "../data/types";
import { breadcrumbStructuredData, publisherStructuredData } from "../lib/structured-data";
import { release } from "../data/release";

export function SeoGuidePage({ locale, guideId }: { locale: Locale; guideId: string }) {
  const guide = getSeoGuide(guideId);
  const labels = locale === "zh"
    ? {
        back: "返回场景指南",
        decision: "先做这个判断",
        steps: "实施路径",
        foundations: "关联动效基础",
        components: "相关组件",
        related: "继续阅读"
      }
    : {
        back: "Back to scenario guides",
        decision: "Make this decision first",
        steps: "Implementation path",
        foundations: "Related motion primitives",
        components: "Related components",
        related: "Continue reading"
      };

  if (!guide) {
    return (
      <section className="library-not-found">
        <span>404</span>
        <h1>{locale === "zh" ? "找不到这篇指南" : "Guide not found"}</h1>
        <Link className="library-button is-primary" to="/$locale/guides/" params={{ locale }} activeOptions={{ exact: true }}>{labels.back}</Link>
      </section>
    );
  }

  const foundations = guide.foundations.flatMap((foundationId) => {
    const recipe = getCatalogRecipe(foundationId);
    return recipe ? [recipe] : [];
  });
  const foundationIds = new Set(foundations.map((recipe) => recipe.id));
  const components = registryComponents
    .filter((component) => component.primitiveIds.some((id) => foundationIds.has(id)))
    .slice(0, 4);
  const related = guide.relatedGuideIds.flatMap((relatedId) => {
    const relatedGuide = getSeoGuide(relatedId);
    return relatedGuide ? [relatedGuide] : [];
  });
  const routePath = pathFor(locale, ["guides", guide.id]);
  const longArticle = getSeoGuideArticle(guide.id);
  const wordCount = longArticle
    ? longArticle.sections
      .flatMap((section) => section.paragraphs)
      .map((paragraph) => paragraph[locale])
      .join(" ")
      .trim()
      .split(locale === "zh" ? "" : /\s+/)
      .filter(Boolean).length
    : undefined;
  const diagramBySection = new Map<number, 0 | 1 | 2>([[0, 0], [2, 1], [4, 2]]);

  return (
    <>
      <Seo
        locale={locale}
        title={`${guide.title[locale]} | Motion Lexicon`}
        description={guide.description[locale]}
        path={routePath}
        image={`/og-guides-${locale}.png`}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: locale === "zh" ? "场景指南" : "Scenario guides", path: ["guides"] },
            { name: guide.title[locale], path: ["guides", guide.id] }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: guide.title[locale],
            description: guide.description[locale],
            url: `${siteUrl}${routePath}`,
            mainEntityOfPage: `${siteUrl}${routePath}`,
            articleSection: locale === "zh" ? "场景指南" : "Scenario guides",
            datePublished: release.publishedAt,
            dateModified: release.updatedAt,
            inLanguage: locale === "zh" ? "zh-CN" : "en",
            isAccessibleForFree: true,
            ...(wordCount ? { wordCount } : {}),
            license: "https://creativecommons.org/licenses/by/4.0/",
            author: publisherStructuredData,
            publisher: publisherStructuredData
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: guide.title[locale],
            description: guide.description[locale],
            step: guide.steps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title[locale],
              text: step.copy[locale]
            }))
          }
        ]}
      />
      <article className="seo-guide-page">
        <Link className="motion-pack-back-link" to="/$locale/guides/" params={{ locale }} activeOptions={{ exact: true }}>
          <ArrowLeft aria-hidden="true" size={14} />
          {labels.back}
        </Link>
        <header>
          <span>{guide.eyebrow[locale]}</span>
          <h1>{guide.title[locale]}</h1>
          <p>{guide.intro[locale]}</p>
          {longArticle ? <p className="seo-guide-standfirst">{longArticle.standfirst[locale]}</p> : null}
        </header>
        <section className="seo-guide-decision" aria-labelledby="guide-decision-title">
          <span>{labels.decision}</span>
          <h2 id="guide-decision-title">{guide.decision[locale]}</h2>
        </section>
        <section className="seo-guide-steps" aria-labelledby="guide-steps-title">
          <h2 id="guide-steps-title">{labels.steps}</h2>
          <ol>
            {guide.steps.map((step, index) => (
              <li key={step.title[locale]}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{step.title[locale]}</h3><p>{step.copy[locale]}</p></div>
              </li>
            ))}
          </ol>
        </section>
        {longArticle ? (
          <div className="seo-guide-article" aria-label={locale === "zh" ? "完整场景文章" : "Full scenario article"}>
            {longArticle.sections.map((section, index) => {
              const diagramIndex = diagramBySection.get(index);
              return (
                <section key={section.id} aria-labelledby={`guide-${guide.id}-${section.id}`}>
                  <h2 id={`guide-${guide.id}-${section.id}`}>{section.title[locale]}</h2>
                  <div className="seo-guide-article-copy">
                    {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph[locale]}</p>)}
                  </div>
                  {diagramIndex === undefined ? null : <SeoGuideDiagram diagram={longArticle.diagrams[diagramIndex]} locale={locale} />}
                </section>
              );
            })}
            <section className="seo-guide-checklist" aria-labelledby={`guide-${guide.id}-checklist`}>
              <header>
                <h2 id={`guide-${guide.id}-checklist`}>{longArticle.checklistTitle[locale]}</h2>
              </header>
              <ul>
                {longArticle.checklist.map((item) => (
                  <li key={item.id}>
                    <span>
                      <strong>{item.label[locale]}</strong>
                      <small>{item.detail[locale]}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="seo-guide-case-study" aria-labelledby={`guide-${guide.id}-case-study`}>
              <header>
                <h2 id={`guide-${guide.id}-case-study`}>{longArticle.caseStudy.title[locale]}</h2>
                <p>{longArticle.caseStudy.context[locale]}</p>
              </header>
              <pre><code>{longArticle.caseStudy.code}</code></pre>
              <p>{longArticle.caseStudy.explanation[locale]}</p>
            </section>
          </div>
        ) : null}
        <section className="seo-guide-links" aria-labelledby="guide-foundations-title">
          <h2 id="guide-foundations-title">{labels.foundations}</h2>
          <div>
            {foundations.map((recipe) => (
              <Link key={recipe.id} to="/$locale/primitives/$primitiveId/" params={{ locale, primitiveId: recipe.id }} activeOptions={{ exact: true }}>
                <span><strong>{recipe.name[locale]}</strong><small>{recipe.shortDescription[locale]}</small></span>
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            ))}
          </div>
        </section>
        <section className="seo-guide-links" aria-labelledby="guide-components-title">
          <h2 id="guide-components-title">{labels.components}</h2>
          <div>
            {components.map((component) => (
              <Link key={component.id} to="/$locale/components/$componentId/" params={{ locale, componentId: component.id }} activeOptions={{ exact: true }}>
                <span><strong>{component.name[locale]}</strong><small>{component.description[locale]}</small></span>
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            ))}
          </div>
        </section>
        <section className="seo-guide-related" aria-labelledby="guide-related-title">
          <h2 id="guide-related-title">{labels.related}</h2>
          <div>
            {related.map((relatedGuide) => (
              <Link key={relatedGuide.id} to="/$locale/guides/$guideId/" params={{ locale, guideId: relatedGuide.id }} activeOptions={{ exact: true }}>
                {relatedGuide.title[locale]}
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
