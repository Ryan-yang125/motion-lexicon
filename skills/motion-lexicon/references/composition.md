# Compose a Product Moment

Use this reference for a multi-step scene, a state transition, or a request
that joins several primitives.

## Motion Blueprint workflow

Return the Blueprint as one fenced JSON object that validates against
`../assets/motion-blueprint.schema.json`. A prose state diagram or beat table
can follow the JSON as explanation; it does not replace the Blueprint.

1. **Name the event.** Write one plain-language sentence: who acts, what
   changes, and why it matters.
2. **Map state.** Capture `idle`, `engaged`, `pending`, `success`, `failure`,
   and `recovery` only where they affect a user decision.
3. **Assign actors.** Choose one primary actor. Add up to two supporting actors
   for context, status, or a follow-up action. Record each actor's semantic kind:
   `trigger`, `hero`, `status`, `record`, or `environment`.
4. **Write beats.** Each beat has an event-relative offset, purpose, primitive,
   origin, destination, `durationMs`, easing, and final state.
5. **Plan interruption.** Define repeat press, undo, failure, navigation, and
   keyboard behavior on the relevant state transition.
6. **Plan reduced motion.** Preserve hierarchy and status with an immediate or
   compact opacity state change.
7. **Choose delivery.** Align code output with the user's stack and component
   boundary.

## Beat grammar

| Field | Meaning | Example |
| --- | --- | --- |
| `at` | Event-relative offset | `0`, `80`, `after:save` |
| `actor` | Element that changes | `primary-card`, `status`, `undo-action` |
| `purpose` | Product reason | `confirm`, `orient`, `preserve-continuity` |
| `primitive` | Reusable behavior | `text-morph`, `morph` |
| `from` / `to` | Visible states | `selected` → `saved` |
| `durationMs` | Active motion time in milliseconds | `180` |
| `easing` | Velocity profile | `arrive`, `leave`, `feedback`, `linear`, `spring` |

`interrupt` belongs to each `stateGraph.transitions[]` item. Use `reverse`,
`settle`, `replace`, or `queue` to define how a new event resolves the active
state change.

## Composition patterns

### Confirm then continue

Use for save, publish, copy, approval, checkout, and upload completion.

1. The initiating control enters `pending` and remains spatially stable.
2. A local status change confirms the result.
3. A supporting record highlights or updates in place.
4. The next action appears once the user can perceive completion.

### Select then inspect

Use for card choice, workspace switch, template selection, assignee picker,
and search suggestions.

1. Selection receives immediate focus and emphasis.
2. The selected object persists while detail context enters from its relationship
   to the trigger.
3. Supporting options settle into an inactive state.
4. Keyboard focus moves into the active detail or remains on the selected item.

### Change in place

Use for filters, disclosure, kanban movement, cart updates, comments, and
inline validation.

1. Preserve the current anchor and dimensions.
2. Animate the local content or a proxy through the change.
3. Use a compact stagger when a bounded group enters.
4. Hold the result state for the next decision.

### Recover with agency

Use for undo, retry, sync recovery, deletion, errors, and permission changes.

1. Show the new state with an explicit cause.
2. Present the recovery action in the same spatial area.
3. Let undo or retry interrupt the current result.
4. Announce the state through concise accessible status text.

## Composition limits

- Keep a normal moment within three to five perceptible beats.
- Add a delay only when it reveals dependency, sequence, or a truthful process.
- Reserve stagger for a bounded group with a shared origin or order.
- Use `morph` in shared mode when a user follows a recognizable object from one
  context to another.
- Keep terminal states calm and readable.
