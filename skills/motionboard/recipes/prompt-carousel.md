# Prompt Carousel

A line under the headline thickens into a pill, becomes an input box, and types a list of prompts that scroll vertically.

- Position in a launch film: Features
- Slug: prompt-carousel
- Preview video: https://media.motionboard.app/prompt-carousel.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/prompt-carousel/
- Film length: 11s, 1920x1080
- Original reference: Vercel v0 (YouTube, 0:02) https://www.youtube.com/watch?v=By9wCB9IZp0&t=2s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/prompt-carousel/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/prompt-carousel ./prompt-carousel`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The title turns into an input box that types prompts one by one
- The prompts in the input box scroll up to the next one
- That AI-product input-box typing intro

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s: title words 0.15–0.7s (0.09s stagger, 0.4s each); line 0.85–1.05s; thicken 1.0–1.3s; widen 1.4–1.8s; app shell fades in 1.65–2.3s; first prompt typed 2.15–4.87s (41 characters); scrolls at 5.27, 6.12, 6.97s (0.3s each); send press 7.82s; pill closes 8.07–8.57s; wordmark 8.42s, tagline 8.57s |
| Easing | Words `expo.out` 0.4s; line `power3.inOut` 0.2s; thicken `expo.out` 0.3s; widen `power3.inOut` 0.4s; carousel scroll `cubic-bezier(0.16,1,0.3,1)` 0.3s (9 frames); send press `scale 0.88` over 0.07s, then `back.out(1.7)` 0.25s |
| Camera | Fixed framing with a slow push of the whole stage, `scale` 1→1.05 over 9.2s from 1.8s (`linear`); the content moves vertically, 90px per scroll |
| Subject | "What should we build?" in four words (64px, weight 600) rises `y 19→0` staggered 0.09s → a 3px black line spreads from the center to 860px (`scaleX` 0→1) → thickens into a 112px pill (radius 56px) with a soft shadow, and the headline flips white → the pill widens 860→1280px while the headline shrinks to 30px into the text slot, with an attach button, a model selector and a send button fading in → header, chips and recent projects appear → the first prompt types at about 15 characters per second (extra 0.07s after spaces, 0.1s after punctuation, seeded jitter) → the column scrolls up 90px per row three times (0.4s after typing, then every 0.85s), old rows turning light gray above the pill and the next prompt shown at 22% opacity below → send, shell fades, pill closes to 480×124px around a white mark and wordmark |
| Sync | The pill thickens as the headline flips white (1.03s); the headline is replaced by the typing row at 1.9s; each scroll sets the incoming row's text white on the same frame as the column moves; the send press runs 7.75–7.82s and the shell fades from 7.97s |
| Style | Pure white background; the black pill (`#111111`) is the only large dark area; Inter, prompts at 30px weight 500; ghost rows `rgba(17,17,17,0.22)`; very light shadows |

## Why it works

The input box grows out of the headline itself, with no cut. The prompts show one semi-transparent 20% gray row above and below, so it reads as a list of options, and the only motion in the frame is vertical.

## Prompt

> Build an opening called Prompt Carousel. Pure white background; a centered four-word title ("What should we build?", 64px) rises 19px and fades in, staggered 0.09s per word with expo.out over 0.4s. A thin black line spreads outward from the text's midline to 860px over 0.2s, thickens over 0.3s into a 112px black pill, and the text turns white on the same frame. The pill then widens to 1280px over 0.4s with power3.inOut while the headline shrinks to 30px into the text slot, and an attach button, a model selector and a send button fade in around it. After the headline clears, type the first prompt at about 15 characters per second with a cursor following the last character, with the next prompt visible in 22% gray below the box. Then the whole column scrolls up one 90px row with a 0.3 second expo.out, 0.4s after typing and again every 0.85s, three times, with the old row turning light gray above the pill. Finally press send (scale 0.88, then back.out(1.7)), fade the shell, and close the pill to 480×124px around your mark and wordmark. A slow scale push of 1 to 1.05 runs through the whole piece.

## Often confused with

- [Rhythmic Typing](./rhythmic-typing.md): Rhythmic Typing is a single line typed and deleted in the center of the screen; Prompt Carousel's container is an input box with several prompts scrolling vertically.
- [Word-by-Word Highlight](./word-by-word-highlight.md): Word-by-Word Highlight only brightens text and involves no change in input box form.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/prompt-carousel/hyperframes.json (318 B)
- ../source/prompt-carousel/index.html (17.5 KB)
- ../source/prompt-carousel/package.json (304 B)

Read `../source/prompt-carousel/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
