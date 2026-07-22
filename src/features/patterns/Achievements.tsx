import { motion } from 'framer-motion'
import type { Achievement } from '../../domain/achievements'

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {achievements.map((a) => (
        <motion.li
          key={a.id}
          initial={false}
          className={`rounded-xl2 border p-4 ${
            a.unlocked
              ? 'border-season bg-season-soft'
              : 'border-line bg-surface-2'
          }`}
        >
          <div
            className={`text-2xl ${a.unlocked ? '' : 'opacity-40 grayscale'}`}
            aria-hidden
          >
            {a.icon}
          </div>
          <p
            className={`mt-2 text-sm font-medium ${
              a.unlocked ? 'text-season-ink' : 'text-content-soft'
            }`}
          >
            {a.title}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-content-soft">{a.desc}</p>

          {!a.unlocked && a.progress != null && a.progress > 0 && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-content-soft"
                style={{ width: `${Math.round(a.progress * 100)}%` }}
              />
            </div>
          )}
        </motion.li>
      ))}
    </ul>
  )
}
