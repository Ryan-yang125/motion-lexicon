export type Locale = 'en' | 'zh'

// Brand and canonical host. Change the name or domain here only.
export const BRAND = {
  name: 'Motionboard',
  headline: {
    en: 'Shots from the best launch films, ready for your agent.',
    zh: '顶级宣传片里的镜头，交给你的 Agent 做同款。',
  },
  line: {
    en: 'Shot language broken down from Apple and Linear launch films, rebuilt in code. Copy one to Claude Code and make the same shot for your product.',
    zh: '拆解苹果、Linear 宣传片的镜头语言，用代码一比一复刻。复制一条给 Claude Code，给你的产品做同款镜头。',
  },
}
export const SITE_URL = 'https://motionboard.app'
export const GITHUB_URL = 'https://github.com/krisyangdev/motionboard'
export const LICENSE_URL = `${GITHUB_URL}/blob/main/LICENSE`
export const SKILL_INSTALL = 'npx skills add krisyangdev/motionboard'
// Films and posters live in the R2 bucket behind this host (source files in media/, uploaded with
// scripts/upload-media.sh). Workers static assets do not answer range requests, which Safari needs
// for video and seeking needs before a file is fully loaded; R2 does.
export const MEDIA_URL = 'https://media.motionboard.app'
/** Absolute URL for a path on this site or an already absolute URL. */
export const absolute = (url: string) => (url.startsWith('/') ? `${SITE_URL}${url}` : url)
