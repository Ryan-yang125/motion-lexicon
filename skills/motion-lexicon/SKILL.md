---
name: motion-lexicon
description: Design, compose, implement, review, and contribute polished interface motion for real product states. Use this skill whenever a user asks what motion fits a UI event, needs a single interaction or a multi-step product moment, requests HTML, CSS, JavaScript, or React motion code, wants an animation review, or wants to add a Motion Lexicon candidate. Apply it to Chinese and English requests, precise motion terms, and vague product-feeling descriptions.
---

# Motion Lexicon

Motion Lexicon is a design system for product motion. It connects two equal
collections: Motion Primitives describe a precise behavior; Components turn
one or more behaviors into a complete, copy-ready product interaction.

Design from the user's product event. Produce code only when it supports a
clear state change, a focused actor, and an accessible handoff.

## Choose a mode

| Signal in the request | Mode | Deliverable |
| --- | --- | --- |
| A feeling, term, or "which animation" question | **Recommend** | Ranked candidates and one recommendation |
| A workflow, transition, or multi-step scene | **Compose** | Motion Blueprint and beat plan |
| A request for production code or a framework adaptation | **Implement** | Portable HTML, CSS, JS, or requested framework code |
| Existing code, a recording, or a report of jank | **Review** | Prioritized diagnosis and concrete fixes |
| A new pattern, example, or proposed library addition | **Contribute** | Candidate record ready for maintainer review |

Use the most specific mode that fulfills the request. A Compose request can
continue into Implement when the user requests code. A Review request can
return a revised Blueprint when the current interaction needs a larger change.

## Start every request

1. Preserve the user's language. Use Chinese for Chinese requests and English
   for English requests.
2. Identify the product event, the user-visible state before and after it, the
   primary actor, and the user's intended feeling.
3. Read [motion-language.md](references/motion-language.md),
   [interior-principles.md](references/interior-principles.md), and the
   [Motion Grammar contract](references/contract.md). Load one focused reference
   for the task: [composition](references/composition.md), [CSS implementation](references/implementation-css.md),
   [review rubric](references/review-rubric.md), or [contribution](references/contribution.md).
4. For a product moment, also read the relevant file in
   [references/moments](references/moments/). For a single behavior, read the
   relevant file in [references/primitives](references/primitives/).
5. State assumptions briefly when the request leaves product context open. Ask
   one focused question only when a missing constraint changes the design.
6. Keep one primary visual actor and at most two supporting actors in a beat.
   Give each actor a semantic kind: trigger, hero, status, record, or
   environment. Give each beat a product purpose: orient, confirm, preserve
   continuity, reveal, or recover.
7. Include a reduced-motion plan and keyboard/focus behavior in every composed,
   implemented, or reviewed interaction.

## Motion language

Use the Interior-informed profile throughout the skill:

- Model a real product state with a bezel, a raised panel, and a recessed well
  when material depth helps orientation.
- Start motion from an event: a press, selection, route change, status update,
  or direct manipulation.
- Reserve space for state changes so labels, buttons, and records keep their
  geometry.
- Use arrival motion for new context: `cubic-bezier(.23, 1, .32, 1)` over
  roughly 200–280 ms. Use leaving motion for removed context:
  `cubic-bezier(.4, 0, 1, 1)` over roughly 110–180 ms.
- Use transform and opacity for the moving work. Use short color or focus
  transitions when feedback needs an immediate response.
- Let a second user action interrupt, reverse, or settle the first action.
- In reduced motion, preserve state, hierarchy, focus, and feedback through a
  static state or short opacity crossfade.

Read the detailed rules in [interior-principles.md](references/interior-principles.md).

## Recommend

Return a compact decision that the user can apply immediately.

1. Map the request to up to three candidates from the primitive and moment
   references.
2. Explain the visual difference in product terms: spatial continuity, weight,
   pacing, attention, or status confidence.
3. Choose one candidate and state the default timing, easing, trigger, and
   reduced-motion treatment.
4. Offer a Motion Blueprint when the request describes several states.

Use this format:

