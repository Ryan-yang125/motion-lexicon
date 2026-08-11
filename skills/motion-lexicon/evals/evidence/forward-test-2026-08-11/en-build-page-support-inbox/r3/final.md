Implemented the complete support inbox at `/support`, including filters, search, ticket selection, customer details, async replies, failure/retry, interruptible selection, per-ticket drafts, resolve/reopen, responsive layouts, themes, and reduced motion.

Key files: [SupportPage.tsx](/private/tmp/ml-v420-support-r3-last-o5YkTZ/en-build-page-support-inbox-r3/work/src/pages/SupportPage.tsx:140), [router.tsx](/private/tmp/ml-v420-support-r3-last-o5YkTZ/en-build-page-support-inbox-r3/work/src/router.tsx:8), [styles.css](/private/tmp/ml-v420-support-r3-last-o5YkTZ/en-build-page-support-inbox-r3/work/src/styles.css:1), [loading-button.tsx](/private/tmp/ml-v420-support-r3-last-o5YkTZ/en-build-page-support-inbox-r3/work/components/motion-lexicon/loading-button.tsx:180), and [support.spec.ts](/private/tmp/ml-v420-support-r3-last-o5YkTZ/en-build-page-support-inbox-r3/work/tests/support.spec.ts:3).

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19.1.1, TypeScript 5.9.3, Vite 7.1.7 — `package.json` |
| Route | manual pathname router; `/support` added — `src/router.tsx` |
| Component system | existing native `Button` plus installed Motion Lexicon component — `src/components/ui/Button.tsx`, `components/motion-lexicon/loading-button.tsx` |
| Tokens / theme | expanded CSS-variable light/dark system — `src/styles.css` |
| Tailwind | Tailwind 4.1.14 compiled through Vite — `package.json`, `vite.config.ts` |
| Dependencies | reused React, Motion 12.23.24, Tailwind, Playwright — `package.json` |

## Page Plan

Job: Let support agents triage tickets, reply, and resolve completed work without losing context.  
Archetype: Dashboard / operations surface.  
Primary action: Send a reply on the active ticket.  
Primary state: draft → pending → sent/error, with selection invalidating stale sends.

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Product rail | workspace orientation | `none` | desktop rail; hidden mobile |
| Inbox header | queue context and global controls | `none` | stable theme and profile actions |
| Filters | narrow the queue | `none` | all/open/waiting/resolved plus search |
| Conversation list | select active work | `none` | selected record and empty state |
| Ticket details | customer and ownership context | `none` | updates with selection |
| Timeline | read conversation history | `none` | interruptible 220 ms arrival |
| Reply composer | send, recover, and resolve | `loading-button` | idle/pending/success/error; stale responses discarded |

Registry:

- `loading-button` — [canonical Registry JSON](https://motion-lexicon.pages.dev/r/loading-button.json) — `components/motion-lexicon/loading-button.tsx` — dependency: `motion`

Responsive: 320/390 use queue/detail drill-in; 768 uses list and conversation; 1440 adds the customer detail rail.  
Theme: semantic light/dark variables; reduced motion removes travel and collapses transitions to a static crossfade.

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` exited 0; 435 modules transformed |
| 320 | viewport/document 320/320; queue and detail audited; minimum 44×44; 0 offenders |
| 390 | viewport/document 390/390; queue and detail audited; minimum 44×44; 0 offenders |
| 768 | viewport/document 768/768; 23 visible controls; minimum 44×44; 0 offenders |
| 1440 | viewport/document 1440/1440; 26 visible controls; minimum 44×44; 0 offenders |
| Light / dark | light inspected during viewport audits; dark toggled by keyboard and verified via root class and `aria-pressed` |
| Keyboard / focus | Tab entered theme control; Enter toggled it; ticket Enter opened mobile detail; focused Inbox control returned to list |
| Reduced motion | Playwright emulated `reduce`; computed transition duration ≤0.001s |
| Targets | every rendered button, link, input, and textarea measured; minimum 44×44 |
| Primary state | verified send pending/success, forced failure/retry, selection interruption with draft preservation, resolve, and reopen |
| Runtime | 0 console errors, 0 page errors, 0 failed requests, no hydration errors |
| Browser suite | `npm run test:browser`: **7 passed** |