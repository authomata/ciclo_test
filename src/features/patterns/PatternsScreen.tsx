import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'
import { Disclaimer } from '../../ui/Disclaimer'
import { Achievements } from './Achievements'
import { useHistory } from '../../hooks/useHistory'
import { SEASON_META, PHASE_TO_SEASON, type Phase } from '../../domain/season'
import { SYMPTOMS_BY_ID } from '../../domain/symptoms'
import { fromISODate } from '../../lib/date'

// Colores de estación en tonos medios que funcionan en claro y oscuro.
const SEASON_HEX: Record<Phase, string> = {
  menstrual: '#5f6aa6',
  folicular: '#3f8f5c',
  ovulatoria: '#d67e36',
  lutea: '#b05c47',
}
const AXIS = '#9a9aa4'

export function PatternsScreen() {
  const { loading, cycles, phaseMetrics, symptomsPhase, achievements } = useHistory()

  const hasMetrics = phaseMetrics.some((m) => m.avgMood || m.avgEnergy)

  // Datos para el gráfico ánimo/energía por estación.
  const phaseData = phaseMetrics.map((m) => ({
    name: SEASON_META[PHASE_TO_SEASON[m.phase]].title,
    phase: m.phase,
    energia: m.avgEnergy ? Number(m.avgEnergy.toFixed(2)) : 0,
    animo: m.avgMood ? Number(m.avgMood.toFixed(2)) : null,
  }))

  // Longitud de ciclos (de más antiguo a más reciente).
  const lengthData = [...cycles].reverse().map((c) => ({
    name: shortMonth(c.start),
    dias: c.length,
  }))

  // Top síntomas agregados de todas las fases.
  const symptomTotals: Record<string, number> = {}
  for (const phase of Object.keys(symptomsPhase) as Phase[]) {
    for (const [id, n] of Object.entries(symptomsPhase[phase])) {
      symptomTotals[id] = (symptomTotals[id] ?? 0) + n
    }
  }
  const topSymptoms = Object.entries(symptomTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div>
      <PageHeader title="Patrones" subtitle="Tus tendencias, en tus propias palabras" />

      {loading ? (
        <p className="text-content-soft">Cargando…</p>
      ) : (
        <>
          {!hasMetrics && (
            <Card className="mb-6">
              <p className="text-sm leading-relaxed text-content-soft">
                Aún no hay suficientes registros para dibujar tendencias. Registra tu
                ánimo, energía y síntomas unos días y aquí empezarás a verte.
              </p>
            </Card>
          )}

          {hasMetrics && (
            <Card className="mb-5">
              <h3 className="mb-1 font-display text-lg font-medium text-content">
                Ánimo y energía por estación
              </h3>
              <p className="mb-3 text-xs text-content-soft">
                Barras: energía media · Línea: ánimo medio (0–5)
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={phaseData} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={AXIS} opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: AXIS, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgb(var(--surface-2))',
                      border: '1px solid rgb(var(--line))',
                      borderRadius: 12,
                      color: 'rgb(var(--content))',
                    }}
                  />
                  <Bar dataKey="energia" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {phaseData.map((d) => (
                      <Cell key={d.phase} fill={SEASON_HEX[d.phase]} />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="animo"
                    stroke="rgb(var(--content))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          )}

          {lengthData.length >= 2 && (
            <Card className="mb-5">
              <h3 className="mb-3 font-display text-lg font-medium text-content">
                Longitud de tus ciclos
              </h3>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={lengthData} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={AXIS} opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fill: AXIS, fontSize: 11 }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fill: AXIS, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgb(var(--surface-2))',
                      border: '1px solid rgb(var(--line))',
                      borderRadius: 12,
                      color: 'rgb(var(--content))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dias"
                    stroke="rgb(var(--season))"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: 'rgb(var(--season))' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          {topSymptoms.length > 0 && (
            <Card className="mb-5">
              <h3 className="mb-3 font-display text-lg font-medium text-content">
                Tus señales más frecuentes
              </h3>
              <ul className="space-y-2">
                {topSymptoms.map(([id, n]) => {
                  const s = SYMPTOMS_BY_ID[id]
                  const max = topSymptoms[0][1]
                  return (
                    <li key={id} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 text-sm text-content">
                        <span aria-hidden className="mr-1">
                          {s?.emoji}
                        </span>
                        {s?.label ?? id}
                      </span>
                      <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-line">
                        <span
                          className="block h-full rounded-full bg-season"
                          style={{ width: `${(n / max) * 100}%` }}
                        />
                      </span>
                      <span className="w-6 text-right text-xs text-content-soft">{n}</span>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}

          <h3 className="mb-3 mt-8 font-display text-xl font-semibold text-content">
            Logros de autoconocimiento
          </h3>
          <Achievements achievements={achievements} />

          <div className="mt-8">
            <Disclaimer compact />
          </div>
        </>
      )}
    </div>
  )
}

function shortMonth(iso: string): string {
  const d = fromISODate(iso)
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${meses[d.getMonth()]}`
}
