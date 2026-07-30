# Motion Lexicon Product

## Product Promise

Motion Lexicon turns motion vocabulary into visible, tunable, copy-ready recipes.

The product helps a user move from a vague motion idea to a precise recipe they can share with another person or hand to an agent. Every important page should answer three questions quickly:

- What does this motion look like?
- When should I use it?
- How do I reproduce it with prompt text or portable HTML/CSS/JavaScript?

## Primary Users

- Product builders who can describe interface intent, yet do not have precise animation vocabulary.
- Designers who want a shared visual reference for motion patterns.
- Engineers and agents that need concrete parameters, code, and reduced-motion guidance.

## Product Structure

The site is a static, SEO-friendly application with these public surfaces:

- Landing page: introduces the library and highlights representative motion recipes.
- Motion Finder: turns a vague bilingual description into three ranked variants, explains their differences, compares them in one scene, and continues into tuning and export.
- Components: 31 copy-ready patterns with real previews, relevant controls, and synchronized exports.
- Playgrounds: 9 focused labs for timing, easing, spring physics, transforms, scroll, and review principles.
- Guides: 4 reference hubs for performance, purposeful motion, perceived performance, and reduced motion.
- Vocabulary: all 91 motion terms with original English technical definitions, accurate Chinese translations, and close-term distinctions.
- Category pages: stable, indexable collections for each motion family.
- Alias routes: preserve the 91-term vocabulary and resolve each legacy term to a canonical unit.

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

## Content Principles

- Show the motion before explaining it.
- Keep labels concrete and short.
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

- Controls must update preview, generated CSS, generated HTML, generated prompt, and URL state together.
- Gesture components must perform the named behavior in the preview and copied output, with pointer capture, multi-touch protection, damping, velocity-aware settlement, cancellation, and keyboard parity where applicable.
- The current recipe should stay shareable through its URL.
- Finder URLs should preserve the original query, candidate comparison, selected variant, and non-default parameter values.
- Finder candidates should replay from one control and use a shared scene so visual differences remain directly comparable.
- Copy actions need explicit success and failure states.
- Touch targets should meet 44px on mobile and remain comfortable on desktop.
- Motion controls should respect `prefers-reduced-motion` while preserving meaning.

## Visual Principles

The production design uses a formal component-library visual system:

- Chroma-zero white, gray, and black establish the page hierarchy in both themes.
- Black primary actions and a single blue state color keep emphasis predictable.
- Thin borders, compact 6-10px radii, and disciplined type sizes create a dense documentation surface.
- Small mono labels support metadata, controls, file names, and catalog structure.
- Real animation previews carry the visual character; navigation and documentation remain stable and quiet.
- Home, catalog, category, and detail pages share the same spacing, card, toolbar, search, and focus rules.

Avoid generic SaaS decoration, oversized marketing card stacks, ornamental gradients, multi-accent palettes, and visual patterns that make the product feel detached from animation vocabulary.

## Quality Bar

Before a change is considered done:

- Static pages build with route-level SEO metadata.
- Finder pages prerender in both locales and publish stable canonical URLs.
- Web and CLI recommendation tests return the same ordered variants, reasons, presets, and compare state for the same intent.
- Recipe pages contain a real H1 and stable canonical path.
- Desktop and mobile have no horizontal overflow.
- Functional text passes accessible contrast in light and dark themes.
- Mobile puts the active recipe workflow within the first meaningful viewport.
- Reduced-motion mode removes position, scale, looping, and parallax movement while retaining short opacity or color feedback that preserves meaning.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run i18n:check`, `npm run vocabulary:check`, `npm run seo:check`, `npm run motion:check`, `npm run a11y:check`, `npm run build`, `npm run bundle:check`, `npm run crawl:dist`, and `npm run test:visual` pass.
