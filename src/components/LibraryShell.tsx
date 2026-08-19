import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { BrandMark } from "./BrandMark";
import {
  BookOpenIcon,
  ComponentLibraryGlyph,
  GithubIcon,
  LanguagesIcon,
  MenuIcon,
  MotionPrimitiveGlyph,
  MotionSkillGlyph,
  SearchIcon
} from "./icons";
import type { CommandItem } from "../registry/components/command-palette";
import { categories } from "../data/categories";
import { registryBlocks } from "../data/block-registry";
import { registryComponents, componentCategories } from "../data/component-registry";
import { catalogRecipes } from "../data/recipes";
import { pathFor, switchLocalePath, text } from "../data/site";
import type { Locale } from "../data/types";
import { useTheme } from "./ThemeProvider";

const repositoryUrl = "https://github.com/Ryan-yang125/motion-lexicon";
function createCommandPalettePromise() {
  return (
  import("../registry/components/command-palette").then((module) => ({
    default: module.CommandPalette
  })));
}
let commandPalettePromise: ReturnType<typeof createCommandPalettePromise> | undefined;
const loadCommandPalette = () => commandPalettePromise ??= createCommandPalettePromise();
const CommandPalette = lazy(loadCommandPalette);

function ThemeGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <g className="shell-theme-sun"><circle cx="8" cy="8" r="2.7" /><path d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M12.6 3.4l-.9.9M4.3 11.7l-.9.9" /></g>
      <path className="shell-theme-moon" d="M12.8 10.6A5.8 5.8 0 0 1 5.4 3.2 5.2 5.2 0 1 0 12.8 10.6Z" />
    </svg>
  );
}

function CloseGlyph() {
  return <svg aria-hidden="true" viewBox="0 0 16 16"><path d="m4 4 8 8M12 4l-8 8" /></svg>;
}

function ShellLink({
  href,
  current,
  children,
  className = "",
  activeRef,
}: {
  href: string;
  current: boolean;
  children: ReactNode;
  className?: string;
  activeRef?: Ref<HTMLAnchorElement>;
}) {
  return (
    <a ref={current ? activeRef : undefined} className={`shell-nav-link${current ? " is-active" : ""} ${className}`.trim()} href={href} aria-current={current ? "page" : undefined}>
      {children}
    </a>
  );
}

