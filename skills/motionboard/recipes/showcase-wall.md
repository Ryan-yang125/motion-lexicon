# Showcase Wall

A full-screen wall of work cards drifts diagonally at constant speed while slowly scaling up, then accelerates into one card at the end.

- Position in a launch film: Opening
- Slug: showcase-wall
- Preview video: https://media.motionboard.app/showcase-wall.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/showcase-wall/
- Film length: 11s, 1920x1080
- Original reference: Framer (YouTube, 0:15) https://www.youtube.com/watch?v=6xJWQRVl9nw&t=15s
- Original reference: Linear Releases (YouTube, 0:10) https://www.youtube.com/watch?v=6dIwFoQ0eVg&t=10s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/showcase-wall/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/showcase-wall ./showcase-wall`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A full screen of work cards slowly floating past
- The wall of showcases that says lots of people use this
- A card wall moving diagonally, then pushing in on one card

## Spec

| Item | Value |
| --- | --- |
| Timing | Drift 0–5.9s (177 frames); push-in 5.35–6.0s (about 20 frames); hold on the landed card 6.0–7.65s, with a template bar rising at 6.3s (0.7s); pull-back 7.65–8.65s (1.0s); lockup from 8.3s; film 11s |
| Easing | Drift and scale-up `linear`; push-in uses an `expo.in` curve (2^(10p−10)) for the first 72% of the 0.65s, then a velocity-matched cubic ease-out over the last ~0.18s so the card lands softly; pull-back `power3.inOut`; bar and lockup `expo.out` |
| Camera | A 2400×1600px wall translates `x:-440, y:-260` toward the upper left over 5.9s (about 75px per second, 3.9% of frame width), `scale` 1→1.15 about the frame center; the film opens from black over 0.5s (`power1.out`); the push-in fills the frame with one card while its `borderRadius` goes 10→0 |
| Subject | Six masonry columns of website screenshot cards, 360px wide with a 22px gap, column tops staggered between −260 and −40px, five card heights (202.5, 225, 360, 450, 480px); each card is a miniature page with its own palette and typeface; the push-in target is a 202.5px-tall SaaS template page |
| Style | Dark `#0b0b0c` stage; cards with 10px radius, a mix of white, dark, orange, yellow, and purple site designs in many different typefaces; after the hold the wall dims under a dark radial overlay (0.9s) and a ring-and-planet mark with a 136px wordmark takes over |

## Why it works

The number of cards shows that many people use the product. The cards all have different colors, so color blocks take turns passing through the center of the frame while drifting, and the push-in on one card at the end lands the eye on a specific piece of work.

## Prompt

> Show your users' work with a shot called Showcase Wall. Fill the frame with six masonry columns of website screenshot cards (360px wide, 22px gap, five heights from 202.5 to 480px, column tops staggered), each card a miniature page with its own palette and typeface, and open from black over 0.5s. The whole wall drifts toward the upper left with linear ease (x -440px and y -260px over 5.9s, about 4% of frame width per second) while scale grows linearly from 1 to 1.15. From 5.35s push into one card over 0.65s, accelerating with an expo.in curve and settling with a short cubic ease-out, until it fills the frame and its corner radius reaches 0. Hold on it for about 1.6s while your product bar rises (0.7s, expo.out), then pull back over 1s with power3.inOut to the whole wall, dim it, and land your wordmark.

## Often confused with

- [Auto Zoom / Zoom-to-Cursor](./auto-zoom.md): Auto Zoom serves one action and pulls back; Showcase Wall drifts at constant speed and ends with a one-way push-in and a cut.
- [Pile-up and Clear](./pile-up-and-clear.md): Pile-up and Clear adds elements one at a time and then clears them; the cards in Showcase Wall fill the frame from the start and move as a whole.

## Source files

Runnable HyperFrames project, 14 files.

- ../source/showcase-wall/assets/fonts/bricolage.woff2 (27.3 KB)
- ../source/showcase-wall/assets/fonts/cormorant-italic.woff2 (24.4 KB)
- ../source/showcase-wall/assets/fonts/cormorant.woff2 (23.0 KB)
- ../source/showcase-wall/assets/fonts/dm-sans.woff2 (25.9 KB)
- ../source/showcase-wall/assets/fonts/fraunces-italic.woff2 (33.1 KB)
- ../source/showcase-wall/assets/fonts/fraunces.woff2 (25.0 KB)
- ../source/showcase-wall/assets/fonts/instrument-serif-italic.woff2 (10.7 KB)
- ../source/showcase-wall/assets/fonts/instrument-serif.woff2 (10.1 KB)
- ../source/showcase-wall/assets/fonts/space-grotesk.woff2 (14.2 KB)
- ../source/showcase-wall/assets/fonts/syne.woff2 (24.2 KB)
- ../source/showcase-wall/assets/fonts/unbounded.woff2 (29.1 KB)
- ../source/showcase-wall/hyperframes.json (318 B)
- ../source/showcase-wall/index.html (164.3 KB)
- ../source/showcase-wall/package.json (302 B)

Read `../source/showcase-wall/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
