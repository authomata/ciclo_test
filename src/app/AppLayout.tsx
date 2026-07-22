import { NavLink, Outlet } from 'react-router-dom'

interface Tab {
  to: string
  label: string
  icon: string
}

const TABS: Tab[] = [
  { to: '/', label: 'Hoy', icon: '🌗' },
  { to: '/calendario', label: 'Calendario', icon: '🗓️' },
  { to: '/patrones', label: 'Patrones', icon: '📈' },
  { to: '/cielo', label: 'Cielo', icon: '✨' },
  { to: '/ajustes', label: 'Ajustes', icon: '⚙️' },
]

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <main className="flex-1 px-5 pb-28 pt-8">
        <Outlet />
      </main>

      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-surface/90 backdrop-blur-md"
      >
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {TABS.map((tab) => (
            <li key={tab.to} className="flex-1">
              <NavLink
                to={tab.to}
                end={tab.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-season'
                      : 'text-content-soft hover:text-content'
                  }`
                }
              >
                <span aria-hidden className="text-lg leading-none">
                  {tab.icon}
                </span>
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
