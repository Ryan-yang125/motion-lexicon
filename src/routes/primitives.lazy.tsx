import { createLazyRoute } from "@tanstack/react-router";
import { PrimitivesPage } from "../pages/PrimitivesPage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/primitives")({
  component: PrimitivesRoute
});

function PrimitivesRoute() {
  return <PrimitivesPage locale={useRouteLocale()} />;
}