```md
## 建议 / Recommendation

| 候选 / Candidate | 适合场景 / Fit | 区别 / Difference |
| --- | --- | --- |
| … | … | … |

**推荐 / Pick:** …

- 触发 / Trigger: …
- 节奏 / Timing: …
- 无障碍 / Accessibility: …
```

## Compose

Create a Motion Blueprint before expanding into implementation details. Use
[assets/motion-blueprint.schema.json](assets/motion-blueprint.schema.json) as
the contract. Keep it compact in chat; write a JSON file when the user asks for
a reusable artifact.

The Blueprint includes:

- `intent`: product goal, user intent, and desired feeling.
- `stateGraph`: named before, in-flight, success, failure, and recovery states
  that matter for the scene.
- `actors`: one primary actor, supporting actors, and a semantic kind for each
  actor.
- `beats`: timed changes with a purpose, primitive, properties, duration, and
  easing.
- `accessibility`: reduced motion, focus, ARIA status, keyboard, and pointer
  plans.
- `delivery`: requested formats and integration notes.
- `provenance`: referenced primitives, moments, confidence, and candidate
  status.

After the Blueprint, describe the beat sequence in plain language. Give each
beat a clear start condition and final resting state.

## Implement

Read [implementation-css.md](references/implementation-css.md) before writing
code. Default to semantic HTML, CSS custom properties, and small event-driven
JavaScript. Adapt to React, Vue, Svelte, or another framework when requested.

Implementation requirements:

- Keep markup semantic and stateful with `data-state`, `aria-live`, and native
  controls where they fit.
- Animate `transform` and `opacity`; reserve layout dimensions before a state
  enters or leaves.
- Use timing values from the Blueprint. Keep a typical arrival within 200–280
  ms unless the product event communicates real duration.
- Make interruption explicit. A repeat press, Escape, undo, or route change
  should settle into a coherent state.
- Include a `prefers-reduced-motion` branch that preserves information and
  interaction.
- Deliver only the formats the user requested. A complete portable handoff uses
  `HTML`, `CSS`, and `JS` sections plus a short integration note.

For a single primitive, give one canonical implementation and a concise
parameter table. For a Product Moment, give the complete state machine and
code for every meaningful state.

## Review

Read [review-rubric.md](references/review-rubric.md). Diagnose the observed
behavior before proposing a rewrite.

Review in this order:

1. State clarity: can a user identify what changed and why?
2. Continuity: does the primary actor keep its spatial or semantic identity?
3. Timing: do arrival, feedback, and leaving rhythms fit the event?
4. Performance: do animated properties stay compositor-friendly and stable?
5. Interruption: do rapid repeat actions, failure, undo, and navigation settle
   coherently?
6. Accessibility: do reduced motion, focus, keyboard, and status messages
   preserve meaning?

Return findings as `critical`, `important`, and `polish`, each with observed
effect, likely cause, and a focused fix. Include a revised beat plan when it
improves several findings at once.

## Contribute

Read [contribution.md](references/contribution.md) and use
[assets/candidate-template.md](assets/candidate-template.md). Gather a real
product scene, evidence for the user need, a complete Blueprint, and portable
implementation notes.

Classify the proposal:

- **Preset:** a controlled timing, copy, or visual variation of a published
  pattern.
- **Moment candidate:** a complete product scene built from existing
  primitives.
- **Primitive candidate:** a reusable behavior demonstrated across three
  independent product scenes.

Create the candidate record with `status: candidate`. Keep public publication
for maintainer approval. Include test states, reduced-motion behavior, and the
three-scene proof for a primitive candidate.

## Output quality

- Favor a concrete product scene over generic decorative motion.
- Keep explanations concise. Put detail into the Blueprint, code, or review
  table when it directly helps implementation.
- Preserve the user's component structure and product language when reviewing
  existing work.
- Use direct, precise language. Describe behavior in terms a designer and an
  engineer can both implement.
- Validate JSON Blueprints with:

  ```bash
  node skills/motion-lexicon/scripts/validate-motion-blueprint.mjs path/to/blueprint.json
  ```
