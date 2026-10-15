/*
 * Gesture timing shared by the EventCalendar drag engine and its chips. A plain module, so
 * server components read these values and helpers rather than client references.
 */
import { endedRecently, POINTER_DRAG_ACTIVATION } from '../shared/pointerDrag.js';

export const EVENT_CALENDAR_ACTIVATION = {
  ...POINTER_DRAG_ACTIVATION,
  createDistancePx: 4,
  autoScrollEdgePx: 48,
  autoScrollMaxStepPx: 15
};

let lastGestureEndedAt = 0;
export function markEventCalendarGestureEnd() {
  lastGestureEndedAt = performance.now();
}
export function wasRecentDrag() {
  return endedRecently(lastGestureEndedAt);
}
let lastChipPressAt = 0;
export function markChipPress() {
  lastChipPressAt = performance.now();
  window.addEventListener(
    'pointerup',
    () => {
      lastChipPressAt = performance.now();
    },
    { once: true, capture: true }
  );
}
export function wasRecentChipPress() {
  return performance.now() - lastChipPressAt < 300;
}
// Cancels for in-flight gestures, so a teardown can end every drag at once.
export const activeGestureCancels = new Set();
export function cancelActiveEventCalendarGestures() {
  for (const cancel of [...activeGestureCancels]) cancel();
}
