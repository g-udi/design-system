/** Clamp a requested step into `0 … count - 1` (0 when there are no steps). */
export function clampStep(step, count) {
  if (!count || !Number.isFinite(step)) return 0;
  return Math.max(0, Math.min(Math.trunc(step), count - 1));
}
