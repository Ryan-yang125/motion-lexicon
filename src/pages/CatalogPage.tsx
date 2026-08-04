import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, LayoutGrid, SlidersHorizontal } from "../components/icons";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CatalogSidebar } from "../components/CatalogSidebar";
import { MotionThumbnail } from "../components/MotionThumbnail";
import { Seo } from "../components/Seo";
import { ExpandingSearch } from "../components/interior/expanding-search";
import { SegmentedControl } from "../components/interior/segmented-control";
import { CardLink } from "../components/interior/card-link";
import { Button } from "../components/ui/button";
import { categories } from "../data/categories";
import { getGlossaryTermsForCanonical } from "../data/glossary";
import { catalogRecipes, getMotionCatalogMeta } from "../data/recipes";
import type { Locale, MotionSurfaceType } from "../data/types";
import { pathFor, text } from "../data/site";
import { createRecipeSearchIndex } from "../lib/motion-engine";
import { breadcrumbStructuredData, itemListStructuredData } from "../lib/structured-data";

type SurfaceFilter = "components" | "playgrounds" | "guides";

const surfaceFilters: Array<{ id: SurfaceFilter; surfaceType: MotionSurfaceType; icon: typeof LayoutGrid }> = [
  { id: "components", surfaceType: "component", icon: LayoutGrid },
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

function isCategoryId(value: string | null): value is string {
  return value !== null && categories.some((category) => category.id === value);
}

function readCatalogState(search: string, fallback: SurfaceFilter) {
  const params = new URLSearchParams(search);
  const surface = params.get("surface");
  const category = params.get("category");
  return {
    surface: isSurfaceFilter(surface) ? surface : fallback,
    query: params.get("q") ?? "",
    categoryId: isCategoryId(category) ? category : undefined
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
  const location = useLocation();
  const navigate = useNavigate();
  const [surface, setSurface] = useState<SurfaceFilter>(initialSurface);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>();
  const deferredQuery = useDeferredValue(query);
  const searchRef = useRef<HTMLInputElement>(null);
  const activeFilter = surfaceFilterById.get(surface) ?? surfaceFilters[0];
  const clearFiltersLabel = query && !categoryId
    ? t("catalog.clearSearch")
    : t("catalog.clearFilters");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const state = readCatalogState(location.searchStr, initialSurface);
      setSurface(state.surface);
      setQuery(state.query);
      setCategoryId(state.categoryId);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [initialSurface, locale, location.searchStr]);

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
      const matchesCategory = !categoryId || recipe.categoryId === categoryId;
      return meta.surfaceType === activeFilter.surfaceType
        && matchesCategory
        && (!normalized || createRecipeSearchIndex(recipe, locale).includes(normalized));
    });
  }, [activeFilter.surfaceType, categoryId, deferredQuery, locale]);

  const selectedCategory = categoryId
    ? categories.find((category) => category.id === categoryId)
    : undefined;
  const visibleResultContext = [
    selectedCategory ? text(selectedCategory.name, locale) : t("common.allEntries"),
    deferredQuery.trim() ? `“${deferredQuery.trim()}”` : null
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
  const resultAnnouncement = [
    t(`catalog.surfaces.${activeFilter.surfaceType}.title`),
    selectedCategory ? text(selectedCategory.name, locale) : t("common.allEntries"),
    deferredQuery.trim() ? `“${deferredQuery.trim()}”` : null,
    t("catalog.results", { count: filteredRecipes.length })
  ]
    .filter((part): part is string => Boolean(part))
    .join(locale === "zh" ? "，" : ", ");

  const grouped = categories
    .map((category) => ({ category, entries: filteredRecipes.filter((recipe) => recipe.categoryId === category.id) }))
    .filter((group) => group.entries.length > 0);

  function updateUrl(nextSurface: SurfaceFilter, nextQuery: string, nextCategoryId?: string) {
    setSurface(nextSurface);
    setQuery(nextQuery);
    setCategoryId(nextCategoryId);
    const params = new URLSearchParams();
    params.set("surface", nextSurface);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextCategoryId) params.set("category", nextCategoryId);
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
        image={`/og-primitives-${locale}.png`}
        structuredData={[
          breadcrumbStructuredData(locale, [
            { name: "Motion Lexicon", path: [] },
            { name: t("catalog.title"), path: ["catalog"] }
          ]),
          itemListStructuredData(locale, t("catalog.title"), catalogRecipes)
        ]}
      />

      <section className="library-catalog-hero library-catalog-hero-unified">
        <h1>{t("catalog.title")}</h1>
      </section>

      <nav className="library-category-hub-index" aria-label={locale === "zh" ? "动效基础分类" : "Motion primitive categories"}>
        {categories.map((category) => (
          <Link key={category.id} to="/$locale/$categoryId/" params={{ locale, categoryId: category.id }}>
            {text(category.name, locale)}
          </Link>
        ))}
      </nav>

      <section className="library-catalog-toolbar" aria-label={t("catalog.surfaceLabel")}>
        <div className="library-catalog-toolbar-primary">
          <ExpandingSearch
            id="catalog-search"
            name="catalog-search"
            inputRef={searchRef}
            value={query}
            onChange={(next) => updateUrl(surface, next, categoryId)}
            open
            collapseOnBlur={false}
            align="left"
            label={t("common.search")}
            clearLabel={t("catalog.clearSearch")}
            placeholder={t("catalog.searchPlaceholder")}
            resultCount={filteredRecipes.length}
            controls="catalog-content"
            describedBy="catalog-result-count"
            className="library-catalog-search interior-catalog-search"
          />

          <SegmentedControl
            value={surface}
            onValueChange={(next) => updateUrl(next as SurfaceFilter, query)}
            label={t("catalog.surfaceLabel")}
            className="library-surface-tabs library-surface-control interior-surface-control"
            options={surfaceFilters.map(({ id, icon: Icon }) => ({
              value: id,
              ariaLabel: t(`nav.${id}`),
              label: (
                <span className="interior-surface-option">
                  <Icon aria-hidden="true" size={14} strokeWidth={1.7} />
                  <span>{t(`nav.${id}`)}</span>
                  <small>{surfaceCounts.get(id) ?? 0}</small>
                </span>
              )
            }))}
          />
        </div>

        <div className="library-catalog-toolbar-secondary">
          <CatalogSidebar
            locale={locale}
            compact
            filterMode
            surfaceType={activeFilter.surfaceType}
            resultContext={visibleResultContext}
            resultCount={filteredRecipes.length}
            selectedCategoryId={categoryId}
            onCategoryChange={(nextCategoryId) => updateUrl(surface, query, nextCategoryId)}
          />
        </div>

        <span
          id="catalog-result-count"
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {resultAnnouncement}
        </span>

      </section>

      <div className="library-catalog-layout is-unified" id="catalog-content">
        <div className="library-catalog-results">

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
                    <CardLink
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
                    </CardLink>
                  );
                })}
              </div>
            </section>
          )) : (
            <section className="library-empty-state">
              <h2>{t("common.noRecipesTitle")}</h2>
              <p>{t("catalog.noResultsCopy")}</p>
              <Button type="button" variant="soft" onClick={() => updateUrl(surface, "")}>{clearFiltersLabel}</Button>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
