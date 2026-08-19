import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowRightIcon } from "../components/icons";
import { Seo } from "../components/Seo";
import { componentCategories, registryComponents, type ComponentCategory } from "../data/component-registry";
import { pathFor, text } from "../data/site";
import type { Locale } from "../data/types";
import { RegistryPreview } from "../registry/preview-map";

function validCategory(id: string | null) {
  return componentCategories.some((category) => category.id === id)
    ? id as ComponentCategory
    : undefined;
}

export function ComponentsPage({ locale }: { locale: Locale }) {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = new URLSearchParams(location.searchStr);
  const [query, setQuery] = useState(initial.get("q") ?? "");
  const [category, setCategory] = useState<ComponentCategory | undefined>(validCategory(initial.get("category")));
  const deferredQuery = useDeferredValue(query);
  const copy = locale === "zh"
    ? { title: "可直接复制的 React 动效组件", description: "覆盖产品界面、媒体、视觉与交互的完整动效实现。", open: "查看组件", all: "全部", search: "搜索组件", count: `${registryComponents.length} 个组件`, featured: "12 个旗舰组件" }
    : { title: "Copy-ready React motion components", description: "Complete motion implementations for product UI, media, visual scenes, and interaction.", open: "Open component", all: "All", search: "Search components", count: `${registryComponents.length} components`, featured: "12 flagship components" };
  useEffect(() => {
    const params = new URLSearchParams(location.searchStr);
    setQuery(params.get("q") ?? "");
    setCategory(validCategory(params.get("category")));
  }, [location.searchStr]);
  const normalized = deferredQuery.trim().toLocaleLowerCase();
  const visible = useMemo(() => registryComponents.filter((entry) => {
    const matchesCategory = !category || entry.category === category;
    const haystack = `${entry.id} ${entry.name.zh} ${entry.name.en} ${entry.description.zh} ${entry.description.en}`.toLocaleLowerCase();
    return matchesCategory && (!normalized || haystack.includes(normalized));
  }), [category, normalized]);
  const featured = registryComponents.filter((entry) => entry.featured).slice(0, 12);
  const update = (nextQuery: string, nextCategory?: ComponentCategory) => {
    setQuery(nextQuery);
    setCategory(nextCategory);
    const params = new URLSearchParams();
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextCategory) params.set("category", nextCategory);
    const search = params.toString();
    void navigate({ href: `${pathFor(locale, ["components"])}${search ? `?${search}` : ""}`, replace: true, resetScroll: false });
  };

  return <>
    <Seo locale={locale} title={`${copy.title} — Motion Lexicon`} description={copy.description} path={pathFor(locale, ["components"])} image={`/og-components-${locale}.png`} />
    <div className="directory-page v6-directory-page">
      <header className="directory-hero">
        <span className="directory-kicker">React · Motion · shadcn registry</span>
        <h1>{copy.title}</h1>
        <div className="directory-hero-meta"><span>{copy.count}</span><span>{componentCategories.length} {locale === "zh" ? "个类别" : "categories"}</span><code>npx shadcn@latest add</code></div>
      </header>
      <section className="component-directory-section" aria-labelledby="featured-components">
        <header className="directory-section-heading"><h2 id="featured-components">{locale === "zh" ? "旗舰组件" : "Flagship components"}</h2><span>{copy.featured} · {featured.length}</span></header>
        <div className="component-card-grid v6-flagship-grid">{featured.map((entry, index) => <ComponentCard entry={entry} locale={locale} label={copy.open} featured={index === 0} key={entry.id} />)}</div>
      </section>
      <section className="component-directory-section" aria-labelledby="component-catalog">
        <header className="directory-section-heading"><h2 id="component-catalog">{locale === "zh" ? "完整目录" : "Full catalog"}</h2><span>{visible.length}</span></header>
        <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3 dark:border-white/10">
          <label className="sr-only" htmlFor="component-directory-search">{copy.search}</label>
          <input id="component-directory-search" value={query} onChange={(event) => update(event.target.value, category)} placeholder={copy.search} className="min-h-11 min-w-[13rem] flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-white/10 dark:bg-[#1b1b1b]" />
          <button type="button" onClick={() => update(query)} aria-pressed={!category} className={`min-h-11 rounded-lg border px-3 text-[11px] ${!category ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 dark:border-white/10"}`}>{copy.all}</button>
          {componentCategories.map((item) => <button type="button" key={item.id} onClick={() => update(query, item.id)} aria-pressed={category === item.id} className={`min-h-11 rounded-lg border px-3 text-[11px] ${category === item.id ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950" : "border-neutral-200 dark:border-white/10"}`}>{text(item.name, locale)} <span className="font-mono text-[9px] opacity-70">{registryComponents.filter((entry) => entry.category === item.id).length}</span></button>)}
        </div>
        <div className="component-card-grid v6-catalog-grid mt-5">{visible.map((entry) => <ComponentCard entry={entry} locale={locale} label={copy.open} key={entry.id} />)}</div>
      </section>
    </div>
  </>;
}

function ComponentCard({ entry, locale, label, featured = false }: { entry: (typeof registryComponents)[number]; locale: Locale; label: string; featured?: boolean }) {
  return <article className={`component-card v6-component-card is-${entry.sceneFamily}${featured ? " is-featured" : ""}`}>
    <div className="component-card-stage"><RegistryPreview id={entry.id} locale={locale} deferred /></div>
    <Link className="component-card-footer" to="/$locale/components/$componentId/" params={{ locale, componentId: entry.id }} aria-label={`${label}: ${text(entry.name, locale)}`}><span><strong>{text(entry.name, locale)}</strong><code>{entry.id}</code></span><span className="v6-card-runtime">{entry.runtimeCost ?? "light"} · {(entry.engines ?? ["motion"]).join("+")}</span><ArrowRightIcon size={15} aria-hidden="true" /></Link>
  </article>;
}
