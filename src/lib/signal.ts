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
  sound.follow(level())
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
  sound.burst()
  tuneListeners.forEach((fn) => fn(stationId))
}

// ---------------------------------------------------------------- som (opcional)
// Desligado por defeito. Chiado de rádio baixo + rajada de estática ao sintonizar.
type SoundListener = (on: boolean) => void

export const sound = (() => {
  let ctx: AudioContext | null = null
  let hissGain: GainNode | null = null
  let master: GainNode | null = null
  let noiseBuffer: AudioBuffer | null = null
  let on = false
  const listeners = new Set<SoundListener>()

  function makeNoise(c: AudioContext) {
    const len = c.sampleRate * 2
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    let b = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      b = 0.97 * b + 0.03 * w // ligeiramente "rosa"
      d[i] = w * 0.35 + b * 2.2
    }
    return buf
  }

  function start() {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = ctx ?? new Ctor()
    void ctx.resume()
    noiseBuffer = noiseBuffer ?? makeNoise(ctx)
    master = ctx.createGain()
    master.gain.value = 0
    master.gain.setTargetAtTime(1, ctx.currentTime, 0.2)
    master.connect(ctx.destination)

    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    src.loop = true
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 2400
    band.Q.value = 0.6
    hissGain = ctx.createGain()
    hissGain.gain.value = 0.012
    src.connect(band).connect(hissGain).connect(master)
    src.start()
  }

  return {
    get on() {
      return on
    },
    toggle() {
      on = !on
      if (on) start()
      else if (ctx && master) {
        const m = master
        m.gain.setTargetAtTime(0, ctx.currentTime, 0.08)
        setTimeout(() => m.disconnect(), 400)
        master = null
        hissGain = null
      }
      listeners.forEach((fn) => fn(on))
    },
    subscribe(fn: SoundListener) {
      listeners.add(fn)
      return () => {
        listeners.delete(fn)
      }
    },
    follow(l: number) {
      if (!on || !ctx || !hissGain) return
      hissGain.gain.setTargetAtTime(0.008 + l * 0.018, ctx.currentTime, 0.1)
    },
    burst() {
      if (!on || !ctx || !master || !noiseBuffer) return
      const src = ctx.createBufferSource()
      src.buffer = noiseBuffer
      const band = ctx.createBiquadFilter()
      band.type = 'bandpass'
      band.Q.value = 1.4
      band.frequency.setValueAtTime(900, ctx.currentTime)
      band.frequency.exponentialRampToValueAtTime(4200, ctx.currentTime + 0.28)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.03)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32)
      src.connect(band).connect(g).connect(master)
      src.start(ctx.currentTime, Math.random())
      src.stop(ctx.currentTime + 0.4)
    },
  }
})()
