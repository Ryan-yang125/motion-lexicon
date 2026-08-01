# Motion Lexicon Product

## Product Promise

Motion Lexicon gives product builders two complementary, equal collections they
can preview, understand, and copy into an interface: complete product moments
and precise motion primitives.

**Product Moments · Motion Packs** cover real interactions such as saving,
publishing, choosing, inviting, filtering, and undoing. Each Pack combines a
recognisable scene, a clear interaction contract, short motion, accessible
reduced-motion behavior, and portable Prompt/HTML/CSS/JavaScript output.

**Motion Primitives** cover the 44 canonical elements that shape product
behavior: entrances, exits, easing, sequencing, shared elements, feedback, and
more. Each primitive provides accurate terminology, a live workspace, tunable
parameters, and portable output.

The primary journey is **Preview → Trigger → Inspect → Copy**:

- What product moment does this Pack solve?
- What changes when the user triggers it?
- What timing and reduced-motion behavior make it feel right?
- How can I carry it into my own interface today?

Motion Finder and the vocabulary continue to support the decision journey:
**Describe → Discover → Decide → Use**. Finder searches across Product Moments
and Motion Primitives, then gives users a clear route into the right collection.

## Primary Users

- Product builders who want refined interactions without starting from a blank canvas.
- Designers who need a shared, interactive reference during product decisions.
- Engineers who need portable HTML, CSS, JavaScript, and behavior guidance.
- AI agents that benefit from exact prompts, structured data, and explicit motion constraints.

## V1.2 Product Structure

The site is a static, SEO-friendly application with two equal content
collections. Each has a dedicated home, detail workflow, and direct navigation;
Finder connects them for visitors who begin from a description.

- **Product Moments · Motion Pack gallery:** `/:locale/packs/` presents 28 real
  product moments, with seven Packs in each of feedback, choice, change, and workflow.
- **Motion Pack detail:** `/:locale/packs/:packId/` gives each Pack a dominant
  live preview, concise interaction guidance, a Prompt/Code export surface, and
  related Motion Primitives.
- **Motion Primitives · catalog:** `/:locale/catalog/` preserves 44 canonical
  workspaces across components, focused playgrounds, and guides.
- **Motion Primitive detail:** `/:locale/:category/:recipe/` gives each
  primitive a live workspace, parameters, portable output, and related Product
  Moments whenever the relationship is present in a Pack.
- **Motion Finder:** `/:locale/finder/` receives a natural-language description,
  returns relevant Motion Primitives and their matching Product Moments, and
  preserves its precise vocabulary and recipe workflow.
- **Vocabulary and category pages:** preserve all 91 terms, definitions,
  distinctions, and indexable acquisition routes.
- **Open-source resources:** CLI, Agent Skill, versioned JSON, schemas, and the
  repository remain available from the resources layer and public artifacts.

Every public page is static. No account or runtime server is required.

## Motion Pack Content Contract

Every Pack owns one complete, portable interaction contract:

- A product context with a visible idle, active, and completed state.
- A clear trigger and outcome expressed in the live preview.
- Motion scoped to `transform` and `opacity` wherever possible, with short,
  deliberate timing and a defined settle curve.
- Prompt, HTML, CSS, and JavaScript derived from the same Pack data.
- A reduced-motion treatment that preserves result, hierarchy, and control.
- Bilingual names, summaries, scenes, use cases, guidance, and SEO metadata.
- A stable URL, public JSON representation, and CLI API.
- Related Motion Primitives that explain the motion choices inside the scene.

V1.2 contains 28 Packs:

| Group | Packs |
| --- | --- |
| Feedback | Save confirmation, Publish release, Share link, Inline validation, Upload complete, Sync recovery, Delete confirmation |
| Choice | Card selection, Workspace switch, Template choice, Command menu, Assignee picker, Permission change, Search suggestions |
| Change | Layer insertion, Archive undo, Filter results, Details disclosure, Kanban move, Cart update, Comment reply |
| Workflow | Notification triage, Progress steps, Member invite, Media scrub, Approval request, Checkout payment, Scheduled publish |

## Motion Primitive Content Contract

Every Motion Primitive owns a focused, portable behavior contract:

- A stable canonical ID, localized name, definition, and close-term distinction.
- A live preview with the behavior it describes, plus an accessible
  reduced-motion treatment.
- Tunable parameters with shareable URL state.
- Prompt, HTML, CSS, and JavaScript aligned with the same motion specification.
- Related Product Moments whenever a Pack uses the primitive in a complete
  product context.

