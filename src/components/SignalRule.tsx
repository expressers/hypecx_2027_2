import { useEffect, useRef } from 'react'
import { stations } from '@/content'
import { motionOK, onTick, wave } from '@/lib/signal'

/**
 * Fronteira entre estações: o sinal continua a passar entre secções,
 * com a frequência da estação seguinte na ponta da linha.
 */
export function SignalRule({ to }: { to: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const station = stations.find((s) => s.id === to)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    let W = 0
    let H = 0
    let dpr = 1
    const phase = (station?.freq ?? 90) * 0.37

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      W = cv.clientWidth
      H = cv.clientHeight
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
    }

    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.lineWidth = 1.5
      ctx.strokeStyle = '#e0247a'
      ctx.beginPath()
      for (let px = 0; px <= W; px += 3) {
        const x = px / W
        // o sinal nasce plano à esquerda e ganha corpo até à frequência
        const env = Math.pow(x, 1.6)
        const y = H / 2 + wave(x, t, phase) * (H * 0.46) * env
        if (px === 0) ctx.moveTo(px, y)
        else ctx.lineTo(px, y)
      }
      ctx.stroke()
    }

    size()
    const ro = new ResizeObserver(size)
    ro.observe(cv)

    if (!motionOK()) {
      draw(7.1)
      return () => ro.disconnect()
    }

    let stop: (() => void) | null = null
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !stop) stop = onTick((t) => draw(t))
      else if (!e.isIntersecting && stop) {
        stop()
        stop = null
      }
    })
    io.observe(cv)
    return () => {
      ro.disconnect()
      io.disconnect()
      stop?.()
    }
  }, [station])

  if (!station) return null
  return (
    <div className="signal-rule shell" aria-hidden="true">
      <canvas ref={ref} />
      <span>
        {station.freq.toFixed(1)} <small>FM</small>
      </span>
    </div>
  )
}
