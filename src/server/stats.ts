import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { bySlug } from '@/data/terms'

const UID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type StatCounts = Record<string, { copies: number; likes: number }>

function slugOf(d: unknown) {
  const slug = (d as { slug?: unknown } | null)?.slug
  if (typeof slug !== 'string' || !bySlug[slug]) throw new Error('bad slug')
  return slug
}

function uidOf(d: unknown) {
  const uid = (d as { uid?: unknown } | null)?.uid
  if (typeof uid !== 'string' || !UID.test(uid)) throw new Error('bad uid')
  return uid
}

export const getStats = createServerFn({ method: 'POST' })
  .validator((d: { uid: string }) => ({ uid: uidOf(d) }))
  .handler(async ({ data }) => {
    const [stats, mine] = await env.DB.batch<{ slug: string; copies: number; likes: number }>([
      env.DB.prepare('SELECT slug, copies, likes FROM stats'),
      env.DB.prepare('SELECT slug FROM likes WHERE uid = ?').bind(data.uid),
    ])
    const counts: StatCounts = {}
    for (const r of stats.results) counts[r.slug] = { copies: r.copies, likes: r.likes }
    return { counts, liked: mine.results.map((r) => r.slug) }
  })

const bump = (column: 'copies' | 'wishes', slug: string) =>
  env.DB.prepare(
    `INSERT INTO stats (slug, ${column}) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET ${column} = ${column} + 1`,
  )
    .bind(slug)
    .run()

export const recordCopy = createServerFn({ method: 'POST' })
  .validator((d: { slug: string }) => ({ slug: slugOf(d) }))
  .handler(async ({ data }) => {
    await bump('copies', data.slug)
  })

export const recordWish = createServerFn({ method: 'POST' })
  .validator((d: { slug: string }) => ({ slug: slugOf(d) }))
  .handler(async ({ data }) => {
    await bump('wishes', data.slug)
  })

export const setLike = createServerFn({ method: 'POST' })
  .validator((d: { slug: string; uid: string; on: boolean }) => ({
    slug: slugOf(d),
    uid: uidOf(d),
    on: !!d.on,
  }))
  .handler(async ({ data }) => {
    const { slug, uid, on } = data
    const [, , count] = await env.DB.batch<{ likes: number }>([
      on
        ? env.DB.prepare('INSERT OR IGNORE INTO likes (slug, uid) VALUES (?, ?)').bind(slug, uid)
        : env.DB.prepare('DELETE FROM likes WHERE slug = ? AND uid = ?').bind(slug, uid),
      env.DB.prepare(
        'INSERT INTO stats (slug, likes) VALUES (?1, (SELECT COUNT(*) FROM likes WHERE slug = ?1)) ON CONFLICT(slug) DO UPDATE SET likes = (SELECT COUNT(*) FROM likes WHERE slug = ?1)',
      ).bind(slug),
      env.DB.prepare('SELECT likes FROM stats WHERE slug = ?').bind(slug),
    ])
    return { likes: count.results[0]?.likes ?? 0 }
  })
