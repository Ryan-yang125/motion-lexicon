import { Link } from "@tanstack/react-router";
import { RecipeWorkspace } from "../components/RecipeWorkspace";
import { Seo } from "../components/Seo";
import { catalogRecipes } from "../data/recipes";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";

export function PrimitivePage({ locale, primitiveId }: { locale: Locale; primitiveId: string }) {
  const recipe = catalogRecipes.find((entry) => entry.id === primitiveId);
  if (!recipe) {
    return (
      <div className="empty-route">
        <h1>{locale === "zh" ? "没有这个原子动效" : "Primitive not found"}</h1>
        <Link to="/$locale/primitives/" params={{ locale }}>{locale === "zh" ? "返回原子动效" : "Back to primitives"}</Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        locale={locale}
        title={`${text(recipe.name, locale)} — Motion Lexicon`}
        description={text(recipe.shortDescription, locale)}
        path={pathFor(locale, ["primitives", recipe.id])}
        image={`/og-primitives-${locale}.png`}
      />
      <div className="primitive-detail-page">
        <RecipeWorkspace key={recipe.id} locale={locale} recipe={recipe} mode="recipe" />
      </div>
    </>
  );
}
