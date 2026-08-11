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
| Introduce new context | `fade-in-fade-out`, `slide-in`, `scale-in`, `reveal` | Arrival and orientation |
| Keep identity through a view change | `morph` with shared mode, `crossfade` | Continuity in space |
| Confirm a completed action | `press-tap-feedback`, `text-morph`, `crossfade`, `number-ticker` | Confidence and closure |
| Guide a grouped sequence | `stagger`, `duration`, `keyframes`, `perceived-performance` | Order and pacing |
| Change a local selection | `morph`, `accordion-collapse`, `direction-aware-transition` | Focus and causality |
| Recover from error or interruption | `shake-wiggle`, `crossfade`, `text-morph` | Agency and next action |

## Primitive families

### Entrances

Use an entrance when a user needs to locate new content. Start from the closest
edge or from the prior element's position. Keep the destination stable from the
first rendered frame.

- **`fade-in-fade-out`:** low-distraction appearance for content with an established place.
- **`slide-in`:** directional arrival that explains where content came from.
- **`scale-in`:** restrained emphasis for a focal object already centered in the
  user's attention.
- **Compact `scale-in`:** short scale plus opacity for a brief acknowledgement.
- **`spring`:** responsive direct manipulation when a user moves or drops an
  object.
- **`reveal`:** exposes content through a mask, clip, or measured height where
  the reveal itself carries meaning.

### Transitions

Use a transition when identity should persist across state or surface changes.

- **`morph` with shared mode:** one object changes place or
  size while retaining identity.
- **`morph`:** a component changes shape or structure in the same interaction.
- **`crossfade`:** a fast replacement when spatial continuity carries less value.
- **`accordion-collapse`:** a container adapts while surrounding layout remains stable.
- **`drag-to-reorder`:** ordered local geometry settles after direct manipulation.

### Feedback

Use feedback to confirm a consequential action and point toward the next state.

- **`shake-wiggle`:** connects invalid input to a visible field and reason.
- **`text-morph`:** changes a short label and semantic state together.
- **`perceived-performance`:** communicates an ongoing process with truthful feedback.
- **`crossfade`:** updates local status while preserving its place.

Undo, retry, sync recovery, status transition, and highlight are product-scene
concepts. They cannot appear as published candidate IDs.

### Sequencing and timing

Use sequencing for related items that benefit from order.

- **`stagger`:** reveals a bounded group in a readable order.
- **`duration`:** gives a truthful event an intentional active time.
- **`keyframes`:** coordinates a small number of phases around one state change.
- **`easing`:** describes the velocity profile; choose it by event rather than
  decoration.

Delay, orchestration, and pause/resume are concept-only sequencing controls.
They cannot appear as published candidate IDs.

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

1. A new surface from a directional edge favors `slide-in` or `reveal`.
2. A card, thumbnail, or row that keeps identity through a view change favors
   shared mode on `morph`.
3. A saved, copied, approved, or completed state favors `text-morph` or
   `crossfade`
   with a brief local emphasis.
4. A list with meaningful order favors `stagger`; encode a dependent action in
   the beat offset and use its exact rendering primitive.
5. A user-controlled drag, drop, scrub, or reorder favors `spring`,
   `drag-to-reorder`, or direct transform.

Use [composition.md](composition.md) when more than one state changes.

When citing a published primitive ID, copy the exact ID from the public
catalog. Keep human-facing labels separate from IDs; for example, Shared
element uses the published `morph` primitive with shared mode.
