import { createLazyRoute, useParams } from "@tanstack/react-router";
import { getRegistryBlock } from "../data/block-registry";
import { BlockPage } from "../pages/BlockPage";
import { ComponentPage } from "../pages/ComponentPage";
import { useRouteLocale } from "./route-locale";

export const Route = createLazyRoute("/$locale/components/$componentId")({
  component: ComponentRoute
});

function ComponentRoute() {
  const locale = useRouteLocale();
  const { componentId } = useParams({ from: "/$locale/components/$componentId" });
  if (getRegistryBlock(componentId)) {
    return <BlockPage locale={locale} blockId={componentId} />;
  }
  return <ComponentPage locale={locale} componentId={componentId} />;
}
