import { useEffect } from 'react'
import { useCycle } from '../hooks/useCycle'
import { useUIStore } from '../stores/uiStore'

// Sincroniza la estación ACTIVA global con la fase calculada de hoy.
// Sin datos aún, mantiene una estación neutral (primavera).
export function SeasonController() {
  const { today } = useCycle()
  const setActiveSeason = useUIStore((s) => s.setActiveSeason)

  useEffect(() => {
    setActiveSeason(today.season ?? 'primavera')
  }, [today.season, setActiveSeason])

  return null
}
