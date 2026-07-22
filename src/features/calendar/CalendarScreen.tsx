import { useMemo, useState } from 'react'
import { PageHeader } from '../../ui/PageHeader'
import { Disclaimer } from '../../ui/Disclaimer'
import { DaySheet } from './DaySheet'
import { useCycle } from '../../hooks/useCycle'
import { SEASON_META, SEASON_ORDER } from '../../domain/season'
import { SEASON_VARS, rgb } from '../../ui/seasonPalette'
import { toISODate, todayISO } from '../../lib/date'

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function CalendarScreen() {
  const { hasData, infoFor, logsByDate } = useCycle()
  const today = todayISO()
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [selected, setSelected] = useState<string | null>(null)

  const cells = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor])

  const shift = (delta: number) => {
    setCursor((c) => {
      const m = c.month + delta
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })
  }

  return (
    <div>
      <PageHeader title="Calendario" subtitle="Tus días, pintados con las estaciones" />

      {!hasData && (
        <p className="mb-4 rounded-xl2 border border-line bg-surface-2 px-4 py-3 text-sm text-content-soft">
          Marca tu primer día de menstruación en “Hoy” y el calendario empezará a colorearse.
        </p>
      )}

      {/* Navegación de mes */}
      <div className="mb-4 flex items-center justify-between">
        <NavBtn label="Mes anterior" onClick={() => shift(-1)}>
          ‹
        </NavBtn>
        <p className="font-display text-lg font-medium capitalize text-content">
          {MONTHS[cursor.month]} {cursor.year}
        </p>
        <NavBtn label="Mes siguiente" onClick={() => shift(1)}>
          ›
        </NavBtn>
      </div>

      {/* Cabecera de días */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="py-1 text-center text-xs font-medium text-content-soft">
            {d}
          </div>
        ))}
      </div>

      {/* Rejilla */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} />
          const iso = toISODate(cell)
          const info = infoFor(iso)
          const log = logsByDate.get(iso)
          const vars = info.season ? SEASON_VARS[info.season] : null
          const isToday = iso === today
          const isFuture = iso > today

          return (
            <button
              key={i}
              onClick={() => setSelected(iso)}
              aria-label={`${cell.getDate()} de ${MONTHS[cursor.month]}${
                info.season ? `, ${SEASON_META[info.season].title}` : ''
              }`}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition ${
                isToday ? 'border-season ring-1 ring-season' : 'border-transparent'
              }`}
              style={{
                backgroundColor: vars ? rgb(vars.soft) : 'transparent',
                color: vars ? rgb(vars.ink) : 'rgb(var(--content-soft))',
                opacity: isFuture ? 0.55 : 1,
              }}
            >
              <span className={isToday ? 'font-semibold' : ''}>{cell.getDate()}</span>
              <span className="mt-0.5 flex h-1.5 items-center gap-0.5" aria-hidden>
                {log?.isPeriodStart || log?.flow ? (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: rgb('var(--inv)') }}
                  />
                ) : null}
                {log && (log.mood || log.energy || log.symptoms.length || log.notes) ? (
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: vars ? rgb(vars.base) : 'rgb(var(--line))' }}
                  />
                ) : null}
              </span>
            </button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {SEASON_ORDER.map((s) => {
          const meta = SEASON_META[s]
          const v = SEASON_VARS[s]
          return (
            <div key={s} className="flex items-center gap-2 text-xs text-content-soft">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: rgb(v.base) }}
              />
              {meta.title} · {meta.place}
            </div>
          )
        })}
      </div>

      <div className="mt-6">
        <Disclaimer compact />
      </div>

      {selected && <DaySheet date={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function NavBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-lg text-content transition hover:border-season hover:text-season"
    >
      {children}
    </button>
  )
}

/** Rejilla del mes con la semana empezando en lunes; huecos como null. */
function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // getDay(): 0=domingo..6=sábado. Convertimos a lunes=0.
  const lead = (first.getDay() + 6) % 7
  const cells: (Date | null)[] = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
