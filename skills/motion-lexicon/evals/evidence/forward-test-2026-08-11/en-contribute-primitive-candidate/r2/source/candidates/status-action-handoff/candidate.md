---
title: "Status Action Handoff"
status: candidate
level: "primitive-candidate"
locale: "en"
owner: "Motion Lexicon contributor"
---

# Candidate: Status Action Handoff

## Product need

- **Original request:** Create a complete Motion Lexicon primitive-candidate record for a reusable “status becomes action” behavior where a completed operation reveals the next step in the same control. Use English, include three independent product scenes, a complete Motion Blueprint, and a portable implementation, then validate the Blueprint and deliver the finished candidate files.
- **User-visible event:** A user starts an asynchronous operation; when it completes, the same persistent control confirms completion and becomes the most useful next action.
- **Why this scene deserves a reusable pattern:** Export, invitation, and backup workflows all create a new artifact or record that users commonly inspect next. A stable control can bridge operation and continuation without adding a second button, shifting layout, or making users search for the result.

## Classification

- **Level:** `primitive-candidate`
- **Closest existing foundations:** `press-tap-feedback`, `crossfade`, `text-morph`, `shake-wiggle`
- **Closest existing Product Moments:** none
- **Distinction:** `loading-button` keeps pending, success, and error feedback in one operation position, while `copy-button` confirms a completed action in place. `status-action-handoff` adds a semantic handoff: after success, the same focused control persists but its next activation operates on the newly created result. The invariant is not a copy or timing preset; it is operation → completion → next action in one stable actor.

## Motion Blueprint

The JSON below is copied byte-for-byte from `blueprint.json` after exit-0 validation.

