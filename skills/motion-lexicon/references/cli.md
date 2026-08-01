# Motion Lexicon CLI v1.2.0

Use this fixed command prefix for every operation:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0
```

The CLI writes normal results to stdout. Invalid commands, IDs, parameters, or
formats write an actionable message to stderr and exit with status `2`.

## Choose a collection

Motion Lexicon exposes two equal collections through the CLI:

- **Product Moments · Motion Packs:** complete product interactions. Use `packs`
  and `pack <id>`.
- **Motion Primitives:** precise motion behavior and vocabulary. Use `list`,
  `search`, `show`, and `export`.

The website Finder crosses both collections. In the CLI, start from the request:
an identifiable product state belongs to Product Moments; an exact behavior,
term, or parameter belongs to Motion Primitives.

## Discover Motion Packs

Product Moments are complete, copy-ready product interactions. List the full set
or narrow it by group:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 packs --locale en --format json
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 packs --locale zh --group feedback
```

The collection contains 28 Packs: seven in each of `feedback`, `choice`,
`change`, and `workflow`. The JSON document includes each Pack’s ID, group,
localized name, scene, timing, and live preview URL.

| Group | Packs |
| --- | --- |
| `feedback` | Save confirmation, Publish release, Share link, Inline validation, Upload complete, Sync recovery, Delete confirmation |
| `choice` | Card selection, Workspace switch, Template choice, Command menu, Assignee picker, Permission change, Search suggestions |
| `change` | Layer insertion, Archive undo, Filter results, Details disclosure, Kanban move, Cart update, Comment reply |
| `workflow` | Notification triage, Progress steps, Member invite, Media scrub, Approval request, Checkout payment, Scheduled publish |

## Inspect and export one Pack

Use `pack <id>` for a real product moment. It supports `text`, `json`, `md`,
`prompt`, `html`, `css`, `js`, and `bundle` formats.

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 pack save-confirmation --locale en --format json
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 pack archive-undo --locale zh --format prompt
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 pack filter-results --locale en --format bundle
```

The JSON document includes `path`, `previewUrl`, product scene, use case,
trigger, outcome, reduced-motion treatment, and portable source. The `bundle`
format contains Prompt, HTML, CSS, and JavaScript in one document.

## Recommend from vague intent

Turn a natural-language feeling or interface goal into three ranked canonical
motion candidates:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 recommend "一张卡片切入进来，然后慢慢停下来" --locale zh --format json
```

`recommend` accepts `--limit 1..3` and defaults to three candidates. Its JSON
document includes the original query, explainable reasons, `groupId`,
`finderUrl`, `compareUrl`, ranked variants, resolved values, and preview links.
Keep `items[]` in CLI order and return `compareUrl` unchanged.

## Discover Motion Primitives

`list` and `search` cover exact motion terms, aliases, categories, surfaces,
and broader Motion Primitive lookup.

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 list --locale en --format json
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 search "shared element" --locale en --format json --limit 5
```

## Inspect one Motion Primitive

Resolve a canonical ID or alias and optionally apply validated parameters:

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 show slide-in --locale en --format json
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 show slide-in --locale en --format json --param duration=260 --param direction=left
```

## Export Motion Primitive implementation output

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 export slide-in --locale en --format css --param duration=260
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 export ripple --format files --out ./ripple-demo
```

`export` supports `prompt`, `html`, `css`, `js`, `bundle`, `json`, and `files`.
Use `--force` only when the user has authorized overwrite permission.

## Inspect schemas

```bash
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 schema pack
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 schema packs
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 schema recipe
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 schema catalog
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 schema search
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 schema recommend
npx -y github:Ryan-yang125/motion-lexicon#v1.2.0 schema export
```

Text and Markdown formats are suited to direct reading. JSON is the stable agent
integration format.
