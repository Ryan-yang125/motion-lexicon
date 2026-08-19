import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter
} from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LibraryShell } from "./components/LibraryShell";
import { defaultLocale, pathFor } from "./data/site";
import { loadSeoGuideArticle } from "./data/load-seo-guide-article";
import type { Locale } from "./data/types";
import { setI18nLanguage } from "./i18n";
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
      <LibraryShell locale={locale} />
    </>
  );
}

const rootRoute = createRootRoute({
  component: AppShell
});

const rootIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
}).lazy(() => import("./routes/home-root.lazy").then((module) => module.Route));

const localeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale",
}).lazy(() => import("./routes/home-locale.lazy").then((module) => module.Route));

const componentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/components"
}).lazy(() => import("./routes/components.lazy").then((module) => module.Route));

const componentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/components/$componentId"
}).lazy(() => import("./routes/component.lazy").then((module) => module.Route));

const blocksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/blocks"
}).lazy(() => import("./routes/blocks.lazy").then((module) => module.Route));

const blockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/blocks/$blockId"
}).lazy(() => import("./routes/block.lazy").then((module) => module.Route));

const primitivesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/primitives"
}).lazy(() => import("./routes/primitives.lazy").then((module) => module.Route));

const primitiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/primitives/$primitiveId"
}).lazy(() => import("./routes/primitive.lazy").then((module) => module.Route));

const guidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/guides"
}).lazy(() => import("./routes/guides.lazy").then((module) => module.Route));

const seoGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/guides/$guideId",
  loader: ({ params }) => loadSeoGuideArticle(params.guideId)
}).lazy(() => import("./routes/seo-guide.lazy").then((module) => module.Route));

const methodRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/method"
}).lazy(() => import("./routes/method.lazy").then((module) => module.Route));

const vocabularyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/vocabulary"
}).lazy(() => import("./routes/vocabulary.lazy").then((module) => module.Route));

const skillRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "$locale/skill"
}).lazy(() => import("./routes/skill.lazy").then((module) => module.Route));

const routeTree = rootRoute.addChildren([
  rootIndexRoute,
  localeRoute,
  componentsRoute,
  componentRoute,
  blocksRoute,
  blockRoute,
  primitivesRoute,
  primitiveRoute,
  guidesRoute,
  seoGuideRoute,
  methodRoute,
  vocabularyRoute,
  skillRoute
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
