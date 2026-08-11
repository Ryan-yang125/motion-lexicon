# Motion language

Use this reference to select a behavior before composing a full Product Moment.
Motion Lexicon keeps two connected vocabularies:

- **Motion Primitives** define one reusable behavior such as `slide-in`,
  `morph`, `stagger`, or `easing`.
- **Product Moments** combine primitives into a user-visible product event such
  as save confirmation, card choice, filter results, or recovery after sync.

## Choose by product job

| Product job | Useful primitives | Product signal |
| --- | --- | --- |
| Introduce new context | fade, slide-in, scale-in, reveal | Arrival and orientation |
| Keep identity through a view change | `morph` with shared mode, `crossfade` | Continuity in space |
| Confirm a completed action | status change, checkmark draw, highlight, count update | Confidence and closure |
| Guide a grouped sequence | stagger, delay, orchestration, progress | Order and pacing |
| Change a local selection | selection emphasis, layout transition, height match | Focus and causality |
| Recover from error or interruption | inline validation, undo, retry, sync recovery | Agency and next action |

## Primitive families

### Entrances

Use an entrance when a user needs to locate new content. Start from the closest
edge or from the prior element's position. Keep the destination stable from the
first rendered frame.

- **Fade:** low-distraction appearance for content with an established place.
- **Slide-in:** directional arrival that explains where content came from.
- **Scale-in:** restrained emphasis for a focal object already centered in the
  user's attention.
- **Pop-in:** compact scale plus opacity for a brief acknowledgement.
- **Spring:** responsive direct manipulation when a user moves or drops an
  object.
- **Reveal:** exposes content through a mask, clip, or measured height where
  the reveal itself carries meaning.

### Transitions

Use a transition when identity should persist across state or surface changes.

- **Shared element (`morph` with shared mode):** one object changes place or
  size while retaining identity.
- **Morph:** a component changes shape or structure in the same interaction.
- **Crossfade:** a fast replacement when spatial continuity carries less value.
- **Height match:** a container adapts while surrounding layout remains stable.
- **Layout transition:** local geometry settles after a choice or reordering.

### Feedback

Use feedback to confirm a consequential action and point toward the next state.

- **Inline validation:** connects a field, reason, and recovery path.
- **Status transition:** changes a label, icon, and semantic state together.
- **Progress:** communicates an ongoing process with truthful duration.
- **Highlight:** draws attention to a changed record while preserving its place.
- **Undo:** keeps the former state recoverable for a short, clear window.

### Sequencing and timing

Use sequencing for related items that benefit from order.

- **Stagger:** reveals a bounded group in a readable order.
- **Delay:** aligns one dependent step with a preceding event.
- **Orchestration:** coordinates several actors around one primary state change.
- **Easing:** describes the velocity profile; choose it by event rather than
  decoration.

## Timing profile

| Event | Default duration | Curve | Notes |
| --- | ---: | --- | --- |
| Immediate feedback | 120–180 ms | ease-out | A press, selection, or field acknowledgement |
| Arrival | 200–280 ms | `cubic-bezier(.23, 1, .32, 1)` | New context settles into a reserved place |
| Local transition | 180–260 ms | ease-in-out | Existing content changes shape or local position |
| Leaving | 110–180 ms | `cubic-bezier(.23, 1, .32, 1)` | Departing context clears space quickly |
| Progress | truthful to process | linear or measured | The movement reflects actual duration |
| Group stagger | 30–70 ms between items | arrival curve | Keep the whole group within a readable beat |

## Default recommendation logic

1. A new surface from a directional edge favors slide-in or reveal.
2. A card, thumbnail, or row that keeps identity through a view change favors
   shared element or morph.
3. A saved, copied, approved, or completed state favors a status transition
   with a brief local emphasis.
4. A list with meaningful order favors stagger; a single dependent action
   favors delay.
5. A user-controlled drag, drop, scrub, or reorder favors an interruptible
   spring or direct transform.

Use [composition.md](composition.md) when more than one state changes.

When citing a published primitive ID, copy the exact ID from the public
catalog. Keep human-facing labels separate from IDs; for example, Shared
element uses the published `morph` primitive with shared mode.
