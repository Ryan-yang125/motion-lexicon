# Focus Hop

A highlight block or focus frame hops one cell at a time with the cursor, and the frame can take the color of the icon inside it.

- Position in a launch film: Features
- Slug: focus-hop
- Preview video: https://media.motionboard.app/focus-hop.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/focus-hop/
- Film length: 10.8s, 1920x1080
- Original reference: Arc Boosts (YouTube, 0:13) https://www.youtube.com/watch?v=N0jMmiCS8oQ&t=13s
- Original reference: Raycast (YouTube, 0:14) https://www.youtube.com/watch?v=Mi173xGb0ZA&t=14s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/focus-hop/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/focus-hop ./focus-hop`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A highlight block hops down one cell at a time
- The selection frame changes color with the icon
- Wherever the cursor goes, it lights up

## Spec

| Item | Value |
| --- | --- |
| Timing | Window enters 0–0.7s; shelf act: camera push 0.5–1.3s, frame fades in 1.1s, five slides at 1.4, 1.9, 2.4, 2.9, 3.4s (0.25s slide, 8 frames, then 0.25s hold), frame hides 3.95s; grid act: camera drop 3.8–4.6s, cursor arrives 4.2s, highlight hops from 4.7s with 0.22–0.34s dwell (7–10 frames) across 11 cells to 7.34s, click 7.84s, pull-back 8.09–8.89s (0.8s); end card 8.5s, frame hops at 9.05, 9.28, 9.5s; film 10.8s |
| Easing | Grid highlight hops are hard jumps (`tl.set`); shelf slide `expo.out` 0.25s with the frame color tweening `power1.inOut`; camera moves `expo.out` 0.8s; cursor moves `power2.inOut` 0.14–0.2s; click ripple 0.45s, frame `scale 0.975` then `back.out(2.4)` |
| Camera | Cropped close-up at 2.1x on the shelf (drifting to 2.2x `linear` over 2.6s); drops to 2.0x on the grid, follows the cursor row horizontally at 40% of the cell offset, and sinks about 300px over 2.6s; pulls back to the full window at 8.09s |
| Subject | Dark app-store window; shelf of 10 app cards (156×162px, 172px pitch) slides left one card per step under a fixed focus frame on the third slot; grid of 12 extension cells (307×134px, 4 columns) where the highlight hops along a snake path (0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10) with the cursor following ±8px off center; the last cell's Install chip flips to Installed on the click frame |
| Sync | The frame's outline (2px) and fill (`rgba(r,g,b,0.15)`, plus a `0 0 36px` glow on the grid) take the main color of the icon inside it, tweening through the shelf slide and jumping with each grid hop; the cursor crosses a cell boundary at the midpoint of its move |
| Style | Near-black `#08080a` stage, `#121215` sidebar, gradient app icons; focus frame color follows the icon, 15px corner radius; end card with a four-tile mark and a 76px wordmark |

## Why it works

The highlight block is the strongest color in the frame and leads the eye cell by cell. The focus frame takes its color from what is inside, so the selection state and the content share one palette. The one-cell-per-stop rhythm turns each pause into a choice.

## Prompt

> Show a selection process with a shot called Focus Hop. Open a dark app-store window and push into a horizontal shelf of app cards at 2.1x (expo.out, 0.8s), drifting to 2.2x. A focus frame (2px outline, 15% fill) stays fixed on the third slot and takes the main color of the icon inside it; every 0.5s the cards slide left one slot over 0.25s with expo.out while the frame color tweens to the next icon, five times. Then drop the camera to a 2.0x grid of extension cells, where a highlight hard-hops cell to cell along a snake path with no transition, dwelling 0.22 to 0.34s per cell and taking each icon's color, while the cursor follows with small offsets and the camera follows the row and sinks about 300px. Click the last cell's Install chip: the chip flips to Installed on the click frame, the frame squishes to 0.975 and settles with back.out(2.4). Pull back over 0.8s and close on a four-tile mark where the same frame hops across the tiles.

## Often confused with

- [Multiplayer Cursors](./multiplayer-cursors.md): In Multiplayer Cursors the cursors are characters and perform actions; in Focus Hop the cursor only guides the highlight, and the attention is on the highlight block and focus frame.
- [Auto Zoom / Zoom-to-Cursor](./auto-zoom.md): Auto Zoom moves the camera; in Focus Hop the camera is nearly still and the highlight block moves.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/focus-hop/hyperframes.json (318 B)
- ../source/focus-hop/index.html (37.4 KB)
- ../source/focus-hop/package.json (298 B)

Read `../source/focus-hop/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
