import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { DayLogEditor } from '../daily-log/DayLogEditor'
import { useCycle } from '../../hooks/useCycle'
import { SEASON_META } from '../../domain/season'
import { longDate } from '../../lib/date'

// Hoja inferior para registrar/editar cualquier día del calendario.
export function DaySheet({ date, onClose }: { date: string; onClose: () => void }) {
  const { infoFor } = useCycle()
  const info = infoFor(date)
  const meta = info.season ? SEASON_META[info.season] : null

  // Cierra con Escape; bloquea el scroll de fondo.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-30 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Registro de ${longDate(date)}`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="relative mx-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-line bg-surface px-5 pb-10 pt-4"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden />

        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-xl font-semibold capitalize text-content">
              {longDate(date)}
            </p>
            {meta ? (
              <p className="text-sm text-season">
                {meta.emoji} {meta.title} · {meta.place}
                {info.cycleDay != null && (
                  <span className="text-content-soft"> · día {info.cycleDay}</span>
                )}
              </p>
            ) : (
              <p className="text-sm text-content-soft">Sin fase estimada aún</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-content-soft transition hover:text-content"
          >
            ✕
          </button>
        </div>

        <DayLogEditor date={date} />
      </motion.div>
    </div>
  )
}
