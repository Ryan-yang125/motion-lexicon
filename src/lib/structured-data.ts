import type { Locale } from "../data/types";
import { pathFor, siteUrl } from "../data/site";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";

export const publisherStructuredData = {
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Motion Lexicon",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: `${siteUrl}/icon-512.png`,
    width: 512,
    height: 512
  },
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
