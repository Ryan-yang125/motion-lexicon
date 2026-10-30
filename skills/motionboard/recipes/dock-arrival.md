# Dock Arrival

A magnified Dock opens a gap, a new icon grows into it with one small spark, and a cursor click opens the window.

- Position in a launch film: Product reveal
- Slug: dock-arrival
- Preview video: https://media.motionboard.app/dock-arrival.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/dock-arrival/
- Film length: 11s, 1920x1080
- Original reference: Notion Calendar (YouTube, 0:04) https://www.youtube.com/watch?v=C4Q2ezioTUM&t=4s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/dock-arrival/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/dock-arrival ./dock-arrival`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A new icon shows up in the Dock
- The icon grows in with a little spark
- Click the icon to open a window

## Spec

| Item | Value |
| --- | --- |
| Timing | Gap opens and icon grows 0.45–0.95s (0.5s, 15 frames); radiating strokes 0.95–1.30s (0.29s each, staggered 0.02s, about 9 frames); cursor appears 1.5s and moves 1.5–2.1s (0.6s, 18 frames); tooltip 2.2s; press dim 2.4s (0.1s, 3 frames); window opens at 2.5s over 0.55s; typing 3.45–4.84s; checkbox click 5.8s; window closes 7.4s (0.42s); icon lands 7.8s, wordmark unfolds 8.4s (1.2s); film 11s |
| Easing | Growth `cubic-bezier(0.34,1.56,0.64,1)` (back.out(1.4)); cursor `cubic-bezier(0.65,0,0.35,1)` (power3.inOut); window open `cubic-bezier(0.16,1,0.3,1)` (expo.out); strokes draw `power2.out` and retract `power2.in`; window close `power3.in`; wordmark `expo.out` |
| Camera | Dock magnified 3.0x on a fixed point, pushing slowly to 3.06x until 2.5s; at the click, cut to a medium shot (1.0x, drifting to 1.012x) where the window opens from a small size at the center |
| Subject | A 13-slot macOS Dock (12 icons and a separator); the new icon's slot grows `width` 0→64px (gap 0→8px) while its icon goes `scale` 0.6→1 and fades in, and neighbors slide apart as the Dock re-centers; after it settles, four 2.1px strokes (at −96°, −62°, −30°, 2°) flick out of its upper right corner; the Dock magnifies icons 1.58x near the cursor; the opened window is a notes app with a checklist |
| Sync | The icon dims (opacity 0→0.32) on the press frame at 2.4s and the window opens 0.1s later at 2.5s; in the window a checklist row types a new item at 0.042s per character, and the click at 5.8s checks the box, updates the counter to "3 of 5" and the progress bar to 60% on one frame |
| Style | Light gray-white `#efeff2` base with a soft orange, pink, and blue gradient wallpaper; frosted Dock plate (`backdrop-filter: blur(24px)`); gradient squircle icons; the end card is a large icon plus a wordmark and one-line tagline |

## Why it works

A familiar macOS Dock motion says "an app was installed" with no text needed. The radiating short lines appear only once and are very small, which marks the landing point without taking over the frame.

## Prompt

> Show your app being installed with a shot called Dock Arrival. The frame is a macOS Dock magnified 3x on a fixed point with a very slow push to 3.06x. Starting at 0.45s, open a gap between two icons over 0.5s and grow your app icon in it (width 0 to 64px, gap 0 to 8px, scale 0.6 to 1, back.out(1.4)). After it settles, flick four 2.1px strokes out of its upper right corner, each drawing in 0.13s and retracting by 0.29s, staggered 0.02s. At 1.5s the cursor enters and moves to the icon over 0.6s with power3.inOut, the Dock magnifies icons 1.58x near it, and a tooltip appears. At 2.4s the icon dims over 0.1s, and at 2.5s cut to a medium shot where a notes window scales from 0.16 to 1 over 0.55s with expo.out. Type a new checklist item at 0.042s per character, click its checkbox at 5.8s and change the checkbox, counter and progress bar on the same frame. At 7.4s fold the window back to the center over 0.42s with power3.in, land a large icon with back.out(1.5), then slide it left while the wordmark unfolds with clip-path and blur 10px to 0 over 1.2s with expo.out.

## Often confused with

- [Morph Relay](./morph-relay.md): Morph Relay is one element changing shape continuously; Dock Arrival adds a new element to the Dock and then opens a window on click.
- [Pile-up and Clear](./pile-up-and-clear.md): Pile-up and Clear piles up more and more elements and then clears them; Dock Arrival adds only one element.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/dock-arrival/hyperframes.json (318 B)
- ../source/dock-arrival/index.html (52.9 KB)
- ../source/dock-arrival/package.json (301 B)

Read `../source/dock-arrival/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
