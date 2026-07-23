import { useParams } from "@tanstack/react-router";
import { defaultLocale, isLocale } from "../data/site";
import type { Locale } from "../data/types";

export function useRouteLocale(): Locale {
  const params = useParams({ strict: false }) as { locale?: string };
  return isLocale(params.locale) ? params.locale : defaultLocale;
}
