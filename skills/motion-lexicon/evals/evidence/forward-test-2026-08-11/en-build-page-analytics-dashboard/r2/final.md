Implemented the complete analytics dashboard at `/analytics`, including responsive KPI cards, range-driven data updates, retention visualization, ranked segments, light/dark themes, and CSV export with recovery states.

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1, TypeScript 5.9.3, Vite 7.1.7 — `package.json` |
| Route | pathname router; `/analytics` maps to `AnalyticsPage` — `src/router.tsx` |
| Component system | existing semantic `Button`; added exact Motion Lexicon components — `src/components/` |
| Tokens / theme | warm-neutral CSS variables and `.dark` theme class — `src/styles.css` |
| Tailwind | Tailwind 4.1.14 compiled through `@tailwindcss/vite` — `vite.config.ts` |
| Dependencies | reused `motion` 12.23.24 and inline SVG; no new runtime packages — `package.json` |

## Page Plan

Job: Compare product activation and retention across reporting windows and export the current view.  
Archetype: Dashboard / operations surface  
Primary action: Change reporting range.  
Primary state: stable → updating → updated; export idle → pending → success/error.

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Header | Navigation, theme and export | `loading-button` | pending/success/error in place |
| Range toolbar | Change reporting context | `segmented-control` | shared selection highlight |
| KPI summary | Scan outcomes | `none` | crossfade to selected range |
| Retention surface | Compare cohort quality | `none` | primary chart transition |
| Top segments | Identify strongest audiences | `none` | stable ranked rows and bars |
| Status bar | Confirm current period | `none` | live pending/completion message |

Registry:

- `segmented-control` — https://motion-lexicon.pages.dev/r/segmented-control.json — `src/components/motion-lexicon/segmented-control.tsx` — dependency: `motion`
- `loading-button` — https://motion-lexicon.pages.dev/r/loading-button.json — `src/components/motion-lexicon/loading-button.tsx` — dependency: `motion`

Responsive: two-column mobile KPIs and stacked insights; four-column tablet/desktop KPIs; 2:1 desktop chart/segments grid.  
Theme: inspected light and `.dark` themes; reduced motion uses immediate state changes without travel.

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` exited 0; 436 modules transformed |
| 320 | viewport/document 320/320; minimum target 44×44px; 0 offenders |
| 390 | viewport/document 390/390; minimum target 44×44px; 0 offenders |
| 768 | viewport/document 768/768; minimum target 44×44px; 0 offenders |
| 1440 | viewport/document 1440/1440; minimum target 44×44px; 0 offenders |
| Light / dark | Activated through theme button; inspected both renders and dark control surfaces |
| Keyboard / focus | Tab: brand → theme → export → range; arrows change range; export retains focus after completion |
| Reduced motion | Emulated `reduce`; transition measured `1e-05s`, data/status remained intact |
| Targets | Six visible interactive nodes audited at every viewport; minimum 44×44px |
| Primary state | Exercised pending/update, rapid interruption, export failure/retry, successful `retention-overview-90d.csv` download |
| Runtime | 0 console, page, request, or hydration errors; 4 browser tests passed |

Key files: [AnalyticsPage.tsx](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r2/work/src/pages/AnalyticsPage.tsx), [styles.css](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r2/work/src/styles.css), [router.tsx](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r2/work/src/router.tsx), and [analytics.spec.ts](/private/tmp/ml-v420-final-WyIAsP/en-build-page-analytics-dashboard-r2/work/tests/analytics.spec.ts).