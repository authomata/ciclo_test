import { useMemo } from 'react'
import { useLogs, useSettings } from './useCycle'
import { useGame } from './useGame'
import { DEFAULT_SETTINGS } from '../domain/types'
import { computeStats, getAnchors } from '../domain/cycle'
import {
  getCycleAggregates,
  metricsByPhase,
  symptomsByPhase,
  type CycleAggregate,
  type PhaseMetrics,
} from '../domain/cycleHistory'
import { computeAchievements, type Achievement } from '../domain/achievements'
import type { Phase } from '../domain/season'

interface HistoryContext {
  loading: boolean
  cycles: CycleAggregate[]
  phaseMetrics: PhaseMetrics[]
  symptomsPhase: Record<Phase, Record<string, number>>
  achievements: Achievement[]
}

export function useHistory(): HistoryContext {
  const logs = useLogs()
  const settingsRaw = useSettings()
  const { game } = useGame()

  return useMemo(() => {
    const settings = settingsRaw ?? { id: 'default', ...DEFAULT_SETTINGS }
    const list = logs ?? []
    const stats = computeStats(getAnchors(list), settings)
    const cycles = getCycleAggregates(list)
    return {
      loading: logs === undefined || settingsRaw === undefined,
      cycles,
      phaseMetrics: metricsByPhase(list, settings, stats),
      symptomsPhase: symptomsByPhase(list, settings, stats),
      achievements: computeAchievements(list, cycles, game),
    }
  }, [logs, settingsRaw, game])
}
