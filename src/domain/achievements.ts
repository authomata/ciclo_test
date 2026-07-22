// Logros de AUTOCONOCIMIENTO: hitos con sentido, no vanidad ni comparación.
// Se derivan del estado real (registros, ciclos, racha, nivel).
import type { DayLog } from './types'
import type { GameState } from './gamification'
import type { CycleAggregate } from './cycleHistory'
import { topSymptomOverall } from './cycleHistory'
import { SYMPTOMS_BY_ID } from './symptoms'

export interface Achievement {
  id: string
  title: string
  desc: string
  icon: string
  unlocked: boolean
  /** progreso 0..1 (opcional, para hitos con cuenta). */
  progress?: number
}

export function computeAchievements(
  logs: DayLog[],
  cycles: CycleAggregate[],
  game: GameState,
): Achievement[] {
  const meaningful = logs.filter(
    (l) =>
      l.mood ||
      l.energy ||
      l.flow ||
      l.isPeriodStart ||
      l.symptoms.length ||
      (l.notes && l.notes.trim()) ||
      l.sleepHours != null,
  )
  const top = topSymptomOverall(logs)
  const topName = top ? SYMPTOMS_BY_ID[top.id]?.label ?? '—' : null

  return [
    {
      id: 'first-log',
      title: 'El primer trazo',
      desc: 'Hiciste tu primer registro.',
      icon: '✏️',
      unlocked: meaningful.length >= 1,
    },
    {
      id: 'first-cycle',
      title: 'Un ciclo completo',
      desc: 'Registraste tu primer ciclo entero.',
      icon: '🌙',
      unlocked: cycles.length >= 1,
    },
    {
      id: 'three-cycles',
      title: 'Tres lunas',
      desc: 'Registraste 3 ciclos. Empiezan a verse tendencias.',
      icon: '🌗',
      unlocked: cycles.length >= 3,
      progress: Math.min(cycles.length / 3, 1),
    },
    {
      id: 'first-pattern',
      title: 'Tu primer patrón',
      desc: 'Con 2 ciclos, ya puedes cruzar señales y descubrir tendencias.',
      icon: '🔗',
      unlocked: cycles.length >= 2,
    },
    {
      id: 'top-symptom',
      title: 'Conoces tu señal',
      desc: topName
        ? `Tu síntoma más frecuente: ${topName}.`
        : 'Identifica tu síntoma más frecuente registrando síntomas.',
      icon: '🔎',
      unlocked: !!top && top.count >= 3,
    },
    {
      id: 'steady',
      title: 'Constancia amable',
      desc: 'Alcanzaste una racha de 7.',
      icon: '🔥',
      unlocked: game.streak >= 7,
      progress: Math.min(game.streak / 7, 1),
    },
    {
      id: 'wisdom-5',
      title: 'Sabiduría profunda',
      desc: 'Llegaste al nivel 5 de Sabiduría del ciclo.',
      icon: '✨',
      unlocked: game.level >= 5,
      progress: Math.min(game.level / 5, 1),
    },
    {
      id: 'sky-3',
      title: 'Un cielo propio',
      desc: 'Reuniste 3 constelaciones en tu cielo.',
      icon: '🌌',
      unlocked: cycles.length >= 3,
      progress: Math.min(cycles.length / 3, 1),
    },
  ]
}
