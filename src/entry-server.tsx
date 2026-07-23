import React from "react";
import { renderToString } from "react-dom/server";
import * as helmetAsync from "react-helmet-async";
import type { HelmetServerState } from "react-helmet-async/lib/types";
import { ThemeProvider } from "./components/ThemeProvider";
import { defaultLocale, isLocale } from "./data/site";
import { setI18nLanguage } from "./i18n";
import { AppRouterProvider, createAppRouter, createServerHistory } from "./router";

const helmetModule = helmetAsync as typeof helmetAsync & Record<string, typeof helmetAsync | undefined>;
const { HelmetProvider } = (helmetModule["default"] ?? helmetAsync) as typeof helmetAsync;

function localeFromPath(path: string) {
  const firstSegment = path.split("/").filter(Boolean)[0];
  return isLocale(firstSegment) ? firstSegment : defaultLocale;
}

export async function render(path: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const locale = localeFromPath(path);
  setI18nLanguage(locale);
  const history = createServerHistory(path);
  const appRouter = createAppRouter(history);
  await appRouter.load();

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <AppRouterProvider appRouter={appRouter} />
      </ThemeProvider>
    </HelmetProvider>
  );

  return {
    appHtml,
    helmet: helmetContext.helmet,
    locale
  };
}
