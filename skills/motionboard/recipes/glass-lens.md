# Glass Lens

A transparent glass disc, loupe, or control moves over content, magnifying and refracting what lies beneath, with dispersion at the edge.

- Position in a launch film: Features
- Slug: glass-lens
- Preview video: https://media.motionboard.app/glass-lens.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/glass-lens/
- Film length: 10.8s, 1920x1080
- Original reference: Apple iOS 26 Liquid Glass (YouTube, 1:48) https://www.youtube.com/watch?v=jGztGfRujSE&t=108s
- Original reference: Apple iOS 26 Liquid Glass (YouTube, 1:32) https://www.youtube.com/watch?v=jGztGfRujSE&t=92s
- Original reference: Apple iOS 26 Liquid Glass (YouTube, 1:52) https://www.youtube.com/watch?v=jGztGfRujSE&t=112s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/glass-lens/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/glass-lens ./glass-lens`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A clear glass piece magnifying the text under it
- A magnifier following the cursor across a line of text
- As a glass button slides by, the content under it is magnified and warped

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10.8s. Phone rises 0-0.9s. Tab-bar lens: pop 1.45s, slide Home to Library 1.6-2.3s, release 2.25s. Plus tap 3.0s, sheet up 3.1-3.75s. Caret loupe: pop 4.05s, hops 4.45-4.85s and 4.85-5.25s, drop 5.3s. Toggle: lens pop 5.45s, drag 5.55-5.95s, drop 6.0s. Create tap 6.05s, Now Playing up 6.2-6.95s. Scrubber knob: pop 7.2s, drag 7.35-8.45s. Camera push 8.1-8.8s, crossfade to the wordmark 8.6-8.95s, final lens slides 8.7-10.8s |
| Easing | Pop-in `expo.out` 0.28s, magnification ramp `expo.out` 0.3-0.35s, lens moves `expo.out` (0.7s tab bar, 0.4s per caret hop, 0.4s toggle, 1.1s scrubber), release `power2.out` 0.26s, camera moves `expo.out` 0.7-0.95s with two `none` holds; the final lens drifts `none` over 2.1s. The glass and the content copy under it move in the same tween, same ease, same duration |
| Camera | A scaled stage, not a moving lens: scale 1.06 to 1.09, then pushes to 1.75 on the tab bar (0.95s), 1.8 hold, 1.15 on the sheet (2.45s), 2.3 on the caret line (3.6s), 2.9 on the toggle (5.1s), 1.1 pull-back (6.0s), 2.2 on the scrubber (6.95s), and 6.0 into the knob (8.1s), each 0.7-0.95s `expo.out`, centered on the control about to get glass |
| Subject | Glass is a scaled copy of the same content clipped to a pill with `saturate(1.2) contrast(1.03)`: tab bar 72x56 at 1.55x, caret loupe 132x58 at 1.7x, toggle 64x40 at 1.5x, scrubber knob 64x38 at 1.6x, final wordmark lens 440x262 at 1.28x. Each pops from scale 0.7-0.85 to 1.0-1.12; controls are solid at rest and turn to glass only while dragged |
| Sync | The glass and its content copy are offset in the same tween. On arrival (2.25s) the tab color, selection pill, screen swap and lens release happen on one frame. The toggle thumb, track color (green `#34c759` at 5.65s) and lens move together; the scrubber knob, fill and the elapsed and remaining time (0:41 to 2:41, -3:02 to -1:02, 7 steps) follow the lens |
| Style | Light gray radial background (`#f6f7f9` to `#dddfe5`) with a 12% edge vignette; dark phone body. Glass has a white top highlight, 1.2px conic-gradient rim (pink, amber, green, blue, violet), 3px pink left and blue right inner edge shadow, and a soft drop shadow. Final wordmark Inter 600, 250px, letter-spacing -0.05em, `#101114` |

## Why it works

Barrel distortion at the edge says "this is glass" more than the magnification inside the lens does. The transition tool is the material being introduced: on the frame where the camera pushes in until the glass fills the screen, the background flips from black to light gray-white, and the flip hides in the fully covered frame.

## Prompt

> Build a product tour film called Glass Lens, 10.8s on a light gray radial background (#f6f7f9 to #dddfe5, 12% edge vignette) with a phone UI that stays solid at rest and shows glass only on the control being dragged. Glass is a scaled copy of the same content clipped to a pill, with saturate(1.2) contrast(1.03), a white top highlight, a 1.2px conic-gradient rim (pink, amber, green, blue, violet) and 3px pink and blue inner edge shadows; the glass and the content copy beneath it move in one tween with the same ease and duration. Pop each lens in over 0.28s with expo.out (scale 0.7-0.85 to 1.0-1.12) while magnification ramps over 0.3s: tab bar lens 1.55x slides from Home to Library over 0.7s at 1.6s and releases at 2.25s on the same frame the tab, screen and selection change; a 132x58 caret loupe at 1.7x pops at 4.05s and hops line to line, 0.4s expo.out each, at 4.45s and 4.85s; a 64x40 toggle lens at 1.5x drags the thumb 20px over 0.4s at 5.55s while the track turns #34c759; a 64x38 knob lens at 1.6x drags the scrubber for 1.1s at 7.35s with the elapsed and remaining times stepping 7 times. Animate the camera as a scaled stage that centers on each control before its lens appears (1.09, 1.75, 1.15, 2.3, 2.9, 1.1, 2.2, each 0.7-0.95s expo.out), push to 6.0x at 8.1s, crossfade over 0.35s at 8.6s to a 250px Inter 600 wordmark (#101114, letter-spacing -0.05em), and slide a 440x262 lens at 1.28x across it by 150px over 2.1s with ease: "none".

## Often confused with

- [Glass Droplet Split](./glass-droplet-split.md): Glass Droplet Split shows glass deforming and breaking apart; Glass Lens shows glass refracting and magnifying the content below it.
- [Match Cut](./match-cut.md): Match Cut swaps in another object at the same anchor; Glass Lens flips the scene on the one frame where the lens fills the screen.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/glass-lens/hyperframes.json (318 B)
- ../source/glass-lens/index.html (37.9 KB)
- ../source/glass-lens/package.json (299 B)

Read `../source/glass-lens/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
