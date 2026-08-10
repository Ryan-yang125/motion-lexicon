import { createLazyRoute, useParams } from "@tanstack/react-router";
import { PrimitivePage } from "../pages/PrimitivePage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/primitives/$primitiveId")({
  component: PrimitiveRoute
});

function PrimitiveRoute() {
  const locale = useRouteLocale();
  const { primitiveId } = useParams({ from: "/$locale/primitives/$primitiveId" });
  return <PrimitivePage locale={locale} primitiveId={primitiveId} />;
}
