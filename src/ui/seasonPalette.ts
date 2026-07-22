import type { Season } from '../domain/season'

// Referencias a las variables CSS de cada estación (ya conmutadas por tema).
// Permite pintar elementos con el color de CUALQUIER estación, no solo la activa.
export const SEASON_VARS: Record<Season, { base: string; soft: string; ink: string }> = {
  invierno: { base: 'var(--inv)', soft: 'var(--inv-soft)', ink: 'var(--inv-ink)' },
  primavera: { base: 'var(--pri)', soft: 'var(--pri-soft)', ink: 'var(--pri-ink)' },
  verano: { base: 'var(--ver)', soft: 'var(--ver-soft)', ink: 'var(--ver-ink)' },
  otono: { base: 'var(--oto)', soft: 'var(--oto-soft)', ink: 'var(--oto-ink)' },
}

export const rgb = (v: string) => `rgb(${v})`
export const rgba = (v: string, a: number) => `rgb(${v} / ${a})`
