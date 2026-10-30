# Tilted UI with Depth of Field

A UI plane tilted 10–15° and shot up close, with only the active row in focus and the rest blurred.

- Position in a launch film: Product reveal
- Slug: tilted-ui-with-depth-of-field
- Preview video: https://media.motionboard.app/tilted-ui.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/tilted-ui-with-depth-of-field/
- Film length: 10s, 1920x1080
- Original reference: Dia (YouTube, 0:42) https://www.youtube.com/watch?v=YVOw0TAO9ok&t=42s
- Original reference: Dia (YouTube, 0:18) https://www.youtube.com/watch?v=YVOw0TAO9ok&t=18s
- Original reference: Linear Releases (YouTube, 0:10) https://www.youtube.com/watch?v=6dIwFoQ0eVg&t=10s
- Original reference: Raycast (YouTube, 0:00) https://www.youtube.com/watch?v=Mi173xGb0ZA

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/tilted-ui/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/tilted-ui ./tilted-ui`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The interface looks like a real object shot on a desk
- Only the row being typed in is sharp
- The interface is tilted with blur in front and behind

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10s. Panel slides in 0–1.0s (30 frames); camera pans linearly 0–8.0s; typing 1.4–3.2s (47 characters); results swap 3.3s, rows stagger 0.05s (0.5s each from 3.5s); highlight appears 4.4s and hops at 5.1s and 5.82s (0.22s, 7 frames each); select press 6.3s; answer streams 6.72–7.8s (7 lines, 0.18s apart); pull-back 8.0–8.9s (0.9s, 27 frames); wordmark 8.3–8.9s |
| Easing | Pan and backdrop drift `linear`; panel slide-in, row reveals, highlight hops, focus jumps and the pull-back `cubic-bezier(0.16,1,0.3,1)` (expo.out); select press back.out(2) |
| Camera | CSS 3D, `perspective` 1200px; panel (760×500px) rotated `rotateX` 18°, `rotateY` −16°, `rotateZ` 5° at scale 2.3; camera close, panning slowly sideways (x 110→−150px) while a follow offset keeps the active line at about 40% of frame height; the in-focus band is 168px of panel height, about 36% of frame height, and the pull-back at 8.0s halves the tilt (9°, −8°, 2.5°), scales 2.3→1.5 and widens the band to the whole panel |
| Subject | The active row is sharp; two blurred copies of the same panel (`blur` 4px next to the band, 13px beyond it) cross-fade over 60px and 200px masks; typing at about 30ms per letter with 75ms per space, caret blinking on a 1s cycle; the highlight moves down two rows of the results, then the answer streams line by line |
| Sync | The focus band jumps to the same row as the highlight (0.22–0.35s expo.out) and follows each answer line (0.18s); the press (scale 0.98, then back.out(2)) and the tag turning orange `#ff6a3d` land on the same frame at 6.3s |
| Style | Near-black `#070708` backdrop with five blurred white diagonal bands (−25°, opacity 0.07–0.14) drifting 288px (15% of frame width) over 9s; panel `rgba(28,28,30,0.78)`, radius 14px, 1px border `rgba(255,255,255,0.10)`; grain at 8% opacity re-rolled every 3 frames; vignette to 45% black; orange accent `#ff6a3d` |

## Why it works

Tilt, shallow depth of field, and grain make the screen UI read as a physical object, and they match the color grade of the live-action shots before and after it. Only the row being typed in is in focus, so the eye has nothing to search for.

## Prompt

> Build a close-up of your interface called Tilted UI with Depth of Field as a 10-second film. Put a 760×500px command-palette panel in a CSS 3D container with perspective 1200px, rotateX 18°, rotateY −16°, rotateZ 5°, scaled 2.3x, on a near-black #070708 backdrop with blurred diagonal light bands, 8% grain and a vignette. The panel slides in over 1.0s with expo.out and the camera pans sideways at linear speed for 8 seconds. Only the active row is sharp: stack three copies of the panel (sharp, blur 4px, blur 13px) under masks that cross-fade over 60px and 200px, with an in-focus band of 168px of panel height (about 36% of the frame) that jumps to the active row with expo.out. Type a 47-character query at about 30ms per letter (75ms per space) from 1.4s with a cursor blinking every 1s; at 3.3s swap to the results, whose rows fade in staggered 0.05s; from 4.4s a highlight moves down two rows (0.22s hops), and at 6.3s the selection presses (scale 0.98 then back.out(2)) while its tag turns orange on the same frame; then stream a 7-line answer 0.18s per line. At 8.0s pull back with expo.out over 0.9s: halve the tilt, scale 2.3x to 1.5x and widen the focus band to the whole panel, then fade in the wordmark.

## Often confused with

- [Macro Pull-out Reveal](./macro-pull-out-reveal.md): In Macro Pull-out Reveal the subject is a physical product and the shot pulls out to show it whole; here the subject is a flat UI shot as a physical object through tilt and depth of field, and the camera never pulls out.
- [Auto Zoom / Zoom-to-Cursor](./auto-zoom.md): Auto Zoom uses scale to serve a single action and then pulls back; this shot stays close and only pans slowly sideways.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/tilted-ui/hyperframes.json (318 B)
- ../source/tilted-ui/index.html (28.6 KB)
- ../source/tilted-ui/package.json (298 B)

Read `../source/tilted-ui/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
