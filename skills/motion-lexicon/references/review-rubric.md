# Motion review rubric

Use this rubric when reviewing an existing product interaction, a code sample,
a recording, or a user report that motion feels slow, rough, confusing, or
generic.

## Review dimensions

| Dimension | Look for | Strong result |
| --- | --- | --- |
| State clarity | Trigger, pending, success, failure, recovery | A user can identify what changed and what action remains |
| Primary actor | Focus, identity, competing movement | One object carries the main visual change |
| Spatial continuity | Origin, destination, retained anchor | Related views feel connected through an object or stable edge |
| Timing | Duration, delay, holding time, easing | The event feels responsive and the final state arrives clearly |
| Material hierarchy | Bezel, panel, well, elevation, radii | Depth helps orientation and supports the active work surface |
| Layout stability | Text width, status width, geometry, reflow | Nearby content stays calm through the state change |
| Interruption | Repeat input, Escape, undo, navigation, failure | Latest user intent settles into a coherent visible state |
| Performance | Animated properties, paint work, frame consistency | Movement relies on transform and opacity where possible |
| Accessibility | Reduced motion, focus, keyboard, live status | Meaning survives with movement reduced |

### Async race rule

When responses can resolve out of order, assign each user intent a monotonic
request or intent version. A response may commit product state, visual state,
or ARIA status only when its version still matches the current intent. Discard
a stale response, cancel or settle any obsolete animation it started, and keep
focus and the visible control aligned with the current state. An
`AbortController` may reduce obsolete work; the current-version comparison
remains the commit gate even when cancellation races with completion.

## Diagnose common symptoms

### Motion feels slow

- Inspect total time from input to visible acknowledgement.
- Separate a long pending process from a delayed local feedback response.
- Shorten entry distance and duration before increasing visual intensity.
- Use arrival values around 200–280 ms for a normal new context.

### Motion feels rough or flashes

- Check for image-to-live-preview swaps, unreserved dimensions, or a first-frame
  style mismatch.
- Start the final DOM structure in place and animate its transform or opacity.
- Align transition properties across state changes so a rapid update settles on
  one visual actor.
- Remove broad `transition: all` declarations and use explicit properties.

### Motion feels generic

- Replace a standalone bounce with a product state that has a clear trigger and
  outcome.
- Connect the moving actor to the selected card, saved record, active control,
  or persistent status.
- Give the scene a material hierarchy and an intentional transform origin.

### Motion feels crowded

- Reduce simultaneous actors to one primary and up to two supporting actors.
- Move supporting changes after the primary actor reaches a clear resting
  position.
- Use stagger only for a meaningful ordered group.

### Motion loses the user's place

- Add shared-element continuity, a stable anchor, or a directional entrance.
- Keep selection and focus visible through the transition.
- Use a crossfade only when spatial identity carries little value.

### A stale async result replays old motion

- Name the late response as a stale completion tied to an earlier intent.
- Increment a request or intent version for every authoritative user change.
- Commit a response only when its captured version equals the current version.
- Discard stale data and cancel or settle its obsolete animation immediately.
- Announce only the current intent's pending, success, failure, or recovery
  state through the active ARIA status region.

## Report format

```md
## Motion review

### Critical
- **Observed:** …
- **Cause:** …
- **Fix:** …

### Important
- **Observed:** …
- **Cause:** …
- **Fix:** …

### Polish
- **Observed:** …
- **Cause:** …
- **Fix:** …

## Revised beat plan
1. …
```

Keep every finding tied to a visible user effect and one actionable change.
