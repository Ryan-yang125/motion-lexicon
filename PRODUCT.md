# Motion Lexicon Product

## Product Promise

Motion Lexicon gives a product builder a complete, polished interaction they can
preview, understand, and copy into an interface.

V1 is centered on **Motion Packs**: real product moments such as saving,
publishing, choosing, inviting, filtering, and undoing. Each Pack combines a
recognisable scene, a clear interaction contract, short motion, accessible
reduced-motion behavior, and portable Prompt/HTML/CSS/JavaScript output.

The primary journey is **Preview → Trigger → Inspect → Copy**:

- What product moment does this Pack solve?
- What changes when the user triggers it?
- What timing and reduced-motion behavior make it feel right?
- How can I carry it into my own interface today?

Motion Finder and the vocabulary continue to support the decision journey:
**Describe → Choose → Tune → Use**. Finder gives users accurate motion
language; Motion Packs turn that language into a complete product interaction.

## Primary Users

- Product builders who want refined interactions without starting from a blank canvas.
- Designers who need a shared, interactive reference during product decisions.
- Engineers who need portable HTML, CSS, JavaScript, and behavior guidance.
- AI agents that benefit from exact prompts, structured data, and explicit motion constraints.

## V1 Product Structure

The site is a static, SEO-friendly application with Motion Packs as its primary
surface and the existing dictionary as its discovery foundation.

- **Motion Pack gallery:** `/:locale/` and `/:locale/packs/` present 16 real
  product moments, grouped by feedback, choice, change, and workflow.
- **Motion Pack detail:** `/:locale/packs/:packId/` gives each Pack a dominant
  live preview, concise interaction guidance, and a Prompt/Code export surface.
- **Motion Finder:** `/:locale/finder/` receives a natural-language description,
  returns ranked candidates, and leads into precise vocabulary and recipe work.
- **Motion Library:** `/:locale/catalog/` preserves 44 canonical workspaces
  across components, focused playgrounds, and guides.
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

The V1 set contains 16 Packs:

| Group | Packs |
| --- | --- |
| Feedback | Save confirmation, Publish release, Share link |
| Choice | Card selection, Workspace switch, Template choice |
| Change | Layer insertion, Archive undo, Filter results, Inline validation |
| Workflow | Command menu, Details disclosure, Notification triage, Progress steps, Member invite, Media scrub |

## Version Strategy

### v0.1 — Vocabulary and canonical workspaces

44 canonical units and 91 source terms established the shared vocabulary,
routing, SEO, i18n, portable exports, CLI, Skill, and quality gates.

### v0.2 — Motion Finder

Finder added a local recommendation model for vague motion requests. It ranks up
to three candidates, keeps the selected candidate in one primary preview, and
shares current state through the URL and CLI.

### V1.0 — Motion Packs

V1 changes the product’s center of gravity from individual motion primitives to
complete product moments.

1. Ship 16 high-quality Packs with real product scenes and visible state changes.
2. Make every Pack directly usable through Prompt, HTML, CSS, and JavaScript.
3. Keep Finder, the 44 canonical workspaces, and all 91 terms as a durable
   choice, search, SEO, and reference layer.
4. Expose Packs through the website, CLI, Agent Skill, `packs.json`, and
   `llms.txt` for people and agents.
5. Let real user questions and product feedback guide future Pack additions.

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

Before a V1 change is considered done:

- All 16 Pack routes render with a stable H1, localized metadata, canonical URL,
  and a live product interaction.
- Pack previews, Prompt, HTML, CSS, JavaScript, and reduced-motion guidance stay
  in sync from the same data source.
- Finder, catalog, vocabulary, all 44 workspaces, and all 91 terms remain
  available and indexable.
- Desktop and mobile layouts stay free of horizontal page overflow.
- Functional text remains accessible in light and dark themes.
- Public data, CLI, Agent Skill, README, and `llms.txt` describe the same V1
  Pack surface.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run i18n:check`,
  `npm run vocabulary:check`, `npm run seo:check`, `npm run motion:check`,
  `npm run a11y:check`, `npm run build`, `npm run bundle:check`,
  `npm run crawl:dist`, and `npm run test:visual` pass.
