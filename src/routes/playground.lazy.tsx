import { createLazyRoute } from "@tanstack/react-router";
import { PlaygroundPage } from "../pages/PlaygroundPage";
import { useRouteLocale } from "./route-locale";

function PlaygroundRoute() {
  return <PlaygroundPage locale={useRouteLocale()} />;
}

export const Route = createLazyRoute("/$locale/playground")({
  component: PlaygroundRoute
});
