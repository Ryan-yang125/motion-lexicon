import { ArrowUpRight } from "../components/icons";
import { useDeferredValue, useMemo, useState } from "react";
import { Seo } from "../components/Seo";
import { ExpandingSearch } from "../components/interior/expanding-search";
import { categories } from "../data/categories";
import {
  getGlossaryTerm,
  glossaryTerms,
  type GlossaryTerm
} from "../data/glossary";
import { aliasMetadata } from "../data/motion-catalog";
import { pathFor, siteUrl, text } from "../data/site";
import type { Locale } from "../data/types";
import { breadcrumbStructuredData, publisherStructuredData } from "../lib/structured-data";

const copy = {
  zh: {
    eyebrow: "91 个动效术语",
    title: "动画词汇表",
    intro: "中英双语动效术语，包含定义、辨析和对应工作区。",
    seoDescription: "Motion Lexicon 提供 91 个中英双语动效术语，包含英文定义、中文翻译、近义词辨析和对应工作区。",
    searchLabel: "搜索动画词汇",
    searchPlaceholder: "搜索 Pop in、共享元素、velocity…",
    count: (visible: number) => `显示 ${visible} / ${glossaryTerms.length} 个术语`,
    sourceDefinition: "英文定义",
    translation: "中文翻译",
    distinction: "辨析",
    canonical: "核心术语",
    alias: "相关术语",
    open: "查看工作区",
    empty: "没有匹配词条，换一个名称、定义或用途继续搜索。"
  },
  en: {
    eyebrow: "91 motion terms",
    title: "Animation vocabulary",
    intro: "Bilingual motion terms with definitions, distinctions, and corresponding workspaces.",
    seoDescription: "Explore 91 bilingual Motion Lexicon terms with English definitions, Chinese translations, close-term distinctions, and corresponding workspaces.",
    searchLabel: "Search animation vocabulary",
    searchPlaceholder: "Search Pop in, shared element, velocity…",
    count: (visible: number) => `Showing ${visible} of ${glossaryTerms.length} terms`,
    sourceDefinition: "English definition",
    translation: "Chinese translation",
    distinction: "Distinction",
    canonical: "Canonical term",
    alias: "Related term",
    open: "Open workspace",
    empty: "No term matches this query. Try a name, definition, or use case."
  }
} as const;

const aliasMetadataById = new Map(
  aliasMetadata.map((entry) => [entry.entryId, entry])
);

