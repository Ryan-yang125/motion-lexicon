# Locked-Layout Reskin

Layout positions stay locked while the color scheme and fonts hard-cut every 6–10 frames.

- Position in a launch film: Transitions
- Slug: locked-layout-reskin
- Preview video: https://media.motionboard.app/locked-reskin.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/locked-layout-reskin/
- Film length: 11s, 1920x1080
- Original reference: Arc Boosts (YouTube, 0:00) https://www.youtube.com/watch?v=N0jMmiCS8oQ

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/locked-reskin/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/locked-reskin ./locked-reskin`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- The same web page in lots of colors and fonts
- The layout stays put while the colors keep jumping
- Quick switching between different themes

## Spec

| Item | Value |
| --- | --- |
| Timing | Skin cuts: 4 at 16-frame spacing (0.53s) from 1.0s to 2.6s; title card 3.13–3.73s (18 frames); 10 cuts at 8-frame spacing (0.27s) 3.73–6.13s; 11 cuts at 6-frame spacing (0.2s) 6.4–8.4s, landing on one skin; Enter applies at 8.67s; wordmark cuts 9.4–9.7s; film 11s |
| Easing | No transition, a class swap with `tl.set` on a single frame; only the toast (`expo.out` 0.35s), cursor move and the final `scale` push animate |
| Camera | Fixed; the editor window is 1632×918px (85% of the frame) with position locked; `scale` 1→1.03 `linear` over 1s after landing (8.4–9.4s) |
| Subject | One page (a 1240×828px site canvas) re-skinned through eight theme classes: Mono white, Gazette beige serif, Neon dark purple with lime and monospace, Fern green serif, Block orange with condensed black type, Sorbet pink and lilac, Poster blue with condensed caps, Noir dark with gold serif; layout and elements never move |
| Sync | A theme-list panel highlights the active row, and an arrow-down key cap lights for 3 frames on every cut; the cursor picks the Gazette row at 0.87s and the first cut follows at 1.0s; the title card colors come from the skins on either side (`#fff1f5` background, `#ff5a1f` text) |
| Style | Each skin changes background, text, accent, border and font through CSS variables; saturated solid fields (Block `#ff5a1f`, Poster `#2340ff`) alternate with quiet light and dark skins; type styles differ clearly between skins |

## Why it works

With the layout locked, the viewer's eye stays in one place and sees only what changes with each switch. Cuts land on the strong beats of the music, and the skins differ enough in color.

## Prompt

> Show that your page is customizable with a shot called Locked-Layout Reskin. Put one page in an editor window that takes up 85% of the frame (1632×918px), with position and element layout fully locked. Swap it through eight skins by changing a theme class on a single frame, each skin changing background, text, accent, border and typeface through CSS variables (white Mono, beige serif Gazette, dark Neon with lime and monospace, green Fern, orange Block with condensed black type, pink Sorbet, blue Poster, dark gold Noir). Light an arrow-down key cap for 3 frames on every cut. Start with the cursor picking one skin at 0.87s, cut every 16 frames for 4 skins (1.0 to 2.6s), insert a 0.6s solid-color title card at 3.13s with colors taken from the skins before and after, cut every 8 frames for 10 skins, then every 6 frames for 11 skins until it lands on the chosen skin at 8.4s. Press Enter with a toast at 8.67s, push scale 1 to 1.03 over 1s, then finish with a few hard-cut wordmark skins.

## Often confused with

- [Control-Driven Change](./control-driven-change.md): Control-Driven Change shows a control that changes the result on the same frame; Locked-Layout Reskin has no control and conveys customizability through edit rhythm.
- [Focus Hop](./focus-hop.md): Focus Hop moves a single highlight block; Locked-Layout Reskin changes the skin of the whole page.

## Source files

Runnable HyperFrames project, 3 files.

- ../source/locked-reskin/hyperframes.json (318 B)
- ../source/locked-reskin/index.html (54.1 KB)
- ../source/locked-reskin/package.json (302 B)

Read `../source/locked-reskin/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
