---
name: motion-lexicon
description: Find, inspect, and export Motion Lexicon real product Motion Packs and UI motion recipes through the versioned CLI. Use when a user needs a polished product interaction such as save confirmation, archive undo, filter results, selection, publishing, progress, or sharing; when they describe a vague motion feeling; when they need a canonical preview URL; or when they request portable Prompt, HTML, CSS, JavaScript, or reduced-motion guidance.
---

# Motion Lexicon

Use the fixed Motion Lexicon v1.0.0 CLI as the source of truth. Resolve every
request through the CLI before recommending a Pack, recipe, or implementation.

## Workflow

1. Read [references/cli.md](references/cli.md) before running a command.
2. Choose `zh` or `en` from the user’s language. Preserve an explicitly requested locale.
3. When the request describes a complete product moment or state transition,
   run `packs` to discover the V1 collection and `pack <id>` to inspect the best
   match. Examples include saving, publishing, copying a link, card choice,
   undo, filter feedback, validation, progress, invites, and media scrubbing.
4. Return the Pack’s CLI-provided name, `path`, `previewUrl`, trigger, outcome,
   reduced-motion treatment, and requested source format. Use `pack <id>
   --format bundle` for a complete portable implementation.
5. Run `recommend` when the user provides a vague feeling, visual description,
   or atomic interface behavior. Keep each CLI-provided rank, reason,
   distinction, and preset.
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
10. Return the original intent, the chosen Pack or recipe ID, rationale, live
    preview URL, chosen values, reduced-motion treatment, and requested output.

## Required command base

Run every CLI operation through this pinned command:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.0.0
```

Prefer `--format json` for discovery and inspection so IDs, state guidance, URLs,
and source fields remain machine-readable. Treat exit code `2` as a command or
input error and report the stderr message directly.

## Selection rules

- Start with `packs` when a request describes a recognisable product moment.
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
