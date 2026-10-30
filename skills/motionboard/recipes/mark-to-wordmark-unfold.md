# Mark-to-Wordmark Unfold

A logo mark sits centered, then the wordmark unfolds from behind it or outward from its center, optionally with a scramble-then-lock effect.

- Position in a launch film: Ending
- Slug: mark-to-wordmark-unfold
- Preview video: https://media.motionboard.app/mark-to-wordmark.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/mark-to-wordmark-unfold/
- Film length: 9.4s, 1920x1080
- Original reference: Linear 发布片 (YouTube, 0:00) https://www.youtube.com/watch?v=lKwyrKUEPS4
- Original reference: Claude Fable 5.1 (YouTube, 1:19) https://www.youtube.com/watch?v=ROF2Nv_KjOM&t=79s
- Original reference: Arc Boosts (YouTube, 0:38) https://www.youtube.com/watch?v=N0jMmiCS8oQ&t=38s
- Original reference: Stripe Sessions 2024 (YouTube, 0:05) https://www.youtube.com/watch?v=KH0_HM6e66w&t=5s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/mark-to-wordmark/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/mark-to-wordmark ./mark-to-wordmark`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The logo appears first, then the brand name grows out
- The mark slides aside and the name pulls out from behind it
- The name pops out letter by letter from the middle to both sides

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 9.4s: product window shot 0–3.6s (drift 0–2.6s, push 2.6–3.6s); mark hand-off 3.6s; accent half leans back 3.75–4.05s and returns 4.15–5.05s; mark moves left and the wordmark unfolds 4.15–5.45s (1.3s), letters from 4.2s at 0.08s stagger (1.25s each); tagline 6.3s (0.8s); slow push 3.6–9.4s |
| Easing | Unfold and push `cubic-bezier(0.16,1,0.3,1)` (expo.out); the mark moves `x 322→0` while a `clip-path` left edge slides 250px→−72px; letters go from blur 12px→0 and opacity 0→1 (0.4s `power1.out`); the accent half `rotation 0→−20°` with `power2.out` 0.3s, then back with `back.out(2.2)` 0.9s |
| Camera | Product window at an angle (perspective 1600px): `rotationY` 9°→5.5°, `rotationX` −5°→−3°, `rotation` −1.4°→−0.7°, `scale` 1.06→1.16 over 2.6s `linear`; then a 1.0s `expo.out` push to about 12.6x (328/26) with the tilt flattened to 0, centering the sidebar mark; the lockup then drifts `scale` 1→1.05 over 5.8s |
| Subject | Shot 1: an issue-tracker window (3 groups, 17 rows fading in with 0.022s stagger, headers 0.12s) with a selection highlight stepping at 1.15s and 1.95s and a 'link copied' toast 1.4–2.3s, whose workspace logo is a 26×16.5px mark. Shot 2: that mark at 328×208px (two quarter discs, ink and accent) slides left by 322px while the 4-letter wordmark (286px, weight 600) is revealed from behind it letter by letter |
| Sync | The window mark and the vector mark swap on the same frame (3.6s) at the same size and position; the clip edge follows the mark's right edge; letters start 0.05s after the mark begins moving; the UI fades over the first 0.4s of the push |
| Style | Warm light `#efece4` background, ink `#14130f` wordmark, accent `#ff4a1f` on one half of the mark; tagline in 22px monospace with 0.26em tracking; soft vignette |

## Why it works

The mark and the name are bound into one action: the wordmark is pulled out from behind the mark, or the mark stays put while the other letters grow around it. Scrambled characters appear only on the newly added position, and the other letters stay stable. The opening and the ending can use the same move, one in black and one in white.

## Prompt

> Build a brand ending called Mark-to-Wordmark Unfold. Start on a product window (an issue list) tilted in 1600px perspective (rotationY 9 to 5.5 degrees, rotationX -5 to -3, scale 1.06 to 1.16 over 2.6s with linear ease), then push 1.0s with expo.out about 12.6x into the small logo mark in its sidebar while the tilt flattens and the UI fades, so the mark fills the frame at 328px on a warm light background (#efece4). Hand off to a vector mark of two quarter discs (ink and orange) on the same frame. The orange half leans back -20 degrees over 0.3s and returns with back.out(2.2). Then the mark slides left 322px over 1.3s with expo.out while the four-letter wordmark is revealed by a clip-path edge that follows the mark's right side, each letter sliding out from behind the mark 0.08 seconds apart and going from blur 12px to sharp over 1.25s. Fade in a monospace tagline at 6.3s, and keep a slow scale push from 1 to 1.05 through the hold.

## Often confused with

- [Chromatic Stretch](./chromatic-stretch.md): Chromatic Stretch locally distorts the wordmark itself with RGB ghosting; Mark-to-Wordmark Unfold is about the order in which the mark and the wordmark appear.
- [Foreground Wipe & Flash](./foreground-wipe-flash.md): Foreground Wipe & Flash is a transition between scenes; Mark-to-Wordmark Unfold is often followed by a white flash.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/mark-to-wordmark/hyperframes.json (318 B)
- ../source/mark-to-wordmark/index.html (26.5 KB)
- ../source/mark-to-wordmark/package.json (305 B)

Read `../source/mark-to-wordmark/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
