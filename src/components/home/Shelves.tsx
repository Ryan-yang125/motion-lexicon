import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { TileGrid } from '@/components/TileGrid'
import { POSITION_ORDER, byPos } from '@/data/terms'
import type { Position } from '@/data/terms'
import { useStrings } from '@/lib/locale'

const shelfId = (p: Position) => `shelf-${p}`

export function Shelves() {
  const [active, setActive] = useState<Position | null>(null)
  const bar = useRef<HTMLDivElement>(null)
  const s = useStrings()

  // The shelf crossing a band just under the sticky bars is the one in view.
  useEffect(() => {
    const inBand = new Set<Position>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const p = (e.target as HTMLElement).dataset.pos as Position
          if (e.isIntersecting) inBand.add(p)
          else inBand.delete(p)
        }
        setActive(POSITION_ORDER.find((p) => inBand.has(p)) ?? null)
      },
      { rootMargin: '-140px 0px -60% 0px' },
    )
    for (const p of POSITION_ORDER) {
      const el = document.getElementById(shelfId(p))
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])

  // Keep the active chip visible in the horizontally scrolling bar (phones).
  useEffect(() => {
    const b = bar.current
    const chip = active && b?.querySelector<HTMLElement>(`[data-pos="${active}"]`)
    if (!b || !chip) return
    b.scrollTo({ left: chip.offsetLeft - 16, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }, [active])

  const go = (p: Position) => (e: MouseEvent) => {
    e.preventDefault()
    setActive(p)
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(shelfId(p))?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }

  return (
    <section className="recipes" id="recipes">
      <nav className="chips gut" aria-label={s.shelves.label}>
        <div className="chips-in wrap" ref={bar}>
          {POSITION_ORDER.map((p) => (
            <a key={p} className="chip" href={`#${shelfId(p)}`} data-pos={p} aria-current={active === p ? 'true' : undefined} onClick={go(p)}>
              {s.positions[p]}
              <span className="mono">{byPos(p).length}</span>
            </a>
          ))}
        </div>
      </nav>
      <div className="gut">
        <div className="wrap">
          {POSITION_ORDER.map((p) => {
            const list = byPos(p)
            return (
              <section key={p} className="shelf" id={shelfId(p)} data-pos={p} aria-labelledby={`${shelfId(p)}-h`}>
                <h2 className="shelf-h" id={`${shelfId(p)}-h`}>
                  {s.positions[p]}
                  <span className="mono">{list.length}</span>
                </h2>
                <TileGrid terms={list} />
              </section>
            )
          })}
        </div>
      </div>
    </section>
  )
}
