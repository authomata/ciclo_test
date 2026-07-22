import { useMemo } from 'react'
import { useLogs } from './useCycle'
import { computeGameState, type GameState } from '../domain/gamification'
import { todayISO } from '../lib/date'

const EMPTY: GameState = {
  xp: 0,
  level: 1,
  wisdomTitle: 'Semilla curiosa',
  intoLevel: 0,
  forNext: 40,
  levelProgress: 0,
  streak: 0,
  daysSinceLog: null,
  loggedToday: false,
  totalDaysLogged: 0,
  companion: 'sereno',
}

/** Estado de juego derivado reactivamente de los registros. */
export function useGame(): { loading: boolean; game: GameState } {
  const logs = useLogs()
  return useMemo(() => {
    if (logs === undefined) return { loading: true, game: EMPTY }
    return { loading: false, game: computeGameState(logs, todayISO()) }
  }, [logs])
}
