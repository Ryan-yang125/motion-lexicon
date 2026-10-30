# Converge to Mark

At the end, multiple elements gather and compress into a single icon or logo, always centered in the frame.

- Position in a launch film: Ending
- Slug: converge-to-mark
- Preview video: https://media.motionboard.app/converge-to-mark.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/converge-to-mark/
- Film length: 10.6s, 1920x1080
- Original reference: Apple AirPods Pro 3 (YouTube, 0:38) https://www.youtube.com/watch?v=EMmKs8vMKhU&t=38s
- Original reference: Notion Calendar (YouTube, 1:12) https://www.youtube.com/watch?v=C4Q2ezioTUM&t=72s
- Original reference: Linear 发布片 (YouTube, 0:00) https://www.youtube.com/watch?v=lKwyrKUEPS4
- Original reference: Dia (YouTube, 1:03) https://www.youtube.com/watch?v=YVOw0TAO9ok&t=63s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/converge-to-mark/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/converge-to-mark ./converge-to-mark`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Everything shrinks into one icon at the end
- The scattered icons fly to the middle and become the logo
- The text shrinks to a dot of light, then becomes the mark

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10.6s. Workspace demo 0–6.2s; the pieces drift down from 5.0s (1.2–1.5s, about 4–5% of frame height); converge from 6.2s: each piece starts 0–0.55s after 6.2s and takes 0.65–0.95s (20–29 frames); chrome leaves 6.2–6.7s, wallpaper washes to white 6.4–7.4s; mark lands 7.32s and settles over 0.65s (20 frames); wordmark pulls out 8.05–9.3s, tagline 8.9–9.7s, held to 10.6s |
| Easing | Drift `linear`; converge position on `cubic-bezier(0.32,0,0.67,0)` (power3.in, faster as they get closer) for one axis and power2.in for the other, so paths curve; scale power2.in, rotation power1.in, opacity fade power1.in over the last 35%; mark landing back.out(2.1); wordmark and tagline `cubic-bezier(0.16,1,0.3,1)` (expo.out) |
| Camera | Fixed frame, target icon at the center (960, 540). Slow push 1.00→1.035 linear over 0–6.2s (x −14px, y −6px), back to 1.0 over 6.2–7.1s with power2.inOut; after landing the lockup pushes 1.00→1.04 linear over 3.0s from 7.6s |
| Subject | 17 pieces drift down, then gather on the center: 4 windows, a timer, a notification, a picture-in-picture, a command palette, 2 collaborator cursors, and 7 dock icons; they scale to 0.07–0.4, rotate 6–30° and fade out in their last 35%; the dock's own Tessel icon travels at full scale and the 200px mark takes over from it at the same size, leaving only the mark |
| Style | Light base `#f5f5f7` under a pastel wallpaper (peach, pink, blue, lilac) that washes to white; white windows with 12px radius and soft violet shadows; indigo accent `#5b5bf0` (icon gradient `#8a8cff` → `#3d31d6`) with four white tiles and one amber tile; faint violet vignette |

## Why it works

A slow drift followed by a fast gather contrasts speeds and gives a clear end point. The shape loses detail step by step, from a concrete product to geometry to a brand mark, while its position stays at the center of the frame without jumping. When the ending uses the same technique as the opening, the film closes on itself.

## Prompt

> Build an ending called Converge to Mark as a 10.6-second film. Build a product workspace on a light #f5f5f7 base with a pastel wallpaper: four white windows, a timer, a notification, a picture-in-picture, a command palette, two collaborator cursors, and a dock of 7 app icons with your icon in the middle; run a short demo for 6.2 seconds with a slow linear push (scale 1.00→1.035). From 5.0s drift every piece down at constant speed (34px per second). At 6.2s the menu bar and dock background leave over 0.5s, the wallpaper washes to white over 1.0s, and every piece travels to the center of the frame (960, 540): each starts 0–0.55 seconds after 6.2s and takes 0.65–0.95 seconds, with power3.in on one axis and power2.in on the other, scaling to 0.07–0.4 (windows 0.07–0.09), rotating 6–30° and fading out over the last 35%. The dock icon of your product travels at full scale and a 200px version takes over at the same size at 7.32s, landing with back.out(2.1) over 0.65 seconds with a glow ring behind it. At 8.05s the mark slides left while the wordmark is pulled out from behind it over 1.25 seconds with expo.out (cubic-bezier(0.16,1,0.3,1)), blur 10px→0, then the tagline fades in at 8.9s; push the lockup 4% and hold to 10.6s. Build it with HTML/SVG + GSAP.

## Often confused with

- [Rotate to Lockup](./rotate-to-lockup.md): Converge to Mark gathers many elements to a point; Rotate to Lockup turns one object to a target angle.
- [Dispense Line-up](./dispense-line-up.md): The retract in Dispense Line-up only returns to the original subject; Converge to Mark ends on a new icon or logo.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/converge-to-mark/hyperframes.json (318 B)
- ../source/converge-to-mark/index.html (63.4 KB)
- ../source/converge-to-mark/package.json (305 B)

Read `../source/converge-to-mark/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
