# Primitives: entrances

Use an entrance to orient a user to new context. Choose the origin from the
component relationship, a screen edge, or the triggering actor.

| Primitive | Use when | Default | Reduced motion |
| --- | --- | --- | --- |
| `fade-in-fade-out` | Content already has an obvious place | 160–220 ms opacity | Apply the final state immediately |
| `slide-in` | Context comes from a known side or surface edge | 220–260 ms, 16–32 px | Short opacity crossfade |
| `scale-in` | A focal card or compact acknowledgement arrives at its final location | 140–240 ms, `.94`–`.97` → `1` | Apply final scale and opacity |
| `spring` | A user moves, drops, or reorders an item | Gesture-driven, short settle | Snap to final position |
| `reveal` | The disclosed content has meaningful hidden extent | 180–260 ms clip or proxy transform | Expand directly with focus preserved |

### Direction rule

Use the nearest semantic origin: a right-side inspector enters from the right;
a selected row's detail grows from that row; a bottom action sheet rises from
the lower edge. Keep the destination present from the first frame.

### Weight rule

Increase perceived weight through a short distance, a stable final panel, and
an arrival curve. Reserve spring for direct manipulation where the user's input
implies a physical settle.
