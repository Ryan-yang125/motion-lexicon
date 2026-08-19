import { createLazyRoute, useParams } from "@tanstack/react-router";
import { BlockPage } from "../pages/BlockPage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/blocks/$blockId")({
  component: BlockRoute
});

function BlockRoute() {
  const locale = useRouteLocale();
  const { blockId } = useParams({ from: "/$locale/blocks/$blockId" });
  return <BlockPage locale={locale} blockId={blockId} />;
}
