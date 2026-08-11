# Product Moments: feedback

Use these moments when a product action completes, needs confirmation, or
offers a recovery path.

| Moment | Core scene | Primary actor | Useful primitives |
| --- | --- | --- | --- |
| Save confirmation | A user saves local changes | Save control and changed record | `press-tap-feedback`, `text-morph`, `crossfade` |
| Publish release | A draft becomes visible to others | Publish control and release state | `press-tap-feedback`, `perceived-performance`, `text-morph` |
| Share link | A link is copied or shared | Share control and link status | `scale-in`, `text-morph` |
| Inline validation | A field accepts or requires correction | Field and inline message | `shake-wiggle`, `crossfade` |
| Upload complete | A file reaches its destination | File row and progress state | `perceived-performance`, `crossfade` |
| Sync recovery | Offline work returns to a healthy state | Sync indicator and affected record | `text-morph`, `crossfade` |
| Delete confirmation | A destructive result remains recoverable | Deleted record and undo action | `fade-in-fade-out`, `crossfade` |

## Scene recipe

1. Give the initiating control immediate feedback and a stable pending state.
2. Update the closest affected record or status region.
3. Use one compact confirmation beat.
4. Provide the next action, undo, retry, or recovery path in the same local
   context.

## Example: save confirmation

```text
idle → pending → success → idle

0 ms: save button enters pending; keep its width reserved.
120 ms: record status changes to Saved with local opacity and transform arrival.
280 ms: button returns to active state; the status remains perceptible.
```

Use the arrival curve for the result and direct status update in reduced motion.
