import { Link } from "@tanstack/react-router";
import { Search } from "./icons";
import { useDeferredValue, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { categories } from "../data/categories";
import { catalogRecipes, getMotionCatalogMeta } from "../data/recipes";
import type { Locale, MotionSurfaceType } from "../data/types";
import { text } from "../data/site";
import { createRecipeSearchIndex } from "../lib/motion-engine";
import { Dropdown } from "./interior/dropdown";

type CatalogSidebarProps = {
  locale: Locale;
  activeCategoryId?: string;
  activeRecipeId?: string;
  compact?: boolean;
  surfaceType?: MotionSurfaceType;
  filterMode?: boolean;
  resultContext?: string;
  resultCount?: number;
  selectedCategoryId?: string;
  onCategoryChange?: (categoryId?: string) => void;
};

export function CatalogSidebar({
  locale,
  activeCategoryId,
  activeRecipeId,
  compact = false,
  surfaceType,
  filterMode = false,
  resultContext,
  resultCount,
  selectedCategoryId,
  onCategoryChange
}: CatalogSidebarProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredRecipes = useMemo(() => {
    return catalogRecipes.filter((recipe) => {
      const meta = getMotionCatalogMeta(recipe);
      const matchesSurface = !surfaceType || meta.surfaceType === surfaceType;
      const matchesQuery = !normalizedQuery || createRecipeSearchIndex(recipe, locale).includes(normalizedQuery);
      return matchesSurface && matchesQuery;
    });
  }, [locale, normalizedQuery, surfaceType]);

  const groupedCategories = categories
    .map((category) => ({
      category,
      entries: filteredRecipes.filter((recipe) => recipe.categoryId === category.id)
    }))
    .filter((group) => group.entries.length > 0);

  if (filterMode) {
    const selectedGroup = groupedCategories.find(({ category }) => category.id === selectedCategoryId);
    const currentLabel = selectedGroup
      ? text(selectedGroup.category.name, locale)
      : t("common.allEntries");
    return (
      <div className="library-category-filter" aria-label={t("common.category")}>
        <div className="library-category-filter-heading" aria-hidden="true">
          <span>{resultContext ?? t("common.allEntries")}</span>
          <small>{t("catalog.results", { count: resultCount ?? filteredRecipes.length })}</small>
        </div>
        <Dropdown
          value={selectedCategoryId ?? "all"}
          onChange={(next) => onCategoryChange?.(next === "all" ? undefined : next)}
          label={t("common.category")}
          placeholder={currentLabel}
          className="library-category-filter-options interior-category-dropdown"
          items={[
            {
              value: "all",
              label: t("common.allEntries"),
              hint: String(filteredRecipes.length)
            },
            ...groupedCategories.map(({ category, entries }) => ({
              value: category.id,
              label: text(category.name, locale),
              hint: String(entries.length)
            }))
          ]}
        />
      </div>
    );
  }

  return (
    <aside className={compact ? "library-sidebar is-compact" : "library-sidebar"} aria-label={t("catalog.indexTitle")}>
      <div className="library-sidebar-head">
        <strong>{surfaceType ? t(`catalog.surfaces.${surfaceType}.label`) : t("catalog.libraryLabel")}</strong>
        <span>{filteredRecipes.length}</span>
      </div>

      {!compact ? (
        <label className="library-sidebar-search">
          <Search aria-hidden="true" size={14} strokeWidth={1.8} />
          <input
            name="sidebar-search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder={t("common.searchPlaceholder")}
            aria-label={t("common.search")}
          />
        </label>
      ) : null}

      <nav className="library-sidebar-nav">
        {groupedCategories.map(({ category, entries }) => (
          <section key={category.id} className={category.id === activeCategoryId ? "is-active" : undefined}>
            <Link
              className="library-sidebar-category"
              to="/$locale/$categoryId/"
              params={{ locale, categoryId: category.id }}
            >
              <span>{text(category.name, locale)}</span>
              <small>{entries.length}</small>
            </Link>
            {!compact ? (
              <div className="library-sidebar-entries">
                {entries.map((recipe) => (
                  <Link
                    key={recipe.id}
                    className={recipe.id === activeRecipeId ? "is-current" : undefined}
                    to="/$locale/$categoryId/$recipeId/"
                    params={{ locale, categoryId: recipe.categoryId, recipeId: recipe.id }}
                    aria-current={recipe.id === activeRecipeId ? "page" : undefined}
                  >
                    {text(recipe.name, locale)}
                  </Link>
                ))}
              </div>
            ) : null}
          </section>
        ))}
      </nav>

      {filteredRecipes.length === 0 ? <p className="library-sidebar-empty">{t("common.noResults")}</p> : null}
    </aside>
  );
}
