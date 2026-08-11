---
title: "<required candidate name>"
status: candidate
level: "<required: preset | moment-candidate | primitive-candidate>"
locale: "<required: zh | en>"
owner: "<required owner>"
---

# Candidate: <required candidate name>

Replace every angle-bracket placeholder before review. Set `level` and
`locale` from the request. A primitive candidate uses all three independent
scene rows. Incomplete fields cannot be submitted.

## Product need

- **Original request:** <required verbatim request or source>
- **User-visible event:** <required trigger and result>
- **Why this scene deserves a reusable pattern:** <required evidence>

## Classification

- **Level:** `<required level>`
- **Closest existing foundations:** `<exact-published-id>`
- **Closest existing Product Moments:** <required moment or none>
- **Distinction:** <required invariant that the existing vocabulary lacks>

## Motion Blueprint

Complete every field, save this JSON to a file, and run the bundled validator.
Paste the exact exit-0 file here without rewriting it afterward.

```json
{
  "version": "2.0",
  "locale": "<required: zh or en>",
  "intent": {
    "productGoal": "<required product goal>",
    "userIntent": "<required user intent>",
    "feeling": "<required feeling>"
  },
  "scope": {
    "surface": "<required surface>",
    "framework": "<required framework>",
    "input": ["pointer", "keyboard"]
  },
  "stateGraph": {
    "initial": "idle",
    "states": [
      { "id": "idle", "label": "<required initial label>", "role": "initial" },
      { "id": "complete", "label": "<required final label>", "role": "success" }
    ],
    "transitions": [
      { "event": "<required event>", "from": "idle", "to": "complete", "interrupt": "replace" }
    ]
  },
  "actors": [
    {
      "id": "primary-actor",
      "role": "primary",
      "kind": "hero",
      "element": "<required semantic element>"
    }
  ],
  "beats": [
    {
      "id": "primary-change",
      "at": 0,
      "actor": "primary-actor",
      "purpose": "confirm",
      "primitive": "<required exact published or proposed candidate ID>",
      "from": "idle",
      "to": "complete",
      "durationMs": 180,
      "easing": "feedback",
      "properties": ["transform", "opacity"]
    }
  ],
  "accessibility": {
    "reducedMotion": "<required information-preserving result>",
    "focus": "<required focus entry and return>",
    "aria": "<required current-state announcement>",
    "keyboard": "<required keyboard path>"
  },
  "delivery": {
    "formats": ["html", "css", "js"],
    "integration": "<required portable integration boundary>"
  },
  "provenance": {
    "status": "candidate",
    "foundations": ["<required exact published comparison ID>"],
    "moments": ["<required related moment or none>"],
    "confidence": "exploratory",
    "evidence": "<required evidence summary>"
  }
}
```

## Product scenes

| Scene | Trigger | Primary actor | Final state | Independent evidence |
| --- | --- | --- | --- | --- |
| 1 | <required> | <required> | <required> | <required source/observation> |
| 2 | <required> | <required> | <required> | <required source/observation> |
| 3 | <required> | <required> | <required> | <required source/observation> |

A Moment candidate can document one production scene and its success, failure,
and recovery states. A primitive candidate requires three independent product
contexts with the same reusable behavior.

## Portable implementation

- **Source artifact:** <required path or fenced source>
- **Markup and product state:** <required>
- **Animated properties:** <required>
- **Arrival and leaving values:** <required>
- **Interruption policy:** <required>
- **Reduced motion:** <required>
- **Focus, keyboard, and status:** <required>

## Quality evidence

| Check | Command or action | Artifact | Observed result | Status |
| --- | --- | --- | --- | --- |
| Blueprint validator | `<required command>` | `<blueprint path>` | `<exit code and output>` | `<pass/fail>` |
| Standard motion | `<required action>` | `<artifact path>` | `<observed state sequence>` | `<pass/fail>` |
| Reduced motion | `<required action>` | `<artifact path>` | `<observed final state>` | `<pass/fail>` |
| Rapid repeat | `<required action>` | `<artifact path>` | `<observed interruption>` | `<pass/fail>` |
| Failure / recovery | `<required action>` | `<artifact path>` | `<observed recovery>` | `<pass/fail>` |
| Layout stability | `<required measurement>` | `<artifact path>` | `<observed geometry>` | `<pass/fail>` |
| Portable source | `<required build/test>` | `<source path>` | `<exit code and result>` | `<pass/fail>` |
| Maintainer review | `<required handoff>` | `<candidate path>` | `<review state>` | `<requested/pending>` |
