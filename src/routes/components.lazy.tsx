import { createLazyRoute } from "@tanstack/react-router";
import { ComponentsPage } from "../pages/ComponentsPage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/components")({
  component: ComponentsRoute
});

function ComponentsRoute() {
  return <ComponentsPage locale={useRouteLocale()} />;
}
