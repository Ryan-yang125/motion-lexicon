import { useCallback, useSyncExternalStore } from 'react'

const KEY = 'mb.saved'
const EMPTY: string[] = []
const listeners = new Set<() => void>()
let cache: { raw: string | null; list: string[] } = { raw: null, list: EMPTY }

function read(): string[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return cache.list
  }
  if (raw === cache.raw) return cache.list
  let list = EMPTY
  try {
    const parsed = raw ? JSON.parse(raw) : []
    if (Array.isArray(parsed)) list = parsed.filter((x): x is string => typeof x === 'string')
  } catch {}
  cache = { raw, list }
  return list
}

function write(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    cache = { raw: JSON.stringify(list), list }
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) l()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, read, () => EMPTY)
  const has = useCallback((slug: string) => saved.includes(slug), [saved])
  const toggle = useCallback((slug: string) => {
    const cur = read()
    write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug])
  }, [])
  return { saved, has, toggle }
}
