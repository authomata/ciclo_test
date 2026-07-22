import { useLiveQuery } from 'dexie-react-hooks'
import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'
import { Disclaimer } from '../../ui/Disclaimer'
import { useUIStore } from '../../stores/uiStore'
import { readSettings, saveSettings, wipeAllData } from '../../db/repositories'

export function SettingsScreen() {
  const theme = useUIStore((s) => s.theme)
  const toggleTheme = useUIStore((s) => s.toggleTheme)
  const settings = useLiveQuery(() => readSettings(), [])

  async function reset() {
    const ok = window.confirm(
      '¿Borrar todos tus datos de este dispositivo? No se puede deshacer.',
    )
    if (!ok) return
    await wipeAllData()
    window.location.reload()
  }

  return (
    <div>
      <PageHeader title="Ajustes" />

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-content">Tema</p>
            <p className="text-sm text-content-soft">Claro u oscuro, como prefieras.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-content transition hover:border-season hover:text-season"
          >
            {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
          </button>
        </div>
      </Card>

      <Card className="mb-4">
        <p className="mb-3 font-medium text-content">Tu ciclo</p>
        <div className="space-y-4">
          <NumberRow
            label="Duración media del ciclo"
            suffix="días"
            value={settings?.avgCycleLength ?? 28}
            min={20}
            max={45}
            onChange={(v) => saveSettings({ avgCycleLength: v })}
          />
          <NumberRow
            label="Duración de la menstruación"
            suffix="días"
            value={settings?.avgPeriodLength ?? 5}
            min={1}
            max={12}
            onChange={(v) => saveSettings({ avgPeriodLength: v })}
          />
        </div>
        <p className="mt-3 text-xs text-content-soft">
          Estos valores se irán afinando solos a medida que registres tus ciclos.
        </p>
      </Card>

      <Card className="mb-4">
        <p className="mb-1 font-medium text-content">Privacidad</p>
        <p className="text-sm text-content-soft">
          Tus datos viven solo en este dispositivo (IndexedDB). No hay cuenta, no se envían
          a ningún servidor, no hay rastreo. El bloqueo con PIN y la exportación cifrada
          llegan en la Fase 5.
        </p>
      </Card>

      <Card className="mb-4">
        <p className="mb-1 font-medium text-content">Borrar mis datos</p>
        <p className="mb-3 text-sm text-content-soft">
          Elimina por completo tu historial de este dispositivo.
        </p>
        <button
          onClick={reset}
          className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-content-soft transition hover:border-red-400 hover:text-red-500"
        >
          Borrar todo
        </button>
      </Card>

      <Disclaimer />
    </div>
  )
}

function NumberRow({
  label,
  suffix,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  suffix: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm text-content">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (!Number.isNaN(v) && v >= min && v <= max) onChange(v)
          }}
          className="w-16 rounded-lg border border-line bg-surface px-2 py-1.5 text-right text-content"
        />
        <span className="text-sm text-content-soft">{suffix}</span>
      </span>
    </label>
  )
}
