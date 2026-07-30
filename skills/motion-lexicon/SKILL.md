---
name: motion-lexicon
description: Recommend, compare, search, tune, review, and export Motion Lexicon UI motion recipes through the versioned CLI. Use when a user describes a vague motion feeling or interface goal, asks which animation pattern fits, wants to distinguish similar motions, names a motion term or alias, needs a canonical preview or compare URL, requests reduced-motion guidance, or wants portable Prompt, HTML, CSS, and JavaScript output.
---

# Motion Lexicon

Use the fixed Motion Lexicon v0.2.0 CLI as the source of truth. Resolve every request through the CLI before recommending a recipe or producing implementation output.

## Workflow

1. Read [references/cli.md](references/cli.md) before running a command.
2. Choose `zh` or `en` from the user's language. Preserve an explicitly requested locale.
3. Run `recommend` when the user provides a vague goal, feeling, visual description, or component behavior. Use the default Top 3 and retain each CLI-provided rank, reason, distinction, and preset.
4. Return the CLI-provided `compareUrl` with the three candidates. Explain the meaningful choice in the user's language.
5. Run `search` when the user provides a known term, canonical ID, alias, category filter, or wants broader exact catalog discovery. This preserves the v0.1 exact-search workflow.
6. Inspect the chosen variant with `show <variantId>`. Confirm its canonical recipe, resolved preset, parameters, reduced-motion strategy, review notes, and live path.
7. Run `export` when the user requests Prompt, HTML, CSS, JavaScript, a bundle, or files.
8. Return the original intent, chosen variant and canonical recipe IDs, rationale, live preview URL, compare URL when applicable, chosen parameter values, reduced-motion treatment, and requested output.

## Required command base

Run every CLI operation through this pinned command:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0
```

Prefer `--format json` for recommendation, search, and inspection so candidate reasons, canonical IDs, presets, and parameter constraints remain machine-readable. Treat an exit code of `2` as a command or input error and report the stderr message directly.

## Selection rules

- Use `recommend` for fuzzy intent discovery, `search` for exact vocabulary discovery, and `show` for validation.
- Preserve the CLI candidate order. Treat candidate `variantId` as the user-facing motion choice and `canonicalId` as its implementation workspace. Pass `variantId` to `show` and `export` so alias presets stay intact.
- Use the CLI-provided `reason`, `distinction`, `matchedTerms`, and `confidence`; keep uncertainty visible.
- Return `compareUrl` unchanged so the user receives the same Top 3 in the web Finder.
- Resolve aliases to the CLI-provided canonical ID. Keep the user's original term in the explanation when it clarifies the mapping.
- Keep default parameter values unless the user's context gives a concrete reason to tune them.
- Include reduced-motion guidance for every implementation or review request.
- Link to the localized live path returned by the CLI.
- Generate output with `export`; always use catalog output from the current pinned CLI.
