import { createLazyRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/HomePage";
import { useRouteLocale } from "./route-locale";

function LocaleHomeRoute() {
  return <HomePage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale")({
  component: LocaleHomeRoute
});
