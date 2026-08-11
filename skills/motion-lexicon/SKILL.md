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
3. Use the mode × reference table below. Load only the files selected for the
   current task.
4. Load [interior-principles.md](references/interior-principles.md) when the
   request needs material depth, physicality, or the Interior visual profile.
5. State assumptions briefly when the request leaves product context open. Ask
   one focused question only when a missing constraint changes the design.
6. Keep one primary visual actor and at most two supporting actors in a beat.
   Give each actor a semantic kind: trigger, hero, status, record, or
   environment. Give each beat a product purpose: orient, confirm, preserve
   continuity, reveal, or recover.
7. Include a reduced-motion plan and keyboard/focus behavior in every composed,
   implemented, or reviewed interaction.

## Mode × reference routing

| Mode or task | Read | Add only when relevant |
| --- | --- | --- |
| Recommend a published component | [components.md](references/components.md) | One primitive family below when the user asks how the motion works |
| Recommend one behavior | [motion-language.md](references/motion-language.md) | [entrances](references/primitives/entrances.md), [feedback](references/primitives/feedback.md), [transitions](references/primitives/transitions.md), or [sequencing](references/primitives/sequencing.md) |
| Compose a Product Moment | [composition.md](references/composition.md) and [contract.md](references/contract.md) | [feedback moment](references/moments/feedback.md), [choice moment](references/moments/choice.md), [change moment](references/moments/change.md), or [workflow moment](references/moments/workflow.md) |
| Implement | [implementation-css.md](references/implementation-css.md) | [contract.md](references/contract.md) when consuming or producing a Blueprint; [components.md](references/components.md) for an exact published component |
| Review | [review-rubric.md](references/review-rubric.md) | The one primitive or moment reference that matches the observed behavior |
| Contribute | [contribution.md](references/contribution.md) and [candidate-template.md](assets/candidate-template.md) | [contract.md](references/contract.md) for the required Blueprint and [components.md](references/components.md) to rule out an existing component |

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
  `cubic-bezier(.23, 1, .32, 1)` over roughly 110–180 ms.
- Use transform and opacity for the moving work. Use short color or focus
  transitions when feedback needs an immediate response.
- Let a second user action interrupt, reverse, or settle the first action.
- In reduced motion, preserve state, hierarchy, focus, and feedback through a
  static state or short opacity crossfade.

Read the detailed rules in [interior-principles.md](references/interior-principles.md).

## Recommend

Return a compact decision that the user can apply immediately.

1. Map the request to up to three published candidates from
   [components.md](references/components.md), or from the one relevant primitive
   or moment reference selected above.
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
the contract. Every Compose response includes one schema-valid fenced JSON
object; do not substitute a prose table or text diagram for the Blueprint.
Keep string values compact in chat, then write the same JSON to a file when the
user asks for a reusable artifact.

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
