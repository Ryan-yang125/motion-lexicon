# Motion Lexicon Product

## Product Promise

Motion Lexicon turns vague interface intent into visible, explainable, tunable, copy-ready motion recipes.

The primary journey is **Describe → Choose → Tune → Use**. The product helps a user move from a feeling to a precise recipe they can share with another person or hand to an agent. Every primary surface should answer four questions quickly:

- What can I describe in my own words?
- What does this motion look like?
- Which close motion fits this situation?
- How do I reproduce it with prompt text or portable HTML/CSS/JavaScript?

## Primary Users

- Product builders who can describe interface intent, yet do not have precise animation vocabulary.
- Designers who want a shared visual reference for motion patterns.
- Engineers and agents that need concrete parameters, code, and reduced-motion guidance.

## Product Structure

The site is a static, SEO-friendly application with two primary destinations and supporting acquisition surfaces:

- **Find motion:** the landing experience carries the Finder intake directly. A bilingual description produces three ranked variants, focuses the strongest current choice, offers synchronized comparison through one action, and continues into tuning and export.
- **Library:** one browsing destination for 31 copy-ready components, 9 focused playgrounds, and 4 guides. Search, surface, and category controls reveal the catalog progressively.
- **Recipe workspace:** a selected motion opens as a dominant preview stage with nearby controls, a primary Prompt action, portable output, and deeper reference material.
- **Vocabulary and category pages:** stable, indexable acquisition pages that preserve all 91 terms, close-term distinctions, and every motion family, then lead into canonical workspaces.
- **Alias routes:** preserve legacy vocabulary URLs and resolve each related term to a canonical unit or meaningful preset.
- **Open-source resources:** CLI, Agent Skill, versioned JSON, schemas, and repository links remain accessible from the utility layer and project footer.

Recipe URLs are canonical content URLs. Query parameters carry only tunable state such as duration, delay, distance, and easing.

## Version Strategy

The v0.1 launch ships 44 canonical units backed by all 91 vocabulary terms. Architecture, routing, SEO, i18n, themes, controls, exports, content, assets, and test gates are part of the production surface.

The v0.2 release adds Motion Finder as the decision layer above that catalog:

1. Accept a vague feeling, interface goal, or behavior in Chinese or English.
2. Return up to three ranked variants with a concise reason and close-term distinction.
3. Replay the candidates in the same scene for direct comparison.
4. Preserve variants and aliases as meaningful presets while resolving implementation through canonical recipes.
5. Continue into the existing parameter, Prompt, HTML, CSS, JavaScript, and reduced-motion workflow.

The recommendation engine, web Finder, CLI `recommend` command, and Agent Skill share one versioned intent model. The entire path runs locally in the static frontend or CLI and requires no account or runtime server.

The current product experience unifies the landing intake and Finder language, establishes Find motion and Library as the primary navigation, and applies focused workspaces plus progressive disclosure across Finder, catalog, and recipe pages. This redesign preserves the v0.2 data model, URLs, exports, CLI, Skill, and SEO surface.

## Content Principles

- Show the motion before explaining it.
- Keep labels concrete and short.
- Present the common path first and place advanced parameters, code, review guidance, and reference material one level deeper.
- Keep one primary action visually dominant in each state: submit a description, select a candidate, tune the motion, or copy the result.
- Pair every visual behavior with purpose, frequency, trigger, enter/exit, interruptibility, gesture rules, review notes, and reduced-motion guidance.
- Keep preview, controls, Prompt, HTML, CSS, and JavaScript driven by one motion specification.
- Maintain an original, implementation-oriented English definition for every vocabulary term and display concise product summaries as a separate layer.
- Keep React source out of user-facing exports; users receive portable Prompt, HTML, CSS, and framework-independent JavaScript where behavior requires it.
- Treat Chinese and English as first-class content. Both locales need complete route coverage and metadata.
- Keep every category content-bearing. Empty category routes are a launch blocker.

## Content Ownership

