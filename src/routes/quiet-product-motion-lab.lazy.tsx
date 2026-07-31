import { createLazyRoute } from "@tanstack/react-router";
import { QuietProductMotionLabPage } from "../pages/QuietProductMotionLabPage";
import { useRouteLocale } from "./route-locale";

function QuietProductMotionLabRoute() {
  return <QuietProductMotionLabPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/lab/quiet-product-motion")({
  component: QuietProductMotionLabRoute
});
