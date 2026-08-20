import { Header } from '../components/common/Header'
import { SceneCard, SceneExecution } from '../components/scenes/SceneCard'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function ScenesScreen() {
  const { scenes, runScene, executingSceneId, toggleSceneFavorite } = useStore()
  const running = scenes.find((s) => s.id === executingSceneId)

  return (
    <div className="page-scroll">
      <Header title="Scenes" />
      <PageContainer>
        <p className="mb-5 text-[15px] text-[#8e8e93]">Control several devices with one action.</p>
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

        <h2 className="mt-8 mb-3 text-[15px] font-medium text-[#8e8e93]">Smart Actions</h2>
        <div className="flex flex-col gap-2">
          <SmartAction title="Turn everything off" body="One tap power down." />
          <SmartAction title="Start movie setup" body="Living room cinema preset." />
          <SmartAction title="Prepare bedroom" body="Cool, quiet, lights low." />
        </div>
      </PageContainer>
      <SceneExecution open={Boolean(running)} name={running?.name ?? ''} />
    </div>
  )
}

function SmartAction({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-[#111113] px-4 py-4">
      <div className="text-[16px] font-medium">{title}</div>
      <div className="mt-1 text-[13px] text-[#8e8e93]">{body}</div>
    </div>
  )
}
