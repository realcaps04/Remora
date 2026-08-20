import { Header } from '../components/common/Header'
import { clockTime, isSameDay } from '../lib/format'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function ActivityScreen() {
  const { activity } = useStore()
  const now = Date.now()
  const today = activity.filter((e) => isSameDay(e.timestamp, now))
  const earlier = activity.filter((e) => !isSameDay(e.timestamp, now))

  return (
    <div className="page-scroll">
      <Header title="Activity" />
      <PageContainer>
        <Group title="Today" items={today} />
        <Group title="Earlier" items={earlier} />
        {activity.length === 0 ? (
          <p className="pt-8 text-[15px] text-[#8e8e93]">No activity yet. Controls you use will appear here.</p>
        ) : null}
      </PageContainer>
    </div>
  )
}

function Group({
  title,
  items,
}: {
  title: string
  items: { id: string; message: string; timestamp: number }[]
}) {
  if (items.length === 0) return null
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-[13px] tracking-wide text-[#8e8e93]">{title}</h2>
      <ol className="relative border-l border-white/10 pl-5">
        {items.map((item) => (
          <li key={item.id} className="mb-5">
            <span className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-white/50" />
            <div className="text-[15px] font-medium tracking-tight">{item.message}</div>
            <div className="mt-1 text-[12px] text-[#8e8e93]">{clockTime(item.timestamp)}</div>
          </li>
        ))}
      </ol>
    </section>
  )
}
