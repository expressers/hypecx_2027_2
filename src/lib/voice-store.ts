import { useSyncExternalStore } from 'react'
import { speakers } from '@/content'
import { surge } from '@/lib/signal'

// Voz (orador) sintonizada na secção "Vozes". Partilhada com o alinhamento,
// cujos nomes sintonizam directamente o orador.
let current = speakers[0].slug
const subs = new Set<() => void>()

export function setVoice(slug: string) {
  if (slug === current) return
  current = slug
  surge(0.25)
  subs.forEach((fn) => fn())
}

// Enquanto a página rola até um orador escolhido, o scroll não muda a voz.
let holdUntil = 0

export function setVoiceFromScroll(slug: string) {
  if (performance.now() < holdUntil) return
  setVoice(slug)
}

/** Sintoniza um orador a partir de outra secção e leva o visitante até ele. */
export function tuneToVoice(slug: string) {
  setVoice(slug)
  holdUntil = performance.now() + 1600
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
  const row = document.querySelector<HTMLElement>(`.voice-list [data-slug="${slug}"]`)
  if (row && row.offsetParent) {
    row.scrollIntoView({ behavior, block: 'center' })
    return
  }
  const card = document.querySelector<HTMLElement>(`.voice-strip [data-slug="${slug}"]`)
  document.getElementById('vozes')?.scrollIntoView({ behavior, block: 'start' })
  card?.parentElement?.scrollTo({ left: card.offsetLeft - (card.parentElement.clientWidth - card.clientWidth) / 2, behavior })
}

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
