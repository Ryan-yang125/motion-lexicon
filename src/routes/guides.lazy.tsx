import { createLazyRoute } from "@tanstack/react-router";
import { GuidesPage } from "../pages/GuidesPage";
import { useRouteLocale } from "./route-locale";

function GuidesRoute() {
  return <GuidesPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/guides")({
  component: GuidesRoute
});
