// Segmenta los registros en ciclos y calcula sus agregados. Lógica PURA.
// Un ciclo "completo" va de un ancla al día anterior al ancla siguiente.
import { daysBetween } from '../lib/date'
import type { DayLog, ISODate } from './types'
import type { CycleSettings } from './types'
import { computeCycleInfo, getAnchors, type CycleStats } from './cycle'
import type { Phase } from './season'

export interface CycleAggregate {
  /** id estable = fecha del ancla de inicio. */
  id: ISODate
  start: ISODate
  end: ISODate
  length: number
  daysLogged: number
  avgMood: number | null
  avgEnergy: number | null
  avgSleep: number | null
  /** conteo de cada síntoma en el ciclo. */
  symptomCounts: Record<string, number>
  /** síntoma más frecuente del ciclo (id) o null. */
  topSymptom: string | null
  /** true si es un ciclo cerrado (hay ancla siguiente). */
  complete: boolean
}

function avg(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null
}

/** Ciclos cerrados, del más reciente al más antiguo. */
export function getCycleAggregates(logs: DayLog[]): CycleAggregate[] {
  const anchors = getAnchors(logs)
  const byDate = new Map(logs.map((l) => [l.date, l]))
  const out: CycleAggregate[] = []

  for (let i = 0; i < anchors.length - 1; i++) {
    const start = anchors[i]
    const nextStart = anchors[i + 1]
    const length = daysBetween(start, nextStart)
    const end = anchors[i + 1] // exclusivo; usamos día anterior para etiquetas

    const moods: number[] = []
    const energies: number[] = []
    const sleeps: number[] = []
    const symptomCounts: Record<string, number> = {}
    let daysLogged = 0

    for (let d = 0; d < length; d++) {
      const date = shiftDate(start, d)
      const log = byDate.get(date)
      if (!log) continue
      daysLogged++
      if (log.mood) moods.push(log.mood)
      if (log.energy) energies.push(log.energy)
      if (log.sleepHours != null) sleeps.push(log.sleepHours)
      for (const s of log.symptoms) symptomCounts[s] = (symptomCounts[s] ?? 0) + 1
    }

    const topSymptom =
      Object.keys(symptomCounts).sort(
        (a, b) => symptomCounts[b] - symptomCounts[a],
      )[0] ?? null

    out.push({
      id: start,
      start,
      end,
      length,
      daysLogged,
      avgMood: avg(moods),
      avgEnergy: avg(energies),
      avgSleep: avg(sleeps),
      symptomCounts,
      topSymptom,
      complete: true,
    })
  }

  return out.reverse()
}

function shiftDate(start: ISODate, days: number): ISODate {
  const [y, m, d] = start.split('-').map(Number)
  const dt = new Date(y, m - 1, d + days)
  const yy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

// ---------- Patrones: cruces fase x métricas ----------
export interface PhaseMetrics {
  phase: Phase
  avgMood: number | null
  avgEnergy: number | null
  avgSleep: number | null
  count: number
}

const PHASE_ORDER: Phase[] = ['menstrual', 'folicular', 'ovulatoria', 'lutea']

/** Promedios de ánimo/energía/sueño por fase, sobre TODOS los registros. */
export function metricsByPhase(
  logs: DayLog[],
  settings: CycleSettings,
  stats: CycleStats,
): PhaseMetrics[] {
  const anchors = getAnchors(logs)
  const buckets: Record<Phase, { mood: number[]; energy: number[]; sleep: number[] }> = {
    menstrual: { mood: [], energy: [], sleep: [] },
    folicular: { mood: [], energy: [], sleep: [] },
    ovulatoria: { mood: [], energy: [], sleep: [] },
    lutea: { mood: [], energy: [], sleep: [] },
  }

  for (const log of logs) {
    const info = computeCycleInfo(log.date, anchors, settings, stats)
    if (!info.phase) continue
    const b = buckets[info.phase]
    if (log.mood) b.mood.push(log.mood)
    if (log.energy) b.energy.push(log.energy)
    if (log.sleepHours != null) b.sleep.push(log.sleepHours)
  }

  return PHASE_ORDER.map((phase) => ({
    phase,
    avgMood: avg(buckets[phase].mood),
    avgEnergy: avg(buckets[phase].energy),
    avgSleep: avg(buckets[phase].sleep),
    count: buckets[phase].mood.length + buckets[phase].energy.length,
  }))
}

/** Frecuencia de cada síntoma por fase (para descubrir tendencias). */
export function symptomsByPhase(
  logs: DayLog[],
  settings: CycleSettings,
  stats: CycleStats,
): Record<Phase, Record<string, number>> {
  const anchors = getAnchors(logs)
  const result: Record<Phase, Record<string, number>> = {
    menstrual: {},
    folicular: {},
    ovulatoria: {},
    lutea: {},
  }
  for (const log of logs) {
    const info = computeCycleInfo(log.date, anchors, settings, stats)
    if (!info.phase) continue
    for (const s of log.symptoms) {
      result[info.phase][s] = (result[info.phase][s] ?? 0) + 1
    }
  }
  return result
}

/** Síntoma más frecuente en todo el historial y su conteo. */
export function topSymptomOverall(
  logs: DayLog[],
): { id: string; count: number } | null {
  const counts: Record<string, number> = {}
  for (const log of logs) {
    for (const s of log.symptoms) counts[s] = (counts[s] ?? 0) + 1
  }
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0]
  return top ? { id: top, count: counts[top] } : null
}
