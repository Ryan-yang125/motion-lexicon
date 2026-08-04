import { Link } from "@tanstack/react-router";
import { ArrowRight } from "../components/icons";
import { Seo } from "../components/Seo";
import { seoGuides } from "../data/seo-guides";
import { pathFor, siteUrl } from "../data/site";
import type { Locale } from "../data/types";
import { breadcrumbStructuredData } from "../lib/structured-data";

export function GuidesPage({ locale }: { locale: Locale }) {
  const labels = locale === "zh"
    ? {
        eyebrow: "场景指南",
        title: "从真实产品问题开始设计动效",
        copy: "八篇双语图文长文，把产品状态、动效基础和可复制的 Product Moments 连成一条可执行的路径。",
        format: "1000+ 字 · 3 张图解 · 清单与代码",
        open: "阅读完整指南"
      }
    : {
        eyebrow: "Scenario guides",
        title: "Design motion from real product questions",
        copy: "Eight illustrated, bilingual field guides connect product state, motion primitives, and copy-ready Product Moments into a practical path.",
        format: "Long read · 3 diagrams · checklist and code",
        open: "Read full guide"
      };
  const routePath = pathFor(locale, ["guides"]);

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh" ? "产品动效场景指南 | Motion Lexicon" : "Product motion scenario guides | Motion Lexicon"}
        description={labels.copy}
        path={routePath}
        image={`/og-guides-${locale}.png`}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: labels.eyebrow, path: ["guides"] }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: labels.title,
            numberOfItems: seoGuides.length,
            itemListElement: seoGuides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.title[locale],
              url: `${siteUrl}${pathFor(locale, ["guides", guide.id])}`
            }))
          }
        ]}
      />
      <div className="seo-guides-page">
        <header className="seo-guides-hero">
          <span>{labels.eyebrow}</span>
          <h1>{labels.title}</h1>
          <p>{labels.copy}</p>
        </header>
        <div className="seo-guide-grid">
          {seoGuides.map((guide) => (
            <article key={guide.id}>
              <span>{guide.eyebrow[locale]}</span>
              <h2>{guide.title[locale]}</h2>
              <p>{guide.description[locale]}</p>
              <small>{labels.format}</small>
              <Link to="/$locale/guides/$guideId/" params={{ locale, guideId: guide.id }}>
                {labels.open}
                <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
