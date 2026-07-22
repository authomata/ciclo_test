import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'
import { Disclaimer } from '../../ui/Disclaimer'
import { SeasonHero } from './SeasonHero'
import { CompanionPanel } from '../companion/CompanionPanel'
import { Oracle } from '../oracle/Oracle'
import { Missions } from '../missions/Missions'
import { DayLogEditor } from '../daily-log/DayLogEditor'
import { useCycle } from '../../hooks/useCycle'
import { useGame } from '../../hooks/useGame'
import { useUIStore } from '../../stores/uiStore'
import { longDate, todayISO } from '../../lib/date'

export function TodayScreen() {
  const { loading, hasData, today, prediction } = useCycle()
  const { game } = useGame()
  const activeSeason = useUIStore((s) => s.activeSeason)
  const date = todayISO()

  return (
    <div>
      <PageHeader title="Hoy" subtitle={longDate(date)} />

      {loading ? (
        <p className="text-content-soft">Cargando…</p>
      ) : (
        <>
          <CompanionPanel season={today.season ?? activeSeason} game={game} />

          {hasData ? (
            <SeasonHero info={today} />
          ) : (
            <Card className="mb-6 bg-season-soft">
              <p className="font-medium text-season-ink">Empieza a revelar tu mapa</p>
              <p className="mt-1 text-sm leading-relaxed text-season-ink/80">
                Marca abajo el <span className="font-medium">primer día de tu
                menstruación</span> y Ciclo empezará a dibujar tus estaciones. Al principio
                será borroso; con cada registro se irá aclarando.
              </p>
            </Card>
          )}

          <Oracle prediction={prediction} />

          {today.season && <Missions season={today.season} date={date} />}

          <h3 className="mb-3 font-display text-lg font-medium text-content">
            Tu registro de hoy
          </h3>
          <DayLogEditor date={date} />

          <div className="mt-8">
            <Disclaimer />
          </div>
        </>
      )}
    </div>
  )
}
