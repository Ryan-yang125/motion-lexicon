Implemented the selectable project-card inspector.

- Selected project is stored by stable `id`; Escape closes the inspector while retaining selection and returning focus to that card. [HomePage.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r2/work/src/pages/HomePage.tsx:44)
- Inspector stays mounted and transitions only `opacity`/`transform`, so rapid card re-selection safely retargets the visible state. [styles.css](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r2/work/src/styles.css:122)
- Added semantic state, ARIA relationships/live updates, inert closed panel behavior, and reduced-motion support.
- Extended browser coverage for rapid selection, retained identity, Escape, focus return, and overflow. [smoke.spec.ts](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r2/work/tests/smoke.spec.ts:3)

Verified:

- `npm run build` — passed
- `ML_EVAL_PORT=4174 npm run test:browser` — passed (1 test)