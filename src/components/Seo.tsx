import * as helmetAsync from "react-helmet-async";
import { htmlLang } from "../i18n/resources";
import { defaultLocale, pathFor, siteUrl } from "../data/site";
import type { Locale } from "../data/types";

type SeoProps = {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
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
  structuredData = []
}: SeoProps) {
  const canonical = `${siteUrl}${path}`;
  const imagePath = image ?? (locale === "zh" ? "/og-zh.png" : "/og-en.png");
  const imageUrl = imagePath.startsWith("http") ? imagePath : `${siteUrl}${imagePath}`;
  const pathWithoutLocale = path.split("/").filter(Boolean).slice(1);
  const alternateZh = `${siteUrl}${pathFor("zh", pathWithoutLocale)}`;
  const alternateEn = `${siteUrl}${pathFor("en", pathWithoutLocale)}`;
  const defaultAlternate = defaultLocale === "zh" ? alternateZh : alternateEn;
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: canonical,
    inLanguage: htmlLang(locale),
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: {
      "@type": "Organization",
      name: "Motion Lexicon",
      url: siteUrl,
      sameAs: ["https://github.com/Ryan-yang125/motion-lexicon"]
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Motion Lexicon",
      url: `${siteUrl}${pathFor(defaultLocale)}`,
      isAccessibleForFree: true
    }
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
      <link rel="alternate" type="application/json" href={`${siteUrl}/data/v1/catalog.json`} title="Motion Lexicon catalog data" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Motion Lexicon" />
      <meta property="og:locale" content={locale === "zh" ? "zh_CN" : "en_US"} />
      <meta property="og:locale:alternate" content={locale === "zh" ? "en_US" : "zh_CN"} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} — Motion Lexicon`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${title} — Motion Lexicon`} />
      {serializedStructuredData.map((item, index) => (
        <script key={`${path}-schema-${index}`} type="application/ld+json">
          {item}
        </script>
      ))}
    </Helmet>
  );
}
