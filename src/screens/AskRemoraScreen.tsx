import { useState } from 'react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function AskRemoraScreen() {
  const { back } = useStore()
  const [query, setQuery] = useState('')

  return (
    <div className="page-scroll">
      <Header title="Ask Remora" onBack={back} />
      <PageContainer>
        <p className="text-[15px] text-[#8e8e93]">
          A future control assistant. Ask for a setup once devices are connected.
        </p>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask Remora…"
          className="mt-5 min-h-28 w-full resize-none rounded-2xl bg-[#111113] px-4 py-3 text-[15px] outline-none placeholder:text-[#636366]"
        />
        <Button className="mt-4" disabled={!query.trim()}>
          Ask
        </Button>
      </PageContainer>
    </div>
  )
}
