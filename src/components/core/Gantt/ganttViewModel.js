import { MIN_PACK_SLOT } from './ganttModel.jsx';
function lowestFreeLane(segments, startMs, endMs) {
  const padMs = MIN_PACK_SLOT * 6e4;
  const to = Math.max(endMs, startMs + padMs);
  const busy = new Set();
  for (const segment of segments) {
    const segStart = segment.occurrence.start.getTime();
    const segEnd = Math.max(segment.occurrence.end.getTime(), segStart + padMs);
    if (segStart < to && segEnd > startMs) busy.add(segment.column ?? 0);
  }
  let lane = 0;
  while (busy.has(lane)) lane += 1;
  return lane;
}
function trackPoint(el, clientX) {
  const rect = el.getBoundingClientRect();
  const rtl = getComputedStyle(el).direction === 'rtl';
  const offset = rtl ? rect.right - clientX : clientX - rect.left;
  const snapped = rtl
    ? rect.right - Math.round(clientX)
    : Math.round(clientX) - rect.left;
  return {
    fraction: rect.width > 0 ? offset / rect.width : 0,
    offset: snapped
  };
}
function trackFraction(el, clientX) {
  return trackPoint(el, clientX).fraction;
}
const LANE_HEIGHT_REM = 1.25;
const LANE_GAP_REM = 0.1875;
const ROW_PADDING_REM = 0.5;
const GHOST_HEIGHT_REM = 1.25;
function laneTopRem(laneOffsetRem, lane, laneHeightRem, laneGapRem) {
  return laneOffsetRem + lane * (laneHeightRem + laneGapRem);
}
function laneBlockRem(count, laneHeightRem, laneGapRem) {
  return count * laneHeightRem + (count - 1) * laneGapRem;
}
const AUTO_LABEL_MIN_REM = 7;
const DEFAULT_COLUMN_WIDTH = 96;
const MIN_TIMELINE_WIDTH = 200;
const EMPTY_ID_SET = new Set();
function getPaneViewport(pane) {
  return pane?.querySelector('[data-slot=scroll-area-viewport]') ?? null;
}
function getScrollStart(viewport) {
  return Math.abs(viewport.scrollLeft);
}
function setScrollStart(viewport, value) {
  viewport.scrollLeft =
    getComputedStyle(viewport).direction === 'rtl' ? -value : value;
}
export { lowestFreeLane, trackPoint, LANE_HEIGHT_REM, LANE_GAP_REM, ROW_PADDING_REM, GHOST_HEIGHT_REM, laneTopRem, laneBlockRem, DEFAULT_COLUMN_WIDTH, MIN_TIMELINE_WIDTH, EMPTY_ID_SET, getPaneViewport, getScrollStart, setScrollStart, trackFraction, AUTO_LABEL_MIN_REM };
