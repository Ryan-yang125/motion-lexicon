// Recipe route loader and head tags per page and locale: localized title and description,
// canonical URL of the page's own locale, and hreflang links to both versions.
import { notFound } from '@tanstack/react-router'
import { HERO } from '@/data/hero'
import { bySlug, media, recipePath, termName, type Term } from '@/data/terms'
import { OG_LOCALE, STRINGS } from '@/i18n'
import { absolute, BRAND, SITE_URL, type Locale } from '@/site'

/** Absolute URL of a page; `path` is the English path, starting with a slash. */
export const pageUrl = (locale: Locale, path: string) => `${SITE_URL}${locale === 'zh' ? '/zh' : ''}${path}`

const alternates = (path: string) => [
  { rel: 'alternate', hrefLang: 'en', href: pageUrl('en', path) },
  { rel: 'alternate', hrefLang: 'zh-CN', href: pageUrl('zh', path) },
  { rel: 'alternate', hrefLang: 'x-default', href: pageUrl('en', path) },
]

const links = (locale: Locale, path: string) => [{ rel: 'canonical', href: pageUrl(locale, path) }, ...alternates(path)]

/** Route loader of the recipe pages in both locales. */
export function loadTerm({ params }: { params: { slug: string } }) {
  const term = bySlug[params.slug]
  if (!term) throw notFound()
  return term
}

export function homeHead(locale: Locale) {
  const line = BRAND.line[locale]
  const url = pageUrl(locale, '/')
  return {
    meta: [
      { title: `${BRAND.name} · ${BRAND.headline[locale]}` },
      { name: 'description', content: line },
      { property: 'og:title', content: BRAND.name },
      { property: 'og:description', content: line },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: OG_LOCALE[locale] },
      { property: 'og:image', content: absolute(HERO[0].poster) },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: links(locale, '/'),
  }
}

export function recipeHead(locale: Locale, t: Term) {
  const title = `${termName(t, locale)} · ${BRAND.name}`
  const description = t.text[locale].def
  const url = pageUrl(locale, recipePath(t))
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: OG_LOCALE[locale] },
      { property: 'og:image', content: absolute(media(t, 'jpg')) },
      { property: 'og:video', content: absolute(media(t, 'mp4')) },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: links(locale, recipePath(t)),
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'DefinedTerm', name: termName(t, locale), description, url }),
      },
    ],
  }
}

export const savedHead = (locale: Locale) => ({
  meta: [{ title: `${STRINGS[locale].saved.title} · ${BRAND.name}` }, { name: 'robots', content: 'noindex' }],
})
