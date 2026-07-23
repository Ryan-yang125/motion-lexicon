import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogSidebar } from "../components/CatalogSidebar";
import { MotionThumbnail } from "../components/MotionThumbnail";
import { Seo } from "../components/Seo";
import { categories } from "../data/categories";
import { getGlossaryTermsForCanonical } from "../data/glossary";
import { catalogRecipes, getMotionCatalogMeta } from "../data/recipes";
import type { Locale, MotionSurfaceType } from "../data/types";
import { pathFor, text } from "../data/site";
import { createRecipeSearchIndex } from "../lib/motion-engine";
import { breadcrumbStructuredData, itemListStructuredData } from "../lib/structured-data";

type SurfaceFilter = "components" | "playgrounds" | "guides";

const surfaceFilters: Array<{ id: SurfaceFilter; surfaceType: MotionSurfaceType; icon: typeof Sparkles }> = [
  { id: "components", surfaceType: "component", icon: Sparkles },
  { id: "playgrounds", surfaceType: "playground", icon: SlidersHorizontal },
  { id: "guides", surfaceType: "guide", icon: BookOpen }
];

const surfaceFilterById = new Map(surfaceFilters.map((filter) => [filter.id, filter]));
const surfaceCounts = new Map(
  surfaceFilters.map((filter) => [
    filter.id,
    catalogRecipes.filter((recipe) => getMotionCatalogMeta(recipe).surfaceType === filter.surfaceType).length
  ])
);

function isSurfaceFilter(value: string | null): value is SurfaceFilter {
  return value === "components" || value === "playgrounds" || value === "guides";
}

function readCatalogState(fallback: SurfaceFilter) {
  const params = new URLSearchParams(window.location.search);
  const surface = params.get("surface");
  return {
    surface: isSurfaceFilter(surface) ? surface : fallback,
    query: params.get("q") ?? ""
  };
}

