export function haptic(kind: 'light' | 'medium' | 'success' = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  if (kind === 'success') navigator.vibrate([8, 30, 12])
  else navigator.vibrate(kind === 'medium' ? 14 : 8)
}
