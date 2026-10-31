// UI strings per locale. The en object is the type source; zh must have the same shape.
// Recipe names and text live in data/terms.ts, brand copy in site.ts.
import type { Position } from '@/data/terms'
import type { Locale } from '@/site'

const en = {
  lang: { label: '中文', aria: 'View in Chinese' },
  nav: { recipes: 'Recipes', saved: 'Saved', github: 'GitHub' },
  foot: { credit: 'Recreations rendered with HyperFrames · Original films © their owners', license: 'License' },
  notFound: { title: 'Page not found', browse: 'Browse recipes' },
  positions: {
    open: 'Opening',
    reveal: 'Product reveal',
    feature: 'Features',
    bridge: 'Transitions',
    close: 'Ending',
  } satisfies Record<Position, string>,
  hero: { shots: 'Shots in the film', play: 'Play film', open: 'Open recipe' },
  shelves: { label: 'Recipe positions' },
  actions: {
    copy: 'Copy for your agent',
    copied: 'Copied',
    like: 'Like',
    unlike: 'Unlike',
    save: 'Save',
    saved: 'Saved',
    unsave: 'Remove from saved',
    wish: 'Make it from my product link',
    wishPop: 'Coming soon. Your vote is counted.',
  },
  recipe: {
    breadcrumb: 'Breadcrumb',
    prev: (name: string) => `Previous: ${name}`,
    next: (name: string) => `Next: ${name}`,
    copiedTimes: (n: number) => `Copied ${n.toLocaleString('en-US')} ${n === 1 ? 'time' : 'times'}`,
    seenIn: 'Seen in',
    more: (position: string) => `More ${position}`,
    original: 'Original',
    originalAria: (title: string) => `Original: ${title}`,
    recreation: 'Motionboard recreation',
    compare: 'Compare',
    showing: 'Showing',
    watchOnX: 'Watch on X ↗',
    play: (name: string) => `Play ${name}`,
    pause: (name: string) => `Pause ${name}`,
  },
  full: {
    title: 'Full recipe',
    why: 'Why it works',
    spec: 'Spec',
    prompt: 'Prompt',
    says: 'People describe it as',
    vs: 'Often confused with',
    file: 'Recipe file (.md)',
    copyPrompt: 'Copy prompt',
    promptCopied: 'Prompt copied',
  },
  saved: { title: 'Saved', empty: 'Nothing saved yet.', browse: 'Browse recipes' },
  skill: { title: 'Make a whole launch film', copy: 'Copy command', github: 'View on GitHub' },
}

export type Strings = typeof en

const zh: Strings = {
  lang: { label: 'EN', aria: '切换到 English' },
  nav: { recipes: '配方', saved: '收藏', github: 'GitHub' },
  foot: { credit: '复刻由 HyperFrames 渲染 · 原片版权归各自所有者', license: '许可证' },
  notFound: { title: '页面不存在', browse: '浏览配方' },
  positions: {
    open: '开场',
    reveal: '亮出产品',
    feature: '讲功能',
    bridge: '衔接',
    close: '收尾',
  },
  hero: { shots: '影片中的镜头', play: '播放影片', open: '打开配方' },
  shelves: { label: '配方分类' },
  actions: {
    copy: '复制给 Agent',
    copied: '已复制',
    like: '点赞',
    unlike: '取消点赞',
    save: '收藏',
    saved: '已收藏',
    unsave: '取消收藏',
    wish: '贴产品链接直接出片',
    wishPop: '即将上线，已记下你的一票。',
  },
  recipe: {
    breadcrumb: '面包屑',
    prev: (name) => `上一个：${name}`,
    next: (name) => `下一个：${name}`,
    copiedTimes: (n) => `已复制 ${n.toLocaleString('zh-CN')} 次`,
    seenIn: '原片出处',
    more: (position) => `更多「${position}」`,
    original: '原片',
    originalAria: (title) => `原片：${title}`,
    recreation: 'Motionboard 复刻',
    compare: '对比',
    showing: '对比中',
    watchOnX: '在 X 上观看 ↗',
    play: (name) => `播放 ${name}`,
    pause: (name) => `暂停 ${name}`,
  },
  full: {
    title: '完整配方',
    why: '为什么有效',
    spec: '参数',
    prompt: '提示词',
    says: '常见说法',
    vs: '容易混淆',
    file: '配方文件 (.md)',
    copyPrompt: '复制提示词',
    promptCopied: '提示词已复制',
  },
  saved: { title: '收藏', empty: '还没有收藏。', browse: '浏览配方' },
  skill: { title: '做一整支宣传片', copy: '复制命令', github: '在 GitHub 查看' },
}

export const STRINGS: Record<Locale, Strings> = { en, zh }

/** Value of <html lang> */
export const HTML_LANG: Record<Locale, string> = { en: 'en', zh: 'zh-CN' }
export const OG_LOCALE: Record<Locale, string> = { en: 'en_US', zh: 'zh_CN' }
