# Morph Relay

One element keeps morphing into the next, replacing cuts, so the whole sequence has no hard cut.

- Position in a launch film: Features
- Slug: morph-relay
- Preview video: https://media.motionboard.app/morph-relay.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/morph-relay/
- Film length: 11s, 1920x1080
- Original reference: Vercel v0 (YouTube, 0:02) https://www.youtube.com/watch?v=By9wCB9IZp0&t=2s
- Original reference: Vercel v0 (YouTube, 0:35) https://www.youtube.com/watch?v=By9wCB9IZp0&t=35s
- Original reference: Raycast (YouTube, 0:17) https://www.youtube.com/watch?v=Mi173xGb0ZA&t=17s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/morph-relay/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/morph-relay ./morph-relay`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- One thing keeps turning into the next
- No cuts, one continuous shot
- The title turns into an input box

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. Headline word groups rise 0.2–0.9s; title→line 1.1–1.3s (0.2s, 6 frames), line→capsule 1.3–1.6s (0.3s, 9 frames), capsule→input box 1.7–2.1s (0.4s, 12 frames); typing 2.4–3.95s, send 4.2s; input box→window 4.55–5.3s (0.75s), page blocks 5.0–5.95s; window shrinks into a card 7.0–7.8s (0.8s, 24 frames), 11 gallery cards 7.6–8.6s; closing line→pill 9.15–9.65s, held to 11s |
| Easing | Line expansion, input box and window growth `cubic-bezier(0.65,0,0.35,1)` (power3.inOut); capsule thickening, page blocks, shrink into the card and the closing pill `cubic-bezier(0.16,1,0.3,1)` (expo.out); send press back.out(1.7) |
| Camera | Camera basically fixed; slow linear push 1.00→1.03 over 6.2–7.0s, then 1.03→1.08 with a small pan (x −24px, y −14px) over 7.6–8.6s while the gallery appears; closing drift 1.00→1.025 over 9.6–11s |
| Subject | One black shape (`#111111`) changes width, height and corner radius together: 960×3 line, 960×96 capsule (radius 48), 920×88 input box (radius 44), 1440×820 window (radius 18, fill `#f6f1e8`), then a 0.26-scale gallery card among 11 others; the headline shrinks into the input as the placeholder, the avatar and buttons fade in 0.3s (1.8s), and page blocks rise 24px |
| Sync | The headline turns white on the frame after the capsule starts thickening (1.33s, 0.04s); the surrounding gallery stays hidden until the card is formed (cards appear from 7.6s); the window fill flips to cream within the first 0.3s of its growth |
| Style | Near-white soft-lit background (radial `#ffffff` → `#e9e9e9`) with a black shape; one subject throughout; gallery thumbnails use 11 different site styles; closing wordmark white on a 440×112 black pill |

## Why it works

The element from the previous segment becomes the subject of the next, so there is always only one shape changing in the frame, with empty space around it. Shape, corner radius, and text color inversion happen on the same frame, so the morph reads as one continuous action.

## Prompt

> Build a continuous morph with no cuts called Morph Relay, an 11-second film on a near-white soft-lit background. A headline (64px, black) rises in word groups. A black line (960×3px) expands from under it (0.2s, power3.inOut cubic-bezier(0.65,0,0.35,1)). The line thickens into a 96px capsule with expo.out (cubic-bezier(0.16,1,0.3,1)) over 0.3s and the headline inverts to white one frame later. The capsule then narrows into an 88px input box over 0.4s (power3.inOut) while the headline shrinks into the placeholder and an avatar and buttons fade in; type a prompt from 2.4s, press send at 4.2s, then grow the input box into a 1440×820 browser window with an 18px radius over 0.75s (4.55–5.3s) as its fill flips to cream, with page blocks rising 24px (0.5s expo.out each, staggered 0.04–0.06s) from 5.0s. Push in 3% linearly, then shrink the whole window into a gallery card (scale 0.26, 0.8s expo.out) and bring in 11 other cards around it 0.04s apart. Finally the opening line returns, thickens into a black pill and the wordmark appears inside it. Keep the surrounding elements empty so only one shape changes throughout.

## Often confused with

- [Wireframe Re-layout](./wireframe-re-layout.md): Wireframe Re-layout strips a group of elements down to wireframes and re-flows them together; Morph Relay changes a single element step by step into another kind of element.
- [Card Flip to Code](./card-flip-to-code.md): Card Flip to Code shows the front and back of the same card, rotating 180° around an axis; Morph Relay changes shape continuously with no front or back.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/morph-relay/hyperframes.json (318 B)
- ../source/morph-relay/index.html (62.9 KB)
- ../source/morph-relay/package.json (300 B)

Read `../source/morph-relay/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
