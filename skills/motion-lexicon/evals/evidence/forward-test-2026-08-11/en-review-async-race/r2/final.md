## Motion review

### Critical

- **Observed:** Completing, then immediately reopening, can replay the old completion animation.
- **Cause:** The first request is still allowed to commit UI/motion when it resolves, even though a newer user intent exists.
- **Fix:** Increment a per-task intent version on every toggle. A response may update task state, animation, or ARIA status only if its captured version equals the current version. Cancel obsolete animation immediately.

```ts
let intentVersion = 0;
let controller: AbortController | undefined;

async function setComplete(nextComplete: boolean) {
  const version = ++intentVersion;
  controller?.abort();
  controller = new AbortController();

  setTask({ completed: nextComplete, pending: true });
  cancelCompletionAnimation();

  try {
    await updateTask({ completed: nextComplete, signal: controller.signal });

    if (version !== intentVersion) return; // stale: no UI, live status, or motion

    setTask({ completed: nextComplete, pending: false });
    if (nextComplete) playCompletionAnimation();
  } catch (error) {
    if (version !== intentVersion || isAbortError(error)) return;
    setTask({ completed: !nextComplete, pending: false });
  }
}
```

- **Server-side follow-through:** Client gating fixes the replay, but not necessarily mutation ordering. If requests can reach or finish server-side out of order, send a task revision/sequence and have the server reject older writes.

### Important

- **Observed:** The task’s visible state may flicker between completed and reopened.
- **Cause:** Success motion is coupled to any successful network response rather than the currently rendered task state.
- **Fix:** Treat success animation as a transition into `completed` for the current intent only. Reopening interrupts it and settles directly into the active unchecked state—no delayed “success” recovery.

- **Observed:** Screen readers may hear “completed” after the task is visibly reopened.
- **Cause:** A stale response can write to the live region.
- **Fix:** Gate ARIA announcements with the same intent version. Announce only the current state, e.g. “Task reopened.”

### Polish

- **Observed:** Fast toggles can feel laggy if the control waits for the network.
- **Fix:** Give the checkbox immediate pressed/state feedback, keep a subtle pending indicator, and reserve completion celebration for a current confirmed completion. With reduced motion, update the checkmark/status without the celebration.

## Revised beat plan

1. **Complete pressed:** checkbox immediately becomes checked and enters pending; no success celebration yet.
2. **Reopen pressed:** increment intent version, abort/ignore the older request, cancel any in-progress completion motion, and immediately show unchecked/pending.
3. **Stale completion resolves:** discard it completely—no state update, animation, or live announcement.
4. **Current reopen resolves:** settle unchecked; announce “Task reopened.”
5. **Only a current completion resolves:** settle checked, then run one compact 200–280 ms confirmation animation.

The core invariant: the latest user intent owns the visible state and motion.