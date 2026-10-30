import { useLocation } from '@tanstack/react-router'
import { HTML_LANG } from '@/i18n'
import { PageLink, switchPath, useLocale, useStrings } from '@/lib/locale'
import { useSaved } from '@/lib/saved'
import { BRAND, GITHUB_URL, LICENSE_URL } from '@/site'

// Match cut: a circle cut to a square in the same position.
export function Logo() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 2a14 14 0 0 0 0 28z" />
      <path d="M18 2h9a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3h-9z" />
    </svg>
  )
}

// GitHub mark; lucide has no brand icons. Shown instead of the word on narrow screens.
function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

export function Nav() {
  const { saved } = useSaved()
  const locale = useLocale()
  const s = useStrings()
  const pathname = useLocation({ select: (l) => l.pathname })
  const other = locale === 'zh' ? 'en' : 'zh'
  return (
    <header className="nav gut">
      <PageLink to={{ page: 'home' }} className="mark" aria-label={BRAND.name}>
        <Logo />
        {BRAND.name}
      </PageLink>
      <nav>
        <PageLink to={{ page: 'home', hash: 'recipes' }} className="nav-recipes">
          {s.nav.recipes}
        </PageLink>
        <PageLink to={{ page: 'saved' }}>
          {s.nav.saved} {saved.length > 0 && <b>{saved.length}</b>}
        </PageLink>
        <a href={GITHUB_URL} target="_blank" rel="noopener" className="nav-gh" aria-label={s.nav.github}>
          <span className="nav-gh-t">{s.nav.github}</span>
          <GitHubMark />
        </a>
        {/* full page load: the document language changes with the locale */}
        <a href={switchPath(pathname, other)} className="nav-lang" hrefLang={HTML_LANG[other]} lang={HTML_LANG[other]} aria-label={s.lang.aria}>
          {s.lang.label}
        </a>
      </nav>
    </header>
  )
}

export function Footer() {
  const s = useStrings()
  return (
    <footer className="foot gut">
      <span>{BRAND.name}</span>
      <span>
        {s.foot.credit} ·{' '}
        <a href={LICENSE_URL} target="_blank" rel="noopener">
          {s.foot.license}
        </a>
      </span>
    </footer>
  )
}
