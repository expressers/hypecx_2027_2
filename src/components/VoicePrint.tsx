// Assinatura de voz: barras de nível determinísticas a partir do nome.
function seeded(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export function VoicePrint({ seed, bars = 18, live = false }: { seed: string; bars?: number; live?: boolean }) {
  const rnd = seeded(seed)
  const heights = Array.from({ length: bars }, (_, i) => {
    const env = Math.sin((i / (bars - 1)) * Math.PI) * 0.7 + 0.3
    return Math.max(0.12, env * (0.35 + rnd() * 0.65))
  })
  return (
    <span className="voiceprint" data-live={live} aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          style={{ '--h': h.toFixed(2), '--d': `${(rnd() * 0.6).toFixed(2)}s` } as React.CSSProperties}
        />
      ))}
    </span>
  )
}
