# Primitives: transitions

Use a transition to carry context through a change of view, component, or
layout.

| Primitive | Use when | Default | Reduced motion |
| --- | --- | --- | --- |
| `morph` | A recognizable object or component keeps identity while changing place, size, or role | 200–280 ms; use shared mode across views | Apply final structure with persistent label or focus |
| `crossfade` | Similarly sized content replaces content with limited spatial identity | 160–220 ms | Immediate swap or short opacity fade |
| `accordion-collapse` | A disclosed local container changes measured extent | 180–240 ms | Set final extent with stable focus |
| `direction-aware-transition` | Context enters from the semantic direction of the trigger | 200–260 ms | Preserve direction through static placement and focus |
| `drag-to-reorder` | Direct manipulation changes ordered local geometry | Gesture-driven with a short settle | Snap to the final order and announce it |

Shared element, height match, layout transition, and filter transition are
design concepts. Use the exact published primitive above that implements the
concept; the concept label cannot appear as a candidate ID or in
`beats[].primitive`.

### Continuity rule

Track the object a user chose. Shared-element continuity uses `morph` in shared
mode with the object itself or a deliberate proxy. `morph` keeps the same
semantic role through a structural change. `crossfade` establishes a clean
replacement when identity carries less value.
