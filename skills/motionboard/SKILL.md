---
name: motionboard
description: Make product launch films and single shots in the style of Apple and Linear launch films, from 38 recipes (HyperFrames, HTML + GSAP rendered to MP4). Use when the user asks for a product launch film, promo video, product reveal, feature video or app trailer; wants to recreate a specific shot from a launch film; asks for Apple-style or Linear-style motion, either as a video or as a hero animation on a website; or names a shot from the recipe index (Match Cut, Tilted UI with Depth of Field, Auto Zoom, Morph Relay, Light Reveal and the rest). Also applies to requests in Chinese such as 做宣传片, 产品发布视频, 苹果风动效, 复刻某个镜头.
---

# Motionboard

Motionboard is shot language broken down from real Apple and Linear launch films. Each shot is recreated in code as a ~10s HyperFrames film (HTML + GSAP rendered to video). This skill holds 38 recipes and their runnable source projects. You make one shot, or plan and build a whole launch film, for the user's product.

Reply in the user's language. The files here are in English.

## Quality bar

Every shot must reach the finish of its preview film on https://motionboard.app. The preview is the reference. Match its timing, easing, camera, blur, depth, lighting and UI density. A shot that moves correctly but looks flatter, emptier or cheaper than the preview is not finished.

## Layout

- `recipes/index.md`: all recipes grouped by position in a launch film, one line each. Scan this to pick shots.
- `recipes/<slug>.md`: one recipe. Spec table, why it works, the prompt, "matches requests like" phrases, the preview and recipe page links.
- `source/<video>/`: the runnable HyperFrames project for the recipe (`index.html`, `package.json`, `hyperframes.json`). The `Source files` section of each recipe names the folder.

Each recipe page at `https://motionboard.app/recipes/<slug>/` shows the preview film next to the original it was recreated from. Preview film: `https://media.motionboard.app/<video>.mp4`.

Positions: Opening (`open`), Product reveal (`reveal`), Features (`feature`), Transitions (`bridge`), Ending (`close`).

The source folder name can differ from the recipe slug (`auto-zoom` uses `source/zoom-to-cursor/`). Take it from the recipe's `Source files` section.

### Spec, source and preview

- The source project is the shot, and the preview film is its render.
- The spec table and the prompt are taken from the source: its beat times, durations, eases, angles, blur and stagger. Use the Timing row as the beat list for the quality check.
- The timeline in `index.html` is the final word on any detail the table leaves out.

## 1. Setup check

Run once per session before building.

```sh
node --version                  # 22 or newer
npx --yes hyperframes@<version from the recipe's package.json> --version
ffmpeg -version | head -1
```

If one is missing, tell the user what to install and stop. Each source project pins its HyperFrames version in `package.json`, and its scripts are the commands to use:

```sh
npm run dev                          # preview in the HyperFrames studio
npm run check                        # lint, runtime, layout and contrast gate, about a minute
npm run render -- --quality draft    # MP4 into renders/<project>_<timestamp>.mp4
npm run render -- --quality delivery # the final
```

Equivalent: `npx --yes hyperframes@<version> preview | check | render`. `npx --yes hyperframes@<version> snapshot --at <seconds,...> --against <preview.mp4>` writes frames of the composition and a side-by-side sheet against the preview. If the user's agent has the `hyperframes` skills, use them for anything beyond these commands. The "skills out of date" notice HyperFrames prints can be ignored.

Check, render and the quality check need network access: HyperFrames fetches Google Fonts (Inter and others) and GSAP from a CDN, and the preview film downloads from `media.motionboard.app`.

### Reading `npm run check`

Run it once on the untouched copy before editing. Some sources already report errors there, on purpose: dim text in blurred depth-of-field layers fails the contrast gate, and clamped rows report `clipped_text`. Then:

- Fix every error your edits add.
- An error already in the untouched copy can stay when it is part of the look. Mark intentional truncation with `data-layout-allow-overflow` and intentional overlap with `data-layout-allow-occlusion`.
- `text_below_floor`, `line_unread` and similar warnings are normal for product UI at real density. Keep type at the preview's size.

Every composition is one `index.html`: a root `data-composition-id="main"` with `data-duration`, 1920x1080, one paused GSAP timeline on `window.__timelines["main"]`. Keep that contract, because the renderer seeks the timeline frame by frame.

## 2. Mode A: one shot

Use when the user wants one shot, or names a recipe.

