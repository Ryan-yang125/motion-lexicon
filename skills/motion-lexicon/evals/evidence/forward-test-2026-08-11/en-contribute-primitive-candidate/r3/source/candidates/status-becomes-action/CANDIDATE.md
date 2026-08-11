---
title: "Status becomes action"
status: candidate
level: primitive-candidate
locale: en
owner: Motion Lexicon contributors
---

# Candidate: Status becomes action

## Product need

- **Original request:** Create a complete Motion Lexicon primitive-candidate record for a reusable “status becomes action” behavior where a completed operation reveals the next step in the same control. Use English, include three independent product scenes, a complete Motion Blueprint, and a portable implementation, then validate the Blueprint and deliver the finished candidate files.
- **User-visible event:** A user starts an operation; when it completes, the same persistent button changes from progress feedback into the next meaningful action for the created result.
- **Why this scene deserves a reusable pattern:** Multi-step workflows repeatedly leave users to hunt for a result or a separate follow-up action after an operation completes. Keeping the one control stable preserves focus and gives completion a useful, durable meaning instead of a transient “done” message.

## Classification

- **Level:** `primitive-candidate`
- **Closest existing foundations:** `press-tap-feedback`, `text-morph`, `crossfade`
- **Closest existing Product Moments:** none
- **Distinction:** `loading-button` contains pending, success, and error feedback in one action. This candidate adds a stable semantic handoff: success changes the completed operation's control into a new, result-specific action while a nearby record explains the handoff.

## Motion Blueprint

Validated source: [`status-becomes-action.blueprint.json`](./status-becomes-action.blueprint.json)

```json
{
  "version": "2.0",
  "locale": "en",
  "intent": {
    "productGoal": "Turn a completed operation into its most useful next step without moving the user's attention.",
    "userIntent": "Finish work, understand the result, and continue from the same control.",
    "feeling": "Assured momentum"
  },
  "scope": {
    "surface": "An inline operation control in a product workflow",
    "framework": "Portable HTML, CSS, and JavaScript",
    "input": ["pointer", "keyboard", "touch", "programmatic"]
  },
  "stateGraph": {
    "initial": "idle",
    "states": [
      { "id": "idle", "label": "Start operation", "role": "initial" },
      { "id": "pending", "label": "Operation in progress", "role": "pending" },
      { "id": "ready", "label": "Completed result offers next action", "role": "success" },
      { "id": "failure", "label": "Operation failed; retry is available", "role": "failure" },
      { "id": "recovery", "label": "Retry is being prepared", "role": "recovery" },
      { "id": "terminal", "label": "Next action has been handed off", "role": "terminal" }
    ],
    "transitions": [
      { "event": "activate", "from": "idle", "to": "pending", "interrupt": "replace" },
      { "event": "complete", "from": "pending", "to": "ready", "interrupt": "settle" },
      { "event": "fail", "from": "pending", "to": "failure", "interrupt": "settle" },
      { "event": "retry", "from": "failure", "to": "recovery", "interrupt": "replace" },
      { "event": "restart", "from": "pending", "to": "pending", "interrupt": "replace" },
      { "event": "resume", "from": "recovery", "to": "pending", "interrupt": "replace" },
      { "event": "take-next-step", "from": "ready", "to": "terminal", "interrupt": "settle" },
      { "event": "reset", "from": "terminal", "to": "idle", "interrupt": "replace" }
    ]
  },
  "actors": [
    {
      "id": "operation-control",
      "role": "primary",
      "kind": "trigger",
      "element": "native button"
    },
    {
      "id": "operation-status",
      "role": "supporting",
      "kind": "status",
      "element": "polite live status"
    },
    {
      "id": "result-record",
      "role": "supporting",
      "kind": "record",
      "element": "stable result summary"
    }
  ],
  "beats": [
    {
      "id": "press-acknowledgement",
      "at": 0,
      "actor": "operation-control",
      "purpose": "confirm",
      "primitive": "press-tap-feedback",
      "from": "idle",
      "to": "pending",
      "durationMs": 150,
      "easing": "feedback",
      "properties": ["transform", "opacity", "color"]
    },
    {
      "id": "pending-label",
      "at": 0,
      "actor": "operation-control",
      "purpose": "orient",
      "primitive": "text-morph",
      "from": "idle",
      "to": "pending",
      "durationMs": 160,
      "easing": "feedback",
      "properties": ["opacity", "transform"]
    },
    {
      "id": "completion-to-next-step",
      "at": "operation-complete",
      "actor": "operation-control",
      "purpose": "reveal",
      "primitive": "status-becomes-action",
      "from": "pending",
      "to": "ready",
      "durationMs": 240,
      "easing": "arrive",
      "properties": ["transform", "opacity", "color"]
    },
    {
      "id": "result-context",
      "at": "operation-complete+40",
      "actor": "result-record",
      "purpose": "preserve-continuity",
      "primitive": "crossfade",
      "from": "pending",
      "to": "ready",
      "durationMs": 180,
      "easing": "arrive",
      "properties": ["opacity", "transform"]
    },
    {
      "id": "failure-retry",
      "at": "operation-failed",
      "actor": "operation-control",
      "purpose": "recover",
      "primitive": "text-morph",
      "from": "pending",
      "to": "failure",
      "durationMs": 160,
      "easing": "leave",
      "properties": ["opacity", "transform", "color"]
    }
  ],
  "accessibility": {
    "reducedMotion": "Use immediate text, icon, and status replacement; retain the result, retry, and next action without movement.",
    "focus": "Keep focus on the persistent native button through pending, completion, failure, and retry; hand focus to the next surface only after its action opens it.",
    "aria": "A polite live region announces pending, completion, failure, retry, and next-step handoff once per current request version.",
    "keyboard": "Tab reaches the button; Enter and Space activate it; Escape cancels pending work and restores the idle action."
  },
  "delivery": {
    "formats": ["html", "css", "js"],
    "integration": "Mount one data-status-action section, provide operation and nextAction callbacks, and retain the named data-state values for tests."
  },
  "provenance": {
    "status": "candidate",
    "foundations": ["press-tap-feedback", "text-morph", "crossfade"],
    "moments": ["none"],
    "confidence": "exploratory",
    "evidence": "Three independent workflows share one invariant: completion changes the control's semantic action in place while a stable result record explains why that next action is available."
  }
}
```

