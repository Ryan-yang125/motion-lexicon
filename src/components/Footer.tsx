import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../data/types";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const skillUrl = `${repositoryUrl}/tree/main/skills/motion-lexicon`;

export function Footer() {
  const { t, i18n } = useTranslation();
  const locale: Locale = i18n.resolvedLanguage?.startsWith("en") ? "en" : "zh";

  return (
    <footer className="library-footer">
      <div className="library-footer-main">
        <div className="library-footer-brand">
          <span className="library-brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div>
            <strong>{t("common.brand")}</strong>
            <p>{t("footer.description")}</p>
          </div>
        </div>
        <nav aria-label={t("footer.exploreLabel")}>
          <span>{t("footer.explore")}</span>
          <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: "components" }}>
            {t("nav.components")}
          </Link>
          <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: "playgrounds" }}>
            {t("nav.playgrounds")}
          </Link>
          <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: "guides" }}>
            {t("nav.guides")}
          </Link>
          <Link to="/$locale/vocabulary/" params={{ locale }}>
            {locale === "zh" ? "动画词汇" : "Vocabulary"}
          </Link>
        </nav>
        <div className="library-footer-output">
          <span>{locale === "zh" ? "免费开放" : "FREE & OPEN"}</span>
          <p>CSS · HTML · JS · Prompt</p>
          <Link to="/$locale/$categoryId/$recipeId/" params={{ locale, categoryId: "entrances", recipeId: "slide-in" }}>
            {t("footer.openExample")}
            <ArrowUpRight aria-hidden="true" size={14} />
          </Link>
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href={skillUrl} target="_blank" rel="noreferrer">
            Agent Skill
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href="/data/v1/catalog.json">
            Catalog JSON
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
        </div>
      </div>
      <div className="library-footer-meta">
        <span>Motion Lexicon</span>
        <span>{t("footer.staticProduct")}</span>
      </div>
    </footer>
  );
}
