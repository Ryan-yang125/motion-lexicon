# Motion Lexicon Product Strategy

## Product promise

Motion Lexicon helps people and AI agents move from a product state to a
clear, refined motion decision, then carry that decision into implementation.

```text
Describe → Select a direction → See it in context → Build it → Review it → Share the learning
```

V2.0 makes this a single system with two peer product surfaces:

- **The website** is the visual reference: browse, preview, tune, compare, and
  copy motion in a calm, visible workspace.
- **Motion Director** is the creation partner: understand project context,
  recommend a direction, compose a product moment, implement it, review it, or
  prepare a contribution candidate.

Both use **Motion Grammar** as their shared source of decisions. The website
turns the grammar into public examples; Motion Director applies it to active
product work. Each accepted candidate can enrich the public examples and make
future recommendations stronger.

## Audience

- Product builders who want a clear interaction direction before writing code.
- Designers who need an interactive reference for product-state decisions.
- Engineers who need portable HTML, CSS, JavaScript, or framework guidance.
- AI agents that need exact constraints for timing, state, accessibility, and
  contribution quality.

## Product structure

### Website: two equal collections

The website has two equally important content collections.

| Collection | Job | Public scope |
| --- | --- | --- |
| **Product Moments · Motion Packs** | Show a complete, recognisable interaction in context | 28 interactive Packs across feedback, choice, change, and workflow |
| **Motion Primitives** | Explain and tune a precise behavior | 44 canonical workspaces across 12 motion families |

Motion Finder gives people a natural-language entry when they start with a
feeling or product problem. The bilingual vocabulary preserves all 91 source
terms, canonical mappings, and close-term distinctions for search and learning.

### Motion Director: a peer creation surface

Motion Director lives beside the website in a compatible Agent Skills runtime.
It produces a compact **Motion Blueprint** before it offers implementation
detail.

| Mode | Primary user question | Required delivery |
| --- | --- | --- |
| Recommend | “Which direction fits this state?” | Ranked directions, fit rationale, and a selected path |
| Compose | “How do these behaviors become one product moment?” | State graph, actors, beats, and linked Pack/Primitive references |
| Implement | “How should this work in my product?” | Portable HTML, CSS, JavaScript, or React guidance with reduced-motion behavior |
| Review | “Does this interaction feel right?” | Findings for state clarity, timing, hierarchy, interruption, accessibility, and performance |
| Contribute | “Can this become Motion Lexicon content?” | A candidate record with evidence, scope, and publication readiness |

Motion Director remains concise for small requests. Complex work earns deeper
output through explicit context and a chosen delivery format.

## Motion Grammar

Motion Grammar is the shared, versioned model behind public examples and Agent
Skill output. It records a product-motion decision as:

```text
Intent → State graph → Actors → Beats → Accessibility → Delivery → Provenance
```

- **Intent:** product goal, user task, trigger, and outcome.
- **State graph:** idle, active, success, failure, recovery, and interruption
  paths that apply to the interaction.
- **Actors:** one primary visual actor plus up to two supporting actors.
- **Beats:** a short sequence with timing, easing, property changes, and
  purpose.
- **Accessibility:** keyboard, focus, semantic status, and reduced-motion plan.
- **Delivery:** Prompt, HTML, CSS, JavaScript, React guidance, or review notes.
- **Provenance:** published reference, candidate source, confidence, and review
  evidence.

The public form is available at `/data/v2/motion-grammar.json`.

## Design quality

