Implemented the support inbox at `/support` (also served at `/`).

Key files: [support page](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-support-inbox-r2/work/src/pages/SupportInboxPage.tsx), [route](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-support-inbox-r2/work/src/router.tsx), [styles](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-support-inbox-r2/work/src/styles.css), and [browser tests](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-support-inbox-r2/work/tests/smoke.spec.ts).

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1 + TypeScript + Vite — `package.json` |
| Route | pathname router — `src/router.tsx` |
| Component system | native Button wrapper — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS variables and `.dark` root class — `src/styles.css` |
| Tailwind | Tailwind Vite plugin enabled — `package.json`, `vite.config.ts` |
| Dependencies | Motion 12.23.24 reused — `package.json` |

## Page Plan

Job: triage and resolve customer tickets while preserving conversation context.  
Archetype: workbench.  
Primary action: send a reply.  
Primary state: idle → sending → sent/error; selecting another ticket interrupts the pending visual state.

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Header | Queue context and theme | `none` | Responsive header |
| Filters | Narrow tickets by status | `segmented-control` | Shared selected state |
| Conversation list | Scan and select tickets | `none` | Stable selection |
| Ticket details | Read transcript/context | `none` | Selection crossfade |
| Composer | Send and retry replies | `loading-button` | Async pending/success/error |
| Resolved state | Close/reopen ticket | `none` | Contextual confirmation |

Registry:
- `segmented-control` — `https://motion-lexicon.pages.dev/r/segmented-control.json` — [SegmentedControl.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-support-inbox-r2/work/src/components/ui/SegmentedControl.tsx) — dependency: `motion`
- `loading-button` — `https://motion-lexicon.pages.dev/r/loading-button.json` — [LoadingButton.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-build-page-support-inbox-r2/work/src/components/ui/LoadingButton.tsx) — dependency: `motion`

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` exited 0 |
| 320 | document 320px; minimum target 44×44px; 0 offenders |
| 390 | document 390px; minimum target 44×44px; 0 offenders |
| 768 | document 768px; minimum target 44×44px; 0 offenders |
| 1440 | document 1440px; minimum target 44×44px; 0 offenders |
| Light / dark | Theme button toggled `.dark`; both inspected |
| Keyboard / focus | Composer → Tab reaches Send; Shift+Tab returns; Enter submits |
| Touch / pointer | Synthetic touch submits; pointer exercises retry and resolution |
| Reduced motion | Emulated preference; selection settles with transition duration ≤0.01ms |
| Primary state | Tested sending, selection interruption, simulated failure/retry, sent, resolve, and reopen |
| Runtime | 0 console, page, and failed/4xx request errors |
| Browser tests | `ML_EVAL_PORT=4174 npm run test:browser`: 2 passed |