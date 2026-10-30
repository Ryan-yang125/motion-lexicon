# Rhythmic Typing

Monospace text is typed character by character with a cursor at uneven human speed, then deleted and retyped.

- Position in a launch film: Opening
- Slug: rhythmic-typing
- Preview video: https://media.motionboard.app/rhythmic-typing.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/rhythmic-typing/
- Film length: 11s, 1920x1080
- Original reference: Linear Releases (YouTube, 0:22) https://www.youtube.com/watch?v=6dIwFoQ0eVg&t=22s
- Original reference: Cursor 1.0 (YouTube, 0:01) https://www.youtube.com/watch?v=s5kX-UHgMLo&t=1s
- Original reference: Apple MacBook Pro M5 (YouTube, 0:00) https://www.youtube.com/watch?v=GriXfu4tL30
- Original reference: Raycast (YouTube, 0:28) https://www.youtube.com/watch?v=Mi173xGb0ZA&t=28s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/rhythmic-typing/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/rhythmic-typing ./rhythmic-typing`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- Typed out one character at a time like a terminal
- Typed, deleted, then a new line typed
- The cursor blinks and the typing speed keeps changing

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s: first line typed 0.17–4.51s (typo 'bakcoff' 1.2–1.57s, five backspaces 2.1–2.27s, retype 2.47–2.77s); hold 0.7s; delete 32 characters 5.21–5.9s; check mark and '214 tests passing' 6.47–7.77s; hold 0.4s; delete 8.17–8.43s; wordmark typed 8.63–9.0s; green cursor and tagline 9.43s; hold to 11s |
| Easing | No tweening: each character is an `opacity` hard set (`tl.set`) on a fixed 33.6px monospace grid; the cursor is solid on every keystroke, then 0.5s on / 0.5s off in idle gaps; slow drift `scale` 1→1.04 `linear` |
| Camera | Fixed; the line is left-anchored at x 240px and grows to the right; the terminal line drifts `scale` 1→1.04 over 8.53s and the wordmark 1→1.035 over 2.47s (`linear`) |
| Subject | Typing gaps 0.04–0.11s (about 9–25 characters per second) with 0.3–0.5s pauses between words; backspace 0.04s per character for the typo, 0.022s for the whole line, 0.015s for the status line; a solid white block cursor (33.6×66px) follows the end of the text; a 15-name feature rail at 13% opacity scrolls up 380px behind the line |
| Sync | A muted label 'TALON 2.4 / AGENT' (28px) appears at 0.15s and clears at 8.15s; the rail fades in at 0.9s and out at 8.05s; at 9.43s the cursor turns green `#3ddc97` on the same frame the tagline appears |
| Style | Near-black `#09090c` background; JetBrains Mono 56px (5.2% of frame height) in `#f2f2f4`, prompt prefix in muted `#70707c`, check mark in `#3ddc97`; wordmark 150px weight 500; soft vignette |

## Why it works

The screen holds only a cursor and one line of small text, with a great deal of empty space. Typing pauses 0.3–0.5s between words like real keystrokes, and deleting is twice as fast as typing, which splits the product name and the launch status into two beats. The font is the same monospace used for the numbered labels in the product UI.

## Prompt

> Build a terminal title card called Rhythmic Typing. Near-black background (#09090c) and one line of JetBrains Mono at 56px with a solid white block cursor following the end. Type '> add backoff to webhook retries' character by character with uneven gaps of 0.04 to 0.11s and 0.3 to 0.5s pauses between words, including a typo ('bakcoff') that you fix with five backspaces at 0.04s each. Hold 0.7s, delete the whole line at 0.022s per character, wait 0.5s, then type a green check mark and '214 tests passing', hold 0.4s, delete at 0.015s per character, and type the wordmark at 150px. The cursor is solid on every keystroke and blinks 0.5s on and 0.5s off during idle gaps. Characters are hard sets with no fade. Behind the line, a list of 15 feature names at 13% opacity scrolls up 380px, and at the end the cursor turns green as a tagline appears. The whole piece runs 11 seconds with a slow scale drift of 1 to 1.04.

## Often confused with

- [Word-by-Word Highlight](./word-by-word-highlight.md): Word-by-Word Highlight brightens words and never deletes; Rhythmic Typing appends characters and has a cursor and delete-and-retype.
- [Prompt Carousel](./prompt-carousel.md): Prompt Carousel happens inside an input box with several prompts scrolling vertically; Rhythmic Typing is a single line of text.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/rhythmic-typing/hyperframes.json (318 B)
- ../source/rhythmic-typing/index.html (10.3 KB)
- ../source/rhythmic-typing/package.json (304 B)

Read `../source/rhythmic-typing/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
