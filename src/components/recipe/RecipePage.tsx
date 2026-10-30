import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CopyAction, LikeButton, SaveButton, WishButton } from '@/components/actions'
import { TileGrid } from '@/components/TileGrid'
import { FullRecipe } from '@/components/recipe/FullRecipe'
import { Compare } from '@/components/recipe/Compare'
import { Player } from '@/components/recipe/Player'
import { SourceClip } from '@/components/recipe/SourceClip'
import { byPos, order, sources, termName, type Term } from '@/data/terms'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { PageLink, useGoToRecipe, useLocale, useStrings } from '@/lib/locale'
import { useStat } from '@/lib/stats'

const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))

export function RecipePage({ term: t }: { term: Term }) {
  const root = useRef<HTMLDivElement>(null)
  const goTo = useGoToRecipe()
  const locale = useLocale()
  const s = useStrings()
  const { copies } = useStat(t.slug)

  const i = order.findIndex((x) => x.slug === t.slug)
  const prev = order[(i - 1 + order.length) % order.length]
  const next = order[(i + 1) % order.length]
  const clips = sources(t, locale)
  // Selected source index, tied to the slug so navigating to another recipe starts at the first source.
  const [pick, setPick] = useState({ slug: t.slug, k: 0 })
  const k = pick.slug === t.slug ? pick.k : 0
  const selected = clips[k]
  const compare = useRef<HTMLDivElement>(null)
  const more = byPos(t.pos).filter((x) => x.slug !== t.slug)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || typing(e.target)) return
      if (e.key === 'ArrowLeft') goTo(prev.slug)
      else if (e.key === 'ArrowRight') goTo(next.slug)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, prev.slug, next.slug])

  const select = (idx: number) => {
    setPick({ slug: t.slug, k: idx })
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    compare.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  // Lower sections fade up once as they scroll into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('[data-rv]').forEach((el) => {
          gsap.from(el, {
            y: 18,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
        ScrollTrigger.refresh()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <main className="wrap gut rc" ref={root}>
      <div className="rc-col">
        <div className="rc-top">
          <nav className="rc-crumbs" aria-label={s.recipe.breadcrumb}>
            <PageLink to={{ page: 'home', hash: 'recipes' }}>{s.nav.recipes}</PageLink>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{s.positions[t.pos]}</span>
          </nav>
          <div className="rc-step">
            <PageLink to={{ page: 'recipe', slug: prev.slug }} className="btn ghost icon" aria-label={s.recipe.prev(termName(prev, locale))}>
              <ChevronLeft aria-hidden="true" />
            </PageLink>
            <PageLink to={{ page: 'recipe', slug: next.slug }} className="btn ghost icon" aria-label={s.recipe.next(termName(next, locale))}>
              <ChevronRight aria-hidden="true" />
            </PageLink>
          </div>
        </div>
      </div>

      <div className="rc-compare" ref={compare}>
        {selected ? <Compare term={t} source={selected} /> : <Player term={t} />}
      </div>

      <div className="rc-col">
        <header className="rc-head">
          <h1 style={{ viewTransitionName: 'title' }}>{termName(t, locale)}</h1>
          <p>{t.text[locale].def}</p>
        </header>

        <div className="rc-actions">
          <CopyAction term={t} />
          <LikeButton slug={t.slug} />
          <SaveButton slug={t.slug} />
          {copies > 0 && <span className="mono rc-copies">{s.recipe.copiedTimes(copies)}</span>}
          <div className="rc-wish">
            <WishButton slug={t.slug} />
          </div>
        </div>

        {clips.length > 1 && (
          <section className="rc-sec" data-rv>
            <h2>{s.recipe.seenIn}</h2>
            <div className="clips">
              {clips.map((c, idx) => (
                <SourceClip key={`${c.href}-${idx}`} source={c} selected={idx === k} onSelect={() => select(idx)} />
              ))}
            </div>
          </section>
        )}

        <section className="rc-sec">
          <FullRecipe term={t} />
        </section>

      </div>
      {more.length > 0 && (
        <section className="rc-sec" data-rv>
          <h2>{s.recipe.more(s.positions[t.pos])}</h2>
          <TileGrid terms={more} />
        </section>
      )}
    </main>
  )
}
