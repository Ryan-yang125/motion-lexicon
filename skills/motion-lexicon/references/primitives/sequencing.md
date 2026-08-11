# Primitives: sequencing and timing

Use sequencing to reveal relationship and dependency within a bounded group.

| Primitive | Use when | Default | Reduced motion |
| --- | --- | --- | --- |
| `stagger` | Ordered items enter as one bounded group | 30–70 ms between items | Show the complete group immediately |
| `duration` | Event meaning determines the active time | Use the documented event range | Preserve the final state immediately |
| `easing` | Velocity should fit arrival, leaving, feedback, or direct manipulation | Choose one named curve | Keep the final state |
| `keyframes` | A small number of intentional phases must share one timeline | 2–4 event-relative phases | Apply the final semantic phase |
| `perceived-performance` | Real work needs continuous, truthful progress feedback | Follow measured work | Keep value and status visible |

Delay, orchestration, and pause/resume are sequencing controls or product
states. They are concept-only labels and cannot appear as a candidate ID or in
`beats[].primitive`; express them through beat offsets, state transitions, and
the exact published primitive that renders each beat.

### Sequence rule

Make the primary actor move first. Supporting actors follow after the primary
actor reaches a readable place. Keep the full sequence within a short window so
the user perceives one product event.
