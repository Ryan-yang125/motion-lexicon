# Primitives: sequencing and timing

Use sequencing to reveal relationship and dependency within a bounded group.

| Primitive | Use when | Default | Reduced motion |
| --- | --- | --- | --- |
| Stagger | Ordered items enter as one group | 30–70 ms between items | Show complete group immediately |
| Delay | A step depends on a preceding event | 40–120 ms | Apply final state directly |
| Orchestration | A primary actor leads supporting updates | 2–4 linked beats | Apply final state hierarchy |
| Easing | Velocity should fit the event | Arrival, leaving, or linear | Keep final state |
| Pause/resume | Playback or work can be controlled | Immediate state response | Preserve labels and control state |

### Sequence rule

Make the primary actor move first. Supporting actors follow after the primary
actor reaches a readable place. Keep the full sequence within a short window so
the user perceives one product event.
