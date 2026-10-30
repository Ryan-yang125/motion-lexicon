# Chromatic Stretch

Some letters of a wordmark stretch horizontally with RGB ghosting, distort in steps, then snap back clean.

- Position in a launch film: Ending
- Slug: chromatic-stretch
- Preview video: https://media.motionboard.app/chromatic-stretch.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/chromatic-stretch/
- Film length: 10.5s, 1920x1080
- Original reference: Apple AirPods Pro 3 (YouTube, 0:00) https://www.youtube.com/watch?v=EMmKs8vMKhU

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/chromatic-stretch/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/chromatic-stretch ./chromatic-stretch`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Letters stretched sideways with colored ghosting
- The wordmark distorts a few times and then recovers
- An RGB-split glitch effect on text

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10.5s (315 frames). Wordmark: entry distortion 0.1-0.4s, second 0.73-0.97s, third 1.3-1.53s, smear-out 2.4-2.73s. Headline 1 enters 2.8s (settled 3.1s), re-distorts 4.0-4.17s, smears out 4.87-5.13s. Headline 2 enters 5.2s, re-distorts 6.4-6.57s, smears out 7.27-7.53s. Closing wordmark enters 7.6s (settled 7.9s), distorts 8.13-8.4s, tagline fades up 8.42s over 0.6s and holds to 10.5s |
| Easing | Stepped, no tween between states: each state holds 2 frames (66ms), then the ghost strength drops to 0.3 for 1 frame and the line returns clean. The stretch amount decays across the steps (4.4x, 3.7x, 2.9x, 1.8x). The master timeline runs `ease: "none"`; the tagline uses `expo.out` |
| Camera | Fixed frame with a slow push on each block, scale 1 to 1.03 over its on-screen time |
| Subject | Each distortion picks one letter segment (2-8 characters) and stretches it horizontally up to 4.4x (smear-out reaches 16x), scales it 1.1-1.55x vertically, arcs the baseline up to 28px, and squeezes the rest of the line to 0.6-0.96x. The R, G and B channels are warped separately and offset by 2.2% of font size each (about 4.7px at 214px) with a 12px horizontal blur on R and B; added on black and subtracted from the background, the misaligned channels read as cyan, magenta and yellow. Smear-out shifts the block left up to 420px and trails 22 fading copies |
| Style | Background `#f4f4f6`, black ink. Wordmark Inter 500 and 300 at 214px, letter-spacing -0.034em; headlines Inter 600 at 104px with 34px supporting lines at 47% opacity. RGB color exists only on distorted frames; settled frames are pure black on light gray |

## Why it works

The background and the type are black and white, and only the few distorted frames show a saturated separation into cyan, magenta, and yellow, so the color flashes and never stays. The distortion acts only on some letters and the rest stay clean, so the wordmark remains readable.

## Prompt

> Build a wordmark opening called Chromatic Stretch, 10.5s at 30fps. Light gray background #f4f4f6, black Inter wordmark centered (500 for the name, 300 for the suffix, 214px, letter-spacing -0.034em); the source film uses Ember Pro. Distort one letter segment at a time in 2-frame steps with no tweening: stretch it horizontally from 4.4x down through 3.7x, 2.9x and 1.8x, enlarge it 1.1-1.55x vertically, arc the baseline up to 28px, and squeeze the rest of the line to 0.6-0.93x. Warp the R, G and B channels separately, offset each by 2.2% of font size with a 12px horizontal blur on R and B, add them on black and subtract from the background so the edges split into cyan, magenta and yellow; drop the split to 0.3 for 1 frame, then return clean. Run three distortions on the wordmark at 0.1s, 0.73s and 1.3s, then smear it out to the left at 2.4-2.73s (stretch up to 16x, shift up to 420px, 22 fading trail copies). Swap in two headline blocks (2.8s and 5.2s) using the same enter, one re-distort and smear-out pattern, then bring the wordmark back at 7.6s with one more distortion at 8.13s and fade a tagline up at 8.42s (0.6s, expo.out). Push each block in slowly from scale 1 to 1.03; color appears only on distorted frames.

## Often confused with

- [Mark-to-Wordmark Unfold](./mark-to-wordmark-unfold.md): Mark-to-Wordmark Unfold changes the order in which the wordmark appears; Chromatic Stretch locally distorts a wordmark that is already visible.
- [Foreground Wipe & Flash](./foreground-wipe-flash.md): Foreground Wipe & Flash is a scene transition; Chromatic Stretch happens on the wordmark itself.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/chromatic-stretch/hyperframes.json (318 B)
- ../source/chromatic-stretch/index.html (18.7 KB)
- ../source/chromatic-stretch/package.json (306 B)

Read `../source/chromatic-stretch/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