V2.0 absorbs the interaction design discipline of
[Interior](https://github.com/ddoemonn/interior) while retaining Motion
Lexicon’s quiet product language.

- Product state is the main visual material.
- Surfaces use a clear material hierarchy: page bezel, raised panel, and
  recessed well.
- Changing states reserve their space, so interactions stay stable through
  loading, completion, error, and recovery.
- Motion starts from a meaningful event and communicates a real process.
- Arrivals use compact travel and a clear landing; departures resolve quickly.
- Keyboard and pointer receive equivalent behavior.
- Reduced motion preserves information, outcome, focus, and control.

The default timing language is deliberate and concise:

| Moment | Curve | Typical duration |
| --- | --- | --- |
| Arrive | `cubic-bezier(0.23, 1, 0.32, 1)` | 200–280ms |
| Leave | `cubic-bezier(0.4, 0, 1, 1)` | 110–180ms |
| Press and focus | short color or scale response | 70–140ms |
| Process feedback | duration follows the actual task | state-driven |

Visible motion favors `transform` and `opacity`. Layout, semantics, and
meaningful product status remain stable throughout the interaction.

## Content loop

```text
Real product request
  → Motion Director blueprint
  → Candidate
  → Automated and editorial quality gates
  → Published Pack, Primitive, or Guide
  → New search and creation reference
```

A candidate becomes public only after an explicit review. The review verifies:

- a clear product context and state model;
- one focused visual hierarchy;
- valid, portable implementation material;
- reduced-motion and keyboard behavior;
- compositing-friendly performance;
- mobile layout without horizontal overflow;
- bilingual names, summaries, guidance, and metadata;
- an original or properly licensed source basis.

New Primitives should appear in at least three independent product scenes before
they become a public canonical unit. Focused value changes can become presets
inside an established Primitive.

## Static product boundary

Motion Lexicon remains a static frontend product. Content, design guidance,
routes, localized metadata, public data, and Motion Grammar live in the
repository and build into static assets.

- Browser visitors can preview and copy without an account.
- Motion Director installs through the Agent Skills distribution path.
- Public JSON supports tools, evaluation, and discoverability.
- Internal scripts build, validate, prerender, and test the product. They serve
  maintenance and release quality.

## SEO and discoverability

The build creates localized static HTML for the home, Finder, Pack, catalog,
category, Primitive, vocabulary, and Motion Director routes. Each canonical
content page carries localized metadata, a canonical URL, reciprocal hreflang,
and structured data where appropriate.

Discovery surfaces include:

- Product Moments and Motion Primitives for direct task and terminology search;
- Finder for intent-led search;
- 91 vocabulary terms and canonical redirects;
- Motion Director for AI-assisted creation intent;
- public Motion Grammar, versioned content data, `llms.txt`, `llms-full.txt`,
  and `pricing.txt` for machine-readable discovery.

## Version strategy

### V1.0–V1.2 — visual product-motion library

The first major release established 44 canonical workspaces, 91 bilingual
terms, Finder, static exports, and 28 Product Moments. The two website
collections became equal first-level paths.

### V2.0 — Motion Director

V2.0 brings the creation workflow into the product through a public Agent Skill
and shared Motion Grammar.

1. Keep the website and Motion Director as peer surfaces.
2. Make motion decisions traceable through a Motion Blueprint.
3. Ground new content in product context, state design, and implementation
   quality.
4. Keep public distribution focused on the website, Motion Director, and
   versioned data while internal verification tools support release quality.
5. Align website routes, documentation, public data, Skill references, and
   machine-readable discovery around V2.0.

## V2.0 acceptance

V2.0 is ready when:

- Product Moments and Motion Primitives stay equal first-level website paths.
- Motion Director is a visible first-level creation entry with localized static
  content.
- The website and Skill read the same versioned Motion Grammar.
- The Skill supports recommendation, composition, implementation, review, and
  contribution pathways.
- Each accepted Pack and Primitive maintains aligned preview, Prompt, portable
  code, guidance, and reduced-motion behavior.
- All 44 canonical workspaces and 91 source terms remain available and
  indexable.
- Public resources, README files, `llms.txt`, `llms-full.txt`, and pricing
  describe the V2.0 website, Motion Director, and shared data model.
- Desktop and mobile routes stay free of horizontal page overflow.
- The full lint, typecheck, test, i18n, vocabulary, Motion Grammar, SEO,
  motion, accessibility, build, bundle, crawl, and browser test gates pass.