- Motion Lexicon independently maintains the 91 English technical definitions, Chinese translations, close-term distinctions, and 44-workspace curation.
- Motion Lexicon maintains its summaries, examples, parameters, previews, design contracts, review criteria, Prompt/HTML/CSS/JavaScript output, SEO, and product UI.
- Project source code uses MIT; project-authored content and data use CC BY 4.0; generated code fragments use 0BSD. The root license files define the exact boundaries.

## Interaction Principles

- Keep the main journey continuous: Describe → Choose → Tune → Use.
- Focus one recommended candidate and show two compact alternatives. Keep synchronized three-way comparison available through one action.
- Pair the preview stage and Inspector on desktop. Stack the Inspector after the stage on narrower layouts, and condense mobile comparison into compact scan-friendly rows.
- Controls must update preview, generated CSS, generated HTML, generated prompt, and URL state together.
- Gesture components must perform the named behavior in the preview and copied output, with pointer capture, multi-touch protection, damping, velocity-aware settlement, cancellation, and keyboard parity where applicable.
- The current recipe should stay shareable through its URL.
- Finder URLs should preserve the original query, candidate comparison, selected variant, and non-default parameter values.
- Finder candidates should replay from one control and use a shared scene so visual differences remain directly comparable.
- Copy actions need explicit success and failure states.
- Buttons, links, inputs, and disclosures need immediate press, focus, and completion feedback.
- Touch targets should meet 44px on mobile and remain comfortable on desktop.
- Motion controls should respect `prefers-reduced-motion` while preserving meaning. Translucent chrome should also adapt to `prefers-reduced-transparency`, with stronger boundaries available under increased contrast preferences.

## Visual Principles

The production design adapts Apple-inspired foundations to Motion Lexicon's own web product language:

- **Purpose:** each screen makes the next useful action obvious and gives the motion preview the strongest visual weight.
- **Agency:** users can revise the original request, switch candidates, replay all candidates, change parameters, reset values, open deeper references, and copy the output they need.
- **Simplicity:** Find motion and Library form the primary navigation. Shared workspaces reveal output, advanced controls, vocabulary, decisions, review guidance, accessibility, and related material progressively.
- **Craft:** platform system fonts, size-specific tracking, deliberate leading, stable spacing, responsive focus states, and carefully scoped transitions create a calm, confident interface.
- Chroma-zero light and dark neutrals establish depth, while a single blue state color carries focus, selection, readiness, and primary actions.
- Whitespace, scale, and surface elevation provide hierarchy. Borders appear at structural boundaries, and larger preview surfaces use more generous radii.
- Translucent material is reserved for floating navigation, utility popovers, toolbars, and Inspectors. Solid preview surfaces preserve legibility and visual comparison.
- Mono typography is reserved for code, IDs, filenames, and precise values.
- Real animation scenes carry the product character. Supporting chrome remains quiet and predictable.

## Quality Bar

Before a change is considered done:

- Static pages build with route-level SEO metadata.
- Finder pages prerender in both locales and publish stable canonical URLs.
- Web and CLI recommendation tests return the same ordered variants, reasons, presets, and compare state for the same intent.
- Recipe pages contain a real H1 and stable canonical path.
- Desktop and mobile have no horizontal overflow.
- Functional text passes accessible contrast in light and dark themes.
- Landing and Finder make the natural-language intake the clear first action.
- Finder focus mode presents one primary candidate and two alternatives; synchronized comparison remains one action away.
- Desktop places the active preview beside the Inspector; narrow layouts preserve the stage-first reading order.
- Recipe pages show preview, common controls, and the primary Prompt action before deeper output and reference material.
- Reduced-motion mode removes position, scale, looping, and parallax movement while retaining short opacity or color feedback that preserves meaning.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run i18n:check`, `npm run vocabulary:check`, `npm run seo:check`, `npm run motion:check`, `npm run a11y:check`, `npm run build`, `npm run bundle:check`, `npm run crawl:dist`, and `npm run test:visual` pass.
