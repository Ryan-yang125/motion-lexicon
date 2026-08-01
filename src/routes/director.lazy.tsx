import { createLazyRoute } from "@tanstack/react-router";
import { MotionDirectorPage } from "../pages/MotionDirectorPage";
import { useRouteLocale } from "./route-locale";

function MotionDirectorRoute() {
  return <MotionDirectorPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/director")({
  component: MotionDirectorRoute
});
