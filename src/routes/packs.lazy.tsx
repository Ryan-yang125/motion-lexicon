import { createLazyRoute } from "@tanstack/react-router";
import { MotionPacksPage } from "../pages/MotionPacksPage";
import { useRouteLocale } from "./route-locale";

function MotionPacksRoute() {
  return <MotionPacksPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/packs")({
  component: MotionPacksRoute
});
