import { createLazyRoute } from "@tanstack/react-router";
import { SkillPage } from "../pages/SkillPage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/skill")({
  component: SkillRoute
});

function SkillRoute() {
  return <SkillPage locale={useRouteLocale()} />;
}
