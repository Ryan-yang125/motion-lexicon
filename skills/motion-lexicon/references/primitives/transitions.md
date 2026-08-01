# Primitives: transitions

Use a transition to carry context through a change of view, component, or
layout.

| Primitive | Use when | Default | Reduced motion |
| --- | --- | --- | --- |
| Shared element | A recognizable object moves into a related view | 220–280 ms arrival | Swap views with persistent label or focus |
| Morph | A component changes shape or role in one surface | 200–260 ms | Apply final component structure |
| Crossfade | Content replaces content with limited spatial identity | 160–220 ms | Immediate swap or short opacity fade |
| Height match | A local container grows or contracts | 180–240 ms | Set final height with stable focus |
| Layout transition | Selection or reordering changes local geometry | 180–240 ms | Snap to final layout |
| Filter transition | Results update around retained controls | 160–220 ms plus compact stagger | Replace result state with status |

### Continuity rule

Track the object a user chose. A shared element uses the object itself or a
deliberate proxy. A morph keeps the same semantic role through a structural
change. A crossfade establishes a clean replacement when identity carries less
value.
