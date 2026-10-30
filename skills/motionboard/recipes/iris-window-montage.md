# Iris Window Montage

A fixed circular window cuts rapidly between images, or revisits the same image, while its size jumps with the rhythm.

- Position in a launch film: Opening
- Slug: iris-window-montage
- Preview video: https://media.motionboard.app/iris-montage.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/iris-window-montage/
- Film length: 11s, 1920x1080
- Original reference: Claude Fable 5.1 (YouTube, 1:14) https://www.youtube.com/watch?v=ROF2Nv_KjOM&t=74s
- Original reference: Claude Fable 5.1 (YouTube, 0:32) https://www.youtube.com/watch?v=ROF2Nv_KjOM&t=32s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/iris-montage/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/iris-montage ./iris-montage`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A circular window flashing past lots of images
- The circle size jumps in beats
- Like looking at the same image through a microscope or radar screen

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. Fast cut 0-3.5s: 22 images at 6 frames (images 1-3), 5 frames (4-14), then 4 frames (15-22), i.e. 0.2s down to 0.133s; final image 3.5-3.7s; window opens 3.7-4.15s; push-in transition 4.15-4.65s. Scan window: expands 4.65-5.65s, hard jumps at 5.7, 6.1, 6.48s, green spread 6.58-8.33s with a jump at 7.43s, window closes to the mark at 8.38s, wordmark 8.74s, hold to 11s |
| Easing | Window size and image change are hard sets with no easing; per-image push `ease: "none"`; final window open `expo.out` 0.45s; push-in `power3.in` 0.5s, window fade `power2.in` 0.42s; scan window expands `expo.out` 1.0s; green nuclei pop scale 0.35 to 1 with `expo.out` 0.25s; window close `expo.inOut` 0.5s; wordmark `expo.out` 0.6s |
| Camera | Fixed. Inside the window each image starts at scale 0.6-1.0, random rotation up to +/-8 degrees and offset up to +/-40px, then drifts scale 1.02-1.05x and up to +/-1.5 degrees over its 4-6 frames. In the scan window the plate drifts linearly 1.0 to 1.04, then 1.8 to 1.85, 3.1 to 3.18, 1.3 to 1.37 and 2.0 to 2.14 between jumps |
| Subject | A centered circular window with hard-set diameters from 52% to 110% of frame height (560-1188px), one preset size per image, showing 16 kinds of micrographs, then a cultured-cell image. Scan-window scene: window 70px growing to 0.7H, jumps to 1.0H, 0.84H, 0.96H and 0.8H at 1.8x, 3.1x, 1.3x and 2.0x zoom, about 38% of 300 nuclei light green over 1.75s while a counter climbs to 312 |
| Style | Background `#0d0d0e`; dark window with a 3px `#030303` edge, a 70px soft shadow and an inset vignette; HUD captions in Inter and JetBrains Mono. Scan window is paper-colored (`#ebe2cc` to `#d6caae` gradient) with horizontal scan lines, 1.5px at 20% opacity every 4px, scrolling 48px over the scene; green `#3fd35c` accent; wordmark Inter 600 116px, letter-spacing -0.035em |

## Why it works

Dozens of images from completely different sources are unified into one series by the same circular frame, so the circle is what the viewer watches. During the fast cuts the eye remembers only the circle and the change of content. The scan-line version looks at the same network graph again through an oscilloscope view.

## Prompt

> Build a closing fast-cut called Iris Window Montage, 11s. Near-black background #0d0d0e with a circular viewing window fixed at the center, with a 3px #030303 edge, a soft 70px shadow and an inset vignette. Hard-cut inside the window through 22 images from one category: 6 frames each for the first 3, 5 frames each for the next 11, then 4 frames each (0.2s down to 0.133s). The circle diameter is hard-set per image between 52% and 110% of frame height (560-1188px) with no easing, and each image starts at a random rotation of up to 8 degrees and offset of up to 40px, then pushes 2-5% with ease: "none". After the last cut, hold the final image for 6 frames at 0.8H, open the window to 2320px over 0.45s with expo.out, then push the image to 3.6x over 0.5s with power3.in while the window fades. Cut to a paper-colored scan window (scan lines 1.5px every 4px at 20% opacity, scrolling) that grows from 70px to 0.7H over 1s with expo.out, then hard-jumps at 5.7s, 6.1s and 6.48s to 1.0H, 0.84H and 0.96H with new zoom levels, and lights about 38% of the nuclei green over 1.75s from 6.58s (scale 0.35 to 1, expo.out 0.25s) with a counter climbing to 312 and one more jump at 7.43s. At 8.38s close the window to a 96px mark with expo.inOut 0.5s, bring in the wordmark (expo.out 0.6s) and subline, and hold to 11s.

## Often confused with

- [Branching Growth](./branching-growth.md): Branching Growth is one structure growing; Iris Window Montage replaces content inside a fixed frame.
- [Glass Lens](./glass-lens.md): Glass Lens is a moving lens refracting content; the window in Iris Window Montage stays in place while the content cuts quickly.

## Source files

Runnable HyperFrames project, 4 files.

- ../source/iris-montage/hyperframes.json (318 B)
- ../source/iris-montage/index.html (71.8 KB)
- ../source/iris-montage/package.json (301 B)
- ../source/iris-montage/vendor/d3-delaunay.min.js (18.6 KB)

Read `../source/iris-montage/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
