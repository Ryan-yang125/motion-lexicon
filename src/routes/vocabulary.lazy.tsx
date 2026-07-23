import { createLazyRoute } from "@tanstack/react-router";
import { VocabularyPage } from "../pages/VocabularyPage";
import { useRouteLocale } from "./route-locale";

function VocabularyRoute() {
  return <VocabularyPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/vocabulary")({
  component: VocabularyRoute
});