function termSearchText(term: GlossaryTerm) {
  return [
    term.id,
    term.section,
    term.name.zh,
    term.name.en,
    term.definition.zh,
    term.definition.en,
    term.distinction?.zh,
    term.distinction?.en
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

export function VocabularyPage({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();
  const visibleTerms = useMemo(
    () => glossaryTerms.filter((term) => !normalizedQuery || termSearchText(term).includes(normalizedQuery)),
    [normalizedQuery]
  );
  const groupedTerms = categories
    .map((category) => ({
      category,
      terms: visibleTerms.filter((term) => term.categoryId === category.id)
    }))
    .filter((group) => group.terms.length > 0);
  const routePath = pathFor(locale, ["vocabulary"]);
  const termSetUrl = `${siteUrl}${routePath}`;

  return (
    <>
      <Seo
        locale={locale}
        title={locale === "zh" ? "动画词汇表｜Motion Lexicon" : "Animation vocabulary | Motion Lexicon"}
        description={labels.seoDescription}
        path={routePath}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: labels.title, path: ["vocabulary"] }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: labels.title,
            description: labels.seoDescription,
            url: termSetUrl,
            inLanguage: locale === "zh" ? "zh-CN" : "en",
            isAccessibleForFree: true,
            license: "https://creativecommons.org/licenses/by/4.0/",
            publisher: publisherStructuredData,
            hasDefinedTerm: glossaryTerms.map((term) => {
              const canonical = getGlossaryTerm(term.canonicalId);
              return {
                "@type": "DefinedTerm",
                termCode: term.id,
                name: text(term.name, locale),
                alternateName: locale === "zh" ? term.name.en : term.name.zh,
                description: text(term.definition, locale),
                inLanguage: locale === "zh" ? "zh-CN" : "en",
                inDefinedTermSet: termSetUrl,
                url: `${termSetUrl}#term-${term.id}`,
                ...(term.distinction
                  ? { disambiguatingDescription: text(term.distinction, locale) }
                  : {}),
                ...(canonical
                  ? {
                      subjectOf: {
                        "@type": "WebPage",
                        url: `${siteUrl}${pathFor(locale, [canonical.categoryId, canonical.id])}`
                      }
                    }
                  : {})
              };
            })
          }
        ]}
      />

      <section className="vocabulary-page">
        <header className="vocabulary-hero">
          <span>{labels.eyebrow}</span>
          <h1>{labels.title}</h1>
          <p>{labels.intro}</p>
        </header>

        <div className="vocabulary-toolbar">
          <ExpandingSearch
            id="vocabulary-search"
            value={query}
            onChange={setQuery}
            open
            collapseOnBlur={false}
            align="left"
            label={labels.searchLabel}
            clearLabel={locale === "zh" ? "清除搜索" : "Clear search"}
            placeholder={labels.searchPlaceholder}
            resultCount={visibleTerms.length}
            controls="vocabulary-results"
            describedBy="vocabulary-result-count"
            className="interior-vocabulary-search"
          />
          <span id="vocabulary-result-count" className="sr-only" role="status" aria-live="polite">
            {labels.count(visibleTerms.length)}
          </span>
        </div>

        {groupedTerms.length > 0 ? (
          <nav className="vocabulary-index" aria-label={labels.title}>
            {groupedTerms.map(({ category, terms }) => (
              <a key={category.id} href={`#vocabulary-${category.id}`}>
                {text(category.name, locale)}
                <small>{terms.length}</small>
              </a>
            ))}
          </nav>
        ) : null}

        {groupedTerms.length > 0 ? (
          <div className="vocabulary-groups" id="vocabulary-results">
            {groupedTerms.map(({ category, terms }) => (
              <section key={category.id} id={`vocabulary-${category.id}`} className="vocabulary-group">
                <header>
                  <div>
                    <h2>{text(category.name, locale)}</h2>
                    <p>{text(category.description, locale)}</p>
                  </div>
                  <small>{terms.length}</small>
                </header>
                <div className="vocabulary-term-list">
                  {terms.map((term) => {
                    const canonical = getGlossaryTerm(term.canonicalId);
                    if (!canonical) return null;
                    const alias = aliasMetadataById.get(term.id);
                    const focus = new URLSearchParams(alias?.query ?? "");
                    focus.set("term", term.id);
                    const href = `${pathFor(locale, [canonical.categoryId, canonical.id])}?${focus.toString()}#workspace-term-${term.id}`;
                    return (
                      <article key={term.id} id={`term-${term.id}`} className={term.canonical ? "is-canonical" : undefined}>
                        <div className="vocabulary-term-heading">
                          <div>
                            <span>{term.canonical ? labels.canonical : labels.alias}</span>
                            <h3>{text(term.name, locale)}</h3>
                            <small lang={locale === "zh" ? "en" : "zh-CN"}>
                              {locale === "zh" ? term.name.en : term.name.zh}
                            </small>
                          </div>
                          <code>{term.id}</code>
                        </div>
                        <div className="vocabulary-definition">
                          <span>{labels.sourceDefinition}</span>
                          <p lang="en">{term.definition.en}</p>
                        </div>
                        <div className="vocabulary-translation">
                          <span>{labels.translation}</span>
                          <p lang="zh-CN">{term.definition.zh}</p>
                        </div>
                        {term.distinction ? (
                          <div className="vocabulary-distinction">
                            <span>{labels.distinction}</span>
                            <p>{text(term.distinction, locale)}</p>
                          </div>
                        ) : null}
                        <a
                          className="vocabulary-open-link"
                          href={href}
                          aria-label={`${labels.open}: ${text(term.name, locale)}`}
                        >
                          {labels.open}
                          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} />
                        </a>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="vocabulary-empty">{labels.empty}</p>
        )}
      </section>
    </>
  );
}
