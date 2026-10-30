import type { ReactNode } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Footer, Nav } from '@/components/Chrome'
import { HTML_LANG } from '@/i18n'
import { PageLink, useLocale, useStrings } from '@/lib/locale'
import { StatsProvider } from '@/lib/stats'
import { BRAND } from '@/site'
import baseCss from '@/styles/base.css?url'
import actionsCss from '@/styles/actions.css?url'
import homeCss from '@/styles/home.css?url'
import entryCss from '@/styles/entry.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'theme-color', content: '#0a0a0b' },
      { title: BRAND.name },
      { name: 'description', content: BRAND.line.en },
      { property: 'og:site_name', content: BRAND.name },
      { property: 'og:locale', content: 'en_US' },
    ],
    links: [
      { rel: 'stylesheet', href: baseCss },
      { rel: 'stylesheet', href: actionsCss },
      { rel: 'stylesheet', href: homeCss },
      { rel: 'stylesheet', href: entryCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      // Instrument Sans for the wordmark only, subset to its letters.
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600&text=Motionboard&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  const s = useStrings()
  return (
    <main className="gut not-found">
      <h1>{s.notFound.title}</h1>
      <PageLink to={{ page: 'home' }} className="btn">
        {s.notFound.browse}
      </PageLink>
    </main>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  const locale = useLocale()
  return (
    <html lang={HTML_LANG[locale]}>
      <head>
        <HeadContent />
      </head>
      <body>
        <StatsProvider>
          <Nav />
          {children}
          <Footer />
        </StatsProvider>
        <Scripts />
      </body>
    </html>
  )
}
