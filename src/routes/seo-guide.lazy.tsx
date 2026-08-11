import { createLazyRoute, useParams } from "@tanstack/react-router";
import { SeoGuidePage } from "../pages/SeoGuidePage";
import { useRouteLocale } from "./route-locale";

function SeoGuideRoute() {
  const locale = useRouteLocale();
  const params = useParams({ strict: false }) as { guideId?: string };
  const longArticle = Route.useLoaderData();
  return <SeoGuidePage locale={locale} guideId={params.guideId ?? ""} longArticle={longArticle} />;
}

export const Route = createLazyRoute("/$locale/guides/$guideId")({
  component: SeoGuideRoute
});
