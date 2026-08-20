import { useState } from 'react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function AskRemoraScreen() {
  const { back, runScene } = useStore()
  const [query, setQuery] = useState('Set up the living room for a movie.')
  const [result, setResult] = useState(false)

  return (
    <div className="page-scroll">
      <Header title="Ask Remora" onBack={back} />
      <PageContainer>
        <p className="text-[15px] text-[#8e8e93]">
          A future control assistant. This preview only simulates a scene.
        </p>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-5 min-h-28 w-full resize-none rounded-2xl bg-[#111113] px-4 py-3 text-[15px] outline-none"
        />
        <Button
          className="mt-4"
          onClick={() => {
            setResult(true)
            void runScene('movie-night')
          }}
        >
          Ask
        </Button>

        {result ? (
          <div className="mt-6 rounded-2xl bg-[#111113] px-4 py-4 text-[14px] leading-7 text-[#d2d2d7]">
            <div>TV → On</div>
            <div>DTH → On</div>
            <div>Soundbar → On</div>
            <div>Lights → 20%</div>
            <div>Fan → Speed 2</div>
          </div>
        ) : null}
      </PageContainer>
    </div>
  )
}
