# Agent Instructions

## Operating Context

This repository is Motion Lexicon, a static React + TypeScript product for visual animation vocabulary.

Use these files as the current project context:

- `README.md`: project overview, commands, routes, SEO model, and delivery status.
- `PRODUCT.md`: product promise, user model, phase strategy, and quality bar.
- `DESIGN.md`: launch architecture, visual system, URL state, and acceptance criteria.
- `prototype/motion-lexicon-prototype.html`: archived phase-one reference; current production styling lives in `src/styles.css` and `src/library.css`.

## Communication

- Write Chinese by default.
- Use direct positive phrasing. Avoid先否定再转折的表达方式。
- Be concrete about files, commands, routes, and verification results.

## Product Boundary

- Keep this as a static frontend application unless the user adds a server-side requirement.
- Store content, assets, categories, recipes, and i18n data on the frontend.
- Preserve the production component-library system: chroma-zero light and dark neutrals, black primary actions, a restrained blue state color, thin borders, compact radii, small mono metadata, dominant preview canvases, and dense documentation structure.
- Keep the product workflow centered on browsing motion, previewing behavior, tuning parameters, copying prompt/code, and reading review guidance.
- Treat React as the site implementation. User-facing exports are portable Prompt, HTML, CSS, and framework-independent JavaScript where interaction requires it.
- Keep 44 canonical catalog units as the public discovery surface. Preserve all 91 source terms through canonical mappings and redirects.

## Technical Stack

- Vite, React, TypeScript.
- Tailwind CSS v4 plus the project stylesheet in `src/styles.css`.
- Local shadcn-style UI components backed by Radix primitives.
- lucide-react icons.
- TanStack Router.
- i18next and react-i18next.
- react-helmet-async for route metadata.
- Build-time static prerendering through `src/entry-server.tsx` and `scripts/prerender.ts`.
- Vitest and Playwright for verification.

## SEO Model

SEO is generated during `npm run build`.

The build flow is:

1. `tsc -b`
2. `vite build`
3. `tsx --tsconfig tsconfig.app.json scripts/prerender.ts`

`scripts/prerender.ts` enumerates static routes from `src/data/site.ts`, calls the React server renderer in `src/entry-server.tsx`, injects Helmet tags from `src/components/Seo.tsx`, writes `dist/<route>/index.html`, then writes `dist/sitemap.xml` and `dist/robots.txt`.

The deployed artifact is static HTML, CSS, and JS. Runtime deployment can use static hosting such as Cloudflare Pages, Vercel static output, Netlify, or any CDN-backed file server.

## Quality Gates

Before handing work back, run the relevant checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run i18n:check
npm run vocabulary:check
npm run seo:check
npm run motion:check
npm run a11y:check
npm run build
npm run bundle:check
npm run crawl:dist
npm run test:visual
```

For UI or routing changes, also inspect `/zh/`, `/zh/catalog/?surface=components`, `/zh/entrances/slide-in/`, and one category route such as `/zh/sequencing/` in a browser.

## Implementation Notes

- Recipe pages need stable H1 content, canonical URLs, localized metadata, and shareable query state.
- Preview markup, controls, Prompt, HTML, CSS, and reduced-motion behavior must come from the same motion specification.
- Default query values should stay omitted from the URL.
- Mobile layouts should put the active recipe workflow before the full catalog list.
- Interactive targets should stay at least 44px where users tap or click.
- `prefers-reduced-motion` should remove non-essential movement while preserving meaning.
