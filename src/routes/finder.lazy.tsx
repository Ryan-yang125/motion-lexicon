import { createLazyRoute } from "@tanstack/react-router";
import { FinderPage } from "../pages/FinderPage";
import { useRouteLocale } from "./route-locale";

function FinderRoute() {
  return <FinderPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/finder")({
  component: FinderRoute
});
