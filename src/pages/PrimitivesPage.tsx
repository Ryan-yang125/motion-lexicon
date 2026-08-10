import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { SearchIcon } from "../components/icons";
import { Seo } from "../components/Seo";
import { categories } from "../data/categories";
import { primitiveSurfaceLabel } from "../data/primitive-registry";
import { catalogRecipes } from "../data/recipes";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { createRecipeSearchIndex, getDefaultParamValues } from "../lib/motion-engine";
import { PrimitivePreview } from "../registry/primitive-preview-map";

function validCategory(id: string | null) {
  return categories.some((category) => category.id === id) ? id ?? undefined : undefined;
}

export function PrimitivesPage({ locale }: { locale: Locale }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = new URLSearchParams(location.searchStr);
  const [query, setQuery] = useState(initial.get("q") ?? "");
  const [categoryId, setCategoryId] = useState(validCategory(initial.get("category")));
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const params = new URLSearchParams(location.searchStr);
    setQuery(params.get("q") ?? "");
    setCategoryId(validCategory(params.get("category")));
  }, [location.searchStr]);

  const entries = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    return catalogRecipes.filter((recipe) =>
      (!categoryId || recipe.categoryId === categoryId) &&
      (!normalized || createRecipeSearchIndex(recipe, locale).includes(normalized))
    );
  }, [categoryId, deferredQuery, locale]);

  const copy = locale === "zh"
    ? { title: "可调节、可复制的 React 原子动效", description: "40 个 React + Motion 实现，4 个设计指南。", search: "搜索淡入、弹簧、拖拽", all: "全部" }
    : { title: "Tunable, copy-ready React motion primitives", description: "40 React + Motion implementations and 4 design guides.", search: "Search fade, spring, drag", all: "All" };

  function update(nextQuery: string, nextCategory?: string) {
    setQuery(nextQuery);
    setCategoryId(nextCategory);
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextCategory) params.set("category", nextCategory);
    const search = params.toString();
    void navigate({ href: `${pathFor(locale, ["primitives"])}${search ? `?${search}` : ""}`, replace: true, resetScroll: false });
  }

  return (
    <>
      <Seo locale={locale} title={`${copy.title} — Motion Lexicon`} description={copy.description} path={pathFor(locale, ["primitives"])} image={`/og-primitives-${locale}.png`} />
      <div className="directory-page primitives-directory">
        <header className="directory-hero primitive-hero">
          <span className="directory-kicker">React · Motion · shadcn registry</span>
          <h1>{copy.title}</h1>
          <div className="directory-hero-meta">
            <span>{copy.description}</span>
            <code>{entries.length}/44</code>
          </div>
        </header>

        <div className="primitive-toolbar">
          <label className="primitive-search">
            <SearchIcon size={14} aria-hidden="true" />
            <span className="sr-only">{copy.search}</span>
            <input value={query} onChange={(event) => update(event.target.value, categoryId)} placeholder={copy.search} />
          </label>
          <div className="primitive-filters" aria-label={locale === "zh" ? "动效分类" : "Motion categories"}>
            <button className={!categoryId ? "is-active" : ""} type="button" onClick={() => update(query)}>{copy.all}</button>
            {categories.map((category) => (
              <button className={categoryId === category.id ? "is-active" : ""} type="button" onClick={() => update(query, category.id)} key={category.id}>
                {text(category.name, locale)}
              </button>
            ))}
          </div>
        </div>

        {entries.length > 0 ? (
          <div className="primitive-card-grid">
            {entries.map((recipe) => (
              <Link className="primitive-card" key={recipe.id} to="/$locale/primitives/$primitiveId/" params={{ locale, primitiveId: recipe.id }}>
                <div className="primitive-card-stage">
                  <PrimitivePreview
                    locale={locale}
                    recipe={recipe}
                    values={getDefaultParamValues(recipe)}
                    deferred
                    compact
                  />
                </div>
                <div className="primitive-card-footer">
                  <span><strong>{text(recipe.name, locale)}</strong><code>{recipe.id}</code></span>
                  <small data-surface={recipe.surfaceType}>{primitiveSurfaceLabel(recipe, locale)}</small>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-route"><h2>{locale === "zh" ? "没有匹配结果" : "No matching result"}</h2></div>
        )}
      </div>
    </>
  );
}
