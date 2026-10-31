import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'
import { CopyAction } from '@/components/actions'
import { HERO, HERO_FILM } from '@/data/hero'
import { bySlug, termName } from '@/data/terms'
import { gsap, useGSAP } from '@/lib/gsap'
import { PageLink, useLocale, useStrings } from '@/lib/locale'
import { BRAND } from '@/site'

const SEGS = HERO.map((s) => ({ ...s, term: bySlug[s.slug], dur: s.end - s.start }))

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

export function HeroFilm() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
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

  // The current segment seeks to its start.
  useEffect(() => {
    if (armed) seek(video.current!, SEGS[index].start)
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
    const v = video.current!
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
    const v = video.current!
    v.currentTime = SEGS[i].start
    v.play().catch(() => {})
  }

  return (
    <section className="hero gut" ref={root}>
      <div className="wrap hero-in">
        <h1 className="hero-h">{BRAND.headline[locale]}</h1>
        <div className="hero-stage">
          <div className="frame hero-frame">
            <img
              className="hero-poster"
              src={HERO_FILM.poster}
              srcSet={`${HERO_FILM.posterSmall} 960w, ${HERO_FILM.poster} 1920w`}
              sizes="(min-width: 900px) 1200px, 100vw"
              alt=""
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
            />
            {/* Sources are in the markup so the download starts with the page, before the script runs. */}
            <video
              ref={video}
              className={shown ? 'hero-vid is-on' : 'hero-vid'}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              onPlaying={() => setShown(true)}
            >
              <source src={HERO_FILM.mobile} type="video/mp4" media="(max-width: 767px)" />
              <source src={HERO_FILM.src} type="video/mp4" />
            </video>
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
