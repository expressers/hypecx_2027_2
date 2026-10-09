import { event, stations } from '@/content'

// Linha que fica plana e solta um último impulso: fim da emissão.
function burstPath() {
  const pts: string[] = ['M0 40', 'L560 40']
  for (let i = 0; i <= 40; i++) {
    const x = 560 + i * 2
    const env = Math.sin((i / 40) * Math.PI)
    const y = 40 + Math.sin(i * 1.15) * 32 * env
    pts.push(`L${x} ${y.toFixed(1)}`)
  }
  pts.push('L1200 40')
  return pts.join(' ')
}

const PATH = burstPath()

export function SignOff() {
  return (
    <footer id="contactos" className="signoff" aria-labelledby="signoff-title">
      <div className="shell">
        <svg className="flatline" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
          <path d={PATH} pathLength={1} />
        </svg>
        <h2 id="signoff-title" className="signoff-title">
          Até 2027.
        </h2>
        <p className="signoff-sub">Hype CX, 3ª&nbsp;edição. Luanda, data a anunciar.</p>

        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/media/logo-hypecx-branco.svg" alt="Hype CX" width={156} height={41} loading="lazy" />
            <p>O primeiro e o maior evento sobre Experiência do Cliente e Inovação do mercado angolano. Uma iniciativa Targeting.</p>
          </div>

          <div>
            <h3 className="footer-h">Contactos</h3>
            <ul className="footer-links">
              <li>
                <a href={`mailto:${event.email}`}>{event.email}</a>
              </li>
              <li>
                <a href={event.phoneHref}>{event.phone}</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-h">Redes</h3>
            <ul className="footer-links">
              <li>
                <a href={event.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={event.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={event.youtube} target="_blank" rel="noreferrer">
                  YouTube
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="footer-h">Estações</h3>
            <ul className="footer-links footer-stations">
              {stations.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span>{s.freq.toFixed(1)}</span> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-base">
          <p>© 2026 Hype CX by Targeting. Todos os direitos reservados.</p>
          <p>
            Desenvolvido por <a href="https://expressers.ao" target="_blank" rel="noreferrer">Expressers</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
