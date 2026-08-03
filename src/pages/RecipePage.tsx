import { Link } from "@tanstack/react-router";
import { ArrowRight } from "../components/icons";
import { RecipeWorkspace } from "../components/RecipeWorkspace";
import { Seo } from "../components/Seo";
import { getCategory } from "../data/categories";
import { getMotionPackFoundationLinks } from "../data/motion-packs";
import { getRecipe } from "../data/recipes";
import type { Locale } from "../data/types";
import { pathFor, text } from "../data/site";
import { breadcrumbStructuredData, entryStructuredData } from "../lib/structured-data";
import { CategoryPage } from "./CategoryPage";

type RecipePageProps = {
  locale: Locale;
  categoryId: string;
  recipeId: string;
};

export function RecipePage({ locale, categoryId, recipeId }: RecipePageProps) {
  const recipe = getRecipe(categoryId, recipeId);

  if (!recipe) {
    return <CategoryPage locale={locale} categoryId={categoryId} />;
  }

  const category = getCategory(recipe.categoryId);
  const productMoments = getMotionPackFoundationLinks(recipe.canonicalId);
  const labels = locale === "zh"
    ? {
        eyebrow: "产品瞬间",
        title: "用于这些产品瞬间"
      }
    : {
        eyebrow: "Product moments",
        title: "Used in these product moments"
      };

  return (
    <>
      <Seo
        locale={locale}
        title={text(recipe.seo.title, locale)}
        description={text(recipe.seo.description, locale)}
        path={pathFor(locale, [recipe.categoryId, recipe.id])}
        structuredData={
          category
            ? [
                breadcrumbStructuredData(locale, [
                  { name: "Motion Lexicon", path: [] },
                  { name: text(category.name, locale), path: [category.id] },
                  { name: text(recipe.name, locale), path: [recipe.categoryId, recipe.id] }
                ]),
                entryStructuredData(locale, category, recipe)
              ]
            : []
        }
      />
      <div className="apple-recipe-page">
        <RecipeWorkspace key={recipe.id} locale={locale} recipe={recipe} mode="recipe" />
        {productMoments.length ? (
          <section className="recipe-pack-connections" aria-labelledby="recipe-pack-connections-title">
            <div className="recipe-pack-connections-head">
              <span className="motion-pack-kicker">{labels.eyebrow}</span>
              <h2 id="recipe-pack-connections-title">{labels.title}</h2>
            </div>
            <div className="recipe-pack-connections-grid">
              {productMoments.map(({ pack, foundation }) => (
                <Link
                  className="recipe-pack-connection"
                  data-testid={`foundation-pack-${pack.id}`}
                  key={pack.id}
                  to="/$locale/packs/$packId/"
                  params={{ locale, packId: pack.id }}
                >
                  <span>
                    <small>{foundation.roleLabel[locale]}</small>
                    <strong>{pack.name[locale]}</strong>
                    <em>{foundation.note[locale]}</em>
                  </span>
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
