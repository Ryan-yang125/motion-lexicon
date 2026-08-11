# Motion Lexicon page system

Use this reference when building a complete page or when the user requests the
Motion Lexicon visual language. Apply the system to the host product's content
and information architecture.

## Contents

1. Visual register
2. Tokens
3. Material hierarchy
4. Type and icons
5. Layout and spacing
6. Interaction states
7. Responsive and theme behavior
8. Quality constraints

## Visual register

Build a calm product interface with warm neutral surfaces, precise boundaries,
compact radii, platform typography, and motion tied to real state changes.
Product content carries the visual interest. Blue communicates focus,
selection, or an active state. It does not decorate passive icons or cards.

## Tokens

Use these values for a greenfield Motion Lexicon surface. Map them to existing
host tokens when the project already has a coherent system.

| Role | Light | Dark |
| --- | --- | --- |
| Bezel | `#EFEEEA` | `#141312` |
| Panel | `#FFFFFF` | `#1D1D1A` |
| Well | `#F6F6F4` | `#252522` |
| Subtle stage | `#FAFAF8` | `#1A1A17` |
| Primary ink | `#292929` | `#F5F5F2` |
| Secondary ink | `#5D5D5D` | `#B9B9B1` |
| Tertiary ink | `#686862` | `#85857D` |
| Hairline | `rgba(41,41,41,.13)` | `rgba(255,255,255,.16)` |
| Focus / selected | `#4568FF` | `#93B0FF` |
| Success | `#3D7A4E` | `#5BD79C` |
| Error | `#C0442F` | `#F5897F` |

Use one-pixel hairlines where material boundaries need explanation. Keep
shadows compact: a panel lift is approximately `0 1px 2px` plus a hairline;
inner wells use a subtle inset edge. Reserve broad elevation for a temporary
dialog or floating surface.

## Material hierarchy

- **Bezel:** page ground, navigation context, and breathing room.
- **Panel:** the active card, workbench, dialog, or task surface.
- **Well:** inputs, previews, code, tracks, and local state.
- **Subtle stage:** a quiet preview or media region inside a panel.

Every layer needs a product role. Keep nested radii coherent: inner radius plus
surrounding padding aligns with the outer radius. Use an 8 px control radius,
12 px inner surface radius, 16 px card radius, and a pill radius only for a
compact status or single-line action.

## Type and icons

- Use `-apple-system`, BlinkMacSystemFont, `SF Pro Text`, `Helvetica Neue`, and
  Arial before generic sans-serif fallbacks.
- Use 12, 13, 14, and 24 px as the primary type steps with `-0.15px` tracking.
- Use 10.5 or 11 px mono text for IDs, counts, and machine-readable metadata.
- Use regular and medium weights. Reserve stronger weight for one page title or
  primary action.
- Use 14 px navigation icons and 20 px card or feature icons. Prefer simple
  custom SVG or a quiet outline family with approximately 1.35 px strokes.
- Keep icon color neutral until focus, selection, success, or error gives it a
  semantic state.

Write one concise heading or label. Supporting copy earns its space by
preventing misunderstanding, explaining a consequence, or enabling recovery.

## Layout and spacing

Use a 4 px spacing grid. Favor these steps: 4, 8, 12, 16, 24, 32, and 48 px.

- Content width: up to 1180 px.
- Desktop shell: optional 248 px sidebar and 56 px top bar.
- Page padding: 24 px desktop, 16 px tablet and mobile.
- Card grid gap: 14–16 px.
- Closely related control gap: 4–8 px.
- Content group gap: 12–16 px.
- Major section gap: 24–32 px.
- Interactive target: at least 44 by 44 CSS px.

Keep the active workflow before secondary catalogs or explanation on narrow
screens. Collapse multi-column cards to one column before their contents
become compressed. Allow text and data to wrap inside a region; never solve a
page layout with horizontal scrolling.

## Interaction states

Every interactive control includes default, hover where a fine pointer exists,
focus-visible, active, disabled, pending, success, error, and reduced-motion
behavior when those states apply.

- Focus: 2 px focus color with 2 px offset.
- Press: 120–150 ms local translation or scale no smaller than `.98`.
- Arrival: 180–280 ms strong ease-out with 8–10 px maximum travel.
- Leaving: 110–180 ms strong ease-out with a stable destination.
- Direct manipulation: follow the pointer, then use one short interruptible
  settle.
- Continuous progress: use real progress and linear timing.

Reserve geometry for status and label changes. A repeat action, Escape, route
change, failure, or undo settles into a coherent state and preserves focus.

## Responsive and theme behavior

- Design at 320, 390, 768, and 1440 px.
- Keep the document and each preview region free of horizontal overflow.
- Convert fixed desktop navigation into an accessible mobile drawer or compact
  top bar. Preserve the same information hierarchy.
- Keep light and dark semantic roles aligned. Recheck text contrast and
  hairlines in both themes; do not invert decorative colors mechanically.
- Resolve system theme before first paint when the host supports it.
- Respect `prefers-reduced-motion`; preserve state, focus, and feedback while
  removing travel, bounce, repeated motion, and decorative blur.

## Quality constraints

- Use realistic product content and states.
- Keep one primary visual actor per motion beat.
- Avoid gradients, glowing blue icons, oversized display type, floating cards
  without structure, broad blur, and repeated decorative pills.
- Avoid `transition: all`, layout-property keyframes, and unbounded looping.
- Keep page copy concise and bilingual when the product supports Chinese and
  English.
- Verify keyboard, touch, fine-pointer, loading, empty, error, retry, and
  dynamic collection paths that belong to the page.
