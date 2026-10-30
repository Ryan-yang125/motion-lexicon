# Branching Growth

A single dot branches layer by layer into a network, slow at first and then faster, or splits in doubling beats until it fills the frame.

- Position in a launch film: Opening
- Slug: branching-growth
- Preview video: https://media.motionboard.app/branching-growth.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/branching-growth/
- Film length: 11s, 1920x1080
- Original reference: Claude Fable 5.1 (YouTube, 0:14) https://www.youtube.com/watch?v=ROF2Nv_KjOM&t=14s
- Original reference: Claude Fable 5.1 (YouTube, 0:51) https://www.youtube.com/watch?v=ROF2Nv_KjOM&t=51s
- Original reference: Linear Releases (YouTube, 0:00) https://www.youtube.com/watch?v=6dIwFoQ0eVg

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/branching-growth/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/branching-growth ./branching-growth`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A dot slowly branches into a big web
- One dot becomes two, then four, then fills the screen
- Thin lines merge and flow in one direction

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. Tree on paper 0.45-3.2s: layers 1-3 take 0.5s each (0.45-1.95s), layers 4-6 take 0.333s each (1.95-2.95s), layer 7 at 2.8-3.2s; camera pull-back 0.45-3.45s; six nodes turn green 2.9-3.4s; dive into one node 3.95-4.35s, then a 4-frame darken to the dark scene. Doubling beats at 4.48, 4.95, 5.5, 6.1, 6.7, 7.3, 7.9s (1, 2, 4, 8, 16, 32, 77 documents); slate at 8.4s with tagline at 8.7s, holding to 11s |
| Easing | Nodes pop with `cubic-bezier(0.34,1.56,0.64,1)`; each line is drawn outward from its parent with `1-(1-p)^2.4` over 60% of the layer window, then its dot pops at 92% of the line; the pull-back interpolates log-scale (constant zoom rate); the dive eases scale with `t^3` and position with `t^2`; the document re-deal steps at 8fps; slate letters `expo.out` 0.4s |
| Camera | Starts at scale 2.0 with the root low in frame (330px bias) and pulls back over 0.45-3.45s until the network is about 80% of frame width, centered on the tree extents; dives into one green node over 3.95-4.35s until it fills a 44px radius; the dark scene is fixed; the slate pushes 1.035x over 2.6s |
| Subject | Root dot (radius 34) with 7 layers below it. Layer 1 splits in 2 at ±31 degrees; layers 2-6 split in 2 or 3 (45% chance of 3) at ±34-38 degrees with ±5.5 degrees jitter and a bend toward radial; layer 7 splits in 2 or 3. Radius 24, 17, 12, 8, 5.6, 3.6, 1.9; edge length 300, 235, 195, 150, 110, 80, 42 (times 0.88-1.12); line width 1.9 down to 1.0. Six nodes labeled as documents turn green at 1.3x scale with a 0.7s ring pulse. Doubling scene: document cards (10 kinds) re-deal on a grid at 8fps, card scale 2.0, 1.9, 1.7, 1.25, 1.0, 0.78, 0.64, new cards pop at 0.8 then 1.05 then 1 over 3 frames, 40% carry a green status dot |
| Style | Paper `#e3d5b5` with fibers, specks and a warm vignette for the tree and slate; near-black grain (about `#0d0d0c`) for the doubling beats; pencil ink `#1d1b18` with graphite gaps and burr strokes; the only accent is green `#3cc24a`, used for activated nodes, the status dots and the last slate node. Wordmark Inter 600 168px, letter-spacing -0.045em; tagline Inter 400 30px `#6b5e3f` |

## Why it works

Going from one dot to thousands uses only black lines, black dots, and paper texture. Growth is slow at first and fast later, which turns scale into a visible rhythm. The big nodes and the small end dots differ greatly in size, so the layers read at a glance. The doubling version advances by doubling the count each beat, with no arrows or numbers.

## Prompt

> Build a scale-growth film called Branching Growth, 11s. Beige paper background #e3d5b5 with fibers, specks and a warm vignette, and a single pencil-black dot (#1d1b18, radius 34) in the center. Starting at 0.45s, grow 7 layers below it: layer 1 splits in 2 at ±31 degrees, layers 2-6 split into 2 or 3 at ±34-38 degrees, layer 7 into 2 or 3, with radius 24, 17, 12, 8, 5.6, 3.6, 1.9 and edge length 300, 235, 195, 150, 110, 80, 42. Layers 1-3 take 0.5s each, layers 4-6 take 0.333s each, layer 7 runs 2.8-3.2s; draw each line outward with 1-(1-p)^2.4 and pop its dot at 92% of the line with cubic-bezier(0.34,1.56,0.64,1). At the same time pull the camera back from scale 2.0 over 0.45-3.45s at a constant zoom rate until the network fills about 80% of the frame width. The only accent is green #3cc24a: light six document-named nodes at 2.9-3.4s with a 1.3x scale and a ring pulse, then dive into one of them over 3.95-4.35s. Cut to near-black with a 4-frame darken and run the doubling scene, re-dealing document cards on a grid at 8fps: 1, 2, 4, 8, 16, 32 and 77 documents at 4.48, 4.95, 5.5, 6.1, 6.7, 7.3 and 7.9s, card scale falling from 2.0 to 0.64, green status dots on 40%. At 8.4s return to paper, grow a small 7-node tree mark, set the wordmark in with a 0.02s per-letter stagger (expo.out 0.4s) and the tagline at 8.7s, and hold to 11s with a slow 1.035x push.

## Often confused with

- [Iris Window Montage](./iris-window-montage.md): Iris Window Montage cuts rapidly between images in a fixed frame; Branching Growth is one structure that keeps getting bigger.
- [Glass Droplet Split](./glass-droplet-split.md): Glass Droplet Split is one shape shedding one bead; Branching Growth is a multi-level structural expansion.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/branching-growth/hyperframes.json (318 B)
- ../source/branching-growth/index.html (44.3 KB)
- ../source/branching-growth/package.json (305 B)

Read `../source/branching-growth/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
