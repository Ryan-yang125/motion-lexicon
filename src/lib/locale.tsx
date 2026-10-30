// The locale comes from the URL: paths under /zh/ are Chinese, everything else English.
import { useCallback, type MouseEventHandler, type ReactNode, type Ref } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { STRINGS } from '@/i18n'
import type { Locale } from '@/site'

export const localeOf = (pathname: string): Locale => (pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en')

/** The same page in the other locale, as a path. */
export function switchPath(pathname: string, to: Locale) {
  const base = localeOf(pathname) === 'zh' ? pathname.slice(3) || '/' : pathname
  return to === 'zh' ? `/zh${base}` : base
}

export const useLocale = () => useLocation({ select: (l) => localeOf(l.pathname) })

export const useStrings = () => STRINGS[useLocale()]

type Page = { page: 'home'; hash?: string } | { page: 'saved' } | { page: 'recipe'; slug: string }

type PageLinkProps = {
  to: Page
  className?: string
  ref?: Ref<HTMLAnchorElement>
  onClick?: MouseEventHandler<HTMLAnchorElement>
  'aria-label'?: string
  children?: ReactNode
}

/** Internal link that stays inside the current locale. */
export function PageLink({ to, ...rest }: PageLinkProps) {
  const zh = useLocale() === 'zh'
  if (to.page === 'recipe') {
    const params = { slug: to.slug }
    return zh ? <Link to="/zh/recipes/$slug/" params={params} {...rest} /> : <Link to="/recipes/$slug/" params={params} {...rest} />
  }
  if (to.page === 'saved') return zh ? <Link to="/zh/saved/" {...rest} /> : <Link to="/saved/" {...rest} />
  return zh ? <Link to="/zh/" hash={to.hash} {...rest} /> : <Link to="/" hash={to.hash} {...rest} />
}

/** Client-side navigation to a recipe page in the current locale. */
export function useGoToRecipe() {
  const navigate = useNavigate()
  const zh = useLocale() === 'zh'
  return useCallback(
    (slug: string) => {
      if (zh) navigate({ to: '/zh/recipes/$slug/', params: { slug } })
      else navigate({ to: '/recipes/$slug/', params: { slug } })
    },
    [navigate, zh],
  )
}
