import { useEffect, useState } from 'react'
import { event } from '@/content'

const TARGET = new Date(event.countdownTo).getTime()

const pad = (n: number) => String(n).padStart(2, '0')

function remaining(now: number) {
  const ms = Math.max(0, TARGET - now)
  const total = Math.floor(ms / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

/** Contagem decrescente para a 3ª edição, em dias, horas, minutos e segundos. */
export function Countdown() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (TARGET <= Date.now()) return
    const id = window.setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= TARGET) window.clearInterval(id)
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const left = remaining(now)
  const units = [
    { value: left.days, label: left.days === 1 ? 'dia' : 'dias' },
    { value: left.hours, label: left.hours === 1 ? 'hora' : 'horas' },
    { value: left.minutes, label: 'min' },
    { value: left.seconds, label: 'seg' },
  ]

  return (
    <div className="countdown" role="timer" aria-live="off" aria-label={`Contagem para ${event.dateLabel}`}>
      <p className="countdown-label">
        Contagem para <strong>{event.dateLabel}</strong>
      </p>
      <ol className="countdown-list" aria-hidden="true">
        {units.map((u) => (
          <li key={u.label}>
            <span className="countdown-value">{pad(u.value)}</span>
            <span className="countdown-unit">{u.label}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
