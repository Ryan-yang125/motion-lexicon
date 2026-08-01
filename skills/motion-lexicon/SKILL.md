---
name: motion-lexicon
description: Find, inspect, and export Motion Lexicon Product Moments (Motion Packs) and Motion Primitives through the versioned CLI. Use when a user needs a polished product interaction such as save confirmation, archive undo, filter results, selection, publishing, progress, or sharing; when they need an exact entrance, easing, transition, sequence, or motion term; when they describe a vague motion feeling; when they need a canonical preview URL; or when they request portable Prompt, HTML, CSS, JavaScript, or reduced-motion guidance.
---

# Motion Lexicon

Use the fixed Motion Lexicon v1.2.0 CLI as the source of truth. Motion Lexicon
has two equal collections: **Product Moments · Motion Packs** for complete
product interactions, and **Motion Primitives** for precise interface behavior.
Resolve every request through the CLI before recommending a Pack, primitive, or
implementation.

## Workflow

1. Read [references/cli.md](references/cli.md) before running a command.
2. Choose `zh` or `en` from the user’s language. Preserve an explicitly requested locale.
3. When the request describes a complete product moment or state transition,
   run `packs` to discover the Product Moments collection and `pack <id>` to
   inspect the best match. Examples include saving, publishing, copying a link,
   card choice, undo, filter feedback, validation, progress, invites, and media
   scrubbing, uploads, sync recovery, deletion, assignments, permissions,
   search, kanban, carts, comments, approvals, checkout, and scheduled publishing.
4. Return the Pack’s CLI-provided name, `path`, `previewUrl`, trigger, outcome,
   reduced-motion treatment, and requested source format. Use `pack <id>
   --format bundle` for a complete portable implementation.
5. Run `recommend` when the user provides a vague feeling, visual description,
   or Motion Primitive behavior. Keep each CLI-provided rank, reason,
   distinction, and preset. When the intent also names a recognisable product
   state, inspect relevant Packs alongside the primitive recommendation.
6. Return the CLI-provided `compareUrl` unchanged. It opens Finder with one
   primary preview, three ranked static choices, and replay for the current
   candidate.
7. Run `search` for a known term, canonical ID, alias, category filter, or
   broader exact catalog discovery.
8. Inspect the chosen recipe with `show <variantId>`. Confirm its canonical
   recipe, resolved preset, parameters, reduced-motion strategy, review notes,
   and live path.
9. Run `export` for an existing recipe when the user requests Prompt, HTML, CSS,
   JavaScript, a bundle, or files.
10. Return the original intent, the chosen Product Moment or Motion Primitive,
    rationale, live preview URL, chosen values, reduced-motion treatment, and
    requested output. Include a related route from the other collection when it
    sharpens the handoff.

## Required command base

Run every CLI operation through this pinned command:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0
```

Prefer `--format json` for discovery and inspection so IDs, state guidance, URLs,
and source fields remain machine-readable. Treat exit code `2` as a command or
input error and report the stderr message directly.

## Selection rules

- Start with `packs` when a request describes a recognisable product moment.
- Start with `recommend`, `search`, or `list` when a request describes a
  Motion Primitive, its parameter, a term, or an uncertain motion feeling.
- Use `pack <id>` to obtain the complete Pack contract and source. Its default
  text output is concise; use `--format json`, `prompt`, `html`, `css`, `js`, or
  `bundle` for a specific handoff.
- Use `recommend` for fuzzy motion discovery, `search` for exact vocabulary
  discovery, and `show` for recipe validation.
- Preserve CLI candidate order. Treat `variantId` as the user-facing motion
  choice and `canonicalId` as its implementation workspace. Pass `variantId` to
  `show` and `export` so alias presets stay active.
- Use the CLI-provided `reason`, `distinction`, `matchedTerms`, and confidence
  for Finder results.
- Keep default parameter values unless the user gives a concrete reason to tune them.
- Include reduced-motion guidance for every implementation or review request.
- Link to the localized live path returned by the CLI.
- Generate existing recipe output with `export`; generate Pack output with
  `pack <id> --format <format>`.
