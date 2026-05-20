/** Format a unix timestamp into a human label relative to "now". */
export function relativeTime(ts: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const min = 60_000;
  const hr  = 60 * min;
  const day = 24 * hr;

  if (diff < min)        return 'Just now';
  if (diff < hr)         return `${Math.floor(diff / min)}m ago`;
  if (diff < day)        return `${Math.floor(diff / hr)}h ago`;
  if (diff < 7 * day)    return `${Math.floor(diff / day)}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Bucket a timestamp into a coarse group used by Recent Chats. */
export function dateBucket(ts: number, now: number = Date.now()): string {
  const day = 86_400_000;
  const diff = now - ts;
  if (diff < day)        return 'Today';
  if (diff < 2 * day)    return 'Yesterday';
  if (diff < 7 * day)    return 'This week';
  if (diff < 30 * day)   return 'This month';
  return 'Earlier';
}
