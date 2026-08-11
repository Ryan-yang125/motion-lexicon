## Motion review

### Critical

- **Observed:** Completing a task, then immediately uncompleting it, can replay the old completion animation when the first request resolves late.
- **Cause:** The first async response is still allowed to commit visual success after a newer user intent has replaced it.
- **Fix:** Increment a per-task monotonic intent version on every toggle. Each request captures its version; only update task state, fire success motion, or announce ARIA status if that captured version equals the current version. Abort prior requests where possible, but retain the version check as the authoritative gate.

```ts
let intentVersion = 0;

async function setCompleted(nextCompleted: boolean) {
  const version = ++intentVersion;
  previousRequest?.abort();
  previousRequest = new AbortController();

  setTask({ completed: nextCompleted, pending: true });

  try {
    await updateTask(nextCompleted, { signal: previousRequest.signal });

    if (version !== intentVersion) return; // stale completion
    setTask({ completed: nextCompleted, pending: false });
    if (nextCompleted) playCompletionSuccess();
  } catch (error) {
    if (version !== intentVersion || isAbort(error)) return;
    setTask({ completed: !nextCompleted, pending: false, error: true });
  }
}
```

### Important

- **Observed:** The visual result can disagree with the control’s current checked state.
- **Cause:** Animation is treated as a request-success callback instead of a transition into the current authoritative state.
- **Fix:** Drive animation from the guarded `idle/pending → completed` state transition only. On a reversal, immediately cancel or reverse the in-flight completion animation and settle the checkbox/task row in the latest state.

- **Observed:** A late result may produce an incorrect “Task completed” announcement.
- **Cause:** ARIA updates share the same unguarded response path.
- **Fix:** Gate live-region messages with the same intent version. Only announce the current pending/success/failure state.

### Polish

- Keep the toggle responsive: show the new checked/unchecked state immediately, with a subtle pending affordance that does not block another toggle.
- For reduced motion, skip the celebratory completion effect; retain the checked state and concise current-status feedback.
- Preserve keyboard focus on the toggle through both pending and reversal states; Space/Enter should always issue the newest intent.

## Revised beat plan

1. User completes: checkbox checks immediately; local pending state begins.
2. User reverses: intent version increments; completion animation is cancelled/reversed; checkbox unchecks immediately.
3. First response arrives: version mismatch, so it commits nothing—no state update, animation, or announcement.
4. Latest response arrives: if still current, clear pending and settle silently in the unchecked state.

I couldn’t inspect implementation code because the supplied workspace is empty, so this is a behavior-level review rather than file-specific findings.