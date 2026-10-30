# Dispense Line-up

Accessories slide out of the main object one by one into a row while the caption appears word by word, then retract in mirror order.

- Position in a launch film: Features
- Slug: dispense-line-up
- Preview video: https://media.motionboard.app/dispense-lineup.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/dispense-line-up/
- Film length: 10.5s, 1920x1080
- Original reference: Apple AirPods Pro 3 (YouTube, 0:19) https://www.youtube.com/watch?v=EMmKs8vMKhU&t=19s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/dispense-lineup/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/dispense-lineup ./dispense-lineup`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Accessories come out of the product one by one and line up
- Text pops up word by word as they come out
- Then they go back in one by one

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10.5s in three shots (A 0–3.9s, B 3.9–7.6s, lockup C 7.6–10.5s), with two dispense passes. Each pass: extend 0.9s (27 frames), hold 1.1s (33 frames), retract 0.9s (27 frames); pass 1 extends 0.5–1.4s and retracts 2.5–3.4s, pass 2 extends 4.3–5.2s and retracts 6.3–7.2s. Accessories start 0.15s apart (about 5 frames), each slide-out takes 0.3s (9 frames) |
| Easing | Slide-out `cubic-bezier(0.16,1,0.3,1)` (expo.out); the retract is the exact time mirror of the extend; camera push sine.inOut; wordmark and subtitle expo.out |
| Camera | Perspective, locked side view at 13° fov with lens shift so the dock sits left and the row centre-right (shots A and C); shot B is a three-quarter view from the left at 23° fov so the row recedes in depth; 3% push-in per shot (scale 1.00→1.03); motion blur from 14 sub-frames over a 180° shutter |
| Subject | 5 power adapters (140W, 96W, 70W, 35W, 20W) leave the dock's right face to the right and form a row sized from large to small, 0.42 units apart; the smallest leaves first and travels furthest, the largest leaves last; on retract they re-enter in the mirrored order, from right to left |
| Sync | Each accessory that slides out adds one word to the caption 0.1s after it starts moving, which appears directly with no fade (5 words, 5 accessories); on retract, words are removed in reverse order at 0.15s intervals |
| Style | Light gray-white background `#f4f4f6`, matte white product (`#f4f4f3`, roughness 0.62), large soft overhead box plus broad front fill, soft contact shadows on an invisible floor; no tone mapping; dark gray type `#1d1d1f` (50px captions, 156px wordmark) |

## Why it works

The number of words in the caption matches the number of accessories one to one, and the forward and reverse runs are symmetric, so the move is reversible. Accessory sizes step down from large to small, which gives the row a sense of perspective. The row has no guide lines or labels.

## Prompt

> Build an accessory showcase called Dispense Line-up as a 10.5-second film. Light gray-white background (#f4f4f6) with a matte white charging dock in a locked side view (13° fov, lens shift so the dock sits left and the row centre-right). 5 power adapters (140W, 96W, 70W, 35W, 20W) slide out of the dock's right face to the right and form a row sized from large to small: the smallest leaves first and travels furthest, each next one starts 0.15 seconds later, each slide-out takes 0.3 seconds with expo.out (cubic-bezier(0.16,1,0.3,1)), 0.9 seconds in total. Each time one starts moving, the caption below gains one word 0.1 seconds later that appears directly with no fade; the word count matches the accessory count. After a 1.1 second hold, retract as the exact time mirror over 0.9 seconds: the accessories return from right to left into the dock while the caption deletes word by word in reverse. Run two passes (0.5s and 4.3s start) with a second caption, cutting to a three-quarter view from the left (23° fov) for the second one, then end on the side view with the wordmark fading in at 7.75s (expo.out, blur 10px→0). Push in 3% over every shot with sine.inOut. Soft overhead light, soft contact shadows, 14-sub-frame motion blur on moving parts. Drive the 3D from a time function so the retract is a mirror, and use GSAP only for the caption words and wordmark.

## Often confused with

- [Text–Object Interleave](./text-object-interleave.md): Text–Object Interleave is front-and-back occlusion between text and object; the caption in Dispense Line-up syncs only with the accessory count.
- [Converge to Mark](./converge-to-mark.md): Converge to Mark gathers many elements into one icon; the retract in Dispense Line-up returns to the original subject and creates no new shape.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/dispense-lineup/hyperframes.json (318 B)
- ../source/dispense-lineup/index.html (27.3 KB)
- ../source/dispense-lineup/package.json (304 B)

Read `../source/dispense-lineup/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
