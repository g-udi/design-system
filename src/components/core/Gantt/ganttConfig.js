/*
 * Gantt's scales, palette, scheduling defaults and view-config defaults, kept out of the
 * client modules so server components read the values rather than client references.
 */
import { EVENT_CALENDAR_COLORS } from '../EventCalendar/eventCalendarStyles.js';

export const GANTT_SCALES = ['day', 'week', 'month', 'quarter', 'year'];
// Bars share EventCalendar's event palette.
export const GANTT_COLORS = EVENT_CALENDAR_COLORS;
export const DEFAULT_SCHEDULE_MODE = 'multiple';
export const DEFAULT_ROW_ALIGN = 'start';
export function resolveScheduleMode(node, scheduleMode) {
  return node?.scheduleMode ?? scheduleMode ?? DEFAULT_SCHEDULE_MODE;
}

export function resolveTimelineLines(value) {
  if (value === 'none') return { vertical: null, horizontal: null };
  if (value === 'vertical') return { vertical: 'solid', horizontal: null };
  if (value === 'both' || value === void 0) {
    return { vertical: 'solid', horizontal: 'solid' };
  }
  const stroke = (line) =>
    line === false ? null : line === true || line === void 0 ? 'solid' : line;
  return {
    vertical: stroke(value.vertical),
    horizontal: stroke(value.horizontal)
  };
}

export const DEFAULT_VIEW_CONFIG = {
  nowIndicator: true,
  interval: 60,
  scrollbars: 'custom',
  displayScheduleHint: false,
  initialCenter: 'now',
  displayCreateTaskHint: false,
  dragCreate: false,
  zoomControl: true,
  wheelZoom: true,
  navButtonVariant: 'ghost',
  navButtonSize: 'sm',
  timelineLines: 'vertical',
  barLabel: 'inside',
  offscreenIndicators: true,
  infiniteScroll: true,
  stickyNav: false,
  rowCheckboxes: true,
  parentScheduling: false,
  summaryBars: true,
  baselineBars: true,
  dependencyLines: true,
  scheduleMode: 'multiple',
  rowAlign: 'start'
};
