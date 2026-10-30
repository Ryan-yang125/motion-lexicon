import { gsap } from '@/lib/gsap'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Eight short strokes fly out of the element: the confirmation burst recipe.
export function burst(el: HTMLElement) {
  if (reduced()) return
  const b = document.createElement('span')
  b.className = 'burst'
  b.innerHTML = '<i></i>'.repeat(8)
  el.appendChild(b)
  gsap.fromTo(
    b.children,
    { rotate: (i) => i * 45, x: 0, y: 0, opacity: 1, scaleY: 1 },
    {
      x: (i) => Math.sin((i * Math.PI) / 4) * 46,
      y: (i) => -Math.cos((i * Math.PI) / 4) * 30,
      scaleY: 0.3,
      opacity: 0,
      duration: 0.55,
      ease: 'expo.out',
      onComplete: () => b.remove(),
    },
  )
}

export async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text })
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}
