// Composition exports
export { GanttBar, useGanttBarContext } from './components/GanttBar.jsx';
export { useGanttGestures, useGanttGestureTeardown } from './components/GanttDnd.jsx';
export { cancelActiveGanttGestures, GANTT_ACTIVATION, markGestureEnd, wasRecentDrag } from './ganttGestures.js';
export { DEFAULT_ROW_ALIGN, DEFAULT_SCHEDULE_MODE, DEFAULT_VIEW_CONFIG, GANTT_COLORS, GANTT_SCALES, resolveScheduleMode, resolveTimelineLines } from './ganttConfig.js';
export { DEFAULT_GANTT_I18N, mergeGanttI18n } from './ganttLabels.jsx';
export { buildDependencyPath, buildEventIndex, checkDependencies, defaultEventOrder, eventsOverlap, findResource, flattenResources, getBaselineVariance, getCriticalPath, getDayKey, getDayTotalMinutes, getGanttDateRange, getLaneKey, getRangeKey, MIN_PACK_SLOT, occurrenceIntersects, packTimedSegments, rangesIntersect, reorderResources, resolveEventBaseline, resolveOffDay, snapMinutes, spansMultipleDays, stepGanttDate, toZoned, zonedStartOfDay } from './ganttModel.jsx';
export { GanttDatePicker, GanttNav, GanttNavNext, GanttNavPrev, GanttNavToday, GanttScaleSwitcher, GanttTitle, GanttToolbar } from './components/GanttNav.jsx';
export { GanttRecurrenceError, expandRecurrence, formatRRuleString, MAX_OCCURRENCES, parseRRuleString } from './ganttRecurrence.jsx';
export { GanttView } from './components/GanttView.jsx';
export { Gantt, GanttContext, GanttViewConfigContext, useGantt, useGanttInteractions, useGanttNavigation, useGanttNodeSchedules, useGanttOccurrences, useGanttScale, useGanttSelection, useGanttSelector, useGanttSettings, useGanttSettingsVersion, useGanttState, useGanttViewConfig } from './Gantt.jsx';
