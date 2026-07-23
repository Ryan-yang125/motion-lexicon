import { createLazyRoute } from "@tanstack/react-router";
import { CatalogPage } from "../pages/CatalogPage";
import { useRouteLocale } from "./route-locale";

function CatalogRoute() {
  return <CatalogPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/catalog")({
  component: CatalogRoute
});
