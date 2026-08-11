Completed the `status-action-handoff` primitive candidate with three independent scenes: analytics export, member invitation, and backup creation/recovery.

Files:

- [Candidate record](/private/tmp/ml-v420-final-WyIAsP/en-contribute-primitive-candidate-r2/work/candidates/status-action-handoff/candidate.md)
- [Validated Motion Blueprint](/private/tmp/ml-v420-final-WyIAsP/en-contribute-primitive-candidate-r2/work/candidates/status-action-handoff/blueprint.json)
- [Portable HTML demo](/private/tmp/ml-v420-final-WyIAsP/en-contribute-primitive-candidate-r2/work/public/candidates/status-action-handoff/index.html)
- [Portable CSS](/private/tmp/ml-v420-final-WyIAsP/en-contribute-primitive-candidate-r2/work/public/candidates/status-action-handoff/styles.css)
- [Portable JavaScript](/private/tmp/ml-v420-final-WyIAsP/en-contribute-primitive-candidate-r2/work/public/candidates/status-action-handoff/status-action-handoff.js)
- [Browser acceptance tests](/private/tmp/ml-v420-final-WyIAsP/en-contribute-primitive-candidate-r2/work/tests/smoke.spec.ts)

Validation results:

- Blueprint validator: exit `0`
- Embedded Blueprint matches the validated JSON byte-for-byte
- Placeholder scan: passed
- `npm run build`: exit `0`
- Browser tests: `6 passed`
- Verified standard and reduced motion, 320–1440 px layouts, stable control geometry, keyboard/focus behavior, rapid repeat, cancellation, failure/retry, and standalone portability

The record remains correctly marked `status: candidate` pending maintainer review. `npm ci` also reported one high-severity advisory in the existing locked dependency tree.