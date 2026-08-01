# Motion Lexicon Product Design

## Experience model

Motion Lexicon V2.0 is a static product-motion system with two equal website
collections and one peer creation surface.

- **Product Moments · Motion Packs:** 28 complete interactions with context,
  trigger, state progression, outcome, and portable implementation.
- **Motion Primitives:** 44 focused workspaces for exact behaviors, terminology,
  parameters, and implementation detail.
- **Motion Director:** an Agent Skill that turns product context into a
  recommendation, composition, implementation, review, or contribution
  blueprint.

All three surfaces use the same versioned **Motion Grammar**. The website gives
the grammar a visual form; Motion Director applies it inside an active product
workflow.

```text
Website: Preview → Trigger → Inspect → Copy
Motion Director: Understand → Blueprint → Build → Review → Contribute
```

The intended result is calm confidence. Product state carries the visual
interest; surrounding interface chrome gives that state room and clarity.

## Information architecture

The header gives the core product paths equal access:

- **Find motion:** `/:locale/finder/` receives a natural-language request and
  directs it to relevant Product Moments and Motion Primitives.
- **Product Moments:** `/:locale/packs/` is the gallery for 28 real product
  interactions.
- **Motion Primitives:** `/:locale/catalog/` is the catalog for 44 focused
  workspaces.
- **Motion Director:** `/:locale/director/` explains the shared grammar and the
  Agent Skill creation workflow.

Supporting routes add depth and acquisition value:

- `/:locale/packs/:packId/`: a live Pack preview, guidance, and portable
  output.
- `/:locale/catalog/`: the 44 canonical Motion Primitive workspaces.
- `/:locale/vocabulary/`: the complete bilingual 91-term vocabulary.
- `/:locale/:categoryId/`: indexable motion-family collections.
- `/:locale/:categoryId/:recipeId/`: canonical Primitive workspaces.
- `/:locale/lab/`: reviewable candidate work kept outside the canonical public
  content surface.

Pack details link to their related Motion Primitives; Primitive workspaces
surface their related Packs. Motion Director offers a direct creation path to
the same references. GitHub, Agent Skill installation, public data, vocabulary,
theme, and locale remain available from the resources layer and footer.

## Motion Grammar model

Every Motion Director decision and every new public content candidate uses one
schema:

```text
Intent → State graph → Actors → Beats → Accessibility → Delivery → Provenance
```

### Intent

Capture the product task, user goal, trigger, outcome, existing visual language,
and implementation constraints.

### State graph

Name the states that matter to the product: idle, active, success, error,
recovery, cancelled, or a domain-specific equivalent. A state transition earns
motion when it improves orientation, feedback, continuity, or perceived task
progress.

### Actors and beats

One primary visual actor should carry each transition. Up to two supporting
actors can clarify progress, result, or spatial continuity. Each beat includes
its actor, purpose, from state, to state, timing, curve, and property changes.

### Accessibility and delivery

Every blueprint carries keyboard behavior, focus handling, semantic status, and
a reduced-motion result. Delivery can be a Prompt, HTML, CSS, JavaScript, React
guidance, review notes, or a contribution candidate.

### Provenance

Published content, candidate work, confidence, source evidence, and quality
checks stay visible. A candidate moves into public content only after explicit
review.

The public grammar file lives at `/data/v2/motion-grammar.json`.

## Product Moments · Pack gallery

- The gallery gives each Pack a stable product frame and a concise state-led
  description.
- Four filters organise the collection by feedback, choice, change, and
  workflow.
- Hover and focus play the existing live scene in place, so the preview remains
  visually continuous.
- Cards open dedicated detail routes and keep the gallery useful for browsing.
- Narrow layouts keep Pack cards vertically readable without horizontal page
  scrolling.

## Pack detail

- Identity, product scenario, and a direct path to output stay near the live
  preview.
- The preview stage gives the state transition enough space to communicate its
  before-and-after relationship.
- A compact inspector expresses timing, trigger, outcome, and reduced-motion
  treatment in plain language.
- The output area has two stable modes: **Prompt** and **Code**. Prompt opens
  by default, and the selected mode owns the copy action.
- Related Packs form a lightweight continuation path.
- Related Motion Primitives explain the precise behaviors inside the current
  scene.

## Motion Primitives · catalog and workspaces

- The catalog presents all 44 canonical workspaces with accurate live previews,
  focused categories, and routes into each Primitive.
- Each workspace pairs one primary preview with compact controls, then exposes
  Prompt and Code through the same output pattern used on Pack details.
- Related Packs show the behavior in a complete product context.
- Vocabulary and category pages remain indexable acquisition surfaces.

## Finder

- Finder uses one primary preview for the selected candidate.
- Other candidates remain stable choices. Selecting one switches the primary
  scene and makes it the only active preview.
- Results distinguish Product Moments and Motion Primitives while giving each
  collection equal relevance.
- The 91-term vocabulary supplies precise language and close-term distinctions.

## Motion Director route

`/:locale/director/` makes the Agent Skill legible as a product surface.

- It explains the five creation modes: Recommend, Compose, Implement, Review,
  and Contribute.
- It presents a concise example Motion Blueprint with the intent, state graph,
  actors, beats, accessibility, delivery, and provenance fields.
