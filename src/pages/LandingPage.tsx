import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, SlidersHorizontal, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FeatureGrid } from "../components/FeatureGrid";
import { Hero } from "../components/Hero";
import { MotionThumbnail } from "../components/MotionThumbnail";
import { Seo } from "../components/Seo";
import { compactCatalogEntries, getCompactCatalogEntry } from "../data/compact-catalog";
import type { Locale, MotionSurfaceType } from "../data/types";
import { pathFor, siteUrl, text } from "../data/site";

type Surface = "components" | "playgrounds" | "guides";

const featuredIds = [
  "slide-in",
  "stagger",
  "press-tap-feedback",
  "text-morph",
  "spring",
  "page-transition"
];

const surfaces: Array<{
  id: Surface;
  surfaceType: MotionSurfaceType;
  icon: typeof Sparkles;
}> = [
  { id: "components", surfaceType: "component", icon: Sparkles },
  { id: "playgrounds", surfaceType: "playground", icon: SlidersHorizontal },
  { id: "guides", surfaceType: "guide", icon: BookOpen }
];

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

      <section className="library-featured" aria-labelledby="featured-title">
        <div className="library-section-heading">
          <div>
            <span>{t("landing.featuredLabel")}</span>
            <h2 id="featured-title">{t("landing.featuredTitle")}</h2>
          </div>
          <p>{t("landing.featuredCopy")}</p>
        </div>

        <div className="library-card-grid library-home-feature-grid is-component">
          {featured.map((recipe) => (
            <Link
              className="library-card"
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
            </Link>
          ))}
        </div>

        <Link
          className="library-featured-more"
          to="/$locale/catalog/"
          params={{ locale }}
          search={{ surface: "components" }}
        >
          {t("landing.openFullCatalog")}
          <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
        </Link>
      </section>

      <FeatureGrid />

      <section className="library-home-surfaces" aria-labelledby="library-title">
        <div className="library-section-heading">
          <div>
            <span>{t("landing.directoryLabel")}</span>
            <h2 id="library-title">{t("landing.directoryTitle")}</h2>
          </div>
          <p>{t("landing.directoryCopy")}</p>
        </div>

        <div className="library-home-surface-grid">
          {surfaces.map(({ id, surfaceType, icon: Icon }) => {
            const count = compactCatalogEntries.filter(
              (recipe) => recipe.surfaceType === surfaceType
            ).length;
            return (
              <Link
                className={`library-home-surface is-${surfaceType}`}
                key={id}
                to="/$locale/catalog/"
                params={{ locale }}
                search={{ surface: id }}
              >
                <div className="library-home-surface-head">
                  <span><Icon aria-hidden="true" size={17} strokeWidth={1.7} /></span>
                  <small>{count}</small>
                </div>
                <h3>{t(`catalog.surfaces.${surfaceType}.title`)}</h3>
                <p>{t(`catalog.surfaces.${surfaceType}.copy`)}</p>
                <strong>
                  {t(`nav.${id}`)}
                  <ArrowRight aria-hidden="true" size={15} strokeWidth={1.8} />
                </strong>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
