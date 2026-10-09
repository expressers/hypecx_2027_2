import { useEffect, useRef } from 'react'
import { links, partners } from '@/content'

// Tamanho óptico: logótipos largos ficam mais baixos, logótipos altos mais pequenos,
// para todos pesarem o mesmo na grelha.
const size = (ratio: number, boost = 1) => {
  const h = Math.min(52, Math.min(48, Math.sqrt(5600 / ratio)) * boost)
  return { height: Math.round(h), width: Math.round(h * ratio) }
}

export function Sponsors() {
  const grid = useRef<HTMLUListElement>(null)

  // como um medidor de nível: as células acendem em sequência ao entrar no ecrã
  useEffect(() => {
    const el = grid.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.lit = 'true'
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="patrocinio" className="sponsors" aria-labelledby="patrocinio-title">
      <div className="shell">
        <h2 id="patrocinio-title" className="sponsors-title">
          A emissão de 2026 foi possível graças a
        </h2>
        <ul ref={grid} className="sponsor-grid" data-lit="false">
          {partners.map((p, i) => {
            const s = size(p.ratio, 'boost' in p ? p.boost : 1)
            return (
              <li key={p.file} style={{ '--i': i } as React.CSSProperties}>
                <img
                  src={`/media/partners/${p.file}`}
                  alt={p.name}
                  loading="lazy"
                  width={s.width}
                  height={s.height}
                  style={{ height: s.height, width: 'auto' }}
                />
              </li>
            )
          })}
        </ul>
        <div className="sponsor-cta">
          <p className="sponsor-pitch">A sua marca no ar em 2027, perante quem decide a experiência do cliente em Angola.</p>
          <a className="btn btn-ghost" href={links.sponsor}>
            Seja patrocinador
          </a>
        </div>
      </div>
    </section>
  )
}
