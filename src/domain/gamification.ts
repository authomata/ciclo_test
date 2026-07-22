// Gamificación PURA y testeable. Se DERIVA de los registros (como las fases),
// no se almacena incrementalmente: así nunca hay drift y es fácil de probar.
//
// Principios del diseño: reforzar constancia y autoconocimiento, nunca ansiedad.
//   - Rachas SUAVES: perder un día resta uno, no resetea a cero.
//   - El compañero no muere ni castiga: si no hay registro, se adormece y espera.

import { addDays, daysBetween } from '../lib/date'
import type { DayLog, ISODate } from './types'

export type CompanionMood = 'radiante' | 'despierto' | 'sereno' | 'somnoliento'

export interface GameState {
  xp: number
  level: number
  wisdomTitle: string
  /** XP acumulado dentro del nivel actual. */
  intoLevel: number
  /** XP necesario para pasar del nivel actual al siguiente. */
  forNext: number
  /** Progreso 0..1 dentro del nivel actual. */
  levelProgress: number
  /** Racha suave (días de momentum). */
  streak: number
  /** Días desde el último registro (null si nunca registró). */
  daysSinceLog: number | null
  loggedToday: boolean
  totalDaysLogged: number
  companion: CompanionMood
}

const XP = {
  dayLogged: 5,
  mood: 2,
  energy: 2,
  sleep: 2,
  symptom: 1,
  symptomsCap: 5,
  notes: 3,
  periodStart: 5,
  mission: 8,
}

const WISDOM_TITLES = [
  'Semilla curiosa',
  'Aprendiz de estaciones',
  'Lectora de señales',
  'Conocedora de mareas',
  'Guardiana del ciclo',
  'Intérprete de estaciones',
  'Sabia de las mareas',
  'Voz del ciclo',
]

/** XP que aporta un registro diario según su riqueza. */
export function xpForLog(log: DayLog): number {
  let xp = 0
  const hasAnything =
    log.flow ||
    log.isPeriodStart ||
    log.mood ||
    log.energy ||
    log.sleepHours != null ||
    log.symptoms.length > 0 ||
    (log.notes && log.notes.trim().length > 0) ||
    (log.missionsDone && log.missionsDone.length > 0)
  if (!hasAnything) return 0

  xp += XP.dayLogged
  if (log.isPeriodStart) xp += XP.periodStart
  if (log.mood) xp += XP.mood
  if (log.energy) xp += XP.energy
  if (log.sleepHours != null) xp += XP.sleep
  xp += Math.min(log.symptoms.length, XP.symptomsCap) * XP.symptom
  if (log.notes && log.notes.trim().length > 0) xp += XP.notes
  if (log.missionsDone) xp += log.missionsDone.length * XP.mission
  return xp
}

/** Umbrales triangulares crecientes: L2=40, L3=+60, L4=+80… (paso +20). */
export function levelForXp(xp: number): {
  level: number
  intoLevel: number
  forNext: number
} {
  let level = 1
  let need = 40
  let floor = 0
  while (xp >= floor + need) {
    floor += need
    level += 1
    need += 20
  }
  return { level, intoLevel: xp - floor, forNext: need }
}

export function wisdomTitle(level: number): string {
  return WISDOM_TITLES[Math.min(level - 1, WISDOM_TITLES.length - 1)]
}

/**
 * Racha suave: recorre día a día desde el primer registro hasta hoy.
 * Día con registro: +1. Día sin registro: -1 (nunca por debajo de 0).
 * Un fallo aislado apenas mella una racha larga: decae, no colapsa.
 */
export function computeStreak(loggedDates: Set<ISODate>, today: ISODate): number {
  if (loggedDates.size === 0) return 0
  const sorted = [...loggedDates].sort()
  let cursor = sorted[0]
  if (cursor > today) return 0
  let streak = 0
  // Bucle acotado (primer registro..hoy).
  while (cursor <= today) {
    streak = loggedDates.has(cursor) ? streak + 1 : Math.max(0, streak - 1)
    cursor = addDays(cursor, 1)
  }
  return streak
}

function companionMood(daysSinceLog: number | null): CompanionMood {
  if (daysSinceLog === null) return 'sereno'
  if (daysSinceLog === 0) return 'radiante'
  if (daysSinceLog === 1) return 'despierto'
  if (daysSinceLog <= 3) return 'sereno'
  return 'somnoliento'
}

export function computeGameState(logs: DayLog[], today: ISODate): GameState {
  const meaningful = logs.filter((l) => xpForLog(l) > 0)
  const xp = meaningful.reduce((sum, l) => sum + xpForLog(l), 0)
  const { level, intoLevel, forNext } = levelForXp(xp)

  const loggedDates = new Set(meaningful.map((l) => l.date))
  const streak = computeStreak(loggedDates, today)

  const pastOrToday = [...loggedDates].filter((d) => d <= today).sort()
  const lastLog = pastOrToday.length ? pastOrToday[pastOrToday.length - 1] : null
  const daysSinceLog = lastLog ? daysBetween(lastLog, today) : null

  return {
    xp,
    level,
    wisdomTitle: wisdomTitle(level),
    intoLevel,
    forNext,
    levelProgress: forNext > 0 ? intoLevel / forNext : 0,
    streak,
    daysSinceLog,
    loggedToday: loggedDates.has(today),
    totalDaysLogged: loggedDates.size,
    companion: companionMood(daysSinceLog),
  }
}
