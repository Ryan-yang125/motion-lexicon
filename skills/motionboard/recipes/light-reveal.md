# Light Reveal

The product emerges from pure black as exposure rises, with a barely perceptible push-in, and the closing shot runs the same move in reverse.

- Position in a launch film: Opening
- Slug: light-reveal
- Preview video: https://media.motionboard.app/light-reveal.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/light-reveal/
- Film length: 11s, 1920x1080
- Original reference: Apple iPhone 17 Pro (YouTube, 0:00) https://www.youtube.com/watch?v=TNhX1uR2vO8
- Original reference: Apple iPhone 17 Pro (YouTube, 0:47) https://www.youtube.com/watch?v=TNhX1uR2vO8&t=47s
- Original reference: Nothing Phone (3) (YouTube, 0:25) https://www.youtube.com/watch?v=MHGQRnvE9GQ&t=25s
- Original reference: Apple A19 Pro 芯片 (YouTube, 0:53) https://www.youtube.com/watch?v=dJObc0V6hJU&t=53s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/light-reveal/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/light-reveal ./light-reveal`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The product lights up out of the dark
- Slowly fades up from black
- Three phone colors light up together

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. Rim light on 0.0–0.4s; fade-up 0.4–1.6s (1.2s, 36 frames); hold with slow push 1.6–4.4s (2.8s, 84 frames). Cut at 4.4s to three colorways: each fades up over 1.5s (45 frames), 0.1s apart from the left, starting 4.55s; cut back to the single phone at 7.0s; fade-out in reverse 7.35–8.55s (1.2s, 36 frames), rim light off 8.55–8.9s; wordmark 8.78–9.58s, held to 11s |
| Easing | Fade-up and fade-out `cubic-bezier(0.65,0,0.35,1)` (power2.inOut); rim light and the hold push use sine.inOut; multi-color fade-up `cubic-bezier(0.16,1,0.3,1)` (expo.out); wordmark power2.out |
| Camera | Perspective, 24° fov. Single-phone shot: close-up on the camera bar from slightly above, distance 13 units, push-in during the hold scale 1.00→1.03, no depth of field. Three-color shot: straight-on at distance 47 units, push-in 1.00→1.015 linear over 4.4–7.0s |
| Subject | A 3D phone (Three.js) that never moves. Exposure runs from 3.5% to 100% on one power2.inOut curve applied per material in order: lens glass and optics 0–0.55 of the curve, flash 0.18–0.72, metal edges and camera bar 0.30–0.95, back glass 0.45–1.0. Three colorways, left to right: silver, orange, blue, 8.7 units apart |
| Style | Pure black background. Rim pass: one hard strip light high and behind on the right, grazing the top and right edges. Key pass: large soft box upper left plus a hard strip on the right. ACES tone mapping at exposure 1.25, bloom, 0.28 vignette, 0.022 film grain; wordmark in Inter 600 76px, `#ecebe8`, blur 6px→0 |

## Why it works

The reveal comes from light alone, with no fade or cross-dissolve. The camera hole, flash, and edge reflections appear in sequence, and the different reflections of each material (silver, orange, deep blue) show up one by one during the fade-up. The opening and the closing use the same camera position, so the film starts and ends on the same frame.

## Prompt

> Build a product opening called Light Reveal. Pure black background, one phone in a close-up on its camera bar (24° fov, distance 13 units, from slightly above). Render two light passes and add them: a rim pass (one hard strip light high and behind on the right, grazing the top and right edges) that fades in over 0–0.4s, and a key pass (large soft box upper left plus a hard strip on the right) that starts at 3.5% and rises to 100% over 1.2 seconds (0.4–1.6s) with power2.inOut (cubic-bezier(0.65,0,0.35,1)). Stage that one curve per material: the camera lenses first, then the flash, then the metal edges and camera bar, and the back glass last, with no fade or cross-dissolve. Hold for 2.8 seconds (1.6–4.4s) and push in slowly by 3% (scale 1.00→1.03, sine.inOut); the phone does not move. At 4.4s cut to a straight-on shot of three colorways (silver, orange, blue) 8.7 units apart; starting 4.55s each fades up over 1.5 seconds with expo.out (cubic-bezier(0.16,1,0.3,1)), 0.1 seconds after the previous one from the left, while the camera pushes in 1.5% linearly. At 7.0s cut back to the single phone and run the key light down in reverse over 1.2 seconds (7.35–8.55s), then turn the rim light off over 8.55–8.9s. The wordmark fades in over 8.78–9.58s (power2.out, blur 6px→0, y 8px→0) and holds to 11s. Use ACES tone mapping, bloom, a 0.28 vignette, 0.022 grain, and no depth of field. Build it with Three.js (MeshPhysicalMaterial, per-material envMapIntensity) driven by a seekable time function, with GSAP for the wordmark.

## Often confused with

- [Rotate to Lockup](./rotate-to-lockup.md): Light Reveal keeps the subject still and changes only the light; Rotate to Lockup turns the object to a target angle.
- [X-ray Dissolve](./x-ray-dissolve.md): X-ray Dissolve switches between an inner layer and an outer shell, while Light Reveal only adjusts exposure.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/light-reveal/hyperframes.json (353 B)
- ../source/light-reveal/index.html (34.4 KB)
- ../source/light-reveal/package.json (301 B)

Read `../source/light-reveal/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
