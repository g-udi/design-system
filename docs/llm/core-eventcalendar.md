# EventCalendar

> Core/EventCalendar · core · `@gaudi/design-system/core/EventCalendar`

Schedule events across day, week, month, agenda and resource views.

## Import

```js
import { EventCalendar } from '@gaudi/design-system/core/EventCalendar';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ALL_VIEWS`, `BASE_VIEWS`, `DEFAULT_EVENT_CALENDAR_I18N`, `DEFAULT_VIEW_COMPONENTS`, `DEFAULT_VIEW_CONFIG`, `EVENT_CALENDAR_ACTIVATION`, `EVENT_CALENDAR_COLORS`, `EVENT_CALENDAR_FADE_TRUNCATE`, `EVENT_CALENDAR_GHOST`, `EVENT_CALENDAR_SLOT_DRAFT`, `EVENT_TRACK_WIDTH`, `EventCalendar`, `EventCalendarAgendaView`, `EventCalendarContent`, `EventCalendarContext`, `EventCalendarDatePicker`, `EventCalendarDayView`, `EventCalendarDaysView`, `EventCalendarEvent`, `EventCalendarMonthView`, `EventCalendarMoreIndicator`, `EventCalendarNav`, `EventCalendarNavNext`, `EventCalendarNavPrev`, `EventCalendarNavToday`, `EventCalendarNowIndicator`, `EventCalendarRecurrenceError`, `EventCalendarResourceView`, `EventCalendarTimeGrid`, `EventCalendarTimeGutter`, `EventCalendarTitle`, `EventCalendarToolbar`, `EventCalendarViewConfigContext`, `EventCalendarViewContext`, `EventCalendarViewSwitcher`, `EventCalendarWeekView`, `MAX_OCCURRENCES`, `MIN_PACK_SLOT`, `buildEventIndex`, `cancelActiveEventCalendarGestures`, `defaultEventOrder`, `eventsOverlap`, `expandRecurrence`, `flattenResources`, `formatRRuleString`, `getDayKey`, `getDayTotalMinutes`, `getRangeKey`, `getViewDateRange`, `isBarOccurrence`, `markChipPress`, `mergeEventCalendarI18n`, `minuteBlockStyle`, `packTimedSegments`, `packWeekRowLanes`, `parseRRuleString`, `rangesIntersect`, `resolveOffDay`, `segmentOccurrence`, `snapMinutes`, `spansMultipleDays`, `stepDate`, `toZoned`, `useEventCalendar`, `useEventCalendarDay`, `useEventCalendarEventChip`, `useEventCalendarGestures`, `useEventCalendarInteractions`, `useEventCalendarNavigation`, `useEventCalendarOccurrences`, `useEventCalendarSelection`, `useEventCalendarSelector`, `useEventCalendarSettings`, `useEventCalendarSettingsVersion`, `useEventCalendarState`, `useEventCalendarView`, `useEventCalendarViewConfig`, `useEventCalendarViewContext`, `useEventCalendarViewSettings`, `useEventCalendarWeek`, `useNow`, `wasRecentChipPress`, `wasRecentDrag`, `zonedStartOfDay`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `calendar` | `EventCalendar instance` | — | no | Adopt a state instance created by useEventCalendarState. |
| `events / defaultEvents / onEventsChange` | `Event[] / function` | — | no | Controlled or initial events and updates. |
| `view / defaultView / onViewChange` | `string / function` | — | no | Active calendar view. |
| `date / defaultDate / onDateChange` | `Date / function` | — | no | Calendar navigation date. |
| `timeZone` | `string` | — | no | Date interpretation and localized labels. |
| `locale` | `Locale` | — | no | Date interpretation and localized labels. |
| `resources` | `Resource[]` | `[]` | no | Resource rows or columns. |
| `slotDuration / snapDuration` | `number` | `30 / 15` | no | Visible and drag increments in minutes. |
| `apiRef` | `MutableRefObject` | — | no | Imperative calendar API. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { useState } from 'react';
import { EventCalendar, EventCalendarNav, EventCalendarContent } from '@gaudi/design-system/core/EventCalendar';

const resources = [{ id: 'design', title: 'Design team' }];
const initialEvents = [{ id: 'review', title: 'Design review', resourceId: 'design', start: new Date(2026, 9, 5, 9, 15), end: new Date(2026, 9, 5, 10) }];

export function CalendarExample() {
  const [events, setEvents] = useState(initialEvents);
  return <EventCalendar events={events} onEventsChange={setEvents} resources={resources} defaultDate={new Date(2026, 9, 5)} defaultView='week' className='h-150'><EventCalendarNav /><EventCalendarContent /></EventCalendar>;
}
```

## Accessibility

Keep event titles and times readable, provide keyboard alternatives to dragging, and announce changes through host feedback.

## Notes

- When calendar is supplied, configure options on that instance; option props on EventCalendar are ignored.

## Examples

- Playground (Storybook `core-eventcalendar--playground`)

Curated patterns:

- All views with live settings — registry item `@gaudi/event-calendar-all-views` (uses `AvatarFallback`, `AvatarRoot`, `Button`, `CardContent`, `CardRoot`, `EventCalendar`, `EventCalendarContent`, `EventCalendarNav`, `EventCalendarToolbar`, `Label`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`)
- Custom event chips — registry item `@gaudi/event-calendar-custom-chips` (uses `Button`, `CardContent`, `CardRoot`, `EventCalendar`, `EventCalendarContent`, `EventCalendarNav`, `EventCalendarToolbar`, `RegistryIcon`)
- Drag-to-book appointments — registry item `@gaudi/event-calendar-drag-to-book` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `CardContent`, `CardRoot`, `EventCalendar`, `EventCalendarContent`, `EventCalendarNav`, `EventCalendarToolbar`, `RegistryIcon`)
- Create and edit dialog — registry item `@gaudi/event-calendar-edit-dialog` (uses `Button`, `CardContent`, `CardRoot`, `DialogClosePrimitive`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `EventCalendar`, `EventCalendarContent`, `EventCalendarNav`, `EventCalendarToolbar`, `FieldGroup`, `FieldInput`, `FieldLabelPrimitive`, `FieldRoot`, `RadioGroup`, `RegistryIcon`, `SelectContent`, `SelectItem`, `SelectRoot`, `SelectTrigger`, `SelectValue`, `SwitchRoot`)
- Resource view for room bookings — registry item `@gaudi/event-calendar-room-resources` (uses `Button`, `CardContent`, `CardRoot`, `EventCalendar`, `EventCalendarContent`, `EventCalendarNav`, `EventCalendarToolbar`, `RegistryIcon`)

## Related

`core-calendar`

## README

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
- Week and resource columns keep a readable minimum width and scroll horizontally inside the calendar. `scrollMode='page'` lets the schedule grow vertically with the page; the default `contained` mode scrolls within the supplied height. `scrollbars='native'` selects browser scrollbars for a contained schedule.
- With the default automatic event limit, narrow month cells show an event count that opens the existing detail popover. Wider cells show event chips directly; an explicit `maxEventsPerCell` remains authoritative.
- `recurrence` repeats an event daily, weekly, monthly or yearly (`FREQ`, `INTERVAL`, `COUNT`, `UNTIL`, `BYDAY`, `BYMONTHDAY`, `BYMONTH`, `WKST`), with excluded and extra dates. `parseRRuleString` and `formatRRuleString` convert RRULE text. Gantt uses the same engine.

### Accessibility

Navigation buttons are labelled, and the month view is a grid with column and row headers. Every visible string, including button labels and date formats, comes from `i18n`.
