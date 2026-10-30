# Domino Wave

A row of cubes flips 90 degrees one after another with a phase offset, while the camera pans along the line.

- Position in a launch film: Transitions
- Slug: domino-wave
- Preview video: https://media.motionboard.app/domino-wave.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/domino-wave/
- Film length: 10.8s, 1920x1080
- Original reference: Linear 发布片 (YouTube, 0:17) https://www.youtube.com/watch?v=lKwyrKUEPS4&t=17s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/domino-wave/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/domino-wave ./domino-wave`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A row of blocks flipping over in turn like a conveyor track
- Blocks flipping one after another to move forward
- Cubes rolling over in sequence like dominoes

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10.8s. White flash fades 0.05-0.75s. Pass 1 from 0.34s (flip 0.6s, 0.10s offset); arrow sweep 0.95-2.45s; pass 2 from 2.5s (turn 0.72s, 0.10s offset); slogan words from 2.78s, 0.1s apart, out at 5.9s; pass 3 from 3.75s (flip 0.6s, 0.07s offset, right to left); camera push 6.2-7.5s; flash 7.42s; end card 7.66s; mark 8.2s, wordmark 8.32s, ring 8.55-9.35s |
| Easing | Flip `cubic-bezier(0.65,0,0.35,1)` on every wave; camera pan linear at 2.03 units per second; arrow `power2.inOut`; push `t^2`; slogan words and wordmark `expo.out`; flash `power2.in` 0.2s then `power2.out` 0.7s; ring stroke `power2.inOut` 0.8s |
| Camera | Perspective camera (24 degree field) tracking along the row at 2.03 world units per second, about 15% of frame width, from (-8, 3.9, 13.5) looking at (0.5, 1.15, 0), with a roll of -0.1 rad (5.7 degrees); lens radius 0.30 for depth of field. From 6.2s it dives toward cube 7 and ends 1.28 units in front of its face as the roll eases to 0 |
| Subject | A row of 36 matte cubes (edge 1.45, spacing 2.2, hovering at 1.32). Pass 1 turns each cube 90 degrees in the view plane with a 0.1 unit hop; pass 2 turns each 180 degrees with a 0.8 unit hop; pass 3 runs right to left, rolls each cube 90 degrees along the row with a 0.22 unit hop and brings the ring face toward the lens. Cube 7 carries an orange hex ring (`#ff5a1f`), the others a dark groove. A white extruded arrow with a trail sweeps above the row |
| Sync | The five slogan words (Every write lands in order.) fade in 0.1s apart from 2.78s, following the left-to-right sweep of pass 2; the arrow passes before it. The push into cube 7 ends in a white flash at 7.42s that resolves into the end card, where the mark and wordmark Basalt appear |
| Style | Light gray studio gradient background; matte cubes `#5a5b60` with 0.07 bevels and a hex groove on one face; top softbox key light with soft shadow, thin rim strips, a floor reflection at 20% opacity and a 0.3 vignette; slogan Inter 500 64px, wordmark Inter 600 120px, letter-spacing -0.045em |

## Why it works

Each cube does only a simple flip, and the phase offset combines into a sense of forward motion. The material is a uniform matte dark gray, with faces told apart only by the top light. The slogan means moving forward, and the direction of the motion matches it.

## Prompt

> Express forward motion with a shot called Domino Wave, 10.8s. Light gray studio gradient background, with a row of 36 matte dark gray cubes (#5a5b60, edge 1.45, spacing 2.2, hovering at 1.32, 0.07 bevels) seen by a 24 degree perspective camera from (-8, 3.9, 13.5) looking at (0.5, 1.15, 0) with a roll of -0.1 rad and a depth-of-field lens radius of 0.30. Pan the camera along the row linearly at 2.03 units per second, about 15% of frame width. Run three waves with cubic-bezier(0.65,0,0.35,1): pass 1 from 0.34s turns each cube 90 degrees in the view plane (0.6s, 0.10s offset, 0.1 unit hop); pass 2 from 2.5s turns each 180 degrees with a 0.8 unit hop (0.72s, 0.10s offset); pass 3 from 3.75s runs right to left and rolls each cube 90 degrees along the row (0.6s, 0.07s offset, 0.22 unit hop). Sweep a white extruded arrow with a 6 unit trail across the top of the row at 0.95-2.45s with power2.inOut, and write the slogan along the row, rotated -11 degrees, word by word 0.1s apart from 2.78s with expo.out 0.7s and an 8px blur, fading out at 5.9s. From 6.2s dive toward cube 7, which carries an orange hex ring (#ff5a1f), with a t^2 ease, flash white at 7.42s, then show the mark at 8.2s, the wordmark at 8.32s and the ring stroked on over 0.8s from 8.55s, with a 4% push to 10.8s. Top softbox key light with soft shadow and a floor reflection at 20% opacity, no other decoration.

## Often confused with

- [Branching Growth](./branching-growth.md): Branching Growth is node count growing; Domino Wave is a fixed number of objects flipping in turn.
- [Foreground Wipe & Flash](./foreground-wipe-flash.md): Foreground Wipe & Flash is a scene transition; Domino Wave is an action within a scene and ends with a white flash.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/domino-wave/hyperframes.json (318 B)
- ../source/domino-wave/index.html (30.7 KB)
- ../source/domino-wave/package.json (300 B)

Read `../source/domino-wave/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
