// Capa de acceso a datos. La UI y los hooks pasan SIEMPRE por aquí,
// nunca tocan Dexie directamente. Facilita testear y, más adelante,
// enchufar cifrado o sync sin cambiar la UI.
import { db, type StoredProfile, type StoredSettings } from './db'
import { DEFAULT_SETTINGS, type DayLog, type ISODate, type UserProfile } from '../domain/types'

const SINGLETON = 'default' as const

// ---------- Ajustes ----------
/** Lectura PURA (sin escritura). Úsala dentro de useLiveQuery. */
export function readSettings(): Promise<StoredSettings | undefined> {
  return db.settings.get(SINGLETON)
}

/**
 * Crea los singletons (settings, profile) si aún no existen.
 * Llamar UNA vez al arrancar, nunca dentro de un liveQuery (haría un write reactivo).
 */
export async function seedIfNeeded(): Promise<void> {
  await Promise.all([
    db.settings.get(SINGLETON).then((s) => {
      if (!s) return db.settings.put({ id: SINGLETON, ...DEFAULT_SETTINGS })
    }),
    getProfile(),
  ])
}

export async function getSettings(): Promise<StoredSettings> {
  const existing = await db.settings.get(SINGLETON)
  if (existing) return existing
  const fresh: StoredSettings = { id: SINGLETON, ...DEFAULT_SETTINGS }
  await db.settings.put(fresh)
  return fresh
}

export async function saveSettings(patch: Partial<StoredSettings>): Promise<void> {
  const current = await getSettings()
  await db.settings.put({ ...current, ...patch, id: SINGLETON })
}

// ---------- Perfil de gamificación ----------
export async function getProfile(): Promise<StoredProfile> {
  const existing = await db.profile.get(SINGLETON)
  if (existing) return existing
  const fresh: StoredProfile = {
    id: SINGLETON,
    xp: 0,
    level: 1,
    streakCount: 0,
    createdAt: Date.now(),
  }
  await db.profile.put(fresh)
  return fresh
}

export async function saveProfile(patch: Partial<UserProfile>): Promise<void> {
  const current = await getProfile()
  await db.profile.put({ ...current, ...patch, id: SINGLETON })
}

// ---------- Registros diarios ----------
export async function getDayLog(date: ISODate): Promise<DayLog | undefined> {
  return db.dayLogs.get(date)
}

export async function getAllLogs(): Promise<DayLog[]> {
  return db.dayLogs.orderBy('date').toArray()
}

export async function upsertDayLog(
  date: ISODate,
  patch: Partial<Omit<DayLog, 'date' | 'createdAt' | 'updatedAt'>>,
): Promise<void> {
  const now = Date.now()
  const existing = await db.dayLogs.get(date)
  const next: DayLog = {
    date,
    symptoms: [],
    ...existing,
    ...patch,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
  await db.dayLogs.put(next)
}

export async function deleteDayLog(date: ISODate): Promise<void> {
  await db.dayLogs.delete(date)
}

// ---------- Gestión total (export/reset — se amplía en Fase 5) ----------
export async function wipeAllData(): Promise<void> {
  await db.transaction('rw', db.dayLogs, db.settings, db.profile, async () => {
    await db.dayLogs.clear()
    await db.settings.clear()
    await db.profile.clear()
  })
}
