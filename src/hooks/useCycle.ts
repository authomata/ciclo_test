import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { getAllLogs, readSettings } from '../db/repositories'
import { DEFAULT_SETTINGS, type DayLog } from '../domain/types'
import {
  computeCycleInfo,
  computePrediction,
  computeStats,
  getAnchors,
  type CycleInfo,
  type Prediction,
} from '../domain/cycle'
import { todayISO } from '../lib/date'

/** Todos los registros diarios, reactivos. undefined mientras carga. */
export function useLogs(): DayLog[] | undefined {
  return useLiveQuery(() => getAllLogs(), [])
}

export function useSettings() {
  return useLiveQuery(() => readSettings(), [])
}

interface CycleContext {
  loading: boolean
  hasData: boolean
  anchors: string[]
  logsByDate: Map<string, DayLog>
  prediction: Prediction
  /** Info de ciclo para una fecha concreta. */
  infoFor: (date: string) => CycleInfo
  today: CycleInfo
}

/** Núcleo reactivo: registros + ajustes -> fases, predicción y helpers. */
export function useCycle(): CycleContext {
  const logs = useLogs()
  const settingsRaw = useSettings()

  return useMemo(() => {
    const settings = settingsRaw ?? { id: 'default', ...DEFAULT_SETTINGS }
    const list = logs ?? []
    const anchors = getAnchors(list)
    const stats = computeStats(anchors, settings)
    const logsByDate = new Map(list.map((l) => [l.date, l]))
    const infoFor = (date: string) => computeCycleInfo(date, anchors, settings, stats)
    return {
      loading: logs === undefined || settingsRaw === undefined,
      hasData: anchors.length > 0,
      anchors,
      logsByDate,
      prediction: computePrediction(anchors, settings, stats),
      infoFor,
      today: infoFor(todayISO()),
    }
  }, [logs, settingsRaw])
}
