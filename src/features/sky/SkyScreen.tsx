import { useState } from 'react'
import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'
import { ConstellationView } from './ConstellationView'
import { useHistory } from '../../hooks/useHistory'
import type { CycleAggregate } from '../../domain/cycleHistory'
import { SYMPTOMS_BY_ID } from '../../domain/symptoms'
import { fromISODate, longDate } from '../../lib/date'

export function SkyScreen() {
  const { loading, cycles } = useHistory()
  const [selected, setSelected] = useState<CycleAggregate | null>(null)

  return (
    <div>
      <PageHeader title="Cielo" subtitle="Cada ciclo, una constelación única" />

      {loading ? (
        <p className="text-content-soft">Cargando…</p>
      ) : cycles.length === 0 ? (
        <Card>
          <p className="text-sm leading-relaxed text-content-soft">
            Tu cielo está por nacer. Cuando completes tu primer ciclo (de una
            menstruación a la siguiente), aparecerá aquí su{' '}
            <span className="font-medium text-content">constelación</span>, tejida con los
            datos de ese mes.
          </p>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-content-soft">
            {cycles.length} constelación{cycles.length === 1 ? '' : 'es'} en tu cielo.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {cycles.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line transition hover:border-season"
              >
                <ConstellationView cycle={c} size={180} />
                <span className="bg-surface-2 px-3 py-2 text-left text-xs text-content-soft">
                  {monthLabel(c)}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {selected && <CycleSheet cycle={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function monthLabel(c: CycleAggregate): string {
  const d = fromISODate(c.start)
  const meses = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
  ]
  return `${meses[d.getMonth()]} ${d.getFullYear()}`
}

function CycleSheet({
  cycle,
  onClose,
}: {
  cycle: CycleAggregate
  onClose: () => void
}) {
  const top = cycle.topSymptom ? SYMPTOMS_BY_ID[cycle.topSymptom] : null
  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative mx-auto w-full max-w-md rounded-t-3xl border border-line bg-surface px-5 pb-10 pt-4"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden />
        <div className="flex items-center justify-center">
          <ConstellationView cycle={cycle} size={200} twinkle={false} />
        </div>
        <p className="mt-3 text-center font-display text-xl font-semibold text-content">
          Ciclo de {longDate(cycle.start)}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Stat label="Duración" value={`${cycle.length} días`} />
          <Stat label="Días registrados" value={`${cycle.daysLogged}`} />
          <Stat
            label="Ánimo medio"
            value={cycle.avgMood ? `${cycle.avgMood.toFixed(1)} / 5` : '—'}
          />
          <Stat
            label="Energía media"
            value={cycle.avgEnergy ? `${cycle.avgEnergy.toFixed(1)} / 5` : '—'}
          />
          <Stat
            label="Sueño medio"
            value={cycle.avgSleep ? `${cycle.avgSleep.toFixed(1)} h` : '—'}
          />
          <Stat
            label="Síntoma frecuente"
            value={top ? `${top.emoji} ${top.label}` : '—'}
          />
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl2 border border-line py-3 text-sm font-medium text-content transition hover:border-season hover:text-season"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl2 border border-line bg-surface-2 px-3 py-2.5">
      <p className="text-xs text-content-soft">{label}</p>
      <p className="mt-0.5 font-medium text-content">{value}</p>
    </div>
  )
}
