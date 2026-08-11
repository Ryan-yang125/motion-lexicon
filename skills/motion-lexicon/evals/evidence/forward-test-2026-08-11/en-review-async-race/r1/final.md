## Motion review

### Critical

- **Observed:** The first “complete” response can still commit its success animation after the user has changed intent back to incomplete.
- **Cause:** Response handlers are treated as authoritative regardless of request age.
- **Fix:** Increment an intent version on every toggle. Capture it for each request, and commit state, animation, and ARIA announcements only when it still equals the current version. Abort the prior request when possible, but retain the version check as the final guard.

### Important

- **Observed:** A late completion animation contradicts the checkbox’s current unchecked state.
- **Cause:** The old animation is not cancelled when the second toggle occurs.
- **Fix:** On every new toggle, immediately cancel/settle any in-flight completion animation and render the new local intent. Do not replay success merely because a network response arrives.

- **Observed:** Assistive technology may hear “completed” after the task is unchecked.
- **Cause:** Stale responses can update the live region.
- **Fix:** Gate pending/success/error messages with the same intent version; announce only the current intent’s outcome.

### Polish

- **Observed:** Rapid toggles can feel delayed if the control waits for the network.
- **Fix:** Update checked state immediately; reserve animation for confirmation of the still-current intent. Reduced-motion mode should use a static state change or brief opacity transition.

## Revised beat plan

1. Toggle complete → increment to version 1; immediately show checked/pending.
2. Toggle back → increment to version 2; cancel the version-1 animation; immediately show unchecked/pending; abort request 1 if supported.
3. Version-1 response arrives → version mismatch, discard entirely: no state change, animation, or announcement.
4. Version-2 response arrives → matching version, settle unchecked state and announce only its relevant result.
5. Keep keyboard focus on the checkbox/button throughout.

A safe commit gate is:

```ts
const version = ++intentVersion;
const desiredComplete = nextComplete;

try {
  const result = await saveTask({ complete: desiredComplete, signal });
  if (version !== intentVersion) return; // stale: do nothing

  commit(result);
  if (desiredComplete) playCompletionAnimation();
} catch (error) {
  if (version !== intentVersion || isAbort(error)) return;
  showCurrentIntentError(error);
}
```

The key invariant: only the latest user intent may alter visible state, motion, or status messaging.