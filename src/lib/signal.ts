// O "sinal" da emissão: um relógio único (rAF) partilhado pelo osciloscópio,
// pelo título que respira e pelo som opcional. Nada disto passa pelo estado
// do React: os componentes subscrevem e escrevem directamente no DOM/canvas.

type Tick = (t: number, dt: number) => void

const reduceQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

export const motionOK = () => !(reduceQuery?.matches ?? false)

// ---------------------------------------------------------------- relógio
const ticks = new Set<Tick>()
let raf = 0
let last = 0

function loop(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
  last = now
  step(now / 1000, dt)
  ticks.forEach((fn) => fn(now / 1000, dt))
  raf = ticks.size ? requestAnimationFrame(loop) : 0
}

export function onTick(fn: Tick) {
  ticks.add(fn)
  if (!raf && !document.hidden) {
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
  return () => {
    ticks.delete(fn)
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf)
      raf = 0
    } else if (ticks.size && !raf) {
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
  })
}

// ---------------------------------------------------------------- voz
// Envelope com sílabas e pausas, como alguém a falar ao microfone.
const voice = { level: 0.2, target: 0.3, next: 0, energy: 0, boost: 0 }

function step(t: number, dt: number) {
  if (t > voice.next) {
    const pause = Math.random() < 0.18
    voice.target = pause ? 0.04 : 0.18 + Math.random() * 0.55
    voice.next = t + (pause ? 0.25 + Math.random() * 0.35 : 0.09 + Math.random() * 0.16)
  }
  const k = voice.target > voice.level ? 14 : 5 // ataque rápido, queda lenta
  voice.level += (voice.target - voice.level) * Math.min(1, k * dt)
  voice.energy *= Math.exp(-2.2 * dt)
  voice.boost *= Math.exp(-1.4 * dt)
}

/** 0..1: intensidade actual do sinal (voz + gesto do visitante). */
export function level() {
  return Math.min(1, 0.1 + voice.level * 0.55 + voice.energy + voice.boost)
}

/** O visitante "fala": movimento do ponteiro / toque aumenta a energia. */
export function excite(amount: number) {
  voice.energy = Math.min(0.75, voice.energy + amount)
}

/** Pico curto (sintonia, entrada em directo). */
export function surge(amount = 0.6) {
  voice.boost = Math.max(voice.boost, amount)
}

// Onda: portadora + harmónicas, modulada ao longo do eixo x por "frentes"
// que viajam. x em 0..1, devolve -1..1 (já multiplicado pela amplitude).
export function wave(x: number, t: number, phase = 0) {
  const a = level()
  const env =
    0.35 +
    0.65 *
      Math.exp(-((x - (0.5 + 0.32 * Math.sin(t * 0.37 + phase))) ** 2) / 0.045) +
    0.4 * Math.exp(-((x - (0.5 + 0.4 * Math.cos(t * 0.23 + 1.3 + phase))) ** 2) / 0.02)
  const s =
    Math.sin(x * 26 + t * 5.2 + phase) * 0.55 +
    Math.sin(x * 61 - t * 7.9 + phase * 2) * 0.25 +
    Math.sin(x * 113 + t * 13.1) * 0.12 +
    Math.sin(x * 7 - t * 1.3) * 0.3
  return Math.max(-1, Math.min(1, s * env * a))
}

// ---------------------------------------------------------------- sintonia
type TuneListener = (stationId: string) => void
const tuneListeners = new Set<TuneListener>()

export function onTune(fn: TuneListener) {
  tuneListeners.add(fn)
  return () => {
    tuneListeners.delete(fn)
  }
}

export function tune(stationId: string) {
  surge(0.45)
  tuneListeners.forEach((fn) => fn(stationId))
}

