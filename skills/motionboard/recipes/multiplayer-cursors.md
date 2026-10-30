# Multiplayer Cursors

Enlarged two-color named cursors move across a canvas, leave comments, and drag items to reorder.

- Position in a launch film: Features
- Slug: multiplayer-cursors
- Preview video: https://media.motionboard.app/multiplayer-cursors.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/multiplayer-cursors/
- Film length: 10.5s, 1920x1080
- Original reference: Figma Slides (YouTube, 0:01) https://www.youtube.com/watch?v=p-B--SGq_ZQ&t=1s
- Original reference: Figma Slides (YouTube, 1:20) https://www.youtube.com/watch?v=p-B--SGq_ZQ&t=80s
- Original reference: Framer (YouTube, 0:00) https://www.youtube.com/watch?v=6xJWQRVl9nw

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/multiplayer-cursors/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/multiplayer-cursors ./multiplayer-cursors`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Several people working on the canvas at once
- Named colored cursors moving all over
- Collaborative comments and drag-to-reorder

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10.5s; avatars pop at 0.35, 0.8, 1.2, 1.53, 1.8s (0.25s each, spacing 0.45→0.27s); Liam box-select 1.9–2.65s; Maya's bubble 2.5s (0.3s), typing 2.65–4.05s at 15 characters per second, Enter 4.2s; push-in 4.3–4.7s (0.4s, 12 frames); press 4.8s, drag 4.95–5.75s (0.8s), reflow shift 0.4s each, drop 5.85s; pull-back 6.15s (0.6s); Present click 7.55s; lockup 8.75s |
| Easing | Push-in `expo.out` with a 3px blur pulse; drag `power2.inOut` with a 12px arc in y; avatars `back.out(2.2)`; bubble `back.out(1.7)`; reflow `expo.out` 0.4s; press `scale 0.86` over 0.08s, release `back.out(1.7)` 0.22s |
| Camera | Canvas content scrolls up 140px over 4.3s `linear` (about 3% of frame height per second) while the whole scene drifts `scale` 1→1.04 over 8.7s; at 4.3s push in 1.4x onto the slide, cursors counter-scale by 1/1.4 to keep their on-screen size; pull back at 6.15s |
| Subject | Cursors 46×56px (about 5% of frame height), one black `#141414` (Liam Ortiz) and one magenta `#d81283` (Maya Chen), each with a name tag; Liam box-selects three slides, Maya rests on a green slide and a same-color comment bubble types "Can we lead with this?", then she drags slide 12 two columns left to position 10 while slides 11 and 10 shift one column right; the slide numbers and left panel list update on the drop frame; Maya then clicks Present and the slide opens full screen |
| Sync | Enter changes the bubble header from "typing…" to "Just now" on one frame; push-in follows Enter by 0.1s; the drag starts 0.5s after the push-in begins; on the drop frame (5.85s) slide numbers and the panel order change together |
| Style | White window on a `#fafafa` canvas with a 33-slide pitch deck in neon green, yellow, orange, and dark green slides; cursors with a white outline and a soft shadow |

## Why it works

Enlarged cursors become characters in the frame, and the interaction between two cursors stages collaboration. The comment bubble matches its cursor's color, so it maps to a person at a glance. The thumbnail grid provides density, and after the push-in only a small part of it is visible.

## Prompt

> Demonstrate collaboration with a shot called Multiplayer Cursors. A white editor window holds a 33-slide thumbnail grid that scrolls up 140px over 4.3s with linear ease, and avatars pop into the top bar one by one (back.out(2.2), spacing shrinking from 0.45s to 0.27s). Two named cursors, 46×56px (about 5% of frame height), black for Liam and magenta for Maya, move across it: Liam box-selects three slides from 1.9s, Maya rests beside a green slide from 2.45s and a same-color comment bubble pops up (back.out(1.7)) and types at 15 characters per second. After Enter at 4.2s the view pushes in 1.4x over 0.4s with expo.out while the cursors counter-scale to keep their size. Maya presses at 4.8s and drags the slide two columns left to position 10 over 0.8s with power2.inOut, the other two thumbnails shifting a column with expo.out in 0.4s, and the numbers update on the drop frame. Pull back at 6.15s, click Present at 7.55s so the slide opens full screen, and land your wordmark at 8.75s with both cursors meeting on it. Cursor paths include pauses.

## Often confused with

- [Control-Driven Change](./control-driven-change.md): Control-Driven Change has a single control change the result; Multiplayer Cursors has several cursors acting in parallel on a canvas.
- [Focus Hop](./focus-hop.md): In Focus Hop the cursor only guides a highlight block; in Multiplayer Cursors the cursors are characters and carry out comments and drags.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/multiplayer-cursors/hyperframes.json (318 B)
- ../source/multiplayer-cursors/index.html (59.5 KB)
- ../source/multiplayer-cursors/package.json (308 B)

Read `../source/multiplayer-cursors/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
