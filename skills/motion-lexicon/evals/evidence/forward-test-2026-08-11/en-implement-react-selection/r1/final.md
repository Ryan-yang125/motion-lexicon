Implemented the selectable project-card inspector.

- Stable project IDs drive selection and React keys; fast selection changes always show the latest project.
- Escape and close return focus to the originating card.
- Added reversible transform/opacity motion plus reduced-motion handling.
- Updated shared `Button` to forward refs.
- Added browser coverage for interrupted selection, Escape, focus return, 320–1440px overflow, and 44px targets.

Verified with:

```sh
npm run build
ML_EVAL_PORT=4174 npm run test:browser
```

All 5 browser tests pass.

Changed: [HomePage.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r1/work/src/pages/HomePage.tsx), [styles.css](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r1/work/src/styles.css), [Button.tsx](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r1/work/src/components/ui/Button.tsx), [smoke.spec.ts](/private/tmp/ml-v420-recorded-pr6ha4/en-implement-react-selection-r1/work/tests/smoke.spec.ts).