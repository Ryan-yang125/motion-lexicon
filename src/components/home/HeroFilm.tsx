import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { CopyAction } from '@/components/actions'
import { HERO, type HeroSegment } from '@/data/hero'
import { bySlug, termName } from '@/data/terms'
import { gsap, useGSAP } from '@/lib/gsap'
import { PageLink, useLocale, useStrings } from '@/lib/locale'
import { BRAND } from '@/site'

const SEGS = HERO.map((s) => ({ ...s, term: bySlug[s.slug], dur: s.end - s.start }))
// One <video> per distinct src, stacked; cutting between segments toggles which one is visible.
const SRCS = [...new Set(HERO.map((s) => s.src))]
// Phones play the 720p copy of the film; segment times are the same in both.
const filmOf = (seg: HeroSegment) => (matchMedia('(max-width: 767px)').matches ? seg.mobile : seg.src)

const pendingSeek = new WeakMap<HTMLVideoElement, number>()

function seek(v: HTMLVideoElement, t: number) {
  pendingSeek.set(v, t)
  if (v.readyState >= 1) {
    // Segments of one continuous film follow each other: when playback has just crossed into
    // this segment, leave it running instead of seeking back a frame.
    const d = v.currentTime - t
    if (d < -0.03 || d > 0.25) v.currentTime = t
  } else if (!v.dataset.seekHook) {
    v.dataset.seekHook = '1'
    v.addEventListener('loadedmetadata', () => {
      const p = pendingSeek.get(v)
      if (p !== undefined) v.currentTime = p
    })
  }
}

function prepare(v: HTMLVideoElement, seg: HeroSegment) {
  const film = filmOf(seg)
  if (v.getAttribute('src') !== film) {
    v.preload = 'auto'
    v.src = film
  }
  seek(v, seg.start)
}

export function HeroFilm() {
  const root = useRef<HTMLElement>(null)
  const vids = useRef(new Map<string, HTMLVideoElement>())
  const fills = useRef<(HTMLElement | null)[]>([])
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [started, setStarted] = useState(false)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)
  const locale = useLocale()
  const s = useStrings()
  const live = inView && !hidden && (!reduced || started)
  const cur = SEGS[index]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.hero-h', { y: 28, opacity: 0, duration: 0.9, ease: 'expo.out' })
        gsap.from('.hero-frame', { y: 16, opacity: 0, duration: 0.9, delay: 0.1, ease: 'expo.out' })
        gsap.from('.tl-item', { y: 12, opacity: 0, duration: 0.6, delay: 0.3, stagger: 0.06, ease: 'expo.out' })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  // Pause when the hero is off-screen or the tab is hidden; follow the reduced-motion setting.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    io.observe(root.current!)
    const onVis = () => setHidden(document.hidden)
    onVis()
    document.addEventListener('visibilitychange', onVis)
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => setReduced(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      mq.removeEventListener('change', onMq)
    }
  }, [])

  useEffect(() => {
    if (live) setArmed(true)
  }, [live])

  // Current segment seeks to its start; the next one (if it has another src) is loaded and pre-seeked.
  useEffect(() => {
    if (!armed) return
    const seg = SEGS[index]
    const next = SEGS[(index + 1) % SEGS.length]
    prepare(vids.current.get(seg.src)!, seg)
    if (next.src !== seg.src) prepare(vids.current.get(next.src)!, next)
    vids.current.forEach((el, src) => {
      if (src !== seg.src) el.pause()
    })
  }, [index, armed])

  useEffect(() => {
    fills.current.forEach((f, i) => {
      if (f && i !== index) f.style.transform = 'scaleX(0)'
    })
  }, [index])

  // Playback and the progress fill, driven by currentTime outside React.
  useEffect(() => {
    if (!armed) return
    const seg = SEGS[index]
    const v = vids.current.get(seg.src)!
    if (!live) {
      v.pause()
      return
    }
    v.play().catch(() => {})
    const fill = fills.current[index]
    let raf = 0
    let done = false
    const tick = () => {
      if (v.seeking) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = v.currentTime
      if (fill) fill.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - seg.start) / seg.dur))})`
      if (t >= seg.end || v.ended) {
        if (SEGS.length === 1) {
          v.currentTime = seg.start
          v.play().catch(() => {})
        } else if (!done) {
          done = true
          setIndex((i) => (i + 1) % SEGS.length)
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [index, live, armed])

  const select = (i: number) => {
    setStarted(true)
    if (i !== index) {
      setIndex(i)
      return
    }
    const v = vids.current.get(SEGS[i].src)
    if (v) {
      v.currentTime = SEGS[i].start
      v.play().catch(() => {})
    }
  }

  return (
    <section className="hero gut" ref={root}>
      <div className="wrap hero-in">
        <h1 className="hero-h">{BRAND.headline[locale]}</h1>
        <div className="hero-stage">
          <div className="frame hero-frame">
            <img
              className="hero-poster"
              src={SEGS[0].poster}
              srcSet={`${SEGS[0].posterSmall} 960w, ${SEGS[0].poster} 1920w`}
              sizes="(min-width: 900px) 1200px, 100vw"
              alt=""
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
            />
            {SRCS.map((src) => (
              <video
                key={src}
                ref={(el) => {
                  if (el) vids.current.set(src, el)
                  else vids.current.delete(src)
                }}
                className={shown && cur.src === src ? 'hero-vid is-on' : 'hero-vid'}
                muted
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
                onPlaying={() => setShown(true)}
              />
            ))}
            {reduced && !started && (
              <button type="button" className="btn icon hero-play" aria-label={s.hero.play} onClick={() => setStarted(true)}>
                <Play fill="currentColor" />
              </button>
            )}
          </div>
          <ol className="hero-tl" aria-label={s.hero.shots}>
            {SEGS.map((seg, i) => (
              <li key={seg.slug} className="tl-item" style={{ flexGrow: seg.dur }}>
                <button
                  type="button"
                  className="tl-block"
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => select(i)}
                >
                  <span className="tl-fill" ref={(el) => void (fills.current[i] = el)} />
                  <span className="tl-n mono">{String(i + 1).padStart(2, '0')}</span>{' '}
                  <span className="tl-pos mono">{s.positions[seg.term.pos]}</span>{' '}
                  <span className="tl-name">{termName(seg.term, locale)}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="hero-shot">
            <div className="shot-info">
              <span className="shot-name">{termName(cur.term, locale)}</span>
              <span className="mono">{s.positions[cur.term.pos]}</span>
            </div>
            <div className="shot-actions">
              <CopyAction term={cur.term} />
              <PageLink to={{ page: 'recipe', slug: cur.term.slug }} className="btn ghost">
                {s.hero.open}
              </PageLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
