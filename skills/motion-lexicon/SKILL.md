---
name: motion-lexicon
description: Design, build, compose, implement, review, and contribute polished product interfaces with Motion Lexicon components and motion primitives. Use this skill when a user asks for a complete React page, landing page, dashboard, settings screen, or product surface in the Motion Lexicon visual language; asks what motion fits a UI event; needs a single interaction or multi-step product moment; requests implementation code for a user-visible product interaction or motion state change; wants an animation review; or wants to add a Motion Lexicon candidate. Apply it to Chinese and English requests, precise motion terms, and vague product-feeling descriptions. Simple copy edits, static token or breakpoint changes, and data-processing tasks stay outside this skill unless the request also includes a visible interaction or motion decision.
---

# Motion Lexicon

Motion Lexicon is a design system for product motion. It connects two equal
collections: Motion Primitives describe a precise behavior; Components turn
one or more behaviors into a complete, copy-ready product interaction. Page
composition places those interactions inside a coherent product surface.

Design from the user's product event. Produce code only when it supports a
clear state change, a focused actor, and an accessible handoff.

## Choose a mode

| Signal in the request | Mode | Deliverable |
| --- | --- | --- |
| A complete page, screen, landing page, dashboard, or settings surface | **Build Page** | Page plan, exact Registry composition, working page, and acceptance evidence |
| A feeling, term, or "which animation" question | **Recommend** | Ranked candidates and one recommendation |
| A workflow, transition, or multi-step scene | **Compose** | Motion Blueprint and beat plan |
| A request for production code or a framework adaptation | **Implement** | Portable HTML, CSS, JS, or requested framework code |
| Existing code, a recording, or a report of jank | **Review** | Prioritized diagnosis and concrete fixes |
| A new pattern, example, or proposed library addition | **Contribute** | Candidate record ready for maintainer review |

Apply mode priority deterministically: a complete page or multi-region surface
uses Build Page; an explicit request for code or a framework implementation of
one interaction uses Implement; a request only for a design plan, beat plan, or
Blueprint uses Compose. Implement may create a Blueprint internally and still
delivers the runnable format the user requested. A Review request can return a
revised Blueprint when the current interaction needs a larger change.

## Start every request

1. Preserve the user's language. Use Chinese for Chinese requests and English
   for English requests.
2. Identify the product job, primary action, user-visible state before and
   after it, primary actor, and intended feeling.
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
8. For a page request, inspect the host project before choosing a stack. Preserve
   its routing, component system, design tokens, and content language. Use React
   and TypeScript for a greenfield page unless the user requests another stack.

## Mode × reference routing

| Mode or task | Read | Add only when relevant |
| --- | --- | --- |
| Build Page | [page-composition.md](references/page-composition.md), [page-system.md](references/page-system.md), and [components.md](references/components.md) | [motion-lexicon-page.css](assets/motion-lexicon-page.css) when the host has no established visual system; one moment or primitive reference for the page's primary state change |
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

## Build Page

Build a complete, runnable product surface in the user's project. Read
[page-composition.md](references/page-composition.md),
[page-system.md](references/page-system.md), and
[components.md](references/components.md) before planning the page.

1. Inspect the target repository, framework, routes, existing tokens, and
   installed dependencies. Reuse the host system where it is coherent.
2. Before editing any file, output the Host inspection table and compact Page
   Plan shown below. Include the page job and archetype, every major region,
   the exact published component ID or `none`, the primary state boundary, and
   the responsive and theme decisions. Every Host inspection value cites the
   inspected file path. A prose implementation intention does not satisfy this
   gate.
3. Use the source at `https://motion-lexicon.pages.dev/r/<id>.json` for a
   published component. Read its `files`, `dependencies`, and runtime before
   editing. Install the delivered source and dependencies; adapt only its
   props, labels, data, callbacks, and host placement. Do not regenerate an
   approximation of the same component.
4. Complete the Registry integration gate before selecting an ID: every
   current Registry source uses Tailwind utility classes. Confirm that the host
   already compiles Tailwind, or add its supported Tailwind setup when changing
   the host toolchain is within scope. If that setup cannot be added, select
   `none` for the region and build plain semantic UI; never silently paste a
   CSS reimplementation of a Registry component. Record the JSON URL, target
   file, dependency list, and any required runtime in the Page Plan.
5. Audit the rendered interactive node after integration. The page standard is
   at least 44 by 44 CSS px even when a Registry component's default visual
   height is smaller. Pass a host class through a documented `className` prop
   and set `min-width` and `min-height` on that node. If the source offers no
   safe styling hook, choose a fitting component that does or leave the region
   plain.
6. Give the page one dominant work surface, one primary motion moment, and at
   most two supporting motion moments. Keep static content calm.
7. Use the host design system. For a greenfield surface, copy and adapt
   [motion-lexicon-page.css](assets/motion-lexicon-page.css), then apply the
   exact hierarchy and responsive rules from
   [page-system.md](references/page-system.md).
8. Deliver the whole route or page, including realistic content, loading,
   empty, success, failure, and recovery states that belong to its job.
9. Verify 320, 390, 768, and 1440 px layouts; light and dark themes; keyboard
   order and focus; reduced motion; 44 px interactive targets; overflow; and
   console or hydration errors. Build success alone does not satisfy page
   acceptance. Start the local app or production preview and use available
   browser automation to exercise the primary action and inspect rendered
   geometry at every required viewport. A missing project browser-test script
   is not a blocker: use an available browser tool against the local preview.
   At each viewport, enumerate every visible `button`, link, input, select,
   textarea, and custom interactive node; record the minimum rendered width and
   height plus an `offenders` list for nodes below 44 px in either dimension.
   Fix every offender and rerun all four viewport audits before reporting
   acceptance. Report the commands, interactions, measurements, and observable
   results.

