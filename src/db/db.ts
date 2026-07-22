import Dexie, { type Table } from 'dexie'
import type { CycleSettings, DayLog, UserProfile } from '../domain/types'

// Los singletons (settings, profile) se guardan con una clave fija.
export type StoredSettings = CycleSettings & { id: 'default' }
export type StoredProfile = UserProfile & { id: 'default' }

// Almacenamiento LOCAL por defecto (IndexedDB). Sin cuenta, sin servidor.
// Arquitectura preparada para cifrar la BD con clave derivada de PIN (Fase 5).
export class CicloDB extends Dexie {
  dayLogs!: Table<DayLog, string>
  settings!: Table<StoredSettings, string>
  profile!: Table<StoredProfile, string>

  constructor() {
    super('ciclo_db')
    this.version(1).stores({
      // Índices: PK `date`; `isPeriodStart` para localizar anclas de ciclo rápido.
      dayLogs: 'date, isPeriodStart',
      settings: 'id',
      profile: 'id',
    })
  }
}

export const db = new CicloDB()
