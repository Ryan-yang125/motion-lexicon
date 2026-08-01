# Interior-informed motion principles

This profile adapts the product-motion principles visible in
[`ddoemonn/interior`](https://github.com/ddoemonn/interior). Apply the
principles to Motion Lexicon scenes; keep each implementation aligned with the
user's product and framework.

## Build a tangible product state

Use three material layers when depth helps a user understand the scene:

1. **Bezel:** the page or application ground.
2. **Panel:** the raised card, dialog, list, or active work surface.
3. **Well:** the recessed preview, input, code area, track, or drop target.

Give layers a role. Thin borders and soft elevation clarify material placement;
they support hierarchy rather than becoming decoration. Keep nested radii
coherent: inner radius plus its surrounding padding should align with the outer
radius.

## Begin from an event

Tie visible motion to a product event:

- A press produces immediate pressed and focus feedback.
- A selection changes the active subject and its available actions.
- A route or view transition carries the user's chosen object across space.
- A status update confirms success, failure, recovery, or progress.
- A direct manipulation follows pointer or keyboard input and settles on
  release.

Reserve ambient looping for signals with a genuine live meaning, such as a
truthful in-progress indicator. A scene rests in a stable final state.

## Reserve space and protect continuity

- Allocate the widest label, action, and status state before the change.
- Keep a record's row, card, and control geometry stable while its content
  updates.
- Move the selected object or a deliberate visual proxy through the transition.
- Preserve an anchor edge or transform origin that matches where the object
  enters, leaves, or expands.
- Keep a shared action reachable while the state is settling.

The goal is a scene that feels responsive under repeated input and keeps nearby
content calm.

## Arrival, feedback, and leaving

| Moment | Motion treatment | Default |
| --- | --- | --- |
| Press or focus | Local color, border, or scale response | 120–180 ms |
| Arrival | Opacity from 0, `scale(.97)`, translate 8–10 px, optional 4–6 px blur | 200–280 ms, `cubic-bezier(.23, 1, .32, 1)` |
| Local change | Transform or size proxy settles into an existing location | 180–260 ms |
| Leaving | Opacity decreases with a compact translate or scale | 110–180 ms, `cubic-bezier(.4, 0, 1, 1)` |
| Direct manipulation | Pointer-following transform with a tight settle | Gesture-driven, then a short settle |

Use a spring only where the user's action implies physical response. Use the
arrival and leaving curves for structured product state transitions.

## Support interruption

Every interactive beat needs a stable response to a repeat press, Escape,
undo, failure, navigation, and reduced-motion preference.

- Update a single state source before starting the visual transition.
- Cancel or reverse the in-flight animation when a newer user intent wins.
- Keep a current `aria-live` status concise and meaningful.
- Keep focus on the initiating control or move it to the next available action
  when the initiating control leaves the DOM.
- Preserve a visible completion state long enough to be perceived before an
  automatic follow-up state.

## Motion performance

Prefer `transform` and `opacity` for visible movement. Use a visual proxy or
reserved wrapper when a layout dimension must change. Keep shadow, filter, and
blur use compact and short. Test rapid input as part of the interaction, then
apply [review-rubric.md](review-rubric.md) for a full assessment.

## Reduced motion

Reduced motion preserves the event's information:

- Apply the target state immediately or with a short opacity crossfade.
- Keep semantic status, focus movement, and the next action present.
- Remove travel, bounce, repeated oscillation, and decorative blur.

Use `@media (prefers-reduced-motion: reduce)` in portable CSS and expose a
user-level setting when the host product offers one.
