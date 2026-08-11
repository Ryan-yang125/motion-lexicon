---
title: "Status Becomes Action"
status: candidate
level: "primitive-candidate"
locale: "en"
owner: "Motion Lexicon maintainers"
---

# Candidate: Status Becomes Action

## Product need

- **Original request:** “Create a complete Motion Lexicon primitive-candidate record for a reusable ‘status becomes action’ behavior where a completed operation reveals the next step in the same control. Use English, include three independent product scenes, a complete Motion Blueprint, and a portable implementation, then validate the Blueprint and deliver the finished candidate files.”
- **User-visible event:** A user starts an operation from a button. The button reports pending and completion, holds the confirmation for 650 ms, then the same focused button reveals the next useful action.
- **Why this scene deserves a reusable pattern:** Publishing, member invitation, and data export all need a local handoff from completed work to the next step. Keeping that handoff inside one control removes a second search target while preserving confirmation, focus, and surrounding layout.

## Classification

- **Level:** `primitive-candidate`
- **Proposed primitive ID:** `status-becomes-action`
- **Closest existing foundations:** `press-tap-feedback`, `text-morph`, `crossfade`
- **Closest existing Product Moments:** Publish release, Member invite, Progress steps
- **Distinction:** The foundations describe acknowledgement and visual replacement, but not the semantic handoff from a completion report to a newly executable follow-up in one persistent control. This candidate defines that invariant, including the confirmation hold, role change, focus continuity, interruption, and recovery behavior.

## Motion Blueprint

The JSON below is byte-for-byte identical to `motion-blueprint.json` and was not rewritten after validation.

```json
{
  "version": "2.0",
  "locale": "en",
  "intent": {
    "productGoal": "Carry a completed operation directly into its most useful follow-up without adding another control.",
    "userIntent": "Confirm that the operation finished, then continue from the same place.",
    "feeling": "Continuous, decisive, and calm"
  },
  "scope": {
    "surface": "Inline action control in a product work surface",
    "framework": "Semantic HTML, CSS, and JavaScript",
    "input": [
      "pointer",
      "keyboard",
      "touch",
      "programmatic"
    ]
  },
  "stateGraph": {
    "initial": "idle",
    "states": [
      {
        "id": "idle",
        "label": "The operation is available.",
        "role": "initial"
      },
      {
        "id": "pending",
        "label": "The operation is running in the same control.",
        "role": "pending"
      },
      {
        "id": "complete",
        "label": "Completion is confirmed in the control.",
        "role": "success"
      },
      {
        "id": "action-ready",
        "label": "The same control now offers the next step.",
        "role": "engaged"
      },
      {
        "id": "failure",
        "label": "The operation failed and the control offers retry.",
        "role": "failure"
      },
      {
        "id": "recovery",
        "label": "Retry has been acknowledged before work resumes.",
        "role": "recovery"
      },
      {
        "id": "next",
        "label": "The revealed next action has been invoked.",
        "role": "terminal"
      }
    ],
    "transitions": [
      {
        "event": "activate",
        "from": "idle",
        "to": "pending",
        "interrupt": "replace"
      },
      {
        "event": "repeat-activate",
        "from": "pending",
        "to": "pending",
        "interrupt": "settle"
      },
      {
        "event": "operation-succeeds",
        "from": "pending",
        "to": "complete",
        "interrupt": "settle"
      },
      {
        "event": "confirmation-seen",
        "from": "complete",
        "to": "action-ready",
        "interrupt": "replace"
      },
      {
        "event": "operation-fails",
        "from": "pending",
        "to": "failure",
        "interrupt": "settle"
      },
      {
        "event": "retry",
        "from": "failure",
        "to": "recovery",
        "interrupt": "replace"
      },
      {
        "event": "retry-starts",
        "from": "recovery",
        "to": "pending",
        "interrupt": "settle"
      },
      {
        "event": "cancel",
        "from": "pending",
        "to": "idle",
        "interrupt": "replace"
      },
      {
        "event": "activate-next",
        "from": "action-ready",
        "to": "next",
        "interrupt": "settle"
      }
    ]
  },
  "actors": [
    {
      "id": "continuing-control",
      "role": "primary",
      "kind": "hero",
      "element": "A stable native button whose operation changes after confirmation"
    },
    {
      "id": "control-face",
      "role": "supporting",
      "kind": "status",
      "element": "Reserved label and icon layers inside the button"
    },
    {
      "id": "live-status",
      "role": "supporting",
      "kind": "status",
      "element": "Polite atomic status region associated with the button"
    }
  ],
  "beats": [
    {
      "id": "acknowledge-operation",
      "at": 0,
      "actor": "continuing-control",
      "purpose": "confirm",
      "primitive": "press-tap-feedback",
      "from": "idle",
      "to": "pending",
      "durationMs": 150,
      "easing": "feedback",
      "properties": [
        "transform",
        "color"
      ]
    },
    {
      "id": "confirm-completion",
      "at": "operation-succeeds",
      "actor": "control-face",
      "purpose": "confirm",
      "primitive": "text-morph",
      "from": "pending",
      "to": "complete",
      "durationMs": 160,
      "easing": "feedback",
      "properties": [
        "transform",
        "opacity"
      ]
    },
    {
      "id": "reveal-next-action",
      "at": "after a 650 ms confirmation hold",
      "actor": "continuing-control",
      "purpose": "reveal",
      "primitive": "status-becomes-action",
      "from": "complete",
      "to": "action-ready",
      "durationMs": 240,
      "easing": "arrive",
      "properties": [
        "transform",
        "opacity",
        "color"
      ]
    },
    {
      "id": "reveal-failure",
      "at": "operation-fails",
      "actor": "control-face",
      "purpose": "recover",
      "primitive": "crossfade",
      "from": "pending",
      "to": "failure",
      "durationMs": 180,
      "easing": "feedback",
      "properties": [
        "opacity",
        "color"
      ]
    },
    {
      "id": "resume-from-retry",
      "at": "retry",
      "actor": "continuing-control",
      "purpose": "recover",
      "primitive": "press-tap-feedback",
      "from": "failure",
      "to": "recovery",
      "durationMs": 150,
      "easing": "feedback",
      "properties": [
        "transform",
        "color"
      ]
    }
  ],
  "accessibility": {
    "reducedMotion": "Remove travel and finish each face replacement in 1 ms; retain the 650 ms completion hold, live announcement, retry, and next action.",
    "focus": "Focus remains on the same native button through pending, completion, retry, and action-ready states; the integrator moves focus only if the next action navigates.",
    "aria": "A polite atomic status announces pending, success, failure, cancellation, action readiness, and next-action invocation; aria-label and aria-busy track the current product state.",
    "keyboard": "Tab reaches the control; Enter or Space starts, retries, or invokes the next action; Escape cancels pending work and restores idle without moving focus."
  },
  "delivery": {
    "formats": [
      "html",
      "css",
      "js"
    ],
    "integration": "Configure each data-status-action root with operation and next-action copy, connect the operation and navigation callbacks, and keep data-state as the visual mirror of the product state."
  },
  "provenance": {
    "status": "candidate",
    "foundations": [
      "press-tap-feedback",
      "text-morph",
      "crossfade"
    ],
    "moments": [
      "publish-release",
      "member-invite",
      "progress-steps"
    ],
    "confidence": "exploratory",
    "evidence": "The same status-to-next-action handoff is demonstrated in publishing, member invitation, and data export while the control identity, focus target, reserved geometry, timing profile, and interruption rules remain invariant."
  }
}
```

