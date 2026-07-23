import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CatalogSidebar } from "../components/CatalogSidebar";
import { MotionThumbnail } from "../components/MotionThumbnail";
import { Seo } from "../components/Seo";
import { getCategory } from "../data/categories";
import { getCatalogRecipesByCategory, getMotionCatalogMeta } from "../data/recipes";
import type { Locale, MotionSurfaceType } from "../data/types";
import { pathFor, text } from "../data/site";
import { breadcrumbStructuredData, itemListStructuredData } from "../lib/structured-data";

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
        title={`${text(category.name, locale)} | Motion Lexicon`}
        description={text(category.description, locale)}
        path={pathFor(locale, [category.id])}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: text(category.name, locale), path: [category.id] }
          ]),
          itemListStructuredData(locale, text(category.name, locale), categoryRecipes)
        ]}
      />

      <div className="library-category-layout">
        <CatalogSidebar locale={locale} activeCategoryId={category.id} compact />
        <div className="library-category-main">
          <nav className="library-breadcrumbs" aria-label={t("workspace.breadcrumbLabel")}>
            <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: "components" }}>
              <ArrowLeft aria-hidden="true" size={14} />
              {t("catalog.backToLibrary")}
            </Link>
          </nav>

          <header className="library-category-header">
            <span>{text(category.eyebrow, locale)}</span>
            <h1>{text(category.name, locale)}</h1>
            <p>{text(category.description, locale)}</p>
            <div className="library-category-stats">
              <strong>{categoryRecipes.length}</strong>
              <span>{t("catalog.canonicalEntries")}</span>
            </div>
          </header>

          {grouped.length > 0 ? grouped.map(({ surfaceType, entries }) => (
            <section className="library-category-group" key={surfaceType} aria-labelledby={`${surfaceType}-title`}>
              <div className="library-section-heading is-row">
                <div>
                  <span>{t(`catalog.surfaces.${surfaceType}.label`)}</span>
                  <h2 id={`${surfaceType}-title`}>{t(`catalog.surfaces.${surfaceType}.title`)}</h2>
                </div>
                <small>{entries.length}</small>
              </div>
              <div className={`library-card-grid is-${surfaceType}`}>
                {entries.map((recipe) => (
                  <Link
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
                  </Link>
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
