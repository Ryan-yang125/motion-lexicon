// The text a visitor pastes into their own agent. It points at the recipe file, which carries
// the full source; the agent must fetch it raw because summarising fetchers drop code.
// Video or website is left to the visitor's own words; the recipe file covers both.
import type { Term } from './terms'
import { recipeFile } from './terms'
import type { Locale } from '@/site'

export function copyText(t: Term, origin: string, locale: Locale) {
  if (locale === 'zh') {
    return `按这个动效配方，给我的产品做「${t.zh}」镜头：${origin}${recipeFile(t)}\n先用 curl 读完整个文件，里面有完整源码和精确时间。`
  }
  return `Make the "${t.en}" shot for my product, following this motion recipe: ${origin}${recipeFile(t)}\nRead the whole file with curl first. It contains the full source code and the exact timing.`
}
