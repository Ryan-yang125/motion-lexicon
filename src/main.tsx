import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import * as helmetAsync from "react-helmet-async";
import { ThemeProvider } from "./components/ThemeProvider";
import { defaultLocale, isLocale } from "./data/site";
import { setI18nLanguage } from "./i18n";
import { AppRouterProvider, router } from "./router";
import "./styles.css";
import "./library.css";
import "./vocabulary.css";

const helmetModule = helmetAsync as typeof helmetAsync & Record<string, typeof helmetAsync | undefined>;
const { HelmetProvider } = (helmetModule["default"] ?? helmetAsync) as typeof helmetAsync;
const initialSegment = window.location.pathname.split("/").filter(Boolean)[0];
const initialLocale = isLocale(initialSegment) ? initialSegment : defaultLocale;

setI18nLanguage(initialLocale);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Missing #root application mount point");
}

const app = (
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AppRouterProvider />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);

async function bootstrap(container: HTMLElement) {
  if (container.hasChildNodes()) {
    // TanStack Router uses this marker to keep the initial client tree aligned
    // with its server tree while React attaches to prerendered markup.
    router.ssr = { manifest: undefined };
    await router.load();
    hydrateRoot(container, app, {
      onRecoverableError(error, errorInfo) {
        console.error("[Motion Lexicon hydration]", error, errorInfo.componentStack);
      }
    });
  } else {
    createRoot(container).render(app);
  }
}

void bootstrap(rootElement);
