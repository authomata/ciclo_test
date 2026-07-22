import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ALL_SEASONS } from '../../domain/season'
import { saveSettings } from '../../db/repositories'
import { Disclaimer } from '../../ui/Disclaimer'

// Onboarding breve: explica el concepto de las estaciones sin abrumar
// y captura dos valores base. Se puede completar en menos de un minuto.
export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)

  async function finish() {
    await saveSettings({
      avgCycleLength: cycleLength,
      avgPeriodLength: periodLength,
      onboardingDone: true,
    })
    onDone()
  }

  const steps = [
    <Intro key="intro" onNext={() => setStep(1)} />,
    <Seasons key="seasons" onNext={() => setStep(2)} />,
    <BasicData
      key="data"
      cycleLength={cycleLength}
      periodLength={periodLength}
      setCycleLength={setCycleLength}
      setPeriodLength={setPeriodLength}
      onDone={finish}
    />,
  ]

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-between px-6 py-10">
      <div className="mb-6 flex justify-center gap-1.5" aria-hidden>
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? 'w-8 bg-season' : 'w-4 bg-line'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  )
}

function Intro({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full flex-col justify-center text-center">
      <p className="text-5xl">🌗</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-content">
        Ciclo
      </h1>
      <p className="mt-4 leading-relaxed text-content-soft">
        Tu ciclo no es una línea recta: es un paisaje que cambia de estación. Aquí lo
        habitas a tu ritmo, sin que nadie te diga cómo deberías sentirte.
      </p>
      <PrimaryButton onClick={onNext} className="mt-8">
        Empezar
      </PrimaryButton>
    </div>
  )
}

function Seasons({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <h2 className="font-display text-2xl font-semibold text-content">
        Cuatro estaciones internas
      </h2>
      <p className="mt-2 text-content-soft">
        Cada fase de tu ciclo tiene su propio clima. Ninguna es mejor que otra.
      </p>
      <ul className="mt-6 space-y-3">
        {ALL_SEASONS.map((s) => (
          <li key={s.season} className="flex items-start gap-3">
            <span aria-hidden className="text-2xl">
              {s.emoji}
            </span>
            <div>
              <p className="font-medium text-content">
                {s.title} · {s.place}
              </p>
              <p className="text-sm leading-snug text-content-soft">{s.blurb}</p>
            </div>
          </li>
        ))}
      </ul>
      <PrimaryButton onClick={onNext} className="mt-8">
        Continuar
      </PrimaryButton>
    </div>
  )
}

function BasicData({
  cycleLength,
  periodLength,
  setCycleLength,
  setPeriodLength,
  onDone,
}: {
  cycleLength: number
  periodLength: number
  setCycleLength: (v: number) => void
  setPeriodLength: (v: number) => void
  onDone: () => void
}) {
  return (
    <div className="flex h-full flex-col justify-center">
      <h2 className="font-display text-2xl font-semibold text-content">
        Un par de datos para empezar
      </h2>
      <p className="mt-2 text-content-soft">
        No pasa nada si no los sabes con exactitud. Se afinan solos con el tiempo.
      </p>

      <div className="mt-6 space-y-5">
        <Stepper
          label="Duración media de tu ciclo"
          value={cycleLength}
          min={20}
          max={45}
          onChange={setCycleLength}
          suffix="días"
        />
        <Stepper
          label="Duración de tu menstruación"
          value={periodLength}
          min={1}
          max={12}
          onChange={setPeriodLength}
          suffix="días"
        />
      </div>

      <PrimaryButton onClick={onDone} className="mt-8">
        Entrar
      </PrimaryButton>
    </div>
  )
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  suffix: string
}) {
  return (
    <div className="rounded-xl2 border border-line bg-surface-2 p-4">
      <p className="mb-3 text-sm text-content">{label}</p>
      <div className="flex items-center justify-between">
        <RoundButton onClick={() => onChange(Math.max(min, value - 1))} label="Restar">
          −
        </RoundButton>
        <span className="font-display text-2xl font-semibold text-content">
          {value} <span className="text-base font-normal text-content-soft">{suffix}</span>
        </span>
        <RoundButton onClick={() => onChange(Math.min(max, value + 1))} label="Sumar">
          +
        </RoundButton>
      </div>
    </div>
  )
}

function RoundButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-xl text-content transition hover:border-season hover:text-season"
    >
      {children}
    </button>
  )
}

function PrimaryButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl2 bg-season px-6 py-3.5 font-semibold text-on-season shadow-sm transition active:scale-[0.99] ${className}`}
    >
      {children}
    </button>
  )
}
