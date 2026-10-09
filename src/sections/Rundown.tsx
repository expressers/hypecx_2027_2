import { useEffect, useRef, useState } from 'react'
import { rundown, speakers } from '@/content'
import { tuneToVoice } from '@/lib/voice-store'

const nameOf = (slug: string) => speakers.find((s) => s.slug === slug)?.name ?? slug

export function Rundown() {
  const [live, setLive] = useState(rundown[0].time)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const rows = list.current?.querySelectorAll<HTMLElement>('[data-time]')
    if (!rows) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setLive((e.target as HTMLElement).dataset.time!)),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])

  return (
    <section id="alinhamento" className="rundown" aria-labelledby="alinhamento-title">
      <div className="shell rundown-grid">
        <div className="rundown-head">
          <h2 id="alinhamento-title" className="display-2">
            Alinhamento
          </h2>
          <p className="lede">
            A emissão de 2026, segmento a segmento. O alinhamento da 3ª edição é anunciado em breve.
          </p>
        </div>

        <ol ref={list} className="rundown-list">
          {rundown.map((seg) => (
            <li key={seg.time} data-time={seg.time} className="segment" data-live={seg.time === live}>
              <p className="segment-time">
                <time>{seg.time}</time>
                <span className="segment-kind">{seg.kind}</span>
                <span className="segment-air">No ar</span>
              </p>
              <div className="segment-body">
                <h3 className="segment-title">{seg.title}</h3>
                <p className="segment-text">{seg.text}</p>
                {seg.voices && (
                  <p className="segment-voices">
                    {seg.voices.map((v) => (
                      <button key={v} type="button" onClick={() => tuneToVoice(v)} title={`Ouvir ${nameOf(v)} na secção Vozes`}>
                        {nameOf(v)}
                      </button>
                    ))}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
