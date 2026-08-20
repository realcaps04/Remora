export function greeting(now = new Date()) {
  const hour = now.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function relativeTime(timestamp: number, now = Date.now()) {
  const delta = Math.max(0, now - timestamp)
  const minutes = Math.floor(delta / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes === 1) return 'Used 1 minute ago'
  if (minutes < 60) return `Used ${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours === 1) return 'Used 1 hour ago'
  if (hours < 24) return `Used ${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Used yesterday'
  return `Used ${days} days ago`
}

export function clockTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function isSameDay(a: number, b: number) {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}
