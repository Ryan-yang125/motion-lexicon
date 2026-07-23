import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Search, SlidersHorizontal, Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCompactCatalogEntry } from "../data/compact-catalog";
import type { Locale } from "../data/types";
import { text } from "../data/site";
import { MotionThumbnail } from "./MotionThumbnail";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const skillUrl = `${repositoryUrl}/tree/main/skills/motion-lexicon`;

export function Hero({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const featured = getCompactCatalogEntry("slide-in");

  return (
    <section className="library-hero" aria-labelledby="hero-title">
      <div className="library-hero-copy">
        <span className="library-status-line">
          <i aria-hidden="true" />
          {t("landing.heroStatus")}
        </span>
        <h1 id="hero-title">{t("landing.heroTitle")}</h1>
        <p>{t("landing.heroCopy")}</p>
        <div className="library-hero-actions">
          <Link
            className="library-button is-primary"
            to="/$locale/catalog/"
            params={{ locale }}
            search={{ surface: "components" }}
          >
            {t("landing.browseComponents")}
            <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
          </Link>
          <Link
            className="library-button"
            to="/$locale/catalog/"
            params={{ locale }}
            search={{ surface: "playgrounds" }}
          >
            <SlidersHorizontal aria-hidden="true" size={16} strokeWidth={1.8} />
            {t("landing.openPlaygrounds")}
          </Link>
        </div>
        <Link
          className="library-hero-search"
          to="/$locale/catalog/"
          params={{ locale }}
          search={{ surface: "components" }}
          hash="catalog-search"
        >
          <Search aria-hidden="true" size={17} strokeWidth={1.8} />
          <span>{t("landing.searchLibrary")}</span>
          <kbd>/</kbd>
        </Link>
        <a
          className="library-hero-search"
          href={repositoryUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={locale === "zh" ? "打开免费 Motion Lexicon CLI" : "Open the free Motion Lexicon CLI"}
        >
          <Terminal aria-hidden="true" size={17} strokeWidth={1.8} />
          <code>npx github:<wbr />Ryan-yang125/<wbr />motion-lexicon</code>
          <span aria-hidden="true">↗</span>
        </a>
        <a
          className="library-hero-search"
          href={skillUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={locale === "zh" ? "打开免费 Motion Lexicon Agent Skill" : "Open the free Motion Lexicon Agent Skill"}
        >
          <Bot aria-hidden="true" size={17} strokeWidth={1.8} />
          <code>npx skills add Ryan-yang125/<wbr />motion-lexicon --skill motion-lexicon</code>
          <span aria-hidden="true">↗</span>
        </a>
        <div className="library-output-row" aria-label={t("landing.outputLabel")}>
          <span>{t("landing.outputLabel")}</span>
          <strong>CSS</strong>
          <strong>HTML</strong>
          <strong>JS</strong>
          <strong>Prompt</strong>
        </div>
      </div>

      {featured ? (
        <Link
          className="library-hero-preview"
          to="/$locale/$categoryId/$recipeId/"
          params={{ locale, categoryId: featured.categoryId, recipeId: featured.id }}
        >
          <div className="library-hero-preview-bar">
            <span>{t("landing.livePreview")}</span>
            <span>{text(featured.name, locale)}</span>
          </div>
          <MotionThumbnail locale={locale} recipe={featured} />
          <div className="library-hero-preview-meta">
            <span>240ms</span>
            <span>28px</span>
            <span>cubic-bezier</span>
            <span>{t("common.open")}</span>
          </div>
        </Link>
      ) : null}
    </section>
  );
}
