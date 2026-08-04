import { Link, useLocation } from "@tanstack/react-router";
import {
  Braces,
  BookOpen,
  Github,
  Menu,
  MotionBlueprintGlyph,
  MotionDirectorGlyph,
  MotionPrimitiveGlyph,
  MotionVocabularyGlyph,
  ProductMomentGlyph
} from "./icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../data/types";
import { BrandMark } from "./BrandMark";
import { ThemeLanguageControls } from "./ThemeLanguageControls";
import { Popover } from "./interior/popover";

type HeaderProps = {
  locale: Locale;
};

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const skillUrl = `${repositoryUrl}/tree/main/skills/motion-lexicon`;
const motionGrammarUrl = "/data/v2/motion-grammar.json";

export function Header({ locale }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const routeSegment = location.pathname.split("/")[2];
  const isHomeRoute = /^\/(?:zh|en)\/$/.test(location.pathname);
  const isPacksRoute = /\/packs(?:\/|$)/.test(location.pathname);
  const isFinderRoute = /\/finder\/?$/.test(location.pathname);
  const isGuidesRoute = /\/guides(?:\/|$)/.test(location.pathname);
  const isMethodRoute = /\/method\/?$/.test(location.pathname);
  const isVocabulary = /\/vocabulary\/?$/.test(location.pathname);
  const isDirectorRoute = /\/(?:director|lab\/motion-blueprints)\/?$/.test(location.pathname);
  const isPrimitivesRoute = /\/catalog\/?$/.test(location.pathname)
    || !["", "finder", "guides", "method", "packs", "director", "lab", "vocabulary"].includes(routeSegment ?? "");
  const finderLabel = locale === "zh" ? "找动效" : "Find motion";
  const homeLabel = locale === "zh" ? "首页" : "Home";
  const packsLabel = locale === "zh" ? "产品瞬间" : "Product moments";
  const primitivesLabel = locale === "zh" ? "动效基础" : "Motion primitives";
  const guidesLabel = locale === "zh" ? "场景指南" : "Scenario guides";
  const directorLabel = "Motion Director";
  const resourcesLabel = locale === "zh" ? "资源与设置" : "Resources and settings";
  const settingsLabel = locale === "zh" ? "显示设置" : "Display settings";
  const vocabularyLabel = locale === "zh" ? "动画词汇" : "Vocabulary";

  useEffect(() => {
    setResourcesOpen(false);
  }, [location.pathname, location.searchStr]);

  return (
    <header className="library-header library-header-compact">
      <div className="library-header-inner">
        <Link
          className="library-brand"
          to="/$locale/"
          params={{ locale }}
          activeOptions={{ exact: true }}
          aria-label={t("common.brand")}
        >
          <BrandMark className="library-brand-mark" />
          <span>{t("common.brand")}</span>
        </Link>

        <nav className="library-primary-nav" aria-label={t("nav.primaryLabel")}>
          <Link
            to="/$locale/"
            params={{ locale }}
            activeOptions={{ exact: true }}
            className={`library-primary-link is-home${isHomeRoute ? " is-active" : ""}`}
            aria-current={isHomeRoute ? "page" : undefined}
          >
            {homeLabel}
          </Link>
          <Link
            to="/$locale/finder/"
            params={{ locale }}
            className={`library-primary-link is-finder${isFinderRoute ? " is-active" : ""}`}
            aria-current={isFinderRoute ? "page" : undefined}
          >
            {finderLabel}
          </Link>
          <Link
            to="/$locale/packs/"
            params={{ locale }}
            className={`library-primary-link is-library${isPacksRoute ? " is-active" : ""}`}
            aria-current={isPacksRoute ? "page" : undefined}
          >
            {packsLabel}
          </Link>
          <Link
            to="/$locale/catalog/"
            params={{ locale }}
            search={{ surface: "components" }}
            className={`library-primary-link is-primitives${isPrimitivesRoute ? " is-active" : ""}`}
            aria-current={isPrimitivesRoute ? "page" : undefined}
          >
            {primitivesLabel}
          </Link>
          <Link
            to="/$locale/guides/"
            params={{ locale }}
            className={`library-primary-link is-guides${isGuidesRoute ? " is-active" : ""}`}
            aria-current={isGuidesRoute ? "page" : undefined}
          >
            {guidesLabel}
          </Link>
        </nav>

        <div className="library-header-actions">
          <Link
            className={`library-director-link${isDirectorRoute ? " is-active" : ""}`}
            to="/$locale/director/"
            params={{ locale }}
            aria-current={isDirectorRoute ? "page" : undefined}
          >
            <MotionDirectorGlyph aria-hidden="true" size={14} />
            <span>{directorLabel}</span>
          </Link>
          <a
            className="icon-link library-github-link"
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={locale === "zh" ? "在 GitHub 上查看 Motion Lexicon" : "View Motion Lexicon on GitHub"}
          >
            <Github aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>GitHub</span>
          </a>
          <div className="library-utility-menu">
            <Popover
              label={resourcesLabel}
              open={resourcesOpen}
              onOpenChange={setResourcesOpen}
              side="bottom"
              align="end"
              offset={8}
              triggerClassName="library-utility-trigger"
              className="library-utility-popover"
              trigger={(
                <>
                  <Menu aria-hidden="true" size={18} strokeWidth={1.8} />
                  <span>{locale === "zh" ? "资源" : "Resources"}</span>
                </>
              )}
              >
              <nav aria-label={t("nav.mobileLabel")}>
                <Link to="/$locale/" params={{ locale }} activeOptions={{ exact: true }} className={isHomeRoute ? "is-active" : undefined} aria-current={isHomeRoute ? "page" : undefined}>
                  {homeLabel}
                </Link>
                <Link to="/$locale/finder/" params={{ locale }} className={isFinderRoute ? "is-active" : undefined} aria-current={isFinderRoute ? "page" : undefined}>
                  {finderLabel}
                </Link>
                <Link to="/$locale/director/" params={{ locale }} className={isDirectorRoute ? "is-active" : undefined} aria-current={isDirectorRoute ? "page" : undefined}>
                  <MotionDirectorGlyph aria-hidden="true" size={16} />
                  <span>{directorLabel}</span>
                </Link>
                <Link to="/$locale/packs/" params={{ locale }} className={isPacksRoute ? "is-active" : undefined} aria-current={isPacksRoute ? "page" : undefined}>
                  <ProductMomentGlyph aria-hidden="true" size={16} />
                  <span>{packsLabel}</span>
                </Link>
                <Link
                  to="/$locale/catalog/"
                  params={{ locale }}
                  search={{ surface: "components" }}
                  className={isPrimitivesRoute ? "is-active" : undefined}
                  aria-current={isPrimitivesRoute ? "page" : undefined}
                >
                  <MotionPrimitiveGlyph aria-hidden="true" size={16} />
                  <span>{primitivesLabel}</span>
                </Link>
                <Link
                  to="/$locale/vocabulary/"
                  params={{ locale }}
                  className={isVocabulary ? "is-active" : undefined}
                  aria-current={isVocabulary ? "page" : undefined}
                >
                  <MotionVocabularyGlyph aria-hidden="true" size={16} />
                  <span>{vocabularyLabel}</span>
                </Link>
                <Link to="/$locale/guides/" params={{ locale }} className={isGuidesRoute ? "is-active" : undefined} aria-current={isGuidesRoute ? "page" : undefined}>
                  <BookOpen aria-hidden="true" size={16} />
                  <span>{guidesLabel}</span>
                </Link>
                <Link to="/$locale/method/" params={{ locale }} className={isMethodRoute ? "is-active" : undefined} aria-current={isMethodRoute ? "page" : undefined}>
                  <BookOpen aria-hidden="true" size={16} />
                  <span>{locale === "zh" ? "方法与来源" : "Method and sources"}</span>
                </Link>
                <a href={skillUrl} target="_blank" rel="noreferrer">
                  <MotionBlueprintGlyph aria-hidden="true" size={16} />
                  <span>Agent Skill</span>
                </a>
                <a href={motionGrammarUrl}>
                  <Braces aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>Motion Grammar JSON</span>
                </a>
                <a href="/data/v1/catalog.json">
                  <Braces aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>Catalog JSON</span>
                </a>
                <a href="/data/v1/packs.json">
                  <Braces aria-hidden="true" size={16} strokeWidth={1.7} />
                  <span>Packs JSON</span>
                </a>
              </nav>
              <div className="library-utility-settings" aria-label={settingsLabel}>
                <span>{settingsLabel}</span>
                <ThemeLanguageControls locale={locale} />
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
