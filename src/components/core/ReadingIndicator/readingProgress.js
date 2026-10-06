/** Percentage of a scroll range traversed. A fully visible range is already complete. */
export function readingProgress(position, start, end) {
  if (![position, start, end].every(Number.isFinite)) return 0;
  if (end <= start) return position >= start ? 100 : 0;
  return Math.round(Math.min(1, Math.max(0, (position - start) / (end - start))) * 1000) / 10;
}

export function clampReadingValue(value) {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}
