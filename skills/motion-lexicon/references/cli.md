# Motion Lexicon CLI v0.2.0

Use this fixed command prefix for every operation:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0
```

The CLI writes normal results to stdout. Invalid commands, IDs, parameters, or formats write an actionable message to stderr and exit with status `2`.

## Recommend from vague intent

Turn a natural-language feeling or interface goal into three ranked candidates:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 recommend "卡片弹出来要有重量，最后收得住" --locale zh --format json
```

`recommend` accepts `--limit 1..3` and defaults to three candidates. Its JSON document uses `schemaVersion: 1` and includes:

- `query`, `locale`, `confidence`, `matchedTerms`, and an explainable `reason`.
- `groupId` and `groupName` for the matched recommendation group.
- `finderPath`, `finderUrl`, `comparePath`, and `compareUrl` for the static web Finder. The `compare*` names remain compatibility fields for the ordered candidate state; the page uses one primary preview, three static choices, and current-candidate replay.
- `items[]` in ranked order with `rank`, `variantId`, `canonicalId`, `reason`, optional `distinction`, `confidence`, `matchedTerms`, presets, resolved values, and preview links.

Keep `items[]` in CLI order. Use `variantId` with `show` and `export` so alias presets remain active; use `canonicalId` to identify the implementation workspace. Return `compareUrl` unchanged and describe it to users as the Finder URL.

## Discover exact recipes

`search` remains available for exact motion terms, aliases, categories, surfaces, and broader catalog lookup.

List the catalog:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 catalog --locale en --format json
```

Filter by category or surface:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 catalog --locale en --format json --category entrances --surface component
```

Search from natural-language intent or a motion term:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 search "shared element" --locale en --format json --limit 5
```

Search JSON uses `schemaVersion: 1` and provides `items[].id`. Use those IDs for inspection.

## Inspect one recipe

Resolve a canonical ID or alias:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 show slide-in --locale en --format json
```

Apply validated parameter values with repeatable flags:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 show slide-in --locale en --format json --param duration=260 --param direction=left
```

Rely on `id`, `canonicalId`, `path`, `params`, `values`, `reducedMotion`, and `reviewNotes`. Alias results may also provide `requestedId`, `alias`, and `presetQuery`.

## Export implementation output

Export one format to stdout:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 export slide-in --locale en --format css --param duration=260
```

Supported formats are `prompt`, `html`, `css`, `js`, `bundle`, `json`, and `files`.
The `bundle` format contains the Prompt, HTML, CSS, and any required JavaScript in one document. Run the individual `html`, `css`, or `js` formats when the user asks for only those sections.

Write a portable file set only when the user requests files and has authorized workspace edits:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 export slide-in --locale en --format files --out ./motion-lexicon-export
```

Use `--force` only with explicit overwrite permission.

## Inspect schemas

```bash
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 schema recipe
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 schema catalog
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 schema search
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 schema recommend
npx -y github:Ryan-yang125/motion-lexicon#v0.2.0 schema export
```

Text and Markdown formats are intended for direct reading. JSON is the stable agent integration format.
