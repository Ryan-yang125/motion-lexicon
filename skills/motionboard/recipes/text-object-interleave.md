# Text–Object Interleave

Text and object interleave in depth: type rises from behind the product, a device slots into a gap in a sentence, or a word passes through an object and comes out as another word.

- Position in a launch film: Product reveal
- Slug: text-object-interleave
- Preview video: https://media.motionboard.app/text-object-interleave.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/text-object-interleave/
- Film length: 11s, 1920x1080
- Original reference: Apple iPhone 17 Pro (YouTube, 0:00) https://www.youtube.com/watch?v=TNhX1uR2vO8
- Original reference: Apple iPhone 17 Pro (YouTube, 0:35) https://www.youtube.com/watch?v=TNhX1uR2vO8&t=35s
- Original reference: Apple AirPods Pro 3 (YouTube, 0:28) https://www.youtube.com/watch?v=EMmKs8vMKhU&t=28s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/text-object-interleave/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/text-object-interleave ./text-object-interleave`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The text rises up from behind the product
- A phone slides down between two pieces of text
- The text passes through the earbuds and comes out in another language

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s with hard cuts at 3.2s and 7.8s. Wordmark-rise scene 0–3.2s: product lights 0–1.15s, sinks while the wordmark rises 0.9–2.7s (1.8s, 54 frames). Pass-through scene 3.2–7.8s: source text slides in 1.0s (30 frames; 3.75–4.75s and 5.85–6.85s), translation emerges 0.4s (12 frames; 4.75–5.15s and 6.85–7.25s). Slot-in scene 7.8–11.0s: device drops in 8.55–9.05s (0.5s, 15 frames), light ring glows 9.05–9.65s (0.6s, 18 frames) |
| Easing | Wordmark rise, device drop, translation emerging and lockup `cubic-bezier(0.16,1,0.3,1)` (expo.out); source text slide `linear`; product lighting power2.inOut; word lighting and ring glow power2.out and power2.inOut |
| Camera | Fixed perspective camera, 20° fov, distance 34 units, medium close-up. When the wordmark rises, the case sinks from top 350px to 515px (165px, about 15% of frame height) while the wordmark rises 255px; slow drift: case scale +2.5% in the first scene, earbud scale +2% in the second |
| Subject | Layer order: text at the back, 3D product in the middle, text in front. In the pass-through scene the translation is clipped to start at the earbud tip (x 1060px) and the source text is hidden past x 820px; in the slot-in scene the sentence splits into two groups with a 400px gap, one earbud wide, and the left words light first (8.05s), the right words second (8.3s) |
| Sync | The light ring turns on after both word groups have lit and the device has dropped in (9.05s); the translation emerges at the earbud's sound outlet (tip at 1060px, 580px) and its language label follows 0.12s later |
| Style | Black background in the first and last scene, light gray `#f5f5f7` in the middle one; wordmark vertical gradient `#ff5a0a` → `#ff7a26` → `#ffb27a` → `#ffd2ad` (Archivo Black 340px), translation gradient `#4b2dff` → `#9b33ff` → `#ff2f8a` (`background-clip: text`), sentence words `#5e5e63` lighting to `#f5f5f7` |

## Why it works

The text sits one layer behind the product, and the product covers about 1/3 of the wordmark, which creates a front layer and a back layer. The sentence breaks in the middle and the device becomes part of it, so the eye travels from the left word through the screen to the right word. Translation is shown through occlusion: the word goes in as black source text and comes out as gradient-colored translation, with no arrows.

## Prompt

> Build a front-and-back interleave of text and product called Text–Object Interleave as an 11-second film with three scenes and hard cuts at 3.2s and 7.8s. Use three layers: text at the back, your 3D product in the middle (fixed perspective camera, 20° fov, distance 34 units), text in front. Scene 1 (black stage): the case lights up (rim 0–0.45s, key 0.25–1.15s), then from 0.9 to 2.7s it sinks 165px (about 15% of frame height) with expo.out (cubic-bezier(0.16,1,0.3,1)) while a large wordmark with a vertical orange gradient (#ff5a0a to #ffd2ad) rises 255px from behind its top edge and is clipped at the bottom. Scene 2 (light gray #f5f5f7): an earbud close-up with its sound outlet fixed on screen; source text slides at constant speed (linear) for 1.0s into the earbud and is hidden, then 0.4s later the translation emerges from the outlet with expo.out in a purple-pink gradient (#4b2dff to #ff2f8a, background-clip: text); run two passes (3.75–5.15s and 5.85–7.25s). Scene 3 (black): a sentence split into two word groups with a 400px gap one earbud wide; the left words light first (8.05s), the right words 0.25s later; the earbud drops into the gap from above over 0.5s with expo.out (8.55–9.05s), then its light ring glows over 0.6s (9.05–9.65s) and the wordmark settles in with expo.out. Use layered HTML + GSAP over a Three.js canvas.

## Often confused with

- [Word-by-Word Highlight](./word-by-word-highlight.md): Word-by-Word Highlight controls reading pace on plain text; Text–Object Interleave puts text and object into an occlusion relationship.
- [Dispense Line-up](./dispense-line-up.md): Dispense Line-up has objects slide out of the main subject in turn, synced word by word with the caption; Text–Object Interleave emphasizes the front-and-back layering of text and object.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/text-object-interleave/hyperframes.json (318 B)
- ../source/text-object-interleave/index.html (40.9 KB)
- ../source/text-object-interleave/package.json (311 B)

Read `../source/text-object-interleave/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
