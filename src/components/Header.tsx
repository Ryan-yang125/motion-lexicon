import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Braces, Github, Menu, SlidersHorizontal, Terminal } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../data/types";
import { ThemeLanguageControls } from "./ThemeLanguageControls";

type HeaderProps = {
  locale: Locale;
};

type Surface = "components" | "playgrounds" | "guides";

const surfaces: Surface[] = ["components", "playgrounds", "guides"];
const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const cliUrl = `${repositoryUrl}#free-cli-and-agent-skill`;
const skillUrl = `${repositoryUrl}/tree/main/skills/motion-lexicon`;

const surfaceIcons = {
  components: BookOpen,
  playgrounds: SlidersHorizontal,
  guides: BookOpen
} satisfies Record<Surface, typeof BookOpen>;

export function Header({ locale }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const utilityMenuRef = useRef<HTMLDetailsElement>(null);
  const surface = new URLSearchParams(location.searchStr).get("surface") ?? "components";
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isHome = pathSegments.length === 1;
  const isCatalog = /\/catalog\/?$/.test(location.pathname);
  const isFinderRoute = /\/finder\/?$/.test(location.pathname);
  const isFinder = isHome || isFinderRoute;
  const isVocabulary = /\/vocabulary\/?$/.test(location.pathname);
  const isLibrary = !isFinder;
  const finderLabel = locale === "zh" ? "找动效" : "Find motion";
  const libraryLabel = locale === "zh" ? "动效库" : "Library";
  const resourcesLabel = locale === "zh" ? "资源与设置" : "Resources and settings";
  const settingsLabel = locale === "zh" ? "显示设置" : "Display settings";
  const vocabularyLabel = locale === "zh" ? "动画词汇" : "Vocabulary";

  function isActive(item: Surface) {
    return isCatalog && surface === item;
  }

  useEffect(() => {
    if (utilityMenuRef.current) utilityMenuRef.current.open = false;
  }, [location.pathname, location.searchStr]);

  return (
    <header className="library-header library-header-compact">
      <div className="library-header-inner">
        <Link className="library-brand" to="/$locale/" params={{ locale }} aria-label={t("common.brand")}>
          <span className="library-brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>{t("common.brand")}</span>
        </Link>

        <nav className="library-primary-nav" aria-label={t("nav.primaryLabel")}>
          <Link
            to="/$locale/finder/"
            params={{ locale }}
            className={`library-primary-link is-finder${isFinder ? " is-active" : ""}`}
            aria-current={isFinderRoute ? "page" : undefined}
          >
            {finderLabel}
          </Link>
          <Link
            to="/$locale/catalog/"
            params={{ locale }}
            search={{ surface: "components" }}
            className={`library-primary-link is-library${isLibrary ? " is-active" : ""}`}
            aria-current={isCatalog ? "page" : undefined}
          >
            {libraryLabel}
          </Link>
        </nav>

        <div className="library-header-actions">
          <a
            className="icon-link library-github-link"
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Motion Lexicon on GitHub"
          >
            <Github aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>GitHub</span>
          </a>
          <details ref={utilityMenuRef} className="library-utility-menu">
            <summary aria-label={resourcesLabel}>
              <Menu aria-hidden="true" size={18} strokeWidth={1.8} />
              <span>{locale === "zh" ? "资源" : "Resources"}</span>
            </summary>
            <div className="library-utility-popover">
              <nav aria-label={t("nav.mobileLabel")}>
                <Link to="/$locale/finder/" params={{ locale }}>
                  {finderLabel}
                </Link>
                {surfaces.map((item) => {
                  const Icon = surfaceIcons[item];
                  return (
                    <Link
                      key={item}
                      to="/$locale/catalog/"
                      params={{ locale }}
                      search={{ surface: item }}
                      className={isActive(item) ? "is-active" : undefined}
                    >
                      <Icon aria-hidden="true" size={16} strokeWidth={1.7} />
                      <span>{t(`nav.${item}`)}</span>
                    </Link>
                  );
                })}
                <Link
                  to="/$locale/vocabulary/"
                  params={{ locale }}
                  className={isVocabulary ? "is-active" : undefined}
                >
                  <BookOpen aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>{vocabularyLabel}</span>
                </Link>
                <a href={cliUrl} target="_blank" rel="noreferrer">
                  <Terminal aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>CLI</span>
                </a>
                <a href={skillUrl} target="_blank" rel="noreferrer">
                  <Braces aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>Agent Skill</span>
                </a>
                <a href="/data/v1/catalog.json">
                  <Braces aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>Catalog JSON</span>
                </a>
              </nav>
              <div className="library-utility-settings" aria-label={settingsLabel}>
                <span>{settingsLabel}</span>
                <ThemeLanguageControls locale={locale} />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
