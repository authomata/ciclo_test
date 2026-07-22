import { useLiveQuery } from 'dexie-react-hooks'
import { getDayLog, upsertDayLog } from '../../db/repositories'
import { missionsForDay } from '../../domain/missions'
import { SEASON_META } from '../../domain/season'
import type { Season } from '../../domain/season'

// Misiones del día: sugerencias de bienestar según la estación. Siempre opcionales.
export function Missions({ season, date }: { season: Season; date: string }) {
  const log = useLiveQuery(() => getDayLog(date), [date])
  const missions = missionsForDay(season, date)
  const done = log?.missionsDone ?? []
  const meta = SEASON_META[season]

  const toggle = (id: string) =>
    upsertDayLog(date, {
      missionsDone: done.includes(id) ? done.filter((m) => m !== id) : [...done, id],
    })

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-lg font-medium text-content">
          Invitaciones de {meta.title}
        </h3>
        <span className="text-xs text-content-soft">opcionales</span>
      </div>

      <ul className="space-y-2">
        {missions.map((m) => {
          const isDone = done.includes(m.id)
          return (
            <li key={m.id}>
              <button
                onClick={() => toggle(m.id)}
                aria-pressed={isDone}
                className={`flex w-full items-start gap-3 rounded-xl2 border p-3.5 text-left transition ${
                  isDone
                    ? 'border-season bg-season-soft'
                    : 'border-line bg-surface-2 hover:border-content-soft'
                }`}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                    isDone
                      ? 'border-season bg-season text-on-season'
                      : 'border-content-soft'
                  }`}
                >
                  {isDone ? '✓' : ''}
                </span>
                <span
                  className={`text-sm leading-snug ${
                    isDone ? 'text-season-ink' : 'text-content'
                  }`}
                >
                  {m.text}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
