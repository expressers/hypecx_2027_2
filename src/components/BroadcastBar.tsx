import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { stations } from '@/content'
import { goTo, useActiveStation } from '@/lib/stations'
import { onTune } from '@/lib/signal'

const MIN = 87.5
const MAX = 108
const pos = (f: number) => ((f - MIN) / (MAX - MIN)) * 100

/** Lista de estações em ecrã inteiro (telemóvel e ecrãs estreitos). */
function TunerSheet({ activeId, onClose }: { activeId: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('[aria-current]')?.focus()
    const root = document.documentElement
    root.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>('a, button')
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', key)
    return () => {
      root.style.overflow = ''
      document.removeEventListener('keydown', key)
      opener?.focus()
    }
  }, [onClose])

  return (
    <div ref={ref} className="tuner-sheet" role="dialog" aria-modal="true" aria-label="Secções da página">
      <button type="button" className="icon-btn tuner-close" onClick={onClose} aria-label="Fechar">
        <X aria-hidden size={20} strokeWidth={1.75} />
      </button>
      <ol>
        {stations.map((s, i) => (
          <li key={s.id} style={{ '--i': i } as React.CSSProperties}>
            <a
              href={`#${s.id}`}
              aria-current={s.id === activeId ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault()
                onClose()
                history.replaceState(null, '', `#${s.id}`)
                requestAnimationFrame(() => goTo(s.id))
              }}
            >
              {s.showFreq !== false && <span className="tuner-freq">{s.freq.toFixed(1)}</span>}
              <span className="tuner-name">{s.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function BroadcastBar() {
  const activeId = useActiveStation()
  const active = stations.find((s) => s.id === activeId) ?? stations[0]
  const [scrolled, setScrolled] = useState(false)
  const [sheet, setSheet] = useState(false)
  const needle = useRef<HTMLSpanElement>(null)

  useEffect(
    () =>
      onTune(() => {
        const el = needle.current
        if (!el) return
        el.dataset.pulse = 'false'
        void el.offsetWidth
        el.dataset.pulse = 'true'
      }),
    [],
  )

  useEffect(() => {
    const sentinel = document.getElementById('topo')
    if (!sentinel) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    goTo(id)
    history.replaceState(null, '', `#${id}`)
  }

  return (
    <header className="bar" data-scrolled={scrolled}>
      <div className="bar-inner">
        <a href="#inicio" onClick={jump('inicio')} className="bar-logo" aria-label="Hype CX, voltar ao início">
          <img src="/media/logo-hypecx-branco.svg" alt="Hype CX" width={124} height={32} />
        </a>

        <nav className="dial" aria-label="Secções da página">
          <div className="dial-ruler" aria-hidden="true">
            <span ref={needle} className="dial-needle" style={{ transform: `translateX(${pos(active.freq)}%)` }} />
          </div>
          <ul>
            {stations.map((s) => (
              <li key={s.id} style={{ left: `${pos(s.freq)}%` }}>
                <a href={`#${s.id}`} onClick={jump(s.id)} aria-current={s.id === active.id ? 'location' : undefined}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="dial-readout"
          aria-haspopup="dialog"
          aria-expanded={sheet}
          aria-label={`Secção actual: ${active.label}${
            active.showFreq !== false ? `, ${active.freq.toFixed(1)} FM` : ''
          }. Escolher secção`}
          onClick={() => setSheet(true)}
          title="Escolher secção"
        >
          <span className="dial-lamp" aria-hidden="true" />
          {active.showFreq !== false && (
            <>
              <span className="dial-freq">{active.freq.toFixed(1)}</span>
              <span className="dial-unit">FM</span>
            </>
          )}
          <span className="dial-name">{active.label}</span>
        </button>

        <div className="bar-actions">
          <a href="#ingressos" onClick={jump('ingressos')} className="btn btn-signal btn-sm">
            Ingressos
          </a>
        </div>
      </div>
      {sheet && <TunerSheet activeId={active.id} onClose={() => setSheet(false)} />}
    </header>
  )
}
