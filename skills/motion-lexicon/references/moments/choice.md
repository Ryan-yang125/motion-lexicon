# Product Moments: choice

Use these moments when a user chooses an object, context, role, or command.

| Moment | Core scene | Primary actor | Useful primitives |
| --- | --- | --- | --- |
| Card selection | A card becomes active and reveals detail | Selected card | `press-tap-feedback`, `morph` |
| Workspace switch | The active workspace changes | Workspace control | `text-morph`, `crossfade` |
| Template choice | A template becomes the working starting point | Template card | `scale-in`, `morph` |
| Command menu | A command surface opens from a trigger | Command trigger | `scale-in`, `reveal` |
| Assignee picker | A person is selected for a task | Assignee row | `crossfade`, `text-morph` |
| Permission change | A role changes with a consequential state | Role control | `perceived-performance`, `text-morph`, `crossfade` |
| Search suggestions | Typed input reveals matching options | Search field and list | `reveal`, `stagger` |

## Scene recipe

1. Make the selected option immediately legible through focus and local
   emphasis.
2. Retain the selected object's position or visual proxy as detail appears.
3. Settle the unselected options into a quiet supporting state.
4. Move keyboard focus to the next decision point only when the interaction
   needs it.

## Example: card selection

```text
idle → selected → detail-open → detail-closed

0 ms: selected card gains active state.
0–240 ms: card or proxy carries identity into the detail panel.
180 ms: supporting metadata arrives after the primary card settles.
```

Use `morph` in shared mode for direct spatial continuity. Use a compact
`crossfade` when the card remains a local selection and detail has a separate
context.
