<!-- markdownlint-disable MD013 MD033 MD041 -->

<p align="center">
  <img src="public/brand/motion-lexicon-mark.svg" width="80" height="80" alt="Motion Lexicon" />
</p>

<h1 align="center">Motion Lexicon</h1>

<p align="center">
  <strong>Copy-ready React motion components for memorable products.</strong><br />
  100 components · 10 Page Blocks · live previews · shadcn Registry · reduced motion.
</p>

<p align="center">
  <a href="./README.md"><strong>English</strong></a> · <a href="./README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  <a href="https://motion-lexicon.pages.dev/en/"><strong>Website</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/components/"><strong>Components</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/blocks/"><strong>Page Blocks</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/primitives/"><strong>Primitives</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/skill/"><strong>Motion Lexicon Skill</strong></a> ·
  <a href="https://motion-lexicon.pages.dev/en/guides/"><strong>Guides</strong></a>
</p>

<p align="center">
  <a href="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml"><img src="https://github.com/Ryan-yang125/motion-lexicon/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-292929.svg" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/components-100-292929.svg" alt="100 components" />
  <img src="https://img.shields.io/badge/page_blocks-10-111111.svg" alt="10 page blocks" />
  <img src="https://img.shields.io/badge/primitives-44-737373.svg" alt="44 primitives" />
</p>

<!-- markdownlint-enable MD013 MD033 MD041 -->

## Start with Components

Motion Lexicon is a React component library for product interactions with a
clear resting frame, a recognizable motion signature, real content, and an
installation path. Components lead discovery; Page Blocks, Primitives, and the
Skill extend the same system.

| Collection | Use it for | Delivery |
| --- | --- | --- |
| [Components](https://motion-lexicon.pages.dev/en/components/) | One complete product interaction | Live preview, source, typed API, and shadcn Registry install |
| [Page Blocks](https://motion-lexicon.pages.dev/en/blocks/) | One responsive product page assembled from Components | Self-contained React page, viewport preview, source, and Registry install |
| [Primitives](https://motion-lexicon.pages.dev/en/primitives/) | A reusable motion rule or timing decision | 44 canonical workbenches covering all 91 source terms |
| [Motion Lexicon Skill](https://motion-lexicon.pages.dev/en/skill/) | Product-aware composition and implementation guidance | Component selection, page plan, implementation, and review workflow |

The 100 Components span 11 categories: Agent UI, Actions, Overlays & Surfaces,
Forms & Input, Navigation, Data & Commerce, Feedback, Cards & Media, Visual &
Ambient, Hero & Story, and Text & Type.

## Three scene families

- **Product Mono** — precise product states, data, forms, navigation, and feedback.
- **Editorial Warm** — image-led stories, material detail, generous type, and cultural character.
- **Spatial Dark** — dimensional product worlds, technical depth, and restrained light.

Each scene begins with an intentional static frame. Motion explains a user
action or meaningful state change; reduced motion preserves the same outcome.

## Install

Every Component and Page Block follows one source chain:

```text
implementation → direct-import demo → preview and code view → /r/:id.json
```

```bash
npx shadcn@latest add https://motion-lexicon.pages.dev/r/cinematic-hero.json
npx shadcn@latest add https://motion-lexicon.pages.dev/r/focus-gallery.json
npx shadcn@latest add https://motion-lexicon.pages.dev/r/onboarding-flow.json
```

Add the registry once to `components.json` for shorter commands:

```json
{
  "registries": {
    "@motion-lexicon": "https://motion-lexicon.pages.dev/r/{name}.json"
  }
}
```

```bash
npx shadcn@latest add @motion-lexicon/cinematic-hero
```

Registry items declare their runtime dependencies. The library uses React,
Motion, GSAP, Three.js, WebGL, SVG, and CSS where they suit the component job.
Heavy scenes gate work to the viewport and release graphics resources on
unmount.

## Motion Lexicon Skill 4.2.0

The Skill is versioned independently from the website package. Install it when
an agent needs a page plan, exact Registry component selection, implementation
guidance, or motion and accessibility review.

```bash
# Install for the current project
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon

# Install at user scope
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon --global

# Install only for Codex; replace codex with another supported agent ID when needed
npx skills add Ryan-yang125/motion-lexicon --skill motion-lexicon --agent codex
```

Use `npx skills list` for a project install and `npx skills list --global` for
a user-scope install.

## Development

```text
src/registry/components/       100 React Component implementations
src/registry/demos/            Direct-import, real-product Component demos
src/registry/blocks/           10 React Page Block implementations
src/registry/block-demos/      Direct-import, responsive Block demos
src/registry/primitives/       44 canonical motion primitives
src/data/                      Catalog, routing, i18n, and SEO source
skills/motion-lexicon/         Independently versioned Skill 4.2.0
scripts/                       Registry, prerender, and quality checks
```

Motion Lexicon is a static React + TypeScript application. `npm run build`
generates the application, localized prerendered pages, sitemap, public catalog,
and the shadcn-compatible registry under `/r/`.

```bash
npm ci
npm run dev
npm run build
```

## Quality gates

```bash
npm run lint
npm run typecheck
npm run test
npm run i18n:check
npm run vocabulary:check
npm run motion-grammar:check
npm run skill:check
npm run artifacts:check
npm run seo:check
npm run motion:check
npm run a11y:check
npm run build
npm run bundle:check
npm run crawl:dist
npm run test:visual
```

## Release assets

V6 screenshots, social images, machine-readable catalog output, and public
Registry JSON are regenerated during release acceptance after catalog and visual
review are complete.

## License and attribution

- Application and component code: [MIT](./LICENSE)
- Project-authored content: [CC BY 4.0](./CONTENT-LICENSE)
- Interior-derived interaction work: [MIT attribution](./NOTICE)

The collection builds on interaction principles and MIT-licensed
implementations from [Interior](https://github.com/ddoemonn/interior).
