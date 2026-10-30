# Control-Driven Change

The frame a control (color picker, toggle, dial) lands, the page result changes on that same frame. It can be split-screen with the control on the left and the result on the right.

- Position in a launch film: Features
- Slug: control-driven-change
- Preview video: https://media.motionboard.app/control-driven.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/control-driven-change/
- Film length: 11s, 1920x1080
- Original reference: Arc Boosts (YouTube, 0:07) https://www.youtube.com/watch?v=N0jMmiCS8oQ&t=7s
- Original reference: Figma Slides (YouTube, 0:28) https://www.youtube.com/watch?v=p-B--SGq_ZQ&t=28s
- Original reference: Arc Boosts (YouTube, 0:26) https://www.youtube.com/watch?v=N0jMmiCS8oQ&t=26s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/control-driven/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/control-driven ./control-driven`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Drag a color wheel and the whole website changes color
- Flip a switch and the page changes right away
- Adjust on the left and the page changes at the same time

## Spec

| Item | Value |
| --- | --- |
| Timing | Close-up 0–0.85s, pull-out 0.85–1.75s (0.9s); color-dot drags 1.9–2.3s (0.4s, 12 frames), 3.3–3.7s (0.4s) and 6.9–7.4s (0.5s, 15 frames); dark-mode knob slides 5.0–5.17s (5 frames), theme flips at 5.17s; Brand popover reopens 6.1s (0.2s); window leaves 8.6s (0.7s), wordmark 9.1s; film 11s |
| Easing | Drags `cubic-bezier(0.65,0,0.35,1)` (power3.inOut), with dot and cursor sampled per frame from the same curve; free cursor moves `expo.out` in x and `power2.out` in y; press `scale 0.86` over 0.06s, release `back.out(2)` 0.18s; dot grab `scale 1.18`; page changes are hard sets on the landing frame |
| Camera | Opens as a 2.6x close-up on the inspector and popover (slow push to 2.66x), pulls out over 0.9s with `expo.out` to the whole window at 1.3x, then pushes slowly 1.3→1.36x `linear` until 8.6s |
| Subject | A website editor: the cursor drags a dot across a 200×132px color field in the Brand popover, from indigo `#6366f1` to emerald `#10b981`, orange `#f97316`, and violet `#8b5cf6`; the cursor drifts 5–6px off the dot's path mid-drag; a Dark mode switch flips the whole page theme at 5.17s |
| Sync | On the frame the dot lands, `--brand`, `--brand-t` and `--soft` are set on the root, so the hex field and the entire page change color together with no transition; the theme variables swap on the frame the knob arrives; one timeline drives control and page |
| Style | Shadcn-style editor window, light (`#ffffff` with `#09090b` text) switching to dark (`#09090b` with `#fafafa` text); the page takes the dot's color as its accent |

## Why it works

Control state and page result are strictly on the same frame, so cause and effect need no narration. In split-screen the left is a dark control and the right is light content, so control and content are separated by brightness.

## Prompt

> Show your feature with a shot called Control-Driven Change. Open on a 2.6x close-up of an inspector with a Brand color popover (a 200×132px color field holding one draggable dot), then pull out over 0.9s with expo.out to the whole editor window at 1.3x, and keep pushing slowly to 1.36x. The cursor grabs the dot (scale 1.18) and drags it through indigo, emerald, orange and violet in drags of 0.4 to 0.5s with power3.inOut; dot and cursor follow one sampled curve and the cursor drifts 5 to 6px off the path mid-drag. On the frame the dot lands, hard-set the CSS variables --brand, --brand-t and --soft on the root, so the hex field and the whole page change color together with no transition. Between drags the cursor clicks a Dark mode switch: the knob slides over 5 frames and the whole page swaps to the dark theme on the arrival frame. At 8.6s the window shrinks away over 0.7s and your wordmark lands.

## Often confused with

- [Locked-Layout Reskin](./locked-layout-reskin.md): Locked-Layout Reskin is driven by hard cuts in the edit, with no control in the frame; Control-Driven Change shows the control, and cause and effect are expressed by a same-frame change.
- [Focus Hop](./focus-hop.md): Focus Hop moves a highlight block down a list; Control-Driven Change changes the state of the whole page through a control value.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/control-driven/hyperframes.json (318 B)
- ../source/control-driven/index.html (50.1 KB)
- ../source/control-driven/package.json (303 B)

Read `../source/control-driven/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
