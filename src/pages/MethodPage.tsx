import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "../components/icons";
import { Seo } from "../components/Seo";
import { release } from "../data/release";
import { pathFor, siteUrl } from "../data/site";
import type { Locale } from "../data/types";
import { breadcrumbStructuredData, publisherStructuredData } from "../lib/structured-data";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";

export function MethodPage({ locale }: { locale: Locale }) {
  const labels = locale === "zh"
    ? {
        eyebrow: "方法与来源",
        title: "Motion Lexicon 如何编写、验证和维护内容",
        description: "了解 Motion Lexicon 的内容方法、开源许可、动效验证方式与维护入口。",
        intro: "Motion Lexicon 把动效基础与真实产品瞬间放在同一套开放内容系统里。每一条内容都应能解释用途、展示状态、给出可复制实现，并保留减弱动效方案。",
        method: "内容方法",
        source: "来源与许可",
        maintenance: "维护与贡献",
        openSource: "在 GitHub 查看源代码",
        guides: "阅读场景指南"
      }
    : {
        eyebrow: "Method and sources",
        title: "How Motion Lexicon is authored, verified, and maintained",
        description: "Learn about Motion Lexicon’s content method, open licenses, motion checks, and maintenance path.",
        intro: "Motion Lexicon keeps motion primitives and real product moments in one open content system. Every entry should explain use, show state, provide copy-ready implementation, and retain a reduced-motion treatment.",
        method: "Content method",
        source: "Sources and licensing",
        maintenance: "Maintenance and contribution",
        openSource: "View source on GitHub",
        guides: "Read scenario guides"
      };
  const path = pathFor(locale, ["method"]);
  const sections = locale === "zh"
    ? [
        ["从真实状态开始", "Product Moments 用开始、进行中、完成和恢复等状态组织一段交互；基础动效则拆出进入、节奏、连续性和反馈等可复用行为。"],
        ["把感觉写成规则", "内容同时记录触发、结果、时长、空间关系与减弱动效，让“有重量”或“更利落”能落到可实现的选择。"],
        ["用可验证的实现交付", "每个公开页面由静态构建生成，包含规范 URL、双语元数据、结构化数据和可复制的 HTML、CSS、JavaScript 或提示词。"]
      ]
    : [
        ["Start from real state", "Product Moments organize an interaction through start, progress, completion, and recovery. Primitives isolate reusable behaviours such as arrival, timing, continuity, and feedback."],
        ["Turn feeling into rules", "Entries record trigger, outcome, timing, spatial relationship, and reduced motion so a feeling such as weight or briskness becomes an implementable choice."],
        ["Deliver verifiable implementation", "Every public page is statically built with a canonical URL, bilingual metadata, structured data, and copy-ready HTML, CSS, JavaScript, or prompt output."]
      ];

  return (
    <>
      <Seo
        locale={locale}
        title={`${labels.eyebrow} | Motion Lexicon`}
        description={labels.description}
        path={path}
        image={`/og-method-${locale}.png`}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: labels.eyebrow, path: ["method"] }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: labels.title,
            description: labels.description,
            url: `${siteUrl}${path}`,
            dateModified: release.updatedAt,
            inLanguage: locale === "zh" ? "zh-CN" : "en",
            publisher: publisherStructuredData
          }
        ]}
      />
      <article className="method-page">
        <header>
          <span>{labels.eyebrow}</span>
          <h1>{labels.title}</h1>
          <p>{labels.intro}</p>
        </header>
        <section aria-labelledby="method-content-title">
          <h2 id="method-content-title">{labels.method}</h2>
          <div>
            {sections.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </section>
        <section aria-labelledby="method-source-title">
          <h2 id="method-source-title">{labels.source}</h2>
          <p>{locale === "zh" ? "站点源代码采用 MIT 许可；原创内容采用 CC BY 4.0；可复制代码片段采用 0BSD。第三方词汇保留其原始来源和许可边界。" : "The site source uses MIT; original content uses CC BY 4.0; copy-ready snippets use 0BSD. Third-party vocabulary retains its original source and licensing boundary."}</p>
        </section>
        <section aria-labelledby="method-maintenance-title">
          <h2 id="method-maintenance-title">{labels.maintenance}</h2>
          <p>{locale === "zh" ? `当前公开版本为 v${release.version}。构建会检查类型、内容完整性、可访问性、动效约束、静态页面和内部链接。` : `The current public release is v${release.version}. Builds check types, content integrity, accessibility, motion constraints, static pages, and internal links.`}</p>
          <div className="method-actions">
            <a href={repositoryUrl} target="_blank" rel="noreferrer">{labels.openSource}<ArrowUpRight aria-hidden="true" size={14} /></a>
            <Link to="/$locale/guides/" params={{ locale }}>{labels.guides}</Link>
          </div>
        </section>
      </article>
    </>
  );
}
