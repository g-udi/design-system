// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { format, isSameMonth, isSameYear, subMilliseconds } from 'date-fns';
const DEFAULT_LABELS = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  addEvent: 'Add event',
  allDay: 'All day',
  more: (count) => `+${count} more`,
  noEvents: 'No events',
  loading: 'Loading events',
  event: 'event',
  events: (count) => (count === 1 ? '1 event' : `${count} events`),
  selectView: 'Select view',
  week: (weekNumber) => `W${weekNumber}`,
  resources: 'Resources',
  goToDate: 'Go to date',
  dropNotAllowed: "Can't place here",
  continues: 'continues',
  timeFrom: (time) => `From ${time}`,
  timeUntil: (time) => `Until ${time}`,
  viewShortcuts: {
    month: 'M',
    week: 'W',
    day: 'D',
    days: '5',
    agenda: 'A',
    resource: 'G'
  },
  toggleDayEvents: (count) => (count === 1 ? '1 event' : `${count} events`),
  eventDetails: (title) => title,
  moreCompact: (count) => `+${count}`,
  timeRange: (from, to) => `${from} - ${to}`
};
const DEFAULT_VIEW_NAMES = {
  month: 'Month',
  week: 'Week',
  day: 'Day',
  days: (count) => (count === 1 ? '1 day' : `${count} days`),
  agenda: 'Agenda',
  resource: 'Time Grid'
};
const DEFAULT_FORMATS = {
  monthTitle: 'MMMM yyyy',
  weekTitle: void 0,
  dayTitle: 'EEEE, MMMM d, yyyy',
  agendaTitle: void 0,
  monthDayHeader: 'EEE',
  monthDayHeaderNarrow: 'EEEEE',
  timeGridDayHeader: 'EEE d',
  agendaDayHeader: 'EEEE, MMMM d',
  agendaDayNumber: 'd',
  agendaWeekday: 'EEE',
  moreDayHeader: 'EEEE, MMMM d',
  monthCellAriaLabel: 'PPPP',
  dayAria: 'PPPP',
  resourceTitle: void 0,
  timeGutter: 'h a',
  timeGutterMinute: 'h:mm a',
  eventTime: 'h:mm a',
  monthCellDay: 'd'
};
function makeDefaultFunctions(cfg) {
  return {
    formatTitle: (view, { date, activeRange, locale }) => {
      const opts = { locale };
      if (view === 'month') {
        return format(date, cfg.formats.monthTitle, opts);
      }
      if (view === 'resource') {
        return format(
          date,
          cfg.formats.resourceTitle ?? cfg.formats.dayTitle,
          opts
        );
      }
      if (view === 'day') {
        return format(date, cfg.formats.dayTitle, opts);
      }
      if (view === 'week' && cfg.formats.weekTitle) {
        return format(date, cfg.formats.weekTitle, opts);
      }
      if (view === 'agenda' && cfg.formats.agendaTitle) {
        return format(date, cfg.formats.agendaTitle, opts);
      }
      const rangeEnd = subMilliseconds(activeRange.end, 1);
      const start = activeRange.start;
      if (isSameMonth(start, rangeEnd)) {
        return `${format(start, 'MMMM d', opts)} - ${format(rangeEnd, 'd, yyyy', opts)}`;
      }
      if (isSameYear(start, rangeEnd)) {
        return `${format(start, 'MMM d', opts)} - ${format(rangeEnd, 'MMM d, yyyy', opts)}`;
      }
      return `${format(start, 'MMM d, yyyy', opts)} - ${format(rangeEnd, 'MMM d, yyyy', opts)}`;
    },
    formatEventTime: (start, end, allDay, opts) => {
      if (allDay) return cfg.labels.allDay;
      const fmt = cfg.formats.eventTime;
      const lastInstant =
        end.getTime() - 1 >= start.getTime() ? subMilliseconds(end, 1) : start;
      if (format(start, 'yyyy-MM-dd') !== format(lastInstant, 'yyyy-MM-dd')) {
        return `${format(start, `MMM d, ${fmt}`, opts)} - ${format(end, `MMM d, ${fmt}`, opts)}`;
      }
      return `${format(start, fmt, opts)} - ${format(end, fmt, opts)}`;
    },
    formatDayRange: (range, opts) => {
      const rangeEnd = subMilliseconds(range.end, 1);
      return `${format(range.start, 'MMM d', opts)} - ${format(rangeEnd, 'MMM d', opts)}`;
    }
  };
}
const DEFAULT_EVENT_CALENDAR_I18N = {
  labels: DEFAULT_LABELS,
  viewNames: DEFAULT_VIEW_NAMES,
  formats: DEFAULT_FORMATS,
  functions: makeDefaultFunctions({
    labels: DEFAULT_LABELS,
    formats: DEFAULT_FORMATS
  })
};
function mergeEventCalendarI18n(overrides) {
  if (!overrides) return DEFAULT_EVENT_CALENDAR_I18N;
  const labels = { ...DEFAULT_LABELS, ...overrides.labels };
  const viewNames = { ...DEFAULT_VIEW_NAMES, ...overrides.viewNames };
  const formats = { ...DEFAULT_FORMATS, ...overrides.formats };
  return {
    labels,
    viewNames,
    formats,
    functions: {
      ...makeDefaultFunctions({ labels, formats }),
      ...overrides.functions
    }
  };
}
export { DEFAULT_EVENT_CALENDAR_I18N, mergeEventCalendarI18n };
