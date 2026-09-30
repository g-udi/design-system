# EventCalendar

A scheduling calendar with month, week, day, agenda and resource views, drag to move and resize, slot selection, recurring events and time zones. Use it for bookings and team schedules; use a Calendar to pick dates and a Gantt to plan work over weeks or months.

```jsx
import { EventCalendar, EventCalendarNav, EventCalendarContent } from '@gaudi/design-system';

<EventCalendar defaultEvents={events} defaultView='week' onEventsChange={save} className='h-[600px]'>
  <EventCalendarNav />
  <EventCalendarContent />
</EventCalendar>
```

- Events are `{ id, title, start, end, allDay?, color?, recurrence?, resourceId? }`. `EVENT_CALENDAR_COLORS` lists the offered colours.
- `defaultView` / `view` pick the view; `interactions` turns drag, resize and slot selection on or off; `apiRef` adds, updates and removes events from outside.
- `renderEvent` and `renderEventTooltip` customise chips. `timeZone`, `weekStartsOn`, `locale` and `i18n` localise every view.
- `recurrence` repeats an event daily, weekly, monthly or yearly (`FREQ`, `INTERVAL`, `COUNT`, `UNTIL`, `BYDAY`, `BYMONTHDAY`, `BYMONTH`, `WKST`), with excluded and extra dates. `parseRRuleString` and `formatRRuleString` convert RRULE text. Gantt uses the same engine.

## Accessibility

Navigation buttons are labelled, and the month view is a grid with column and row headers. Every visible string, including button labels and date formats, comes from `i18n`.
