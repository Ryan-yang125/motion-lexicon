# Forward-test evidence

Recorded evidence lives at
`forward-test-2026-08-11/<eval-id>/r<repetition>/`. Each run keeps these raw,
repository-relative artifacts:

- `prompt.txt`, `events.jsonl`, `final.md`, `isolation-manifest.json`, and
  `initial-fixture-manifest.json`.
- Build Page: `source/`, `dist/`, `build.json`, and
  `browser-acceptance.json`. Omit `node_modules`, caches, and mutable run homes.
- Compose: `blueprint.json` copied byte-for-byte from the final fenced JSON and
  `validator.json` with the command, exit code, stdout, stderr, and Blueprint
  SHA-256.
- Implement: `source/`, `dist/`, and `build.json` from a successful build of
  the bound fixture after the requested implementation is installed.
- Contribute: the finished `candidate.md`, its exact `blueprint.json`,
  `validator.json`, `placeholder-scan.json` with `placeholderCount: 0`, and the
  successful portable implementation in `source/`, `dist/`, and `build.json`.

The evidence root also keeps `scorer-prompt.md`. The result identifies the
independent scorer and hashes that exact prompt.

Every run's `artifactFileSha256` object contains exactly one key for every file
in `artifactPaths`; directories use the dedicated source/dist tree hashes. This
includes any extra source, JSON, or text file cited by an assertion.

Every scored assertion cites one artifact and either a real text line range
(`lines:12-18`) or an existing JSON pointer (`json:/viewports/0/offenders`).
The checker rejects missing paths, hash mismatches, invalid locators, fixture
drift, invalid Blueprints, unsuccessful builds, browser offenders, and runtime
errors.

`isolation-manifest.json` repeats `evalId`, `repetition`, prompt and frozen Skill
hashes, unique absolute `home`, `codexHome`, and `workdir` paths, the installed
`skillPath`, `evalsPresent: false`, and the exact nested `isolation` object from
the result. The nested object points to this run's
`initial-fixture-manifest.json`. A Build Page initial manifest is a byte copy of
the committed fixture manifest; a non-page manifest uses `id: "empty"`, zero
files, and the SHA-256 of an empty tree.

For Contribute, `placeholder-scan.json` records the candidate-template SHA-256,
the sorted unique `<...>` placeholder strings extracted from that exact
template, the recomputed `remaining` list from `candidate.md`, its count, the
candidate SHA-256, and the scan command. A valid result has an empty remaining
list and count zero.

`build.json` contains `command: "npm run build"`, `exitCode: 0`, ISO timestamps,
stdout, stderr, and the preserved source/dist tree hashes. `source/` contains
the project without `node_modules`, `.git`, caches, or `dist`; `dist/` contains
the exact successful build output.

`browser-acceptance.json` contains the automation command, exit code, four
`viewports` records, theme observations, keyboard/focus evidence, reduced
motion, primary state evidence, and runtime counts. Each viewport record uses:

```json
{
  "width": 320,
  "documentWidth": 320,
  "interactiveNodeCount": 2,
  "minimumTargetWidth": 44,
  "minimumTargetHeight": 44,
  "nodes": [
    { "selector": "button[data-primary]", "width": 120, "height": 44 },
    { "selector": "a[href='/']", "width": 44, "height": 44 }
  ],
  "offenders": [],
  "interactions": ["clicked primary action and observed completion"]
}
```

Theme records include `observed`, `activation`, and `result`. Keyboard records
include `observed`, `path`, `focusEntry`, `focusReturn`, and `result`. Reduced
motion includes `observed`, `preference: "reduce"`, and `result`. Primary state
includes `observed`, at least two `states`, and `result`. Runtime records set
`consoleErrors`, `pageErrors`, `requestFailures`, and `hydrationErrors` from the
browser observation.
