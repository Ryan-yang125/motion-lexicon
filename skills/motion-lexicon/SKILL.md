---
name: motion-lexicon
description: Search, compare, tune, review, and export Motion Lexicon UI motion recipes through the versioned CLI. Use for choosing an interface animation pattern, resolving animation vocabulary or aliases, obtaining canonical preview and data URLs, applying reduced-motion guidance, or producing portable Prompt, HTML, CSS, and JavaScript output.
---

# Motion Lexicon

Use the fixed Motion Lexicon v0.1.0 CLI as the catalog source of truth. Resolve every requested term through the CLI before recommending a recipe or producing implementation output.

## Workflow

1. Read [references/cli.md](references/cli.md) before running a command.
2. Choose `zh` or `en` from the user's language. Preserve an explicitly requested locale.
3. Search the catalog when the user provides a goal, visual description, component, or unfamiliar term.
4. Inspect the selected canonical recipe with `show`. Confirm its parameters, reduced-motion strategy, review notes, and live path.
5. Run `export` only when the user requests Prompt, HTML, CSS, JavaScript, a bundle, or files.
6. Return the canonical recipe ID, rationale, live preview URL, chosen parameter values, reduced-motion treatment, and requested output.

## Required command base

Run every CLI operation through this pinned command:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.1.0
```

Prefer `--format json` for search and inspection so canonical IDs and parameter constraints remain machine-readable. Treat an exit code of `2` as a command or input error and report the stderr message directly.

## Selection rules

- Use `search` for intent discovery and `show` for exact validation.
- Resolve aliases to the CLI-provided canonical ID. Keep the user's original term in the explanation when it clarifies the mapping.
- Keep default parameter values unless the user's context gives a concrete reason to tune them.
- Include reduced-motion guidance for every implementation or review request.
- Link to the localized live path returned by the CLI.
- Generate output with `export`; never reconstruct catalog output from memory.
