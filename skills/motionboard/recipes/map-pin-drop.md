# Map Pin Drop

A pin drops onto a map with a bounce and bursts into fragments, the map zooms out to the whole country, and a route line draws to the next city.

- Position in a launch film: Features
- Slug: map-pin-drop
- Preview video: https://media.motionboard.app/map-pin-drop.mp4
- Recipe page (preview film and original side by side): https://motionboard.app/recipes/map-pin-drop/
- Film length: 11s, 1920x1080
- Original reference: Stripe Reader S700 (YouTube, 0:04) https://www.youtube.com/watch?v=9oieNo53aNY&t=4s
- Original reference: Stripe Reader S700 (YouTube, 0:19) https://www.youtube.com/watch?v=9oieNo53aNY&t=19s

## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** Copy the folder `../source/map-pin-drop/` (next to this file in the skill) into the user's working folder, for example `cp -R <skill dir>/source/map-pin-drop ./map-pin-drop`. Adapt `index.html` (see "What to adapt"). Run `npx --yes hyperframes@0.8.209 check` on the untouched copy first and note its result. Preview with `npx --yes hyperframes@0.8.209 preview`, render an MP4 with `npx --yes hyperframes@0.8.209 render` (into `renders/`, named with a timestamp). The same commands are in `package.json` as `dev`, `check`, `render`; pass flags after `--`, as in `npm run render -- --quality draft`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in `index.html` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect `prefers-reduced-motion: reduce`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via `local()`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview film on the recipe page at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.

## Matches requests like

- A location pin drops on the map and fragments burst around it
- The map pulls out to the whole country and then flies to the next city
- A line is drawn from one city to another

## Spec

| Item | Value |
| --- | --- |
| Timing | Film 11s. City one: name rises 0.12s, pin drops 0.5s (0.3s), impact 0.63s, fragments to 1.27s, hold to 3.9s. Pull-back to the country 3.9-4.9s; 19 network pins pop 4.45s onward; route line 5.0-5.8s; push-in to the second city 5.85-6.95s; second pin drops 7.0s; dive into the pin 8.05-8.6s; end card 8.6-11s |
| Easing | Pin drop `cubic-bezier(0.34,1.56,0.64,1)` over 0.3s; fragments expand `cubic-bezier(0.16,1,0.3,1)` over 0.6s (lines grow `power2.out` 0.22s then shrink `power2.in` 0.38s); pull-back, route and push-in `cubic-bezier(0.65,0,0.35,1)` (zoom interpolated on a log scale); dive `t^3`; city name and tag `expo.out` |
| Camera | City one framed about 26 km wide and pushing 4% per second; pulls back over 1.0s to the whole country, drifts 2% per second, pushes over 1.1s into the second city (framed about 23 km wide, 4% per second again), then dives 8.05-8.6s with the zoom growing 2.2x and the pin scaling from 1.45x to 12x |
| Subject | A navy location pin (scale 1.45) drops 360px from above; at impact 9 fragments burst outward (4 white lines, 3 dots, 2 squares, one navy) and pin two bursts 10 (4 lines, 2 dots, 3 squares, two navy, plus an expanding ring of radius 48 to 150). A white 5px route arcs north from city one to city two with an 11px round head. 19 small indigo pins mark the live cities. End card: pin settles at scale 1.2, mini map with 20 dots and three pulse rings, wordmark, subline and three stats (21 US cities, 94 min, $0) |
| Sync | The 168px city name (Oswald, white at 43%) is locked to the map and scales with the camera push; both pins and the 19 city pins follow the camera. The cut to the end card happens at 8.6s as the pin fills the center, and the end-card pin continues from the same scale |
| Style | Land `#7667f6` on a deeper water purple `#5d4bea`, navy pin `#0f1f3d`, white roads (zoom-dependent opacity), fragments and route, indigo network pins `#4a37d6`. Wordmark Inter 700 150px, letter-spacing -0.055em; end card on the same purple |

## Why it works

Map, pin, and fragments use only one brand color plus deep blue and white, and the information is a single point and a single place name. The same pin-and-fragment burst carries on from the graphic world into real street view, connecting a customer from a dot on a map to a real storefront.

## Prompt

> Introduce a customer with a shot called Map Pin Drop, 11s. Land #7667f6 on a deeper water purple #5d4bea, thin white roads, and a 168px city name (Oswald, white at 43%) at the lower right that rises over 1s with expo.out and stays locked to the map. Frame the first city about 26 km wide and push the map in at 4% per second. At 0.5s a navy pin (#0f1f3d, scale 1.45) drops 360px with cubic-bezier(0.34,1.56,0.64,1) over 0.3s; at impact burst 9 white fragments (4 lines, 3 dots, 2 squares) outward over 0.6s with cubic-bezier(0.16,1,0.3,1), fading from 0.42s to 0.64s after impact, and fade the pin tag in at 0.24s. At 3.9s pull back over 1s with cubic-bezier(0.65,0,0.35,1) to the whole country and pop 19 small indigo pins in with a 0.022s stagger. At 5.0s draw a 5px white route with an 11px round head along a gentle northern arc to the second city over 0.8s with the same curve, then push in over 1.1s to a 23 km frame while the route tail retracts to a 170px stub. Drop a second pin at 7.0s with 10 fragments including an expanding ring, then dive into it over 0.55s (t^3, pin scaling to 12x) and cut at 8.6s to an end card: pin settles at scale 1.2, a mini map of 20 dots with three pulse rings, the wordmark, subline and three stats.

## Often confused with

- [Confirmation Burst](./confirmation-burst.md): Confirmation Burst puts fragments at the contact point of a tap or payment; in Map Pin Drop the fragments appear at the pin's landing point on the map.
- [Match Cut](./match-cut.md): Match Cut swaps the map pin for a pin in real footage; Map Pin Drop is the pin dropping, the fragments, and the pull-back route.

## Source files

Runnable HyperFrames project, 4 files.

- ../source/map-pin-drop/geo.js (4.2 MB)
- ../source/map-pin-drop/hyperframes.json (318 B)
- ../source/map-pin-drop/index.html (26.9 KB)
- ../source/map-pin-drop/package.json (301 B)

Read `../source/map-pin-drop/index.html` in full before adapting it: it holds the whole composition and its GSAP timeline.
