# Foreground Wipe & Flash

A defocused foreground object sweeps across and covers the frame to cut scenes, or a central glow blows out to white before the next scene.

- Position in a launch film: Transitions
- Slug: foreground-wipe-flash
- Preview video: https://media.motionboard.app/foreground-wipe-flash.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/foreground-wipe-flash/
- Film length: 11s, 1920x1080
- Original reference: Linear 发布片 (YouTube, 0:15) https://www.youtube.com/watch?v=lKwyrKUEPS4&t=15s
- Original reference: Linear 发布片 (YouTube, 0:03) https://www.youtube.com/watch?v=lKwyrKUEPS4&t=3s
- Original reference: Linear 发布片 (YouTube, 0:23) https://www.youtube.com/watch?v=lKwyrKUEPS4&t=23s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/foreground-wipe-flash/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/foreground-wipe-flash ./foreground-wipe-flash`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A big blurred ball passes in front of the camera, covers the frame, and the scene changes
- A glow blows out the whole frame and cuts to the next scene
- No hard cuts, only wipes or flashes to connect scenes

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s, four scenes: logs explorer 0-2.6s, parameter 2.6-5.1s, trace waterfall 5.1-7.4s, wordmark 7.4-11s. Wipe 1: ball drifts 0-2.4s, sweep 2.4-2.9s (7 frames in, 8 frames out), scene swap at 2.6s. Flash: halo rises 4.83-5.1s (8 frames), swap at 5.1s, white fades 5.1-5.4s (9 frames). Wipe 2: ball drifts to 7.2s, sweep 7.2-7.7s, swap at 7.4s |
| Easing | Wipe enters with `expo.out` over 7 frames (0.233s) and exits right with `power2.in` over 8 frames (0.267s); flash halo rises with `ease: "none"` over 8 frames and falls with `power3.out` (`cubic-bezier(0.33,1,0.68,1)`) over 9 frames; scene camera moves are `ease: "none"` |
| Camera | Scene 1: camera moves right (content x 70 to -60, scale 1.26 to 1.36 over 2.6s) with a 3D tilt easing rotationY 9 to 6 (perspective 1700px). Scene 2: slow push 1.0 to 1.05 over 2.5s. Scene 3: x 70 to -50, scale 1.42 to 1.5, tilt the other way (rotationY -10 to -6). Scene 4: 1.0 to 1.05 over 3.6s |
| Subject | A matte black ball (2800px at scale 0.42-0.45 waiting at the lower left, blur 54px, soft top-left highlight) sweeps across the foreground to the frame center scale 1, then leaves right at scale 1.08. The flash is a 5200px radial gradient halo (white core to 42%) from the frame center scaling 0.05 to 1.5, then a full white plate. Small blurred spheres (150px, 70px, 190px) sit in the lower-right foreground |
| Sync | The scene swap lands on the frame the ball is centered (frame 78 and frame 222) or the frame white is full (frame 153); the ball sweep is 15 frames and the flash 17 frames. The final wordmark scene opens with a white seed glow at 7.4s that fades as the mark sharpens |
| Style | Light scenes: gray studio (`#d7d7d9` to `#bdbdc0`, soft highlight at 68% 36%, 26% edge vignette); dark scenes: radial `#131315` to `#060607`; ball matte black `#09090a` shading to `#5b5b61` highlight; flash pure white. Wordmark Inter 600 190px, letter-spacing -0.045em, `#f4f4f5` |

## Why it works

The transition object comes straight from the current scene (a ball, a halo), so viewers see the transition as part of the camera movement. The whole film uses only these two transitions and very few hard cuts, which keeps continuity in a monochrome style; the switch point lands on a fully covered frame.

## Prompt

> Build transitions between scenes called Foreground Wipe & Flash, 11s: a light gray studio scene (0-2.6s), a dark scene with a large number counting 412 to 38 (2.6-5.1s), a second light studio scene (5.1-7.4s) and a wordmark scene (7.4-11s). Each light scene already contains a large matte black ball (2800px, blur 54px, soft top-left highlight) waiting at the lower left at scale 0.42-0.45 and drifting slowly while the camera moves right with a 3D tilt. At 2.4s the ball sweeps to the frame center at scale 1 with expo.out in 7 frames and exits right to x 3700 at scale 1.08 with power2.in in 8 frames; swap the scene on frame 78 (2.6s) when the ball fills the frame, and the next scene is already in frame as the ball leaves. Between the dark scene and the second light scene use a flash instead: release a 5200px radial white halo from the frame center, scaling 0.05 to 1.5 linearly over 8 frames, set full white one frame before the swap at 5.1s, then fade the white plate over 9 frames with power3.out. Repeat the wipe at 7.2s with the swap on frame 222 (7.4s), then open the wordmark scene with a white seed glow that fades as the mark and wordmark slide into place over 1.3s with expo.out. Use only these transitions in the whole film.

## Often confused with

- [Match Cut](./match-cut.md): Match Cut keeps the anchor still and swaps the object directly; Foreground Wipe & Flash changes scenes on the frame that covers the screen.
- [Mark-to-Wordmark Unfold](./mark-to-wordmark-unfold.md): Mark-to-Wordmark Unfold is often followed by a white flash; the flash itself is only a transition device.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/foreground-wipe-flash/hyperframes.json (318 B)
- ../source/foreground-wipe-flash/index.html (45.8 KB)
- ../source/foreground-wipe-flash/package.json (310 B)

Read `../source/foreground-wipe-flash/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
