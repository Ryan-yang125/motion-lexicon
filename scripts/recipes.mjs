// Build-time generator for the agent-facing recipe files, from src/data/terms.json,
// src/data/en.json and skills/motionboard/source/<video>/.
// Two variants of the same recipe text, switched by `skill` in recipeMd():
//   web   public/r/<slug>.md, public/r/index.md, public/llms.txt (source files fetched with curl, gitignored)
//   skill skills/motionboard/recipes/<slug>.md and index.md (source files by relative path, committed)
// Also copies skills/motionboard/source to public/source (served by the site) and rewrites the recipe
// tables in README.md and README_CN.md between the recipes:start and recipes:end markers.
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, existsSync, cpSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = (process.env.SITE_URL || 'https://motionboard.app').replace(/\/+$/, '')
const MEDIA = (process.env.MEDIA_URL || 'https://media.motionboard.app').replace(/\/+$/, '')
const SKILL_DIR = 'skills/motionboard'
const SOURCE_DIR = `${SKILL_DIR}/source`
const SKILL_INSTALL = 'npx skills add krisyangdev/motionboard'
const REPO = 'https://github.com/krisyangdev/motionboard'

const POSITIONS = {
  open: 'Opening',
  reveal: 'Product reveal',
  feature: 'Features',
  bridge: 'Transitions',
  close: 'Ending',
}
const POSITIONS_ZH = {
  open: '开场',
  reveal: '产品亮相',
  feature: '功能展示',
  bridge: '转场',
  close: '结尾',
}
const POSITION_ORDER = Object.keys(POSITIONS)

const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'))
const terms = readJson('src/data/terms.json')
const en = readJson('src/data/en.json')

const order = [...terms].sort(
  (a, b) => POSITION_ORDER.indexOf(a.pos) - POSITION_ORDER.indexOf(b.pos) || a.n - b.n,
)
const bySlug = Object.fromEntries(terms.map((t) => [t.slug, t]))

const encodePath = (p) => p.split('/').map(encodeURIComponent).join('/')
const mdUrl = (slug) => `${SITE}/r/${slug}.md`

// The site serves the source projects from public/source; the skill keeps the originals.
rmSync(join(ROOT, 'public/source'), { recursive: true, force: true })
cpSync(join(ROOT, SOURCE_DIR), join(ROOT, 'public/source'), { recursive: true })

const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const youtube = (id, s) => `https://www.youtube.com/watch?v=${id}${s ? `&t=${s}s` : ''}`

// Length of the film in seconds, from the root composition of the source project
function filmSeconds(video) {
  const html = readFileSync(join(ROOT, SOURCE_DIR, video, 'index.html'), 'utf8')
  const m = html.match(/data-composition-id="main"[^>]*data-duration="([0-9.]+)"/)
  return m ? Number(m[1]) : null
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// Recursive file list, skipping tool state (.hyperframes), dotfiles, renders and node_modules
const SKIP = new Set(['node_modules', 'renders'])
function listFiles(dir, base = '') {
  const out = []
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith('.') || SKIP.has(name)) continue
    const rel = base ? `${base}/${name}` : name
    const abs = join(dir, name)
    const st = statSync(abs)
    if (st.isDirectory()) out.push(...listFiles(abs, rel))
    else out.push({ path: rel, size: st.size })
  }
  return out
}

const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')

// <code>x</code> -> `x`, other tags dropped
function htmlToMd(html) {
  const s = html
    .replace(/<code>([\s\S]*?)<\/code>/g, (_, c) => `\u0000${c}\u0001`)
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
  return decode(s).replace(/\u0000/g, '`').replace(/\u0001/g, '`')
}
const cell = (s) => s.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim()

