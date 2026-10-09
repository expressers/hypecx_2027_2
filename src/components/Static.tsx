import { useEffect, useRef } from 'react'
import { motionOK, onTick, onTune } from '@/lib/signal'

/** Desenha um fotograma de estática (ruído de TV/rádio) num canvas pequeno. */
export function paintNoise(ctx: CanvasRenderingContext2D, w: number, h: number, tint = false) {
  const img = ctx.createImageData(w, h)
  const buf = new Uint32Array(img.data.buffer)
  for (let i = 0; i < buf.length; i++) {
    const v = (Math.random() * 255) | 0
    // ABGR little-endian; a tinta puxa o ruído para magenta/violeta
    const r = tint ? Math.min(255, v + 40) : v
    const b = tint ? Math.min(255, v + 25) : v
    buf[i] = (255 << 24) | (b << 16) | (v << 8) | r
  }
  ctx.putImageData(img, 0, 0)
}

/**
 * Estática de sintonia: um véu de ruído em ecrã inteiro que aparece por uma
 * fracção de segundo sempre que a emissão muda de estação.
 */
export function TuneStatic() {
  const ref = useRef<HTMLCanvasElement>(null)
  const tear = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const band = tear.current
    if (!canvas || !band) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let until = 0
    let stop: (() => void) | null = null

    const off = onTune(() => {
      if (!motionOK()) return
      until = performance.now() / 1000 + 0.34
      canvas.dataset.on = 'true'
      // reinicia a faixa de interferência que varre o ecrã
      band.dataset.on = 'false'
      void band.offsetWidth
      band.dataset.on = 'true'
      if (!stop) {
        stop = onTick((t) => {
          paintNoise(ctx, canvas.width, canvas.height, true)
          if (t > until) {
            canvas.dataset.on = 'false'
            stop?.()
            stop = null
          }
        })
      }
    })
    return () => {
      off()
      stop?.()
    }
  }, [])

  return (
    <>
      <canvas ref={ref} width={240} height={135} className="tune-static" aria-hidden="true" data-on="false" />
      <div ref={tear} className="tune-tear" aria-hidden="true" data-on="false" />
    </>
  )
}
