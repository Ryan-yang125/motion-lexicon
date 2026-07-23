import { Link, useLocation } from "@tanstack/react-router";
import { Github, Menu, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../data/types";
import { ThemeLanguageControls } from "./ThemeLanguageControls";

type HeaderProps = {
  locale: Locale;
};

type Surface = "components" | "playgrounds" | "guides";

const surfaces: Surface[] = ["components", "playgrounds", "guides"];
const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";

export function Header({ locale }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const surface = new URLSearchParams(location.searchStr).get("surface") ?? "components";
  const isCatalog = /\/catalog\/?$/.test(location.pathname);
  const isVocabulary = /\/vocabulary\/?$/.test(location.pathname);
  const vocabularyLabel = locale === "zh" ? "动画词汇" : "Vocabulary";

  function isActive(item: Surface) {
    return isCatalog && surface === item;
  }

  return (
    <header className="library-header">
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
          {surfaces.map((item) => (
            <Link
              key={item}
              to="/$locale/catalog/"
              params={{ locale }}
              search={{ surface: item }}
              className={isActive(item) ? "is-active" : undefined}
              aria-current={isActive(item) ? "page" : undefined}
            >
              {t(`nav.${item}`)}
            </Link>
          ))}
          <Link
            to="/$locale/vocabulary/"
            params={{ locale }}
            className={isVocabulary ? "is-active" : undefined}
            aria-current={isVocabulary ? "page" : undefined}
          >
            {vocabularyLabel}
          </Link>
        </nav>

        <div className="library-header-actions">
          <Link
            className="library-search-link"
            to="/$locale/catalog/"
            params={{ locale }}
            search={{ surface: "components" }}
            hash="catalog-search"
            aria-label={t("nav.searchLibrary")}
          >
            <Search aria-hidden="true" size={15} strokeWidth={1.8} />
            <span>{t("common.search")}</span>
            <kbd>/</kbd>
          </Link>
          <a
            className="icon-link"
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Motion Lexicon on GitHub"
          >
            <Github aria-hidden="true" size={16} strokeWidth={1.8} />
            <span>GitHub</span>
          </a>
          <ThemeLanguageControls locale={locale} />
          <details className="library-mobile-menu">
            <summary aria-label={t("nav.openMenu")}>
              <Menu aria-hidden="true" size={18} strokeWidth={1.8} />
            </summary>
            <nav aria-label={t("nav.mobileLabel")}>
              {surfaces.map((item) => (
                <Link
                  key={item}
                  to="/$locale/catalog/"
                  params={{ locale }}
                  search={{ surface: item }}
                >
                  {t(`nav.${item}`)}
                </Link>
              ))}
              <Link to="/$locale/vocabulary/" params={{ locale }}>
                {vocabularyLabel}
              </Link>
              <a href={repositoryUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
