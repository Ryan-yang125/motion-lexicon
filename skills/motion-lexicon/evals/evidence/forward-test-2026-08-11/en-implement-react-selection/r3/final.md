Implemented the selectable project-card inspector in React.

- Selection is ID-based, so switching cards preserves the active project identity.
- Escape and the close button dismiss the inspector and return focus to the selected card.
- The inspector remains a stable layout region; rapid card changes settle immediately on the latest selection.
- Reduced motion removes travel while retaining state and focus feedback.

Changed [HomePage.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r3/work/src/pages/HomePage.tsx), [styles.css](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r3/work/src/styles.css), [smoke.spec.ts](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r3/work/tests/smoke.spec.ts), and [index.html](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r3/work/index.html).

## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | React 19 + Vite — `package.json` |
| Route | `/` renders `HomePage` — `src/router.tsx` |
| Component system | Native reusable `Button` — `src/components/ui/Button.tsx` |
| Tokens / theme | CSS variables and `.dark` — `src/styles.css` |
| Tailwind | Tailwind 4 configured — `package.json`, `vite.config.ts` |
| Dependencies | CSS transitions used; `motion` remains available — `package.json` |

## Page plan

Job: Browse projects and inspect one without losing selection.  
Archetype: Project directory with side inspector.  
Primary action: Select a project card.  
Primary state: browsing → inspecting → switching or closing.

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Project cards | Select a project | `none` | Immediate selected state |
| Side inspector | Show project context | `none` | Stable region with interruptible transform/opacity |
| Inspector controls | Close and recover focus | `none` | Escape/close returns focus |

Registry: none.

## Acceptance

| Check | Observed evidence |
| --- | --- |
| Build | `npm run build` — exit 0 |
| Browser test | `ML_EVAL_PORT=4174 npm run test:browser` — 1 passed |
| 320 / 390 / 768 / 1440 | No horizontal overflow; min target 44×44 px; 0 offenders each |
| Keyboard / focus | Escape closes Atlas and returns focus to its card |
| Reduced motion | Transition duration resolves to `0.001s`; final state remains correct |
| Light / dark | Theme toggle activated and verified |
| Runtime | Browser console and page errors: 0 |