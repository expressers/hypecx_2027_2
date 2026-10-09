import { useEffect, useRef } from 'react'
import { Play } from 'lucide-react'
import { event } from '@/content'
import { NotifyForm } from '@/components/NotifyForm'
import { paintNoise } from '@/components/Static'
import { excite, motionOK, onTick, surge, wave } from '@/lib/signal'

const WORD = ['H', 'Y', 'P', 'E', ' ', 'C', 'X']

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const scope = useRef<HTMLCanvasElement>(null)
  const noise = useRef<HTMLCanvasElement>(null)
  const mark = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const sec = section.current
    const cv = scope.current
    const nz = noise.current
    const row = mark.current
    if (!sec || !cv || !nz || !row) return
    const ctx = cv.getContext('2d')
    const nctx = nz.getContext('2d')
    if (!ctx || !nctx) return

    const letters = Array.from(row.querySelectorAll<HTMLElement>('[data-l]'))
    let W = 0
    let H = 0
    let dpr = 1
    let midY = 0.5
    let centres: { x: number; w: number }[] = []
    const pointer = { x: -1, presence: 0, lastX: 0, lastY: 0 }

    function measure() {
      const r = sec!.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = r.width
      H = r.height
      cv!.width = Math.round(W * dpr)
      cv!.height = Math.round(H * dpr)
      const m = row!.getBoundingClientRect()
      midY = (m.top + m.height * 0.52 - r.top) / H
      centres = letters.map((el) => {
        const b = el.getBoundingClientRect()
        return { x: (b.left + b.width / 2 - r.left) / W, w: b.width / W }
      })
    }

    // amplitude local: o ponteiro "aproxima o microfone"
    const local = (x: number) => 1 + 1.1 * pointer.presence * Math.exp(-((x - pointer.x) ** 2) / 0.012)

    function draw(t: number, intro: number) {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.clearRect(0, 0, W, H)
      const amp = Math.min(H * 0.3, W * 0.2, 280) * intro
      const y0 = H * midY
      const layers = [
        { phase: 2.1, scale: 0.55, width: 1, color: 'rgba(139,116,255,0.45)' },
        { phase: 4.4, scale: 0.8, width: 1, color: 'rgba(139,116,255,0.3)' },
        { phase: 1.2, scale: 0.9, width: 1.5, color: 'rgba(91,63,214,0.9)' },
        { phase: 0, scale: 1, width: 2.5, color: '#e0247a' },
      ]
      for (const L of layers) {
        ctx!.beginPath()
        ctx!.lineWidth = L.width
        ctx!.strokeStyle = L.color
        ctx!.lineJoin = 'round'
        for (let px = 0; px <= W; px += 3) {
          const x = px / W
          const y = y0 + wave(x, t, L.phase) * amp * L.scale * local(x)
          if (px === 0) ctx!.moveTo(px, y)
          else ctx!.lineTo(px, y)
        }
        ctx!.stroke()
      }
    }

    function shapeLetters(t: number, intro: number) {
      centres.forEach((c, i) => {
        let v = 0
        for (let k = -2; k <= 2; k++) v += Math.abs(wave(c.x + (k * c.w) / 5, t)) * local(c.x)
        v = Math.min(1, v / 5)
        const narrow = W < 640
        const wdth = 50 + (Math.min(150, (narrow ? 92 : 82) + v * (narrow ? 30 : 120)) - 50) * intro
        const wght = 300 + (Math.min(900, 640 + v * 320) - 300) * intro
        letters[i].style.fontVariationSettings = `"wdth" ${wdth.toFixed(1)}, "wght" ${wght.toFixed(0)}`
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(sec)
    document.fonts?.ready.then(measure)

    if (!motionOK()) {
      draw(12.3, 1)
      nz.style.opacity = '0'
      return () => ro.disconnect()
    }

    // entrada em directo: estática → sinal
    const born = performance.now() / 1000
    surge(0.7)
    let visible = true
    let stop: (() => void) | null = null

    const run = () => {
      stop = onTick((t, dt) => {
        const intro = Math.min(1, (t - born) / 1.6)
        const eased = 1 - Math.pow(1 - intro, 3)
        pointer.presence *= Math.exp(-1.6 * dt)
        draw(t, eased)
        shapeLetters(t, eased)
        const n = Math.max(0, 1 - intro * 1.6)
        if (n > 0) {
          paintNoise(nctx!, nz!.width, nz!.height, true)
          nz!.style.opacity = String(n * 0.55)
        } else if (nz!.style.opacity !== '0') nz!.style.opacity = '0'
      })
    }
    run()
    // as letras mudam de largura durante a entrada: medir de novo no fim
    const settle = window.setTimeout(measure, 1700)

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        visible = true
        run()
      } else if (!e.isIntersecting && visible) {
        visible = false
        stop?.()
        stop = null
      }
    })
    io.observe(sec)

    function move(e: PointerEvent) {
      const r = sec!.getBoundingClientRect()
      const dx = e.clientX - pointer.lastX
      const dy = e.clientY - pointer.lastY
      pointer.lastX = e.clientX
      pointer.lastY = e.clientY
      pointer.x = (e.clientX - r.left) / r.width
      pointer.presence = Math.min(1, pointer.presence + 0.08)
      excite(Math.min(0.06, Math.hypot(dx, dy) / 1400))
    }
    sec.addEventListener('pointermove', move, { passive: true })

    return () => {
      window.clearTimeout(settle)
      ro.disconnect()
      io.disconnect()
      stop?.()
      sec.removeEventListener('pointermove', move)
    }
  }, [])

  return (
    <section id="inicio" ref={section} className="hero" aria-labelledby="hero-title">
      <div className="hero-photo" aria-hidden="true">
        <img src="/media/event/hero.webp" alt="" fetchPriority="high" />
      </div>
      <canvas ref={scope} className="hero-scope" aria-hidden="true" />
      <canvas ref={noise} className="hero-noise" width={240} height={135} aria-hidden="true" />

      <div className="hero-content shell">
        <h1 id="hero-title" className="hero-mark">
          <span className="sr-only">Hype CX 2027</span>
          <span ref={mark} className="mark-row" aria-hidden="true">
            {WORD.map((ch, i) =>
              ch === ' ' ? <span key={i} className="mark-gap" /> : <span key={i} data-l>{ch}</span>,
            )}
          </span>
        </h1>

        <div className="hero-foot">
          <div className="hero-offer">
            <p className="hero-lede">
              O maior evento de Experiência do Cliente em Angola volta ao ar. 3ª&nbsp;edição, Luanda, data a anunciar.
            </p>
            <NotifyForm />
          </div>

          <div className="hero-side">
            <p className="hero-year" aria-hidden="true">
              2027
            </p>
            <a className="replay" href={event.aftermovie} target="_blank" rel="noreferrer">
              <span className="replay-thumb">
                <img src="/media/event/palco-feedback.webp" alt="" loading="lazy" />
                <Play aria-hidden size={18} strokeWidth={2} fill="currentColor" />
              </span>
              <span className="replay-text">
                Ver o vídeo de 2026
                <small>Aftermovie no YouTube</small>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
