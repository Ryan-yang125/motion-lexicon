# Glass Droplet Split

A glass slab stretches into a droplet, its neck thins and breaks, leaving a round bead. A dispersive glass ring contracting inward is the sibling form.

- Position in a launch film: Transitions
- Slug: glass-droplet-split
- Preview video: https://media.motionboard.app/glass-droplet-split.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/glass-droplet-split/
- Film length: 10s, 1920x1080
- Original reference: Apple iOS 26 Liquid Glass (YouTube, 1:44) https://www.youtube.com/watch?v=jGztGfRujSE&t=104s
- Original reference: Apple AirPods Pro 3 (YouTube, 0:04) https://www.youtube.com/watch?v=EMmKs8vMKhU&t=4s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/glass-droplet-split/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/glass-droplet-split ./glass-droplet-split`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A glass piece stretches into a droplet and then breaks off
- A drop of glass separating from a large piece
- A rainbow-edged ring closing in toward the middle

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10s. Slab arc slide 0-1.2s, stand up and stretch 1.2-2.2s, neck thins 2.12-2.41s and breaks at 2.41s, bead hovers 2.45-3.45s, bead opens into a ring 3.45-3.75s, ring contracts 3.75-4.55s, settling jitter 4.55-6.75s, ring gathers into a logo bead 6.75-7.35s, wordmark 7.42s and subline 7.8s hold to 10s |
| Easing | Stretch and rotate `cubic-bezier(0.65,0,0.35,1)`; break rebound `cubic-bezier(0.34,1.56,0.64,1)` over 0.5s; ring contraction `cubic-bezier(0.16,1,0.3,1)` over 0.8s; ring gather `cubic-bezier(0.65,0,0.35,1)` over 0.6s; wordmark and subline `expo.out` (0.9s, 0.8s) |
| Camera | Perspective camera (15 degree field) arcs from 101.5 to 90 degrees at radius 1500 over 0-1.2s with ease `1-(1-t)^1.6` while pulling back 200 units, then holds fixed until a 3% push 7.35-10s with `sine.inOut` |
| Subject | A thin glass slab (thickness 0.085 of its width) slides along an arc and rotates upright from 54 degrees about its long axis and -68 degrees roll to 0, thickening to 0.5 and scaling 1 to 1.3. Its lower end stretches to a droplet (lower radius 150 to 270, tip down to -700), the neck thins from radius 18 to 1.6, then breaks at 2.41s with a flash; the lower body falls away and a bead (radius 150 shrinking to 70, about 54px below frame center) swells 5% and rebounds 8% vertically. At 3.45s the bead opens into a ring that contracts from radius 1000 to 350 with tube radius 120 to 34, jitters 5px at 5.5Hz and sprouts up to 18 spikes of 90-240px, then collapses into a 86px logo bead 310px left of center |
| Style | Background `#04060b` with a navy radial pool, a faint grid with crosshairs and ten blurred notification cards (fade in 3.45s) behind the glass; Focus caption 4.35-4.95s. Raymarched glass, IOR 1.47, RGB spread 0.016 growing to 0.12 on the ring, edge highlight only, no fill, no drop shadow, 30% vignette. Wordmark Inter 600 180px, letter-spacing -0.035em, `#eef1f7`; subline Inter 400 28px `#8790a3` |

## Why it works

On an all-black background, a single highlight along the glass edge outlines the shape, with no fill and no shadow. The stretch and break follow surface tension, and the bead rebounds about 5% at the moment of separation; this bead becomes the prototype of the button that follows. The ring version separates the spikes outside the ring from the quiet text inside it, so the graphic itself explains noise reduction.

## Prompt

> Build an abstract graphic called Glass Droplet Split, 10s. Background #04060b with a navy radial pool, a faint grid and ten blurred notification cards that fade in at 3.45s behind the glass. Render raymarched glass (IOR 1.47, RGB spread 0.016), outlined by an edge highlight only, with no fill and no shadow. A thin slab slides along an arc over 1.2s while a perspective camera arcs from 101.5 to 90 degrees and pulls back 200 units (ease 1-(1-t)^1.6), then rotates upright from 54 degrees tilt and -68 degrees roll to 0 over 1.2-2.2s with cubic-bezier(0.65,0,0.35,1), thickening and scaling 1.3x. Its lower end stretches into a droplet, the neck thins from radius 18 to 1.6 starting at 2.12s, and it breaks at 2.41s with a flash; the lower body falls away and the bead swells 5% and rebounds 8% vertically with cubic-bezier(0.34,1.56,0.64,1) over 0.5s, then hovers below center until 3.45s. The bead then opens into a ring (3.45-3.75s) that contracts over 0.8s with cubic-bezier(0.16,1,0.3,1) from radius 1000 to 350 while RGB spread rises to 0.12 and the edge turns iridescent, jitters 5px at 5.5Hz until 6.75s with up to 18 spikes, and collapses over 0.6s into a logo bead 310px left of center. Fade the wordmark in at 7.42s (blur 10px to 0, x -18 to 0, 0.9s expo.out) with a subline at 7.8s, and push the camera in 3% over 7.35-10s with sine.inOut.

## Often confused with

- [Glass Lens](./glass-lens.md): Glass Lens emphasizes refraction of content; Glass Droplet Split emphasizes the glass stretching and breaking.
- [Branching Growth](./branching-growth.md): Branching Growth grows a multi-level structure outward from a point; Glass Droplet Split is one shape shedding one bead.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/glass-droplet-split/hyperframes.json (318 B)
- ../source/glass-droplet-split/index.html (37.4 KB)
- ../source/glass-droplet-split/package.json (308 B)

Read `../source/glass-droplet-split/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
