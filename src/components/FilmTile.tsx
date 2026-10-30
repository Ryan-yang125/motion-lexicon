import { useCallback, useEffect, useRef, useState } from 'react'
import type { FocusEvent, MouseEvent, PointerEvent } from 'react'
import { CopyAction, LikeButton, SaveButton } from '@/components/actions'
import { media, termName } from '@/data/terms'
import type { Term } from '@/data/terms'
import { PageLink, useLocale, useStrings } from '@/lib/locale'

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Touch devices have no hover: of the tiles on screen, the one whose center is nearest the
// viewport center plays, one at a time. One observer and one scroll listener serve all tiles.
type Ctl = { play(): void; stop(): void }
const ctls = new WeakMap<Element, Ctl>()
const visible = new Set<Element>()
let playing: Element | null = null
let io: IntersectionObserver | null = null
let raf = 0

function pick() {
  raf = 0
  const mid = innerHeight / 2
  let best: Element | null = null
  let bestD = Infinity
  for (const el of visible) {
    const r = el.getBoundingClientRect()
    const d = Math.abs(r.top + r.height / 2 - mid)
    if (d < bestD) {
      best = el
      bestD = d
    }
  }
  if (best === playing) return
  if (playing) ctls.get(playing)?.stop()
  playing = best
  if (best) ctls.get(best)?.play()
}

const schedule = () => {
  if (!raf) raf = requestAnimationFrame(pick)
}

function watchTouch(el: Element, ctl: Ctl) {
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      schedule()
    })
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
  }
  ctls.set(el, ctl)
  io.observe(el)
  return () => {
    io?.unobserve(el)
    visible.delete(el)
    ctls.delete(el)
    if (playing === el) {
      ctl.stop()
      playing = null
    }
  }
}

export function FilmTile({ term, eager = false }: { term: Term; eager?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const title = useRef<HTMLAnchorElement>(null)
  const [live, setLive] = useState(false)
  const locale = useLocale()
  const s = useStrings()
  const src = media(term, 'small')

  const play = useCallback(() => {
    const v = video.current
    if (!v || reducedMotion()) return
    // the preview is fetched the first time the tile needs to play
    if (!v.getAttribute('src')) v.src = src
    v.play().catch(() => {})
  }, [src])

  const stop = useCallback(() => {
    const v = video.current
    if (!v) return
    v.pause()
    if (v.getAttribute('src')) v.currentTime = 0
    setLive(false)
  }, [])

  useEffect(() => {
    if (!matchMedia('(hover: none)').matches) return
    return watchTouch(root.current!, { play, stop })
  }, [play, stop])

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') play()
  }
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') stop()
  }
  const onFocus = (e: FocusEvent) => {
    if (e.target.matches(':focus-visible')) play()
  }
  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) stop()
  }

  // Tile frame and title morph into the recipe page's film and heading.
  const onNavigate = (e: MouseEvent) => {
    if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const f = frame.current
    const t = title.current
    f?.style.setProperty('view-transition-name', 'film')
    t?.style.setProperty('view-transition-name', 'title')
    setTimeout(() => {
      f?.style.removeProperty('view-transition-name')
      t?.style.removeProperty('view-transition-name')
    }, 1000)
  }

  return (
    <article
      ref={root}
      className={live ? 'tile is-live' : 'tile'}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div className="frame tile-frame" ref={frame}>
        <img src={media(term, 'jpg')} alt="" width={1920} height={1080} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        <video ref={video} className="tile-vid" muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onPlaying={() => setLive(true)} />
      </div>
      <div className="tile-actions">
        <CopyAction term={term} compact />
        <SaveButton slug={term.slug} compact />
      </div>
      <div className="tile-meta">
        <div className="tile-text">
          <PageLink ref={title} to={{ page: 'recipe', slug: term.slug }} className="tile-title" onClick={onNavigate}>
            {termName(term, locale)}
          </PageLink>
          <span className="mono">{s.positions[term.pos]}</span>
        </div>
        <div className="tile-like">
          <LikeButton slug={term.slug} compact />
        </div>
      </div>
    </article>
  )
}
