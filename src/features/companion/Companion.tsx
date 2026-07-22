import { motion, useReducedMotion } from 'framer-motion'
import type { Season } from '../../domain/season'
import type { CompanionMood } from '../../domain/gamification'
import { SEASON_VARS } from '../../ui/seasonPalette'

// Espíritu del ciclo: una criatura original (no caricaturesca) que cambia de
// color con la estación y de ánimo con el autocuidado. Nunca castiga: cuando
// hay días sin registro, cierra los ojos y espera, adormecida.
//
// Se dibuja siempre en su estado visible; la animación solo añade un flotar y
// respirar suaves. Si no corre (reduced-motion), se ve igual de bien.
export function Companion({
  season,
  mood,
  size = 168,
}: {
  season: Season
  mood: CompanionMood
  size?: number
}) {
  const reduce = useReducedMotion()
  const v = SEASON_VARS[season]
  const base = `rgb(${v.base})`
  const soft = `rgb(${v.soft})`
  const ink = `rgb(${v.ink})`
  const gid = `spirit-${season}`
  const sleepy = mood === 'somnoliento'
  const radiant = mood === 'radiante'

  // Intensidad del aura según el ánimo (florece o se apaga).
  const auraOpacity =
    mood === 'radiante' ? 0.9 : mood === 'despierto' ? 0.6 : mood === 'sereno' ? 0.4 : 0.2

  const float = reduce
    ? {}
    : {
        y: sleepy ? [0, 2, 0] : [0, -6, 0],
        transition: {
          duration: sleepy ? 6 : radiant ? 2.6 : 3.6,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Tu compañero, ${mood}`}
    >
      <defs>
        <radialGradient id={gid} cx="42%" cy="36%" r="72%">
          <stop offset="0%" stopColor={soft} />
          <stop offset="62%" stopColor={base} />
          <stop offset="100%" stopColor={ink} />
        </radialGradient>
      </defs>

      {/* Aura: círculos concéntricos que respiran, más vivos cuanto más cuidado */}
      <motion.g
        style={{ transformOrigin: '100px 108px' }}
        animate={
          reduce
            ? {}
            : { scale: [1, 1.05, 1], opacity: [auraOpacity, auraOpacity * 0.7, auraOpacity] }
        }
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="100" cy="108" r="78" fill={base} opacity={auraOpacity * 0.18} />
        <circle cx="100" cy="108" r="62" fill={base} opacity={auraOpacity * 0.22} />
      </motion.g>

      {/* Cuerpo flotante */}
      <motion.g animate={float}>
        <SeasonMotif season={season} ink={ink} base={base} />

        {/* Cuerpo: gota suave */}
        <motion.path
          d="M100 40 C138 40 160 74 160 108 C160 146 132 168 100 168 C68 168 40 146 40 108 C40 74 62 40 100 40 Z"
          fill={`url(#${gid})`}
          animate={reduce ? {} : { scaleY: [1, 1.03, 1], scaleX: [1, 0.985, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 108px' }}
        />

        {/* Mejillas cuando está radiante */}
        {radiant && (
          <>
            <circle cx="72" cy="118" r="7" fill={ink} opacity={0.22} />
            <circle cx="128" cy="118" r="7" fill={ink} opacity={0.22} />
          </>
        )}

        <Face sleepy={sleepy} radiant={radiant} ink={ink} />
      </motion.g>

      {/* Zzz cuando duerme */}
      {sleepy && !reduce && (
        <motion.text
          x="150"
          y="60"
          fontSize="20"
          fill={ink}
          opacity={0.7}
          animate={{ y: [60, 44], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
        >
          z
        </motion.text>
      )}
    </svg>
  )
}

function Face({
  sleepy,
  radiant,
  ink,
}: {
  sleepy: boolean
  radiant: boolean
  ink: string
}) {
  if (sleepy) {
    // Ojos cerrados: arcos suaves.
    return (
      <g stroke={ink} strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M78 104 q9 8 18 0" />
        <path d="M104 104 q9 8 18 0" />
      </g>
    )
  }
  return (
    <g>
      <circle cx="86" cy="104" r="5.5" fill={ink} />
      <circle cx="114" cy="104" r="5.5" fill={ink} />
      {/* brillo */}
      <circle cx="88" cy="102" r="1.8" fill="#fff" opacity={0.85} />
      <circle cx="116" cy="102" r="1.8" fill="#fff" opacity={0.85} />
      {/* boca */}
      {radiant ? (
        <path
          d="M88 122 q12 12 24 0"
          stroke={ink}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M92 122 q8 5 16 0"
          stroke={ink}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  )
}

// Pequeño motivo propio de cada estación, sobre la cabeza del espíritu.
function SeasonMotif({
  season,
  ink,
  base,
}: {
  season: Season
  ink: string
  base: string
}) {
  switch (season) {
    case 'invierno': // copo cristalino
      return (
        <g stroke={ink} strokeWidth="2.5" strokeLinecap="round" opacity={0.85}>
          <line x1="100" y1="18" x2="100" y2="40" />
          <line x1="90" y1="24" x2="110" y2="34" />
          <line x1="110" y1="24" x2="90" y2="34" />
        </g>
      )
    case 'primavera': // dos hojas brotando
      return (
        <g fill={base} stroke={ink} strokeWidth="1.5">
          <path d="M100 42 C92 30 82 28 80 20 C90 20 100 28 100 42 Z" />
          <path d="M100 42 C108 30 118 28 120 20 C110 20 100 28 100 42 Z" />
        </g>
      )
    case 'verano': // rayos de sol
      return (
        <g stroke={ink} strokeWidth="2.5" strokeLinecap="round" opacity={0.85}>
          <line x1="100" y1="16" x2="100" y2="30" />
          <line x1="82" y1="22" x2="88" y2="34" />
          <line x1="118" y1="22" x2="112" y2="34" />
        </g>
      )
    case 'otono': // hoja que cae
      return (
        <g fill={base} stroke={ink} strokeWidth="1.5">
          <path d="M108 24 C118 26 122 36 114 44 C104 42 100 32 108 24 Z" />
          <line x1="110" y1="30" x2="112" y2="40" stroke={ink} strokeWidth="1.2" />
        </g>
      )
  }
}
