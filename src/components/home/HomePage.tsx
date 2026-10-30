import { HeroFilm } from './HeroFilm'
import { Shelves } from './Shelves'
import { SkillInstall } from './SkillInstall'

export function HomePage() {
  return (
    <main>
      <HeroFilm />
      <Shelves />
      <SkillInstall />
    </main>
  )
}
