import { createLazyRoute } from "@tanstack/react-router";
import { BlocksPage } from "../pages/BlocksPage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/blocks")({ component: BlocksRoute });

function BlocksRoute() {
  return <BlocksPage locale={useRouteLocale()} />;
}
