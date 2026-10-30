# Match Cut

One object is replaced by another at the same anchor point, so the viewer's gaze never moves.

- Position in a launch film: Transitions
- Slug: match-cut
- Preview video: https://media.motionboard.app/match-cut.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/match-cut/
- Film length: 10s, 1920x1080
- Original reference: Apple Vision Pro (YouTube, 0:41) https://www.youtube.com/watch?v=7B-rzR2avR0&t=41s
- Original reference: Apple A19 Pro 芯片 (YouTube, 0:55) https://www.youtube.com/watch?v=dJObc0V6hJU&t=55s
- Original reference: Stripe Reader S700 (YouTube, 0:19) https://www.youtube.com/watch?v=9oieNo53aNY&t=19s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/match-cut/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/match-cut ./match-cut`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The product shrinks back into place and becomes worn on a face
- Something else takes the same position
- A pin on a map becomes a pin in real street view

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 10s. Hard cuts at 2.0, 3.0, 3.75, 4.4 and 5.05s. Scene 1 push-in 0-1.3s then drift to 2.0s; popover opens 2.0s; status swap 3.3s; badge lands 3.75s; mic swap 4.6s; scene 6 cards from 5.2s, cursor 6.25-6.8s, click swap 6.85s; product fades 7.4s; avatar to center 7.45-8.55s; wordmark 8.1s; hold to 10s |
| Easing | Cuts are hard (opacity flips in one frame, no cross-fade); scene 1 push-in `expo.out` 1.3s; every scene then drifts 3% (scene 6: 5%) with `ease: "none"`; popover `expo.out` 0.4s; badge scale 0.6 to 1 `expo.out` 0.35s; cards `expo.out` 0.5s, 0.16s stagger; cursor `expo.out` 0.55s; press scale 0.88 `power2.out` 0.08s; avatar to center `expo.out` 1.1s |
| Camera | Each scene is a UI sheet whose own avatar is scaled to exactly 112px and centered on the shared anchor (780, 450), so the face stays still while everything around it changes; only the opening wide shot scales (0.55x to 1x); end card holds the avatar at 1.45x drifting to 1.5x |
| Subject | One orange avatar (`#e8734a`, 112px, initials MC) fixed at the anchor through six app scenes: team chat, calendar invite, issue tracker, pull request review, video call, and the product Kite, where cards fade up and a cursor clicks Approve. In the end card the avatar moves 40px right and 90px down, scales to 1.45x, swaps its initials for a gem glyph and becomes the mark beside the wordmark |
| Sync | Every cut lands with the new avatar exactly at the old avatar's position and size; each in-scene change is a one-frame swap placed after the cut (reaction 1.15s, status 3.3s, mic 4.6s, Approve to Approved 6.85s) |
| Style | Backgrounds per scene: blue radial (`#6d83c9` to `#2e2f6b`), white, `#0b0c0d`, white, `#141416`, warm dark radial (`#3a2219` to `#09090a`); accent `#e8734a`; Inter UI text and JetBrains Mono metadata. Wordmark Inter 600 128px, letter-spacing -0.035em, `#f4f4f5` |

## Why it works

The new subject appears exactly where the eye already is, so the viewer never has to search the frame. The product stopping at the spot where it is worn ties object and person together without a visible cut.

## Prompt

> Build a transition called Match Cut, 10s. Anchor one orange avatar (#e8734a, 112px, initials MC) at the same center (780, 450) for the whole film, and build six app scenes as UI sheets, each scaled so its own avatar is exactly 112px at that anchor: a team chat on a blue radial background (0-2.0s), a calendar invite on white (2.0-3.0s), an issue tracker in near-black (3.0-3.75s), a pull request review on white (3.75-4.4s), a video call in dark gray (4.4-5.05s) and the product on a warm dark gradient (5.05-7.4s). Cut hard between scenes by flipping scene opacity on a single frame with no cross-fade. The opening wide shot pushes from 0.55x to 1x over 1.3s with expo.out, then every scene drifts 3% (scene 6: 5%) with ease: "none". Inside scenes, use one-frame swaps for state (status at 3.3s, mic at 4.6s, Approve to Approved at 6.85s) and small expo.out entrances (popover 0.4s, badge 0.35s, cards 0.5s with 0.16s stagger from 5.2s, a cursor in 0.55s at 6.25s). At 7.4s fade the product out over 0.45s, move the avatar 40px right and 90px down at 1.45x over 1.1s with expo.out, swap its initials for a gem glyph, set the wordmark in at 8.1s (0.7s expo.out, 128px Inter 600) and hold to 10s.

## Often confused with

- [Foreground Wipe & Flash](./foreground-wipe-flash.md): Foreground Wipe & Flash uses a large object or white light to cover the frame before changing scenes; Match Cut keeps the anchor point still.
- [Glass Lens](./glass-lens.md): Glass Lens flips the background on the frame where the lens fills the screen; Match Cut keeps the composition position unchanged.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/match-cut/hyperframes.json (318 B)
- ../source/match-cut/index.html (70.3 KB)
- ../source/match-cut/package.json (298 B)

Read `../source/match-cut/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
