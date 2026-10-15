/*
 * Gesture timing shared by the Gantt drag engine, bars, rows and viewport. A plain module, so
 * server components read these values and helpers rather than client references.
 */
import { endedRecently, POINTER_DRAG_ACTIVATION } from '../shared/pointerDrag.js';

export const GANTT_ACTIVATION = {
  ...POINTER_DRAG_ACTIVATION,
  createDistancePx: 4
};

let lastGestureEndedAt = 0;
export function wasRecentDrag() {
  return endedRecently(lastGestureEndedAt);
}
export function markGestureEnd() {
  lastGestureEndedAt = performance.now();
}
const activeGestureCancels = new Set();
export function registerGanttGestureCancel(cancel) {
  activeGestureCancels.add(cancel);
  return () => activeGestureCancels.delete(cancel);
}
export function cancelActiveGanttGestures() {
  for (const cancel of [...activeGestureCancels]) cancel();
}
