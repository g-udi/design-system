// Private helpers shared by the hand-rolled pointer drag engines in FilterBar,
// EventCalendar and Gantt. Each engine keeps its own gesture state.

/** Activation thresholds common to every engine. */
export const POINTER_DRAG_ACTIVATION = {
  /** Mouse travel before a press becomes a drag. Below this it stays a click. */
  moveDistancePx: 5,
  /** Touch long-press before a drag starts, so a swipe still scrolls. */
  touchDelayMs: 250,
  touchTolerancePx: 5
};

/** How long after a drag ends its trailing click is still treated as part of it. */
const RECENT_DRAG_MS = 250;

/** True while `endedAt` (a `performance.now()` stamp) is within the trailing-click window. */
export function endedRecently(endedAt) {
  return performance.now() - endedAt < RECENT_DRAG_MS;
}

/** Rounds to the device pixel grid so a carried element stays crisp. */
export function snapToPixel(value) {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  return Math.round(value * dpr) / dpr;
}
