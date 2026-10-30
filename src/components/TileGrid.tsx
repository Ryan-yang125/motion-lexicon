import type { KeyboardEvent } from 'react'
import { FilmTile } from '@/components/FilmTile'
import type { Term } from '@/data/terms'

const ROW_TOLERANCE = 8

// Arrow keys move focus between tiles (the focused tile plays).
function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const here = e.target as HTMLElement
  if (!here.classList.contains('tile-title')) return
  const links = [...e.currentTarget.querySelectorAll<HTMLElement>('.tile-title')]
  const i = links.indexOf(here)
  let next: HTMLElement | undefined
  if (e.key === 'ArrowRight') next = links[i + 1]
  else if (e.key === 'ArrowLeft') next = links[i - 1]
  else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    const down = e.key === 'ArrowDown'
    const r = here.getBoundingClientRect()
    const rows = links
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .filter(({ rect }) => (down ? rect.top > r.top + ROW_TOLERANCE : rect.top < r.top - ROW_TOLERANCE))
    if (rows.length) {
      const rowTop = down ? Math.min(...rows.map((x) => x.rect.top)) : Math.max(...rows.map((x) => x.rect.top))
      const row = rows.filter((x) => Math.abs(x.rect.top - rowTop) <= ROW_TOLERANCE)
      next = row.reduce((a, b) => (Math.abs(b.rect.left - r.left) < Math.abs(a.rect.left - r.left) ? b : a)).el
    }
  } else return
  if (next) {
    e.preventDefault()
    next.focus()
  }
}

export function TileGrid({ terms }: { terms: Term[] }) {
  return (
    <div className="tiles" onKeyDown={onKeyDown}>
      {terms.map((t) => (
        <FilmTile key={t.slug} term={t} />
      ))}
    </div>
  )
}
