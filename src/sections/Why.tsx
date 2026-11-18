import { about, transcript } from '@/content'

/** Converte **texto** em <strong>. */
function rich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  )
}

export function Why() {
  let i = 0
  return (
    <section id="porque" className="why" aria-labelledby="porque-title">
      <div className="shell">
        <h2 id="porque-title" className="transcript">
          {transcript.map((line, li) => (
            <span key={li} className="transcript-line" data-accent={li === 1}>
              {line.split(' ').map((w) => (
                <span key={i} className="w" style={{ '--i': i++ } as React.CSSProperties}>
                  {w}{' '}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <div className="why-body">
          {about.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'why-body-lead' : undefined}>
              {rich(paragraph)}
            </p>
          ))}
        </div>

        <p className="why-close">
          Em 2026 foram <strong>15 oradores</strong>, <strong>12 marcas parceiras</strong> e um tema que ficou:{' '}
          <em>Quem entende, lidera.</em>
        </p>
      </div>
    </section>
  )
}
