// Misiones por estación: sugerencias de bienestar contextuales, SIEMPRE opcionales.
// Nunca obligaciones; son invitaciones alineadas con la energía de cada fase.
import type { Season } from './season'
import type { ISODate } from './types'

export interface Mission {
  id: string
  text: string
}

const MISSIONS: Record<Season, Mission[]> = {
  invierno: [
    { id: 'inv-descanso', text: 'Permítete descansar 20 minutos sin culpa.' },
    { id: 'inv-calor', text: 'Regálate algo cálido: una infusión, una manta, un baño.' },
    { id: 'inv-no', text: 'Di que no a un plan que no te apetece. Está bien.' },
    { id: 'inv-suave', text: 'Mueve el cuerpo suave: estiramientos o un paseo corto.' },
  ],
  primavera: [
    { id: 'pri-idea', text: 'Anota una idea nueva que se te ocurra hoy.' },
    { id: 'pri-empezar', text: 'Empieza eso que venías posponiendo. Solo el primer paso.' },
    { id: 'pri-aire', text: 'Sal a caminar y fíjate en algo que esté brotando.' },
    { id: 'pri-plan', text: 'Planea algo que te ilusione para los próximos días.' },
  ],
  verano: [
    { id: 'ver-gente', text: 'Conecta con alguien: una llamada, un mensaje, un café.' },
    { id: 'ver-decir', text: 'Di en voz alta algo que quieras pedir o proponer.' },
    { id: 'ver-cuerpo', text: 'Haz algo que te haga sentir en tu cuerpo, con gusto.' },
    { id: 'ver-brillar', text: 'Muéstrate en algo donde normalmente te contienes.' },
  ],
  otono: [
    { id: 'oto-limite', text: 'Pon un límite hoy. Tu sensibilidad sabe por qué.' },
    { id: 'oto-ordenar', text: 'Ordena un espacio pequeño: aclara el afuera, aclara el adentro.' },
    { id: 'oto-escribir', text: 'Escribe una frase sobre cómo te sientes, sin filtro.' },
    { id: 'oto-soltar', text: 'Suelta una tarea de la lista. No todo es para hoy.' },
  ],
}

/**
 * Elige 2 misiones estables para la fecha (rotan por día, no aleatorias)
 * para que no cambien al re-renderizar y se sientan como "las de hoy".
 */
export function missionsForDay(season: Season, date: ISODate): Mission[] {
  const pool = MISSIONS[season]
  const seed = dayNumber(date)
  const a = pool[seed % pool.length]
  const b = pool[(seed + 1) % pool.length]
  return [a, b]
}

function dayNumber(date: ISODate): number {
  const [y, m, d] = date.split('-').map(Number)
  return y * 372 + m * 31 + d
}
