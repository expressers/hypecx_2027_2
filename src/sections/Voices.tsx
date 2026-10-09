import { useEffect, useRef } from 'react'
import { speakers } from '@/content'
import { paintNoise } from '@/components/Static'
import { VoicePrint } from '@/components/VoicePrint'
import { motionOK, onTick } from '@/lib/signal'
import { setVoice, setVoiceFromScroll, useVoice } from '@/lib/voice-store'

const photo = (slug: string) => `/media/speakers/${slug}.webp`

/** Moldura com estática: cada troca de orador passa pelo ruído. */
function TunedFrame({ slug }: { slug: string }) {
  const noise = useRef<HTMLCanvasElement>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const cv = noise.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx || !motionOK()) return
    const end = performance.now() / 1000 + 0.3
    cv.style.opacity = '0.7'
    const stop = onTick((t) => {
      paintNoise(ctx, cv.width, cv.height, true)
      cv.style.opacity = String(Math.max(0, (end - t) / 0.3) * 0.7)
      if (t > end) stop()
    })
    return stop
  }, [slug])

  const s = speakers.find((x) => x.slug === slug) ?? speakers[0]

  return (
    <figure className="frame">
      <div className="frame-media">
        {speakers.map((sp) => (
          <div key={sp.slug} className="frame-layer" data-active={sp.slug === slug}>
            <img className="duo" src={photo(sp.slug)} alt="" loading="lazy" />
            <img className="tuned" src={photo(sp.slug)} alt={sp.slug === slug ? `Retrato de ${sp.name}` : ''} loading="lazy" />
          </div>
        ))}
        <canvas ref={noise} width={120} height={150} className="frame-noise" aria-hidden="true" />
      </div>
      <figcaption className="frame-caption">
        <span className="frame-name">{s.name}</span>
        <span className="frame-role">
          {s.role}, {s.company}
        </span>
      </figcaption>
    </figure>
  )
}

export function Voices() {
  const active = useVoice()
  const list = useRef<HTMLOListElement>(null)
  const strip = useRef<HTMLDivElement>(null)

  // desktop: a voz no centro do ecrã fica sintonizada
  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>('[data-slug]')
    if (!items) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setVoiceFromScroll((e.target as HTMLElement).dataset.slug!)),
      { rootMargin: '-46% 0px -46% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // telemóvel: o retrato centrado no carrossel sintoniza
  useEffect(() => {
    const root = strip.current
    if (!root) return
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          ;(e.target as HTMLElement).dataset.tuned = String(e.intersectionRatio > 0.75)
        }),
      { root, threshold: [0, 0.75, 1] },
    )
    root.querySelectorAll('.strip-card').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="vozes" className="voices" aria-labelledby="vozes-title">
      <div className="shell voices-head">
        <h2 id="vozes-title" className="display-2">
          As vozes de 2026
        </h2>
        <p className="lede">
          Líderes que estão a transformar a forma como se escuta, decide e entrega valor ao cliente em Angola. Os oradores
          de 2027 entram no ar em breve.
        </p>
      </div>

      <div className="shell voices-grid">
        <ol ref={list} className="voice-list">
          {speakers.map((s) => (
            <li key={s.slug} data-slug={s.slug}>
              <button
                type="button"
                className="voice-row"
                aria-current={s.slug === active ? 'true' : undefined}
                onPointerEnter={() => setVoice(s.slug)}
                onFocus={() => setVoice(s.slug)}
                onClick={() => setVoice(s.slug)}
              >
                <span className="voice-name">{s.name}</span>
                <span className="voice-meta">
                  {s.role}, {s.company}
                </span>
                <VoicePrint seed={s.name} live={s.slug === active} />
              </button>
            </li>
          ))}
        </ol>
        <div className="voices-stage">
          <TunedFrame slug={active} />
        </div>
      </div>

      <div ref={strip} className="voice-strip" aria-label="Oradores de 2026">
        {speakers.map((s) => (
          <figure key={s.slug} className="strip-card" data-tuned="false" data-slug={s.slug}>
            <div className="strip-media">
              <img className="duo" src={photo(s.slug)} alt="" loading="lazy" />
              <img className="tuned" src={photo(s.slug)} alt={`Retrato de ${s.name}`} loading="lazy" />
            </div>
            <figcaption>
              <span className="frame-name">{s.name}</span>
              <span className="frame-role">
                {s.role}, {s.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