export function CatalogPage({
  locale,
  initialSurface = "components"
}: {
  locale: Locale;
  initialSurface?: SurfaceFilter;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [surface, setSurface] = useState<SurfaceFilter>(initialSurface);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const searchRef = useRef<HTMLInputElement>(null);
  const activeFilter = surfaceFilterById.get(surface) ?? surfaceFilters[0];

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const state = readCatalogState(initialSurface);
      setSurface(state.surface);
      setQuery(state.query);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [initialSurface, locale]);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      const target = event.target;
      const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const filteredRecipes = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    return catalogRecipes.filter((recipe) => {
      const meta = getMotionCatalogMeta(recipe);
      return meta.surfaceType === activeFilter.surfaceType && (!normalized || createRecipeSearchIndex(recipe, locale).includes(normalized));
    });
  }, [activeFilter.surfaceType, deferredQuery, locale]);

  const grouped = categories
    .map((category) => ({ category, entries: filteredRecipes.filter((recipe) => recipe.categoryId === category.id) }))
    .filter((group) => group.entries.length > 0);

  function updateUrl(nextSurface: SurfaceFilter, nextQuery: string) {
    setSurface(nextSurface);
    setQuery(nextQuery);
    const params = new URLSearchParams();
    params.set("surface", nextSurface);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    void navigate({
      href: `${pathFor(locale, ["catalog"])}?${params.toString()}`,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false
    });
  }

  return (
    <>
      <Seo
        locale={locale}
        title={t("seo.catalogTitle")}
        description={t("seo.catalogDescription")}
        path={pathFor(locale, ["catalog"])}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: t("catalog.title"), path: ["catalog"] }
          ]),
          itemListStructuredData(locale, t("catalog.title"), catalogRecipes)
        ]}
      />

      <section className="library-catalog-hero">
        <span>{t("catalog.libraryLabel")}</span>
        <h1>{t(`catalog.surfaces.${activeFilter.surfaceType}.title`)}</h1>
        <p>{t(`catalog.surfaces.${activeFilter.surfaceType}.copy`)}</p>
      </section>

      <div className="library-surface-tabs" aria-label={t("catalog.surfaceLabel")}>
        {surfaceFilters.map(({ id, icon: Icon }) => (
          <button
            type="button"
            aria-pressed={surface === id}
            className={surface === id ? "is-active" : undefined}
            key={id}
            onClick={() => updateUrl(id, query)}
          >
            <Icon aria-hidden="true" size={16} strokeWidth={1.7} />
            <span>{t(`nav.${id}`)}</span>
            <small>{surfaceCounts.get(id) ?? 0}</small>
          </button>
        ))}
      </div>

      <div className="library-catalog-layout" id="catalog-content">
        <CatalogSidebar locale={locale} compact surfaceType={activeFilter.surfaceType} />
        <div className="library-catalog-results">
          <label className="library-catalog-search" id="catalog-search">
            <Search aria-hidden="true" size={18} strokeWidth={1.8} />
            <input
              ref={searchRef}
              name="catalog-search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => updateUrl(surface, event.currentTarget.value)}
              placeholder={t("catalog.searchPlaceholder")}
              aria-label={t("common.search")}
            />
            <kbd>/</kbd>
          </label>

          <div className="library-results-meta">
            <span>{t("catalog.results", { count: filteredRecipes.length })}</span>
            {query ? <button type="button" onClick={() => updateUrl(surface, "")}>{t("catalog.clearSearch")}</button> : null}
          </div>

          {grouped.length > 0 ? grouped.map(({ category, entries }) => (
            <section className="library-catalog-group" key={category.id} aria-labelledby={`${category.id}-catalog-title`}>
              <div className="library-section-heading is-row">
                <div>
                  <span>{text(category.eyebrow, locale)}</span>
                  <h2 id={`${category.id}-catalog-title`}>{text(category.name, locale)}</h2>
                </div>
                <Link to="/$locale/$categoryId/" params={{ locale, categoryId: category.id }}>
                  {t("catalog.viewCategory")}
                  <ArrowRight aria-hidden="true" size={14} />
                </Link>
              </div>
              <div className={`library-card-grid is-${activeFilter.surfaceType}`}>
                {entries.map((recipe) => {
                  const meta = getMotionCatalogMeta(recipe);
                  const aliasTerms = getGlossaryTermsForCanonical(recipe.id).slice(1);
                  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase();
                  const matchingAliases = normalizedQuery
                    ? aliasTerms.filter((term) => [
                        term.id,
                        term.name.zh,
                        term.name.en,
                        term.definition.zh,
                        term.definition.en,
                        term.distinction?.zh,
                        term.distinction?.en
                      ].filter(Boolean).join(" ").toLocaleLowerCase().includes(normalizedQuery))
                    : [];
                  const visibleAliases = matchingAliases.length > 0 ? matchingAliases : aliasTerms;
                  return (
                    <Link
                      className="library-card"
                      key={recipe.id}
                      to="/$locale/$categoryId/$recipeId/"
                      params={{ locale, categoryId: recipe.categoryId, recipeId: recipe.id }}
                    >
                      {meta.surfaceType === "guide" ? (
                        <div className="library-guide-art" aria-hidden="true">
                          <BookOpen size={24} strokeWidth={1.5} />
                          <span>{meta.family}</span>
                        </div>
                      ) : <MotionThumbnail locale={locale} recipe={recipe} />}
                      <div className="library-card-body">
                        <div><h3>{text(recipe.name, locale)}</h3><ArrowRight aria-hidden="true" size={15} /></div>
                        <p>{text(recipe.shortDescription, locale)}</p>
                        {meta.aliases.length > 0 ? (
                          <small>
                            {visibleAliases
                              .slice(0, 2)
                              .map((term) => text(term.name, locale))
                              .join(" · ")}
                            {visibleAliases.length > 2 ? ` · +${visibleAliases.length - 2}` : ""}
                          </small>
                        ) : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )) : (
            <section className="library-empty-state">
              <h2>{t("common.noRecipesTitle")}</h2>
              <p>{t("catalog.noResultsCopy")}</p>
              <button className="library-button" type="button" onClick={() => updateUrl(surface, "")}>{t("catalog.clearSearch")}</button>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
