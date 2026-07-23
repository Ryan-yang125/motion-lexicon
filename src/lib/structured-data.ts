import type { Category, Locale, MotionRecipe } from "../data/types";
import { getGlossaryTermsForCanonical, type GlossaryTerm } from "../data/glossary";
import { pathFor, siteUrl, text } from "../data/site";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const contentLicenseUrl = "https://creativecommons.org/licenses/by/4.0/";

export const publisherStructuredData = {
  "@type": "Organization",
  name: "Motion Lexicon",
  url: siteUrl,
  sameAs: [repositoryUrl]
};

function routeUrl(locale: Locale, parts: string[] = []) {
  return `${siteUrl}${pathFor(locale, parts)}`;
}

export function breadcrumbStructuredData(
  locale: Locale,
  items: Array<{ name: string; path: string[] }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: routeUrl(locale, item.path)
    }))
  };
}

export function itemListStructuredData(
  locale: Locale,
  name: string,
  entries: MotionRecipe[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: text(entry.name, locale),
      url: routeUrl(locale, [entry.categoryId, entry.id])
    }))
  };
}

export function entryStructuredData(
  locale: Locale,
  category: Category,
  entry: MotionRecipe
) {
  const url = routeUrl(locale, [entry.categoryId, entry.id]);
  const vocabularyUrl = routeUrl(locale, ["vocabulary"]);
  const glossaryTerms = getGlossaryTermsForCanonical(entry.canonicalId);
  const canonicalTerm = glossaryTerms.find((term) => term.canonical) ?? glossaryTerms[0];

  function definedTerm(term: GlossaryTerm) {
    return {
      "@type": "DefinedTerm",
      termCode: term.id,
      name: text(term.name, locale),
      alternateName: locale === "zh" ? term.name.en : term.name.zh,
      description: text(term.definition, locale),
      inDefinedTermSet: vocabularyUrl,
      url: `${vocabularyUrl}#term-${term.id}`,
      ...(term.distinction
        ? { disambiguatingDescription: text(term.distinction, locale) }
        : {})
    };
  }

  const common = {
    "@context": "https://schema.org",
    name: text(entry.name, locale),
    description: text(entry.seo.description, locale),
    url,
    isAccessibleForFree: true,
    license: contentLicenseUrl,
    author: publisherStructuredData,
    publisher: publisherStructuredData,
    keywords: [
      text(category.name, locale),
      ...glossaryTerms.flatMap((term) => [term.name.en, term.name.zh]),
      entry.previewKind,
      entry.entryType
    ].join(", ")
  };

  return {
    ...common,
    "@type": "TechArticle",
    headline: text(entry.name, locale),
    mainEntityOfPage: url,
    articleSection: text(category.name, locale),
    learningResourceType: entry.surfaceType,
    ...(canonicalTerm ? { about: definedTerm(canonicalTerm) } : {}),
    ...(glossaryTerms.length > 1
      ? { mentions: glossaryTerms.filter((term) => term.alias).map(definedTerm) }
      : {})
  };
}
