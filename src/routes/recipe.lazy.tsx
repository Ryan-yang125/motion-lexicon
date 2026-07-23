import { createLazyRoute, useParams } from "@tanstack/react-router";
import { RecipePage } from "../pages/RecipePage";
import { useRouteLocale } from "./route-locale";

function RecipeRoute() {
  const locale = useRouteLocale();
  const params = useParams({ strict: false }) as {
    categoryId?: string;
    recipeId?: string;
  };
  return (
    <RecipePage
      locale={locale}
      categoryId={params.categoryId ?? ""}
      recipeId={params.recipeId ?? ""}
    />
  );
}

export const Route = createLazyRoute("/$locale/$categoryId/$recipeId")({
  component: RecipeRoute
});
