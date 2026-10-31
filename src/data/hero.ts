// The launch film on the home page, cut into the recipes it is made of.
// One film (Motionboard's own launch film, made with the recipes below); each segment is a
// time range of it, taken from the film's segments.json. Both encodes have a keyframe at every
// segment start, so jumping to a segment shows its first frame at once.
import { MEDIA_URL } from '@/site'

export const HERO_FILM = {
  /** 1080p film; phones play `mobile` (720p), same timeline */
  src: `${MEDIA_URL}/hero-film.mp4`,
  mobile: `${MEDIA_URL}/hero-film-m.mp4`,
  /** the film's first frame, so the film takes over the poster without a visible cut */
  poster: `${MEDIA_URL}/hero-start.jpg`,
  posterSmall: `${MEDIA_URL}/hero-start-m.jpg`,
  /** share image */
  cover: `${MEDIA_URL}/hero-film.jpg`,
}

export type HeroSegment = { slug: string; start: number; end: number }

const seg = (slug: string, start: number, end: number): HeroSegment => ({ slug, start, end })

export const HERO: HeroSegment[] = [
  seg('rhythmic-typing', 0, 2.8),
  seg('tilted-ui-with-depth-of-field', 2.8, 5.5),
  seg('auto-zoom', 5.5, 8.2),
  seg('morph-relay', 8.2, 10.6),
  seg('match-cut', 10.6, 12.4),
  seg('mark-to-wordmark-unfold', 12.4, 15.8),
]
