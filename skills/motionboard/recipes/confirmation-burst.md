# Confirmation Burst

On the frame of a tap, payment, or confirmation, lines, squares, and dots radiate from the contact point, or an icon pops with a bounce and an echo outline expands.

- Position in a launch film: Features
- Slug: confirmation-burst
- Preview video: https://media.motionboard.app/confirmation-burst.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/confirmation-burst/
- Film length: 11s, 1920x1080
- Original reference: Stripe Reader S700 (YouTube, 0:44) https://www.youtube.com/watch?v=9oieNo53aNY&t=44s
- Original reference: Stripe Reader S700 (YouTube, 1:06) https://www.youtube.com/watch?v=9oieNo53aNY&t=66s
- Original reference: Arc Boosts (YouTube, 0:33) https://www.youtube.com/watch?v=N0jMmiCS8oQ&t=33s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/confirmation-burst/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/confirmation-burst ./confirmation-burst`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A burst of small shapes around the spot you tap
- Lines, squares, and dots pop out when a payment succeeds
- The confirmation icon pops and a ring of outline spreads out

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. Keypad taps at 1.0, 1.22, 1.44 and 1.66s; fragment burst on the Review tap at 2.65s (expand 0.3s, drift to 0.64s, fade 0.64-0.8s); review screen takes over at 3.0s; Pay tap at 5.1s, button disabled state 5.1-5.3s, icon pops at 5.45s (scale 0.6 to 1.1 in 0.28s, to 1.0 in 0.24s), outline ring 0.6s in parallel; phone leaves 8.0s; wordmark 8.45s |
| Easing | Fragments expand `expo.out` 0.3s, then drift linearly 12px over 0.5s and fade `power1.in` 0.16s; icon scale `power3.out` 0.6 to 1.1, then `power2.inOut` 1.1 to 1.0; outline scale `power2.out` 1 to 3 and opacity `power2.in` 0.6 to 0 over 0.6s; check stroke `power2.out` 0.24s; button disable `power1.out` 0.2s |
| Camera | Not fixed: slow push 1.18 to 1.215 until 1.9s, then an `expo.out` push to 1.7 anchored on the Review button (0.6s from 2.0s) so the burst fills the lower frame; pull-back to 1.42 at 3.0s (0.9s), drift to 1.5 by 5.25s, 1.3 at 5.53s (1.0s) drifting to 1.36. A 54px touch indicator travels to each target and presses (scale 0.78 in 0.06-0.07s, back in 0.14-0.16s) |
| Subject | Burst: 6 elements leave the tap point upward and sideways at angles -26, -78, -156, -128, -52 and -104 degrees: a white line with navy outline, a navy line, a blue line, a navy wavy line, a white dot and a blue square, travelling 96-120px (about 20% of frame height at camera scale 1.7). Icon: after the Pay button turns into a disabled Sending state with a spinner, a 132px scalloped blue seal with gradient, inner highlight and shadow and a white check stroke pops in with a same-shape outline expanding behind it |
| Sync | The burst and the button press (scale 0.965) share the tap frame at 2.65s and the review screen takes over 0.35s later; for the icon, the disabled state starts on the tap at 5.1s and the icon pops 0.35s later, with the same button turning into Done on that frame |
| Style | Navy backdrop `#0b1b6a` with blurred bank notification cards (fade out at 8.0s), white phone UI, brand blue `#1e45d6` and fragments in navy `#0b1b6a`, blue `#2a58ee` and white; icon gradient `#86a4ff` to `#1530b4`; wordmark Inter 700 168px, letter-spacing -0.055em, white |

## Why it works

Graphics appear only on key action frames such as a tap or a successful payment, which marks the key moments of the product. The fragments share shapes and colors with the maps and feature cards used elsewhere in the film. The confirmation icon has thickness and highlights that contrast in material with the flat interface, and the expanding outline reuses the same shape.

## Prompt

> Emphasize a successful tap with a shot called Confirmation Burst, 11s, on a phone money-transfer UI over a navy backdrop (#0b1b6a) with blurred notification cards. Tap the keypad at 1.0, 1.22, 1.44 and 1.66s, then push the camera with expo.out to 1.7 anchored on the Review button (0.6s from 2.0s). On the tap frame at 2.65s, press the button to 0.965 and a 54px touch indicator to 0.78, and send 6 elements from the contact point upward and sideways at angles -26, -78, -156, -128, -52 and -104 degrees: a white line with a navy outline, a navy line, a blue line, a navy wavy line, a white dot and a blue square rotating 45 to 135 degrees. They expand 96-120px (about 20% of frame height) over 0.3s with expo.out, drift 12px more over 0.5s, and fade over 0.16s from 0.64s. Switch to the review screen 0.35s later. Icon version: at the Pay tap (5.1s) fade the button to a disabled Sending state with a spinner over 0.2s with power1.out, hold 0.15s, then pop a 132px scalloped blue seal (gradient #86a4ff to #1530b4, inner highlight and shadow, white check stroke drawn in 0.24s) from scale 0.6 to 1.1 with power3.out over 0.28s and back to 1.0 with power2.inOut over 0.24s, while an outline of the same shape goes scale 1 to 3 with power2.out and opacity 0.6 to 0 with power2.in over 0.6s, the same button turning into Done. Take the phone out at 8.0s and bring in a white Finch wordmark lockup at 8.45s.

## Often confused with

- [Map Pin Drop](./map-pin-drop.md): Map Pin Drop's fragments appear at the pin's landing position; Confirmation Burst's fragments appear at the tap contact point.
- [Match Cut](./match-cut.md): Match Cut swaps the whole object for another; Confirmation Burst only overlays feedback graphics on the existing picture.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/confirmation-burst/hyperframes.json (318 B)
- ../source/confirmation-burst/index.html (40.6 KB)
- ../source/confirmation-burst/package.json (307 B)

Read `../source/confirmation-burst/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
