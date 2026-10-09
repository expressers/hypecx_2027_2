import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { links, tickets } from '@/content'
import { NotifyForm } from '@/components/NotifyForm'

export function Tickets() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="ingressos" className="tickets" aria-labelledby="ingressos-title">
      <div className="shell">
        <h2 id="ingressos-title" className="tickets-title">
          Reserve a sua frequência.
        </h2>
        <p className="lede tickets-lede">
          Os preços da 3ª&nbsp;edição são anunciados em breve. Escolha o seu ingresso e avisamos primeiro.
        </p>

        <ol className="ticket-list">
          {tickets.map((t, i) => (
            <li key={t.name} className="ticket" data-open={open === t.name} style={{ '--i': i } as React.CSSProperties}>
              <div className="ticket-main">
                <h3 className="ticket-name">{t.name}</h3>
                <p className="ticket-note">{t.note}</p>
                <p className="ticket-price">
                  <span className="sr-only">Preço: </span>Em breve
                </p>
                {t.action === 'corporate' ? (
                  <a className="btn btn-ghost" href={links.corporate}>
                    Pedir proposta
                    <ArrowRight aria-hidden size={18} strokeWidth={2} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    aria-expanded={open === t.name}
                    onClick={() => setOpen(open === t.name ? null : t.name)}
                  >
                    Avisem-me
                    <ArrowRight aria-hidden size={18} strokeWidth={2} />
                  </button>
                )}
              </div>
              {t.action === 'notify' && open === t.name && (
                <div className="ticket-form">
                  <NotifyForm ticket={`${t.name}, Hype CX 2027`} label={`O seu email para o aviso ${t.name}`} compact />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
