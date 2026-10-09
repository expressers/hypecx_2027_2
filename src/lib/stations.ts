import { useEffect, useSyncExternalStore } from 'react'
import { stations } from '@/content'
import { tune } from '@/lib/signal'

// Estação activa = secção que atravessa a linha média do ecrã.
let active = stations[0].id
const listeners = new Set<() => void>()

function set(id: string) {
  if (id === active) return
  active = id
  tune(id)
  listeners.forEach((fn) => fn())
}

export function useActiveStation() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    () => active,
    () => active,
  )
}

/** Liga o observador uma única vez (no App). */
export function useStationObserver() {
  useEffect(() => {
    const els = stations.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) set(e.target.id)
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export function goTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
