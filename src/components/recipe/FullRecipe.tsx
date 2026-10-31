import { useState } from 'react'
import { Check, ChevronDown, Copy } from 'lucide-react'
import { bySlug, recipeFile, termName, type RecipeText, type Term } from '@/data/terms'
import { PageLink, useLocale, useStrings } from '@/lib/locale'

function PromptCopy({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  const { full } = useStrings()
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1600)
    } catch {
      // clipboard blocked: leave the button unchanged
    }
  }
  return (
    <button type="button" className="rc-pcopy" aria-label={done ? full.promptCopied : full.copyPrompt} onClick={copy}>
      {done ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </button>
  )
}

// Closed by default; the content stays in the DOM so it is in the prerendered HTML.
export function FullRecipe({ term: t, text }: { term: Term; text: RecipeText }) {
  const locale = useLocale()
  const { full } = useStrings()
  return (
    <details className="rc-full" data-rv>
      <summary>
        <span>{full.title}</span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <div className="rc-body">
        <section>
          <h3>{full.why}</h3>
          <p>{text.why}</p>
        </section>
        <section>
          <h3>{full.spec}</h3>
          <dl className="rc-spec">
            {text.spec.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd dangerouslySetInnerHTML={{ __html: v }} />
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h3>{full.prompt}</h3>
          <div className="rc-prompt">
            <p>{text.prompt}</p>
            <PromptCopy text={text.prompt} />
          </div>
        </section>
        <section>
          <h3>{full.says}</h3>
          <ul className="rc-says">
            {text.says.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        {text.vs.length > 0 && (
          <section>
            <h3>{full.vs}</h3>
            <ul className="rc-vs">
              {text.vs.map(([slug, why]) => {
                const other = bySlug[slug]
                return (
                  <li key={slug}>
                    {other ? (
                      <PageLink to={{ page: 'recipe', slug }}>{termName(other, locale)}</PageLink>
                    ) : null}
                    <span>{why}</span>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
        <a className="rc-file mono" href={recipeFile(t)}>
          {full.file}
        </a>
      </div>
    </details>
  )
}
