// Typed access to the recipe data. terms.json holds the source data with the Chinese copy; en.json
// holds the English copy, keyed by slug. Both end up in term.text[locale].
// Adding a film: an entry in both files, then media/<video>.mp4, <video>-s.mp4, <video>.jpg (uploaded to R2)
// and the runnable HyperFrames folder in skills/motionboard/source/<video>/ (copied to public/source at build).
import raw from './terms.json'
import enRaw from './en.json'
import { MEDIA_URL, type Locale } from '@/site'

export type Category = 'A' | 'B' | 'C' | 'D' | 'E'

/** Where the shot sits in a promo film */
export type Position = 'open' | 'reveal' | 'feature' | 'bridge' | 'close'

export type Sample = { t: string; id: string; at: string; s?: number; u?: string }

/** Copy for one recipe in one locale */
export type RecipeText = {
  /** one-line concept */
  def: string
  why: string
  /** [label, value]; value may contain <code> markup */
  spec: [string, string][]
  prompt: string
  /** how people describe the shot in their own words */
  says: string[]
  /** [other recipe's slug, how they differ] */
  vs: [string, string][]
}

type RawTerm = {
  n: number
  slug: string
  cat: Category
  pos: Position
  zh: string
  en: string
  star: boolean
  samples: Sample[]
  video: string
  zh1: string
  why: string
  spec: [string, string][]
  prompt: string
  says: string[]
  /** [Chinese name of the other recipe, how they differ] */
  vs: [string, string][]
}

export type Term = RawTerm & { text: Record<Locale, RecipeText> }

/** A playable source: a YouTube range, or an external page (Arion lives on X). */
export type Source = {
  title: string
  brand: string
  range: string
  note: string
  href: string
  youtube: { id: string; start: number; end: number } | null
  /** self-hosted silent clip of the original range */
  clip: { src: string; poster: string } | null
}

export const POSITION_ORDER: Position[] = ['open', 'reveal', 'feature', 'bridge', 'close']

const en = enRaw as unknown as Record<string, RecipeText>
const rawTerms = raw as unknown as RawTerm[]
const slugByZh = Object.fromEntries(rawTerms.map((t) => [t.zh, t.slug]))

const zhText = (t: RawTerm): RecipeText => ({
  def: t.zh1,
  why: t.why,
  spec: t.spec,
  prompt: t.prompt,
  says: t.says,
  // a source reference to a recipe that is not on the site is dropped
  vs: t.vs.flatMap(([zh, text]) => (slugByZh[zh] ? [[slugByZh[zh], text] as [string, string]] : [])),
})

export const terms: Term[] = rawTerms.map((t) => ({ ...t, text: { en: en[t.slug], zh: zhText(t) } }))
export const bySlug: Record<string, Term> = Object.fromEntries(terms.map((t) => [t.slug, t]))

/** Site order: by position in a film, then by number */
export const order = [...terms].sort((a, b) => POSITION_ORDER.indexOf(a.pos) - POSITION_ORDER.indexOf(b.pos) || a.n - b.n)
export const byPos = (p: Position) => order.filter((t) => t.pos === p)

export const num = (t: Term) => String(t.n).padStart(2, '0')
/** full film, small grid preview, poster */
export const media = (t: Term, kind: 'mp4' | 'small' | 'jpg') =>
  kind === 'small' ? `${MEDIA_URL}/${t.video}-s.mp4` : `${MEDIA_URL}/${t.video}.${kind}`
export const recipePath = (t: Term) => `/recipes/${t.slug}/`
export const recipeFile = (t: Term) => `/r/${t.slug}.md`
/** Display name in the given locale */
export const termName = (t: Term, locale: Locale) => (locale === 'zh' ? t.zh : t.en)

const ARION = 'https://x.com/Stv_Lynn/status/2114270956218892747'
const sec = (x: string) => x.split(':').reduce((a, b) => a * 60 + Number(b), 0)

// Sample titles and ranges are stored in Chinese; English pages show these translations.
const TITLE_EN: Record<string, string> = {
  'Apple A19 Pro 芯片': 'Apple A19 Pro chip',
  'Linear 发布片': 'Linear launch film',
  'ARION 输入法 onboarding': 'ARION keyboard onboarding',
}
const RANGE_EN: Record<string, string> = { 全片: 'Full film' }

export function sources(t: Term, locale: Locale): Source[] {
  const title = (s: Sample) => (locale === 'en' ? (TITLE_EN[s.t] ?? s.t) : s.t)
  return t.samples
    .filter((s) => s.id !== 'LOCAL')
    .map((s) => {
      if (s.id === 'ARION') {
        const range = locale === 'en' ? (RANGE_EN[s.at] ?? s.at) : s.at
        return { title: title(s), brand: 'Arion', range, note: '', href: ARION, youtube: null, clip: null }
      }
      const m = s.at.match(/^(\d+:\d\d)(?:[–-](\d+:\d\d))?(.*)$/)
      const start = m ? sec(m[1]) : (s.s ?? 0)
      const end = Math.max(m?.[2] ? sec(m[2]) : start + 4, start + 3)
      return {
        title: title(s),
        brand: s.t.split(' ')[0],
        range: m ? (m[2] ? `${m[1]}–${m[2]}` : m[1]) : s.at,
        note: '',
        href: `https://www.youtube.com/watch?v=${s.id}&t=${start}s`,
        youtube: { id: s.id, start, end },
        clip: {
          src: `${MEDIA_URL}/orig-${s.id}-${start}.mp4`,
          poster: `${MEDIA_URL}/orig-${s.id}-${start}.jpg`,
        },
      }
    })
}
