# Macro Pull-out Reveal

The camera drifts slowly across a surface at extreme close range, then one pull-back reveals the whole device or page.

- Position in a launch film: Product reveal
- Slug: macro-pull-out-reveal
- Preview video: https://media.motionboard.app/macro-pull-out.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/macro-pull-out-reveal/
- Film length: 10.5s, 1920x1080
- Original reference: Apple Vision Pro (YouTube, 0:10) https://www.youtube.com/watch?v=7B-rzR2avR0&t=10s
- Original reference: Apple iOS 26 Liquid Glass (YouTube, 0:52) https://www.youtube.com/watch?v=jGztGfRujSE&t=52s
- Original reference: Linear Releases (YouTube, 0:00) https://www.youtube.com/watch?v=6dIwFoQ0eVg
- Original reference: Figma Slides (YouTube, 1:00) https://www.youtube.com/watch?v=p-B--SGq_ZQ&t=60s
- Original reference: Framer (YouTube, 0:00) https://www.youtube.com/watch?v=6xJWQRVl9nw

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/macro-pull-out/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/macro-pull-out ./macro-pull-out`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Starts very close on a detail, then pulls out to show the whole product
- The camera slowly pulls back from a detail to the full picture
- A close-up, then a sudden pull-out to the whole page

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10.5s. Three macro shots: chart 0–1.7s (51 frames), deployment row 1.7–3.3s (48 frames), primary button 3.3–4.8s (45 frames); pull-out 4.8–6.0s (1.2s, 36 frames); residual drift 6.0–8.4s; focus racks out and the wordmark comes in 7.9–8.75s, held to 10.5s |
| Easing | Macro drift `linear`; pull-out `cubic-bezier(0.16,1,0.3,1)` (expo.out); residual drift `linear`; the focus band re-centers after each cut with power2.out over 0.5s; wordmark opacity power2.out 0.5s, scale 1.06→1 and blur 10px→0 expo.out 0.8s |
| Camera | CSS 3D, `perspective` 2000px, window tilted `rotateX` 25–26° and `rotateZ` −3° to −4°. Macro scale 4.2x, 4.2x, 4.0x; pans of 75, 80 and 60 window px (315, 336, 240 screen px), about 8–11% of frame width per second. Pull-out scale 4.0x→1x, rotateX 25°→11°, ending with the window at 80% of frame width. Residual drift scale 1.00→1.03, rotateX 11°→9.5°, rotateY −1°→−4° |
| Subject | A 1536×880 dashboard window rebuilt in DOM/SVG; it never moves and only the camera does. The pull-out starts from the primary button the last macro shot ended on. A pixel-grid overlay is visible during the macro shots and fades out 4.8–5.15s |
| Style | Near-black background `#050506`, raking light from the upper left (radial gradient `rgba(150,170,210,0.13)` from the top-left corner plus a 118° sheen), shallow depth of field from four stacked copies at blur 0, 2.6, 6 and 11px under a tilted focus band (half-width 100–125px), grain at 7.5% opacity re-rolled every 3 frames, vignette to 62% black |

## Why it works

Viewers first learn the material and texture up close, then see where those details sit in the whole as the camera pulls out. The depth of field is very shallow with only one band in focus, so a flat UI reads like a physical object. The pull-out is fast at first and slow at the end, which lands steadily on the full device.

## Prompt

> Build a product shot called Macro Pull-out Reveal. Total length 10.5 seconds. Rebuild a dashboard window (1536×880) in DOM/SVG and tilt it in CSS 3D (perspective 2000px, rotateX 25°, rotateZ −3° to −4°) on a near-black #050506 background with a raking light from the upper left. For the first 4.8 seconds the camera makes three linear macro shots at scale 4.0–4.2x, panning about 8–11% of frame width per second: a chart curve (0–1.7s), a table row (1.7–3.3s) and the primary button (3.3–4.8s). Depth of field is very shallow: stack four copies of the scene at blur 0, 2.6, 6 and 11px, masked by a tilted focus band about 200–250px wide across the middle of the frame that re-centers with power2.out 0.5s after each cut; overlay a pixel grid and grain. From 4.8 to 6.0 seconds pull back with expo.out (cubic-bezier(0.16,1,0.3,1)), scale 4.0x to 1x, relaxing the tilt to rotateX 11° and widening the focus band to 560px, until the window fills about 80% of the frame. Then drift linearly for 2.4 seconds (scale 1.00→1.03). At 7.9–8.75 seconds rack the focus out of the window and bring in the wordmark (scale 1.06→1 and blur 10px→0 with expo.out over 0.8s), holding to 10.5 seconds. The subject does not move; only the camera does.

## Often confused with

- [Auto Zoom / Zoom-to-Cursor](./auto-zoom.md): Auto Zoom serves a single UI action in 0.6–0.8s and then pulls back so the action can continue; Macro Pull-out Reveal ends on its pull-out.
- [Device Push-in Focus](./device-push-in-focus.md): Device Push-in Focus pans to one key after another on a single device; Macro Pull-out Reveal tours one detail in a single shot, then pulls out once.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/macro-pull-out/hyperframes.json (318 B)
- ../source/macro-pull-out/index.html (43.2 KB)
- ../source/macro-pull-out/package.json (303 B)

Read `../source/macro-pull-out/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
