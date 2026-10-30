# Scattered Spec Type

A spec line is split into words placed far apart on uneven baselines, with a connector word stepping up letter by letter.

- Position in a launch film: Features
- Slug: scattered-spec-type
- Preview video: https://media.motionboard.app/scattered-spec.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/scattered-spec-type/
- Film length: 11s, 1920x1080
- Original reference: Apple MacBook Pro M5 (YouTube, 0:20) https://www.youtube.com/watch?v=GriXfu4tL30&t=20s
- Original reference: Apple MacBook Pro M5 (YouTube, 0:31) https://www.youtube.com/watch?v=GriXfu4tL30&t=31s
- Original reference: Apple MacBook Pro M5 (YouTube, 0:57) https://www.youtube.com/watch?v=GriXfu4tL30&t=57s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/scattered-spec/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/scattered-spec ./scattered-spec`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The spec text pops up word by word at different positions
- The words are spread wide apart with ups and downs
- Small spec text mixing roman and italic

## Spec

| Item | Value |
| --- | --- |
| Timing | Four sentences of 2.05s each starting at 0.1, 2.15, 4.2, 6.25s: words appear over the first 0.76–1.04s, then the sentence holds about 1.0–1.3s and hard-cuts; wordmark card 8.3–11s: letters scatter in 8.35–8.8s, settle at 8.96s over 0.55s, tagline 8.96s; film 11s |
| Easing | Words and letters appear with `tl.set` hard cuts (no fade); stair letters sit at `x: i×24–26px, y: −i×28–30px`, and two of the stair words collapse to one line with `expo.out` 0.4s; the scattered wordmark settles `expo.out` 0.55s |
| Camera | One 3D lens model (Three.js, fov 20°) re-framed for each sentence: lens offset x +640, −640, +560, −520px with scale 1.0, 1.15, 1.2, 1.1, tilt and a 4% scale growth plus a few pixels of drift inside each 2.05s group; scale 1.35 behind the wordmark with the background dimmed to 34% opacity |
| Subject | Four sentences with word starts 0.12–0.42s apart, each word placed by its left edge on its own baseline: 'Now with 48 megapixels', 'Constant f/1.8 aperture from 24–70mm', 'Up to 18 hours per charge', 'Weighs just 312 grams, lens included'; connector words ('with', 'from', 'per', 'just') appear letter by letter on an uneven beat as a staircase; numerals are 128px weight 300; the wordmark 'Quarry' appears as scattered letters offset up to ±150px |
| Sync | Each sentence swap, camera re-frame and background change land on the same frame (0.1, 2.15, 4.2, 6.25, 8.3s); the wordmark and tagline settle on the same frame at 8.96s |
| Style | Near-black `#070708` radial background with a vignette; white `#f5f5f7` Inter 66px, Playfair Display italic 74px, numerals 128px weight 300, one muted 40px line; red `#ff4a2b` dot in the tagline; set over a dark 3D product render |

## Why it works

Words are spread far apart on staggered baselines, so reading the spec sentence has pauses. Italics are used only on key words such as "faster" and "Introducing", and the type stays at about 3% of frame height so it does not compete with the main picture.

## Prompt

> Write four spec lines with a shot called Scattered Spec Type: 'Now with 48 megapixels', 'Constant f/1.8 aperture from 24–70mm', 'Up to 18 hours per charge' and 'Weighs just 312 grams, lens included', each shown for 2.05s over a dark 3D product render. Each word appears with a hard cut and no fade, 0.12 to 0.42 seconds apart, at positions spread across the frame on different baselines, in white Inter 66px with key words in Playfair italic 74px and numerals at 128px weight 300. Connector words ('with', 'from', 'per', 'just') appear letter by letter on an uneven beat and step upward, each letter 24 to 26px across and 28 to 30px up; settle some of them into one line with a 0.4 second expo.out. Re-frame the camera with a new lens offset, scale and tilt on every sentence, with a 4% growth inside each group, and hard-cut between sentences. At 8.3s, scatter the wordmark's letters up to 150px off their slots, settle them into one line with a 0.55 second expo.out, and fade in a tagline.

## Often confused with

- [Rhythmic Typing](./rhythmic-typing.md): In Rhythmic Typing the text is appended character by character on one fixed line; in Scattered Spec Type the words land at spread-out positions.
- [Word-by-Word Highlight](./word-by-word-highlight.md): In Word-by-Word Highlight the words turn from gray to white on one line; in Scattered Spec Type the words appear with a hard cut at staggered positions.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/scattered-spec/hyperframes.json (318 B)
- ../source/scattered-spec/index.html (28.8 KB)
- ../source/scattered-spec/package.json (303 B)

Read `../source/scattered-spec/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
