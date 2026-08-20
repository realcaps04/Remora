import { useEffect, useState, type ReactNode } from 'react'
import { ChevronLeft, Lightbulb, Package, SearchX, TriangleAlert } from 'lucide-react'
import type { FeedbackKind } from '../../types'
import { useStore } from '../../state/store'
import { BottomSheet } from '../layout/Primitives'
import { Button } from './Button'

const OPTIONS: {
  kind: FeedbackKind
  title: string
  hint: string
  Icon: typeof Lightbulb
}[] = [
  { kind: 'feature', title: 'New feature', hint: 'Suggest something Remora should add', Icon: Lightbulb },
  { kind: 'product', title: 'Product', hint: 'Request a device type, brand, or model', Icon: Package },
  { kind: 'missing', title: 'Missing', hint: 'A category, brand, or button isn’t here', Icon: SearchX },
  { kind: 'issue', title: 'Not working', hint: 'A remote or control isn’t working', Icon: TriangleAlert },
]

const COPY: Record<
  FeedbackKind,
  { title: string; blurb: string; subject: string; subjectPlaceholder: string; details: string; detailsPlaceholder: string }
> = {
  feature: {
    title: 'New feature',
    blurb: 'Tell us what you’d like Remora to do next.',
    subject: 'Feature',
    subjectPlaceholder: 'Widgets, widgets on lock screen…',
    details: 'How it should work',
    detailsPlaceholder: 'What it does, where it lives, why it helps',
  },
  product: {
    title: 'Request a product',
    blurb: 'This type or brand isn’t in Remora yet. We’ll treat it as ASAP.',
    subject: 'Product type',
    subjectPlaceholder: 'Fan, AC, projector…',
    details: 'What you need',
    detailsPlaceholder: 'Remote layout, connection, anything useful',
  },
  missing: {
    title: 'Something’s missing',
    blurb: 'Point us to the gap and we’ll fill it as soon as we can.',
    subject: 'What’s missing',
    subjectPlaceholder: 'Brand, model, button, category…',
    details: 'Where you expected it',
    detailsPlaceholder: 'Which screen, device, or remote',
  },
  issue: {
    title: 'Not working',
    blurb: 'Describe what fails so we can fix it.',
    subject: 'What’s broken',
    subjectPlaceholder: 'TV power, fan speed, pairing…',
    details: 'What happens',
    detailsPlaceholder: 'What you tried and what went wrong',
  },
}

export function RequestHubSheet({
  open,
  onClose,
  initialKind = null,
  initialSubject = '',
}: {
  open: boolean
  onClose: () => void
  initialKind?: FeedbackKind | null
  initialSubject?: string
}) {
  const { requestProduct } = useStore()
  const [kind, setKind] = useState<FeedbackKind | null>(null)
  const [subject, setSubject] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [details, setDetails] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!open) return
    setKind(initialKind)
    setSubject(initialSubject)
    setBrand('')
    setModel('')
    setDetails('')
    setSent(false)
  }, [open, initialKind, initialSubject])

  const copy = kind ? COPY[kind] : null

  return (
    <BottomSheet
      open={open}
      title={sent ? 'Request sent' : copy?.title ?? 'Request'}
      onClose={onClose}
    >
      {sent ? (
        <div className="pb-4 text-center">
          <p className="text-[16px] font-medium">We’ve got it</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#8e8e93]">
            Thanks — we’ll look at this as soon as possible.
          </p>
          <Button className="mt-5" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : kind && copy ? (
        <form
          className="flex flex-col gap-3 pb-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!subject.trim()) return
            requestProduct({ kind, productType: subject, brand, model, details })
            setSent(true)
          }}
        >
          <button
            type="button"
            onClick={() => setKind(null)}
            className="mb-1 flex items-center gap-1 self-start text-[13px] text-[#8e8e93]"
          >
            <ChevronLeft size={16} strokeWidth={1.8} />
            All options
          </button>
          <p className="text-[13px] leading-relaxed text-[#8e8e93]">{copy.blurb}</p>
          <Field label={copy.subject}>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={copy.subjectPlaceholder}
              className="h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
            />
          </Field>
          {kind === 'product' ? (
            <>
              <Field label="Brand">
                <input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand name"
                  className="h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
                />
              </Field>
              <Field label="Model / name">
                <input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Optional"
                  className="h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
                />
              </Field>
            </>
          ) : null}
          {kind === 'issue' ? (
            <Field label="Device (optional)">
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="TV, living room fan…"
                className="h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
              />
            </Field>
          ) : null}
          <Field label={copy.details}>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={copy.detailsPlaceholder}
              className="min-h-24 w-full resize-none rounded-2xl bg-[#1c1c1e] px-4 py-3 text-[15px] outline-none"
            />
          </Field>
          <Button type="submit">Submit request</Button>
        </form>
      ) : (
        <div className="flex flex-col gap-2 pb-3">
          <p className="mb-1 text-[13px] leading-relaxed text-[#8e8e93]">
            Feature, product, missing item, or something that isn’t working.
          </p>
          {OPTIONS.map(({ kind: option, title, hint, Icon }) => (
            <button
              key={option}
              type="button"
              onClick={() => setKind(option)}
              className="flex items-center gap-3 rounded-2xl bg-[#1c1c1e] px-3.5 py-3.5 text-left active:scale-[0.99]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/8 text-white">
                <Icon size={18} strokeWidth={1.7} />
              </span>
              <span className="min-w-0">
                <span className="block text-[15px] font-medium tracking-tight">{title}</span>
                <span className="mt-0.5 block text-[12px] text-[#8e8e93]">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </BottomSheet>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[#8e8e93]">{label}</span>
      {children}
    </label>
  )
}
