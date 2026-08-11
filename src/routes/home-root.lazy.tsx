import { createLazyRoute } from "@tanstack/react-router";
import { defaultLocale } from "../data/site";
import { HomePage } from "../pages/HomePage";

export const Route = createLazyRoute("/")({
  component: () => <HomePage locale={defaultLocale} />
});
