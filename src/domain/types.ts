// Tipos núcleo del dominio. Modelo por EVENTOS DIARIOS:
// cada día es un registro independiente; los ciclos y las fases se DERIVAN.
// Nada de UI ni de Dexie aquí — lógica pura y testeable.

/** Fecha local en formato "YYYY-MM-DD". Clave natural y única por día. */
export type ISODate = string

export type FlowIntensity = 'spotting' | 'light' | 'medium' | 'heavy'

/** Registro de un día concreto. `date` es la clave primaria. */
export interface DayLog {
  date: ISODate
  /** Marca el primer día de menstruación: es el ancla que separa ciclos. */
  isPeriodStart?: boolean
  flow?: FlowIntensity
  /** ids del catálogo de síntomas (multiselección). */
  symptoms: string[]
  /** Ánimo en escala 1–5 (opcional; nunca obligatorio). */
  mood?: number
  /** Energía en escala 1–5. */
  energy?: number
  sleepHours?: number
  notes?: string
  createdAt: number
  updatedAt: number
}

/** Ajustes del ciclo. Singleton en la BD (id fijo). */
export interface CycleSettings {
  /** Longitud media del ciclo en días. Default 28, se recalcula con datos reales. */
  avgCycleLength: number
  /** Duración media de la menstruación en días. */
  avgPeriodLength: number
  /** Longitud de la fase lútea, usada para estimar la ovulación. */
  lutealLength: number
  onboardingDone: boolean
}

/** Perfil de gamificación. Se activa en la Fase 3; se declara ya para preparar la BD. */
export interface UserProfile {
  xp: number
  level: number
  streakCount: number
  /** Momento en que la racha empieza a decaer si no hay registro. */
  streakDecayAt?: number
  lastLogDate?: ISODate
  createdAt: number
}

export const DEFAULT_SETTINGS: CycleSettings = {
  avgCycleLength: 28,
  avgPeriodLength: 5,
  lutealLength: 14,
  onboardingDone: false,
}
