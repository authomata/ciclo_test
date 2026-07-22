import { PageHeader } from '../../ui/PageHeader'
import { Card } from '../../ui/Card'
import { Disclaimer } from '../../ui/Disclaimer'
import { SeasonHero } from './SeasonHero'
import { DayLogEditor } from '../daily-log/DayLogEditor'
import { useCycle } from '../../hooks/useCycle'
import { longDate, todayISO } from '../../lib/date'

export function TodayScreen() {
  const { loading, hasData, today, prediction } = useCycle()
  const date = todayISO()

  return (
    <div>
      <PageHeader title="Hoy" subtitle={longDate(date)} />

      {loading ? (
        <p className="text-content-soft">Cargando…</p>
      ) : (
        <>
          {hasData ? (
            <>
              <SeasonHero info={today} />
              {prediction.nextPeriodStart && (
                <p className="mb-6 px-1 text-sm text-content-soft">
                  Próxima menstruación estimada:{' '}
                  <span className="font-medium text-content">
                    {longDate(prediction.nextPeriodStart)}
                  </span>
                  {prediction.stats.completedCycles > 0 && (
                    <> · {prediction.stats.completedCycles} ciclo(s) registrado(s)</>
                  )}
                </p>
              )}
            </>
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

          <DayLogEditor date={date} />

          <div className="mt-8">
            <Disclaimer />
          </div>
        </>
      )}
    </div>
  )
}
