import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import { generateConstellation } from '../../domain/constellation'
import type { CycleAggregate } from '../../domain/cycleHistory'

// Dibuja la constelación de un ciclo sobre un cielo nocturno propio (siempre
// oscuro, para que las estrellas brillen sin importar el tema de la app).
export function ConstellationView({
  cycle,
  size = 160,
  twinkle = true,
}: {
  cycle: CycleAggregate
  size?: number
  twinkle?: boolean
}) {
  const reduce = useReducedMotion()
  const c = useMemo(() => generateConstellation(cycle), [cycle])
  const starColor = (b: number) => `hsl(${c.hue} ${c.saturation}% ${60 + b * 25}%)`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Constelación del ciclo que empezó el ${cycle.start}`}
      className="rounded-2xl"
      style={{
        background:
          'radial-gradient(120% 120% at 50% 20%, #1a1f3a 0%, #0d1024 60%, #070812 100%)',
      }}
    >
      {/* Líneas de la figura */}
      <g stroke={`hsl(${c.hue} ${c.saturation}% 70%)`} strokeWidth="0.4" opacity="0.5">
        {c.links.map(([a, b], i) => (
          <line
            key={i}
            x1={c.stars[a].x}
            y1={c.stars[a].y}
            x2={c.stars[b].x}
            y2={c.stars[b].y}
          />
        ))}
      </g>

      {/* Polvo de estrellas de fondo (determinista por índice) */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = (i * 37) % 100
        const y = (i * 53) % 100
        return <circle key={`d${i}`} cx={x} cy={y} r={0.3} fill="#fff" opacity={0.25} />
      })}

      {/* Estrellas principales */}
      {c.stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={starColor(s.brightness)}
          style={{ filter: 'drop-shadow(0 0 1.5px currentColor)' }}
          animate={
            reduce || !twinkle
              ? {}
              : { opacity: [s.brightness, s.brightness * 0.55, s.brightness] }
          }
          transition={{
            duration: 2.4 + (i % 5) * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          opacity={s.brightness}
        />
      ))}
    </svg>
  )
}
