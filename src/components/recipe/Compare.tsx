import { Film, Player } from '@/components/recipe/Player'
import type { Source, Term } from '@/data/terms'
import { useStrings } from '@/lib/locale'

export function Compare({ term, source }: { term: Term; source: Source }) {
  const { clip } = source
  const { recipe } = useStrings()
  return (
    <div className="cmp">
      <figure className="cmp-fig cmp-orig">
        {clip ? (
          <Film src={clip.src} poster={clip.poster} name={recipe.originalAria(source.title)} />
        ) : (
          <a className="clip" href={source.href} target="_blank" rel="noopener">
            <span className="clip-head">
              <span className="clip-t">{source.title}</span>
              <span className="clip-at mono">{source.range}</span>
            </span>
            <span className="clip-go">{recipe.watchOnX}</span>
          </a>
        )}
        <figcaption className="cmp-cap mono">
          <span className="cmp-cap-t">
            {recipe.original} · {source.title} · {source.range}
          </span>
          {clip && (
            <a href={source.href} target="_blank" rel="noopener">
              YouTube ↗
            </a>
          )}
        </figcaption>
      </figure>
      <figure className="cmp-fig cmp-ours">
        <Player term={term} />
        <figcaption className="cmp-cap mono">
          <span className="cmp-cap-t">{recipe.recreation}</span>
        </figcaption>
      </figure>
    </div>
  )
}
