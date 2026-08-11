Implemented the complete analytics dashboard at `/analytics` and `/`, including responsive KPI summaries, retention chart, top segments, date ranges, CSV export, dark mode, and accessible motion.

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript 5.9.3 on Vite 7.1.7 — `package.json` |
| Route | Pathname router, dashboard available at `/` and `/analytics` — [router.tsx](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r3/work/src/router.tsx:1) |
| Component system | Reused native `Button` primitive — `src/components/ui/Button.tsx` |
| Tokens / theme | Extended existing CSS-variable light/dark theme — [styles.css](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r3/work/src/styles.css:1) |
| Tailwind | Tailwind 4.1.14 compiled through Vite and CSS import — `package.json`, `vite.config.ts` |
| Dependencies | Reused React and `motion` 12.23.24; no new packages declared — `package.json` |

## Page Plan

Job: Help a growth operator assess product health across a selected reporting window and export the current view.  
Archetype: Dashboard / operations surface.  
Primary action: Change the reporting range.  
Primary state: ready → updating → ready; export adds idle → pending → success/error.

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Sidebar / mobile header | Product orientation and theme control | `none` | Desktop rail → compact mobile bar |
| Page header | Report context and export | `none` | Export pending, success, error/retry |
| Date-range control | Select 7, 30, or 90 days | `segmented-control` | Shared highlight and keyboard selection |
| KPI summary | Scan core performance | `none` | Values crossfade and settle |
| Retention workspace | Compare cohort behavior | `none` | Stable chart geometry and series redraw |
| Top segments | Rank valuable audiences | `none` | Bars and values update with range |

Registry:

- `segmented-control` — https://motion-lexicon.pages.dev/r/segmented-control.json — [segmented-control.tsx](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r3/work/src/components/motion-lexicon/segmented-control.tsx:1) — dependency: `motion`; runtime: light.

Responsive: Single-column mobile at 320/390, two-column KPI layout at 768, persistent sidebar and 2:1 analysis grid at 1440.  
Theme: Semantic light/dark surfaces with reduced-motion crossfade/immediate handoff.

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` exited 0; 434 modules transformed |
| 320 | 320/320 viewport/document width; minimum target 44×44 px; 0 offenders |
| 390 | 390/390; minimum target 44×44 px; 0 offenders |
| 768 | 768/768; minimum target 44×44 px; 0 offenders |
| 1440 | 1440/1440; minimum target 91.3×44 px; 0 offenders |
| Light / dark | Visually inspected 1440 light and 390 dark; dark body resolved to `rgb(20, 19, 18)` |
| Keyboard / focus | Tab path: Skip → Overview → Retention → Audiences → Preferences → Theme → Export → 30 days; ArrowRight selected 90 days; Shift+Tab returned to Export |
| Reduced motion | Emulated `reduce`; 90-day selection updated immediately without travel |
| Targets | Every visible button, link, and radio enumerated at all four widths; all ≥44 px |
| Primary state | Observed range updating/ready plus export pending, Escape cancellation, synthetic error, retry, download, and success |
| Runtime | 0 console, page, request, or hydration errors |
| Browser tests | `npm run test:browser`: 8 passed |

Main implementation: [AnalyticsDashboardPage.tsx](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r3/work/src/pages/AnalyticsDashboardPage.tsx:154). Browser coverage is in [smoke.spec.ts](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r3/work/tests/smoke.spec.ts:1).

Note: restoring the lockfile dependencies reported one existing high-severity npm audit item; I did not apply a potentially breaking forced upgrade.