import { useEffect, useState } from 'react'
import { Button } from './Button'
import { BottomSheet } from '../layout/Primitives'
import { useStore } from '../../state/store'

export function RequestProductSheet({
  open,
  query,
  onClose,
}: {
  open: boolean
  query: string
  onClose: () => void
}) {
  const { requestProduct } = useStore()
  const [productType, setProductType] = useState(query)
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [details, setDetails] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!open) return
    setProductType(query)
    setBrand('')
    setModel('')
    setDetails('')
    setSent(false)
  }, [open, query])

  return (
    <BottomSheet open={open} title="Request a product" onClose={onClose}>
      {sent ? (
        <div className="pb-4 text-center">
          <p className="text-[16px] font-medium">Request sent</p>
          <p className="mt-2 text-[14px] leading-relaxed text-[#8e8e93]">
            We’ll add this product type as soon as possible.
          </p>
          <Button className="mt-5" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form
          className="flex flex-col gap-3 pb-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (!productType.trim()) return
            requestProduct({ productType, brand, model, details })
            setSent(true)
          }}
        >
          <p className="text-[13px] leading-relaxed text-[#8e8e93]">
            This category or name isn’t in Remora yet. Tell us what you need and we’ll treat it as ASAP.
          </p>
          <span className="self-start rounded-full bg-white/10 px-2.5 py-1 text-[11px] tracking-wide text-white">
            ASAP
          </span>
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-[#8e8e93]">Product type</span>
            <input
              required
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="Fan, AC, projector…"
              className="h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-[#8e8e93]">Brand</span>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Brand name"
              className="h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-[#8e8e93]">Model / name</span>
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Optional"
              className="h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] text-[#8e8e93]">What you need</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Remote layout, connection, anything useful"
              className="min-h-24 w-full resize-none rounded-2xl bg-[#1c1c1e] px-4 py-3 text-[15px] outline-none"
            />
          </label>
          <Button type="submit">Submit request ASAP</Button>
        </form>
      )}
    </BottomSheet>
  )
}

export function RequestProductCard({
  query,
  onClick,
}: {
  query: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 w-full rounded-[22px] bg-[#111113] px-4 py-4 text-left active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[16px] font-medium tracking-tight">Request this product type</div>
          <p className="mt-1 text-[13px] text-[#8e8e93]">
            “{query}” isn’t available yet. Send a request and we’ll add it ASAP.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] tracking-wide">ASAP</span>
      </div>
    </button>
  )
}
