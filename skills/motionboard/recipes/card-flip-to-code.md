# Card Flip to Code

The preview card rotates 180° around the Y axis and its back face shows the code.

- Position in a launch film: Features
- Slug: card-flip-to-code
- Preview video: https://media.motionboard.app/card-flip-code.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/card-flip-to-code/
- Film length: 11s, 1920x1080
- Original reference: Vercel v0 (YouTube, 0:28) https://www.youtube.com/watch?v=By9wCB9IZp0&t=28s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/card-flip-code/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/card-flip-code ./card-flip-code`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The preview card flips over and the back is code
- A flip that switches between preview and code
- The card turns halfway to show the source

## Spec

| Item | Value |
| --- | --- |
| Timing | Per component: flip to code 0.8s (24 frames), hold about 1s, flip back 0.8s (24 frames). Pricing card 1.03–1.83s, back 2.88–3.68s (hold 1.05s); sign-in form 4.56–5.36s, back 6.26–7.06s (hold 0.9s); notification settings flips to code 7.71–8.51s and stays; component swaps are hard cuts at 3.88s and 7.03s; window leaves 9.4s (0.7s), wordmark 9.85s; film 11s |
| Easing | One `cubic-bezier(0.65,0,0.35,1)` (power3.inOut) curve for each 180°; Preview/Code pill slides 0.2s `expo.out`; cursor press `scale 0.86` over 0.06s, release 0.18s `back.out(2)` |
| Camera | Whole window in frame with a continuous slow push, `scale` 1→1.05 over 9.4s `linear`; 3D stage `perspective` 2400px, `perspective-origin` 820px 500px; edge-on the card shadow narrows to `scaleX` 0.04 |
| Subject | A 940×680px component card turns `rotateY` 0→180° about its center; the second turn continues 180→360° in the same direction; the back face is `rotateY(180deg)`, a dark code editor (`#0d1117`) with file tabs, an install command, and line-numbered TSX; the front is white with a dot grid |
| Sync | The cursor clicks the Preview/Code switch at 0.98s, the pill and labels change at 1.0s, and the flip starts at 1.03s; card shadow width and a black shading overlay (opacity up to 0.2) read the same eased angle each frame; window chrome, sidebar and header stay still; swapping component changes card, title, panel and sidebar row on one frame |
| Style | Light app window with a dark stage and deep shadow; shadcn-style components on the front; GitHub-dark syntax colors on the back; JetBrains Mono for code |

## Why it works

Preview and code are the front and back of one card, which says they are the same thing. The surrounding interface stays completely still during the flip, so the motion happens on one element only.

## Prompt

> Build a preview-and-code switch called Card Flip to Code. Put a 940×680px component card in a light app window with perspective 2400px (origin 820px 500px). Clicking a Preview/Code segmented control (the pill slides over 0.2s with expo.out) starts a 0.8s rotateY from 0 to 180° about the card center with power3.inOut. The back face is rotateY(180deg), a dark code editor, and both faces use backface-visibility: hidden. The card shadow width (down to scaleX 0.04) and a black shading overlay (up to opacity 0.2) follow the same eased angle every frame. Hold about 1s, click back, and keep rotating from 180 to 360° in the same direction. Repeat for three components, swapping card, title, panel and sidebar row on a single frame between them, and leave the last one on code. Window chrome stays still, the camera pushes scale 1 to 1.05 over 9.4s, and at 9.4s the window leaves and your wordmark lands.

## Often confused with

- [Morph Relay](./morph-relay.md): Morph Relay turns one element into a different shape; Card Flip to Code shows two faces of the same card, and the shape does not change.
- [Control-Driven Change](./control-driven-change.md): In Control-Driven Change a control changes the page on the same frame; here the trigger and the result are on the same element.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/card-flip-code/hyperframes.json (318 B)
- ../source/card-flip-code/index.html (52.5 KB)
- ../source/card-flip-code/package.json (303 B)

Read `../source/card-flip-code/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
