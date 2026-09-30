// Composition exports
export { GANTT_COLORS, GanttBar, useGanttBarContext } from './parts/gantt-bar-extended.jsx';
export { cancelActiveGanttGestures, GANTT_ACTIVATION, markGestureEnd, useGanttGestures, useGanttGestureTeardown, wasRecentDrag } from './parts/gantt-dnd-extended.jsx';
export { DEFAULT_GANTT_I18N, mergeGanttI18n } from './parts/gantt-i18n-extended.jsx';
export { buildDependencyPath, buildEventIndex, defaultEventOrder, eventsOverlap, findResource, flattenResources, getBaselineVariance, getDayKey, getDayTotalMinutes, getGanttDateRange, getLaneKey, getRangeKey, MIN_PACK_SLOT, occurrenceIntersects, packTimedSegments, rangesIntersect, reorderResources, resolveEventBaseline, resolveOffDay, snapMinutes, spansMultipleDays, stepGanttDate, toZoned, zonedStartOfDay } from './parts/gantt-lib-extended.jsx';
export { GANTT_SCALES, GanttDatePicker, GanttNav, GanttNavNext, GanttNavPrev, GanttNavToday, GanttScaleSwitcher, GanttTitle, GanttToolbar } from './parts/gantt-nav-extended.jsx';
export { GanttRecurrenceError, expandRecurrence, formatRRuleString, MAX_OCCURRENCES, parseRRuleString } from './parts/gantt-recurrence-extended.jsx';
export { GanttView } from './parts/gantt-view-extended.jsx';
export { DEFAULT_ROW_ALIGN, DEFAULT_SCHEDULE_MODE, DEFAULT_VIEW_CONFIG, Gantt, GanttContext, GanttViewConfigContext, resolveScheduleMode, resolveTimelineLines, useGantt, useGanttInteractions, useGanttNavigation, useGanttNodeSchedules, useGanttOccurrences, useGanttScale, useGanttSelection, useGanttSelector, useGanttSettings, useGanttSettingsVersion, useGanttState, useGanttViewConfig } from './parts/gantt-extended.jsx';
