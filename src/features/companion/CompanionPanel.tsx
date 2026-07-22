import { Companion } from './Companion'
import type { Season } from '../../domain/season'
import type { GameState } from '../../domain/gamification'

const MOOD_LINE: Record<GameState['companion'], string> = {
  radiante: 'Hoy florezco contigo.',
  despierto: 'Aquí estoy, atenta a ti.',
  sereno: 'Todo bien. A tu ritmo.',
  somnoliento: 'Descanso mientras vuelves. Sin prisa.',
}

export function CompanionPanel({
  season,
  game,
}: {
  season: Season
  game: GameState
}) {
  return (
    <section className="mb-6 rounded-xl2 border border-line bg-gradient-to-b from-season-soft to-surface-2 p-5">
      <div className="flex flex-col items-center text-center">
        <Companion season={season} mood={game.companion} />
        <p className="-mt-2 max-w-[16rem] text-sm italic text-season-ink">
          “{MOOD_LINE[game.companion]}”
        </p>
      </div>

      {/* Nivel + Sabiduría + racha */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium text-content">
            Nivel {game.level}
            <span className="text-content-soft"> · {game.wisdomTitle}</span>
          </p>
          <p className="flex items-center gap-1 text-sm font-medium text-content">
            <span aria-hidden>🔥</span>
            <span>{game.streak}</span>
            <span className="text-content-soft">racha</span>
          </p>
        </div>

        {/* Barra de XP */}
        <div
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={game.forNext}
          aria-valuenow={game.intoLevel}
          aria-label="Progreso de Sabiduría del ciclo"
        >
          <div
            className="h-full rounded-full bg-season transition-all duration-500"
            style={{ width: `${Math.round(game.levelProgress * 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-content-soft">
          {game.intoLevel} / {game.forNext} XP hacia el siguiente nivel · {game.xp} XP en total
        </p>
      </div>
    </section>
  )
}