## Version Strategy

### v0.1 — Vocabulary and canonical workspaces

44 canonical units and 91 source terms established the shared vocabulary,
routing, SEO, i18n, portable exports, CLI, Skill, and quality gates.

### v0.2 — Motion Finder

Finder added a local recommendation model for vague motion requests. It ranks up
to three candidates, keeps the selected candidate in one primary preview, and
shares current state through the URL and CLI.

### V1.0 — Motion Packs

V1 introduced 16 high-quality Packs with real product scenes and visible state
changes.

1. Make every Pack directly usable through Prompt, HTML, CSS, and JavaScript.
2. Expose Packs through the website, CLI, Agent Skill, `packs.json`, and
   `llms.txt` for people and agents.
3. Let real user questions and product feedback guide future Pack additions.

### V1.1 — Equal collections, connected discovery

V1.1 establishes Product Moments and Motion Primitives as equal public
collections.

1. Give Product Moments and Motion Primitives equal first-level navigation and
   clear, dedicated catalog routes.
2. Link each Pack to the Motion Primitives that shape its behavior, and expose
   every declared relationship from both directions.
3. Let Finder return useful results from both collections.
4. Align the website, CLI (`packs` and `list`), Agent Skill, public data, README, and `llms.txt`
   around the two-collection product model.

### V1.2 — Expanded product moments

V1.2 expands Product Moments from 16 to 28 complete interactions while keeping
the four product groups balanced at seven Packs each.

1. Cover common product states across upload, sync, deletion, assignees,
   permissions, search, kanban, cart, comments, approvals, checkout, and scheduled publishing.
2. Keep each additional Pack connected to the Motion Primitives that explain its
   timing and behavior.
3. Keep website navigation, Finder, CLI, Agent Skill, public data, README, SEO,
   and static routes aligned with the complete 28-Pack collection.

## Content Principles

- Show the product moment before explaining it.
- Keep labels concrete and compact.
- Present the common path first; place implementation details one level deeper.
- Keep one action visually dominant in each state.
- Give every visual behavior purpose, trigger, outcome, and reduced-motion guidance.
- Keep preview, Prompt, HTML, CSS, and JavaScript driven by one source of truth.
- Treat Chinese and English as first-class product content.
- Preserve every existing canonical recipe, term, alias, and acquisition route.

## Interaction Principles

- Live Pack previews must perform the named product interaction, with a visible
  before-and-after state and repeatable actions.
- Input should receive immediate press and focus feedback.
- Completion should land quickly, clearly, and without decorative delay.
- Pack previews use compositor-friendly properties and avoid continuous loops
  unless a loop carries product meaning.
- Copy actions have explicit success and failure states.
- Touch targets remain comfortable at mobile widths.
- `prefers-reduced-motion` removes large travel, looping, and scale while
  preserving status, outcome, and action availability.

## Visual Principles

The production design uses a quiet, product-led Apple-inspired visual language:

- System typography, compact type sizes, and precise hierarchy keep attention on
  the product moment.
- Chroma-zero neutrals establish depth; restrained blue carries focus, selection,
  and readiness.
- Cards use 16px radii, navigation controls use 8px radii, and primary actions
  use pill shapes.
- Preview scenes carry the visual character; surrounding chrome stays calm.
- Structural lines, spacing, and shadows clarify hierarchy without decoration.

## Quality Bar

Before a V1.2 change is considered done:

- All 28 Pack routes render with a stable H1, localized metadata, canonical URL,
  and a live product interaction.
- Pack previews, Prompt, HTML, CSS, JavaScript, and reduced-motion guidance stay
  in sync from the same data source.
- Product Moments and Motion Primitives each have equal first-level routes;
  declared Pack-to-Primitive relationships stay reciprocal.
- Finder, catalog, vocabulary, all 44 workspaces, and all 91 terms remain
  available and indexable.
- Desktop and mobile layouts stay free of horizontal page overflow.
- Functional text remains accessible in light and dark themes.
- Public data, CLI, Agent Skill, README, and `llms.txt` describe the same V1.2
  two-collection product model.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run i18n:check`,
  `npm run vocabulary:check`, `npm run seo:check`, `npm run motion:check`,
  `npm run a11y:check`, `npm run build`, `npm run bundle:check`,
  `npm run crawl:dist`, and `npm run test:visual` pass.
