import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Play } from 'lucide-react'
import { archive, event } from '@/content'

export function Archive() {
  const reel = useRef<HTMLDivElement>(null)

  // cada fotografia sai do duotone quando fica bem dentro do ecrã
  useEffect(() => {
    const root = reel.current
    if (!root) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => ((e.target as HTMLElement).dataset.tuned = String(e.intersectionRatio > 0.6))),
      { threshold: [0, 0.6, 1] },
    )
    root.querySelectorAll('.reel-photo').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const nudge = (dir: 1 | -1) => {
    const el = reel.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="arquivo" className="archive" aria-labelledby="arquivo-title">
      <div className="shell archive-head">
        <h2 id="arquivo-title" className="display-2">
          Arquivo da emissão
        </h2>
        <div className="archive-controls">
          <a className="btn btn-signal" href={event.aftermovie} target="_blank" rel="noreferrer">
            <Play aria-hidden size={16} strokeWidth={2} fill="currentColor" />
            Ver o vídeo de 2026
          </a>
          <button type="button" className="icon-btn" onClick={() => nudge(-1)} aria-label="Recuar no arquivo">
            <ArrowLeft aria-hidden size={18} strokeWidth={1.75} />
          </button>
          <button type="button" className="icon-btn" onClick={() => nudge(1)} aria-label="Avançar no arquivo">
            <ArrowRight aria-hidden size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div ref={reel} className="reel" tabIndex={0} aria-label="Fotografias e frases da edição de 2026">
        {archive.map((f, i) =>
          f.type === 'photo' ? (
            <figure
              key={i}
              className="reel-photo"
              data-tuned="false"
              style={{ '--ar': `${f.w} / ${f.h}` } as React.CSSProperties}
            >
              <div className="reel-media">
                <img src={f.src} alt={f.caption} loading="lazy" width={f.w} height={f.h} />
                <img className="duo" src={f.src} alt="" aria-hidden="true" loading="lazy" width={f.w} height={f.h} />
              </div>
              <figcaption>{f.caption}</figcaption>
            </figure>
          ) : (
            <blockquote key={i} className="reel-quote" data-tone={i < 3 ? 'magenta' : i < 6 ? 'violet' : 'paper'}>
              <p>{f.quote}</p>
              <footer>{f.source}</footer>
            </blockquote>
          ),
        )}
      </div>
    </section>
  )
}
