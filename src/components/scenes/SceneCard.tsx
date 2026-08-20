import type { Scene } from '../../types'
import { cn } from '../../lib/cn'
import { Wordmark } from '../common/Wordmark'

export function SceneCard({
  scene,
  running,
  onRun,
  onFavorite,
}: {
  scene: Scene
  running?: boolean
  onRun: () => void
  onFavorite: () => void
}) {
  return (
    <article className="rounded-[22px] bg-[#111113] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[18px] font-medium tracking-tight">{scene.name}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-[#8e8e93]">{scene.description}</p>
        </div>
        <button
          type="button"
          onClick={onFavorite}
          className={cn('text-[12px]', scene.favorite ? 'text-white' : 'text-[#636366]')}
          aria-label="Favorite scene"
        >
          ★
        </button>
      </div>
      <button
        type="button"
        onClick={onRun}
        disabled={running}
        className="mat focus-ring mt-4 h-12 w-full rounded-full text-[14px] font-medium"
      >
        {running ? 'Running…' : 'Run Scene'}
      </button>
    </article>
  )
}

export function SceneExecution({ open, name }: { open: boolean; name: string }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/70">
      <div className="text-center">
        <Wordmark className="pulse-soft text-[16px] text-white" />
        <div className="mt-3 text-[22px] font-medium tracking-tight">Running {name}</div>
      </div>
    </div>
  )
}
