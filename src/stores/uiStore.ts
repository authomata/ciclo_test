import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Season } from '../domain/season'

type Theme = 'light' | 'dark'

interface UIState {
  theme: Theme
  /** Estación activa. En Fase 2 la calcula el ciclo; por ahora se fija a mano. */
  activeSeason: Season
  toggleTheme: () => void
  setTheme: (t: Theme) => void
  setActiveSeason: (s: Season) => void
}

function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      activeSeason: 'primavera',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      setActiveSeason: (activeSeason) => set({ activeSeason }),
    }),
    { name: 'ciclo-ui' },
  ),
)
