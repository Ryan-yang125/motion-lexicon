import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Hero } from "../components/Hero";
import { MotionThumbnail } from "../components/MotionThumbnail";
import { Seo } from "../components/Seo";
import { CardLink } from "../components/interior/card-link";
import { compactCatalogEntries, getCompactCatalogEntry } from "../data/compact-catalog";
import type { Locale } from "../data/types";
import { pathFor, siteUrl, text } from "../data/site";
import { publisherStructuredData } from "../lib/structured-data";

const featuredIds = ["spring", "morph", "stagger"];

export function LandingPage({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const featured = featuredIds
    .map(getCompactCatalogEntry)
    .filter((recipe): recipe is (typeof compactCatalogEntries)[number] => Boolean(recipe));

  return (
    <>
      <Seo
        locale={locale}
        title={t("seo.homeTitle")}
        description={t("seo.homeDescription")}
        path={pathFor(locale)}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Motion Lexicon",
            description: t("seo.homeDescription"),
            url: `${siteUrl}${pathFor(locale)}`,
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            inLanguage: locale === "zh" ? "zh-CN" : "en",
            isAccessibleForFree: true,
            image: `${siteUrl}/${locale === "zh" ? "og-zh.png" : "og-en.png"}`,
            screenshot: `${siteUrl}/${locale === "zh" ? "og-zh.png" : "og-en.png"}`,
            publisher: publisherStructuredData,
            license: "https://github.com/Ryan-yang125/motion-lexicon/blob/main/LICENSE",
            sameAs: "https://github.com/Ryan-yang125/motion-lexicon",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD"
            }
          }
        ]}
      />

      <Hero locale={locale} />

      <section className="apple-home-library" aria-labelledby="home-library-title">
        <div className="apple-home-library-heading">
          <div>
            <h2 id="home-library-title">
              {locale === "zh" ? "从相近的感觉开始探索。" : "Explore motions that feel close."}
            </h2>
          </div>
          <div>
            <p>
              {locale === "zh"
                ? "预览、调参、复制实现。"
                : "Preview, tune, and copy."}
            </p>
            <Link
              to="/$locale/catalog/"
              params={{ locale }}
              search={{ surface: "components" }}
            >
              {locale === "zh" ? "浏览完整动效库" : "Browse the full library"}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>

        <div className="library-card-grid apple-home-card-grid is-component">
          {featured.map((recipe) => (
            <CardLink
              className="library-card apple-motion-card"
              key={recipe.id}
              to="/$locale/$categoryId/$recipeId/"
              params={{ locale, categoryId: recipe.categoryId, recipeId: recipe.id }}
            >
              <MotionThumbnail locale={locale} recipe={recipe} />
              <div className="library-card-body">
                <div>
                  <h3>{text(recipe.name, locale)}</h3>
                  <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
                </div>
                <p>{text(recipe.shortDescription, locale)}</p>
              </div>
            </CardLink>
          ))}
        </div>
      </section>
    </>
  );
}
