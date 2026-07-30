import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Locale } from "../data/types";
import { pathFor } from "../data/site";

const exampleKeys = ["weight", "continuity", "sequence"] as const;

export function Hero({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function openFinder(nextQuery: string) {
    const normalized = nextQuery.trim();
    const params = new URLSearchParams();
    if (normalized) params.set("q", normalized);
    const search = params.toString();
    void navigate({
      href: `${pathFor(locale, ["finder"])}${search ? `?${search}` : ""}`
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openFinder(query);
  }

  return (
    <section className="library-hero apple-hero" aria-labelledby="hero-title">
      <div className="library-hero-copy apple-hero-copy">
        <span className="library-status-line apple-status-line">
          <Sparkles aria-hidden="true" size={14} strokeWidth={1.8} />
          {t("landing.heroStatus")}
        </span>
        <h1 id="hero-title">{t("landing.heroTitle")}</h1>
        <p>{t("landing.heroCopy")}</p>

        <form className="apple-hero-finder" role="search" onSubmit={handleSubmit}>
          <label htmlFor="home-finder-query">{t("finder.formLabel")}</label>
          <div>
            <Search aria-hidden="true" size={20} strokeWidth={1.7} />
            <input
              id="home-finder-query"
              name="q"
              type="search"
              value={query}
              autoComplete="off"
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder={t("landing.finderExample")}
            />
            <button type="submit">
              <span>{t("landing.openFinder")}</span>
              <ArrowRight aria-hidden="true" size={17} strokeWidth={1.9} />
            </button>
          </div>
        </form>

        <div className="apple-hero-examples" aria-label={t("finder.examplesLabel")}>
          {exampleKeys.map((key) => {
            const example = t(`finder.examples.${key}`);
            return (
              <button type="button" key={key} onClick={() => openFinder(example)}>
                {example}
              </button>
            );
          })}
        </div>

        <div className="apple-hero-proof" aria-label={locale === "zh" ? "产品规模" : "Product scope"}>
          <span><strong>44</strong>{locale === "zh" ? " 个动效配方" : " motion recipes"}</span>
          <i aria-hidden="true" />
          <span><strong>91</strong>{locale === "zh" ? " 个专业术语" : " vocabulary terms"}</span>
          <i aria-hidden="true" />
          <span>{locale === "zh" ? "免费 · 本地运行" : "Free · Runs locally"}</span>
        </div>
      </div>

      <Link
        className="library-hero-preview apple-hero-preview"
        to="/$locale/$categoryId/$recipeId/"
        params={{ locale, categoryId: "entrances", recipeId: "slide-in" }}
        aria-label={locale === "zh" ? "打开滑入动效示例" : "Open the Slide in motion example"}
      >
        <div className="apple-preview-toolbar">
          <span><i aria-hidden="true" />{locale === "zh" ? "实时预览" : "Live preview"}</span>
          <span>{locale === "zh" ? "滑入" : "Slide in"}</span>
        </div>
        <div className="apple-preview-scene" aria-hidden="true">
          <div className="apple-scene-sidebar">
            <span />
            <i />
            <i />
            <i />
          </div>
          <div className="apple-scene-content">
            <div className="apple-scene-heading"><span /><i /></div>
            <div className="apple-scene-card">
              <span className="apple-scene-avatar" />
              <div><strong>{locale === "zh" ? "设计评审已准备好" : "Design review is ready"}</strong><i /><i /></div>
              <b>→</b>
            </div>
            <div className="apple-scene-list"><span /><span /><span /></div>
          </div>
        </div>
        <div className="apple-preview-footer">
          <span>240ms</span>
          <span>28px</span>
          <span>ease-out</span>
          <strong>{locale === "zh" ? "打开配方" : "Open recipe"}<ArrowRight aria-hidden="true" size={14} /></strong>
        </div>
      </Link>
    </section>
  );
}
