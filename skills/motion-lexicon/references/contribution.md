# Contributing Motion Lexicon candidates

Use this guide when a user wants to add a reusable primitive, a Product Moment,
or a controlled preset variation.

## Candidate levels

| Level | Purpose | Evidence required |
| --- | --- | --- |
| Preset | A tuned variation of a published behavior | Parent primitive, changed values, reason for the variation |
| Moment candidate | A complete product scene built from existing primitives | State graph, beat plan, portable source, reduced-motion plan |
| Primitive candidate | A reusable behavior that belongs in the shared vocabulary | Three independent product scenes, distinctions from related primitives, portable source |

## Candidate workflow

1. Capture the original product problem in the user's language.
2. Create a Motion Blueprint using
   [assets/motion-blueprint.schema.json](../assets/motion-blueprint.schema.json).
3. Choose existing primitives and moments that form the closest comparison set.
4. Implement a small portable example with meaningful default content.
5. Test standard motion, reduced motion, keyboard behavior, rapid repeat input,
   failure, and recovery.
6. Use [assets/candidate-template.md](../assets/candidate-template.md) to write
   the candidate record.
7. Set `status: candidate` and route the record to maintainer review before it
   becomes public content.

## Primitive evidence across scenes

A primitive candidate earns its place through three distinct scenes. Vary the
product context while preserving the reusable behavior.

| Scene | Product context | Same reusable behavior |
| --- | --- | --- |
| 1 | Example: card to detail | The selected object keeps identity through space |
| 2 | Example: media thumbnail to player | The media object keeps identity through space |
| 3 | Example: cart item to checkout review | The selected item keeps identity through space |

Describe what remains invariant and what adapts per scene. A timing or copy
variation belongs in a preset when the underlying behavior remains the same.

## Quality gate

Every candidate includes:

- A complete state graph with success, failure, and recovery where relevant.
- A primary actor plus focused supporting actors.
- Event-driven motion and a stable resting state.
- Reserved layout for labels, records, and actions that change.
- Arrival, local transition, and leaving values with a reason for each.
- A reduced-motion path that preserves information and recovery actions.
- Semantic markup, keyboard behavior, focus behavior, and status messaging.
- Portable source that separates product state from visual state.
- A clear comparison to existing vocabulary.

Use the root validation command before sharing a JSON Blueprint:

```bash
node "$CODEX_HOME/skills/motion-lexicon/scripts/validate-motion-blueprint.mjs" path/to/blueprint.json
```
