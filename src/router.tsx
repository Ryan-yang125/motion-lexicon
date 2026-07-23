import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { defaultLocale, pathFor } from "./data/site";
import type { Locale } from "./data/types";
import { setI18nLanguage } from "./i18n";
import { LandingPage } from "./pages/LandingPage";
import { useRouteLocale } from "./routes/route-locale";

function LocaleSync({ locale }: { locale: Locale }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    setI18nLanguage(locale);
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [i18n, locale]);

  return null;
}

function AppShell() {
  const locale = useRouteLocale();

  return (
    <>
      <LocaleSync locale={locale} />
      <a className="skip-link" href="#main-content">
        {locale === "zh" ? "跳到主要内容" : "Skip to content"}
      </a>
      <Header locale={locale} />
      <main className="page" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function RootIndex() {
  return <LandingPage locale={defaultLocale} />;
}

function LocaleIndex() {
  const locale = useRouteLocale();
  return <LandingPage locale={locale} />;
}

const rootRoute = createRootRoute({
  component: AppShell
});

const rootIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RootIndex
});

const localeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale",
  component: LocaleIndex
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/catalog"
}).lazy(() => import("./routes/catalog.lazy").then((module) => module.Route));

const playgroundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/playground"
}).lazy(() => import("./routes/playground.lazy").then((module) => module.Route));

const vocabularyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/vocabulary"
}).lazy(() => import("./routes/vocabulary.lazy").then((module) => module.Route));

const recipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/$categoryId/$recipeId"
}).lazy(() => import("./routes/recipe.lazy").then((module) => module.Route));

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/$categoryId"
}).lazy(() => import("./routes/category.lazy").then((module) => module.Route));

const routeTree = rootRoute.addChildren([
  rootIndexRoute,
  localeRoute,
  catalogRoute,
  playgroundRoute,
  vocabularyRoute,
  recipeRoute,
  categoryRoute
]);

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    defaultPreload: "intent",
    trailingSlash: "always",
    scrollRestoration: false,
    context: {}
  });
}

export const router = createAppRouter();

export type AppRouter = ReturnType<typeof createAppRouter>;

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouterProvider({
  history,
  appRouter
}: {
  history?: RouterHistory;
  appRouter?: AppRouter;
}) {
  const resolvedRouter = appRouter ?? (history ? createAppRouter(history) : router);
  return <RouterProvider router={resolvedRouter} />;
}

export function createServerHistory(path: string) {
  return createMemoryHistory({
    initialEntries: [path || pathFor(defaultLocale)]
  });
}