Beat sequence: activation compresses the persistent control and changes its label to a pending status. Completion makes the record readable, then the same button arrives as the result's next action. Failure changes that same button into retry. Every branch rests on a stable label, record, and live status; Escape cancels pending work back to the idle action.

## Product scenes

| Scene | Trigger | Primary actor | Final state | Independent evidence |
| --- | --- | --- | --- | --- |
| Export selected orders | User selects 24 orders and chooses **Generate export**. | The export button. | The same button becomes **Download export** next to `Export-24-orders.csv is ready.` | Product-flow observation: a finished export creates a concrete file and immediately requires retrieval rather than another confirmation. |
| Invite a teammate | An admin chooses **Send invite**. | The invite button. | The same button becomes **Copy invite link** while the record identifies the invited teammate. | Product-flow observation: a sent invitation often needs a second delivery channel, and the generated link is the completed operation’s actionable result. |
| Create a deployment preview | A developer chooses **Build preview**. | The preview-build button. | The same button becomes **Open preview** while the record names the generated preview URL. | Product-flow observation: a successful build is not the user’s endpoint; inspection of the resulting environment is the immediate next step. |

Invariant: one native control keeps its position, focus, hit target, and visual identity as the operation reaches a result. Adapt the noun, result record, and next-action callback per scene; do not use this pattern when the completed operation has no unambiguous next step.

## Portable implementation

- **Source artifact:** [`index.html`](../../public/status-becomes-action/index.html), [`styles.css`](../../public/status-becomes-action/styles.css), and [`status-becomes-action.js`](../../public/status-becomes-action/status-becomes-action.js)
- **Markup and product state:** A native button stays mounted inside `[data-status-action]`; named `data-state` values drive label, record, icon, and live status.
- **Animated properties:** `transform`, `opacity`, and short `color`/background transitions only; the button and status line reserve their geometry.
- **Arrival and leaving values:** 150 ms press/pending feedback, 240 ms completion arrival, 180 ms supporting record arrival, and 150 ms failure leaving—each uses the Blueprint’s named easing.
- **Interruption policy:** A monotonic intent version and `AbortController` cancel stale pending work; rapid repeat starts the latest request, Escape returns to idle, and stale responses cannot announce or commit visible state.
- **Reduced motion:** The media query reduces CSS movement to 1 ms and JavaScript skips replacement animations; the final labels, record, live status, focus behavior, retry, and next action remain intact.
- **Focus, keyboard, and status:** Tab enters the one button, Enter/Space activate it, Escape cancels pending work, focus remains on the persistent button, and the status uses `aria-live="polite"` with atomic messages.

## Quality evidence

| Check | Command or action | Artifact | Observed result | Status |
| --- | --- | --- | --- | --- |
| Blueprint validator | `node /private/tmp/ml-v420-recorded-pr6ha4/en-contribute-primitive-candidate-r3/codex-home/skills/motion-lexicon/scripts/validate-motion-blueprint.mjs candidates/status-becomes-action/status-becomes-action.blueprint.json` | `status-becomes-action.blueprint.json` | Exit 0: `Motion Blueprint validation passed`. | pass |
| Standard motion | Playwright: completion reveals next action | `tests/status-becomes-action.spec.ts` | `idle → pending → ready → terminal`; the one button changed to **Download export** before handoff. | pass |
| Reduced motion | Playwright emulates `prefers-reduced-motion: reduce` | `styles.css`, browser test | Button transition duration computed as `0.001s`; state, focus, and final action remained available. | pass |
| Rapid repeat | Playwright dispatches two immediate activations | `status-becomes-action.js`, browser test | The obsolete request was aborted; only the latest request committed `ready`. | pass |
| Failure / recovery | Playwright uses `?outcome=fail-once`, then retries | `status-becomes-action.js`, browser test | `pending → failure → recovery → pending → ready`; **Try again** restores the normal result handoff. | pass |
| Layout stability | Browser test reads the control rectangle | `styles.css`, browser test | Persistent control retained its reserved full well width and 52 px minimum height; no horizontal overflow in the fixture smoke test. | pass |
| Portable source | `npm run build`; `ML_EVAL_PORT=4189 npx playwright test tests/status-becomes-action.spec.ts --reporter=line` | Fixture plus portable static files | Build exited 0; browser suite exited 0 with 3 passing tests. | pass |
| Maintainer review | Candidate handoff | `CANDIDATE.md` | Candidate assembled with `status: candidate`; publication awaits maintainer decision. | requested/pending |
