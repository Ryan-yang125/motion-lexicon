# Line Boil

Hand-drawn outlines swap to a slightly different trace every few frames, and motion steps at a low frame rate with no tweening.

- Position in a launch film: Opening
- Slug: line-boil
- Preview video: https://media.motionboard.app/line-boil.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/line-boil/
- Film length: 11s, 1920x1080
- Original reference: Superhuman (YouTube, 0:01) https://www.youtube.com/watch?v=nJUylrt1OdU&t=1s
- Original reference: Superhuman (YouTube, 0:05) https://www.youtube.com/watch?v=nJUylrt1OdU&t=5s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/line-boil/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/line-boil ./line-boil`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The hand-drawn lines keep trembling slightly
- It looks like a stick-figure animation drawn frame by frame
- The line edges change a little every few frames

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. Every state is a function of `K = floor(t*7.5)`, so one new trace every 4 frames (0.133s) for the whole film. Scenes: chaos 0-2.67s (K 0-19), split inbox 2.67-5.87s (K 20-43), draft reply 5.87-7.87s (K 44-58), inbox zero 7.87-8.8s (K 59-65), wordmark 8.8-11s with the name at 8.93s |
| Easing | No tweening and no easing: position and shape jump per index. Flights are 3 positions on an arc, each held 4 frames (0.4s total); poses alternate every index; the whole canvas is redrawn from a clean white background each trace |
| Camera | Fixed; the scene is swapped on a white background with hard cuts at K 20, 44, 59 and 66 |
| Subject | Each stroke is re-drawn every index with a smooth sine displacement of 1.05px amplitude plus a random offset of up to 0.65px per axis (about 1.7px), over a fixed 1.9px wobble. Open strokes get up to 3px of overshoot, fills sit up to 2.2px off the outline with marker streaks, and lettering uses 3 variants per letter. Character poses are mostly still; during an action the pose or position changes once per index (7.5fps) |
| Sync | All changes are hard cuts keyed to the same index: unread counter steps 48, 97, 131, 166, 212 at K 1, 4, 7, 10, 13; red labels appear at K 4, 7, 10, 13; one envelope launches per index from K 21 and lands 3 indices later; rules write in as each tray receives its first envelope; draft words arrive 3 per index; SENT, the cursor press and the reply flight follow in single-index steps |
| Style | Pure white background; ink `#1c1a21` at 4.4px with pressure variation and a chisel or fine nib; flat color fills with darker marker streaks; green `#16a35a` for the brand and titles, red `#e3352b` for chaos labels, tray colors VIP `#ffc417`, TEAM `#2f6bff`, BILLING `#ff7a1c`, NEWS `#f04e98` |

## Why it works

Lines keep trembling slightly even when the picture is still, so the frame always seems to be moving while keeping the hand-drawn stroke. Low-frame-rate frame-by-frame animation reads differently from smooth tweened vector animation, and the action frame rate matches the boil frame rate.

## Prompt

> Build a hand-drawn animation called Line Boil, 11s on a pure white background. Draw every character, prop and letter as strokes on a canvas, and redraw the whole frame from the index K = floor(t*7.5), a new trace every 4 frames (0.133s). Each trace displaces every stroke with a smooth sine field of 1.05px amplitude plus a random per-stroke offset of up to 0.65px per axis, over a fixed 1.9px wobble; ink is #1c1a21 at 4.4px with pressure variation, tapered open ends with up to 3px overshoot, a chisel nib for titles and a fine nib for body text; fills are flat color offset up to 2.2px from the outline with darker marker streaks; lettering is single-stroke caps with 3 variants per letter. Poses stay mostly still, and every action (flights as 3 arc positions held 4 frames each, pose swaps, typing 3 words per index, counters) steps on the same 7.5fps index with no tweening. Hard-cut through five scenes at K 20, 44, 59 and 66 (2.67s, 5.87s, 7.87s, 8.8s): a chaos desk with an unread counter and red labels, a split inbox sorting 12 emails into four colored trays, a drafted reply with SEND, SENT and a flying envelope, an Inbox Zero cheer, and the wordmark written at 8.93s. All labels and clears are hard cuts with 0 frames of transition.

## Often confused with

- [Dot-Matrix Glyph](./dot-matrix-glyph.md): Dot-Matrix Glyph restricts the graphic to grid points; Line Boil keeps continuous lines and only lowers the frame rate in time.
- [Branching Growth](./branching-growth.md): The doubling version of Branching Growth also uses 8fps frame skipping; Line Boil is the trace itself changing frame by frame.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/line-boil/hyperframes.json (318 B)
- ../source/line-boil/index.html (44.5 KB)
- ../source/line-boil/package.json (298 B)

Read `../source/line-boil/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
