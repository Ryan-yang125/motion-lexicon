import { useEffect, useState } from 'react'
import { TileGrid } from '@/components/TileGrid'
import { order } from '@/data/terms'
import { PageLink, useStrings } from '@/lib/locale'
import { useSaved } from '@/lib/saved'

export function SavedPage() {
  const { saved } = useSaved()
  const s = useStrings()
  // Saved lives in localStorage; render the list only after hydration so the prerendered
  // empty state never flashes for a visitor who has saved recipes.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const terms = order.filter((t) => saved.includes(t.slug))

  return (
    <main className="wrap gut sv">
      <h1>
        {s.saved.title} {mounted && <span className="mono">{terms.length}</span>}
      </h1>
      {mounted && terms.length > 0 && <TileGrid terms={terms} />}
      {mounted && terms.length === 0 && (
        <div className="sv-empty">
          <p>{s.saved.empty}</p>
          <PageLink to={{ page: 'home', hash: 'recipes' }} className="btn ghost">
            {s.saved.browse}
          </PageLink>
        </div>
      )}
    </main>
  )
}