- It links to the Skill installation path, public Motion Grammar, and both
  website collections.
- It gives contributors a visible route from real product request to candidate
  content.

The page stays static and indexable. Candidate experiments remain on the Lab
surface and carry `noindex` metadata until publication.

## Layout system

### Product shell

- The 64px header uses a translucent material, centered primary navigation, and
  a source-anchored resources popover.
- Desktop content is capped at 1240px with deliberate outer breathing room.
- Mobile uses a compact gutter and keeps the active workflow ahead of reference
  material.
- Footer content is compact and separates product navigation from open-source
  resources.

### Material hierarchy

The visual system absorbs Interior’s material approach.

| Layer | Role | Light surface |
| --- | --- | --- |
| Bezel | Page background and quiet context | warm neutral |
| Panel | Raised card, workspace, or popover | white or near-white |
| Well | Recessed preview, input, or code region | soft neutral |

Actual elevation, internal spacing, and nested radii communicate depth. Borders
and shadows clarify structure with a light hand.

### Collection galleries

- Home presents Product Moments and Motion Primitives as equal routes.
- Motion Director sits alongside them as a creation entry with its own workflow.
- Desktop cards use responsive grids; narrow layouts use stable vertical flows.
- Page-level horizontal scrolling is never an intended layout behavior.

### Detail workspace

- At wide widths, preview and inspector form a balanced workbench.
- At narrow widths, the live preview stays first, followed by context, output,
  and deeper guidance.
- Prompt and Code use a compact switch; its copy action aligns to the opposite
  edge and reserves its size across state changes.

## Visual system

- Platform system typography: `-apple-system`, `BlinkMacSystemFont`, SF Pro
  where available, PingFang SC, Helvetica Neue, and Arial fallbacks.
- Type uses 12px, 13px, 14px, and 24px steps with `-0.15px` letter spacing.
- Text hierarchy uses `#292929`, `#5D5D5D`, and `#9E9E9E`.
- Navigation icons are 14px; card icons are 20px.
- Navigation components use 8px radii, cards use 16px radii, and primary CTAs
  use pill shapes.
- Chroma-zero neutrals establish depth; restrained blue carries focus,
  selection, and readiness.
- Preview scenes maintain solid white or warm-neutral material for reliable
  visual judgement.

## Interaction and motion

The system follows the shared Motion Grammar and Interior-inspired interaction
discipline.

- Every visible motion begins from a meaningful product event.
- Changing labels, actions, and status reserve their final space before the
  change, avoiding layout shift.
- Arrivals use `cubic-bezier(0.23, 1, 0.32, 1)`, typically 200–280ms.
- Departures use `cubic-bezier(0.4, 0, 1, 1)`, typically 110–180ms.
- Press and focus feedback lands within 70–140ms.
- Process indicators follow the real task duration and communicate ongoing
  progress.
- Visible motion uses `transform` and `opacity` wherever possible.
- Hover motion runs only under fine-pointer media queries.
- `prefers-reduced-motion` preserves state, hierarchy, focus, control, and
  outcome while removing large travel, looping, and nonessential scale.
- `prefers-reduced-transparency` uses solid surfaces. Increased contrast
  strengthens key boundaries.

## Accessibility

- Buttons, links, forms, tabs, and controls use native semantics and keyboard
  access.
- Primary mobile targets are at least 44px.
- Status changes, copy completion, errors, and Pack outcomes expose visible text
  or an appropriate live region.
- Light and dark themes retain readable contrast.
- Layouts remain free of horizontal page overflow across supported viewports.

## Data, SEO, and static delivery

Pack data lives in `src/data/motion-packs.ts`. The existing public catalog,
Packs, vocabulary, and schema remain available under `/data/v1/`. Motion Grammar
is published independently at `/data/v2/motion-grammar.json` for the website,
Motion Director, and machine-readable discovery.

The build pipeline renders static HTML for every localized canonical route.
Product Moment, Motion Primitive, Finder, vocabulary, and Motion Director
routes receive self canonicals, reciprocal hreflang values, Open Graph metadata,
and static JSON-LD where appropriate. Candidate Lab content remains noindex.

`llms.txt`, `llms-full.txt`, `pricing.txt`, public JSON, the repository, and the
Agent Skill all publish the same V2.0 model to people and tools.

## Launch acceptance

Launch is complete when:

- Product Moments and Motion Primitives retain equal first-level website paths.
- Motion Director is visible as a peer creation path with localized static
  content.
- The shared Motion Grammar validates and ships at `/data/v2/motion-grammar.json`.
- Pack and Primitive detail routes preserve their live preview, Prompt, Code,
  related references, and reduced-motion behavior.
- Finder continues to surface useful results across both collections.
- All 44 workspaces and 91 terms remain searchable and indexable.
- Website, Skill, README files, public data, `llms.txt`, `llms-full.txt`, and
  pricing use aligned V2.0 language.
- Public product routes focus on visual discovery, portable output, Motion
  Director, and shared data.
- Desktop and mobile layouts have no horizontal page overflow.
- Lint, typecheck, test, i18n, vocabulary, Motion Grammar, artifact, SEO,
  motion, accessibility, build, bundle, crawl, and browser test gates pass.
