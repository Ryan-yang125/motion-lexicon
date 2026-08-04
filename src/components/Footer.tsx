import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "./icons";
import { useTranslation } from "react-i18next";
import type { Locale } from "../data/types";
import { BrandMark } from "./BrandMark";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
const skillUrl = `${repositoryUrl}/tree/main/skills/motion-lexicon`;
const motionGrammarUrl = "/data/v2/motion-grammar.json";

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
          <Link to="/$locale/packs/" params={{ locale }}>
            {locale === "zh" ? "产品瞬间" : "Product moments"}
          </Link>
          <Link to="/$locale/catalog/" params={{ locale }} search={{ surface: "components" }}>
            {locale === "zh" ? "动效基础" : "Motion primitives"}
          </Link>
          <Link to="/$locale/director/" params={{ locale }}>
            Motion Director
          </Link>
          <Link to="/$locale/vocabulary/" params={{ locale }}>
            {locale === "zh" ? "动画词汇" : "Vocabulary"}
          </Link>
          <Link to="/$locale/guides/" params={{ locale }}>
            {locale === "zh" ? "场景指南" : "Scenario guides"}
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
          <a href={skillUrl} target="_blank" rel="noreferrer">
            Agent Skill
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href={motionGrammarUrl}>
            Motion Grammar JSON
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href="/data/v1/catalog.json">
            Catalog JSON
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a href="/data/v1/packs.json">
            Packs JSON
            <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <Link to="/$locale/method/" params={{ locale }}>
            {locale === "zh" ? "方法与来源" : "Method and sources"}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
