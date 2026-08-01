# Product Moments: workflow

Use these moments when several states carry a user through a task or a process
with real duration.

| Moment | Core scene | Primary actor | Useful primitives |
| --- | --- | --- | --- |
| Notification triage | A notification enters, is read, then resolves | Notification row | stagger, highlight, leaving |
| Progress steps | A multi-step task advances | Current step | progress, status transition |
| Member invite | An invite moves from entry to sent state | Invite form | validation, status transition |
| Media scrub | Playback position follows direct input | Media playhead | direct manipulation, progress |
| Approval request | A review moves toward approval or return | Approval state | pending, status transition, recovery |
| Checkout payment | A payment validates and completes | Payment step | validation, progress, confirmation |
| Scheduled publish | A draft gains a future release state | Schedule control | status transition, calendar reveal |

## Scene recipe

1. Show the current task state and its next meaningful action.
2. Tie progress motion to a truthful process or a clear state transition.
3. Let the primary step lead visual change; let records and status follow.
4. Preserve navigation, pause, retry, and recovery controls when they apply.

## Example: progress steps

```text
ready → processing → step-complete → next-step → complete

0 ms: current step becomes active and announces the work.
process-driven: progress reflects available product data.
on completion: current step confirms, then next step arrives.
```

Use linear progress for measured work. Use arrival motion only when a new step
becomes the active user context.
