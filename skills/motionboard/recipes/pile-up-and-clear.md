# Pile-up and Clear

Tasks, tags, or events pile up one by one until the screen is full, then clear in one step to a single result state.

- Position in a launch film: Features
- Slug: pile-up-and-clear
- Preview video: https://media.motionboard.app/pile-up-clear.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/pile-up-and-clear/
- Film length: 10.8s, 1920x1080
- Original reference: Superhuman (YouTube, 0:05) https://www.youtube.com/watch?v=nJUylrt1OdU&t=5s
- Original reference: Notion Calendar (YouTube, 0:07) https://www.youtube.com/watch?v=C4Q2ezioTUM&t=7s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/pile-up-clear/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/pile-up-clear ./pile-up-clear`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The to-dos pile up, then drop to zero at once
- The schedule fills up cell by cell
- Tags surround the person, then all disappear

## Spec

| Item | Value |
| --- | --- |
| Timing | Window arrives 0–0.9s; 22 emails land from 0.9s with intervals shrinking 0.62→0.05s (last at 5.32s); 8 desktop notifications 2.75–5.1s; select-all key HUD 5.45s, selection 5.85s; clear in one frame at 6.45s; Inbox Zero holds 6.45–8.4s (about 1.95s, 58 frames); scene fades 8.4s (0.5s), mark 8.7s, wordmark 8.8s, tagline 9.1s; film 10.8s |
| Easing | Row arrival: list shift `expo.out` (duration min(0.36s, 1.6× the interval)) and row fade `power2.out` up to 0.14s; badge pulse `scale 1.15→1` `power2.out` 0.1s; urgent rows flash red for 0.9s; notifications `expo.out` 0.22s (`scale 1.08→1`, `x 30→0`); the clear is a single-frame `tl.set`; Inbox Zero image `scale 1.07→1` `expo.out` 1.8s |
| Camera | Fixed medium shot with a slow drift, `scale` 1→1.035 over 8.4s `linear` (origin 50% 12%); the window enters `y 46→0, scale 0.965→1` over 0.9s `expo.out` |
| Subject | A mail app (Cobalt) with 4 existing messages; 22 new ones land at the top of the Inbox and push the list down 52px per row, while the Inbox badge and Important tab counter step 5→26; urgent rows flash red; 8 desktop notifications stack at the window edge (88px pitch); command-A selects all 26 rows, E marks them done: list, notifications, selection bar and badge disappear and a dusk-landscape Inbox Zero panel with a green check and a toast takes over |
| Sync | Each arrival and its counter step share one frame; the command-A key caps and the row selection land on the same frame (5.85s); the E key cap, the clear, the toast and the Inbox Zero panel land on the same frame (6.45s) |
| Style | Light mail UI on a desktop wallpaper; red Urgent chips (`#fde4e4` background, `#c62f34` text), green check `#2fb36a`, a deep blue-violet dusk gradient for the result; the end card is a blue app mark with a lowercase wordmark and a one-line tagline |

## Why it works

The number and position of elements draw the feeling of "more and more things to do", with red tags gradually surrounding the person. On clearing, the color changes from red to green and many tags become one, so the before-and-after contrast takes a single image swap.

## Prompt

> Show your product wiping out chores with a shot called Pile-up and Clear. Open a mail app window (y 46 to 0, scale 0.965 to 1, 0.9s with expo.out) with a slow scale drift 1 to 1.035. From 0.9s, 22 new emails land at the top of the Inbox one at a time, the interval shrinking from 0.62s to 0.05s (the last at 5.32s); each row slides the list down 52px with expo.out and fades in, the Inbox badge counts from 5 to 26 with a 1.15 to 1 scale pulse on every arrival, and urgent rows flash red for 0.9s. From 2.75s to 5.1s, 8 desktop notifications stack over the window edge, each entering over 0.22s with expo.out. Fade up a command-A key HUD at 5.45s and select all rows on one frame at 5.85s. At 6.45s press E: on that single frame hide the list, notifications, selection bar and badge, show a dusk-landscape Inbox Zero panel with a green check, and raise a toast. Hold about 1.95s, then fade the scene out over 0.5s at 8.4s and land your wordmark with a one-line tagline.

## Often confused with

- [Wireframe Re-layout](./wireframe-re-layout.md): Wireframe Re-layout is a continuous interpolated re-layout with a constant number of elements; Pile-up and Clear grows and then clears the element count with hard cuts.
- [Showcase Wall](./showcase-wall.md): Showcase Wall is full from the start and moves as a whole; in Pile-up and Clear elements appear one by one and end in a single clear.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/pile-up-clear/hyperframes.json (318 B)
- ../source/pile-up-clear/index.html (39.1 KB)
- ../source/pile-up-clear/package.json (302 B)

Read `../source/pile-up-clear/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
