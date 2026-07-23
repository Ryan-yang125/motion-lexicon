import type { Locale } from "../data/types";
import { CatalogPage } from "./CatalogPage";

export function PlaygroundPage({ locale }: { locale: Locale }) {
  return <CatalogPage locale={locale} initialSurface="playgrounds" />;
}
