// Las cuatro estaciones internas y su relación con las fases hormonales.
// El cálculo real de la fase a partir de datos llega en la Fase 2;
// aquí vive el mapa conceptual y los metadatos de cada bioma.

export type Phase = 'menstrual' | 'folicular' | 'ovulatoria' | 'lutea'
export type Season = 'invierno' | 'primavera' | 'verano' | 'otono'

export const PHASE_TO_SEASON: Record<Phase, Season> = {
  menstrual: 'invierno',
  folicular: 'primavera',
  ovulatoria: 'verano',
  lutea: 'otono',
}

export const SEASON_ORDER: Season[] = ['invierno', 'primavera', 'verano', 'otono']

export interface SeasonMeta {
  season: Season
  phase: Phase
  /** Nombre de la estación. */
  title: string
  /** Nombre del bioma / lugar interno. */
  place: string
  /** Descripción breve, tono cómplice — contexto, nunca imposición. */
  blurb: string
  emoji: string
}

export const SEASON_META: Record<Season, SeasonMeta> = {
  invierno: {
    season: 'invierno',
    phase: 'menstrual',
    title: 'Invierno',
    place: 'La Cueva',
    blurb: 'Recogimiento y descanso. La energía baja y eso está bien: es tiempo de resguardarse.',
    emoji: '❄️',
  },
  primavera: {
    season: 'primavera',
    phase: 'folicular',
    title: 'Primavera',
    place: 'El Brote',
    blurb: 'Algo empieza a crecer. Vuelve la claridad y las ideas nuevas piden espacio.',
    emoji: '🌱',
  },
  verano: {
    season: 'verano',
    phase: 'ovulatoria',
    title: 'Verano',
    place: 'La Cumbre',
    blurb: 'Pico de energía y ganas de mundo. Confianza expansiva, si te apetece habitarla.',
    emoji: '☀️',
  },
  otono: {
    season: 'otono',
    phase: 'lutea',
    title: 'Otoño',
    place: 'El Refugio',
    blurb: 'La sensibilidad se afina. Buen momento para poner límites y volver hacia adentro.',
    emoji: '🍂',
  },
}

export const ALL_SEASONS: SeasonMeta[] = SEASON_ORDER.map((s) => SEASON_META[s])
