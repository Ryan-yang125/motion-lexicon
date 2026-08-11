Implemented the complete support inbox at `/support`.

Key behavior includes filters/search, responsive conversation selection, customer details, ticket-owned drafts, asynchronous replies, interruptible selection transitions, failure/retry feedback, resolved/reopen states, dark mode, reduced motion, and focus restoration.

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1, TypeScript 5.9.3, Vite 7.1.7 — [package.json](/private/tmp/ml-v420-support-last-VYcyty/en-build-page-support-inbox-r1/work/package.json) |
| Route | Added `/support` — [src/router.tsx:8](/private/tmp/ml-v420-support-last-VYcyty/en-build-page-support-inbox-r1/work/src/router.tsx:8) |
| Component system | Existing semantic `Button`; new page-specific UI and Registry component — `src/components/ui/Button.tsx` |
| Tokens / theme | Expanded CSS-variable light/dark system using the existing `.dark` mechanism — [src/styles.css](/private/tmp/ml-v420-support-last-VYcyty/en-build-page-support-inbox-r1/work/src/styles.css) |
| Tailwind | Tailwind 4.1.14 compiled through Vite — `vite.config.ts`, `package.json` |
| Dependencies | Reused existing `motion` 12.23.24 — `package.json` |

## Page Plan

Job: Let support operators triage conversations, understand customer context, reply safely, and resolve tickets without losing newer selections.  
Archetype: Dashboard / operations surface.  
Primary action: Send a reply to the active ticket.  
Primary state: idle → pending → success/error, with newer ticket selection interrupting the visual transition.

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| App header | Product context, coverage, theme | `none` | Immediate theme switch |
| Filter rail | Filter queue by status and priority | `none` | Selected filter and live counts |
| Conversation list | Scan, search, and select tickets | `none` | Interruptible active selection and empty state |
| Ticket thread | Read active conversation | `none` | Directional crossfade; static under reduced motion |
| Customer details | Account and ownership context | `none` | Responsive contextual panel |
| Reply composer | Draft and asynchronously reply | `loading-button` | Pending, success, error, retry |
| Resolved state | Confirm closure and allow reopening | `none` | Stable success state with focus handoff |

Registry:

- `loading-button` — https://motion-lexicon.pages.dev/r/loading-button.json — [components/motion-lexicon/loading-button.tsx:180](/private/tmp/ml-v420-support-last-VYcyty/en-build-page-support-inbox-r1/work/components/motion-lexicon/loading-button.tsx:180) — dependency: `motion`

Responsive: 320/390 use queue-to-detail navigation; 768 uses list plus conversation; 1440 adds the customer panel.  
Theme: Semantic light/dark variables; reduced motion removes directional travel.

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` exited 0; 435 modules transformed |
| 320 | viewport/document 320/320; minimum target 44×44; 0 offenders |
| 390 | viewport/document 390/390; minimum target 44×44; 0 offenders |
| 768 | viewport/document 768/768; minimum target 44×44; 0 offenders |
| 1440 | viewport/document 1440/1440; minimum target 44×44; 0 offenders |
| Light / dark | Keyboard toggled `.dark`; body changed from `rgb(239, 238, 234)` to `rgb(20, 19, 18)` |
| Keyboard / focus | Tab entered brand then theme; mobile selection focused Back; Back returned focus to the originating row; Resolve/Reopen returned focus to the replacement action |
| Reduced motion | Emulated `prefers-reduced-motion: reduce`; arriving thread computed `transform: none` |
| Targets | Every visible button, link, input, and textarea enumerated; measured minimum 44×44 |
| Primary state | Exercised pending, success, simulated error/retry, resolve/reopen, and selection during an in-flight reply; the completed reply remained on its originating ticket |
| Runtime | 0 console errors, page errors, failed requests, or hydration errors |
| Browser suite | `npm run test:browser -- --reporter=line` — 7/7 passed |

Primary implementation: [SupportInboxPage.tsx:165](/private/tmp/ml-v420-support-last-VYcyty/en-build-page-support-inbox-r1/work/src/pages/SupportInboxPage.tsx:165). Verification coverage: [smoke.spec.ts:39](/private/tmp/ml-v420-support-last-VYcyty/en-build-page-support-inbox-r1/work/tests/smoke.spec.ts:39).