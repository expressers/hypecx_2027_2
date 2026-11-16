import { useSyncExternalStore } from 'react'
import { speakers } from '@/content'
import { surge } from '@/lib/signal'

// Voz (orador) sintonizada na secção "Vozes".
let current = speakers[0].slug
const subs = new Set<() => void>()

export function setVoice(slug: string) {
  if (slug === current) return
  current = slug
  surge(0.25)
  subs.forEach((fn) => fn())
}

/** A voz que passa no centro do ecrã fica sintonizada. */
export const setVoiceFromScroll = setVoice

export function useVoice() {
  return useSyncExternalStore(
    (fn) => {
      subs.add(fn)
      return () => subs.delete(fn)
    },
    () => current,
    () => current,
  )
}
