# Outline to Solid

A wireframe or light-drawn outline appears first, then fills into a solid shape or material.

- Position in a launch film: Product reveal
- Slug: outline-to-solid
- Preview video: https://media.motionboard.app/outline-to-solid.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/outline-to-solid/
- Film length: 11s, 1920x1080
- Original reference: Apple Vision Pro (YouTube, 0:01) https://www.youtube.com/watch?v=7B-rzR2avR0&t=1s
- Original reference: Vercel v0 (YouTube, 0:00) https://www.youtube.com/watch?v=By9wCB9IZp0

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/outline-to-solid/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/outline-to-solid ./outline-to-solid`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Draws the outline first, then fills it in solid
- A light draws the product's shape in one stroke
- A wireframe turns into a solid logo

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. Product shot 0–8.2s: light point fades in 0.45–1.0s, outline draw 1.0–4.0s (3.0s, 90 frames), solid body fades in 3.3–4.8s (1.5s, 45 frames, overlapping the last 0.7s of the draw), wide highlight 3.8–5.3s (peaks 0.5s, 15 frames, after the body), outline fades to 14% 4.6–5.7s, LED 5.5–6.1s, still, then push 6.3–8.2s. Short logo version 8.2–11.0s (2.8s): wireframe 8.22–8.62s (0.4s) + fill wipe 8.66–9.26s (0.6s) |
| Easing | Outline draw `cubic-bezier(0.65,0,0.35,1)` (power2.inOut: slow, then fast, then slow); body and highlight fade in on the same curve; light point and outline fade sine.inOut; push power2.in; the fill wipe uses power2.inOut |
| Camera | Perspective, 18° fov, fixed camera; still until 6.3s (1.0s after the highlight peak), then a slow push-in of 5% (scale 1.00→1.05) to 8.2s |
| Subject | A light point starts at the top center and two heads extend symmetrically to both sides, drawing the full outline down to the bottom center; line about 1.5px (tube radius 0.0105 units) with bloom and a halo on the heads; the solid body fades in inside the outline, and the brightest wide highlight (a separate light pass) comes last |
| Style | Pure black background, cool white line (`rgb(214,235,255)`), ACES tone mapping at exposure 1.2, bloom, 0.016 grain; the logo version uses a white background with a gray wireframe (`#b4b4b6`, 1.5px), a black solid (`#0b0b0c`) wiping in from left to right, and construction lines at 10% opacity |

## Why it works

The shape comes before the material, so the first thing viewers remember is the silhouette. The light stays the only light source, and when the solid appears its highlight sits where the light comes from. The wireframe stage has very low opacity, so it does not compete with the solid that follows.

## Prompt

> Build a product opening called Outline to Solid. Pure black background, 18° fov fixed camera. A point of light fades in at the top center over 0.45–1.0 seconds, then from 1.0s two heads extend symmetrically to both sides, tracing the full outline of your product down to the bottom center, with line width about 1.5px and bloom plus a halo on the heads. The outline draw uses power2.inOut (cubic-bezier(0.65,0,0.35,1)) and takes 3 seconds. When the outline is nearly closed (3.3s), the solid product fades in inside it over 1.5 seconds, and the wide highlight, a separate light pass from above, reaches full brightness 0.5 seconds after the body (3.8–5.3s). The outline fades to 14% over 4.6–5.7s and a small LED comes on at 5.5–6.1s. Then hold still until 6.3s and push in slowly by 5% (power2.in) until 8.2s. For a logo (a 2.8-second cut on white): fade in a gray wireframe and 10%-opacity construction lines over 0.4 seconds, then wipe in a black solid from left to right over 0.6 seconds with power2.inOut, fade the wireframe and construction lines out, and scale the lockup 1.00→1.03 across the cut.

## Often confused with

- [Light Reveal](./light-reveal.md): Light Reveal raises overall exposure; Outline to Solid shows the line first, then the solid.
- [Rotate to Lockup](./rotate-to-lockup.md): Rotate to Lockup aligns to the target by rotating; Outline to Solid changes the material from line to surface.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/outline-to-solid/hyperframes.json (318 B)
- ../source/outline-to-solid/index.html (48.4 KB)
- ../source/outline-to-solid/package.json (305 B)

Read `../source/outline-to-solid/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