```json
{
  "version": "2.0",
  "locale": "en",
  "intent": {
    "productGoal": "Carry a completed operation directly into its most useful next step without adding another control.",
    "userIntent": "Confirm that the operation finished and continue from the same place.",
    "feeling": "Continuous, assured, and ready"
  },
  "scope": {
    "surface": "Inline async action control across desktop and mobile product surfaces",
    "framework": "Portable semantic HTML, CSS, and JavaScript",
    "input": [
      "pointer",
      "keyboard",
      "touch"
    ]
  },
  "stateGraph": {
    "initial": "idle",
    "states": [
      {
        "id": "idle",
        "label": "The original operation is available",
        "role": "initial"
      },
      {
        "id": "pending",
        "label": "The operation is in progress in the persistent control",
        "role": "pending"
      },
      {
        "id": "ready",
        "label": "Completion is confirmed and the same control offers the next action",
        "role": "success"
      },
      {
        "id": "failure",
        "label": "The operation failed and the same control offers retry",
        "role": "failure"
      },
      {
        "id": "recovering",
        "label": "Retry is accepted before the operation resumes",
        "role": "recovery"
      },
      {
        "id": "opened",
        "label": "The revealed next action has been used",
        "role": "terminal"
      }
    ],
    "transitions": [
      {
        "event": "activate-operation",
        "from": "idle",
        "to": "pending",
        "interrupt": "replace"
      },
      {
        "event": "operation-completes",
        "from": "pending",
        "to": "ready",
        "interrupt": "settle"
      },
      {
        "event": "operation-fails",
        "from": "pending",
        "to": "failure",
        "interrupt": "settle"
      },
      {
        "event": "activate-retry",
        "from": "failure",
        "to": "recovering",
        "interrupt": "replace"
      },
      {
        "event": "retry-starts",
        "from": "recovering",
        "to": "pending",
        "interrupt": "replace"
      },
      {
        "event": "cancel-pending",
        "from": "pending",
        "to": "idle",
        "interrupt": "replace"
      },
      {
        "event": "activate-next-action",
        "from": "ready",
        "to": "opened",
        "interrupt": "settle"
      }
    ]
  },
  "actors": [
    {
      "id": "action-control",
      "role": "primary",
      "kind": "hero",
      "element": "Persistent native button containing reserved operation and next-action labels"
    },
    {
      "id": "live-status",
      "role": "supporting",
      "kind": "status",
      "element": "Polite atomic status paragraph"
    },
    {
      "id": "result-well",
      "role": "supporting",
      "kind": "environment",
      "element": "Stable result preview region"
    }
  ],
  "beats": [
    {
      "id": "press-cue",
      "at": 0,
      "actor": "action-control",
      "purpose": "confirm",
      "primitive": "press-tap-feedback",
      "from": "idle",
      "to": "pending",
      "durationMs": 140,
      "easing": "feedback",
      "properties": [
        "transform",
        "color"
      ]
    },
    {
      "id": "pending-status",
      "at": 0,
      "actor": "live-status",
      "purpose": "confirm",
      "primitive": "crossfade",
      "from": "idle",
      "to": "pending",
      "durationMs": 150,
      "easing": "feedback",
      "properties": [
        "opacity"
      ]
    },
    {
      "id": "handoff-to-next-action",
      "at": "operation-complete",
      "actor": "action-control",
      "purpose": "preserve-continuity",
      "primitive": "status-action-handoff",
      "from": "pending",
      "to": "ready",
      "durationMs": 240,
      "easing": "arrive",
      "properties": [
        "transform",
        "opacity",
        "color"
      ]
    },
    {
      "id": "failure-cue",
      "at": "operation-failure",
      "actor": "action-control",
      "purpose": "recover",
      "primitive": "shake-wiggle",
      "from": "pending",
      "to": "failure",
      "durationMs": 180,
      "easing": "feedback",
      "properties": [
        "transform",
        "color"
      ]
    },
    {
      "id": "retry-cue",
      "at": "retry-accepted",
      "actor": "live-status",
      "purpose": "recover",
      "primitive": "crossfade",
      "from": "failure",
      "to": "recovering",
      "durationMs": 150,
      "easing": "feedback",
      "properties": [
        "opacity"
      ]
    }
  ],
  "accessibility": {
    "reducedMotion": "Apply every state immediately with a 1 ms opacity change; remove label travel, spin, and shake while preserving the ready action and result.",
    "focus": "Focus enters the persistent native button and remains there through pending, success, failure, retry, and next-action activation.",
    "aria": "A polite atomic live region announces pending, completion with the available next action, failure with retry, cancellation, and the opened result.",
    "keyboard": "Tab reaches each action; Enter or Space activates its current meaning; Escape cancels only the focused pending operation and restores idle."
  },
  "delivery": {
    "formats": [
      "html",
      "css",
      "js"
    ],
    "integration": "Copy the three source files, retain the data-status-action hooks, provide product callbacks or data attributes, and call initStatusActionHandoffs after rendering."
  },
  "provenance": {
    "status": "candidate",
    "foundations": [
      "press-tap-feedback",
      "crossfade",
      "text-morph",
      "shake-wiggle"
    ],
    "moments": [
      "none"
    ],
    "confidence": "exploratory",
    "evidence": "The same persistent-control handoff is demonstrated in analytics export, member invitation, and backup creation, including cancellation, failure, retry, and next-action use."
  }
}
```

## Beat sequence

1. **Press cue — starts on operation activation; rests in `pending`.** The button gives 140 ms local press feedback, keeps its box and focus, then presents the truthful in-progress label.
2. **Pending status — starts with the request; rests in `pending`.** The polite status region crossfades to the operation message over 150 ms. Repeated activation settles on the current request instead of creating another.
3. **Handoff — starts only from the current request’s success; rests in `ready`.** The operation label leaves in 150 ms while the next action arrives into the reserved label slot over 240 ms. Color and check state confirm that the control’s meaning has advanced.
4. **Failure cue — starts from the current request’s failure; rests in `failure`.** A compact 180 ms shake and danger color expose retry in the same control. No completion or next-action announcement is made.
5. **Retry cue — starts when retry is accepted; rests briefly in `recovering`, then returns to `pending`.** The live status changes over 150 ms. Only the newest request version can commit success or failure.

## Product scenes

| Scene | Trigger | Primary actor | Final state | Independent evidence |
| --- | --- | --- | --- | --- |
| Analytics export | Activate “Generate report” after selecting a weekly acquisition report | Persistent export button | “Open report” in the same button; activation opens the generated report summary | The export operation creates a discrete report artifact, and inspection of that artifact is the immediate follow-up task. |
| Team invitation | Activate “Send invitation” for a workspace member | Persistent invitation button | “View member” in the same button; activation opens the member record | The invitation operation creates or updates a member record, which administrators commonly verify next. |
| Infrastructure backup | Activate “Create backup” before deployment; first attempt fails and is retried | Persistent backup button | “Review backup” in the same button; activation opens the verified restore point | A backup operation creates a restore artifact whose integrity and metadata need review; the scene also proves failure does not leak a false next action. |

