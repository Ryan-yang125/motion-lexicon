# Auto Zoom / Zoom-to-Cursor

The camera pushes to the target element in 0.4–0.8s, holds for one click or input, then pulls back to the full view.

- Position in a launch film: Features
- Slug: auto-zoom
- Preview video: https://media.motionboard.app/zoom-to-cursor.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/auto-zoom/
- Film length: 11s, 1920x1080
- Original reference: Vercel v0 (YouTube, 0:13) https://www.youtube.com/watch?v=By9wCB9IZp0&t=13s
- Original reference: Notion Calendar (YouTube, 0:39) https://www.youtube.com/watch?v=C4Q2ezioTUM&t=39s
- Original reference: Figma Slides (YouTube, 1:00) https://www.youtube.com/watch?v=p-B--SGq_ZQ&t=60s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/zoom-to-cursor/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/zoom-to-cursor ./zoom-to-cursor`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The camera zooms in on the button that matters
- After the click it zooms back out to the full page
- Like the auto-zoom in screen recording software

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s with two push–act–pull sequences. Push-in 0.6s (18 frames) at 1.1s and 5.0s; hold 2.35s and 2.75s; pull-back 0.7s (21 frames) at 4.05s and 8.35s. Cursor moves 0.5s (1.8–2.3s and 5.7–6.2s), drag 0.6s (2.55–3.15s), click 6.25s, typing 6.45–7.45s, Enter 7.65s; window leaves and the wordmark comes in 9.25–10.5s |
| Easing | Push and pull `cubic-bezier(0.16,1,0.3,1)` (expo.out); cursor moves power2.inOut; press 0.08s power2.out, release 0.22s back.out; motion-blur filter ramps up with power1.out and fades with power1.in |
| Camera | Put the whole window in one container, `scale` 2x on both pushes, with the target element translated to frame center (960, 540) and `transform-origin` at the container's top-left corner; blur 3px on each push and 2px on each pull (0.12s up, 0.3s down); a slow whole-scene drift `scale` 1.00→1.035 over 9.2s |
| Subject | The camera arrives first, and the cursor starts moving 0.1s after the push completes. Action one: drag a calendar card to the next day (grab 2.4s, drop 3.2s). Action two: click an empty slot (6.25s, ripple), a draft card opens, a title is typed, Enter at 7.65s |
| Sync | The drop at 3.2s changes the card, side panel, menu-bar text, activity log and toast on the same frame; Enter at 7.65s swaps the panel and shows the toast on the same frame; each pull-back starts 0.7–0.85s after the action while the toast is still showing; every push is 0.6s and every pull 0.7s on the same easing |
| Style | macOS desktop with a calendar window rebuilt in DOM so text stays sharp at 2x; violet selection ring `rgba(139,92,246,1)`, mark `#3b5bfd`; the motion blur is a CSS `blur` on the camera layer; closing lockup with a 3% push over 1.5s |

## Why it works

Each push-in serves exactly one action and pulls back as soon as the action is done, so viewers always know where they are on the full page. The ease is fast at first and slow at the end, so the camera lands crisply.

## Prompt

> Show two actions in your interface with a shot called Auto Zoom / Zoom-to-Cursor, 11 seconds long. Put the whole window in a container and rebuild the UI in DOM so it stays sharp when magnified. Push the camera to the first target over 0.6s with cubic-bezier(0.16,1,0.3,1), scale 2x, translating the target to frame center with transform-origin at the container's top-left, and add a slight CSS blur (3px) that ramps up in 0.12s and fades over 0.3s. Only after the push completes (0.1s later) does the cursor move: grab a calendar card at 2.4s and drag it to the next day over 0.6s; on the drop frame (3.2s) the card, side panel, menu-bar text and a toast all change together. Hold, then pull back to the full view over 0.7s with the same easing (blur 2px). Repeat for the second action: push at 5.0s, click an empty slot at 6.25s with a ripple, a draft card opens, type a title from 6.45s, press Enter at 7.65s so the panel swaps and a toast shows on the same frame, and pull back at 8.35s. Keep a slow 3.5% drift on the whole scene (scale 1.00→1.035 over 9.2s). At 9.25s fade the window out and bring in the wordmark lockup over 0.6s (expo.out).

## Often confused with

- [Tilted UI with Depth of Field](./tilted-ui-with-depth-of-field.md): Tilted UI with Depth of Field stays close and pans sideways, shooting a flat UI like a physical object through tilt and blur; Auto Zoom uses scale to go back and forth between the full view and a detail.
- [Focus Hop](./focus-hop.md): Focus Hop moves a highlight between cells while the camera barely moves; in Auto Zoom the camera is what moves.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/zoom-to-cursor/hyperframes.json (318 B)
- ../source/zoom-to-cursor/index.html (41.0 KB)
- ../source/zoom-to-cursor/package.json (303 B)

Read `../source/zoom-to-cursor/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
