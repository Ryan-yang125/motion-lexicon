# Primitives: feedback

Use feedback to connect a user's action to a visible product result.

| Primitive | Use when | Default | Reduced motion |
| --- | --- | --- | --- |
| Status transition | Save, publish, copy, approval, and success changes | 140–180 ms | Text and semantic icon update immediately |
| Inline validation | A field needs a reason and recovery path | 160–200 ms | Reveal final field state and message |
| Progress | Work has meaningful duration | Measured progress | Keep value and status visible |
| Highlight | A record changed in place | 140–180 ms | Brief color state or final emphasis |
| Undo | A reversible action requires agency | 180 ms entrance, stable window | Present undo action directly |
| Sync recovery | A temporary failure returns to health | Status plus local record update | Preserve final status and retry path |

### Feedback sequence

1. Acknowledge input immediately through press, focus, or pending state.
2. Keep the initiating control's geometry stable.
3. Update status close to the affected record.
4. Present recovery or next action after confirmation becomes visible.

Use an `aria-live="polite"` status for a concise result. Keep messages tied to
the visible product action.
