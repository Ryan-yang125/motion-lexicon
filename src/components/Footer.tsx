import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../data/types";
import { BrandMark } from "./BrandMark";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const cliUrl = `${repositoryUrl}#free-cli-and-agent-skill`;
const skillUrl = `${repositoryUrl}/tree/main/skills/motion-lexicon`;

export function Footer() {
  const { t, i18n } = useTranslation();
  const locale: Locale = i18n.resolvedLanguage?.startsWith("en") ? "en" : "zh";

  return (
    <footer className="library-footer library-footer-compact">
      <div className="library-footer-main">
        <div className="library-footer-brand">
          <BrandMark className="library-brand-mark" />
          <div>
            <strong>{t("common.brand")}</strong>
            <p>{t("footer.description")}</p>
          </div>
        </div>
        <nav className="library-footer-links" aria-label={t("footer.exploreLabel")}>
          <Link to="/$locale/finder/" params={{ locale }}>
            {locale === "zh" ? "找动效" : "Find motion"}
          </Link>
          <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: "components" }}>
            {locale === "zh" ? "动效库" : "Library"}
          </Link>
          <Link to="/$locale/vocabulary/" params={{ locale }}>
            {locale === "zh" ? "动画词汇" : "Vocabulary"}
          </Link>
          <Link to="/$locale/$categoryId/$recipeId/" params={{ locale, categoryId: "entrances", recipeId: "slide-in" }}>
            {t("footer.openExample")}
          </Link>
        </nav>
        <nav
          className="library-footer-resources"
          aria-label={locale === "zh" ? "开源资源" : "Open source resources"}
        >
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            GitHub
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href={cliUrl} target="_blank" rel="noreferrer">
            CLI
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
        </nav>
      </div>
      <div className="library-footer-meta">
        <span>{locale === "zh" ? "免费开放 · CSS · HTML · JS · Prompt" : "Free and open · CSS · HTML · JS · Prompt"}</span>
        <span>{t("footer.staticProduct")}</span>
      </div>
    </footer>
  );
}
