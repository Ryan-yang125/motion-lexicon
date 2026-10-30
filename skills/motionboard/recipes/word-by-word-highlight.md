# Word-by-Word Highlight

Words in a small centered line brighten from gray to white one at a time, and the text never moves.

- Position in a launch film: Opening
- Slug: word-by-word-highlight
- Preview video: https://media.motionboard.app/word-highlight.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/word-by-word-highlight/
- Film length: 11s, 1920x1080
- Original reference: Apple iPhone 17 Pro (YouTube, 0:05) https://www.youtube.com/watch?v=TNhX1uR2vO8&t=5s
- Original reference: Apple MacBook Pro M5 (YouTube, 1:31) https://www.youtube.com/watch?v=GriXfu4tL30&t=91s
- Original reference: Apple AirPods Pro 3 (YouTube, 0:19) https://www.youtube.com/watch?v=EMmKs8vMKhU&t=19s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/word-highlight/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/word-highlight ./word-highlight`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- One sentence lighting up word by word on black
- The words turn from gray to white one at a time
- The subtitle fills in word by word with the action

## Spec

| Item | Value |
| --- | --- |
| Timing | One 37-word paragraph: words appear 0–5.92s, the last finishes lighting at 6.34s, hold until the hard cut at 8.3s (about 1.96s, 59 frames); wordmark card 8.3–11s: letters from 8.42s (0.07s apart), tagline 8.8s; film 11s |
| Easing | Each word is set to `#666` and then runs `linear` to `#fff` over 0.42s (13 frames); words appear with no movement; product fades up from black over 0.7s (sine in-out); mark `expo.out` 1.4s (`rotation` −40→0, meridian `rx` 20→0.6) |
| Camera | Text card fixed in the top band; the product is a 3D laptop on a turntable at a constant −13° per second (68°→−40° by 8.3s) with a slow camera push of 2.5% (fov 19°, elevation 17°); the wordmark card drifts `scale` 1→1.04 over 2.7s |
| Subject | Gap after each word = `0.075 + 0.0125 × letters` seconds (0.09–0.22s), plus 0.42s after a period and 0.22s after a comma; each word appears at 40% gray (`#666`) and the next appears while the previous is still brightening; the whole paragraph holds and then hard-cuts |
| Sync | Reading rhythm follows word length and punctuation; the paragraph stays still while the product turns beneath it; at 8.3s the hard cut lands the wordmark, where each letter repeats the same gray-to-white step |
| Style | Pure black `#000` background; white Inter 500 at 33px (3.1% of frame height), 1000px wide, centered, `line-height 1.42`, `text-wrap: balance`; wordmark 124px weight 600 with a white disc mark; bloom and fine grain on the product |

## Why it works

The type is only 2.5% of frame height with over 90% empty space around it, so reading pace is controlled entirely by the word-by-word brightening. A slowly rotating product sits under each selling-point card, so the card always has something to look at. In the closing version, the frame where the last word of the subtitle appears lines up with the end frame of the lid-closing motion.

## Prompt

> Build a selling-point title card called Word-by-Word Highlight. Pure black background; a 1000px-wide centered paragraph of white Inter 500 at 33px (about 3% of frame height, balanced wrap) sits in the top band, with a 3D product turning slowly below it. Words appear in order with no movement. Each word is set to 40% gray (#666) and brightens linearly to white over 0.42s, and the next word appears while the previous one is still brightening. The gap after each word is 0.075s plus 0.0125s per letter, with an extra 0.42s after a period and 0.22s after a comma, so a 37-word paragraph finishes at 6.34s. Hold it until 8.3s, then hard-cut to a wordmark card where each letter brightens from gray to white 0.07s apart and a tagline fades in over 0.5s. The product behind turns at a constant 13 degrees per second while the text stays still.

## Often confused with

- [Rhythmic Typing](./rhythmic-typing.md): Rhythmic Typing appends characters one at a time with a cursor; Word-by-Word Highlight brightens whole words in sequence, with no cursor.
- [Scattered Spec Type](./scattered-spec-type.md): In Scattered Spec Type the words land at spread-out positions and appear with a hard cut; in Word-by-Word Highlight the words sit on one line.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/word-highlight/hyperframes.json (318 B)
- ../source/word-highlight/index.html (33.8 KB)
- ../source/word-highlight/package.json (303 B)

Read `../source/word-highlight/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
