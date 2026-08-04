import { createLazyRoute } from "@tanstack/react-router";
import { MethodPage } from "../pages/MethodPage";
import { useRouteLocale } from "./route-locale";

function MethodRoute() {
  return <MethodPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/method")({
  component: MethodRoute
});
