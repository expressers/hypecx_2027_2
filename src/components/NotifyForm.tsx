import { useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { links } from '@/content'

type Props = { ticket?: string; label?: string; compact?: boolean }

/**
 * Acção principal: deixar o email para ser avisado. Sem backend, compõe a
 * mensagem para hypecx@targeting.ao no programa de email do visitante.
 */
export function NotifyForm({ ticket, label = 'Seja avisado quando abrirem os ingressos', compact }: Props) {
  const id = useId()
  const [state, setState] = useState<'idle' | 'error' | 'sent'>('idle')

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement
    const email = input.value.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState('error')
      input.focus()
      return
    }
    setState('sent')
    window.location.href = links.notify(email, ticket)
  }

  return (
    <form className="notify" data-compact={compact} onSubmit={submit} noValidate>
      <label htmlFor={`${id}-email`} className="notify-label">
        {label}
      </label>
      <div className="notify-row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="nome@empresa.ao"
          aria-invalid={state === 'error'}
          aria-describedby={`${id}-msg`}
          onInput={() => state !== 'idle' && setState('idle')}
        />
        <button type="submit" className="btn btn-signal">
          Avisem-me
          <ArrowRight aria-hidden size={18} strokeWidth={2} />
        </button>
      </div>
      <p id={`${id}-msg`} className="notify-msg" data-state={state} aria-live="polite">
        {state === 'error' && 'Escreva um email válido, por exemplo nome@empresa.ao.'}
        {state === 'sent' && 'A abrir o seu email com a mensagem pronta a enviar.'}
      </p>
    </form>
  )
}
