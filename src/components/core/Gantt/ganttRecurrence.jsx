// Gantt expands recurring bars with the EventCalendar recurrence engine, so both read RRULEs the same way.
export {
  EventCalendarRecurrenceError as GanttRecurrenceError,
  expandRecurrence,
  formatRRuleString,
  MAX_OCCURRENCES,
  parseRRuleString
} from '../EventCalendar/eventCalendarRecurrence.jsx';
