import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Bookmark, Check, Copy, Heart } from 'lucide-react'
import { copyText } from '@/data/copy'
import type { Term } from '@/data/terms'
import { useLike, trackCopy, trackWish } from '@/lib/stats'
import { useSaved } from '@/lib/saved'
import { useStrings } from '@/lib/locale'
import { burst, writeClipboard } from '@/components/CopyButton'

// A link bar above a film frame: your product link becomes a shot. Drawn on lucide's 24px grid.
function LinkToFilm() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="4.5" rx="2.25" />
      <path d="M6.5 5.25h5" />
      <rect x="3" y="10.5" width="18" height="10.5" rx="2.5" />
      <path d="M10.25 13.6v4.3l3.7-2.15z" fill="currentColor" />
    </svg>
  )
}

/** Tiles sit inside links; compact controls must not trigger navigation. */
const isolate = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
}

export const formatCount = (n: number) => (n > 999 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n))

export function CopyAction({ term, compact }: { term: Term; compact?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const timer = useRef<number>(0)
  const [done, setDone] = useState(false)
  const { actions } = useStrings()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy(e: MouseEvent) {
    if (compact) isolate(e)
    await writeClipboard(copyText(term))
    if (ref.current) burst(ref.current)
    trackCopy(term.slug)
    setDone(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setDone(false), 1600)
  }

  if (compact) {
    return (
      <button
        ref={ref}
        type="button"
        className="act-mini"
        aria-label={done ? actions.copied : actions.copy}
        onClick={copy}
      >
        {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      </button>
    )
  }

  return (
    <button ref={ref} type="button" className="btn act-copy-btn" onClick={copy}>
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span aria-live="polite">{done ? actions.copied : actions.copy}</span>
    </button>
  )
}

export function LikeButton({ slug, compact }: { slug: string; compact?: boolean }) {
  const { liked, likes, toggle } = useLike(slug)
  const { actions } = useStrings()
  const count = formatCount(likes)
  return (
    <button
      type="button"
      className={compact ? 'act-like act-mini-like' : 'act-like'}
      aria-pressed={liked}
      // starts with the visible count so the accessible name contains the visible text
      aria-label={`${count} ${liked ? actions.unlike : actions.like}`}
      data-liked={liked || undefined}
      onClick={(e) => {
        if (compact) isolate(e)
        toggle()
      }}
    >
      <Heart aria-hidden fill={liked ? 'currentColor' : 'none'} />
      <span className="act-count">{count}</span>
    </button>
  )
}

export function SaveButton({ slug, compact }: { slug: string; compact?: boolean }) {
  const { has, toggle } = useSaved()
  const saved = has(slug)
  const { actions } = useStrings()
  return (
    <button
      type="button"
      className={compact ? 'act-mini act-save' : 'act-save act-full'}
      aria-pressed={saved}
      aria-label={saved ? actions.unsave : actions.save}
      data-saved={saved || undefined}
      onClick={(e) => {
        if (compact) isolate(e)
        toggle(slug)
      }}
    >
      <Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} />
      {!compact && <span>{saved ? actions.saved : actions.save}</span>}
    </button>
  )
}

export function WishButton({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const { actions } = useStrings()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="act-wish" ref={box}>
      <button
        type="button"
        className="btn ghost"
        aria-expanded={open}
        onClick={() => {
          trackWish(slug)
          setOpen(true)
        }}
      >
        <LinkToFilm />
        {actions.wish}
      </button>
      {open && (
        <div className="act-pop" role="status">
          {actions.wishPop}
        </div>
      )}
    </div>
  )
}
