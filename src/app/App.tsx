import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { readSettings, seedIfNeeded } from '../db/repositories'
import { ThemeSync } from './ThemeSync'
import { AppLayout } from './AppLayout'
import { Onboarding } from '../features/onboarding/Onboarding'
import { TodayScreen } from '../features/today/TodayScreen'
import { CalendarScreen } from '../features/calendar/CalendarScreen'
import { SkyScreen } from '../features/sky/SkyScreen'
import { SettingsScreen } from '../features/settings/SettingsScreen'

export function App() {
  // Siembra los singletons una sola vez (fuera del liveQuery, que es solo lectura).
  useEffect(() => {
    void seedIfNeeded()
  }, [])

  // Lectura reactiva pura. undefined = cargando o aún sin sembrar -> Splash.
  const settings = useLiveQuery(() => readSettings(), [])

  return (
    <>
      <ThemeSync />
      {settings === undefined ? (
        <Splash />
      ) : !settings.onboardingDone ? (
        <Onboarding onDone={() => { /* reactivo vía useLiveQuery */ }} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<TodayScreen />} />
              <Route path="/calendario" element={<CalendarScreen />} />
              <Route path="/cielo" element={<SkyScreen />} />
              <Route path="/ajustes" element={<SettingsScreen />} />
              <Route path="*" element={<TodayScreen />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

function Splash() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <span className="animate-pulse text-4xl" aria-label="Cargando">
        🌗
      </span>
    </div>
  )
}
