import { BroadcastBar } from '@/components/BroadcastBar'
import { SignalRule } from '@/components/SignalRule'
import { TuneStatic } from '@/components/Static'
import { useStationObserver } from '@/lib/stations'
import { Archive } from '@/sections/Archive'
import { Hero } from '@/sections/Hero'
import { Rundown } from '@/sections/Rundown'
import { SignOff } from '@/sections/SignOff'
import { Sponsors } from '@/sections/Sponsors'
import { Tickets } from '@/sections/Tickets'
import { Voices } from '@/sections/Voices'
import { Why } from '@/sections/Why'

/** Duotone magenta/violeta: as fotos ficam "fora de sintonia" até entrarem no ar. */
function DuotoneFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
      <filter id="duo" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.04 0.36 0.88 1" />
          <feFuncG type="table" tableValues="0.035 0.25 0.14 0.86" />
          <feFuncB type="table" tableValues="0.07 0.84 0.48 0.93" />
        </feComponentTransfer>
      </filter>
    </svg>
  )
}

export default function App() {
  useStationObserver()
  return (
    <>
      <span id="topo" aria-hidden="true" />
      <a className="skip" href="#porque">
        Saltar para o conteúdo
      </a>
      <DuotoneFilter />
      <BroadcastBar />
      <main>
        <Hero />
        <SignalRule to="porque" />
        <Why />
        <SignalRule to="vozes" />
        <Voices />
        <SignalRule to="alinhamento" />
        <Rundown />
        <SignalRule to="arquivo" />
        <Archive />
        <SignalRule to="patrocinio" />
        <Sponsors />
        <Tickets />
      </main>
      <SignOff />
      <TuneStatic />
    </>
  )
}
