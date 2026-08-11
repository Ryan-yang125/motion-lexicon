# Primitives: feedback

Use feedback to connect a user's action to a visible product result.

| Primitive | Use when | Default | Reduced motion |
| --- | --- | --- | --- |
| `press-tap-feedback` | A control needs immediate acknowledgement before async work settles | 120–180 ms | Keep the pressed and pending states explicit |
| `text-morph` | A short stable-width label changes from pending to success or failure | 140–180 ms | Update text and semantic icon immediately |
| `crossfade` | Similarly sized status content replaces content in place | 160–220 ms | Swap immediately or use compact opacity |
| `shake-wiggle` | Invalid input needs one restrained local rejection cue | 160–200 ms | Reveal the field state and reason without displacement |
| `perceived-performance` | Work has meaningful duration and needs truthful continuous feedback | Measured progress | Keep value, status, and recovery visible |

Undo, retry, and sync recovery are product-scene concepts assembled from
published primitives. They are concept-only labels and cannot appear as a candidate ID or in `beats[].primitive`.

### Feedback sequence

1. Acknowledge input immediately through press, focus, or pending state.
2. Keep the initiating control's geometry stable.
3. Update status close to the affected record.
4. Present recovery or next action after confirmation becomes visible.

Use an `aria-live="polite"` status for a concise result. Keep messages tied to
the visible product action.
