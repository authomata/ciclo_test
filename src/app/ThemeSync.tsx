import { useEffect } from 'react'
import { useUIStore } from '../stores/uiStore'

// Refleja el estado de UI (tema + estación activa) en los atributos del <html>,
// que es de donde el CSS lee los tokens de color.
export function ThemeSync() {
  const theme = useUIStore((s) => s.theme)
  const season = useUIStore((s) => s.activeSeason)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-season', season)
  }, [theme, season])

  return null
}
