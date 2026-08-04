import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen } from "../components/icons";
import { useTranslation } from "react-i18next";
import { MotionThumbnail } from "../components/MotionThumbnail";
import { Seo } from "../components/Seo";
import { CardLink } from "../components/interior/card-link";
import { getCategory } from "../data/categories";
import { getCategorySeoHub } from "../data/category-seo";
import { getMotionPack } from "../data/motion-packs";
import { getCatalogRecipesByCategory, getMotionCatalogMeta } from "../data/recipes";
import type { Locale, MotionSurfaceType } from "../data/types";
import { pathFor, text } from "../data/site";
import { breadcrumbStructuredData, faqPageStructuredData, itemListStructuredData } from "../lib/structured-data";

type CategoryPageProps = {
  locale: Locale;
  categoryId: string;
};

const surfaceOrder: MotionSurfaceType[] = ["component", "playground", "guide"];

export function CategoryPage({ locale, categoryId }: CategoryPageProps) {
  const { t } = useTranslation();
  const category = getCategory(categoryId);

  if (!category) {
    return <NotFoundContent locale={locale} />;
  }

  const categoryRecipes = getCatalogRecipesByCategory(categoryId);
  const hub = getCategorySeoHub(categoryId);
  const featuredPacks = (hub?.featuredPackIds ?? [])
    .flatMap((packId) => {
      const pack = getMotionPack(packId);
      return pack ? [pack] : [];
    });
  const labels = locale === "zh"
    ? {
        framework: "如何选择",
        pitfalls: "常见误区",
        packs: "相关产品瞬间",
        faq: "常见问题"
      }
    : {
        framework: "How to choose",
        pitfalls: "Common pitfalls",
        packs: "Related product moments",
        faq: "Frequently asked questions"
      };
  const grouped = surfaceOrder
    .map((surfaceType) => ({
      surfaceType,
      entries: categoryRecipes.filter((recipe) => getMotionCatalogMeta(recipe).surfaceType === surfaceType)
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <>
      <Seo
        locale={locale}
        title={`${text(hub?.title ?? category.name, locale)} | Motion Lexicon`}
        description={text(hub?.description ?? category.description, locale)}
        path={pathFor(locale, [category.id])}
        image={`/og-primitives-${locale}.png`}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: text(hub?.title ?? category.name, locale), path: [category.id] }
          ]),
          itemListStructuredData(locale, text(category.name, locale), categoryRecipes),
          ...(hub ? [faqPageStructuredData(locale, hub.faqs)] : [])
        ]}
      />

      <div className="library-category-layout apple-category-page">
        <div className="library-category-main">
          <nav className="library-breadcrumbs" aria-label={t("workspace.breadcrumbLabel")}>
            <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: "components" }}>
              <ArrowLeft aria-hidden="true" size={14} />
              {t("catalog.backToLibrary")}
            </Link>
          </nav>

          <header className="library-category-header">
            <span>{text(category.eyebrow, locale)}</span>
            <h1>{text(hub?.title ?? category.name, locale)}</h1>
            <p>{text(hub?.description ?? category.description, locale)}</p>
          </header>

          {hub ? (
            <section className="library-category-editorial" aria-label={text(hub.title, locale)}>
              <p className="library-category-intro">{text(hub.intro, locale)}</p>
              <div className="library-category-editorial-grid">
                <section aria-labelledby="category-framework-title">
                  <h2 id="category-framework-title">{labels.framework}</h2>
                  <ol className="library-category-framework">
                    {hub.framework.map((item) => (
                      <li key={text(item.label, locale)}>
                        <strong>{text(item.label, locale)}</strong>
                        <p>{text(item.copy, locale)}</p>
                      </li>
                    ))}
                  </ol>
                </section>
                <section aria-labelledby="category-pitfalls-title">
                  <h2 id="category-pitfalls-title">{labels.pitfalls}</h2>
                  <ul className="library-category-pitfalls">
                    {hub.pitfalls.map((pitfall) => <li key={text(pitfall, locale)}>{text(pitfall, locale)}</li>)}
                  </ul>
                </section>
              </div>

              {featuredPacks.length ? (
                <section className="library-category-packs" aria-labelledby="category-packs-title">
                  <div className="library-section-heading is-row">
                    <h2 id="category-packs-title">{labels.packs}</h2>
                  </div>
                  <div className="library-category-pack-links">
                    {featuredPacks.map((pack) => (
                      <Link
                        key={pack.id}
                        to="/$locale/packs/$packId/"
                        params={{ locale, packId: pack.id }}
                      >
                        <span>
                          <strong>{pack.name[locale]}</strong>
                          <small>{pack.shortDescription[locale]}</small>
                        </span>
                        <ArrowRight aria-hidden="true" size={15} />
                      </Link>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="library-category-faq" aria-labelledby="category-faq-title">
                <h2 id="category-faq-title">{labels.faq}</h2>
                <div>
                  {hub.faqs.map((faq) => (
                    <details key={text(faq.question, locale)}>
                      <summary>{text(faq.question, locale)}</summary>
                      <p>{text(faq.answer, locale)}</p>
                    </details>
                  ))}
                </div>
              </section>
            </section>
          ) : null}

          {grouped.length > 0 ? grouped.map(({ surfaceType, entries }) => (
            <section className="library-category-group" key={surfaceType} aria-labelledby={`${surfaceType}-title`}>
              <div className="library-section-heading is-row">
                <div>
                  <h2 id={`${surfaceType}-title`}>{t(`catalog.surfaces.${surfaceType}.title`)}</h2>
                </div>
                <small>{entries.length}</small>
              </div>
              <div className={`library-card-grid is-${surfaceType}`}>
                {entries.map((recipe) => (
                  <CardLink
                    className="library-card"
                    key={recipe.id}
                    to="/$locale/$categoryId/$recipeId/"
                    params={{ locale, categoryId: recipe.categoryId, recipeId: recipe.id }}
                  >
                    {surfaceType === "guide" ? (
                      <div className="library-guide-art" aria-hidden="true">
                        <BookOpen size={24} strokeWidth={1.5} />
                        <span>{recipe.source.term}</span>
                      </div>
                    ) : <MotionThumbnail locale={locale} recipe={recipe} />}
                    <div className="library-card-body">
                      <div>
                        <h3>{text(recipe.name, locale)}</h3>
                        <ArrowRight aria-hidden="true" size={15} />
                      </div>
                      <p>{text(recipe.shortDescription, locale)}</p>
                    </div>
                  </CardLink>
                ))}
              </div>
            </section>
          )) : (
            <section className="library-empty-state">
              <h2>{t("common.noRecipesTitle")}</h2>
              <p>{t("common.noRecipesBody")}</p>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function NotFoundContent({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  return (
    <section className="library-not-found">
      <span>404</span>
      <h1>{t("catalog.notFoundTitle")}</h1>
      <p>{t("catalog.notFoundCopy")}</p>
      <Link className="library-button is-primary" to="/$locale/catalog/" params={{ locale }} search={{ surface: "components" }}>
        {t("catalog.backToLibrary")}
      </Link>
    </section>
  );
}
