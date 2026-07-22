import { useLiveQuery } from 'dexie-react-hooks'
import { getDayLog, upsertDayLog } from '../../db/repositories'
import type { DayLog, FlowIntensity } from '../../domain/types'
import { SYMPTOMS } from '../../domain/symptoms'
import { longDate } from '../../lib/date'

const FLOWS: { id: FlowIntensity; label: string }[] = [
  { id: 'spotting', label: 'Manchado' },
  { id: 'light', label: 'Ligero' },
  { id: 'medium', label: 'Medio' },
  { id: 'heavy', label: 'Abundante' },
]

const MOODS = ['😔', '😕', '😐', '🙂', '😄']
const ENERGY = ['🪫', '🔋', '🔋', '⚡', '⚡']

// Editor de un día. Persiste cada cambio al instante (upsert) — datos locales,
// sin botón de guardar, sin fricción.
export function DayLogEditor({ date }: { date: string }) {
  const log = useLiveQuery(() => getDayLog(date), [date])

  const set = (patch: Partial<Omit<DayLog, 'date' | 'createdAt' | 'updatedAt'>>) =>
    upsertDayLog(date, patch)

  const symptoms = log?.symptoms ?? []
  const toggleSymptom = (id: string) =>
    set({
      symptoms: symptoms.includes(id)
        ? symptoms.filter((s) => s !== id)
        : [...symptoms, id],
    })

  return (
    <div className="space-y-6">
      {/* Menstruación / ancla del ciclo */}
      <Section title="Menstruación">
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm text-content">
            ¿Es el primer día de tu menstruación?
          </span>
          <button
            role="switch"
            aria-checked={!!log?.isPeriodStart}
            onClick={() =>
              set({
                isPeriodStart: !log?.isPeriodStart,
                flow: !log?.isPeriodStart ? (log?.flow ?? 'medium') : log?.flow,
              })
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              log?.isPeriodStart ? 'bg-season' : 'bg-line'
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-surface-2 shadow transition-transform ${
                log?.isPeriodStart ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </label>

        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-content-soft">Flujo</p>
          <div className="flex flex-wrap gap-2">
            {FLOWS.map((f) => (
              <Chip
                key={f.id}
                active={log?.flow === f.id}
                onClick={() => set({ flow: log?.flow === f.id ? undefined : f.id })}
              >
                {f.label}
              </Chip>
            ))}
          </div>
        </div>
      </Section>

      {/* Ánimo y energía */}
      <Section title="¿Cómo te sientes?">
        <Scale
          label="Ánimo"
          icons={MOODS}
          value={log?.mood}
          onChange={(v) => set({ mood: v })}
        />
        <div className="h-4" />
        <Scale
          label="Energía"
          icons={ENERGY}
          value={log?.energy}
          onChange={(v) => set({ energy: v })}
        />
      </Section>

      {/* Síntomas */}
      <Section title="Síntomas">
        <div className="flex flex-wrap gap-2">
          {SYMPTOMS.map((s) => (
            <Chip
              key={s.id}
              active={symptoms.includes(s.id)}
              onClick={() => toggleSymptom(s.id)}
            >
              <span aria-hidden className="mr-1">
                {s.emoji}
              </span>
              {s.label}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Sueño */}
      <Section title="Sueño">
        <label className="flex items-center gap-3">
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={24}
            step={0.5}
            value={log?.sleepHours ?? ''}
            placeholder="—"
            onChange={(e) => {
              const v = e.target.value
              set({ sleepHours: v === '' ? undefined : Number(v) })
            }}
            className="w-20 rounded-lg border border-line bg-surface px-3 py-2 text-content"
          />
          <span className="text-sm text-content-soft">horas</span>
        </label>
      </Section>

      {/* Notas */}
      <Section title="Notas">
        <textarea
          value={log?.notes ?? ''}
          onChange={(e) => set({ notes: e.target.value })}
          placeholder="Lo que quieras recordar de hoy…"
          rows={3}
          className="w-full resize-none rounded-xl2 border border-line bg-surface px-3 py-2 text-content placeholder:text-content-soft"
        />
      </Section>

      <p className="text-center text-xs text-content-soft">
        Se guarda solo, en {longDate(date)}.
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-display text-lg font-medium text-content">{title}</h3>
      {children}
    </section>
  )
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
        active
          ? 'border-season bg-season-soft text-season-ink'
          : 'border-line text-content-soft hover:border-content-soft'
      }`}
    >
      {children}
    </button>
  )
}

function Scale({
  label,
  icons,
  value,
  onChange,
}: {
  label: string
  icons: string[]
  value?: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-content-soft">{label}</p>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {icons.map((icon, i) => {
          const level = i + 1
          const active = value === level
          return (
            <button
              key={i}
              role="radio"
              aria-checked={active}
              aria-label={`${label} ${level} de 5`}
              onClick={() => onChange(level)}
              className={`flex h-11 flex-1 items-center justify-center rounded-xl border text-xl transition ${
                active
                  ? 'border-season bg-season-soft'
                  : 'border-line opacity-60 hover:opacity-100'
              }`}
            >
              <span aria-hidden>{icon}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
