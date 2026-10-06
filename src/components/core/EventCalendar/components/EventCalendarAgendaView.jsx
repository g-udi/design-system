'use client';
import { useMemo } from 'react';
import {
  EventCalendarViewContext,
  useEventCalendar,
  useEventCalendarSelector,
  useEventCalendarSettings,
  useEventCalendarViewConfig
} from '../EventCalendar.jsx';
import { EventCalendarEvent } from './EventCalendarEvent.jsx';
import {
  getDayKey,
  getRangeKey,
  toZoned,
  zonedStartOfDay
} from '../eventCalendarModel.jsx';
import { IconStack } from '../../Icon/IconStack.jsx';
import { addDays, format } from 'date-fns';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
import { ScrollArea } from '../../ScrollArea/ScrollArea.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
function EventCalendarAgendaView({ className, asChild = false, ...props }) {
  const instance = useEventCalendar();
  const settings = useEventCalendarSettings();
  const viewConfig = useEventCalendarViewConfig();
  const visibleRange = useEventCalendarSelector((state) => state.visibleRange, {
    isEqual: (a, b) => getRangeKey(a) === getRangeKey(b)
  });
  useEventCalendarSelector((state) => state.events);
  const days = useMemo(() => {
    const result = [];
    let cursor = zonedStartOfDay(visibleRange.start, settings.timeZone);
    while (cursor < visibleRange.end) {
      result.push(cursor);
      cursor = zonedStartOfDay(
        addDays(toZoned(cursor, settings.timeZone), 1),
        settings.timeZone
      );
    }
    return result;
  }, [visibleRange, settings.timeZone]);
  const index = instance.internals.getIndex();
  const groups = days
    .map((day) => ({
      day,
      bucket: index.byDay.get(getDayKey(day, settings.timeZone))
    }))
    .filter((group) => {
      const total =
        (group.bucket?.allDay.length ?? 0) + (group.bucket?.timed.length ?? 0);
      return total > 0;
    });
  const isToday = (day) =>
    getDayKey(day, settings.timeZone) ===
    getDayKey(new Date(), settings.timeZone);
  const native = viewConfig.scrollbars === 'native';
  const body = (
    <>
      {groups.length === 0 ? (
        <div
          data-slot='event-calendar-no-events'
          className={cn(
            'flex min-h-72 flex-col items-center justify-center gap-4 py-16',
            viewConfig.classNames?.noEvents
          )}
        >
          {viewConfig.renderNoEvents?.() ?? (
            <>
              <IconStack>
                <RegistryIcon
                  lucide='CalendarIcon'
                  className='size-5'
                  aria-hidden='true'
                />
              </IconStack>
              <span className='text-ui-muted-foreground text-sm'>
                {settings.i18n.labels.noEvents}
              </span>
            </>
          )}
        </div>
      ) : (
        // Drop the very last row's bottom border so it does not double up with
        // the calendar container's own bottom border. Targets the last day
        // group's last child (its last agenda item); per-item `border-b` is
        // kept everywhere else, including each day's internal rows.
        <div className='flex flex-col [&>*:last-child>*:last-child]:border-b-0'>
          {groups.map(({ day, bucket }) => {
            const items = [...(bucket?.allDay ?? []), ...(bucket?.timed ?? [])];
            const zoned = toZoned(day, settings.timeZone);
            const weekday = format(zoned, settings.i18n.formats.agendaWeekday, { locale: settings.locale });
            const dayDate = format(zoned, settings.i18n.formats.agendaDayHeader, {
              locale: settings.locale
            });
            return (
              <div
                key={day.getTime()}
                data-slot='event-calendar-agenda-day'
                data-today={isToday(day) || void 0}
                role='group'
                aria-label={`${weekday}, ${dayDate}, ${settings.i18n.labels.events(items.length)}`}
              >
                {/* Group header: weekday (leading) + full date (trailing) */}
                <div
                  data-slot='event-calendar-agenda-day-header'
                  role='heading'
                  aria-level={3}
                  className={cn(
                    'bg-ui-muted/60 sticky top-0 z-10 flex items-baseline justify-between gap-4 border-b px-4 py-2',
                    // The custom ScrollArea's overlay scrollbar (w-2.5 = 10px)
                    // is painted UNDER this sticky, z-10, opaque header, so the
                    // thumb vanishes behind the day bar at the top of the view.
                    // Inset the header by the scrollbar lane so its background
                    // stops before the scrollbar instead of covering it. Native
                    // scrollbars already sit outside the content box, so this
                    // only applies to the custom-scrollbar path.
                    !native && 'me-2.5',
                    viewConfig.classNames?.agendaDayHeader
                  )}
                >
                  {viewConfig.renderAgendaDayHeader?.({ day, segments: items, isToday: isToday(day) }) ?? <>
                  <span
                    className={cn(
                      'text-ui-foreground font-semibold',
                      isToday(day) && 'text-ui-primary'
                    )}
                  >
                    {weekday}
                  </span>
                  <span className='text-ui-muted-foreground font-medium tabular-nums'>
                    {dayDate}
                  </span>
                  </>}
                </div>
                {items.map((segment) => (
                  <EventCalendarAgendaItem
                    key={segment.occurrence.key}
                    segment={segment}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <EventCalendarViewContext.Provider value={{ view: 'agenda' }}>
      <Comp
        data-slot='event-calendar-agenda-view'
        data-view='agenda'
        role='group'
        aria-label={settings.i18n.functions.formatDayRange(visibleRange, {
          locale: settings.locale
        })}
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-hidden border-t',
          viewConfig.classNames?.agendaView,
          className
        )}
        {...props}
      >
        {native ? (
          <div
            data-slot='scroll-area-viewport'
            data-ec-native-scroll=''
            className='h-full overflow-y-auto'
          >
            {body}
          </div>
        ) : (
          <ScrollArea className='h-full'>{body}</ScrollArea>
        )}
      </Comp>
    </EventCalendarViewContext.Provider>
  );
}
function EventCalendarAgendaItem({ segment }) {
  const viewConfig = useEventCalendarViewConfig();
  return (
    <EventCalendarEvent
      segment={segment}
      className={cn(
        // read-only list: hover only, no selected/focused styling on click
        'hover:bg-ui-accent/40 gap-3 rounded-none border-b px-4 py-2.5 transition-colors',
        viewConfig.classNames?.agendaItem
      )}
    />
  );
}
export { EventCalendarAgendaView };
