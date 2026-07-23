import { createLazyRoute, useParams } from "@tanstack/react-router";
import { CategoryPage } from "../pages/CategoryPage";
import { useRouteLocale } from "./route-locale";

function CategoryRoute() {
  const locale = useRouteLocale();
  const params = useParams({ strict: false }) as { categoryId?: string };
  return <CategoryPage locale={locale} categoryId={params.categoryId ?? ""} />;
}

export const Route = createLazyRoute("/$locale/$categoryId")({
  component: CategoryRoute
});