const fenceFor = (text) => {
  const runs = text.match(/`+/g) || []
  return '`'.repeat(Math.max(3, ...runs.map((r) => r.length + 1)))
}

function howTo(t, version, skill) {
  const v = version || '<version from package.json>'
  const video = skill
    ? `Copy the folder \`../source/${t.video}/\` (next to this file in the skill) into the user's working folder, for example \`cp -R <skill dir>/source/${t.video} ./${t.video}\`. Adapt \`index.html\` (see "What to adapt").`
    : `Create a folder named \`${t.video}\`. Download every file under "Source files" below with the curl commands, keeping relative paths. Adapt \`index.html\` (see "What to adapt").`
  return `## How to use this recipe

You are a coding agent. The user wants this shot for their own product. Follow these steps.

1. **Know the product.** If the product is clear from the user's repo or conversation, ask nothing and start. Otherwise ask once for: product name, logo file, brand colors.
2. **Pick the output.** If the user's message says a video or their website, do that. Otherwise ask once which one they want.
   - **Video (HyperFrames).** ${video} Run \`npx --yes hyperframes@${v} check\` on the untouched copy first and note its result. Preview with \`npx --yes hyperframes@${v} preview\`, render an MP4 with \`npx --yes hyperframes@${v} render\` (into \`renders/\`, named with a timestamp). The same commands are in \`package.json\` as \`dev\`, \`check\`, \`render\`; pass flags after \`--\`, as in \`npm run render -- --quality draft\`. Rendering needs network access for web fonts and GSAP.
   - **Website motion.** Port the GSAP timeline in \`index.html\` into the user's site, using their stack (React, Vue, Svelte, plain HTML). Build the same DOM structure, keep the timeline's durations, delays and easings exactly, and start it when the element scrolls into view (IntersectionObserver or ScrollTrigger). Respect \`prefers-reduced-motion: reduce\`: show the final frame as a static state and skip the movement.
3. **What to adapt.**
   - **Brand layer** (product name, logo, colors, fonts, copy): replace directly with the user's.
   - **UI layer** (the product screens, cards, windows, controls shown in the shot): rebuild the user's real UI as clean DOM, from their codebase (components, design tokens) or from a screenshot used as reference only. Never paste a screenshot into the shot.
   - **Motion** (timing, easing, camera moves, layering, stagger, order of events): keep exactly as in the source. This is what the recipe is.
   - The timeline targets UI elements by id and class, and camera moves land on fixed coordinates. Keep the ids the timeline uses, keep row counts and text lengths close to the source, and when the layout moves, update the target coordinates without changing the times.
4. **Fonts.** HyperFrames fetches Google Fonts such as Inter on its own. Some sources use macOS local fonts (PingFang, Songti via \`local()\`). Use the user's brand font when it can be bundled; for a system font such as SF Pro, use Inter. Check that text still fits its boxes.
5. **Verify.** Compare the render with the preview ${skill ? 'film on the recipe page' : 'video above'} at the beat times in the Timing row. The beats, timing and camera should match; only brand and UI content differ.`
}

function recipeMd(t, skill) {
  const x = en[t.slug]
  const files = listFiles(join(ROOT, SOURCE_DIR, t.video))
  const pkgFile = files.find((f) => f.path === 'package.json')
  let version = ''
  if (pkgFile) {
    const m = readFileSync(join(ROOT, SOURCE_DIR, t.video, 'package.json'), 'utf8').match(/hyperframes@([0-9][^\s"]*)/)
    if (m) version = m[1]
  }

  const L = []
  L.push(`# ${t.en}`, '')
  if (x?.def) L.push(x.def, '')
  L.push(
    `- Position in a launch film: ${POSITIONS[t.pos]}`,
    `- Slug: ${t.slug}`,
    `- Preview video: ${MEDIA}/${t.video}.mp4`,
    `- Recipe page${skill ? ' (preview film and original side by side)' : ''}: ${SITE}/recipes/${t.slug}/`,
  )
  if (skill) {
    L.push(`- Film length: ${filmSeconds(t.video)}s, 1920x1080`)
    for (const s of t.samples || []) L.push(`- Original reference: ${s.t} (YouTube, ${clock(s.s)}) ${youtube(s.id, s.s)}`)
  } else {
    L.push(`- License: MIT. Free to use in your own projects, including commercial launch films. ${REPO}/blob/main/LICENSE`)
  }
  L.push('', howTo(t, version, skill), '')
  if (skill && x?.says?.length) {
    L.push('## Matches requests like', '', ...x.says.map((s) => `- ${s}`), '')
  }

  if (x?.spec?.length) {
    L.push('## Spec', '', '| Item | Value |', '| --- | --- |')
    for (const [label, val] of x.spec) L.push(`| ${cell(label)} | ${cell(htmlToMd(val))} |`)
    L.push('')
  }
  if (x?.why) L.push('## Why it works', '', x.why, '')
  if (x?.prompt) L.push('## Prompt', '', ...x.prompt.split(/\r?\n/).map((l) => `> ${l}`.trimEnd()), '')
  if (x?.vs?.length) {
    L.push('## Often confused with', '')
    for (const [slug, text] of x.vs) {
      const o = bySlug[slug]
      if (!o) {
        console.warn(`warn: ${t.slug}: vs references unknown slug "${slug}"`)
        continue
      }
      L.push(`- [${o.en}](${skill ? `./${slug}.md` : mdUrl(slug)}): ${text}`)
    }
    L.push('')
  }

  L.push('## Source files', '', `Runnable HyperFrames project, ${files.length} files.`, '')
  if (skill) {
    for (const f of files) L.push(`- ../source/${t.video}/${f.path} (${formatSize(f.size)})`)
    L.push('', `Read \`../source/${t.video}/index.html\` in full before adapting it: it holds the whole composition and its GSAP timeline.`, '')
    return L.join('\n')
  }
  for (const f of files) L.push(`- ${SITE}/source/${t.video}/${encodePath(f.path)} (${formatSize(f.size)})`)
  L.push('', 'Download all of them:', '', '```sh')
  for (const f of files) {
    L.push(`curl -fsSL --create-dirs -o "${t.video}/${f.path}" "${SITE}/source/${t.video}/${encodePath(f.path)}"`)
  }
  L.push('```', '')

  const indexPath = join(ROOT, SOURCE_DIR, t.video, 'index.html')
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, 'utf8').replace(/\s+$/, '')
    const fence = fenceFor(html)
    L.push('## index.html', '', `${fence}html`, html, fence, '')
  } else {
    console.warn(`warn: ${t.slug}: ${SOURCE_DIR}/${t.video}/index.html missing`)
  }
  return L.join('\n')
}

const webDir = join(ROOT, 'public/r')
const skillDir = join(ROOT, SKILL_DIR, 'recipes')
for (const d of [webDir, skillDir]) {
  rmSync(d, { recursive: true, force: true })
  mkdirSync(d, { recursive: true })
}

let missing = 0
const built = []
for (const t of order) {
  if (!en[t.slug]) {
    missing++
    console.warn(`warn: no en.json entry for "${t.slug}", text sections skipped`)
  }
  if (!existsSync(join(ROOT, SOURCE_DIR, t.video))) {
    console.warn(`warn: ${SOURCE_DIR}/${t.video}/ missing, skipping ${t.slug}`)
    continue
  }
  writeFileSync(join(webDir, `${t.slug}.md`), recipeMd(t, false))
  writeFileSync(join(skillDir, `${t.slug}.md`), recipeMd(t, true))
  built.push(t)
}

// index.md, web variant
const idx = ['# Motionboard recipes', '', `${order.length} motion recipes from launch films, grouped by where they sit in a film. Each link is a self-contained instruction file for a coding agent.`, '', `License: MIT. Free to use in your own projects, including commercial launch films. ${REPO}/blob/main/LICENSE`, '']
for (const p of POSITION_ORDER) {
  const group = order.filter((t) => t.pos === p)
  if (!group.length) continue
  idx.push(`## ${POSITIONS[p]}`, '')
  for (const t of group) idx.push(`- [${t.en}](${mdUrl(t.slug)})${en[t.slug]?.def ? `: ${en[t.slug].def}` : ''}`)
  idx.push('')
}
writeFileSync(join(webDir, 'index.md'), idx.join('\n'))

// index.md, skill variant: the list the agent scans to pick shots
const sidx = [
  '# Motionboard recipes',
  '',
  `${built.length} recipes, grouped by where they sit in a launch film. Each line: English name, slug (the file is \`./<slug>.md\`), what the shot does, film length. Each recipe page on ${SITE} shows the preview film next to the original.`,
  '',
]
for (const p of POSITION_ORDER) {
  const group = built.filter((t) => t.pos === p)
  if (!group.length) continue
  sidx.push(`## ${POSITIONS[p]}`, '')
  for (const t of group) {
    sidx.push(`- **${t.en}** \`${t.slug}\`: ${en[t.slug]?.def || ''} (${filmSeconds(t.video)}s)`)
  }
  sidx.push('')
}
writeFileSync(join(skillDir, 'index.md'), sidx.join('\n'))

// README recipe tables
const mdCell = (s) => cell(s).replace(/`/g, '')
function readmeTable(lang) {
  const zh = lang === 'zh'
  const base = zh ? `${SITE}/zh/recipes` : `${SITE}/recipes`
  const L = []
  for (const p of POSITION_ORDER) {
    const group = built.filter((t) => t.pos === p)
    if (!group.length) continue
    L.push(`### ${zh ? POSITIONS_ZH[p] : POSITIONS[p]} (${group.length})`, '', zh ? '| 配方 | 镜头 |' : '| Recipe | Shot |', '| --- | --- |')
    for (const t of group) {
      L.push(`| [${zh ? t.zh : t.en}](${base}/${t.slug}/) | ${mdCell(zh ? t.zh1 || '' : en[t.slug]?.def || '')} |`)
    }
    L.push('')
  }
  return L.join('\n').trimEnd()
}
function writeReadmeTable(file, lang) {
  const path = join(ROOT, file)
  if (!existsSync(path)) return console.warn(`warn: ${file} missing, recipe table skipped`)
  const text = readFileSync(path, 'utf8')
  const start = text.indexOf('<!-- recipes:start -->')
  const end = text.indexOf('<!-- recipes:end -->')
  if (start < 0 || end < start) return console.warn(`warn: ${file} has no recipes:start / recipes:end markers`)
  const next = `${text.slice(0, start)}<!-- recipes:start -->\n\n${readmeTable(lang)}\n\n${text.slice(end)}`
  if (next !== text) writeFileSync(path, next)
}
writeReadmeTable('README.md', 'en')
writeReadmeTable('README_CN.md', 'zh')

// llms.txt
const llms = [
  '# Motionboard',
  '',
  `> Motionboard is a library of ${order.length} motion recipes broken down from Apple-grade launch films. Each recipe is a 10-second 1920x1080 shot made with code (HyperFrames, HTML and GSAP), with a Markdown file that contains the spec, the prompt and the full runnable source. Give a recipe file to a coding agent such as Claude Code, Codex or Cursor and it recreates the shot for the user's own product, as a video or as motion on a website.`,
  '',
  `License: MIT. Free to use in your own projects, including commercial launch films. ${REPO}/blob/main/LICENSE`,
  '',
  '## Agent skill',
  '',
  `Install the Motionboard skill in Claude Code or Codex and the agent knows all ${order.length} recipes: \`${SKILL_INSTALL}\`. Or tell the agent: "Install this skill: ${REPO}". The skill plans and builds a whole launch film for the user's product, or a single shot. Source: ${REPO}`,
  '',
  '## Recipes',
  '',
  `- [All recipes](${SITE}/r/index.md): the full list grouped by position in a launch film`,
]
for (const t of order) llms.push(`- [${t.en}](${mdUrl(t.slug)})${en[t.slug]?.def ? `: ${en[t.slug].def}` : ''}`)
llms.push('')
writeFileSync(join(ROOT, 'public/llms.txt'), llms.join('\n'))

console.log(`recipes: wrote ${built.length} recipes x 2 variants (public/r, ${SKILL_DIR}/recipes), index.md, llms.txt, README tables (${missing} without en.json text) for ${SITE}`)