Keep the Page Plan concise:

```md
## Host inspection

| Concern | Observed host evidence |
| --- | --- |
| Framework | name/version — `package.json` |
| Route | current route and target file — `src/router.tsx` |
| Component system | reused components or none — `src/components/...` |
| Tokens / theme | token and theme mechanism — `src/styles.css` |
| Tailwind | installed/compiled or absent — `package.json`, `vite.config.ts` |
| Dependencies | reused packages and versions — `package.json` |

## Page Plan

Job: …
Archetype: …
Primary action: …
Primary state: idle → pending → success/error

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| … | … | `component-id` or `none` | … |

Registry:
- `component-id` — https://motion-lexicon.pages.dev/r/component-id.json —
  `target/file.tsx` — dependencies: `package` / none

Responsive: 320/390 …; 768 …; 1440 …
Theme: light …; dark …; reduced motion …
```

Do not begin implementation until every line in this plan is concrete.

The final handoff must remain independently auditable after intermediate
messages are collapsed. Repeat the complete Host inspection table and Page
Plan, including the region table and Registry lines, then add an Acceptance
table with one observed row for each item below:

```md
| Check | Observed evidence |
| --- | --- |
| Build | command and exit result |
| 320 | viewport/document width, minimum target width/height, offender count |
| 390 | viewport/document width, minimum target width/height, offender count |
| 768 | viewport/document width, minimum target width/height, offender count |
| 1440 | viewport/document width, minimum target width/height, offender count |
| Light / dark | how each theme was activated and inspected |
| Keyboard / focus | exact key path, focus entry, and focus return |
| Reduced motion | emulated preference and observed static or crossfade result |
| Targets | measured minimum width and height of visible interactive nodes |
| Primary state | exercised pending, success, error/retry, and interruption states that apply |
| Runtime | console, page, request, and hydration error counts |
```

Name the installed component IDs and changed files. Use `Incomplete` for an
unobserved row and state the missing capability. Do not describe an unobserved
check as supported or passing.

When the user requests the Motion Lexicon look, preserve the visual profile and
interaction quality while adapting content and information architecture to the
actual product. Avoid filling a page with library demos.

## Recommend

Return a compact decision that the user can apply immediately.

1. Map the request to up to three published candidates from
   [components.md](references/components.md), or from the one relevant primitive
   reference selected above. Start every candidate cell with its exact
   published component or primitive ID in backticks, followed by a human label
   when useful. A descriptive label alone is incomplete. Never present an
   unknown or invented ID as published.
2. Explain the visual difference in product terms: spatial continuity, weight,
   pacing, attention, or status confidence.
3. Choose one candidate, repeat its exact published ID in the Pick line, and
   state the default timing, easing, trigger, and reduced-motion treatment.
4. Offer a Motion Blueprint when the request describes several states.

Use this format:

```md
## 建议 / Recommendation

| 候选 / Candidate | 适合场景 / Fit | 区别 / Difference |
| --- | --- | --- |
| `published-id` / … | … | … |

**推荐 / Pick:** `published-id` / …

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

Every `beats[].primitive` and every `provenance.foundations[]` value must be an
exact published primitive ID copied from the selected references. Human labels
and unpublished pseudo IDs do not satisfy the Blueprint contract.

Before replying, write the final JSON to a temporary file and run:

```bash
node "$CODEX_HOME/skills/motion-lexicon/scripts/validate-motion-blueprint.mjs" /tmp/blueprint.json
```

Fix every validation failure and rerun until the command exits `0`. Copy the
fenced JSON byte-for-byte from that validated file and report the command and
exit code. An unvalidated or rewritten-after-validation Blueprint is
incomplete.

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
Route a request containing several page regions through Build Page.

An explicit implementation request requires runnable code in the requested
framework or format. A Blueprint, pseudo-code sample, or prose plan alone is
incomplete. When the request provides a writable project or fixture, install
the implementation in that project, run its compile or build command to exit
`0`, and report the command and result.

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

For an async race, require a monotonic request or intent version. Only the
response matching the current intent may commit visible state; discard stale
responses, cancel or settle their obsolete animations, and announce only the
current state through ARIA status.

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
three-scene proof for a primitive candidate. Replace every explicit template
placeholder, set `locale` and `level` for the request, complete the Blueprint,
and validate it to exit `0` before sharing the candidate. Record each quality
check with its command, artifact, and observed result. Install the portable
implementation in the provided fixture or host project and run its real build
to exit `0`; prose, pseudo-code, or an unbuilt snippet leaves the candidate
incomplete.

## Output quality

- Favor a concrete product scene over generic decorative motion.
- Keep explanations concise. Put detail into the Blueprint, code, or review
  table when it directly helps implementation.
- Preserve the user's component structure and product language when reviewing
  existing work.
- Keep labels and headings self-explanatory. Add supporting copy only when it
  prevents ambiguity or error.
- Use published Registry source for an exact component and cite its ID in the
  handoff.
- In Recommend, put an exact published ID in every candidate row and repeat the
  chosen ID in the Pick line.
- Use direct, precise language. Describe behavior in terms a designer and an
  engineer can both implement.
- Validate JSON Blueprints with:

  ```bash
  node "$CODEX_HOME/skills/motion-lexicon/scripts/validate-motion-blueprint.mjs" path/to/blueprint.json
  ```
