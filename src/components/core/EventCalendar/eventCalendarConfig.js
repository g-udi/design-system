// EventCalendar's view names and view-config defaults, readable from server components.

export const BASE_VIEWS = ['month', 'week', 'day', 'days', 'agenda'];
export const ALL_VIEWS = [...BASE_VIEWS, 'resource'];

export const DEFAULT_VIEW_CONFIG = {
  scrollToHour: 7,
  nowIndicator: true,
  interval: 60,
  maxEventsPerCell: 'auto',
  showWeekNumbers: false,
  enableShortcuts: true,
  shortcutsScope: 'focus-within',
  scrollMode: 'contained',
  stickyNav: false,
  showDayAddButton: false,
  scrollbars: 'custom',
  navButtonVariant: 'ghost',
  navButtonSize: 'sm',
  dayCountPresets: [5],
  eventTooltip: false,
  compactEventMinutes: 45,
  morePopoverAlign: 'start',
  nowIndicatorInterval: 3e4
};