function LibrarySidebar({ locale, pathname, onNavigate }: { locale: Locale; pathname: string; onNavigate?: () => void }) {
  const activeLinkRef = useRef<HTMLAnchorElement>(null);
  const activeComponent = pathname.match(/\/components\/([^/]+)/)?.[1];
  const activeBlock = pathname.match(/\/blocks\/([^/]+)/)?.[1];
  const activePrimitive = pathname.match(/\/primitives\/([^/]+)/)?.[1];
  const componentLabel = locale === "zh" ? "组件" : "Components";
  const primitiveLabel = locale === "zh" ? "原子动效" : "Primitives";
  const resourceLabel = locale === "zh" ? "资源" : "Resources";

  useEffect(() => {
    activeLinkRef.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <aside className="library-shell-sidebar" aria-label={locale === "zh" ? "站点导航" : "Site navigation"}>
      <div className="shell-brand-row">
        <Link to="/$locale/" params={{ locale }} className="shell-brand" onClick={onNavigate}>
          <BrandMark className="shell-brand-mark" />
          <span>Motion Lexicon</span>
        </Link>
      </div>

      <nav className="shell-nav-scroll">
        <section className="shell-nav-section">
          <ShellLink
            href={pathFor(locale, ["components"])}
            current={pathname === pathFor(locale, ["components"])}
            className="shell-nav-heading"
            activeRef={activeLinkRef}
          >
            <ComponentLibraryGlyph size={15} strokeWidth={1.45} aria-hidden="true" />
            <span>{componentLabel}</span>
            <small>{registryComponents.length}</small>
          </ShellLink>
          {componentCategories.map((category) => {
            const entries = registryComponents.filter((entry) => entry.category === category.id);
            return (
              <div className="shell-nav-group" key={category.id}>
                <span className="shell-nav-group-label">{text(category.name, locale)}</span>
                {entries.map((entry) => (
                  <ShellLink
                    href={pathFor(locale, ["components", entry.id])}
                    current={activeComponent === entry.id}
                    activeRef={activeLinkRef}
                    key={entry.id}
                  >
                    {text(entry.name, locale)}
                  </ShellLink>
                ))}
              </div>
            );
          })}
        </section>

        <section className="shell-nav-section">
          <ShellLink
            href={pathFor(locale, ["blocks"])}
            current={pathname === pathFor(locale, ["blocks"])}
            className="shell-nav-heading"
            activeRef={activeLinkRef}
          >
            <ComponentLibraryGlyph size={15} strokeWidth={1.45} aria-hidden="true" />
            <span>{locale === "zh" ? "页面 Blocks" : "Page Blocks"}</span>
            <small>{registryBlocks.length}</small>
          </ShellLink>
          <div className="shell-nav-group">
            {registryBlocks.map((entry) => (
              <ShellLink
                href={pathFor(locale, ["blocks", entry.id])}
                current={activeBlock === entry.id}
                activeRef={activeLinkRef}
                key={entry.id}
              >
                {text(entry.name, locale)}
              </ShellLink>
            ))}
          </div>
        </section>

        <section className="shell-nav-section">
          <ShellLink href={pathFor(locale, ["primitives"])} current={pathname === pathFor(locale, ["primitives"])} className="shell-nav-heading" activeRef={activeLinkRef}>
            <MotionPrimitiveGlyph size={15} aria-hidden="true" />
            <span>{primitiveLabel}</span>
            <small>{catalogRecipes.length}</small>
          </ShellLink>
          <div className="shell-nav-group shell-primitive-groups">
            {categories.map((category) => (
              <a
                className={`shell-nav-link${activePrimitive && catalogRecipes.some((entry) => entry.id === activePrimitive && entry.categoryId === category.id) ? " is-context" : ""}`}
                href={`${pathFor(locale, ["primitives"])}?category=${category.id}`}
                key={category.id}
              >
                {text(category.name, locale)}
              </a>
            ))}
          </div>
        </section>

        <section className="shell-nav-section">
          <span className="shell-nav-section-title">{resourceLabel}</span>
          <ShellLink href={pathFor(locale, ["vocabulary"])} current={pathname.includes("/vocabulary/")} activeRef={activeLinkRef}>
            <MotionPrimitiveGlyph size={14} aria-hidden="true" />
            <span>{locale === "zh" ? "动效词汇" : "Vocabulary"}</span>
          </ShellLink>
          <ShellLink href={pathFor(locale, ["guides"])} current={pathname.includes("/guides/")} activeRef={activeLinkRef}>
            <BookOpenIcon size={14} aria-hidden="true" />
            <span>{locale === "zh" ? "场景指南" : "Guides"}</span>
          </ShellLink>
          <ShellLink href={pathFor(locale, ["skill"])} current={pathname.includes("/skill/")} activeRef={activeLinkRef}>
            <MotionSkillGlyph size={14} aria-hidden="true" />
            <span>Agent Skill</span>
          </ShellLink>
          <a className="shell-nav-link" href={repositoryUrl} target="_blank" rel="noreferrer">
            <GithubIcon size={14} aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </section>
      </nav>
    </aside>
  );
}

export function LibraryShell({ locale }: { locale: Locale }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const landing = location.pathname === pathFor(locale) || location.pathname === "/";
  const otherLocale: Locale = locale === "zh" ? "en" : "zh";
  const languageHref = `${switchLocalePath(location.pathname, otherLocale)}${location.searchStr}${location.hash}`;

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        void loadCommandPalette();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const returnFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : mobileTriggerRef.current;
    const background = [desktopRef.current, headerRef.current, mainRef.current].filter(
      (node): node is HTMLElement => Boolean(node)
    );
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousPaddingRight = root.style.paddingRight;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    for (const node of background) {
      node.inert = true;
      node.setAttribute("aria-hidden", "true");
    }
    root.style.overflow = "hidden";
    if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;

    const focusableSelector = [
      "button:not([disabled])",
      "[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    mobileDialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        mobileDialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      ).filter((node) => !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        mobileDialogRef.current?.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !mobileDialogRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !mobileDialogRef.current?.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      for (const node of background) {
        node.inert = false;
        node.removeAttribute("aria-hidden");
      }
      root.style.overflow = previousOverflow;
      root.style.paddingRight = previousPaddingRight;
      requestAnimationFrame(() => returnFocus?.focus({ preventScroll: true }));
    };
  }, [mobileOpen]);

  const searchItems = useMemo<CommandItem[]>(() => [
    ...registryBlocks.map((entry) => ({
      id: `block:${entry.id}`,
      label: text(entry.name, locale),
      hint: locale === "zh" ? "页面 Block" : "Page Block",
      keywords: `${entry.id} ${entry.name.zh} ${entry.name.en} ${entry.description.zh} ${entry.description.en}`
    })),
    ...registryComponents.map((entry) => ({
      id: `component:${entry.id}`,
      label: text(entry.name, locale),
      hint: locale === "zh" ? "组件" : "Component",
      keywords: `${entry.id} ${entry.name.zh} ${entry.name.en} ${entry.description.zh} ${entry.description.en}`
    })),
    ...catalogRecipes.map((entry) => ({
      id: `primitive:${entry.id}`,
      label: text(entry.name, locale),
      hint: locale === "zh" ? "原子动效" : "Primitive",
      keywords: `${entry.id} ${entry.name.zh} ${entry.name.en} ${entry.shortDescription.zh} ${entry.shortDescription.en}`
    }))
  ], [locale]);

  function selectSearch(item: CommandItem) {
    const [kind, id] = item.id.split(":");
    const href = pathFor(locale, [kind === "component" ? "components" : kind === "block" ? "blocks" : "primitives", id]);
    setSearchOpen(false);
    void navigate({ href });
  }

  function dismissSearch() {
    setSearchOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => searchTriggerRef.current?.focus({ preventScroll: true }));
    });
  }

  return (
    <div className={`library-shell${landing ? " is-landing" : ""}`}>
      {!landing ? (
        <div className="library-shell-desktop" ref={desktopRef}>
          <LibrarySidebar locale={locale} pathname={location.pathname} />
        </div>
      ) : null}

      <header className={`library-shell-header${landing ? " is-landing" : ""}`} ref={headerRef}>
        {landing ? (
          <>
            <div className="shell-landing-start">
              <button ref={mobileTriggerRef} className="shell-icon-button shell-mobile-menu" type="button" onClick={() => setMobileOpen(true)} aria-haspopup="dialog" aria-expanded={mobileOpen} aria-label={locale === "zh" ? "打开导航" : "Open navigation"}>
                <MenuIcon size={16} aria-hidden="true" />
              </button>
              <Link to="/$locale/" params={{ locale }} className="shell-brand" aria-label="Motion Lexicon">
                <BrandMark className="shell-brand-mark" />
                <span>Motion Lexicon</span>
              </Link>
            </div>
            <nav className="shell-landing-nav" aria-label={locale === "zh" ? "主要导航" : "Primary navigation"}>
              <Link to="/$locale/components/" params={{ locale }}>{locale === "zh" ? "组件" : "Components"}</Link>
              <Link to="/$locale/blocks/" params={{ locale }}>{locale === "zh" ? "页面 Blocks" : "Page Blocks"}</Link>
              <Link to="/$locale/primitives/" params={{ locale }}>{locale === "zh" ? "原子动效" : "Primitives"}</Link>
              <Link to="/$locale/vocabulary/" params={{ locale }}>{locale === "zh" ? "动效词汇" : "Vocabulary"}</Link>
              <Link to="/$locale/guides/" params={{ locale }}>{locale === "zh" ? "指南" : "Guides"}</Link>
            </nav>
          </>
        ) : (
          <>
            <button ref={mobileTriggerRef} className="shell-icon-button shell-mobile-menu" type="button" onClick={() => setMobileOpen(true)} aria-haspopup="dialog" aria-expanded={mobileOpen} aria-label={locale === "zh" ? "打开导航" : "Open navigation"}>
              <MenuIcon size={16} aria-hidden="true" />
            </button>
            <button
              ref={searchTriggerRef}
              className="shell-search-trigger"
              type="button"
              onClick={() => {
                void loadCommandPalette();
                setSearchOpen(true);
              }}
              onFocus={() => void loadCommandPalette()}
              onMouseEnter={() => void loadCommandPalette()}
            >
              <SearchIcon size={14} aria-hidden="true" />
              <span>{locale === "zh" ? "搜索组件与动效" : "Search components and motion"}</span>
              <kbd>⌘ K</kbd>
            </button>
          </>
        )}
        <div className="shell-header-actions">
          <a className="shell-icon-button" href={languageHref} aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}>
            <LanguagesIcon size={15} aria-hidden="true" />
          </a>
          <button className="shell-icon-button shell-theme-button" type="button" onClick={() => setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")} aria-label={locale === "zh" ? "切换明暗主题" : "Toggle color theme"}>
            <ThemeGlyph />
          </button>
          <Link className="shell-header-link" to="/$locale/skill/" params={{ locale }} aria-label="Skill">
            <MotionSkillGlyph size={15} aria-hidden="true" />
            <span>Skill</span>
          </Link>
          <a className="shell-header-link" href={repositoryUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon size={15} aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      <main className={`library-shell-main${landing ? " is-landing" : ""}`} id="main-content" tabIndex={-1} ref={mainRef}>
        <Outlet />
      </main>

      {mobileOpen ? (
        <div className="shell-mobile-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setMobileOpen(false)}>
          <div ref={mobileDialogRef} className="shell-mobile-panel" role="dialog" aria-modal="true" aria-label={locale === "zh" ? "站点导航" : "Site navigation"} tabIndex={-1}>
            <button className="shell-icon-button shell-mobile-close" type="button" onClick={() => setMobileOpen(false)} aria-label={locale === "zh" ? "关闭导航" : "Close navigation"}>
              <CloseGlyph />
            </button>
            <LibrarySidebar locale={locale} pathname={location.pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      {searchOpen ? (
        <Suspense fallback={null}>
          <CommandPalette
            open
            items={searchItems}
            onDismiss={dismissSearch}
            onSelect={selectSearch}
            label={locale === "zh" ? "搜索 Motion Lexicon" : "Search Motion Lexicon"}
            placeholder={locale === "zh" ? "搜索组件或原子动效" : "Search components or primitives"}
            emptyLabel={locale === "zh" ? "没有匹配结果" : "No matching result"}
            maxRows={8}
          />
        </Suspense>
      ) : null}
    </div>
  );
}
