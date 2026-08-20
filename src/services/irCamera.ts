const ROI = 48

type Session = {
  stream: MediaStream
  video: HTMLVideoElement
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

let session: Session | null = null

function frame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

async function waitForVideo(video: HTMLVideoElement) {
  const start = performance.now()
  while (video.videoWidth < 16 || video.videoHeight < 16) {
    if (performance.now() - start > 4000) throw new Error('Camera started but no frames arrived.')
    await frame()
  }
}

export async function startIrCamera() {
  if (session) return session.stream
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('This browser cannot access the camera, so infrared cannot be recorded.')
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 640 },
      height: { ideal: 480 },
      frameRate: { ideal: 60, min: 24 },
    },
  })

  const video = document.createElement('video')
  video.setAttribute('playsinline', 'true')
  video.setAttribute('webkit-playsinline', 'true')
  video.muted = true
  video.autoplay = true
  video.srcObject = stream
  await video.play()
  await waitForVideo(video)

  const canvas = document.createElement('canvas')
  canvas.width = ROI
  canvas.height = ROI
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    stopIrCamera()
    throw new Error('Could not read camera frames.')
  }

  session = { stream, video, canvas, ctx }
  return stream
}

export function attachIrPreview(el: HTMLVideoElement | null) {
  if (!el || !session) return
  el.srcObject = session.stream
  el.muted = true
  el.playsInline = true
  el.setAttribute('playsinline', 'true')
  void el.play().catch(() => undefined)
}

export function stopIrCamera() {
  if (!session) return
  for (const track of session.stream.getTracks()) track.stop()
  session.video.srcObject = null
  session = null
}

export function sampleIrLuma() {
  if (!session) return 0
  const { video, ctx } = session
  const vw = video.videoWidth
  const vh = video.videoHeight
  if (vw < 16 || vh < 16) return 0
  const side = Math.min(vw, vh) * 0.32
  const sx = (vw - side) / 2
  const sy = (vh - side) / 2
  ctx.drawImage(video, sx, sy, side, side, 0, 0, ROI, ROI)
  const data = ctx.getImageData(0, 0, ROI, ROI).data
  let sum = 0
  const n = ROI * ROI
  for (let i = 0; i < data.length; i += 4) {
    sum += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
  }
  return sum / n
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export class IrCaptureError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IrCaptureError'
  }
}

export async function waitForIrBurst(timeoutMs = 8000, abort?: AbortSignal) {
  if (!session) await startIrCamera()
  const samples: number[] = []
  const baselineBuf: number[] = []
  const startedAt = performance.now()

  while (baselineBuf.length < 14) {
    if (abort?.aborted) throw new IrCaptureError('Recording cancelled.')
    const luma = sampleIrLuma()
    if (luma > 0) baselineBuf.push(luma)
    await frame()
  }

  const baseline = median(baselineBuf)
  const threshold = baseline + Math.max(18, baseline * 0.22)
  let flashing = false
  let quietFrames = 0
  let burst: number[] = []

  while (performance.now() - startedAt < timeoutMs) {
    if (abort?.aborted) throw new IrCaptureError('Recording cancelled.')
    const luma = sampleIrLuma()
    samples.push(luma)

    if (!flashing) {
      if (luma >= threshold) {
        flashing = true
        burst = [luma]
        quietFrames = 0
      }
    } else {
      burst.push(luma)
      if (luma < threshold) quietFrames += 1
      else quietFrames = 0
      if (quietFrames >= 5 && burst.length >= 4) {
        const peak = Math.max(...burst)
        if (peak - baseline < 16) {
          flashing = false
          burst = []
          continue
        }
        return { baseline, threshold, peak, burst, samples }
      }
    }
    await frame()
  }

  throw new IrCaptureError(
    'No infrared flash seen. Point the remote LED straight at the camera, 3–8 cm away, then press the button.',
  )
}
