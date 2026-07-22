import { Card } from '../../ui/Card'
import type { Prediction } from '../../domain/cycle'
import { longDate } from '../../lib/date'

// El Oráculo: la predicción es el premio. Empieza BORROSO y se aclara con los
// datos. La niebla (blur + velo) es inversamente proporcional a la confianza.
export function Oracle({ prediction }: { prediction: Prediction }) {
  const confidence = prediction.stats.confidence
  const clarity = Math.round(confidence * 100)
  // A más confianza, menos desenfoque. Sin datos: muy borroso.
  const blur = (1 - confidence) * 7 // px
  const veil = (1 - confidence) * 0.5

  const hasPrediction = prediction.nextPeriodStart !== null

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-lg font-medium text-content">El Oráculo</p>
        <span className="text-xs text-content-soft">{clarity}% nítido</span>
      </div>

      {hasPrediction ? (
        <div className="relative">
          <div
            style={{ filter: `blur(${blur}px)` }}
            className="transition-[filter] duration-700"
            aria-hidden={confidence < 0.15}
          >
            <p className="text-sm text-content-soft">Próxima menstruación</p>
            <p className="font-display text-2xl font-semibold text-season">
              {longDate(prediction.nextPeriodStart!)}
            </p>
            {prediction.fertileWindowStart && prediction.fertileWindowEnd && (
              <p className="mt-2 text-sm text-content-soft">
                Ventana fértil estimada:{' '}
                <span className="text-content">
                  {longDate(prediction.fertileWindowStart)} –{' '}
                  {longDate(prediction.fertileWindowEnd)}
                </span>
              </p>
            )}
          </div>
          {/* Velo de niebla encima */}
          <div
            className="pointer-events-none absolute inset-0 rounded-xl bg-surface-2 transition-opacity duration-700"
            style={{ opacity: veil }}
            aria-hidden
          />
        </div>
      ) : (
        <p className="text-sm leading-relaxed text-content-soft">
          El Oráculo aún duerme entre la niebla. Marca tu primer día de menstruación
          para que empiece a ver.
        </p>
      )}

      <p className="mt-4 border-t border-line pt-3 text-xs leading-relaxed text-content-soft">
        {confidence >= 0.75
          ? 'El Oráculo te conoce bien. Cada registro afina aún más su visión.'
          : confidence >= 0.4
            ? 'La niebla se disipa. Con cada ciclo registrado, verá con más claridad.'
            : hasPrediction
              ? 'Todavía hay bruma: son estimaciones tempranas. Sigue registrando y se aclarará.'
              : 'Cuanto más registres, más nítido se volverá.'}
      </p>
    </Card>
  )
}
