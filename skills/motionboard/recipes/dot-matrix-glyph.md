# Dot-Matrix Glyph

A graphic is quantized onto a circular dot-matrix display, and every frame of its rotation or change snaps to the dot grid.

- Position in a launch film: Features
- Slug: dot-matrix-glyph
- Preview video: https://media.motionboard.app/dot-matrix-glyph.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/dot-matrix-glyph/
- Film length: 11s, 1920x1080
- Original reference: Nothing Phone (3) (YouTube, 0:03) https://www.youtube.com/watch?v=MHGQRnvE9GQ&t=3s
- Original reference: Nothing Phone (3) (YouTube, 0:15) https://www.youtube.com/watch?v=MHGQRnvE9GQ&t=15s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/dot-matrix-glyph/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/dot-matrix-glyph ./dot-matrix-glyph`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The graphic becomes cells of round dots rotating on a screen
- A pattern rotating on a pixel dot-matrix screen
- The rotation slows down more and more until it stops

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s, eight hard-cut shots. Wide rotation shots at 0-1.4s (rotation 0.8s), 1.85-3.55s (1.15s), 4.0-6.0s (1.6s), 6.4-8.8s (2.0s); close-ups of the crown 1.4-1.85s, 3.55-4.0s and 6.0-6.4s; each rotation covers 120 degrees and leaves the glyph still for 0.6, 0.55, 0.4 and 0.4s; captions at 2.0s and 4.12s; end card from 8.8s, tagline at 8.9s |
| Easing | Rotation `cubic-bezier(0.16,1,0.3,1)` (strong ease-out); crown click uses the same curve over 0.35s; dots turn on and off with a hard cut, no glow and no trail; camera pushes are linear inside each shot; captions `expo.out` 0.8s; scene fade-in 0.5s `power2.out` |
| Camera | Perspective camera (20 degree field) with a hard cut per shot: wide shots at zoom 1.0 (device body), 1.6, 1.95 and 1.7, each pushing linearly 2-16% inside the shot; close-ups of the crown and rim at zoom 4.2, 4.8 and 3.3 with depth of field; end card locked at zoom 1.98-2.0 on the screen |
| Subject | A 25x25 grid cropped to a circle of radius 12.3 cells (481 dots), dot diameter 60% of pitch. A vector glyph (arrow, hourglass, bell with badge, letter M) is rotated by angle each frame and every cell tests whether its rotated position falls inside the shape. Rotation runs from the final angle minus 120 degrees to 30 degrees for the arrow and 0 degrees for the others |
| Sync | Rotation duration lengthens shot by shot (0.8, 1.15, 1.6, 2.0s) and alternates with product close-ups; the crown clicks 30 degrees at 1.5s and 6.1s as the cut lands. On the end card the dots spell Mote letter by letter at 8.8, 8.9, 9.0 and 9.1s while the lights fade out over 0.65s |
| Style | Black circular dot screen behind glass: lit dots white, unlit dots dim `#1a1713`, set in a cream plastic body (`#e3ddd0`) with a knurled aluminium crown on a dark wood table; warm spot lighting (`#ffd0a0`), warm bokeh, ACES tone mapping, 0.4 vignette, light grain. Captions Inter 500 84px and a tagline Inter 400 28px |

## Why it works

Rotation is quantized onto a low-resolution dot matrix, so the motion jumps cell by cell and the edges are jagged, matching how real hardware displays work. Rotation speed drops from shot to shot, so the slowing down itself builds suspense, and alternating dot-matrix shots with expression shots deepens the wait.

## Prompt

> Build a graphic rotation called Dot-Matrix Glyph, 11s, on a physical device shot with a perspective camera (20 degree field) and hard cuts. A black circular screen behind glass holds a 25x25 grid cropped to a circle of radius 12.3 cells (481 dots), dot diameter 60% of the pitch, lit dots white and unlit dots dim #1a1713, set in a cream plastic body (#e3ddd0) with a knurled aluminium crown on a dark wood table, lit by warm spots with bokeh, ACES tone mapping and a 0.4 vignette. Rotate vector glyphs (arrow, hourglass, bell with badge, letter M) by angle every frame and test each cell against the rotated shape: inside lights, outside stays dim, with hard on/off cuts, no glow and jagged edges left visible. Each rotation travels 120 degrees with cubic-bezier(0.16,1,0.3,1) and ends at 30 degrees for the arrow and 0 degrees for the others. Use four wide shots (0-1.4s, 1.85-3.55s, 4.0-6.0s, 6.4-8.8s) with rotation durations of 0.8s, 1.15s, 1.6s and 2.0s, each pushing slowly and linearly, and cut to 0.4-0.45s close-ups of the crown (zoom 3.3-4.8 with depth of field) in between, with the crown clicking 30 degrees at 1.5s and 6.1s. At 8.8s fade the lights out over 0.65s and let the dots spell Mote letter by letter at 8.8, 8.9, 9.0 and 9.1s in a 5x7 pixel font, with captions and a tagline rising with expo.out.

## Often confused with

- [Line Boil](./line-boil.md): Line Boil is a low frame rate that swaps in a new trace each frame; Dot-Matrix Glyph quantizes spatial resolution to a grid of points.
- [Iris Window Montage](./iris-window-montage.md): The window in Iris Window Montage cuts quickly between real images; the round screen in Dot-Matrix Glyph holds a single discretized graphic.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/dot-matrix-glyph/hyperframes.json (318 B)
- ../source/dot-matrix-glyph/index.html (32.3 KB)
- ../source/dot-matrix-glyph/package.json (305 B)

Read `../source/dot-matrix-glyph/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
