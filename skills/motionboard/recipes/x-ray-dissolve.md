# X-ray Dissolve

The internal structure and the outer shell cross-dissolve from the same camera position, then the camera pulls back to the whole device.

- Position in a launch film: Product reveal
- Slug: x-ray-dissolve
- Preview video: https://media.motionboard.app/x-ray-dissolve.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/x-ray-dissolve/
- Film length: 10s, 1920x1080
- Original reference: Apple A19 Pro 芯片 (YouTube, 0:55) https://www.youtube.com/watch?v=dJObc0V6hJU&t=55s
- Original reference: Apple A19 Pro 芯片 (YouTube, 0:53) https://www.youtube.com/watch?v=dJObc0V6hJU&t=53s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/x-ray-dissolve/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/x-ray-dissolve ./x-ray-dissolve`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The chip shows through the body, then becomes the whole device
- The parts inside slowly turn into the shell
- Like an X-ray into the device, then a pull-back

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10s. Macro shots: chip close-up 0–2.1s (fade in from black 0–0.7s), board and camera modules 2.1–4.3s. Dissolve shot 2.9s (87 frames): inner part drifts 4.3–5.5s (1.2s, 36 frames), accent tint 4.85–5.65s, shell fades in 5.5–6.0s (0.5s, 15 frames) while the inner layer drops to 30% over 5.5–5.8s, holds 0.2s, and reaches 0 at 6.18s; pull-back 6.0–7.2s (1.2s, 36 frames); wordmark 6.4–7.1s; settle 7.2–10.0s |
| Easing | Dissolve and tint power2.inOut (`cubic-bezier(0.65,0,0.35,1)`); drift sine.out; pull-back expo.out (`cubic-bezier(0.16,1,0.3,1)`) with a 4-frame zero-velocity run-up, nearly stopped for the last 0.4s; settle sine.inOut; wordmark power2.out |
| Camera | Perspective 24° fov. Macro shots oblique with a shallow depth of field. Dissolve shot is frontal and fixed from 5.5s; the drift before it moves about 2% of frame width per second, easing to rest. The pull-back scales 5x→1x with radial shutter blur (180°), ending with the body at 70% of frame height; the vignette tightens during the pull-back; settle push 1.00→1.025 |
| Subject | Two layers composited at the same position: the inner part (chip) at weight 1→0.3→0, and the phone shell at 0→1; the accent tint is masked by a Gaussian around the chip, so it bleeds in from the chip's glow first and the brightest shell edges arrive before the body fills in |
| Style | Black background, cool white top light (spot `#dde8ff`, cool-white strip lights), inner part in gray metal, shell in the accent color (cosmic orange `rgb(255,107,41)`); ACES tone mapping at exposure 1.25, bloom, 0.022 grain, wordmark Inter 600 40px |

## Why it works

The internal parts and the shell dissolve in exact alignment, so viewers see where the chip sits inside the body. Orange bleeds in from the glow before it switches to the body, so color changes before shape and the transition has no hard jump. One camera position explains what is inside.

## Prompt

> Build a reveal of a product's internal structure called X-ray Dissolve. Black background, cool white top light, 24° fov, ACES tone mapping, bloom and light grain. Open with two oblique macro shots with a shallow depth of field: a chip close-up (0–2.1s, fading in from black over 0.7s) and the board with its camera modules (2.1–4.3s). Then cut to a frontal fixed camera on the chip: drift very slowly (about 2% of frame width per second, easing to rest) from 4.3 to 5.5s. From the same camera position, dissolve in the shell render at the same position: tint the chip's glow with the accent color (cosmic orange) over 4.85–5.65s, fade the shell in over 5.5–6.0s with power2.inOut (cubic-bezier(0.65,0,0.35,1)), and take the inner layer from 100% to 30% over 5.5–5.8s, hold 30% for 0.2s, then to 0% by 6.18s. From 6.0s pull back for 1.2 seconds with expo.out (cubic-bezier(0.16,1,0.3,1)) with a 4-frame run-up from zero velocity, scale 5x to 1x, with radial shutter blur, until the whole device is 70% of frame height. The vignette radius tightens during the pull-back, and the product name fades in 6.4–7.1s (power2.out, blur 6px→0). Settle with a slow push of 2.5% until 10s. The two renders must be aligned exactly.

## Often confused with

- [Light Reveal](./light-reveal.md): Light Reveal adjusts exposure; X-ray Dissolve switches between two images, the inner layer and the shell.
- [Macro Pull-out Reveal](./macro-pull-out-reveal.md): The first half of Macro Pull-out Reveal is continuous movement across one surface; X-ray Dissolve completes a layer dissolve before pulling back.

## Source files

Runnable HyperFrames project, 5 files.

- ../source/x-ray-dissolve/hyperframes.json (353 B)
- ../source/x-ray-dissolve/index.html (22.9 KB)
- ../source/x-ray-dissolve/internals.js (45.4 KB)
- ../source/x-ray-dissolve/package.json (303 B)
- ../source/x-ray-dissolve/strata.js (18.7 KB)

Read `../source/x-ray-dissolve/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