## Beat sequence

1. **Acknowledge operation:** Activation starts `pending` immediately. The same button settles after 150 ms and exposes truthful busy copy.
2. **Confirm completion:** When work succeeds, the pending face leaves and the completion face settles over 160 ms. The control rests in `complete` for 650 ms so the result is perceptible and announceable.
3. **Reveal next action:** After the confirmation hold, the proposed `status-becomes-action` primitive brings the next label into the same reserved control over 240 ms. The resting state is `action-ready`; focus has not moved.
4. **Recover locally:** A failed operation crossfades to a retry face in 180 ms. Retry is acknowledged in 150 ms, then the operation resumes without creating another control.
5. **Invoke the handoff:** Enter, Space, or pointer activation in `action-ready` invokes the next product action and leaves a stable terminal result. Escape during pending work cancels the current version and returns to `idle`.

## Product scenes

| Scene | Trigger | Primary actor | Final state | Independent evidence |
| --- | --- | --- | --- | --- |
| Publishing | Activate “Publish draft” after editorial review | Persistent publication button | “View live” in the same control | Release completion naturally precedes inspection of the public result; the demo exercises `idle → pending → complete → action-ready → next`. |
| Member invitation | Activate “Send invitation” from a team surface | Persistent invitation button | “Open member profile” in the same control | Sending and managing access are distinct collaboration operations joined by one local handoff; the demo also verifies rapid repeat and Escape cancellation. |
| Data export | Activate “Generate export” for a dated report | Persistent export button | “Download CSV” in the same control | Generation and download are distinct data operations; the demo intentionally fails once to verify `failure → recovery → pending → complete → action-ready`. |

### Invariant and adaptation

