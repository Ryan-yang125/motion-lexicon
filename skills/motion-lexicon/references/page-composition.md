# Compose a V6 product page

Use this reference for Build Page mode. Motion Lexicon V6 starts with published
Components, then uses Page Blocks as complete composition references and
Primitives as motion vocabulary.

## Contents

1. Inspect the host
2. Define the page job
3. Choose a scene family and archetype
4. Plan regions
5. Select Registry Components
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

## Define the page job

Write one sentence for each item:

- **User:** who arrives here.
- **Job:** what they need to finish.
- **Primary action:** the one action the layout should make easiest.
- **Primary state change:** the event that deserves the strongest motion.
- **Evidence of completion:** what the user can see or do when the job is done.

Use real labels and plausible data. Keep supporting copy only where it explains
a constraint, consequence, or recovery path.

## Choose a scene family and archetype

### Product Mono

Use for operations, dashboards, forms, settings, developer tools, and onboarding.
Choose compact hierarchy, precise data, clear controls, and stable surfaces.
Useful components include `command-palette`, `animated-combobox`,
`inline-validation`, `animated-chart`, `kanban-board`, and `toast-stack`.

### Editorial Warm

Use for brand stories, media features, portfolios, commerce, and image-led
experiences. Choose meaningful media, material contrast, expressive type, and a
strong static lead. Useful components include `cinematic-hero`,
`focus-gallery`, `coverflow-gallery`, `scroll-story`, and
`kinetic-heading`.

### Spatial Dark

Use for technical product stories, ambient visual systems, and dimensional
product demonstrations. Keep primary controls and text legible over the scene.
Useful components include `product-orbit-hero`, `screenshot-stack`,
`aurora-canvas`, `grid-distortion`, `fluid-glass-surface`, and
`network-globe`.

### Page Block references

Use the ten Blocks as complete product-flow references:

| Product job | Reference Block |
| --- | --- |
| Agent execution and approval | `agent-workspace` |
| Product launch collaboration | `product-landing` |
| Metrics and time-range analysis | `analytics-dashboard` |
| Project delivery | `project-dashboard` |
| Customer conversations | `support-inbox` |
| Creative work showcase | `creative-portfolio` |
| Product discovery and checkout | `commerce-storefront` |
| Developer documentation | `developer-docs` |
| Visual reporting | `media-editorial` |
| First-workspace setup | `onboarding-flow` |

## Page plan

Use four to seven meaningful regions. Each region has one purpose, one primary
state, and an exact published Component ID or a plain semantic UI decision.

```md
## Page Plan

Job: …
Scene: Product Mono / Editorial Warm / Spatial Dark
Archetype: …
Primary action: …
Primary state: idle → pending → success/error

| Region | Product purpose | Published Component | State or motion |
| --- | --- | --- | --- |
| Header | orient and expose the primary action | `none` | compact on mobile |
| Workspace | complete the user's current task | `component-id` | idle → pending → success/error |

Registry:
- `component-id` — https://motion-lexicon.pages.dev/r/component-id.json —
  `target/file.tsx` — dependencies: package / none

Responsive: 320 / 390 / 768 / 1440
Theme: light / dark / reduced motion
```

## Select Registry Components

Read [components.md](components.md) and choose by product job and public API.

- Fetch the exact Registry JSON before editing. Record files, dependencies, and
  runtime cost.
- Install the delivered source and adapt props, data, callbacks, and placement.
- Use one to three Components on a normal page. Add more when independent user
  jobs require them.
- Keep plain semantic UI for static headings, navigation, and content that gains
  no product value from an installed interaction.
- Keep 44px targets on rendered interactive nodes.
- Start heavy Canvas, WebGL, and Three.js work only when visible or explicitly
  requested. Pause offscreen work, react to resize, and release resources.
- Respect the Component's static first frame and reduced-motion path.

## Implement and verify

Build the complete route with production state ownership. Verify:

1. The primary action and completion result work with keyboard, touch, and pointer.
2. Focus enters and returns correctly for overlays.
3. Loading, empty, success, failure, retry, cancellation, and list changes stay
   coherent where applicable.
4. Reduced motion preserves information, focus, controls, and outcome.
5. The selected scene family keeps readable contrast in the host theme.
6. 320, 390, 768, and 1440px layouts keep every region inside the viewport.
7. Interactive targets are at least 44px on the rendered control.
8. The console has no runtime, hydration, or accessibility errors.
9. Heavy engines are viewport-gated, resize-aware, and disposed on unmount.
10. The final handoff lists Component IDs, files, commands, browser evidence,
    Host inspection, and Page Plan.

Run the host's relevant lint, typecheck, unit, and build checks. Browser
acceptance covers the primary action, focus path, reduced motion, required
viewports, document overflow, and console errors.
