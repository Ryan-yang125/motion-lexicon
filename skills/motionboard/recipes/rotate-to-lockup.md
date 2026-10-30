# Rotate to Lockup

An object spins with a long ease-out and stops at the exact angle that forms the logo silhouette or the hero view of the product.

- Position in a launch film: Ending
- Slug: rotate-to-lockup
- Preview video: https://media.motionboard.app/rotate-to-lockup.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/rotate-to-lockup/
- Film length: 10s, 1920x1080
- Original reference: Cursor 1.0 (YouTube, 1:53) https://www.youtube.com/watch?v=s5kX-UHgMLo&t=113s
- Original reference: Nothing Phone (3) (YouTube, 0:25) https://www.youtube.com/watch?v=MHGQRnvE9GQ&t=25s
- Original reference: Linear 发布片 (YouTube, 0:05) https://www.youtube.com/watch?v=lKwyrKUEPS4&t=5s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/rotate-to-lockup/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/rotate-to-lockup ./rotate-to-lockup`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The cube spins and turns into the logo
- It spins and stops at just the right angle
- Fragments fly in and form a ring

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10s. Spin 0.2–2.7s (2.5s, 75 frames): 1.62 turns, about 1.5 of them in the first second; fade-in 0.2–0.42s; still hold 2.7–5.0s (2.3s, 69 frames). Hard cut at 5.0s to the fragment-assembly shot: three slabs fly in from 5.14s, 0.8s each (24 frames), staggered 0.08s; lockup 6.55–7.45s (0.9s, 27 frames); held to 10s |
| Easing | `cubic-bezier(0.16,1,0.3,1)` (expo.out, normalized to end exactly at 1), no overshoot; rotation angle runs 1.62 turns × (1 − eased progress), and a tilt quaternion slerps to identity on the same curve; fly-in and lockup expo.out; fade-in smoothstep |
| Camera | Fixed orthographic camera, object centered; the hexagon silhouette height grows 324px→432px (30%→40% of frame height) on the spin curve. In the second shot the assembled mark is 300px tall, then shrinks to 150px and steps left to make room for the wordmark |
| Subject | A cube cut into three stacked slabs (gap 0.05 of the edge) flips around a tilted view-space axis (0.62, 0.74, 0.26); the end pose is isometric (rotX 35.264°, rotY −45°) with a vertex pointing at the camera so the silhouette is a hexagon matching the logo. The slabs sit staggered along the view diagonal until the final angle lines them up; bevel and face gradient fade out as the stone stops. In the fragment shot the slabs enter from the lower left, right and top, rotating 1.35–1.5 rad and scaling 1.25–1.3x→1x |
| Style | Near-black background `#0b0b0c`, three flat gray tones for three faces (top `#ecebe7`, darkest `#5c5b58`, left in between), no highlights; 180° shutter motion blur by sub-frame accumulation; wordmark Inter 600, 103px, `#ecebe7` |

## Why it works

The last frame of the rotation is the logo, and the motion shows where the flat mark comes from in three dimensions. Rotation speed keeps dropping, so the last 0.8s is a slow approach to the target. The material uses only three gray tones with flat light, so the angle reads clearly.

## Prompt

> Build a logo ending called Rotate to Lockup. Near-black background (#0b0b0c) and a fixed orthographic camera. A cube cut into three stacked slabs (gap 5% of the edge) fades in at the center over 0.2–0.42 seconds and flips around a tilted axis for 1.62 turns; use expo.out (cubic-bezier(0.16,1,0.3,1)) over 2.5 seconds (0.2–2.7s), so about 1.5 turns happen in the first second and the speed drops gradually, while its hexagon silhouette grows from 30% to 40% of frame height (324px to 432px). On the last turn the stone lands in an isometric pose (rotX 35.264°, rotY −45°) with one vertex pointing at the camera, lined up exactly with your logo outline; the slabs stay staggered along the view diagonal until that final angle. Hold still for 2.3 seconds with no overshoot. Use three flat gray tones for the faces (#ecebe7 top, #5c5b58 darkest, left in between), no highlights, with bevel and gradient only while it moves, and 180° shutter motion blur. At 5.0s cut to the second shot: the three slabs fly in from outside the frame starting 5.14s, 0.8 seconds each with expo.out, staggered 0.08 seconds, rotating into place and scaling from 1.3x to 1x to form a 300px mark. At 6.55s the mark shrinks to 150px and steps left over 0.9 seconds (expo.out) while the wordmark is uncovered from behind it (clip edge riding the mark, x −36px→0). Hold to 10s. Build it with Three.js: orthographic camera, custom flat-shaded material, rotation from an angle around a view-space axis plus a slerp from a tilt quaternion.

## Often confused with

- [Converge to Mark](./converge-to-mark.md): Rotate to Lockup turns one object to a target angle; Converge to Mark gathers many elements and compresses them into one icon.
- [Outline to Solid](./outline-to-solid.md): Outline to Solid goes from line to fill; in Rotate to Lockup the material stays the same and only the orientation changes.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/rotate-to-lockup/hyperframes.json (353 B)
- ../source/rotate-to-lockup/index.html (20.9 KB)
- ../source/rotate-to-lockup/package.json (305 B)

Read `../source/rotate-to-lockup/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
