import { motion } from 'framer-motion'
import { Card } from '../../ui/Card'
import { SEASON_META } from '../../domain/season'
import type { CycleInfo } from '../../domain/cycle'

// Tarjeta principal de la estación activa: contexto cálido, nunca imposición.
export function SeasonHero({ info }: { info: CycleInfo }) {
  if (!info.season || info.cycleDay == null) return null
  const meta = SEASON_META[info.season]

  return (
    <Card className="mb-4 overflow-hidden bg-season-soft">
      <div className="flex items-start gap-3">
        <motion.span
          aria-hidden
          className="text-4xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        >
          {meta.emoji}
        </motion.span>
        <div className="min-w-0">
          <p className="text-sm font-medium uppercase tracking-wide text-season">
            {meta.title} · {meta.place}
          </p>
          <p className="mt-1 leading-relaxed text-season-ink">{meta.blurb}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-season/15 px-2.5 py-1 text-xs font-medium text-season-ink">
              Día {info.cycleDay} del ciclo
            </span>
            {info.isFertileWindow && (
              <span className="rounded-full bg-season/15 px-2.5 py-1 text-xs font-medium text-season-ink">
                Ventana fértil estimada
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
