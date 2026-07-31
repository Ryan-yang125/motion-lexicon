import { createLazyRoute, useParams } from "@tanstack/react-router";
import { MotionPackPage } from "../pages/MotionPackPage";
import { useRouteLocale } from "./route-locale";

function MotionPackRoute() {
  const locale = useRouteLocale();
  const params = useParams({ strict: false }) as { packId?: string };
  return <MotionPackPage locale={locale} packId={params.packId ?? ""} />;
}

export const Route = createLazyRoute("/$locale/packs/$packId")({
  component: MotionPackRoute
});
