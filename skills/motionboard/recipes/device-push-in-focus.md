# Device Push-in Focus

A line-art 3D laptop turns upright while closed, opens, pushes in on the keyboard, then pans from key to key in step with the option selected in the UI beside it.

- Position in a launch film: Product reveal
- Slug: device-push-in-focus
- Preview video: https://media.motionboard.app/device-focus.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/device-push-in-focus/
- Film length: 10s, 1920x1080
- Original reference: ARION 输入法 onboarding (YouTube, 0:00) https://www.youtube.com/watch?v=ARION
- Original reference: 本地复刻预览 (YouTube, NaN:NaN) https://www.youtube.com/watch?v=LOCAL

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/device-focus/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/device-focus ./device-focus`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The camera moves across the laptop to the key for each option
- The laptop closes, opens, then pushes in on the keyboard
- Pick a setting and its key lights up

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10s. Intro: laptop rises 0–0.5s, turns upright while closed 0.5–1.2s (0.7s, 21 frames), lid opens 1.2–1.75s (0.55s, 17 frames), push-in on keyboard 1.6–3.2s (1.6s, 48 frames). Then three key groups: ⌥+Space highlight 3.3s, press 3.8s, off 5.0s; pan 5.0–5.8s (0.8s, 24 frames), ⌘+⇧+K highlight 5.6s, press 6.0s, off 7.2s; pan 7.2–8.0s (0.8s), fn highlight 7.8s, press 8.2s |
| Easing | Push-in and every pan `cubic-bezier(0.16,1,0.3,1)` (expo.out); yaw, lid opening and camera retarget easeInOutCubic; rise easeOutCubic; highlight fade 0.2s easeInOutCubic |
| Camera | Perspective camera, 22° fov telephoto, fixed viewing direction (0.62, 0.78, 0.9); yaw turns from 35° to 0°, the screen lid opens 0°→112°; the push-in dollies 150→60 units onto the ⌥+Space span, then pans to the ⌘+⇧+K span (dolly 70) and to fn (dolly 30) |
| Subject | Each key sinks 0.22 units in a 0.25s press (0.08s down, 0.17s easeOutBack return); highlighted keys go from white to yellow, pressed keys darken to `#e5b92f`; the pan target is the key group of the option just selected |
| Sync | The dropdown selects at 4.95s and 7.15s and the pan starts 0.05s later; key highlight lands 0.6s into the pan (5.6s, 7.8s), the press 0.4s after that (first group 0.5s) |
| Style | White material with gray outlines (`#a9a9a9` body 2.2px, `#b8b8b8` keys 1.8px at 2x pixel ratio), yellow accent `#f6c83e` (highlight `#f6d45a`); 3D on the left (760px), UI on the right |

## Why it works

The key highlight and the dropdown selection on the right happen on the same frame, so viewers link each key to its setting at a glance. A long telephoto lens flattens perspective, so the keys stay flat and readable after the push-in. The material is white with a 1.2px dark gray outline, and yellow is the only color in the frame.

## Prompt

> Build an input-method onboarding demo called Device Push-in Focus. Split the page: 3D on the left (760px), UI on the right. The left side is a line-art 3D laptop with white material, gray outlines (2.2px body, 1.8px keys at 2x pixel ratio), accent color yellow #f6c83e, and a Three.js perspective camera with a 22° fov (telephoto) looking along a fixed direction (0.62, 0.78, 0.9). Sequence: the laptop rises in over 0.5s, turns yaw from 35° to 0° while closed over 0.7s, opens the screen lid from 0° to 112° over 0.55s (easeInOutCubic for both), then the camera pushes in on the keyboard over 1.6s (expo.out, dolly 150→60 units) and the keys for the current option light up in yellow (0.2s). After a 0.5s hold the key sinks 0.22 units and springs back (0.25s). When the dropdown on the right selects a new option, pan the camera to the matching key group over 0.8s (expo.out) starting right after the selection; the new keys highlight 0.6s into the pan and press 0.4s after that. Pan targets are ⌥+Space, then ⌘+⇧+K, then fn.

## Often confused with

- [Macro Pull-out Reveal](./macro-pull-out-reveal.md): Device Push-in Focus serves one UI choice after another, each pan finishing within 0.8s; Macro Pull-out Reveal is one long shot that ends by pulling out to the whole device.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/device-focus/hyperframes.json (353 B)
- ../source/device-focus/index.html (25.1 KB)
- ../source/device-focus/package.json (301 B)

Read `../source/device-focus/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
