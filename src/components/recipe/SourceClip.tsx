import { Play } from 'lucide-react'
import type { Source } from '@/data/terms'
import { useStrings } from '@/lib/locale'

// Card for one original film. YouTube sources select into the compare block; others open externally.
export function SourceClip({ source: s, selected, onSelect }: { source: Source; selected: boolean; onSelect: () => void }) {
  const { recipe } = useStrings()
  const label = (
    <span className="clip-head">
      <span className="clip-t">{s.title}</span>
      <span className="clip-at mono">
        {s.range}
        {s.note ? ` · ${s.note}` : ''}
      </span>
    </span>
  )

  if (!s.youtube) {
    return (
      <a className="clip" href={s.href} target="_blank" rel="noopener">
        {label}
        <span className="clip-go">{recipe.watchOnX}</span>
      </a>
    )
  }

  return (
    <div className={selected ? 'clip is-selected' : 'clip'}>
      <button type="button" className="clip-btn" aria-pressed={selected} aria-label={recipe.compareWith(s.title, s.range)} onClick={onSelect}>
        {label}
        <span className="clip-go">
          <Play aria-hidden="true" fill="currentColor" />
          {selected ? recipe.showing : recipe.compare}
        </span>
      </button>
      <a className="clip-out mono" href={s.href} target="_blank" rel="noopener">
        YouTube ↗
      </a>
    </div>
  )
}
