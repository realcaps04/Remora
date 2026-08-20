import { Header } from '../components/common/Header'
import { SceneCard, SceneExecution } from '../components/scenes/SceneCard'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function ScenesScreen() {
  const { scenes, runScene, executingSceneId, toggleSceneFavorite, push } = useStore()
  const running = scenes.find((s) => s.id === executingSceneId)

  return (
    <div className="page-scroll">
      <Header title="Scenes" />
      <PageContainer>
        <p className="mb-5 text-[15px] text-[#8e8e93]">Control several devices with one action.</p>
        {scenes.length === 0 ? (
          <div className="rounded-[22px] bg-[#111113] px-4 py-5">
            <div className="text-[16px] font-medium">No scenes yet</div>
            <p className="mt-1 text-[13px] text-[#8e8e93]">Add devices first, then group them into a scene.</p>
            <button
              type="button"
              onClick={() => push({ name: 'devices' })}
              className="mt-4 h-11 w-full rounded-full bg-white text-[14px] font-medium text-black"
            >
              Add Device
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {scenes.map((scene) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                running={executingSceneId === scene.id}
                onRun={() => runScene(scene.id)}
                onFavorite={() => toggleSceneFavorite(scene.id)}
              />
            ))}
          </div>
        )}
      </PageContainer>
      <SceneExecution open={Boolean(running)} name={running?.name ?? ''} />
    </div>
  )
}
