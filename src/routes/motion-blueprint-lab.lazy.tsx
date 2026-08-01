import { createLazyRoute } from "@tanstack/react-router";
import { MotionBlueprintLabPage } from "../pages/MotionBlueprintLabPage";
import { useRouteLocale } from "./route-locale";

function MotionBlueprintLabRoute() {
  return <MotionBlueprintLabPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/lab/motion-blueprints")({
  component: MotionBlueprintLabRoute
});