**Invariant:** One native control retains its DOM identity, dimensions, position, focus, and relationship to the live status while its semantic action advances from operation to next step. Only labels, local color, icon state, and callback meaning adapt.

**Scene-specific adaptation:** Product copy, real operation duration, success destination, failure language, and result summary vary. The transition order, interruption policy, reserved geometry, accessibility contract, and 140/150/240 ms motion roles remain fixed.

## Portable implementation

- **Source artifact:** `public/candidates/status-action-handoff/index.html`, `styles.css`, and `status-action-handoff.js`
- **Markup and product state:** A native `button`, a polite atomic status paragraph, and a stable result well. Each instance has one `data-state` source of truth; operation state is independent of CSS selectors and is exposed through `status-action:statechange`.
- **Animated properties:** `transform`, `opacity`, and short local `background-color` transitions. Button and label-wrapper dimensions are reserved before state changes.
- **Arrival and leaving values:** Next-action arrival is 240 ms with `cubic-bezier(.23, 1, .32, 1)`; the old label leaves in 150 ms with the same structured curve; press feedback is 140 ms with `cubic-bezier(.2, .8, .2, 1)`; failure shake is 180 ms.
- **Interruption policy:** Repeated activation during pending settles on the active request and does not increment its monotonic version. Escape invalidates the request version, clears its timer, restores idle, and retains focus. Only the current version may commit. Retry replaces failure with a new request.
- **Reduced motion:** All travel, spin, and shake collapse to a 1 ms state change; semantic labels, live messages, result, focus, failure, retry, and next action remain available.
- **Focus, keyboard, and status:** Tab reaches each 64 px native button; Enter and Space activate its current meaning; Escape cancels a focused pending request. Focus never moves because the button node never leaves. `aria-label` follows the current action, `aria-describedby` ties it to the status, and `aria-live="polite" aria-atomic="true"` announces meaningful state changes.

### Integration

Copy the three source files. Keep the `data-status-action` and descendant data hooks, set each product string through the documented `data-*` attributes, and call the exported `initStatusActionHandoffs(scope)` after markup is present. Replace the demo timer and `openResult()` body with product promises and callbacks while retaining the monotonic request-version check.

## Quality evidence

| Check | Command or action | Artifact | Observed result | Status |
| --- | --- | --- | --- | --- |
| Blueprint validator | `node "$CODEX_HOME/skills/motion-lexicon/scripts/validate-motion-blueprint.mjs" candidates/status-action-handoff/blueprint.json` | `candidates/status-action-handoff/blueprint.json` | Exit 0; `Motion Blueprint validation passed` | pass |
| Standard motion | `npm run test:browser`, success handoff test | root fixture and standalone demo | Observed `idle → pending → ready → opened`; accessible name advanced to “Open report” | pass |
| Reduced motion | Playwright `page.emulateMedia({ reducedMotion: "reduce" })` | `tests/smoke.spec.ts` | Label transition computed as 1 ms; handoff still reached `ready` with “Open report” | pass |
| Rapid repeat | Two activations during pending, then Escape | `tests/smoke.spec.ts` | Request version did not increment; current request settled; Escape restored `idle` and focus remained on the button after the stale timer window | pass |
| Failure / recovery | First backup attempt, retry, then next action | `tests/smoke.spec.ts` | Observed `pending → failure → recovering → pending → ready → opened`; labels advanced from “Retry backup” to “Review backup” | pass |
| Layout stability | Compare the action’s pre-operation and ready-state bounding boxes; audit 320, 390, 768, and 1440 px | `tests/smoke.spec.ts` | Width and height deltas were below 0.25 px; no horizontal overflow; minimum target size was at least 44 × 44 px; zero target offenders | pass |
| Portable source | `npm run build && npm run test:browser` | `dist/candidates/status-action-handoff/` | Build exited 0; 30 modules transformed; all 6 browser tests passed, including the standalone non-React URL | pass |
| Maintainer review | Submit this record and its source directory | `candidates/status-action-handoff/candidate.md` | Candidate is complete and remains unpublished pending maintainer decision | requested/pending |
