// Cálculo de fases y predicción a partir de los DayLogs. Lógica PURA y testeable.
//
// Filosofía: preciso donde hay datos, borroso donde no.
//   - El ancla real es `isPeriodStart` (primer día de menstruación marcado).
//   - Si hay un ciclo cerrado (dos anclas), su longitud es REAL.
//   - Si el ciclo está en curso, se ESTIMA con el promedio observado (o el de ajustes).
//   - Sin ninguna ancla, no inventamos fase: devolvemos "sin datos".

import { addDays, daysBetween } from '../lib/date'
import type { CycleSettings, DayLog, ISODate } from './types'
import { PHASE_TO_SEASON, type Phase, type Season } from './season'

export interface CycleStats {
  /** Longitud media efectiva del ciclo (observada si hay datos, si no la de ajustes). */
  effectiveCycleLength: number
  /** Longitudes de ciclos cerrados, en orden. */
  cycleLengths: number[]
  /** Número de ciclos completos registrados. */
  completedCycles: number
  /** Desviación estándar de las longitudes recientes (null si <2). */
  stdDev: number | null
  /** Confianza 0..1 de la predicción. Alimenta la "niebla" del Oráculo (Fase 3). */
  confidence: number
}

export interface CycleInfo {
  /** Día del ciclo (1 = primer día de menstruación). null si no hay datos. */
  cycleDay: number | null
  phase: Phase | null
  season: Season | null
  /** Longitud del ciclo al que pertenece la fecha (real o estimada). */
  cycleLength: number
  /** true si la longitud es estimada (ciclo en curso o proyección hacia atrás). */
  isEstimatedLength: boolean
  /** Día del ciclo en que se estima la ovulación. */
  ovulationDay: number
  /** ¿La fecha cae en la ventana fértil estimada? */
  isFertileWindow: boolean
  /** Ancla (period-start) sobre la que se basa el cálculo; null si es proyección. */
  anchorDate: ISODate | null
}

export interface Prediction {
  nextPeriodStart: ISODate | null
  predictedPeriodEnd: ISODate | null
  fertileWindowStart: ISODate | null
  fertileWindowEnd: ISODate | null
  stats: CycleStats
}

const EMPTY_INFO: CycleInfo = {
  cycleDay: null,
  phase: null,
  season: null,
  cycleLength: 0,
  isEstimatedLength: true,
  ovulationDay: 0,
  isFertileWindow: false,
  anchorDate: null,
}

/** Fechas de inicio de menstruación (anclas), ordenadas ascendente. */
export function getAnchors(logs: DayLog[]): ISODate[] {
  return logs
    .filter((l) => l.isPeriodStart)
    .map((l) => l.date)
    .sort()
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function stddev(xs: number[]): number {
  const m = mean(xs)
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)))
}

export function computeStats(anchors: ISODate[], settings: CycleSettings): CycleStats {
  const cycleLengths: number[] = []
  for (let i = 1; i < anchors.length; i++) {
    cycleLengths.push(daysBetween(anchors[i - 1], anchors[i]))
  }
  const recent = cycleLengths.slice(-6)
  const effectiveCycleLength = recent.length
    ? Math.round(mean(recent))
    : settings.avgCycleLength
  const sd = recent.length >= 2 ? stddev(recent) : null

  // Confianza: crece con el nº de ciclos (satura ~4) y baja con la variabilidad.
  let confidence = Math.min(cycleLengths.length / 4, 1)
  if (sd !== null) {
    // sd de 0-1 días apenas penaliza; sd de 7+ días la reduce a la mitad.
    const variancePenalty = Math.max(0, 1 - Math.max(0, sd - 1) / 12)
    confidence *= variancePenalty
  }

  return {
    effectiveCycleLength,
    cycleLengths,
    completedCycles: cycleLengths.length,
    stdDev: sd,
    confidence: Math.max(0, Math.min(1, confidence)),
  }
}

/** Deriva fase/estación y contexto para una fecha concreta. */
export function computeCycleInfo(
  date: ISODate,
  anchors: ISODate[],
  settings: CycleSettings,
  stats?: CycleStats,
): CycleInfo {
  if (anchors.length === 0) return EMPTY_INFO
  const s = stats ?? computeStats(anchors, settings)
  const avg = s.effectiveCycleLength

  // Índice del último ancla <= date.
  let idx = -1
  for (let i = 0; i < anchors.length; i++) {
    if (anchors[i] <= date) idx = i
    else break
  }

  let cycleDay: number
  let cycleLength: number
  let isEstimatedLength: boolean
  let anchorDate: ISODate | null

  if (idx === -1) {
    // La fecha es anterior a la primera ancla: proyección hacia atrás.
    const first = anchors[0]
    const diff = daysBetween(date, first) // > 0
    cycleDay = avg - ((diff - 1) % avg)
    cycleLength = avg
    isEstimatedLength = true
    anchorDate = null
  } else {
    anchorDate = anchors[idx]
    const next = anchors[idx + 1]
    if (next) {
      cycleLength = daysBetween(anchorDate, next)
      isEstimatedLength = false
    } else {
      cycleLength = avg
      isEstimatedLength = true
    }
    cycleDay = daysBetween(anchorDate, date) + 1
  }

  const periodLen = settings.avgPeriodLength
  // Ovulación estimada: longitud del ciclo menos fase lútea. Acotada para ciclos cortos.
  const ovulationDay = Math.max(periodLen + 2, cycleLength - settings.lutealLength)

  const phase = phaseForDay(cycleDay, periodLen, ovulationDay)
  const isFertileWindow = cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay + 1

  return {
    cycleDay,
    phase,
    season: phase ? PHASE_TO_SEASON[phase] : null,
    cycleLength,
    isEstimatedLength,
    ovulationDay,
    isFertileWindow,
    anchorDate,
  }
}

function phaseForDay(
  cycleDay: number,
  periodLen: number,
  ovulationDay: number,
): Phase {
  if (cycleDay <= periodLen) return 'menstrual'
  // Ventana ovulatoria (La Cumbre): el pico, ±1 día alrededor de la ovulación.
  if (cycleDay >= ovulationDay - 1 && cycleDay <= ovulationDay + 1) return 'ovulatoria'
  if (cycleDay < ovulationDay - 1) return 'folicular'
  return 'lutea'
}

/** Predicción del próximo periodo y ventana fértil. */
export function computePrediction(
  anchors: ISODate[],
  settings: CycleSettings,
  stats?: CycleStats,
): Prediction {
  const s = stats ?? computeStats(anchors, settings)
  if (anchors.length === 0) {
    return {
      nextPeriodStart: null,
      predictedPeriodEnd: null,
      fertileWindowStart: null,
      fertileWindowEnd: null,
      stats: s,
    }
  }
  const lastAnchor = anchors[anchors.length - 1]
  const avg = s.effectiveCycleLength
  const nextPeriodStart = addDays(lastAnchor, avg)
  const predictedPeriodEnd = addDays(nextPeriodStart, settings.avgPeriodLength - 1)
  const ovulationDay = Math.max(
    settings.avgPeriodLength + 2,
    avg - settings.lutealLength,
  )
  return {
    nextPeriodStart,
    predictedPeriodEnd,
    fertileWindowStart: addDays(lastAnchor, ovulationDay - 1 - 5),
    fertileWindowEnd: addDays(lastAnchor, ovulationDay - 1 + 1),
    stats: s,
  }
}
