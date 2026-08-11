# Compose a complete product page

Use this reference for Build Page mode. It turns a product job into a coherent
page, then connects published Motion Lexicon components to the regions where
they genuinely help.

## Contents

1. Inspect the host
2. Define the page job
3. Choose an archetype
4. Plan regions
5. Select Registry components
6. Implement and verify

## Inspect the host

Read the target repository before choosing a framework, component library,
router, icon set, theme mechanism, or animation engine. Reuse installed,
maintained dependencies. Preserve routes, data ownership, loading boundaries,
and existing product language.

Record the inspection before editing and repeat it in the final handoff:

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
```

Every row needs an observed value and a real host path. An assumption or a
generic framework description leaves host inspection incomplete.

For a greenfield page, default to React and TypeScript. Use CSS variables or
the host's Tailwind tokens for the page system. Add an animation dependency
only when a selected published component requires it.

## Define the page job

Write one sentence for each item:

- **User:** who arrives here.
- **Job:** what they need to finish.
- **Primary action:** the one action the layout should make easiest.
- **Primary state change:** the page event that deserves the strongest motion.
- **Evidence of completion:** what the user can see or do when the job is done.

Use real labels and plausible data. Keep helper text only where it explains a
constraint, consequence, or recovery path.

## Choose an archetype

### Product landing

Order: concise promise, live product proof, primary action, focused capability
groups, installation or next step. Use one interactive hero and two or three
supporting proofs. Useful components include `spotlight-bento`,
`media-carousel`, `magnetic-action`, and `kinetic-logo-exchange`.

### Library or workbench

Order: navigation context, search or filters, active workspace, source or
details, related items. Keep the active workflow ahead of the directory on
narrow screens. Useful components include `command-palette`, `filter-grid`,
`tabs`, `segmented-control`, `sortable-table`, and `skeleton-reveal`.

### Dashboard or operations surface

Order: current status, primary action, actionable records, progress or
exceptions, history. Give data changes stable geometry. Useful components
include `activity-feed`, `value-flash`, `task-steps`, `toast-stack`,
`upload-queue`, and `integration-map`.

### Form or settings surface

Order: one clear section title, grouped fields, consequences near risky
choices, sticky or stable save action, inline result. Useful components include
`floating-label`, `inline-validation`, `password-strength`, `tag-input`,
`loading-button`, `hold-to-confirm`, and `theme-reveal`.

### Media or visual surface

Order: active subject, compact navigation, contextual controls, details and
fallback. Useful components include `media-carousel`, `image-lightbox`,
`cursor-lens`, `procedural-product-viewer`, `network-globe`, and
`dither-reveal-card`. Heavy WebGL or Three.js components wait for explicit
intent before initializing.

## Page Plan

Use four to seven meaningful regions. Each region has one purpose and one
primary state. A region can use plain semantic UI when no published component
improves it. Output this plan before the first file edit. General intent prose
does not replace the table or the Registry lines.

```md
## Page Plan

Job: …
Archetype: …
Primary action: …
Primary state: idle → pending → success/error

| Region | Product purpose | Published component | State or motion |
| --- | --- | --- | --- |
| Header | orient and expose the primary action | `none` | sticky on desktop, compact on mobile |
| Workspace | complete the user's current task | `component-id` | idle → pending → success/error |

Registry:
- `component-id` — https://motion-lexicon.pages.dev/r/component-id.json —
  `target/file.tsx` — dependencies: `package` / none

Responsive: 320/390 …; 768 …; 1440 …
Theme: light …; dark …; reduced motion …
```

Use `Registry: none` when every region uses plain semantic UI. The plan is
incomplete when it omits a region, an exact ID-or-none decision, a state
boundary, or the responsive/theme rows.

Choose hierarchy through placement, type, material, and spacing before adding
motion. Keep the page title, primary action, and active work surface visible
without a decorative hero paragraph.

## Select Registry components

Read [components.md](components.md). Choose published components by product
event and public API.

- Fetch the exact JSON from
  `https://motion-lexicon.pages.dev/r/<component-id>.json`; record its target
  file from `files`, dependencies, and runtime before editing code.
- Install the source as delivered. Adapt its public props, data, callbacks, and
  placement; do not rebuild its behavior or CSS from the catalog description.
- All current Registry source files use Tailwind utility classes. Verify the
  host's Tailwind compilation before choosing an ID. Add the supported Tailwind
  setup only when toolchain work is in scope. A host that cannot compile those
  utilities uses `none` for that region and a plain semantic control instead.
- Apply the 44 px target rule to the actual interactive node after installation.
  When the component accepts `className`, pass a host class with `min-width:
  44px` and `min-height: 44px`; a minimum size safely expands a smaller default
  height without changing Registry source. Choose another component or plain
  semantic UI when the source has no such styling hook.
- Use one to three published components on a normal page. Add more only when
  independent product jobs require them.
- Keep the host's plain controls for static navigation, headings, and content.
- Use foundations to tune a component. Do not reconstruct a published
  component from primitive names.
- Mark an unmatched pattern as a candidate; keep it out of the published list.

## Implement and verify

Build the complete route with production state ownership. Use the component's
source as delivered by the Registry and adapt labels, data, and callbacks.

Verify:

1. Primary action and completion result work with keyboard, touch, and pointer.
2. Focus enters overlays and returns to a valid control.
3. Loading, empty, success, failure, retry, cancellation, and dynamic list
   changes remain coherent where they apply.
4. Reduced motion preserves the same information and action path.
5. Light and dark themes preserve hierarchy and readable contrast.
6. 320, 390, 768, and 1440 px layouts keep every region inside the viewport.
7. Interactive targets are at least 44 px on the rendered interactive node,
   including installed Registry components.
8. The console has no runtime, hydration, or accessibility errors.
9. Heavy engines initialize from intent, pause offscreen, and release resources.
10. The final handoff names installed component IDs, files changed, commands
    run, and observable results. It repeats the complete Host inspection and
    Page Plan tables so their evidence remains visible after intermediate
    messages collapse.

Run the host's lint, typecheck, unit, and build checks when they exist. Page
acceptance also requires a running local app or production preview plus actual
browser checks. A repository can omit Playwright and still be verified with an
available browser automation tool against that preview. Exercise the primary
action, inspect 320, 390, 768, and 1440 px layouts, test both themes and reduced
motion, follow the keyboard focus path, check document overflow, and record
console errors. At each required viewport, enumerate every visible `button`,
link, input, select, textarea, and custom interactive node. Record the minimum
rendered width and height plus an `offenders` list for every node below 44 px in
either dimension. Fix every offender and rerun all four viewport audits. The
final Acceptance table uses one row per viewport with its document width,
minimum target dimensions, and offender count. If the environment truly
exposes no browser-capable tool, mark acceptance incomplete and state the exact
missing capability; do not replace observed evidence with a manual checklist.
