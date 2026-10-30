import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { getStats, recordCopy, recordWish, setLike, type StatCounts } from '@/server/stats'

type State = { counts: StatCounts; liked: ReadonlySet<string> }

const EMPTY: State = { counts: {}, liked: new Set() }
let state = EMPTY
const listeners = new Set<() => void>()

function update(next: (s: State) => State) {
  state = next(state)
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => void listeners.delete(l)
}
const snapshot = () => state
const serverSnapshot = () => EMPTY

function uid() {
  try {
    let id = localStorage.getItem('mb.uid')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('mb.uid', id)
    }
    return id
  } catch {
    return null
  }
}

const withCount = (s: State, slug: string, patch: Partial<{ copies: number; likes: number }>): StatCounts => ({
  ...s.counts,
  [slug]: { ...(s.counts[slug] ?? { copies: 0, likes: 0 }), ...patch },
})

let loaded = false

export function StatsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const id = uid()
    if (loaded || !id) return
    loaded = true
    getStats({ data: { uid: id } })
      .then((r) => update(() => ({ counts: r.counts, liked: new Set(r.liked) })))
      .catch(() => {
        loaded = false
      })
  }, [])
  return children
}

export function useStat(slug: string) {
  const s = useSyncExternalStore(subscribe, snapshot, serverSnapshot)
  const c = s.counts[slug]
  return { copies: c?.copies ?? 0, likes: c?.likes ?? 0, liked: s.liked.has(slug) }
}

function applyLike(slug: string, on: boolean, likes: number) {
  update((s) => {
    const liked = new Set(s.liked)
    if (on) liked.add(slug)
    else liked.delete(slug)
    return { counts: withCount(s, slug, { likes }), liked }
  })
}

export function useLike(slug: string) {
  const { liked, likes } = useStat(slug)
  const toggle = useCallback(() => {
    const id = uid()
    if (!id) return
    const was = state.liked.has(slug)
    const before = state.counts[slug]?.likes ?? 0
    applyLike(slug, !was, Math.max(0, before + (was ? -1 : 1)))
    setLike({ data: { slug, uid: id, on: !was } })
      .then((r) => update((s) => ({ ...s, counts: withCount(s, slug, { likes: r.likes }) })))
      .catch(() => applyLike(slug, was, before))
  }, [slug])
  return { liked, likes, toggle }
}

export function trackCopy(slug: string) {
  update((s) => ({ ...s, counts: withCount(s, slug, { copies: (s.counts[slug]?.copies ?? 0) + 1 }) }))
  recordCopy({ data: { slug } }).catch(() => {})
}

export function trackWish(slug: string) {
  recordWish({ data: { slug } }).catch(() => {})
}