1. **Find the recipe.** By name or slug: open `recipes/<slug>.md`. By description: match it against `recipes/index.md` and the "Matches requests like" phrases in the likely recipes; read two or three candidates and choose. If two fit, name both in one sentence and let the user pick. Ask nothing else when the choice is clear.
2. **Know the product.** From the user's repo or message: name, logo, brand colours, fonts, real UI. Ask once for what is missing and cannot be read from the repo.
3. **Pick the output.** A video by default. Website motion (section 4) when the user mentions their site or a hero animation.
4. **Read the whole recipe file**, then the whole `source/<video>/index.html`.
5. **Copy the project** and run `npm run check` on the untouched copy. `cp -R <skill dir>/source/<video> <user folder>/<video>`. Never edit files inside the skill folder.
6. **Adapt two layers only.**
   - Brand layer: names, copy, colours, logo, fonts. Replace directly. Keep text inside its boxes after the swap.
   - UI layer: the product screens, cards, windows and controls in the shot. Rebuild the user's real UI in HTML/CSS, from their components and tokens or from screenshots used as reference only. Follow how the source project builds its UI. When the product has no UI like the source's (a launcher, a calendar), map the same flow onto the product's closest real screen.
   - Motion layer: timing, easing, camera moves, layering, stagger, frame counts. Keep exactly as in the source. Change a motion value only when the product forces it (for example a longer word), and record the change.
   - The layers are bound together. The timeline targets elements by id and class, camera moves land on fixed coordinates, and typing and list beats depend on text length and row count. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times. An interaction the product lacks (a drag in a calendar) becomes the product's own interaction at the same beat time.
   - Some sources open with a lead-in before the recipe's moment (a UI push-in before a logo ending). Keep it in a whole film. When the user asks for only that moment, cut the lead-in, start on the recipe's first beat, and keep every later beat's spacing.
7. **Fonts.** Use the user's brand font when it can be bundled (`@font-face` with a file in the project). For a system font that cannot ship, such as SF Pro, use Inter, which HyperFrames fetches on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`); swap those the same way.
8. `npm run check` (section 1), render, then run the quality check below.

## 3. Mode B: whole launch film

Use when the user wants a launch film, promo, trailer or feature video.

1. **Product.** If there is no link, repo or description, ask for one once. Read the repo or page to learn what the product does, its name, brand, real screens and strongest claims.
2. **Storyboard.** Propose 4 to 6 shots in position order: one Opening, one Product reveal, one to three Features, optionally one Transition, one Ending. Choose from `recipes/index.md`; a recipe fits when its mechanism shows something true about this product. Show a table:

   | Shot | Recipe | What it shows for this product | Seconds | Preview |
   | --- | --- | --- | --- | --- |

   Preview is the recipe page link. Use each shot's duration from the recipe's film length, trimmed with the user's agreement if the film should be shorter. Pacing reference: the Motionboard launch film on https://motionboard.app is 6 shots in 15.8 seconds. Wait for the user's confirmation or changes. Do not build before that.
3. **Build each shot** as in Mode A, one folder per shot: `launch-film/shots/01-<slug>/`, `02-<slug>/`, and so on. Keep brand, colours and type identical across shots. Run the quality check on every shot.
4. **Join** the renders with hard cuts, or with the Transition recipe as its own shot between two others. Re-encode so the parts match:

   ```sh
   # list.txt: one line per shot, with each shot's final render, e.g.
   # file 'shots/01-rhythmic-typing/renders/rhythmic-typing_2026-10-30_10-00-00.mp4'
   ffmpeg -f concat -safe 0 -i list.txt -c:v libx264 -crf 14 -pix_fmt yuv420p -an launch-film.mp4
   ```

   Add music only when the user asks.
5. **Deliver** `launch-film.mp4` and the editable project folder (all shot folders plus `list.txt`). Report the quality-check notes per shot.

## 4. Website motion

The same recipe can be a hero animation on a website. Do it when the user asks. Port the GSAP timeline in the source `index.html` into the user's stack (React, Vue, Svelte, plain HTML). Build the same DOM, keep durations, delays and easings, start it when the element scrolls into view, and respect `prefers-reduced-motion: reduce` by showing the final frame as a static state.

## 5. Quality check before delivering

1. Render the project.
2. Download the preview film (`https://media.motionboard.app/<video>.mp4`) and capture the same moments from both:

   ```sh
   curl -o preview.mp4 https://media.motionboard.app/<video>.mp4
   npx --yes hyperframes@<version> snapshot --at 0.5,2.4,4.0,6.3,9.5 --against preview.mp4
   ```

   Use the beat times from the spec table's Timing row: start, the moment each phase begins, the peak of the move, the hold, the end. When you cut a lead-in, the preview's times are later by the length you cut: take those frames with `ffmpeg -ss <t> -i preview.mp4 -frames:v 1 ref-<t>.png` and compare them with `snapshot --at` frames of your render.
3. Compare each pair. Fix differences in timing, easing, blur, depth of field, shadows, lighting, scale and density. The frames should match beat for beat; only brand and UI content differ.
4. Deliver with a short list of the parameters that were changed for the product and why.

## 6. No placeholder UI

Never ship grey boxes, lorem ipsum, stock icons standing in for real ones, or a pasted screenshot. Product UI is rebuilt in code at the density of the source project: real-looking copy, icons, avatars, data, states, hairline borders, shadows. If the user's product has no UI yet, design a believable one from its description, at the same density as the source.

## 7. Boundaries

- The skill ships recreations only. Do not download or embed the original third-party films. The recipe pages link to YouTube for the originals.
- Recipes and source files are free to use in the user's own work, including commercial launch films.
