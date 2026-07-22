// Genera una constelación ÚNICA y DETERMINISTA a partir de los datos de un ciclo.
// Misma data -> misma figura, siempre. Es el recuerdo visual de ese mes, no algo
// aleatorio. Lógica pura, sin Date.now() ni Math.random().
import type { CycleAggregate } from './cycleHistory'

export interface Star {
  x: number // 0..100
  y: number // 0..100
  r: number // radio
  brightness: number // 0..1
}

export interface Constellation {
  stars: Star[]
  /** pares de índices a conectar. */
  links: [number, number][]
  /** matiz base (HSL) derivado del ánimo del ciclo. */
  hue: number
  saturation: number
}

// PRNG determinista (mulberry32) a partir de una semilla entera.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Hash estable de una cadena -> entero (para la semilla).
function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Firma determinista del ciclo: sus datos definen la semilla. */
function cycleSeed(c: CycleAggregate): string {
  const symp = Object.keys(c.symptomCounts)
    .sort()
    .map((k) => `${k}:${c.symptomCounts[k]}`)
    .join(',')
  return [
    c.id,
    c.length,
    c.daysLogged,
    Math.round((c.avgMood ?? 0) * 10),
    Math.round((c.avgEnergy ?? 0) * 10),
    symp,
  ].join('|')
}

export function generateConstellation(c: CycleAggregate): Constellation {
  const rng = mulberry32(hashString(cycleSeed(c)))

  const distinctSymptoms = Object.keys(c.symptomCounts).length
  // Nº de estrellas: cuerpo del cielo tejido con la riqueza del registro.
  const starCount = Math.max(6, Math.min(13, 6 + distinctSymptoms))

  // El ánimo tiñe el color: bajo -> azul frío; alto -> ámbar cálido.
  const mood = c.avgMood ?? 3
  const hue = 220 - (mood - 1) * ((220 - 40) / 4) // 1->220 (azul), 5->40 (ámbar)
  const saturation = 55 + (c.avgEnergy ?? 3) * 4 // más energía, más saturado

  // La energía marca el brillo base.
  const baseBright = 0.45 + ((c.avgEnergy ?? 3) - 1) * (0.5 / 4)

  // Estrellas repartidas en un anillo con jitter + 1-2 internas.
  const stars: Star[] = []
  const ringCount = starCount - (starCount > 9 ? 2 : 1)
  for (let i = 0; i < ringCount; i++) {
    const angle = (i / ringCount) * Math.PI * 2 + (rng() - 0.5) * 0.5
    const radius = 30 + rng() * 12
    stars.push({
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius * 0.9,
      r: 1.1 + rng() * 1.8,
      brightness: clamp01(baseBright + (rng() - 0.5) * 0.35),
    })
  }
  const inner = starCount - ringCount
  for (let i = 0; i < inner; i++) {
    stars.push({
      x: 50 + (rng() - 0.5) * 34,
      y: 50 + (rng() - 0.5) * 30,
      r: 1.4 + rng() * 2.2,
      brightness: clamp01(baseBright + 0.15 + rng() * 0.25),
    })
  }

  // Conexiones: recorre las estrellas del anillo por ángulo y cierra el lazo;
  // enlaza además las internas a su vecina más cercana del anillo.
  const links: [number, number][] = []
  const ringIdx = [...Array(ringCount).keys()].sort((a, b) => angleOf(stars[a]) - angleOf(stars[b]))
  for (let i = 0; i < ringIdx.length; i++) {
    links.push([ringIdx[i], ringIdx[(i + 1) % ringIdx.length]])
  }
  for (let i = ringCount; i < stars.length; i++) {
    let best = 0
    let bestD = Infinity
    for (let j = 0; j < ringCount; j++) {
      const d = dist(stars[i], stars[j])
      if (d < bestD) {
        bestD = d
        best = j
      }
    }
    links.push([i, best])
  }

  return { stars, links, hue, saturation }
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x))
const angleOf = (s: Star) => Math.atan2(s.y - 50, s.x - 50)
const dist = (a: Star, b: Star) => Math.hypot(a.x - b.x, a.y - b.y)
