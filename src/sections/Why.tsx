import { reasons, transcript } from '@/content'

export function Why() {
  let i = 0
  return (
    <section id="porque" className="why" aria-labelledby="porque-title">
      <div className="shell why-grid">
        <p className="why-margin" aria-hidden="true">
          <span>Transcrição</span>
        </p>

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
      </div>

      <div className="shell">
        <ul className="reasons">
          {reasons.map((r) => (
            <li key={r.word} className="reason">
              <span className="reason-word">{r.word}</span>
              <p className="reason-text">{r.text}</p>
            </li>
          ))}
        </ul>

        <p className="why-close">
          Em 2026 foram <strong>10 oradores</strong>, <strong>12 marcas parceiras</strong> e um tema que ficou:{' '}
          <em>Quem entende, lidera.</em>
        </p>
      </div>
    </section>
  )
}
