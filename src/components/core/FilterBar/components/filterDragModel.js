import { endedRecently, POINTER_DRAG_ACTIVATION } from '../../shared/pointerDrag.js';

// Server-safe drag geometry, drop resolution and gesture bookkeeping for the filter row drag engine.
export const FILTER_DND_ACTIVATION = {
  ...POINTER_DRAG_ACTIVATION,
  autoScrollEdgePx: 40,
  autoScrollMaxStepPx: 12,
  /** A seed only: `createCarry` measures the real grab offset before paint. */
  carryPointerOffsetPx: 12
};

export const FILTER_ROW_SELECTOR = '[data-slot="filter-row"]';
export const FILTER_DROP_ZONE_SELECTOR = '[data-drop-parent]';

export const FILTER_GROUP_SELECTOR = '[data-slot="filter-group"]';
function contains(box, x, y, grow = 0) {
  return (
    x >= box.left &&
    x <= box.right &&
    y >= box.top - grow &&
    y <= box.bottom + grow
  );
}
export const FILTER_ROW_SEAM_PX = 6;

export function resolveFilterDrop(
  zones,
  rows,
  x,
  y,
  seam = FILTER_ROW_SEAM_PX
) {
  let zone = null;
  for (const candidate of zones) {
    if (!contains(candidate, x, y)) continue;
    if (!zone || candidate.depth > zone.depth) zone = candidate;
  }
  if (zone) return { target: zone, edge: null };
  let row = null;
  for (const candidate of rows) {
    if (!contains(candidate, x, y, seam)) continue;
    if (!row || candidate.depth > row.depth) row = candidate;
  }
  if (!row) return null;
  const after = y > row.top + (row.bottom - row.top) / 2;
  return {
    target: { ...row, index: row.index + (after ? 1 : 0) },
    edge: after ? 'after' : 'before'
  };
}
export function isFilterDropNoop(resolution, origin, copy) {
  if (!resolution || !origin || copy) return false;
  if (resolution.target.parentId !== origin.parentId) return false;
  return (
    resolution.target.index === origin.index ||
    resolution.target.index === origin.index + 1
  );
}
export const activeCancels = /* @__PURE__ */ new Set();

export function cancelActiveFilterDrags() {
  for (const cancel of [...activeCancels]) cancel();
}
let lastDragEndedAt = 0;

export function markFilterDragEnded() {
  lastDragEndedAt = performance.now();
}
export function wasRecentFilterDrag() {
  return endedRecently(lastDragEndedAt);
}
