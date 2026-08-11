import * as helmetAsync from "react-helmet-async";
import { htmlLang } from "../i18n/resources";
import { defaultLocale, pathFor, siteUrl } from "../data/site";
import { release } from "../data/release";
import type { Locale } from "../data/types";

type SeoProps = {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
  ogType?: "website" | "article";
  structuredData?: Array<Record<string, unknown>>;
};

const helmetModule = helmetAsync as typeof helmetAsync & Record<string, typeof helmetAsync | undefined>;
const { Helmet } = (helmetModule["default"] ?? helmetAsync) as typeof helmetAsync;

export function Seo({
  locale,
  title,
  description,
  path,
  noindex = false,
  image,
  ogType = "website",
  structuredData = []
}: SeoProps) {
  const canonical = `${siteUrl}${path}`;
  const imagePath = image ?? (locale === "zh" ? "/og-zh.png" : "/og-en.png");
  const imageUrl = imagePath.startsWith("http") ? imagePath : `${siteUrl}${imagePath}`;
  const pathWithoutLocale = path.split("/").filter(Boolean).slice(1);
  const alternateZh = `${siteUrl}${pathFor("zh", pathWithoutLocale)}`;
  const alternateEn = `${siteUrl}${pathFor("en", pathWithoutLocale)}`;
  const defaultAlternate = defaultLocale === "zh" ? alternateZh : alternateEn;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const isLocalizedHome = pathWithoutLocale.length === 0;
  const publisher = {
    "@type": "Organization",
    "@id": organizationId,
    name: "Motion Lexicon",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/icon-512.png`,
      width: 512,
      height: 512
    },
    sameAs: ["https://github.com/Ryan-yang125/motion-lexicon"]
  };
  const website = isLocalizedHome ? {
    "@type": "WebSite",
    "@id": websiteId,
    name: "Motion Lexicon",
    url: siteUrl,
    publisher: { "@id": organizationId },
    inLanguage: ["zh-CN", "en"],
    isAccessibleForFree: true
  } : { "@id": websiteId };
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical,
    dateModified: release.updatedAt,
    inLanguage: htmlLang(locale),
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630
    },
    publisher,
    isPartOf: website
  };
  const serializedStructuredData = [pageStructuredData, ...structuredData].map((item) =>
    JSON.stringify(item).replace(/</g, "\\u003c")
  );

  return (
    <Helmet htmlAttributes={{ lang: htmlLang(locale) }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"}
      />
      <link rel="canonical" href={canonical} />
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      <link rel="alternate" hrefLang="zh-CN" href={alternateZh} />
      <link rel="alternate" hrefLang="en" href={alternateEn} />
      <link rel="alternate" hrefLang="x-default" href={defaultAlternate} />
      <link rel="alternate" type="text/plain" href={`${siteUrl}/llms.txt`} title="Motion Lexicon for agents" />
      <link rel="alternate" type="application/json" href={`${siteUrl}/data/v4/motion-grammar.json`} title="Motion Lexicon Motion Grammar" />
      <link rel="alternate" type="application/json" href={`${siteUrl}/r/registry.json`} title="Motion Lexicon component registry" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Motion Lexicon" />
      <meta property="og:locale" content={locale === "zh" ? "zh_CN" : "en_US"} />
      <meta property="og:locale:alternate" content={locale === "zh" ? "en_US" : "zh_CN"} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />
      {serializedStructuredData.map((item, index) => (
        <script key={`${path}-schema-${index}`} type="application/ld+json">
          {item}
        </script>
      ))}
    </Helmet>
  );
}
