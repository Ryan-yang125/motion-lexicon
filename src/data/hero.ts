// The launch film on the home page, cut into the recipes it is made of.
// One film (Motionboard's own launch film, made with the recipes below); each segment is a
// time range of it, taken from the film's segments.json.
import { MEDIA_URL } from '@/site'

export type HeroSegment = {
  slug: string
  /** 1080p film; phones play `mobile` (720p), same timeline */
  src: string
  mobile: string
  /** 1920px poster; `posterSmall` is the 960px one */
  poster: string
  posterSmall: string
  start: number
  end: number
}

const src = `${MEDIA_URL}/hero-film.mp4`
const mobile = `${MEDIA_URL}/hero-film-m.mp4`
const poster = `${MEDIA_URL}/hero-film.jpg`
const posterSmall = `${MEDIA_URL}/hero-film-m.jpg`
const seg = (slug: string, start: number, end: number): HeroSegment => ({ slug, src, mobile, poster, posterSmall, start, end })

export const HERO: HeroSegment[] = [
  seg('rhythmic-typing', 0, 2.8),
  seg('tilted-ui-with-depth-of-field', 2.8, 5.5),
  seg('auto-zoom', 5.5, 8.2),
  seg('morph-relay', 8.2, 10.6),
  seg('match-cut', 10.6, 12.4),
  seg('mark-to-wordmark-unfold', 12.4, 15.8),
]
