# Product Moments: change

Use these moments when content changes in place and the user needs to retain
their place in the surrounding interface.

| Moment | Core scene | Primary actor | Useful primitives |
| --- | --- | --- | --- |
| Layer insertion | A new layer joins a stack | Inserted layer | `reveal`, `morph` |
| Archive undo | A record leaves and can return | Archived row | `fade-in-fade-out`, `morph` |
| Filter results | Result content changes around retained controls | Result group | `crossfade`, `stagger`, `morph` |
| Details disclosure | More information opens below a summary | Disclosure panel | `reveal`, `morph` |
| Kanban move | A card changes column or order | Moved card | `drag-to-reorder`, `spring` |
| Cart update | Quantity or subtotal changes locally | Cart row | `text-morph`, `morph` |
| Comment reply | A reply appears in a conversation thread | Reply composer and new comment | `reveal`, `crossfade` |

## Scene recipe

1. Preserve the stable control, row, card, or column that anchors the change.
2. Animate the changed object or a focused visual proxy.
3. Settle nearby layout after the primary actor establishes its final place.
4. Keep recovery and follow-up actions in the same local region.

## Example: filter results

```text
idle → filtering → results-updated → idle

0 ms: filter control receives pending feedback.
0–180 ms: prior result group lowers emphasis while the final layout is reserved.
160–260 ms: new result group appears with a compact ordered stagger.
```

Keep result count and empty state available to assistive technology in every
state.