Across all scenes, the primary actor remains one native button; focus and geometry do not move; pending is truthful; completion holds for 650 ms; the next action arrives over 240 ms; repeated input settles; Escape cancels pending work; and ARIA reports the current state. Product copy, operation duration, failure count, completion message, and next callback adapt per scene.

## Portable implementation

- **Source artifacts:** `portable/index.html`, `portable/status-becomes-action.css`, and `portable/status-becomes-action.js`
- **Markup and product state:** Each `[data-status-action]` root owns one native button and one polite atomic status region. The JavaScript class owns product state; `data-state` only mirrors it for styling and tests.
- **Animated properties:** Control feedback uses `transform` and `color`; face handoffs use `transform` and `opacity`; no layout dimension animates.
- **Arrival and leaving values:** Next-action arrival is 240 ms with `cubic-bezier(.23, 1, .32, 1)` so the new affordance receives deliberate emphasis; outgoing faces leave in a quieter 140 ms with the same compact curve to protect continuity; press and retry feedback use 150 ms `cubic-bezier(.2, .8, .2, 1)`.
- **Interruption policy:** A monotonic intent version and cleared timer set prevent stale completion. Rapid repeat activation settles in `pending`. Escape invalidates the current intent and restores `idle`. A retry replaces failure before work resumes.
- **Reduced motion:** Every transition and spinner finishes in 1 ms; face transforms are removed; the completion hold, final state, retry, next action, focus, and live messages remain.
- **Focus, keyboard, and status:** The button stays mounted and focused. Tab enters; Enter and Space activate the current operation; Escape cancels active work. `aria-label`, `aria-busy`, `aria-disabled`, and the associated `role="status"` region reflect product state.
- **Integration boundary:** Replace the demo timer in `finishOperation` with the host’s operation promise, and handle `statusaction:next` with the product’s navigation or follow-up callback. Keep the state names and version guard intact.

### Parameters and events

| Input | Default | Purpose |
| --- | --- | --- |
| `data-idle-label` | `Start` | Initial operation copy |
| `data-pending-label` | `Working…` | Truthful in-flight copy |
| `data-success-label` | `Complete` | Confirmation held before the handoff |
| `data-action-label` | `Continue` | Next action exposed by the same button |
| `data-failure-label` | `Try again` | Local recovery action |
| `data-terminal-label` | `Opened` | Stable result after the next action |
| `data-operation-ms` | `600` | Demo adapter duration; replace with the host operation promise |
| `data-confirmation-ms` | `650` | Minimum perceptible success hold before revealing the next action |
| `data-failures-before-success` | `0` | Deterministic demo/test adapter for recovery coverage |
| `statusaction:statechange` | Custom event | Exposes `{ state, attempts }` for host logic and tests |
| `statusaction:repeat` | Custom event | Reports settled repeat activation during an active beat |
| `statusaction:next` | Custom event | Hands `{ label }` to navigation or the follow-up callback |

## Quality evidence

| Check | Command or action | Artifact | Observed result | Status |
| --- | --- | --- | --- | --- |
| Blueprint validator | `node …/validate-motion-blueprint.mjs candidates/status-becomes-action/motion-blueprint.json` | `motion-blueprint.json` | `Motion Blueprint validation passed`; exit 0 | pass |
| Blueprint embedding | Extract fenced JSON and compare bytes with the validated file | `candidate.md`, `motion-blueprint.json` | Exact byte match | pass |
| Standard motion | `npm run test:browser` — standard handoff test | `tests/status-becomes-action.spec.ts` | `idle → pending → complete → action-ready → next`; focus remains on the button | pass |
| Reduced motion | `npm run test:browser` — emulated `prefers-reduced-motion: reduce` | Portable CSS and browser test | 1 ms transition, no transform travel, completion and next action preserved | pass |
| Rapid repeat | Dispatch two activations, then press Escape | Portable JS and browser test | One operation attempt; repeat settles; Escape restores idle and focus | pass |
| Failure / recovery | Run export’s failure-once configuration and activate retry | Portable demo and browser test | `pending → failure → recovery → pending → complete → action-ready → next` | pass |
| Layout stability | Compare button bounding boxes before activation and at `action-ready` | Portable CSS and browser test | Width and height are equal to 4 decimal places; no horizontal overflow | pass |
| Portable source | `npm run build` | Built multi-page Vite fixture | TypeScript and Vite exit 0; 34 modules transformed; portable HTML emitted | pass |
| Browser suite | `npm run test:browser` | `tests/smoke.spec.ts`, `tests/status-becomes-action.spec.ts` | 6 tests passed | pass |
| Maintainer review | Submit this candidate directory for review | `candidates/status-becomes-action/` | Candidate stays non-public until maintainer approval | pending |
