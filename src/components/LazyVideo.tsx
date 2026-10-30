import { useEffect, useRef } from 'react'

// Muted loop that loads and plays only while at least 40% of it is on screen.
export function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current!
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) v.src = src
          v.play().catch(() => {})
        } else v.pause()
      },
      { threshold: 0.4 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src])
  return <video ref={ref} className={className} muted loop playsInline preload="none" poster={poster} />
}
