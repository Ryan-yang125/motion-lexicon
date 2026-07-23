import { CatalogSidebar } from "../components/CatalogSidebar";
import { RecipeWorkspace } from "../components/RecipeWorkspace";
import { Seo } from "../components/Seo";
import { getCategory } from "../data/categories";
import { getMotionCatalogMeta, getRecipe } from "../data/recipes";
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
  const meta = getMotionCatalogMeta(recipe);

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
      <div className="library-doc-layout">
        <CatalogSidebar
          locale={locale}
          activeCategoryId={recipe.categoryId}
          activeRecipeId={recipe.id}
          surfaceType={meta.surfaceType}
        />
        <RecipeWorkspace key={recipe.id} locale={locale} recipe={recipe} mode="recipe" />
      </div>
    </>
  );
}
