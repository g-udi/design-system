import { EventCalendarAgendaView } from './EventCalendarAgendaView.jsx';
import { EventCalendarMonthView } from './EventCalendarMonthView.jsx';
import { EventCalendarResourceView } from './EventCalendarResourceView.jsx';
import {
  EventCalendarDaysView,
  EventCalendarDayView,
  EventCalendarWeekView
} from './EventCalendarTimeGrid.jsx';

// The built-in view for each view name; a plain module so the map stays readable on the server.
export const DEFAULT_VIEW_COMPONENTS = {
  month: EventCalendarMonthView,
  week: EventCalendarWeekView,
  day: EventCalendarDayView,
  days: EventCalendarDaysView,
  agenda: EventCalendarAgendaView,
  resource: EventCalendarResourceView
};
