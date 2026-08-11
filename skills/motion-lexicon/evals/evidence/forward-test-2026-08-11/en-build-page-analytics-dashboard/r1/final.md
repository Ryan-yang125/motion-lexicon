Implemented a complete analytics dashboard at `/analytics` (also shown at `/`).

Changed: [AnalyticsPage.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-analytics-dashboard-r1/work/src/pages/AnalyticsPage.tsx), [router.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-analytics-dashboard-r1/work/src/router.tsx), [styles.css](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-analytics-dashboard-r1/work/src/styles.css), [index.html](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-analytics-dashboard-r1/work/index.html), and [smoke.spec.ts](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-analytics-dashboard-r1/work/tests/smoke.spec.ts).

The range control updates all KPIs, retention data, cohort mix, and top segments in one refresh state. A rapid second range selection supersedes the in-flight refresh. Export downloads the active range as CSV and confirms in place.

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript + Vite 7.1.7 — `package.json` |
| Route | Hand-written pathname router — `src/router.tsx` |
| Component system | Reused native `Button` and focus target styles — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS variables with `.dark` root class — `src/styles.css` |
| Tailwind | Tailwind 4 compiled through Vite — `package.json`, `vite.config.ts` |
| Dependencies | Reused existing `motion` availability; no new dependencies — `package.json` |

## Page Plan

Job: Compare performance for a reporting period and export a shareable snapshot.  
Archetype: Dashboard / operations surface.  
Primary action: Change reporting range.  
Primary state: idle → updating → refreshed.

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Header | Workspace orientation, theme and export actions | `none` | Compact responsive header |
| Report controls | Select report range | `none` | Stable controls; clear refresh feedback |
| KPI summary | Scan acquisition, activation, and revenue | `none` | Range-specific values and deltas |
| Retention surface | Compare retention behavior | `none` | Fixed chart geometry during refresh |
| Top segments | Identify revenue-driving audiences | `none` | Updates with selected range |
| Export feedback | Confirm active CSV export | `none` | In-place pending/success label |

Registry: none — plain semantic controls best fit this focused in-page state change.

Responsive: stacks at 320/390, two-column metrics at 768, four-up metrics and chart/sidebar at 1440.  
Theme: existing light/dark tokens. Reduced motion uses an effectively instant opacity state transition.

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` exited 0 |
| 320 | Document 320px / viewport 320px; minimum target 44×44px; 0 offenders |
| 390 | Document 390px / viewport 390px; minimum target 44×44px; 0 offenders |
| 768 | Document 768px / viewport 768px; minimum target 44×44px; 0 offenders |
| 1440 | Document 1440px / viewport 1440px; minimum target 44×44px; 0 offenders |
| Light / dark | Initial light theme and theme-toggle dark class both inspected |
| Keyboard / focus | Tab sequence after theme control entered Export then range controls; native focus styling retained |
| Reduced motion | Emulated `reduce`; range update retained pending/success feedback with `0.00001s` transition |
| Targets | All visible buttons and links audited at all four widths; minimum 44×44px |
| Primary state | Range switch showed `aria-busy=true`, refreshed data; rapid 7→90 day selection settled on 90-day value `182,590`; CSV export produced `northstar-analytics-7d.csv` |
| Runtime | Direct browser audit found 0 console/page errors |
| Browser smoke | `ML_EVAL_PORT=4175 npm run test:browser` passed |