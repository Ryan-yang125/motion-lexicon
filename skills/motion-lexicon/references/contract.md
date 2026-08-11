# Motion Grammar contract

The Motion Lexicon Skill and the public website share the Motion Blueprint
contract.
Use the public data when the task needs the current published vocabulary or a
machine-readable handoff:

- Grammar data: `https://motion-lexicon.pages.dev/data/v4/motion-grammar.json`
- Component and primitive catalog: `https://motion-lexicon.pages.dev/data/v4/catalog.json`
- Blueprint schema: `https://motion-lexicon.pages.dev/data/v4/motion-blueprint.schema.json`

For offline component selection, use the generated
[published component catalog](components.md).

The bundled references explain selection and implementation. The public
contract keeps reusable artifacts consistent across the website, candidate
review, and installed Skill.

## Contract fields

| Field | Purpose |
| --- | --- |
| `version`, `locale` | Contract version and response language |
| `intent`, `scope` | Product event, desired feeling, target surface, stack, and input |
| `stateGraph` | Named states and event transitions |
| `actors` | One primary actor, focused supporting actors, and each actor's semantic kind |
| `beats` | Timed product-purpose changes |
| `accessibility` | Reduced motion, focus, ARIA, and keyboard behavior |
| `delivery` | Requested source formats and integration notes |
| `provenance` | Publication stage, related foundations, moments, and confidence |

For a normal Compose or Implement response, `beats[].primitive` and
`provenance.foundations[]` use exact published primitive IDs from the public
catalog, such as `press-tap-feedback`, `text-morph`, and `crossfade`. A new ID
is valid only when `provenance.status` is `candidate` and the response clearly
identifies it as the proposed primitive.

## Use with the website

- Use published primitives and Product Moments as comparison points when a
  request needs a known pattern.
- Keep a new contribution at `status: candidate` until maintainer review.
- Keep the public grammar and a candidate Blueprint aligned with the schema URL
  above.
- Use local references when a network read is unavailable; mark assumptions in
  the resulting Blueprint.
