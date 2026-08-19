import { createLazyRoute, useParams } from "@tanstack/react-router";
import { ComponentPage } from "../pages/ComponentPage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/components/$componentId")({
  component: ComponentRoute
});

function ComponentRoute() {
  const locale = useRouteLocale();
  const { componentId } = useParams({ from: "/$locale/components/$componentId" });
  return <ComponentPage locale={locale} componentId={componentId} />;
}
