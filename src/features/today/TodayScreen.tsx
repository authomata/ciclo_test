import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'
import { Disclaimer } from '../../ui/Disclaimer'
import { ALL_SEASONS, SEASON_META } from '../../domain/season'
import { useUIStore } from '../../stores/uiStore'
import { longDate, todayISO } from '../../lib/date'

// Fase 1: pantalla base. El registro diario y el cálculo real de fase
// llegan en la Fase 2. Aquí mostramos la estación activa (por ahora
// seleccionable a mano) para dejar visible el sistema de biomas.
export function TodayScreen() {
  const active = useUIStore((s) => s.activeSeason)
  const setSeason = useUIStore((s) => s.setActiveSeason)
  const meta = SEASON_META[active]

  return (
    <div>
      <PageHeader title="Hoy" subtitle={longDate(todayISO())} />

      <Card className="mb-4 bg-season-soft">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-4xl">
            {meta.emoji}
          </span>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-season">
              {meta.title} · {meta.place}
            </p>
            <p className="mt-1 leading-relaxed text-season-ink">{meta.blurb}</p>
          </div>
        </div>
      </Card>

      <section aria-label="Vista previa de las cuatro estaciones" className="mb-6">
        <p className="mb-2 text-xs uppercase tracking-wide text-content-soft">
          Vista previa — el cálculo real de tu fase llega pronto
        </p>
        <div className="grid grid-cols-4 gap-2">
          {ALL_SEASONS.map((s) => (
            <button
              key={s.season}
              onClick={() => setSeason(s.season)}
              aria-pressed={s.season === active}
              className={`flex flex-col items-center gap-1 rounded-xl2 border p-2 text-center transition ${
                s.season === active
                  ? 'border-season ring-1 ring-season'
                  : 'border-line hover:border-content-soft'
              }`}
            >
              <span aria-hidden className="text-xl">
                {s.emoji}
              </span>
              <span className="text-[11px] leading-tight text-content-soft">{s.place}</span>
            </button>
          ))}
        </div>
      </section>

      <Card className="mb-4">
        <p className="text-sm text-content-soft">
          Aquí vivirá tu <span className="font-medium text-content">registro de hoy</span>:
          flujo, síntomas, ánimo, energía, sueño y notas. Cada registro revelará un poco más
          el mapa de tu cuerpo.
        </p>
      </Card>

      <Disclaimer />
    </div>
  )
}
